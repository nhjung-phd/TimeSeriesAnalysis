# TimeSeriesAnalysis
## 🕒 Time Series Analysis with Python 

🚀 **2025년 aSSIST AI·Big Data 석사과정 강의 실습 자료**  

이 저장소는 **"Time Series Analysis (시계열 분석)"** 강의의 실습 자료를 포함하고 있으며,  
Python을 활용한 다양한 시계열 분석 기법을 실습할 수 있도록 구성되었습니다.  

---

## 🎯 강의 목적 (Objective of the Course)
🚀 "Time Series Analysis (시계열 분석)" 강의는 전통적인 통계적 기법부터 최신 머신러닝 및 딥러닝 기법을 활용하여 시계열 데이터를 분석하고 예측하는 방법을 학습하는 것을 목표로 합니다.

### 🧑‍🏫 본 강의를 수강하면 다음을 달성할 수 있습니다:
 1️⃣ 전통적인 시계열 분석 방법 (AR, MA, ARIMA 등)과 회귀 기반 예측 모델 (선형 회귀, 다항 회귀 등)의 원리를 이해하고 활용할 수 있습니다.  
 2️⃣ 머신러닝 및 딥러닝 (RNN, LSTM, GRU, CNN, Transformer 등)을 활용한 시계열 예측 모델을 설계하고 구현할 수 있습니다.  
 3️⃣ 주가 데이터를 활용하여 다양한 시계열 분석 및 예측 기법을 실습하고, 실제 금융 데이터를 기반으로 실용적인 예측 모델을 구축할 수 있습니다.  
 4️⃣ 자신만의 시계열 예측 모델을 설계하여 다양한 도메인(금융, 경제, 기후, 산업 데이터 등)에 적용할 수 있습니다.  
 5️⃣ 시계열 분석 관련 소논문을 작성할 수 있도록 연구 설계 및 데이터 분석 역량을 키울 수 있습니다.  

📌 특히, 본 강의는 단순한 모델 구현을 넘어, 시계열 데이터를 분석하고 모델의 성능을 평가하며, 연구 논리와 결과를 효과적으로 전달하는 능력을 함양하는 것을 목표로 합니다.

### 📄 이 강의는 다음과 같은 분들에게 적합합니다:
 ✅ 시계열 데이터를 활용한 데이터 분석 및 예측을 배우고 싶은 연구자 및 실무자  
 ✅ 금융 데이터 (주가, 환율, 경제 지표 등) 분석 및 예측에 관심 있는 투자자 및 애널리스트  
 ✅ 머신러닝 및 딥러닝 기반의 시계열 예측 모델을 설계하고 싶은 엔지니어 및 개발자  
 ✅ 데이터 기반의 소논문 작성을 목표로 하는 대학원생 및 연구자  

---

## 📌 강의 개요  
 🤓 2025년 3월 AI·빅데이터 석사(재학생반)  
 🚀 **2025년 aSSIST AI·Big Data 석사과정 강의 실습 자료**  

## 📌 📆 학기별 공지사항  
 🔹 **[📖 2025년 1학기 공지](docs/2025-1st.md)**  


✅ 본 강의는 **시계열 분석(Time Series Analysis)** 에 대한 심층적인 이해와 실습을 목표로 합니다.  
✅ 🐍 Python을 활용한 시계열 데이터 분석, 머신러닝 및 딥러닝 기반 예측 모델을 다룹니다.  

📌 **강의 실습 자료는 GitHub을 통해 제공될 예정입니다.** 🚀  


---

## ⚙️ 실습 환경 설정  

### 🔧 **필수 라이브러리 설치**  
실습을 위해 아래 패키지를 설치해야 합니다.  
```bash
pip install numpy pandas matplotlib seaborn scikit-learn statsmodels tensorflow torch transformers
```
💡 **Google Colab에서도 실행 가능하며, 별도 설치 없이 진행할 수 있습니다.**

---

## 🛠 실습 내용 및 코드 실행 방법  
### **📂 폴더 구조**
```bash
📂 time-series-analysis
│── 📂 doc                      # 공지사항
│── 📂 data                     # 실습에 사용할 데이터셋
│── 📂 notebooks                # Jupyter Notebook 실습 코드
│── 📂 prompts                  # GPT 프롬프트 모음
│── 📂 models                   # 저장된 모델 파일
│── README.md                   # 초기 안내 파일
│── requirements.txt            # 패키지 설치 파일
```

## **🗂 실습 00: 시계열 데이터 수집 및 전처리**  
| 실습 주제 | 프롬프트 파일 | 코드 파일 | ▶️ 실행 |
|-------------|--------------------------|--------------------------|----------|
| 가격 데이터 수집 | [`00_pricedata_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/00_pricedata_prompt.md) | [`00_pricedata.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_pricedata.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_pricedata.ipynb) |
| 데이터 전처리 | [`00_data_preprocessing_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/00_data_preprocessing_prompt.md) | [`00_data_preprocessing.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_data_preprocessing.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_data_preprocessing.ipynb) |


## **🗂 실습 01~06: 시계열 예측 (고전적 접근)**  
| 실습 주제 | 프롬프트 파일 | 코드 파일 | ▶️ 실행 |
|-------------|--------------------------|--------------------------|----------|
| AR(자동회귀) 모델 | [`01_AR_forecasting_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/01_AR_forecasting_prompt.md) | [`01_AR_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/01_AR_forecasting.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/01_AR_forecasting.ipynb) |
| MA(이동 평균) 모델 | [`02_MA_forecasting_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/02_MA_forecasting_prompt.md) | [`02_MA_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/02_MA_forecasting.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/02_MA_forecasting.ipynb) |


## **🗂 실습 07: Granger Causality 테스트**  
| 실습 주제 | 프롬프트 파일 | 코드 파일 | ▶️ 실행 |
|-------------|--------------------------|--------------------------|----------|
| Granger Causality Test + VAR | [`07_GrangerCausality_VAR_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/07_GrangerCausality_VAR_prompt.md) | [`07_GrangerCausality_VAR.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/07_GrangerCausality_VAR.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/07_GrangerCausality_VAR.ipynb) |


## **🗂 실습 08~09: 금융 시계열 변동성 모델링**  
| 실습 주제 | 프롬프트 파일 | 코드 파일 | ▶️ 실행 |
|-------------|--------------------------|--------------------------|----------|
| ARCH 모델 | [`08_ARCH_volatility_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/08_ARCH_volatility_prompt.md) | [`08_ARCH_volatility.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/08_ARCH_volatility.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/08_ARCH_volatility.ipynb) |
| GARCH 모델 | [`09_GARCH_volatility_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/09_GARCH_volatility_prompt.md) | [`09_GARCH_volatility.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/09_GARCH_volatility.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/09_GARCH_volatility.ipynb) |


## **🗂 실습 11~13: 회귀 기반 예측**  
| 실습 주제 | 프롬프트 파일 | 코드 파일 | ▶️ 실행 |
|-------------|--------------------------|--------------------------|----------|
| 단순 선형 회귀 | [`11_linear_regression_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/11_linear_regression_prompt.md) | [`11_linear_regression.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/11_linear_regression.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/11_linear_regression.ipynb) |
| 다중 선형 회귀 | [`12_multi_linear_regression_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/12_multi_linear_regression_prompt.md) | [`12_multi_linear_regression.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/12_multi_linear_regression.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/12_multi_linear_regression.ipynb) |
| 다항 회귀 | [`13_Polynomial_Regression_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/13_Polynomial_Regression_prompt.md) | [`13_Polynomial_Regression.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/13_Polynomial_Regression.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/13_Polynomial_Regression.ipynb) |


## **🗂 실습 21~26: 머신러닝 & 딥러닝 기반 예측**  
| 실습 주제 | 프롬프트 파일 | 코드 파일 | ▶️ 실행 |
|-------------|--------------------------|--------------------------|----------|
| ANN(MLP) 기반 예측 | [`21_ann_forecasting_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/21_ann_forecasting_prompt.md) | [`21_ann_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/21_ann_forecasting.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/21_ann_forecasting.ipynb) |
| RNN 기반 예측 | [`22_rnn_forecasting_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/22_rnn_forecasting_prompt.md) | [`22_rnn_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/22_rnn_forecasting.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/22_rnn_forecasting.ipynb) |
| LSTM 기반 예측 | [`23_lstm_forecasting_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/23_lstm_forecasting_prompt.md) | [`23_lstm_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/23_lstm_forecasting.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/23_lstm_forecasting.ipynb) |
| GRU 기반 예측 | [`24_gru_forecasting_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/24_gru_forecasting_prompt.md) | [`24_gru_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/24_gru_forecasting.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/24_gru_forecasting.ipynb) |
| CNN 기반 예측 | [`25_cnn_forecasting_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/25_cnn_forecasting_prompt.md) | [`25_cnn_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/25_cnn_forecasting.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/25_cnn_forecasting.ipynb) |
| Transformer 기반 예측 | [`26_transformer_encoder_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/26_transformer_encoder_prompt.md) | [`26_transformer_encoder.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/26_transformer_encoder.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/26_transformer_encoder.ipynb) |




✔ **Colab 실행 버튼**이 포함되어 있어 클릭하면 바로 Google Colab에서 실행할 수 있습니다. 🚀
✔ **Colab 실행 버튼을 클릭하면 같은 창에서 열립니다.**  
✔ **새로운 탭에서 열려면** `Ctrl + 클릭 (Windows/Linux)` 또는 `Cmd + 클릭 (Mac)`을 사용하세요!  

---

## 📟 코드 실행 방법
### **1️⃣ Jupyter Notebook에서 실행**
1. GitHub 저장소 클론 (로컬에 다운로드)  
   ```bash
   git clone https://github.com/nhjung-phd/time-series-analysis.git
   cd time-series-analysis
   ```
2. 가상환경 생성 (선택 사항)  
   ```bash
   python -m venv venv
   source venv/bin/activate  # Mac/Linux
   venv\Scripts\activate  # Windows
   ```
3. 필수 패키지 설치  
   ```bash
   pip install -r requirements.txt
   ```
4. Jupyter Notebook 실행  
   ```bash
   jupyter notebook
   ```


### **2️⃣ Google Colab에서 실행**
💡 **Colab 링크를 클릭하면 바로 실행할 수 있습니다.**  
🔗 [Google Colab 실습 링크](https://colab.research.google.com/github/nhjung-phd/time-series-analysis)  

📄 **Colab 사용 가이드 문서**  
🔗 [Google Colab 사용 가이드](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/colab.md)


## 📖 데이터셋 다운로드  
본 실습에서는 **테슬라(TSLA) 주가 데이터**를 사용하여 시계열 예측을 수행합니다.  
실제 금융 데이터를 활용하여 딥러닝 기반 예측 모델을 학습하는 과정을 실습할 수 있습니다.  

### 📖 **데이터 출처 및 사용 방법**
- 📊 **데이터 출처**: Yahoo Finance API (`yfinance` 라이브러리 사용)
- 🕒 **사용 데이터**: 2022년 1월 1일부터 2024년 1월 1일까지의 테슬라(TSLA) 종가 데이터
- 🏷 **예측 목표**: 과거 데이터를 바탕으로 미래 주가 변동을 예측


### 📖 **Google Colab 사용 시 주의사항**
- Google Colab을 사용하는 경우, 아래 명령어를 실행하여 `yfinance` 패키지를 설치해야 합니다.  

  ```python
  !pip install yfinance



### 📖 **데이터 다운로드 및 저장**
- `data/` 폴더에 기본적인 샘플 데이터를 포함하고 있습니다.
- 직접 최신 데이터를 가져오려면 `yfinance` 라이브러리를 활용하여 다운로드할 수 있습니다.
  ```python
  import yfinance as yf
  df = yf.download("TSLA", start="2022-01-01", end="2024-01-01")
  df.to_csv("data/tesla_stock.csv")



### 📢 **주의사항**

- 📘 금융 데이터 변동성
금융 데이터는 시장 상황에 따라 변동될 수 있으며, 실행 시점에 따라 데이터 값이 달라질 수 있습니다.

- 📘 연구 및 교육 목적
본 실습은 연구 및 교육 목적으로 제공되며, 실제 투자 결정을 위한 금융 자문으로 사용할 수 없습니다.


### 🎯 기여 방법 (Contributing)
1. 이 프로젝트에 기여하고 싶다면, 저장소를 `fork`한 후 `pull request`를 보내주세요.
2. 제안 사항이나 오류 수정은 `Issues` 탭을 이용해주세요.


## 📖 참고 자료 (References)
- 🔗 [학술 저널](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/Journals.md)
- 🔗 [참고 문헌](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/References.md)
- 🔗 [Statsmodels 공식 문서](https://www.statsmodels.org/stable/index.html)
- 🔗 [TensorFlow Time Series](https://www.tensorflow.org/tutorials/structured_data/time_series)
- 🔗 [Scikit-Learn 공식 문서](https://scikit-learn.org/stable/)

---

👨‍🏫 **Instructor: 정낙현 박사 (Dr. Jung, Nak Hyun)**  

📧 Email: nhjung.phd@gmail.com

🚀 Created for aSSIST AI·Big Data Master’s Program  



