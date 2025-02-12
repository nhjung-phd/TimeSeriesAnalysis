# 📌 **ARCH 모델을 활용한 변동성 분석 프롬프트**  

이 문서는 **GPT를 활용하여 ARCH 모델을 이용한 금융 시계열 변동성 분석 코드를 자동 생성**할 수 있도록 도와줍니다.  
아래 **프롬프트를 GPT에 입력**하면, 원하는 금융 변동성 예측 코드를 쉽게 생성할 수 있습니다. 🚀  

---

## 🛠️ **1. 라이브러리 불러오기**  
```plaintext
Python에서 ARCH 모델을 사용하여 금융 시계열 데이터를 분석하고,  
변동성을 예측하는 코드를 작성해줘.  
필요한 라이브러리는 arch, statsmodels, pandas, numpy, matplotlib, yfinance가 포함되어야 해.
```

📌 **예제 코드**  
```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import yfinance as yf
from arch import arch_model
from sklearn.metrics import mean_squared_error
```

---

## 📊 **2. 테슬라(TSLA) 주가 데이터 다운로드 및 시각화**  
```plaintext
yfinance 라이브러리를 사용하여 테슬라(TSLA) 주가 데이터를 가져오고,  
Matplotlib을 이용하여 시계열 그래프를 그리는 코드를 작성해줘.  
최근 2년 치 데이터를 사용하고, "Close" 가격을 기반으로 변동성을 예측해줘.
```

📌 **예제 코드**  
```python
# 📌 1️⃣ 테슬라(TSLA) 주가 데이터 다운로드 (최근 2년치)
df = yf.download("TSLA", start="2022-01-01", end="2024-01-01")

# 📌 2️⃣ 종가 시계열 시각화
plt.figure(figsize=(12, 5))
plt.plot(df.index, df["Close"], label="Tesla Stock Price (Close)", color="black")
plt.title("Tesla Stock Price Time Series")
plt.xlabel("Date")
plt.ylabel("Close Price (USD)")
plt.legend()
plt.show()
```

---

## 🔍 **3. 데이터 전처리 및 수익률 계산**  
```plaintext
Pandas를 사용하여 주가 데이터를 변환하고,  
ARCH 모델의 입력 변수인 로그 수익률(Log Return)을 계산하는 코드를 작성해줘.
```

📌 **예제 코드**  
```python
# 로그 수익률 계산
df["Return"] = df["Close"].pct_change()  # 수익률 계산
df = df.dropna()  # 결측값 제거

# 시각화
plt.figure(figsize=(12, 5))
plt.plot(df.index, df["Return"], label="Daily Returns", color="blue")
plt.title("Tesla Stock Daily Returns")
plt.xlabel("Date")
plt.ylabel("Return")
plt.legend()
plt.show()
```

---

## 📈 **4. 학습 및 테스트 데이터 분할**  
```plaintext
Pandas를 사용하여 시계열 데이터를 학습용(80%)과 테스트용(20%) 데이터로 분할하는 코드를 작성해줘.
```

📌 **예제 코드**  
```python
train_size = int(len(df) * 0.8)
train, test = df.iloc[:train_size].copy(), df.iloc[train_size:].copy()

print(f"Train Size: {len(train)}, Test Size: {len(test)}")
```

---

## 🔍 **5. ARCH 모델 설정 및 학습**  
```plaintext
ARCH(p) 모델을 설정하고, 학습을 수행하는 코드를 작성해줘.  
ARCH 모델은 과거 p개의 변동성을 고려하여 현재 변동성을 예측하는 모델이야.  
```

📌 **예제 코드**  
```python
p = 2  # ARCH(p) 모델의 p값 설정
model = arch_model(train["Return"], vol="ARCH", p=p, dist="normal")  # ARCH 모델 생성
model_fit = model.fit(disp="off")  # 모델 학습
```

---

## 🚀 **6. 변동성 예측 수행**  
```plaintext
학습한 ARCH 모델을 사용하여 훈련 데이터 및 테스트 데이터의 변동성을 예측하는 코드를 작성해줘.
```

📌 **예제 코드**  
```python
# 학습 데이터 변동성 예측
train_vol_pred = model_fit.conditional_volatility  

# 테스트 데이터 변동성 예측
test_forecast = model_fit.forecast(start=len(train), horizon=len(test))
test_vol_pred = np.sqrt(test_forecast.variance.iloc[-1].values)  # 분산값을 표준편차(변동성)로 변환
```

---

## 🔍 **7. 성능 평가 (MSE)**  
```plaintext
예측한 변동성과 실제 수익률 제곱 값의 차이를 비교하여,  
Mean Squared Error(MSE)를 계산하는 코드를 작성해줘.
```

📌 **예제 코드**  
```python
train_mse = mean_squared_error(train["Return"] ** 2, train_vol_pred)
print(f"📌 Training MSE (Conditional Volatility vs Squared Return): {train_mse:.6f}")
```

---

## 📉 **8. 결과 시각화**  
```plaintext
Matplotlib을 사용하여 실제 변동성과 예측 변동성을 비교하는 그래프를 그리는 코드를 작성해줘.
```

📌 **예제 코드**  
```python
plt.figure(figsize=(12, 5))
plt.plot(train.index, train["Return"] ** 2, label="Actual Squared Returns", color="black")
plt.plot(train.index, train_vol_pred, label="Predicted Volatility (ARCH Model)", linestyle="--", color="red")
plt.title("Tesla Stock Volatility Prediction using ARCH Model - Training Phase")
plt.xlabel("Date")
plt.ylabel("Volatility")
plt.legend()
plt.show()
```

📌 **테스트 데이터 변동성 예측 시각화**  
```python
plt.figure(figsize=(12, 5))
plt.plot(test.index, test["Return"] ** 2, label="Actual Squared Returns", color="black")
plt.axhline(y=test_vol_pred, label="Predicted Volatility (ARCH Model)", linestyle="--", color="red")
plt.title("Tesla Stock Volatility Prediction using ARCH Model - Test Phase")
plt.xlabel("Date")
plt.ylabel("Volatility")
plt.legend()
plt.show()
```

---

📌 **이 프롬프트를 사용하여 GPT에서 직접 코드 생성을 시도해보세요! 🚀**  
프롬프트를 입력하면, 자동으로 코드를 생성해줍니다.  

Colab에서 직접 실행하려면 아래 링크를 클릭하세요.  
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/08_ARCH_volatility.ipynb)

