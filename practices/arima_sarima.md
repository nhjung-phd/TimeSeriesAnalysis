# ARRIMA, SARMA, Auto ARIMA 모델로 테슬라 주가 예측하기

다음은 **ARIMA, SARIMA, Auto ARIMA** 모델을 사용하여 **테슬라(TSLA) 주가를 예측**하는 코드와 이에 대한 자세한 설명입니다.  
이 코드는 **yfinance**를 이용해 주가 데이터를 가져오고, **statsmodels** 및 **pmdarima** 라이브러리를 사용하여 시계열 모델을 학습하고 예측을 수행합니다.

---

## **📌 1. 라이브러리 설치 및 데이터 준비**  

먼저, 필요한 라이브러리를 설치하고 데이터를 가져옵니다.

```python
# 필요한 라이브러리 설치 (처음 한 번만 실행)
!pip install yfinance pandas numpy matplotlib statsmodels pmdarima
```

이제 라이브러리를 불러오고 테슬라(TSLA) 주가 데이터를 다운로드합니다.

```python
import numpy as np
import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt
import seaborn as sns
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.statespace.sarimax import SARIMAX
from pmdarima import auto_arima
from sklearn.metrics import mean_squared_error

# 경고 메시지 무시
import warnings
warnings.filterwarnings("ignore")

# ✅ 테슬라(TSLA) 주가 데이터 다운로드 (최근 2년치)
df = yf.download("TSLA", start="2022-01-01", end="2024-01-01")

# ✅ 데이터프레임 변환 및 날짜 인덱스 설정
df = df.reset_index()
df["Date"] = pd.to_datetime(df["Date"])  # 날짜 변환
df.set_index("Date", inplace=True)  # 날짜를 인덱스로 설정

# ✅ 'Close' 열만 선택 (종가)
df = df[["Close"]]

# ✅ 데이터 시각화
plt.figure(figsize=(12, 5))
plt.plot(df["Close"], label="Tesla Stock Price", color="black")
plt.title("Tesla Stock Price (2022-2024)")
plt.xlabel("Date")
plt.ylabel("Stock Price (USD)")
plt.legend()
plt.grid()
plt.show()
```

---

## **📌 2. 시계열 데이터의 정상성 검정 (ADF Test)**  

ARIMA와 SARIMA 모델을 사용하기 전에 **정상성 검정**(Augmented Dickey-Fuller Test, ADF Test)을 수행합니다.  
ADF 테스트의 귀무가설(H₀): **데이터는 정상성을 가지지 않는다.**  
p-value가 0.05 미만이면 귀무가설 기각 → **데이터가 정상성 있음.**  

```python
from statsmodels.tsa.stattools import adfuller

# ADF Test 수행 함수
def adf_test(series):
    result = adfuller(series)
    print("ADF Statistic:", result[0])
    print("p-value:", result[1])
    if result[1] < 0.05:
        print("✅ 데이터는 정상성을 가짐 (p-value < 0.05)")
    else:
        print("⚠️ 데이터는 정상성을 가지지 않음 (p-value >= 0.05)")

# ✅ 종가(Close) 데이터의 정상성 검정
adf_test(df["Close"])
```

---

## **📌 3. 차분을 사용하여 정상성 확보**  

ADF 테스트에서 정상성이 없는 경우, **차분(Differencing)을 사용하여 데이터의 정상성을 확보**합니다.

```python
# ✅ 1차 차분 수행
df["Close_diff"] = df["Close"].diff().dropna()

# ✅ 차분 데이터의 정상성 검정
adf_test(df["Close_diff"].dropna())

# ✅ 차분 데이터 시각화
plt.figure(figsize=(12, 5))
plt.plot(df["Close_diff"], label="Differenced Close Price", color="blue")
plt.title("Differenced Tesla Stock Price")
plt.xlabel("Date")
plt.ylabel("Price Change")
plt.legend()
plt.grid()
plt.show()
```

---

## **📌 4. ARIMA 모델 학습 및 예측**  

ARIMA 모델의 `(p, d, q)` 값 설정:  
- **p**: 과거 시점(AR, AutoRegressive)의 영향
- **d**: 차분 횟수 (Differencing)
- **q**: 이동 평균(MA, Moving Average)의 영향

### **(1) 최적의 ARIMA (p, d, q) 값 찾기**
```python
# ✅ Auto ARIMA를 사용하여 최적의 (p, d, q) 찾기
auto_arima_model = auto_arima(df["Close"], seasonal=False, trace=True, stepwise=True)
best_p, best_d, best_q = auto_arima_model.order
print(f"✅ 최적의 (p, d, q) 값: (p={best_p}, d={best_d}, q={best_q})")
```

### **(2) ARIMA 모델 학습**
```python
# ✅ ARIMA 모델 학습
model_arima = ARIMA(df["Close"], order=(best_p, best_d, best_q))
model_arima_fit = model_arima.fit()

# ✅ 예측 수행 (향후 30일)
forecast_arima = model_arima_fit.forecast(steps=30)

# ✅ 예측 결과 시각화
plt.figure(figsize=(12, 5))
plt.plot(df["Close"], label="Actual", color="black")
plt.plot(pd.date_range(df.index[-1], periods=31, freq='D')[1:], forecast_arima, label="ARIMA Forecast", linestyle="--", color="red")
plt.title("Tesla Stock Price Prediction using ARIMA")
plt.xlabel("Date")
plt.ylabel("Stock Price (USD)")
plt.legend()
plt.grid()
plt.show()
```

---

## **📌 5. SARIMA 모델 학습 및 예측**  

SARIMA는 **계절성(Seasonality)**이 있는 데이터를 분석하는 모델입니다.

```python
# ✅ Auto ARIMA를 사용하여 최적의 SARIMA (p, d, q) 및 (P, D, Q, s) 찾기
auto_sarima_model = auto_arima(df["Close"], seasonal=True, m=12, trace=True, stepwise=True)
best_p, best_d, best_q = auto_sarima_model.order
best_P, best_D, best_Q, best_s = auto_sarima_model.seasonal_order
print(f"✅ 최적의 SARIMA (p, d, q, P, D, Q, s): ({best_p}, {best_d}, {best_q}, {best_P}, {best_D}, {best_Q}, {best_s})")

# ✅ SARIMA 모델 학습
model_sarima = SARIMAX(df["Close"], order=(best_p, best_d, best_q), seasonal_order=(best_P, best_D, best_Q, best_s))
model_sarima_fit = model_sarima.fit()

# ✅ 예측 수행 (향후 30일)
forecast_sarima = model_sarima_fit.forecast(steps=30)

# ✅ 예측 결과 시각화
plt.figure(figsize=(12, 5))
plt.plot(df["Close"], label="Actual", color="black")
plt.plot(pd.date_range(df.index[-1], periods=31, freq='D')[1:], forecast_sarima, label="SARIMA Forecast", linestyle="--", color="blue")
plt.title("Tesla Stock Price Prediction using SARIMA")
plt.xlabel("Date")
plt.ylabel("Stock Price (USD)")
plt.legend()
plt.grid()
plt.show()
```

---

## **📌 6. 모델 성능 평가 (MSE, R² 점수)**  
```python
# ✅ 실제값과 예측값 비교 (최근 30일)
actual = df["Close"][-30:]
pred_arima = model_arima_fit.predict(start=len(df)-30, end=len(df)-1)
pred_sarima = model_sarima_fit.predict(start=len(df)-30, end=len(df)-1)

# ✅ MSE 계산
mse_arima = mean_squared_error(actual, pred_arima)
mse_sarima = mean_squared_error(actual, pred_sarima)

print(f"📌 ARIMA 모델 MSE: {mse_arima:.4f}")
print(f"📌 SARIMA 모델 MSE: {mse_sarima:.4f}")
```

---

## **📌 7. 결론**  
- ARIMA와 SARIMA를 사용하여 테슬라 주가를 예측할 수 있음.  
- Auto ARIMA를 사용하면 최적의 `(p, d, q)`를 자동으로 선택 가능.  
- SARIMA는 계절성을 고려하여 예측할 때 유용.  
- 성능 비교 후 더 낮은 MSE를 가지는 모델을 선택.  

🎯 **이제 테슬라 주가 예측을 직접 실행해 보세요!** 🚀