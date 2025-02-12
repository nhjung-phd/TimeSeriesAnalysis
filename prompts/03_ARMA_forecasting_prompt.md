# 📌 **ARMA(자동회귀 이동평균) 모델 프롬프트**

이 문서는 **GPT를 활용하여 ARMA(Autoregressive Moving Average) 모델 기반 시계열 예측 코드를 자동 생성**할 수 있도록 도와줍니다.  
아래 **프롬프트를 GPT에 입력**하면, 원하는 시계열 예측 코드를 쉽게 생성할 수 있습니다. 🚀

---

## 🛠️ **1. 라이브러리 불러오기**
```plaintext
Python에서 시계열 예측을 위해 필요한 라이브러리를 불러오는 코드를 작성해줘.
statsmodels, pandas, numpy, matplotlib을 포함해줘.
```

📌 **예제 코드**
```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.arima.model import ARIMA
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

## 🔍 **3. 데이터 분할 (Train/Test)**
```plaintext
Pandas를 사용하여 시계열 데이터를 학습용(80%)과 테스트용(20%) 데이터로 분할하는 코드를 작성해줘.
```

📌 **예제 코드**
```python
train_size = int(len(df) * 0.8)
train, test = df.iloc[:train_size], df.iloc[train_size:]

print(f"Train Size: {len(train)}, Test Size: {len(test)}")
```

---

## 📈 **4. ARMA 모델 학습**
```plaintext
Statsmodels의 ARIMA 클래스를 사용하여 ARMA(AR+MA) 모델을 학습하는 코드를 작성해줘.
최적의 AR 차수(p)와 MA 차수(q)를 각각 2로 설정하고, 모델을 학습한 후 요약 정보를 출력해줘.
```

📌 **예제 코드**
```python
# ARMA 모델 학습
p, q = 2, 2  # AR 차수와 MA 차수
model = ARIMA(train, order=(p, 0, q))  # d=0인 경우 ARMA 모델
model_fit = model.fit()

# 모델 요약
print(model_fit.summary())
```

---

## 🚀 **5. 예측 수행**
```plaintext
학습한 ARMA 모델을 사용하여 테스트 데이터의 길이만큼 예측을 수행하는 코드를 작성해줘.
```

📌 **예제 코드**
```python
# 예측 수행
predictions = model_fit.predict(start=len(train), end=len(df) - 1, dynamic=False)

# 예측값 저장
test["Predicted"] = predictions
```

---

## ✅ **6. 모델 평가 (MSE)**
```plaintext
Scikit-learn의 mean_squared_error를 사용하여 모델 성능을 평가하는 코드를 작성해줘.
```

📌 **예제 코드**
```python
# MSE 계산
mse = mean_squared_error(test["Value"], test["Predicted"])
print(f"📌 Test MSE: {mse:.4f}")
```

---

## 📉 **7. 결과 시각화**
```plaintext
Matplotlib을 사용하여 실제 값과 예측 값을 비교하는 그래프를 그리는 코드를 작성해줘.
```

📌 **예제 코드**
```python
plt.figure(figsize=(12, 5))
plt.plot(train.index, train["Value"], label="Train Data", color="black")
plt.plot(test.index, test["Value"], label="Actual Test Data", color="blue")
plt.plot(test.index, test["Predicted"], label="Predicted", linestyle="--", color="red")
plt.title("ARMA Model Time Series Forecasting")
plt.xlabel("Date")
plt.ylabel("Value")
plt.legend()
plt.show()
```

---

📌 **이 프롬프트를 사용하여 GPT에서 직접 코드 생성을 시도해보세요! 🚀**  
프롬프트를 입력하면, 자동으로 코드를 생성해줍니다.  

Colab에서 직접 실행하려면 아래 링크를 클릭하세요.  
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/03_ARMA_forecasting.ipynb)

