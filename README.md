# TimeSeriesAnalysis
Time Series Analysis

# 🕒 Time Series Analysis with Python  
🚀 **2025년 aSSIST AI·Big Data 석사과정 강의 실습 자료**  

이 저장소는 **"Time Series Analysis (시계열 분석)"** 강의의 실습 자료를 포함하고 있으며,  
Python을 활용한 다양한 시계열 분석 기법을 실습할 수 있도록 구성되었습니다.  

---

## 📌 강의 개요  
# 📌 2025년 3월 AI·빅데이터 석사(재학생반)  

## 📖 과목명: **모듈3 Time Series Analysis**  

### 📆 강의 기간  
🗓 **2025년 4월 5일(토) ~ 2025년 4월 18일(금)**  

### 🗣 강의 언어  
🇰🇷 **한국어 강의**  

### ⏳ 강의 시간  
📊 **총 24시간**  

### 📅 강의 일정  
| 날짜 | 요일 | 시간 |
|------|------|------|
| 2025년 4월 5일 | 토요일 | 08:30 ∼ 17:20 (8시간) |
| 2025년 4월 11일 | 금요일 | 18:30 ~ 22:20 (4시간) |
| 2025년 4월 12일 | 토요일 | 08:30 ∼ 17:20 (8시간) |
| 2025년 4월 18일 | 금요일 | 18:30 ~ 22:20 (4시간) |  

💡 **토요일 점심시간**: 12:30 ~ 13:30 (60분)  

### 📍 강의 장소  
🏢 **aSSIST / Finland Tower**  
📍 **서울시 서대문구 이화여대2길 46**  
* 강의장은 추후 안내 예정  

### 👨‍🎓 교육 인원  
👥 **약 20명 예정**  

---  
✅ 본 강의는 **시계열 분석(Time Series Analysis)** 에 대한 심층적인 이해와 실습을 목표로 합니다.  
✅ Python을 활용한 시계열 데이터 분석, 머신러닝 및 딥러닝 기반 예측 모델을 다룹니다.  

📌 **강의 및 실습 자료는 GitHub을 통해 제공될 예정입니다.** 🚀  


---

## 📌 실습 환경 설정  
### 🔧 **필수 라이브러리 설치**  
실습을 위해 아래 패키지를 설치해야 합니다.  
```bash
pip install numpy pandas matplotlib seaborn scikit-learn statsmodels tensorflow torch transformers
```
💡 **Google Colab에서도 실행 가능하며, 별도 설치 없이 진행할 수 있습니다.**

---

## 📌 실습 내용 및 코드 실행 방법  
### **📂 폴더 구조**
```bash
📂 time-series-analysis
│── 📂 data                    # 실습에 사용할 데이터셋
│── 📂 notebooks                # Jupyter Notebook 실습 코드
│── 📂 models                   # 저장된 모델 파일
│── README.md                   # 초기 안내 파일
│── requirements.txt            # 패키지 설치 파일
```

---
## 📌 실습1 목록  
| 📌 실습 주제 | 📂 코드 파일 | 🏷️ 설명 | ▶️ 실행 |
|-------------|------------|-----------|----------|
| **1. 시계열 데이터 전처리** | `notebooks/01_data_preprocessing.ipynb` | 결측치 처리, 이상치 탐지 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/01_data_preprocessing.ipynb) |

## 📌 실습2 목록  
| 📌 실습 주제 | 📂 코드 파일 | 🏷️ 설명 | ▶️ 실행 |
|-------------|------------|-----------|----------|
| **1. 선형 회귀 기반 예측** | `notebooks/02_linear_regression.ipynb` | 단순 선형 회귀 분석 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/02_linear_regression.ipynb) |
| **2. 다중선형 회귀 기반 예측** | `notebooks/03_multi_linear_regression.ipynb` | 다중선형 회귀 분석 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/03_multi_linear_regression.ipynb) |
| **3. 다항 회귀 기반 예측** | `notebooks/04_Polynomial_Regression.ipynb` | 다항 회귀(Polynomial Regression) 분석 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/04_Polynomial_Regression.ipynb) |

## 📌 실습3 목록  
| 📌 실습 주제 | 📂 코드 파일 | 🏷️ 설명 | ▶️ 실행 |
|-------------|------------|-----------|----------|
| **1. ANN 기반 예측** | `notebooks/05_ann_forecasting.ipynb` | ANN(인공신경망) 기반 시계열 예측 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/05_ann_forecasting.ipynb) |
| **2. RNN 기반 예측** | `notebooks/06_rnn_forecasting.ipynb` | RNN(순환신경망) 기반 시계열 예측 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/06_rnn_forecasting.ipynb) |
| **3. LSTM 기반 예측** | `notebooks/07_lstm_forecasting.ipynb` | LSTM(Long Short-Term Memory) 기반 시계열 예측 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/07_lstm_forecasting.ipynb) |
| **4. GRU 기반 예측** | `notebooks/08_gru_forecasting.ipynb` | GRU(Gated Recurrent Unit) 기반 시계열 예측 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/08_gru_forecasting.ipynb) |
| **5. CNN 기반 예측** | `notebooks/09_cnn_forecasting.ipynb` | CNN(Convolutional Neural Network) 기반 시계열 예측 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/09_cnn_forecasting.ipynb) |
| **6. Transformer Encoder 기반 예측** | `notebooks/10_transformer_encoder.ipynb` | Transformer Encoder 기반 시계열 예측 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/10_transformer_encoder.ipynb) |


---
🔹 **Colab 실행 버튼을 클릭하면 같은 창에서 열립니다.**  
🔹 **새로운 탭에서 열려면** `Ctrl + 클릭 (Windows/Linux)` 또는 `Cmd + 클릭 (Mac)`을 사용하세요!  

---

## 📌 코드 실행 방법
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

---

### **2️⃣ Google Colab에서 실행**
💡 **Colab 링크를 클릭하면 바로 실행할 수 있습니다.**  
🔗 [Google Colab 실습 링크](https://colab.research.google.com/github/nhjung-phd/time-series-analysis)  

📄 **Colab 사용 가이드 문서**  
🔗 [Google Colab 사용 가이드](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/colab.md)

---

## 📌 데이터셋 다운로드  
본 실습에서는 **테슬라(TSLA) 주가 데이터**를 사용하여 시계열 예측을 수행합니다.  
실제 금융 데이터를 활용하여 딥러닝 기반 예측 모델을 학습하는 과정을 실습할 수 있습니다.  

### 📌 **데이터 출처 및 사용 방법**
- 📊 **데이터 출처**: Yahoo Finance API (`yfinance` 라이브러리 사용)
- 🕒 **사용 데이터**: 2022년 1월 1일부터 2024년 1월 1일까지의 테슬라(TSLA) 종가 데이터
- 🏷 **예측 목표**: 과거 데이터를 바탕으로 미래 주가 변동을 예측

---

### 📌 **Google Colab 사용 시 주의사항**
- Google Colab을 사용하는 경우, 아래 명령어를 실행하여 `yfinance` 패키지를 설치해야 합니다.  

  ```python
  !pip install yfinance


---

### 📌 **데이터 다운로드 및 저장**
- `data/` 폴더에 기본적인 샘플 데이터를 포함하고 있습니다.
- 직접 최신 데이터를 가져오려면 `yfinance` 라이브러리를 활용하여 다운로드할 수 있습니다.
  ```python
  import yfinance as yf
  df = yf.download("TSLA", start="2022-01-01", end="2024-01-01")
  df.to_csv("data/tesla_stock.csv")


---

### 📌 **주의사항**

- 📘 금융 데이터 변동성
금융 데이터는 시장 상황에 따라 변동될 수 있으며, 실행 시점에 따라 데이터 값이 달라질 수 있습니다.

- 📘 연구 및 교육 목적
본 실습은 연구 및 교육 목적으로 제공되며, 실제 투자 결정을 위한 금융 자문으로 사용할 수 없습니다.

--


## 📌 기여 방법 (Contributing)
1. 이 프로젝트에 기여하고 싶다면, 저장소를 `fork`한 후 `pull request`를 보내주세요.
2. 제안 사항이나 오류 수정은 `Issues` 탭을 이용해주세요.

---

## 📌 참고 자료 (References)
- 📘 **"Time Series Analysis and Its Applications"**, Shumway & Stoffer (2017)
- 📘 **"Deep Learning for Time Series Forecasting"**, Jason Brownlee (2020)
- 🔗 [Statsmodels 공식 문서](https://www.statsmodels.org/stable/index.html)
- 🔗 [TensorFlow Time Series](https://www.tensorflow.org/tutorials/structured_data/time_series)
- 🔗 [Scikit-Learn 공식 문서](https://scikit-learn.org/stable/)

---

## 📌 License
이 프로젝트는 MIT License 하에 배포됩니다.

✅ 자유로운 사용: 개인 및 상업적 용도로 자유롭게 사용할 수 있습니다.
✅ 수정 및 배포 가능: 프로젝트를 자유롭게 수정하고, 배포하거나 상업적 목적으로 활용할 수 있습니다.
✅ 공개 및 공유 가능: 변경한 버전을 다시 공개하거나 공유할 수 있습니다.

❗ 단, 다음 조건을 따라야 합니다:
🔹 저작권 표기 유지: 원본 프로젝트의 저작권 정보를 반드시 유지해야 합니다.
🔹 책임 없음: 이 소프트웨어를 사용하여 발생하는 문제(예: 버그, 보안 문제 등)에 대해 원작자는 책임을 지지 않습니다.

---

👨‍🏫 **Instructor: 정낙현 박사 (Jung, Nak Hyun)**  
📧 Email: nhjung.phd@gmail.com
🚀 Created for aSSIST AI·Big Data Master’s Program  



