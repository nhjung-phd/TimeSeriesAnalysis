# 🛠 Time Series Analysis 실습 가이드

## 📌 실습 개요
이 강의에서는 다양한 시계열 분석 및 예측 기법을 실습합니다.  
Python을 활용하여 실제 데이터를 다루고, 모델을 구현하며, 성능을 평가합니다.

## 🚀 실습 환경
- Google Colab 또는 Jupyter Notebook 사용
- Python 3.x 및 필수 패키지 설치 (`requirements.txt` 참고)


## ⚙️ 실습 환경 설정  

### 💻 **브라우저 실습도 제공됩니다:** 
[Live Web App](https://nhjung-phd.github.io/TimeSeriesAnalysis)  
> (CSV 샘플: `data/tsla_sample.csv` 자동 로드)
---

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
│── 📂 notebooks                # Jupyter Notebook 파이썬 실습 코드
│── 📂 prompts                  # GPT 프롬프트 모음
│── 📂 R                        # Jupyter Notebook R 실습 코드
│── 📂 models                   # 저장된 모델 파일
│── README.md                   # 초기 안내 파일
│── requirements.txt            # 패키지 설치 파일
```

## 📚 부교재 연계 강의 목차

아래는 강의용 부교재와 부교재 실습 파일을 연결한 인덱스입니다.  
각 장은 개념 설명용 부교재와, 그 장에 대응되는 실습 노트북으로 구성됩니다.

---

## Part I. Foundations of Time Series Analysis

### Chapter 1. 시계열분석이란 무엇인가
- 부교재 파일: [`ch01_intro_time_series.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch01_intro_time_series.md)
- 부교재 실습 파일: [`00_Data_Loading_and_Exploration.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/notebooks/00_Data_Loading_and_Exploration.ipynb)
- 주제: 시계열 데이터의 정의, 시간 순서의 중요성, 예측·설명·인과의 구분

### Chapter 2. 시계열 데이터의 구조와 시각화
- 부교재 파일: [`ch02_ts_structure.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch02_ts_structure.md)
- 부교재 실습 파일 1: [`01_Time_data_preprocessing.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/notebooks/01_Time_data_preprocessing.ipynb)
- 부교재 실습 파일 2: [`02_TimeSeries_Decomposition.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/notebooks/02_TimeSeries_Decomposition.ipynb)
- 주제: 시간 인덱스, 빈도, 결측치·이상치, 분해와 시각화

### Chapter 3. 정상성, 자기상관, 그리고 백색잡음
- 부교재 파일: [`ch03_stationarity_acf.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch03_stationarity_acf.md)
- 부교재 실습 파일: [`03_Stationarity_and_Autocorrelation.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/notebooks/03_Stationarity_and_Autocorrelation.ipynb)
- 주제: 정상성, 단위근, 랜덤워크, ACF/PACF, 차분

### Chapter 4. AR, MA, ARMA 모형의 기초
- 부교재 파일: [`ch04_arma.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch04_arma.md)
- 부교재 실습 파일: [`04_ARMA_Modeling.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/notebooks/04_ARMA_Modeling.ipynb)
- 주제: AR/MA/ARMA 구조, ACF/PACF 해석, 인과성과 가역성

---

## Part II. Classical Time Series Models

### Chapter 5. ARIMA와 Box–Jenkins 절차
- 부교재 파일: [`ch05_arima.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch05_arima.md)
- 부교재 실습 파일: [`05_ARIMA_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/notebooks/05_ARIMA_forecasting.ipynb)
- 주제: ARIMA 모형, 식별·추정·진단·예측, auto_arima, Ljung-Box 검정

### Chapter 6. 계절성과 SARIMA
- 부교재 파일: [`ch06_sarima.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch06_sarima.md)
- 부교재 실습 파일: [`06_SARIMA_Modeling.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/notebooks/06_SARIMA_Modeling.ipynb)
- 주제: 계절성, 계절 차분, SARIMA 구조, 계절 데이터 예측

### Chapter 7. 예측, 백테스트, 성능평가
- 부교재 파일: [`ch07_forecasting.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch07_forecasting.md)
- 부교재 실습 파일: [`07_Forecasting_and_Evaluation.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/notebooks/07_Forecasting_and_Evaluation.ipynb)
- 주제: 시계열 예측 절차, walk-forward validation, MAPE/RMSE 등 평가 지표

---

## Part III. Multivariate Time Series and Structural Analysis

### Chapter 8. 다변량 시계열과 VAR
- 부교재 파일: [`ch08_var.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch08_var.md)
- 부교재 실습 파일 1: [`08_VAR_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/notebooks/08_VAR_forecasting.ipynb)
- 부교재 실습 파일 2: [`08_SVAR_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/notebooks/08_SVAR_forecasting.ipynb)
- 주제: VAR 모형, 상호작용 구조, 다변량 예측

### Chapter 9. Granger 인과성, 충격반응, 분산분해
- 부교재 파일: [`ch09_granger.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch09_granger.md)
- 부교재 실습 파일: [`09_GrangerCausality_VAR.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/notebooks/09_GrangerCausality_VAR.ipynb)
- 주제: Granger causality, impulse response, FEVD

### Chapter 10. 공적분과 장기균형 관계
- 부교재 파일: [`ch10_cointegration.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch10_cointegration.md)
- 부교재 실습 파일: [`10_Cointegration_and_VECM.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/notebooks/10_Cointegration_and_VECM.ipynb)
- 주제: 공적분, 장기균형, 오차수정모형(ECM/VECM)

### Chapter 11. 구조변화, 이상치, 개입분석
- 부교재 파일: [`ch11_breaks.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch11_breaks.md)
- 부교재 실습 파일: [`11_StructuralBreaks_and_Intervention.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/notebooks/11_StructuralBreaks_and_Intervention.ipynb)
- 주제: structural breaks, 이상치, intervention analysis

---

## Part IV. Advanced Topics and Applications

### Chapter 12. 시계열 인과추론 입문
- 부교재 파일: [`ch12_causal_ts.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch12_causal_ts.md)
- 부교재 실습 파일: [`12_causal_time_series_intro.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/notebooks/12_causal_time_series_intro.ipynb)
- 주제: interrupted time series, comparative ITS, 정책효과 분석, 시계열 인과추론의 기초

### Chapter 13. 머신러닝과 딥러닝 기반 시계열의 개요
- 부교재 파일: [`ch13_ml_dl.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch13_ml_dl.md)
- 부교재 실습 파일: [`13_ML_DL_Forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/notebooks/13_ML_DL_Forecasting.ipynb)
- 주제: ML/DL 기반 시계열 예측, lag feature, MLP, LSTM, 전통 모형과의 비교

### Chapter 14. 금융·경영·환경 데이터 응용
- 부교재 파일: [`ch14_applications.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch14_applications.md)
- 부교재 실습 파일: [`14_Domain_Specific_Applications.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/notebooks/14_Domain_Specific_Applications.ipynb)
- 주제: 주가·매출·수요·환경 데이터 등 도메인별 시계열 응용

### Chapter 15. 재현 가능한 시계열분석과 GitHub 운영
- 부교재 파일: [`ch15_github.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch15_github.md)
- 부교재 실습 파일: 추후 추가 예정
- 주제: GitHub 기반 강의 운영, 재현가능성, 프로젝트 구조화


## **🗂 실습 00: 시계열 데이터 수집 및 전처리**  
| 실습 주제 | 프롬프트 파일 | 코드 파일 | ▶️ 파이썬 |▶️ R |
|-------------|--------------------------|--------------------------|----------|----------|
| 가격 데이터 수집 | [`00_pricedata_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/00_pricedata_prompt.md) | [`00_pricedata.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_pricedata.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_pricedata.ipynb) |[![Run R in Colab](https://img.shields.io/badge/Run-R%20in%20Colab-276DC3?logo=r&logoColor=white)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/R/00_pricedata_R.ipynb) |
| 데이터 전처리 | [`00_data_preprocessing_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/00_data_preprocessing_prompt.md) | [`00_data_preprocessing.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_data_preprocessing.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_data_preprocessing.ipynb) |[![Run R in Colab](https://img.shields.io/badge/Run-R%20in%20Colab-276DC3?logo=r&logoColor=white)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/R/00_data_preprocessing_R.ipynb) |

## **🗂 실습 00: 다양한 시계열 예제(비주가 데이터)** 
| 실습 주제 | 프롬프트 파일 | 코드 파일 | ▶️ 파이썬 |▶️ R |
|-------------|--------------------------|--------------------------|----------|----------|
| 날씨 데이터(시간별)| | [`00_OpenMeteo_HourlyWeather_Seoul_Busan_NewYork.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_OpenMeteo_HourlyWeather_Seoul_Busan_NewYork.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_OpenMeteo_HourlyWeather_Seoul_Busan_NewYork.ipynb) | |
| 전력·에너지(시간별)|  | [`00_OPSD_TimeSeries_Energy_DE.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_OPSD_TimeSeries_Energy_DE.ipynb)| [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_OPSD_TimeSeries_Energy_DE.ipynb) | |
| 지진(Earthquakes) | | [`00_USGS_Earthquakes.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_USGS_Earthquakes.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_USGS_Earthquakes.ipynb)| |
| 위키 조회수(일별)|  | [`00_Wikipedia_Pageviews.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_Wikipedia_Pageviews.ipynb)| [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_Wikipedia_Pageviews.ipynb)| |

## **🗂 실습 00: 시계열의 기초**  
| 실습 주제 | 프롬프트 파일 | 코드 파일 | ▶️ 파이썬 |▶️ R |
|-------------|--------------------------|--------------------------|----------|----------|
| 이동평균,지수평활|  | [`00_MA_SES.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_MA_SES.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_MA_SES.ipynb) | |
| 요소분해 | | [`00_STL_Decomposition.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_STL_Decomposition.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_STL_Decomposition.ipynb) | |
| 자기상관 | | [`00_Autocorrelation.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_Autocorrelation.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_Autocorrelation.ipynb) | |
| ACF/PACF | | [`00_ACF_PACF_LjungBox.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_ACF_PACF_LjungBox.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_ACF_PACF_LjungBox.ipynb) | |
| 정상성 | | [`00_Stationarity.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_Stationarity.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_Stationarity.ipynb) | |
| 차분 | | [`00_Differencing.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_Differencing.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_Differencing.ipynb) | |
| 백색잡음 | | [`00_WhiteNoise.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_WhiteNoise.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_WhiteNoise.ipynb) | |


## **🗂 실습 01~06: 시계열 예측 (고전적 접근)**  
| 실습 주제 | 프롬프트 파일 | 코드 파일 | ▶️ 파이썬 |▶️ R |
|-------------|--------------------------|--------------------------|----------|----------|
| AR(자동회귀) 모델 | [`01_AR_forecasting_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/01_AR_forecasting_prompt.md) | [`01_AR_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/01_AR_forecasting.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/01_AR_forecasting.ipynb) | [![Run R in Colab](https://img.shields.io/badge/Run-R%20in%20Colab-276DC3?logo=r&logoColor=white)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/R/01_AR_forecasting_R.ipynb) |
| MA(이동 평균) 모델 | [`02_MA_forecasting_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/02_MA_forecasting_prompt.md) | [`02_MA_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/02_MA_forecasting.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/02_MA_forecasting.ipynb) | [![Run R in Colab](https://img.shields.io/badge/Run-R%20in%20Colab-276DC3?logo=r&logoColor=white)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/R/02_MA_forecasting_R.ipynb)|
| ARMA(AR+MA) 모델 | [`03_ARMA_forecasting_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/03_ARMA_forecasting_prompt.md) | [`03_ARMA_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/03_ARMA_forecasting.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/03_ARMA_forecasting.ipynb) | [![Run R in Colab](https://img.shields.io/badge/Run-R%20in%20Colab-276DC3?logo=r&logoColor=white)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/R/03_ARMA_forecasting_R.ipynb)|
| ARIMA 모델 | [`04_ARIMA_forecasting_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/04_ARIMA_forecasting_prompt.md) | [`04_ARIMA_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/04_ARIMA_forecasting.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/04_ARIMA_forecasting.ipynb) | [![Run R in Colab](https://img.shields.io/badge/Run-R%20in%20Colab-276DC3?logo=r&logoColor=white)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/R/04_ARIMA_forecasting_R.ipynb)|
| SARIMA 모델 | [`04_SARIMA_forecasting_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/04_SARIMA_forecasting_prompt.md) | [`04_SARIMA_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/04_SARIMA_forecasting.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/04_SARIMA_forecasting.ipynb) | [![Run R in Colab](https://img.shields.io/badge/Run-R%20in%20Colab-276DC3?logo=r&logoColor=white)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/R/04_SARIMA_forecasting_R.ipynb)|
| SARIMAX  |   | [`00_ARIMAX_SARIMAX.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_ARIMAX_SARIMAX.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_ARIMAX_SARIMAX.ipynb) | |
| ADF,KPSS TEST | [`04_ADF_KPSS_TEST_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/04_ADF_KPSS_TEST_prompt.md) | [`04_ADF_KPSS_TEST.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/04_ADF_KPSS_TEST.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/04_ADF_KPSS_TEST.ipynb) | [![Run R in Colab](https://img.shields.io/badge/Run-R%20in%20Colab-276DC3?logo=r&logoColor=white)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/R/04_ADF_KPSS_TEST_R.ipynb)|
| BoxJenkins_Method | [`04_BoxJenkins_Method_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/04_BoxJenkins_Method_prompt.md) | [`04_BoxJenkins_Method.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/04_BoxJenkins_Method.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/04_BoxJenkins_Method.ipynb) | [![Run R in Colab](https://img.shields.io/badge/Run-R%20in%20Colab-276DC3?logo=r&logoColor=white)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/R/04_BoxJenkins_Method_R.ipynb)|
| VAR(벡터 자기회귀) 모델 | [`05_VAR_forecasting_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/05_VAR_forecasting_prompt.md) | [`05_VAR_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/05_VAR_forecasting.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/05_VAR_forecasting.ipynb) |  [![Run R in Colab](https://img.shields.io/badge/Run-R%20in%20Colab-276DC3?logo=r&logoColor=white)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/R/05_VAR_forecasting_R.ipynb)|
| SVAR(구조적 벡터 자기회귀) 모델 | [`06_SVAR_forecasting_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/06_SVAR_forecasting_prompt.md) | [`06_SVAR_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/06_SVAR_forecasting.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/06_SVAR_forecasting.ipynb) |[![Run R in Colab](https://img.shields.io/badge/Run-R%20in%20Colab-276DC3?logo=r&logoColor=white)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/R/06_SVAR_forecasting_R.ipynb)|


## **🗂 실습 07: Granger Causality 테스트**  
| 실습 주제 | 프롬프트 파일 | 코드 파일 | ▶️ 파이썬 |▶️ R |
|-------------|--------------------------|--------------------------|----------|---------|
| Granger Causality Test + VAR | [`07_GrangerCausality_VAR_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/07_GrangerCausality_VAR_prompt.md) | [`07_GrangerCausality_VAR.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/07_GrangerCausality_VAR.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/07_GrangerCausality_VAR.ipynb) |[![Run R in Colab](https://img.shields.io/badge/Run-R%20in%20Colab-276DC3?logo=r&logoColor=white)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/R/07_Granger_VAR_Forecasting_R.ipynb)|


## **🗂 실습 08~10: 금융 시계열 변동성 모델링**  
| 실습 주제 | 프롬프트 파일 | 코드 파일 | ▶️ 파이썬 |▶️ R |
|-------------|--------------------------|--------------------------|----------|---------|
| ARCH 모델 | [`08_ARCH_volatility_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/08_ARCH_volatility_prompt.md) | [`08_ARCH_volatility.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/08_ARCH_volatility.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/08_ARCH_volatility.ipynb) | [![Run R in Colab](https://img.shields.io/badge/Run-R%20in%20Colab-276DC3?logo=r&logoColor=white)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/R/08_ARCH_Tesla_Volatility_R.ipynb)|
| GARCH 모델 | [`09_GARCH_volatility_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/09_GARCH_volatility_prompt.md) | [`09_GARCH_volatility.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/09_GARCH_volatility.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/09_GARCH_volatility.ipynb) |  |
| 칼만필터    |   | [`10_Kalman_Filter.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/10_Kalman_Filter.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/10_Kalman_Filter.ipynb) | [![Run R in Colab](https://img.shields.io/badge/Run-R%20in%20Colab-276DC3?logo=r&logoColor=white)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/R/10_Kalman_Filter_R.ipynb)|

## **🗂 실습 11~13: 회귀 기반 예측**  
| 실습 주제 | 프롬프트 파일 | 코드 파일 | ▶️ 실행 |
|-------------|--------------------------|--------------------------|----------|
| 단순 선형 회귀 | [`11_linear_regression_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/11_linear_regression_prompt.md) | [`11_linear_regression.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/11_linear_regression.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/11_linear_regression.ipynb) |
| 다중 선형 회귀 | [`12_multi_linear_regression_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/12_multi_linear_regression_prompt.md) | [`12_multi_linear_regression.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/12_multi_linear_regression.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/12_multi_linear_regression.ipynb) |
| 다항 회귀 | [`13_Polynomial_Regression_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/13_Polynomial_Regression_prompt.md) | [`13_Polynomial_Regression.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/13_Polynomial_Regression.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/13_Polynomial_Regression.ipynb) |

## **🗂 실습 14~19: 머신러닝 기반 분류·군집 (TSLA 방향/레짐 분석)**  
| 실습 주제 | 프롬프트 파일 | 코드 파일 | ▶️ 실행 |
|-------------|--------------------------|--------------------------|----------|
| 로지스틱 회귀 (분류) | | [`14_LogisticRegression_Classification.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/14_LogisticRegression_Classification.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/14_LogisticRegression_Classification.ipynb) |
| 결정트리 (분류) | | [`15_DecisionTree_Classification.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/15_DecisionTree_Classification.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/15_DecisionTree_Classification.ipynb) |
| 랜덤포레스트 (분류) | | [`16_RandomForest_Classification.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/16_RandomForest_Classification.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/16_RandomForest_Classification.ipynb) |
| SVM (RBF) (분류) | | [`17_SVM_Classification.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/17_SVM_Classification.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/17_SVM_Classification.ipynb) |
| k-NN (분류) |  | [`18_kNN_Classification.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/18_kNN_Classification.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/18_kNN_Classification.ipynb) |
| GBM (분류) |  | [`19_GBM_Classification.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/19_GBM_Classification.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/19_GBM_Classification.ipynb) |
| K-Means (군집/레짐 탐지) |  | [`19_KMeans_Clustering.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/19_KMeans_Clustering.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/19_KMeans_Clustering.ipynb) |
| Naive Bayes (분류) | | [`19_NaiveBayes_Classification.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/19_NaiveBayes_Classification.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/19_NaiveBayes_Classification.ipynb) |
| Neural Network (MLP) (분류) |  | [`19_NeuralNetwork_MLP_Classification.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/19_NeuralNetwork_MLP_Classification.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/19_NeuralNetwork_MLP_Classification.ipynb) |
| 머신러닝|   | [`33_Timeseries_10.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/33_Timeseries_10.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/33_Timeseries_10.ipynb) |

## **🗂 실습 21~26: 머신러닝 & 딥러닝 기반 예측**  
| 실습 주제 | 프롬프트 파일 | 코드 파일 | ▶️ 실행 |
|-------------|--------------------------|--------------------------|----------|
| ANN(MLP) 기반 예측 | [`21_ann_forecasting_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/21_ann_forecasting_prompt.md) | [`21_ann_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/21_ann_forecasting.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/21_ann_forecasting.ipynb) |
| RNN 기반 예측 | [`22_rnn_forecasting_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/22_rnn_forecasting_prompt.md) | [`22_rnn_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/22_rnn_forecasting.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/22_rnn_forecasting.ipynb) |
| LSTM 기반 예측 | [`23_lstm_forecasting_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/23_lstm_forecasting_prompt.md) | [`23_lstm_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/23_lstm_forecasting.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/23_lstm_forecasting.ipynb) |
| GRU 기반 예측 | [`24_gru_forecasting_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/24_gru_forecasting_prompt.md) | [`24_gru_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/24_gru_forecasting.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/24_gru_forecasting.ipynb) |
| CNN 기반 예측 | [`25_cnn_forecasting_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/25_cnn_forecasting_prompt.md) | [`25_cnn_forecasting.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/25_cnn_forecasting.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/25_cnn_forecasting.ipynb) |
| Transformer 기반 예측 | [`26_transformer_encoder_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/26_transformer_encoder_prompt.md) | [`26_transformer_encoder.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/26_transformer_encoder.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/26_transformer_encoder.ipynb) |
| Prophet 기반 예측 | [`26_Prophet_forecasting_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/26_Prophet_forecasting_prompt.md) | [`26_prophet_forecast.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/26_prophet_forecast.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/26_prophet_forecast.ipynb) |

## **🗂 실습 27~31: 추가자료**  
| 실습 주제 | 프롬프트 파일 | 코드 파일 | ▶️ 실행 |
|-------------|--------------------------|--------------------------|----------|
| 이상치(IQR) |   | [`27_stl_iqr_outlier.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/27_stl_iqr_outlier.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/27_stl_iqr_outlier.ipynb) |
| 이상치(Shewhart) |  | [`28_stl_Shewhart_Outlier.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/28_stl_Shewhart_Outlier.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/28_stl_Shewhart_Outlier.ipynb) |
| 이상치(EWMA) |  | [`29_stl_ewma_outlier.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/29_stl_ewma_outlier.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/29_stl_ewma_outlier.ipynb) |
| IRF | | [`30_​Impulse_Response_Function.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/30_​Impulse_Response_Function.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/30_​Impulse_Response_Function.ipynb) |
| 앙상블(Ensemble) | | [`31_Ensemble.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/31_Ensemble.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/31_Ensemble.ipynb) |
| 다중공선성 | | [`32_Multicollinearity.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/32_Multicollinearity.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/32_Multicollinearity.ipynb) |


## **🗂 실습 33: 추가자료**  
| 실습 주제 | 프롬프트 파일 | 코드 파일 | ▶️ 실행 |
|-------------|--------------------------|--------------------------|----------|
| 공공데이터시계열분석 |[`33_Seoul_Air_Quality_prompt.md`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/prompts/33_Seoul_Air_Quality_prompt.md) | [`33_seoul_air_quality_timeseries_app.py`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/streamlit/33_seoul_air_quality_timeseries_app.py) | streamlit run seoul_air_quality_timeseries_app.py|

## **🗂 실습 40~42: 평가지표**  
| 실습 주제 | 프롬프트 파일 | 코드 파일 | ▶️ 실행 |
|-------------|--------------------------|--------------------------|----------|
| 회귀 평가 지표 (오차 기반 / 설명력 기반) |  | [`40_Regression_Evaluation_Metrics.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/40_Regression_Evaluation_Metrics.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/40_Regression_Evaluation_Metrics.ipynb) |
| 금융 백테스트 성과 지표 (샤프 / 소르티노 / MDD 등) |  | [`41_Backtest_Performance_Metrics.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/41_Backtest_Performance_Metrics.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/41_Backtest_Performance_Metrics.ipynb) |
| 분류 평가 지표 (Accuracy / Precision / Recall / F1-score / ROC-AUC / Confusion Matrix) |  | [`42_Classification_Evaluation_Metrics.ipynb`](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/42_Classification_Evaluation_Metrics.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/42_Classification_Evaluation_Metrics.ipynb) |

## **🗂 실습 : Nocode Tool료**  
| 실습 주제 | 실습파일| 데이터|
|-------------|--------------------------|--------------------------|
| Orange | [오렌지실습파일](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/examples/Orange_ARIMA.ows)|[테슬라주가1](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/examples/TSLA_close.csv) [테슬라주가2](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/examples/TSLA_close_all.csv)|


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
