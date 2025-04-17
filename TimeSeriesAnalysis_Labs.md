# 🛠 Time Series Analysis 실습 가이드

## 📌 실습 개요
이 강의에서는 다양한 시계열 분석 및 예측 기법을 실습합니다.  
Python을 활용하여 실제 데이터를 다루고, 모델을 구현하며, 성능을 평가합니다.

## 🚀 실습 환경
- Google Colab 또는 Jupyter Notebook 사용
- Python 3.x 및 필수 패키지 설치 (`requirements.txt` 참고)


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
| ARMA(AR+MA) 모델 | [`03_ARMA_forecasting_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/03_ARMA_forecasting_prompt.md) | [`03_ARMA_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/03_ARMA_forecasting.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/03_ARMA_forecasting.ipynb) |
| ARIMA 모델 | [`04_ARIMA_forecasting_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/04_ARIMA_forecasting_prompt.md) | [`04_ARIMA_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/04_ARIMA_forecasting.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/04_ARIMA_forecasting.ipynb) |
| SARIMA 모델 | [`04_SARIMA_forecasting_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/04_SARIMA_forecasting_prompt.md) | [`04_SARIMA_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/04_SARIMA_forecasting.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/04_SARIMA_forecasting.ipynb) |
| ADF,KPSS TEST | [`04_ADF_KPSS_TEST_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/04_ADF_KPSS_TEST_prompt.md) | [`04_ADF_KPSS_TEST.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/04_ADF_KPSS_TEST.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/04_ADF_KPSS_TEST.ipynb) |
| BoxJenkins_Method | [`04_BoxJenkins_Method_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/04_BoxJenkins_Method_prompt.md) | [`04_BoxJenkins_Method.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/04_BoxJenkins_Method.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/04_BoxJenkins_Method.ipynb) |
| VAR(벡터 자기회귀) 모델 | [`05_VAR_forecasting_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/05_VAR_forecasting_prompt.md) | [`05_VAR_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/05_VAR_forecasting.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/05_VAR_forecasting.ipynb) |
| SVAR(구조적 벡터 자기회귀) 모델 | [`06_SVAR_forecasting_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/06_SVAR_forecasting_prompt.md) | [`06_SVAR_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/06_SVAR_forecasting.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/06_SVAR_forecasting.ipynb) |


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

## **🗂 실습 27~31: 추가자료**  
| 실습 주제 | 프롬프트 파일 | 코드 파일 | ▶️ 실행 |
|-------------|--------------------------|--------------------------|----------|
| 이상치(IQR) |   | [`27_stl_iqr_outlier.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/27_stl_iqr_outlier.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/27_stl_iqr_outlier.ipynb) |
| 이상치(Shewhart) |  | [`28_stl_Shewhart_Outlier.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/28_stl_Shewhart_Outlier.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/28_stl_Shewhart_Outlier.ipynb) |
| 이상치(EWMA) |  | [`29_stl_ewma_outlier.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/29_stl_ewma_outlier.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/29_stl_ewma_outlier.ipynb) |
| IRF | | [`30_​Impulse_Response_Function.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/30_​Impulse_Response_Function.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/30_​Impulse_Response_Function.ipynb) |
| 앙상블(Ensemble) | | [`31_Ensemble.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/31_Ensemble.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/31_Ensemble.ipynb) |
| 다중공선성 | | [`32_Multicollinearity.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/32_Multicollinearity.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/32_Multicollinearity.ipynb) |


---


## 🛠 종목리스트
🔹 **[📂 종목리스트](examples/00.stock_list.md)**  


## 📄 시계열분석 논문 작성 가이드
🔹 **[📂 논문작성가이드](docs/timeseriesjournalpaper.md)**  


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



---

## 📌 참고자료: 시계열 분석 치트시트
시계열 분석에 필요한 이론, 모델 종류, 분석 기법 등을 한눈에 정리한 요약 자료입니다.

| 문서 제목       | 설명                                                                 | 링크                                                                                     |
|----------------|----------------------------------------------------------------------|------------------------------------------------------------------------------------------|
| 📖 `cheatsheet.md` | 시계열 분석 개요, 통계적 모델, 딥러닝 모델, 정상성 검정, 시각화, 이상치 탐지 등 실전 정리 | [📂 Cheatsheet 보기](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/docs/cheatsheet.md) |

---

## ✨ 주요 포함 내용

- 시계열 핵심 개념 요약 (정상성, 자기상관, 차분 등)
- AR, MA, ARIMA, SARIMA, VAR 등 통계 기반 예측 모델 정리
- RNN, LSTM, GRU, Transformer 등 딥러닝 기반 예측 구조 설명
- 정상성 검정 (ADF, KPSS), 성능 평가 지표
- 시각화 함수 및 이상치 탐지, 외생변수 포함 방법
- 파이썬 주요 라이브러리 정리 (`statsmodels`, `arch`, `sktime`, `darts`, `tensorflow`, `torch` 등)

---
