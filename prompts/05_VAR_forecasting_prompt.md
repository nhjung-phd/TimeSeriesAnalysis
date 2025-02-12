# 📌 **VAR(벡터 자기회귀) 모델 프롬프트**  

이 문서는 **GPT를 활용하여 VAR(Vector Autoregression) 모델 기반 시계열 예측 코드를 자동 생성**할 수 있도록 도와줍니다.  
아래 **프롬프트를 GPT에 입력**하면, 원하는 시계열 예측 코드를 쉽게 생성할 수 있습니다. 🚀  

---

## 🛠️ **1. 라이브러리 불러오기**  
```plaintext
Python에서 VAR(벡터 자기회귀) 모델을 사용하여 시계열 데이터를 예측하는 코드를 작성해줘.  
필요한 라이브러리에는 statsmodels, pandas, numpy, matplotlib, sklearn이 포함되어야 해.  
그리고 yfinance를 이용하여 실시간 주가 데이터를 가져올 수 있도록 해줘.
```

📌 **예제 코드**  
```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import yfinance as yf
from statsmodels.tsa.api import VAR
from sklearn.metrics import mean_squared_error
```

---

## 📊 **2. 테슬라(TSLA) 주가 데이터 다운로드 및 시각화**  
```plaintext
yfinance 라이브러리를 사용하여 테슬라(TSLA) 주가 데이터를 가져오고,  
Matplotlib을 이용하여 시계열 그래프를 그리는 코드를 작성해줘.  
최근 2년 치 데이터를 사용하고, "Close" 가격을 예측 대상으로 삼아줘.
```

📌 **예제 코드**  
```python
# 📌 1️⃣ 테슬라(TSLA) 주가 데이터 다운로드 (최근 2년치)
df = yf.download("TSLA", start="2022-01-01", end="2024-01-01")

# 📌 2️⃣ 시계열 데이터 시각화
plt.figure(figsize=(12, 5))
plt.plot(df.index, df["Close"], label="Tesla Stock Price (Close)", color="black")
plt.title("Tesla Stock Price Time Series")
plt.xlabel("Date")
plt.ylabel("Close Price (USD)")
plt.legend()
plt.show()
```

---

## 🔍 **3. 데이터 전처리 및 변수 선택**  
```plaintext
Pandas를 사용하여 데이터에서 로그 변환한 종가(Log_Close),  
로그 변환한 거래량(Log_Volume), 그리고 수익률(Return) 변수를 선택해줘.
```

📌 **예제 코드**  
```python
df["Return"] = df["Close"].pct_change()  # 수익률 계산
df["Log_Close"] = np.log(df["Close"])  # 로그 변환 종가
df["Log_Volume"] = np.log(df["Volume"])  # 로그 변환 거래량
df = df.dropna()  # 결측값 제거

# 모델 입력 변수 선택
data = df[["Log_Close", "Log_Volume", "Return"]]
```

---

## 📈 **4. 데이터 분할 (Train/Test)**  
```plaintext
Pandas를 사용하여 시계열 데이터를 학습용(80%)과 테스트용(20%) 데이터로 분할하는 코드를 작성해줘.
```

📌 **예제 코드**  
```python
train_size = int(len(data) * 0.8)
train, test = data.iloc[:train_size].copy(), data.iloc[train_size:].copy()

print(f"Train Size: {len(train)}, Test Size: {len(test)}")
```

---

## 🔍 **5. 최적의 VAR 차수(p) 선택 (AIC 기준)**  
```plaintext
statsmodels의 VAR.select_order를 사용하여 최적의 차수(p)를 선택하는 코드를 작성해줘.
```

📌 **예제 코드**  
```python
lag_selection = VAR(train)
lag_results = lag_selection.select_order(maxlags=10)
best_lag = lag_results.aic  # AIC 최소값을 갖는 차수 선택
best_lag = max(best_lag, 1)  # 최소 1 이상 유지
print(f"✅ 최적의 차수 (p): {best_lag}")
```

---

## 🚀 **6. VAR 모델 학습**  
```plaintext
최적의 차수(p)를 사용하여 VAR 모델을 학습하는 코드를 작성해줘.
```

📌 **예제 코드**  
```python
# VAR 모델 학습
model = VAR(train)
model_fit = model.fit(best_lag)

# 모델 요약
print(model_fit.summary())
```

---

## ✅ **7. 예측 수행**  
```plaintext
학습한 VAR 모델을 사용하여 테스트 데이터의 길이만큼 예측을 수행하는 코드를 작성해줘.
```

📌 **예제 코드**  
```python
# 예측 수행
test_pred = model_fit.forecast(train.values[-best_lag:], steps=len(test))

# 예측값 저장
test_pred_df = pd.DataFrame(test_pred, index=test.index, columns=["Log_Close_Pred", "Log_Volume_Pred", "Return_Pred"])
```

---

## 🔍 **8. 로그 변환 해제 및 성능 평가**  
```plaintext
로그 변환한 종가(Log_Close_Pred)를 원래 값으로 변환하고, MSE를 계산하는 코드를 작성해줘.
```

📌 **예제 코드**  
```python
test_pred_df["Close_Pred"] = np.exp(test_pred_df["Log_Close_Pred"])  # 로그 변환 해제

# MSE 계산
test_mse = mean_squared_error(np.exp(test["Log_Close"]), test_pred_df["Close_Pred"])
print(f"📌 Test MSE: {test_mse:.4f}")
```

---

## 📉 **9. 결과 시각화**  
```plaintext
Matplotlib을 사용하여 실제 값과 예측 값을 비교하는 그래프를 그리는 코드를 작성해줘.
```

📌 **예제 코드**  
```python
plt.figure(figsize=(12, 5))
plt.plot(df.index, df["Close"], label="Actual", color="black")
plt.plot(test_pred_df.index, test_pred_df["Close_Pred"], label="Predicted (VAR Model)", linestyle="--", color="red")
plt.title("Tesla Stock Price Prediction using VAR Model")
plt.xlabel("Date")
plt.ylabel("Stock Price (USD)")
plt.legend()
plt.show()
```

---

📌 **이 프롬프트를 사용하여 GPT에서 직접 코드 생성을 시도해보세요! 🚀**  
프롬프트를 입력하면, 자동으로 코드를 생성해줍니다.  

Colab에서 직접 실행하려면 아래 링크를 클릭하세요.  
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/05_VAR_forecasting.ipynb)

