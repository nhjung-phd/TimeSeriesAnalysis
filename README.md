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
## 📌 실습 목록  
| 📌 실습 주제 | 📂 코드 파일 | 🏷️ 설명 | ▶️ 실행 |
|-------------|------------|-----------|----------|
| **1. 시계열 데이터 전처리** | `notebooks/01_data_preprocessing.ipynb` | 결측치 처리, 이상치 탐지 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/01_data_preprocessing.ipynb) |
| **2. 선형 회귀 기반 예측** | `notebooks/02_linear_regression.ipynb` | 단순 선형 회귀 분석 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/02_linear_regression.ipynb) |
| **3. 다중선형 회귀 기반 예측** | `notebooks/03_multi_linear_regression.ipynb` | 다중선형 회귀 분석 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/03_multi_linear_regression.ipynb) |
| **4. ARIMA 모델 예측** | `notebooks/03_arima_forecasting.ipynb` | ARIMA 모델을 이용한 시계열 예측 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/03_arima_forecasting.ipynb) |
| **5. LSTM 기반 딥러닝 예측** | `notebooks/04_lstm_forecasting.ipynb` | LSTM을 활용한 금융 데이터 예측 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/04_lstm_forecasting.ipynb) |
| **6. Transformer 기반 최신 모델** | `notebooks/05_transformer_forecasting.ipynb` | 최신 AI 모델을 활용한 시계열 분석 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/05_transformer_forecasting.ipynb) |

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

---

## 📌 데이터셋 다운로드  
- 실습 데이터는 `data/` 폴더에 포함되어 있습니다.  
- 필요한 경우, 금융 데이터 API(Yahoo Finance, Quandl)를 활용하여 데이터를 직접 수집할 수도 있습니다.

---

## 📌 기여 방법 (Contributing)
1. 이 프로젝트에 기여하고 싶다면, 저장소를 `fork`한 후 `pull request`를 보내주세요.
2. 제안 사항이나 오류 수정은 `Issues` 탭을 이용해주세요.

---

## 📌 참고 자료 (References)
- 📘 **"Time Series Analysis and Its Applications"**, Shumway & Stoffer (2017)
- 📘 **"Deep Learning for Time Series Forecasting"**, Jason Brownlee (2020)
- 🔗 [Statsmodels 공식 문서](https://www.statsmodels.org/stable/index.html)
- 🔗 [TensorFlow Time Series](https://www.tensorflow.org/tutorials/structured_data/time_series)

---

## 📌 License
이 프로젝트는 **MIT License** 하에 배포됩니다.

---

👨‍🏫 **Instructor: 정낙현 박사 (Jung, Nak Hyun)**  
📧 Email: nhjung.phd@gmail.com
🚀 Created for aSSIST AI·Big Data Master’s Program  



