# 📌 Time Series Analysis Cheatsheet 

시계열 분석의 통계적 기법부터 딥러닝 기반 예측, 실무 적용 팁까지 모두 담은 종합 치트시트입니다.

---

## 🔹 1. 기본 개념 정리

| 개념 | 설명 |
|------|------|
| **시계열 (Time Series)** | 시간 순서에 따라 수집된 연속적인 데이터 |
| **정상성 (Stationarity)** | 평균, 분산, 자기상관이 시간에 따라 일정 |
| **차분 (Differencing)** | 비정상성을 제거하기 위해 이전 시점 값을 빼는 것 |
| **자기상관 (Autocorrelation)** | 과거값과 현재값 간의 선형적 관계 |
| **PACF (Partial ACF)** | lag별 부분 자기상관 |
| **ACF (Auto Correlation Function)** | lag별 전체 자기상관 |
| **백색잡음 (White Noise)** | 구조적 패턴이 없는 예측 불가능한 시계열 |

---

## 🔹 2. 통계적 예측 기법

| 모델 | 설명 | 정상성 필요 |
|------|------|-------------|
| **AR(p)** | 자기회귀 모델 | ✅ 필요 |
| **MA(q)** | 이동평균 모델 | ✅ 필요 |
| **ARMA(p, q)** | AR + MA 결합 | ✅ 필요 |
| **ARIMA(p,d,q)** | 차분 포함 ARMA | ❌ |
| **SARIMA(p,d,q)(P,D,Q,s)** | 계절성 ARIMA | ❌ |
| **VAR(p)** | 다변량 시계열 모델 | ✅ |
| **ARCH / GARCH** | 분산 예측에 특화 | ✅ |

---

## 🔹 3. 정상성 및 단위근 검정

| 검정 | 목적 | 해석 기준 |
|------|------|-----------|
| **ADF** | 단위근 존재 여부 | p < 0.05 → 정상성 |
| **KPSS** | 정상성 존재 여부 | p > 0.05 → 정상성 |
| **PP (Phillips-Perron)** | ADF 대안 | 동일 해석 |

---

## 🔹 4. 머신러닝 기반 시계열 분석

| 모델 | 특징 | 활용 방법 |
|------|------|-------------|
| **선형 회귀** | 단순 추세 학습 | 라그 또는 시간 변수 사용 |
| **다항 회귀** | 비선형 추세 | 과적합 주의 |
| **랜덤포레스트** | 비선형 + 변수 해석 가능 | tabular 변환 필요 |
| **XGBoost / LightGBM** | 성능 우수, 결측값 자동 처리 | lag / 외생변수 추가 필수 |

---

## 🔹 5. 딥러닝 기반 시계열 예측

| 모델 | 설명 | 적합한 경우 |
|------|------|-------------|
| **ANN (MLP)** | 기본 구조 | 정적인 입력에 적합 |
| **RNN** | 시퀀스 처리 | 장기기억 어려움 |
| **LSTM** | 장기 의존성 학습 | 금융/의료/텍스트 |
| **GRU** | LSTM보다 경량 | 빠른 처리 |
| **1D-CNN** | 패턴 인식 | 고정된 윈도우 |
| **Transformer** | 병렬 학습 + 긴 시퀀스 | 최신 성능 최상 |

---

## 🔹 6. 모델 선택 가이드

| 데이터 특성 | 추천 모델 |
|-------------|------------|
| 계절성 존재 | SARIMA, Prophet |
| 다변량 예측 | VAR, LSTM |
| 고변동성 | GARCH, LSTM |
| 긴 시퀀스 | Transformer |
| 외부 변수 포함 | ARIMAX, Prophet, XGBoost |
| 계산 자원 제약 | GRU, CNN |

---

## 🔹 7. 실무 팁

- **차분 후 ADF 검정** 필수
- **교차검증**: Expanding Window / Rolling Window
- **성능평가지표**:
  - RMSE, MAE, MAPE
  - AIC, BIC (통계모델)
- **하이퍼파라미터 튜닝**:
  - ARIMA → `pmdarima.auto_arima()`
  - LSTM → window size, hidden units, epochs

---

## 🔹 8. 시계열 시각화 함수

| 목적 | 함수 / 방법 | 예시 코드 |
|------|--------------|-----------|
| 기본 시각화 | `plt.plot()` | `plt.plot(df['y'])` |
| 계절성 시각화 | `seasonal_decompose()` | from `statsmodels` |
| ACF/PACF | `plot_acf()`, `plot_pacf()` | `statsmodels.graphics.tsaplots` |

```python
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
plot_acf(df['y'])
plot_pacf(df['y'])
```

---

## 🔹 9. 이상치 탐지 (Anomaly Detection)

| 기법 | 설명 | 라이브러리 |
|------|------|------------|
| **Z-score** | 표준화 기반 | `scipy.stats.zscore()` |
| **IQR** | 사분위수 범위 | pandas |
| **Isolation Forest** | 비지도 이상치 탐지 | `sklearn.ensemble` |
| **AutoEncoder** | 재구성 오차 | `tensorflow`, `keras` |

```python
from sklearn.ensemble import IsolationForest
model = IsolationForest()
df['anomaly'] = model.fit_predict(df[['y']])
```

---

## 🔹 10. 외생 변수 포함 (Exogenous Variables)

| 모델 | 설명 | 예제 |
|------|------|------|
| ARIMAX / SARIMAX | `exog=` 인자에 외생변수 | `SARIMAX(y, exog=X)` |
| Prophet | `add_regressor()` 사용 | `m.add_regressor('holiday')` |
| XGBoost | Feature로 포함 | `df[['lag1', 'event']]` |
| LSTM | 다차원 시계열로 구성 | `(samples, time_steps, features)` |

```python
from statsmodels.tsa.statespace.sarimax import SARIMAX
model = SARIMAX(df['y'], exog=df[['holiday']], order=(1,1,1))
model.fit()
```

---

## 🔹 11. 추천 라이브러리

| 목적 | 라이브러리 |
|------|------------|
| 통계적 모델링 | `statsmodels`, `pmdarima`, `arch` |
| 딥러닝 시계열 | `tensorflow`, `keras`, `pytorch`, `darts` |
| 시계열 전처리 | `sktime`, `tslearn`, `featuretools` |
| 시계열 시각화 | `matplotlib`, `plotly`, `seaborn` |
| 시계열 예측 자동화 | `prophet`, `auto-ts`, `gluonts`, `neuralprophet` |

---

✅ **이 치트시트는 다음 환경에 유용합니다:**
- 📊 실무 데이터 예측 모델 설계
- 🧪 연구 논문 실험 설계
- 💻 Python 기반 시계열 프로젝트 구축
- 🎓 시계열 강의 / 교육자료 제작

---


문의: `nhjung.phd@gmail.com`
