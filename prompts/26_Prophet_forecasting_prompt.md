# 📌 **Prophet 기반 테슬라(TSLA) 주가 예측 프롬프트**

이 문서는 GPT를 활용하여 **Prophet**을 이용한 시계열 예측 코드를 자동 생성할 수 있도록 도와줍니다.
아래 프롬프트를 GPT에 입력하면, Prophet 기반 TSLA 종가 예측 코드를 쉽게 생성할 수 있습니다. 📈

---

## 🛠️ 1. 라이브러리 불러오기 & 환경 준비

`prophet`(구 `fbprophet`)과 `yfinance`, `pandas`, `numpy`, `matplotlib`, `plotly` 등을 사용해줘.
Colab/로컬 모두 동작하도록 설치 코드도 포함해줘.

### 📌 예제 코드

```python
# (Colab/로컬 공통) 필요한 패키지 설치
# !pip install -q prophet yfinance plotly

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import yfinance as yf
from prophet import Prophet
from prophet.diagnostics import cross_validation, performance_metrics
from sklearn.metrics import mean_absolute_error, mean_squared_error
import warnings
warnings.filterwarnings("ignore")
plt.rcParams["figure.figsize"] = (12,5)
```

---

## 📊 2. 테슬라(TSLA) 주가 데이터 다운로드 및 시각화

* `yfinance`로 최근 **2년치** 일봉 데이터를 가져와줘.
* 종가(`Close`) 기준으로 시각화 그래프를 그려줘.

### 📌 예제 코드

```python
import yfinance as yf
import pandas as pd

# 1) TSLA 다운로드 - 컬럼을 단일 레벨로 강제(group_by='column')
df = yf.download(
    "TSLA",
    period="2y",
    interval="1d",
    group_by="column",   # <- 중요: 컬럼을 Open/High/Low/Close 단일 레벨로
    auto_adjust=False,
    actions=False,
    progress=False,
)

# 2) 방어 코드: 빈 DF면 중단
if df is None or df.empty:
    raise RuntimeError("yfinance가 빈 데이터를 반환했습니다. 네트워크/기간/인터벌을 확인하세요.")

# 3) 혹시라도 MultiIndex가 남아있으면 평탄화
if isinstance(df.columns, pd.MultiIndex):
    df.columns = ["_".join([str(c) for c in col if c]) for col in df.columns]

# 4) Close 컬럼 확보 (예: 'TSLA_Close' 같은 이름도 커버)
close_candidates = [c for c in df.columns if c.lower().endswith("close")]
if not close_candidates:
    # 대안 경로: Ticker API 사용
    alt = yf.Ticker("TSLA").history(period="2y", interval="1d")
    if alt is None or alt.empty or "Close" not in alt.columns:
        raise KeyError(f"'Close' 컬럼을 찾지 못했습니다. 현재 컬럼: {list(df.columns)}")
    df = alt.copy()
    close_col = "Close"
else:
    close_col = close_candidates[0]

# 5) 최종 표준화: 반드시 'Close' 단일 컬럼을 보장
df = df.rename(columns={close_col: "Close"})
df = df[["Close"]].dropna().copy()
df.index = pd.to_datetime(df.index).tz_localize(None)  # Prophet 호환용 tz 제거

# (선택) 시각화
import matplotlib.pyplot as plt
plt.figure(figsize=(12,5))
plt.plot(df.index, df["Close"], label="Tesla Close", color="black")
plt.title("Tesla Stock Price (Last 2 Years)")
plt.xlabel("Date"); plt.ylabel("Close (USD)")
plt.legend(); plt.show()

```

---

## 🔄 3. Prophet 입력형식 변환 & (선택) 로그변환

* Prophet은 `ds`(datetime), `y`(float) 컬럼을 필요로 해.
* 안정적 학습을 위해 로그변환(`log1p`) 옵션을 제공하고, 예측 후 역변환(`expm1`)도 포함해줘.

### 📌 예제 코드

```python
use_log = True  # 로그변환 사용할지 여부

data = df[["Close"]].copy()
if use_log:
    data["y"] = np.log1p(data["Close"])
else:
    data["y"] = data["Close"]
data["ds"] = data.index.tz_localize(None)  # Prophet은 tz-naive 선호

# Train/Test split (최근 20영업일 테스트)
test_horizon = 20
train = data.iloc[:-test_horizon].copy()
test  = data.iloc[-test_horizon:].copy()
print(train.tail(2), "\n---\n", test.head(2))
```

---

## 🧠 4. Prophet 모델 구성

* **주요 설정**: `yearly_seasonality=True`, `weekly_seasonality=True`, `daily_seasonality=False`
* **체인지포인트 민감도**: `changepoint_prior_scale=0.1` (과적합 방지용 기본값 예시)
* **미국 공휴일 효과** 추가: `add_country_holidays(country_name='US')`

### 📌 예제 코드

```python
m = Prophet(
    yearly_seasonality=True,
    weekly_seasonality=True,
    daily_seasonality=False,
    changepoint_prior_scale=0.1,
    seasonality_mode="additive"  # 주가 로그스케일이라 additive가 보통 안정적
)
m.add_country_holidays(country_name='US')

# (선택) 추가 계절성 예시: 월별 효과
# m.add_seasonality(name='monthly', period=30.5, fourier_order=5)

# 학습
m.fit(train[["ds","y"]])
```

---

## 🧪 5. 백테스트형 검증 (Prophet 내장 CV)

* Prophet의 `cross_validation`을 사용해 **롤링 포워드** 방식의 백테스트를 수행해줘.
* `horizon="20 days"`로 설정하고, `initial`과 `period`는 데이터 길이에 맞춰 합리적으로 지정해줘(예: initial=전체의 60\~70%).

### 📌 예제 코드

```python
# 데이터 길이에 따라 초기 학습 길이/주기 자동 설정 (간단 로직)
n = len(train)
initial_days = int(n * 0.7)
period_days  = max(int((n - initial_days) / 3), 5)

df_cv = cross_validation(
    m,
    initial=f"{initial_days} days",
    period=f"{period_days} days",
    horizon=f"{test_horizon} days",
    parallel="processes"
)
df_p = performance_metrics(df_cv, rolling_window=1)
df_p[["horizon","mape","rmse","mae"]].head()
```

---

## 🏁 6. 테스트 구간 예측 & 성능 평가

* 학습 완료 모델로 테스트 구간(최근 20영업일) **직접 예측**을 수행해줘.
* 로그 사용 시 역변환 후 **MAE, RMSE, MAPE**를 계산해줘.
* 실제값 vs 예측값을 함께 시각화해줘.

### 📌 예제 코드

```python
# 테스트 구간 예측
future_test = test[["ds"]].copy()
forecast_test = m.predict(future_test)

# 역변환
if use_log:
    y_true = np.expm1(test["y"].values)
    y_pred = np.expm1(forecast_test["yhat"].values)
else:
    y_true = test["y"].values
    y_pred = forecast_test["yhat"].values

def mape(a, f):
    return np.mean(np.abs((a - f) / a)) * 100

mse  = mean_squared_error(y_true, y_pred)
rmse = np.sqrt(mse)

print("MAE :", mean_absolute_error(y_true, y_pred))
print("RMSE:", rmse)
print("MAPE: %.2f%%" % mape(y_true, y_pred))

# 시각화
plt.plot(test["ds"], y_true, label="Actual (Close)", color="black")
plt.plot(test["ds"], y_pred, label="Predicted (Prophet)", linestyle="--")
plt.title("TSLA Test Window Prediction (Last 20 Trading Days)")
plt.xlabel("Date"); plt.ylabel("Close (USD)")
plt.legend(); plt.show()
```

---

## 🔮 7. 향후 30영업일 예측 & 전체 플롯

* 향후 **30영업일**(대략 42달력일 정도) 예측을 생성해줘.
* Prophet 기본 플롯과 컴포넌트(트렌드/주간/연간)를 함께 보여줘.

### 📌 예제 코드

```python
# 향후 30영업일 예측용 캘린더 생성 (거칠게 45일 확장 후 영업일 필터 없이 사용)
future = m.make_future_dataframe(periods=45, freq="D")  # D 기준
forecast = m.predict(future)

# 역변환 컬럼 추가
if use_log:
    forecast["yhat_real"] = np.expm1(forecast["yhat"])
    forecast["yhat_lower_real"] = np.expm1(forecast["yhat_lower"])
    forecast["yhat_upper_real"] = np.expm1(forecast["yhat_upper"])
else:
    forecast["yhat_real"] = forecast["yhat"]
    forecast["yhat_lower_real"] = forecast["yhat_lower"]
    forecast["yhat_upper_real"] = forecast["yhat_upper"]

# 전체 예측 시각화 (실제 Close 함께)
merged = df[["Close"]].merge(forecast.set_index("ds")[["yhat_real","yhat_lower_real","yhat_upper_real"]],
                             left_index=True, right_index=True, how="outer")

plt.plot(merged.index, merged["Close"], label="Actual Close", color="black")
plt.plot(merged.index, merged["yhat_real"], label="Forecast (Prophet)", linestyle="--")
plt.fill_between(merged.index,
                 merged["yhat_lower_real"],
                 merged["yhat_upper_real"],
                 alpha=0.2, label="Uncertainty Interval")
plt.title("TSLA Forecast (Prophet)")
plt.xlabel("Date"); plt.ylabel("Close (USD)")
plt.legend(); plt.show()

# Prophet 기본 플롯(옵션)
# from prophet.plot import plot_plotly, plot_components_plotly
# plot_plotly(m, forecast); plot_components_plotly(m, forecast)
```

---

## ⚙️ 8. (선택) 하이퍼파라미터 그리드 탐색 가이드

* `changepoint_prior_scale`(0.01\~0.5), `seasonality_mode`(additive/multiplicative), `seasonality_prior_scale` 등을 작은 그리드로 순회하며
  검증 MAPE/RMSE가 가장 낮은 조합을 선택하는 코드 스니펫을 추가해줘(연산 시간 경고 포함).

---

## ✅ 요청 요약 (GPT가 반드시 지켜야 할 사항)

1. 위 단계(1\~7)를 **하나의 실행 가능한 스크립트**로 묶어줘.
2. 로그변환 사용 여부(`use_log`)와 테스트 구간 길이(`test_horizon`)는 상단 변수로 쉽게 바꿀 수 있게 해줘.
3. \*\*성능 지표(MAE, RMSE, MAPE)\*\*를 출력하고, **테스트 구간 예측 플롯**과 **전체 예측 플롯**을 각각 보여줘.
4. Prophet **내장 cross\_validation + performance\_metrics** 결과의 주요 지표 테이블도 출력해줘.
5. 주석은 **한국어**로 간결하게 달아줘.

---

📌 이 프롬프트를 사용하여 GPT에서 바로 코드 생성을 시도해보세요! 필요하면 Colab에 붙여 넣어 실행하면 됩니다. 🚀
