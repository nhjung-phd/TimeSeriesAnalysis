# 📌 **Time Series Analysis 강의계획서 및 과제/평가 안내**

🤓 **2026년 AI·빅데이터 석사과정 (26.03 과정)**

📖 **과목명**: **Module 2. Time Series Analysis**

📆 **강의 기간**: **2026년 09월 19일(토) ~ 2026년 10월 16일(금)**

🗣 **강의 언어**: 🇰🇷 **한국어 강의**

⏳ **강의 시간**: 📊 **총 24시간**

👨‍🏫 **강사**: 정낙현

👥 **교육 인원**: **총 22명 (AI·빅데이터 SDG 22명)**  
※ 수강생은 변동될 수 있습니다.

🏫 **수업 진행 방식**: **하이브리드(온라인·오프라인 병행)**

---

## 📅 **강의 일정**

| 날짜 | 요일 | 시간 | 시수 |
|---|---|---:|---:|
| 2026년 09월 19일 | 토요일 | 08:30 ~ 17:20 | 8시간 |
| 2026년 10월 02일 | 금요일 | 18:30 ~ 22:20 | 4시간 |
| 2026년 10월 10일 | 토요일 | 08:30 ~ 17:20 | 8시간 |
| 2026년 10월 16일 | 금요일 | 18:30 ~ 22:20 | 4시간 |
| **합계** |  |  | **24시간** |

💡 **토요일 점심시간**: 12:30 ~ 13:30 (60분)

---

## 📍 **강의 장소**

### 🏢 오프라인 강의실

**aSSIST Finland Tower 지하 1강의장**  
📍 서울시 서대문구 이화여대2길 46

### 💻 온라인 강의실

**Zoom**

- 회의 ID: `216-045-5558`
- PW: `332314`
- URL: [https://us06web.zoom.us/j/2160455558](https://us06web.zoom.us/j/2160455558)

---

# 📖 **강의 개요**

본 강의는 **시계열 분석(Time Series Analysis)**의 기본 개념부터 전통적 통계모형, 
머신러닝·딥러닝 및 최신 AI 기반 시계열 분석 방법까지 단계적으로 다룹니다.

시계열 데이터의 구조를 이해하는 것에서 출발하여 정상성, 자기상관, AR·MA·ARMA·ARIMA·SARIMA 등의 
전통적인 시계열 모형을 학습하고, VAR·SVAR·Granger Causality와 같은 다변량 시계열 분석으로 확장합니다.

또한 회귀모형, 머신러닝 기반 분류·군집, ANN·RNN·LSTM·GRU·Transformer 등의 
AI 기반 시계열 분석 방법을 실습합니다.

특히 본 과정에서는 단순히 **“미래 값을 얼마나 정확히 예측할 것인가?”**에 머물지 않고,

> **“왜 이런 변화가 발생했는가?”**  
> **“정책이나 사건이 시계열에 어떤 영향을 주었는가?”**

라는 질문을 다룰 수 있도록 **시계열 기반 인과추론(Time-Series Causal Inference)**도 함께 소개합니다.

금융 데이터를 주요 예제로 활용하되, 날씨·기후·대기질·전력·에너지·검색 트렌드·콘텐츠 조회수·지진 등 
다양한 실제 시계열 데이터를 활용하여 분석 방법의 적용 범위를 확장합니다.

---

# 🎯 **강의 목적 (Objective of the Course)**

🚀 본 강의의 목적은 시계열 데이터를 단순히 예측하는 것을 넘어,

**데이터 이해 → 구조 진단 → 모델 선택 → 예측 → 검증 → 해석 → 의사결정**

으로 이어지는 전체 분석 과정을 이해하고 실제 데이터에 적용할 수 있는 역량을 기르는 것입니다.

---

# 🎯 **강의 목표**

본 강의를 통해 다음 역량을 습득하는 것을 목표로 합니다.

1. **시계열 데이터의 특성과 구조를 이해하고 분석할 수 있다.**
2. **정상성, 자기상관, 계절성, 추세 등을 진단할 수 있다.**
3. **AR, MA, ARMA, ARIMA, SARIMA 등의 전통적 시계열 모델을 적용할 수 있다.**
4. **VAR, SVAR, Granger Causality 등 다변량 시계열 분석 방법을 이해할 수 있다.**
5. **회귀 및 머신러닝 기반 시계열 분석·분류 모델을 구축할 수 있다.**
6. **ANN, RNN, LSTM, GRU, Transformer 등 딥러닝 기반 시계열 모델을 이해하고 적용할 수 있다.**
7. **ARCH/GARCH 등 금융시장의 변동성 모델을 이해할 수 있다.**
8. **Kalman Filter 및 상태공간모형의 개념을 이해할 수 있다.**
9. **시계열 기반 인과추론을 통해 정책·사건·개입의 효과를 분석할 수 있다.**
10. **표본 외 검증과 다양한 평가 지표를 이용하여 모델의 실제 성능을 판단할 수 있다.**

---

## 🧑‍🏫 **본 강의를 수강하면 다음을 수행할 수 있습니다**

1️⃣ **전통적 시계열 분석**

- Stationarity
- ACF / PACF
- ADF / KPSS
- White Noise / Random Walk
- AR / MA / ARMA
- ARIMA / SARIMA
- Box–Jenkins Method

등의 핵심 개념과 분석 절차를 이해할 수 있습니다.

2️⃣ **다변량 시계열 분석**

- VAR
- SVAR
- Granger Causality
- Impulse Response

등을 활용하여 여러 시계열 사이의 동적 관계를 분석할 수 있습니다.

3️⃣ **회귀 및 머신러닝 기반 시계열 분석**

- Linear Regression
- Multiple Linear Regression
- Polynomial Regression
- Logistic Regression
- Decision Tree
- Random Forest
- Support Vector Machine (SVM)
- k-Nearest Neighbors (k-NN)
- Naive Bayes
- Gradient Boosting Machine (GBM)

등을 시계열 데이터에 적용할 수 있습니다.

4️⃣ **분류·군집 기반 분석**

주가의 연속적인 가격뿐 아니라

- 상승 / 하락 방향 예측
- 시장 상태 분류
- K-Means 기반 시장 레짐(Regime) 탐지

등의 문제를 분석할 수 있습니다.

5️⃣ **딥러닝 기반 시계열 분석**

- ANN
- RNN
- LSTM
- GRU
- CNN
- Transformer

등의 구조를 이해하고 시계열 예측 문제에 적용할 수 있습니다.

6️⃣ **금융 시계열의 변동성 분석**

- ARCH
- GARCH

등을 활용하여 가격 자체가 아닌 **변동성(Volatility)**을 모델링하고 예측할 수 있습니다.

7️⃣ **상태공간모형과 Kalman Filter**

관측 데이터에 포함된 노이즈를 제거하고 숨겨진 상태(State)를 추정하는 
Kalman Filter 및 State-Space Model의 기본 원리를 이해할 수 있습니다.

8️⃣ **시계열 기반 인과추론**

단순 예측을 넘어 다음과 같은 질문을 다룰 수 있습니다.

- 특정 정책 이후 지표가 실제로 변화했는가?
- 프로모션이 매출 증가에 영향을 주었는가?
- 특정 사건이 시장에 미친 효과는 무엇인가?
- 개입이 없었다면 어떤 결과가 나타났을 것인가?

📌 특히 **Granger Causality는 구조적 인과관계를 증명하는 방법이 아니라 
“추가적인 예측정보(Predictive Content)”를 검정하는 방법**이라는 점을 구분하여 학습합니다.

9️⃣ **연구 및 실무 적용**

자신의 연구 및 실무 문제에 적합한 시계열 모델을 선택하고,

> 문제 정의 → 데이터 수집 → 전처리 → 모델링 → 검증 → 해석 → 의사결정

과정을 독립적으로 수행할 수 있도록 합니다.

---

# 📄 **본 강의는 다음과 같은 분들에게 적합합니다**

✅ 시계열 데이터를 활용한 데이터 분석 및 예측을 배우고 싶은 연구자 및 실무자

✅ 금융 데이터(주가, 환율, 금리, 경제지표 등)에 관심 있는 실무자

✅ 제조·에너지·기후·대기질·교통 등 시간 의존적 데이터를 분석하고 싶은 연구자

✅ 머신러닝·딥러닝 기반 시계열 분석을 배우고 싶은 엔지니어 및 개발자

✅ 시계열 데이터 기반의 석사·박사 논문 및 소논문 작성을 준비하는 대학원생

✅ 예측을 넘어 **정책·개입·사건의 효과를 분석하는 인과추론**에 관심 있는 연구자

---

# 📚 **강의 진행 방식**

- **📖 이론 강의**  
  시계열 분석의 핵심 개념, 수식, 모델 구조 설명

- **🛠 Python 실습**  
  Google Colab과 GitHub를 활용한 실제 데이터 분석

- **📊 데이터 실습**  
  금융·기후·에너지·검색·콘텐츠·지진 등 다양한 시계열 데이터 활용

- **🤖 AI 활용**  
  생성형 AI를 활용한 코드 생성·분석·해석·검증 실습

- **🗣 토론**  
  모델 성능, 해석 가능성, 연구 설계 및 실무 활용 방안 논의

---

# 📅 **강의 일정 및 주요 내용**

| 날짜 | 시간 | 주요 학습 내용 |
|---|---:|---|
| **09/19 (Sat)** | 08:30 ~ 17:20 | 시계열 분석 개요, 시계열의 역사, 데이터 전처리, 정상성, ACF/PACF, ADF/KPSS, AR·MA·ARMA·ARIMA·SARIMA, Box–Jenkins |
| **10/02 (Fri)** | 18:30 ~ 22:20 | VAR·SVAR, Granger Causality, ARCH/GARCH, Kalman Filter·State-Space Model, 시계열 인과추론 개요 |
| **10/10 (Sat)** | 08:30 ~ 17:20 | 회귀 기반 예측, 머신러닝 기반 분류·군집(Logistic, Tree, RF, SVM, k-NN, K-Means, Naive Bayes, GBM), 모델 평가 |
| **10/16 (Fri)** | 18:30 ~ 22:20 | ANN·RNN·LSTM·GRU·Transformer 등 AI 기반 시계열 모델, 최신 모델 및 종합 실습, 강의 정리 |

💡 **토요일 점심시간**: 12:30 ~ 13:30

---

# 🔍 **시계열 분석의 전체 학습 로드맵**

```text
Time Series Data
       │
       ▼
Data Collection / Preprocessing
       │
       ▼
Stationarity / Trend / Seasonality
       │
       ▼
ACF / PACF / ADF / KPSS
       │
       ├─────────────┐
       ▼             ▼
Statistical        Regression
Models             / Machine Learning
       │             │
AR / MA             Linear / Logistic
ARMA                Tree / RF / SVM
ARIMA               k-NN / GBM
SARIMA              Clustering
       │             │
       └──────┬──────┘
              ▼
       Multivariate Models
       VAR / SVAR / Granger
              │
       ┌──────┴──────┐
       ▼             ▼
 Volatility       State-Space
 ARCH/GARCH       Kalman Filter
       │             │
       └──────┬──────┘
              ▼
        Deep Learning
 ANN / RNN / LSTM / GRU
 CNN / Transformer
              │
       ┌──────┴─────────┐
       ▼                ▼
  Forecasting       Causal Analysis
                        │
             ITS / DiD / Synthetic
             Control / BSTS / SVAR
                        │
                        ▼
                 Decision Making