# 📌 프롬프트: 다양한 금융 데이터 소스에서 주가 및 경제 지표 수집  

## 🎯 **목표**  
- 주식 가격 데이터를 여러 소스로부터 가져오는 방법을 학습합니다.  
- `yfinance`, `pandas_datareader`, `alphavantage` 등 다양한 데이터 수집 라이브러리를 사용합니다.  
- 특정 주식의 과거 데이터를 다운로드하고 분석할 수 있도록 합니다.  

---

### **📌 GPT 프롬프트 모음**  
아래 프롬프트를 복사하여 **GPT에게 입력하면** 원하는 코드를 생성할 수 있습니다.  

---

### 🛠️ **1단계: 기본 라이브러리 설치 및 가져오기**  
```plaintext
Python에서 yfinance, pandas_datareader, matplotlib을 이용하여 주가 데이터를 분석하고 시각화하려고 합니다.  
필요한 라이브러리를 설치하고 불러오는 코드를 작성해줘.
```

💡 먼저 필요한 라이브러리를 설치하고 불러옵니다.  

```python
# 필요한 라이브러리 설치 (Colab 환경)
!pip install yfinance pandas_datareader alpha_vantage

# 라이브러리 불러오기
import numpy as np
import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt
import pandas_datareader.data as web
from datetime import datetime
```

✅ **설명:**  
- `yfinance` → 야후 금융에서 주식 데이터를 가져옴  
- `pandas_datareader` → FRED, Alpha Vantage 등 여러 소스에서 금융 데이터 가져옴  
- `alpha_vantage` (추후 필요 시 사용 가능)  

---


### 📊 **2단계: 야후 금융(yfinance)에서 주식 데이터 다운로드**  
```plaintext
Python에서 `yfinance` 라이브러리를 사용하여 테슬라(TSLA)의 2022년부터 2024년까지 주가 데이터를 다운로드하는 코드를 작성해줘.  
상위 5개 데이터를 출력하는 코드도 포함해줘.
```

💡 특정 주식의 데이터를 다운로드합니다.  

```python
# 특정 종목(TSLA: 테슬라) 주가 데이터 다운로드
df = yf.download("TSLA", start="2022-01-01", end="2024-01-01")

# 상위 5개 데이터 확인
df.head()
```

✅ **설명:**  
- `yf.download()` 함수를 이용하여 특정 기간 동안의 테슬라 주가 데이터를 가져옵니다.  
- `df.head()`를 사용하여 데이터 구조를 확인합니다.  

---

### 📈 **3단계: 주가 데이터 시각화**  
```plaintext
Python에서 Matplotlib을 이용하여 테슬라(TSLA)의 종가(Close Price)를 시각화하는 코드를 작성해줘.  
X축은 날짜, Y축은 가격으로 설정하고, 적절한 제목과 범례를 포함해줘.
```

💡 다운로드한 데이터를 시각화하여 주가 흐름을 확인합니다.  

```python
plt.figure(figsize=(12, 5))
plt.plot(df.index, df["Close"], label="Close Price", color="blue")
plt.title("Tesla Stock Price")
plt.xlabel("Date")
plt.ylabel("Price (USD)")
plt.legend()
plt.show()
```

✅ **설명:**  
- `plt.plot()`을 이용하여 종가(Close Price)를 시각화합니다.  
- `xlabel()`, `ylabel()`, `title()` 등을 활용하여 그래프를 정리합니다.  

---


### 🌍 **4단계: Pandas DataReader를 이용한 데이터 수집**  
```plaintext
Python에서 `pandas_datareader`를 이용하여 S&P 500 지수("^GSPC")의 2022년부터 2024년까지 주가 데이터를 가져오는 코드를 작성해줘.  
Yahoo Finance에서 데이터를 가져오고, 상위 5개 데이터를 출력해줘.
```

💡 FRED, Alpha Vantage, Yahoo Finance 등의 데이터 소스를 활용할 수 있습니다.  

```python
start = datetime(2022, 1, 1)
end = datetime(2024, 1, 1)

# S&P 500 데이터 가져오기 (FRED)
sp500 = web.DataReader("^GSPC", "yahoo", start, end)

# 상위 5개 데이터 확인
sp500.head()
```

✅ **설명:**  
- `pandas_datareader`를 사용하여 Yahoo Finance에서 S&P 500 데이터를 가져옵니다.  
- `DataReader("^GSPC", "yahoo", start, end)`를 사용하면 S&P 500의 주가 데이터를 받을 수 있습니다.  

---

### 🔄 **5단계: 여러 종목의 데이터 가져오기**  
```plaintext
Python에서 `yfinance`를 이용하여 여러 개의 주식 데이터를 동시에 가져오고 싶어.  
Apple(AAPL), Microsoft(MSFT), Google(GOOGL), Amazon(AMZN)의 2022년부터 2024년까지 주가 데이터를 다운로드하고,  
각 종목의 종가(Close Price)만 포함한 데이터프레임을 생성하는 코드를 작성해줘.
```

💡 여러 종목의 데이터를 한 번에 가져올 수도 있습니다.  

```python
tickers = ["AAPL", "MSFT", "GOOGL", "AMZN"]
stocks = yf.download(tickers, start="2022-01-01", end="2024-01-01")["Close"]

# 데이터 확인
stocks.head()
```

✅ **설명:**  
- 리스트 형태로 여러 개의 종목을 지정하여 데이터를 가져옵니다.  
- `.download()` 함수에서 `["Close"]`를 추가하여 종가만 가져올 수 있습니다.  

---

### 🔎 **6단계: 주가 변동률 계산**  
```plaintext
Python에서 `pandas`를 사용하여 주식의 일별 변동률(수익률)을 계산하는 코드를 작성해줘.  
이미 `stocks`라는 데이터프레임이 있고, 이 데이터의 변동률을 계산한 후 결측값을 제거하는 코드를 추가해줘.
```

💡 각 종목의 일별 변동률을 계산합니다.  

```python
returns = stocks.pct_change().dropna()

# 변동률 데이터 확인
returns.head()
```

✅ **설명:**  
- `.pct_change()`를 이용하여 각 날짜별 변동률을 계산합니다.  
- `.dropna()`를 사용하여 첫 번째 행의 NaN 값을 제거합니다.  

---


## ✅ **추가 실습 프롬프트**  
아래 추가 프롬프트를 활용하여 더 다양한 분석을 시도해볼 수 있습니다.  

### 📊 **주가 이동평균선 계산하기**  
```plaintext
Python에서 `pandas`를 사용하여 테슬라(TSLA) 주가의 50일, 200일 이동평균선을 계산하는 코드를 작성해줘.  
이동평균선을 원본 종가 그래프에 함께 시각화할 코드도 포함해줘.
```

---

### 📈 **특정 이벤트 전후 주가 분석**  
```plaintext
Python에서 테슬라(TSLA)의 특정 이벤트(예: FOMC 회의 발표일) 전후 30일간 주가 변화를 시각화하는 코드를 작성해줘.  
이벤트 날짜를 기준으로 X축을 조정하여 시각화해줘.
```

---

### 📉 **볼린저 밴드(Bollinger Bands) 추가하기**  
```plaintext
Python에서 테슬라(TSLA)의 주가 차트에 볼린저 밴드(20일 기준, 상한선/하한선) 추가하는 코드를 작성해줘.  
matplotlib을 사용하여 시각화하고, 상한선과 하한선을 색깔로 구별해줘.
```

---


## ✅ **정리 및 확장**  
이제 여러분은  
✅ `yfinance`, `pandas_datareader`를 이용한 금융 데이터 수집법을 배웠습니다.  
✅ 특정 종목, 여러 종목의 데이터를 다운로드하고 분석할 수 있습니다.  
✅ 기본적인 주가 변동률 계산과 시각화를 수행할 수 있습니다.  

### 🚀 **📌 확장 아이디어**  
- 추가적인 경제 지표(FRED, MacroTrends 등)와 결합하기  
- 특정 기간 동안의 주가 평균, 변동성 분석  
- 특정 이벤트(예: 금리 발표) 전후 주가 분석  

---

💡 **프롬프트를 활용하는 방법**  
이 프롬프트를 입력하면, GPT 모델이 코드를 자동으로 생성하여 여러분이 직접 실행할 수 있도록 도와줍니다.  

```
"야후 금융(yfinance)에서 테슬라(TSLA)의 2022년부터 2024년까지 주가 데이터를 다운로드하고, 이를 시각화하는 Python 코드를 작성해줘."
```

```
"pandas_datareader를 이용하여 S&P 500 지수와 테슬라 주가 데이터를 가져오고, 이를 비교하는 코드를 작성해줘."
```

---

### 📌 **이제 다음 단계를 진행하세요!**  
프롬프트를 활용하여 직접 실습을 진행하고 코드를 생성해 보세요.  
Colab에서 직접 실행하려면 아래 링크를 클릭하세요.  

📌 **Colab 실행:**  
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_pricedata.ipynb)
```

