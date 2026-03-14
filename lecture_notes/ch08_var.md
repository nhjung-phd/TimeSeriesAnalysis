# Chapter 8. 다변량 시계열과 VAR

<p><strong>Recommended Week:</strong> Week 9</p>
<p><strong>Notebook:</strong> <code>05_VAR_forecasting.ipynb</code>, <code>06_SVAR_forecasting.ipynb</code></p>

## Learning Objectives

- 단변량(Univariate)과 다변량(Multivariate) 시계열 분석의 차이를 이해하고, 다변량 분석이 필요한 실무적 이유를 설명할 수 있다.
- 시스템 내의 모든 변수를 내생적(Endogenous)으로 취급하여 상호작용을 대칭적으로 모델링하는 벡터자기회귀(VAR) 모형의 철학과 구조를 파악한다.
- 일반적인 축약형 VAR(Reduced Form VAR)과 이론적 제약을 통해 충격의 인과구조를 식별하는 구조적 VAR(SVAR)의 차이를 수학적·직관적으로 이해한다.
- 파이썬을 활용해 최적의 시차(Lag order)를 선택하고 다변량 시계열 데이터를 동시에 예측(Forecasting)할 수 있다.

## 1. Opening

우리가 살아가는 경제와 비즈니스 환경은 결코 독립된 진공 상태가 아니다. 금리가 오르면 주식 시장이 출렁이고, 환율이 변하면 수출 기업의 매출이 달라지며, 기업의 매출이 달라지면 다시 국가의 GDP와 고용에 영향을 미친다.

지금까지 우리가 배운 ARIMA와 같은 단변량 시계열 모형은 오직 자기 자신의 과거만을 바라보며 미래를 예측했다. 하지만 “모든 것은 다른 모든 것과 연결되어 있다”는 현실 세계의 복잡성을 담아내기에는 부족하다. 1980년, 노벨 경제학상 수상자인 크리스토퍼 심스(Christopher Sims)는 기존 경제 모형들이 변수들 간의 인과관계를 자의적으로 규정하는 관행을 비판하며, 데이터 스스로가 변수 간의 역학 관계를 말하게 하는 혁신적인 모델을 제시했다. 그것이 바로 모든 변수를 평등하게 대우하며 상호작용의 네트워크를 그려내는 다변량 시계열 분석의 핵심, <strong>VAR(Vector Autoregression)</strong>이다.

## 2. Why This Topic Matters

전통적인 회귀 분석에서는 연구자가 “A가 원인(독립변수)이고 B가 결과(종속변수)다”라고 미리 정해놓고 분석을 시작한다. 그러나 닭이 먼저인지 달걀이 먼저인지 알 수 없는 경제·금융 생태계에서 이러한 가정은 종종 심각한 오류를 낳는다.

VAR 모형은 이러한 한계를 돌파한다. 모델에 포함된 모든 변수를 서로가 서로에게 영향을 미치는 내생 변수(Endogenous variables)로 간주함으로써, 특정 변수의 변화가 시스템 전체에 어떤 파급 효과(Spillover effect)를 가져오는지 추적할 수 있게 해준다. 이는 중앙은행이 기준금리를 인상했을 때 물가와 실업률이 향후 몇 달간 어떻게 변할지 시뮬레이션하거나, 테슬라 주가가 다른 기술주나 거시경제 지표와 어떻게 연동되어 움직이는지 예측하는 등 현대 거시경제학과 금융공학의 핵심적인 전략 분석 도구로 쓰인다.

## 3. Core Concepts

### 3.1 단변량 시계열 vs 다변량 시계열

단변량 시계열이 단일 변수 <code>y<sub>t</sub></code>의 시간에 따른 궤적을 좇는다면, 다변량 시계열은 여러 개의 변수들을 하나로 묶은 벡터 <code>Y<sub>t</sub></code>의 흐름을 분석한다. 다변량 분석은 단변량 분석으로는 포착할 수 없는 <strong>변수들 간의 동태적 상호작용(Dynamic Interactions)</strong>을 알아내는 것이 핵심 목적이다.

### 3.2 벡터자기회귀 모형 (VAR: Vector Autoregression)

단변량 AR 모형을 벡터 차원으로 확장한 모형이다. 다변량 시스템 내의 각 변수가 자신의 과거 값뿐만 아니라, <strong>동일한 시스템 내에 있는 다른 모든 변수들의 과거 값에도 의존</strong>한다고 가정한다. 이 모형에서는 원인과 결과, 즉 외생 변수와 내생 변수를 인위적으로 나누지 않고 모두를 대칭적(Symmetric)으로 취급한다.

### 3.3 구조적 VAR (SVAR: Structural VAR)

일반적인 축약형(Reduced Form) VAR은 변수들 간의 과거 데이터가 미치는 영향만 분석할 뿐, 같은 시점(Contemporaneous)에 일어난 즉각적인 충격의 인과관계는 설명하지 못한다. SVAR은 경제학적 이론이나 비즈니스 논리를 바탕으로 회귀식에 <strong>구조적 제약(Restrictions)</strong>을 가한다. 예를 들어, “물가 상승률은 이번 달의 GDP 성장률에 즉각적인 영향을 미치지 않는다”와 같이 행렬의 특정 값을 0으로 고정하여 시스템의 인과 구조를 식별한다.

## 4. Mathematical Formulation

### 4.1 VAR(p) 모형의 구조

<code>k</code>개의 시계열 변수로 구성된 관측 벡터 <code>Y<sub>t</sub></code>에 대하여, 시차 <code>p</code>를 가지는 VAR(<code>p</code>) 모형은 다음과 같이 정의된다.<br><br>

<code>Y<sub>t</sub> = A<sub>1</sub>Y<sub>t-1</sub> + A<sub>2</sub>Y<sub>t-2</sub> + ... + A<sub>p</sub>Y<sub>t-p</sub> + ε<sub>t</sub></code><br><br>

각 기호의 의미는 다음과 같다.

- <code>Y<sub>t</sub></code>: 시점 <code>t</code>에서의 관측치 벡터
- <code>A<sub>i</sub></code>: 시차 <code>i</code>에 해당하는 계수 행렬. 다른 변수가 미치는 교차 영향을 포함한다.
- <code>ε<sub>t</sub></code>: 평균이 0이고 공분산 행렬을 가지는 잔차 벡터(백색잡음)

### 4.2 2변수 VAR(1) 모형 예시

예를 들어 GDP를 <code>Y<sub>1,t</sub></code>, 금리를 <code>Y<sub>2,t</sub></code>라고 할 때, 2변수 VAR(1) 모형은 다음처럼 이해할 수 있다.<br><br>

<code>Y<sub>1,t</sub> = a<sub>11</sub>Y<sub>1,t-1</sub> + a<sub>12</sub>Y<sub>2,t-1</sub> + ε<sub>1,t</sub></code><br>
<code>Y<sub>2,t</sub> = a<sub>21</sub>Y<sub>1,t-1</sub> + a<sub>22</sub>Y<sub>2,t-1</sub> + ε<sub>2,t</sub></code><br><br>

즉, 오늘의 GDP는 어제의 GDP뿐만 아니라 어제의 금리에도 영향을 받을 수 있고, 오늘의 금리 역시 어제의 GDP와 금리에 모두 영향을 받을 수 있다. 이것이 VAR 모형의 핵심인 상호의존 구조이다.

## 5. Visual Intuition

다변량 시계열을 시각화할 때는 개별 변수의 선 그래프를 위아래로 나란히 배치하여 보는 것이 좋다.

특정 시점에 일어난 외부적 사건, 예를 들어 글로벌 금융위기를 수직선으로 표시해 보자. 단변량 분석에서는 내 변수 하나의 급락만 보이지만, 다변량 시각화 화면에서는 금리가 급락하고, 며칠 뒤 환율이 튀어 오르며, 다시 한 달 뒤 주가가 급락하는 식의 시간차를 둔 연쇄 파급(Domino effect) 현상을 눈으로 직접 확인할 수 있다. VAR 모형은 바로 이 시차(Lag)를 둔 다차원적 파동을 수학적 행렬 구조로 포착하는 도구이다.

## 6. Python Practice

### 6.1 Data

본 실습에서는 다변량 변수 간의 동적 관계를 확인하기 위해 <strong>거시경제 지표(GDP, 인플레이션율 등)</strong>나, 금리 및 거래량 변수를 포함한 <strong>테슬라(TSLA) 주가 다변량 데이터</strong>를 활용한다.

### 6.2 Code Walkthrough

<code>05_VAR_forecasting.ipynb</code> 노트북에서는 <code>statsmodels.tsa.api.VAR</code> 클래스를 활용한다.

- <code>model = VAR(df)</code>: 정상성(Stationarity)이 확보된 다변량 데이터프레임을 모형에 입력한다.
- <code>model.select_order(maxlags=10)</code>: AIC, BIC 등의 정보 기준을 바탕으로 시스템 전체를 설명하는 데 가장 적합한 최적의 시차 <code>p</code>를 자동으로 탐색한다.
- <code>results = model.fit(maxlags)</code>: 선택된 시차를 바탕으로 모형 파라미터(계수 행렬 <code>A</code>)를 추정한다.
- <code>results.forecast(y, steps=5)</code>: 적합된 모형을 바탕으로 여러 변수의 향후 5스텝 미래를 동시에 예측한다.

### 6.3 What to Observe

단변량 ARIMA에서는 보통 하나의 변수에 대한 예측값만 생성되지만, VAR 모형의 <code>.forecast()</code>를 실행하면 입력된 모든 변수에 대한 미래 예측값이 행렬 형태로 한 번에 출력되는 것을 확인해야 한다. 또한 최적 시차 <code>p</code>를 늘릴수록 각 변수마다 추정해야 할 파라미터 수가 급격히 증가하는 현상도 함께 인식해야 한다.

## 7. Interpretation of Results

VAR 모형을 적합한 뒤 산출되는 수많은 계수 <code>a<sub>11</sub></code>, <code>a<sub>12</sub></code> 등을 개별적으로 하나하나 해석하는 것은 실무적으로 거의 불가능하며, 큰 의미도 없는 경우가 많다.

대신 VAR 모형의 진정한 해석은 모형 추정 후에 파생되는 세 가지 분석 도구를 통해 이루어진다. 이들은 다음 장에서 더 깊이 다룬다.

1. <strong>그랜저 인과관계 검정 (Granger Causality)</strong>: 변수 X의 과거가 변수 Y를 예측하는 데 유의미한 도움을 주었는지 확인한다.
2. <strong>충격반응함수 (Impulse Response Function, IRF)</strong>: 예를 들어 금리를 1단위 올렸을 때 GDP가 향후 여러 기간 동안 어떻게 반응하는지 동적인 궤적을 시각화한다.
3. <strong>분산분해 (Variance Decomposition)</strong>: 특정 변수의 변동성 중 얼마가 자기 자신의 요인 때문이고, 얼마가 다른 변수의 충격 때문인지를 기여도 형태로 분해한다.

## 8. Common Mistakes

- <strong>차원의 저주 (Curse of Dimensionality)와 자유도 손실</strong>: VAR 모형의 가장 큰 단점은 변수 <code>k</code>와 시차 <code>p</code>가 조금만 늘어나도 추정해야 할 파라미터 수가 급격히 늘어난다는 점이다. 대략적인 규모는 <code>k² × p + k</code>로 생각할 수 있다. 예를 들어 변수가 5개이고 시차가 4이면 상수항을 포함해 많은 수의 계수를 추정해야 한다. 불필요한 변수를 마구 넣으면 과적합에 빠져 예측력이 급격히 저하될 수 있다.
- <strong>단위근 확인 누락으로 인한 가짜 회귀</strong>: 단변량 분석과 마찬가지로 다변량 모형에 들어가는 모든 시계열 변수는 정상성(Stationarity)을 만족해야 한다. 비정상 변수들을 차분 없이 VAR 모형에 넣으면, 전혀 인과관계가 없는 두 변수가 밀접한 관계가 있는 것처럼 나타나는 <strong>가짜 회귀(Spurious Regression)</strong>의 함정에 빠질 수 있다. 단, 변수 간 공적분 관계가 있는 경우는 예외이며 이는 VECM 모형에서 다룬다.

## 9. Summary

과거의 시계열 모델링이 독립된 개별 변수의 궤적을 따라갔다면, 벡터자기회귀(VAR) 모형은 시스템 전체를 하나의 유기체로 취급하여 변수들 간의 연쇄적인 상호작용을 포착한다. VAR 모형은 특정 변수가 외생적인지 내생적인지 자의적으로 구분하는 대신 모든 변수를 대칭적으로 취급하여 데이터의 객관적 흐름을 추정한다. 비록 시차와 변수 증가에 따른 과적합의 위험, 즉 차원의 저주가 존재하지만, 구조적 제약을 결합한 SVAR로 확장될 수 있다는 점에서 거시경제 정책 분석과 다변량 수요 예측에 있어 매우 강력한 기준 프레임워크로 자리매김하고 있다.

## 10. Exercises

1. <strong>개념 문제:</strong> 일반적인 다중 선형 회귀 모형과 비교할 때, VAR 모형이 변수들 간의 관계를 설정하는 방식에서 갖는 가장 큰 철학적 특징, 즉 내생성과 대칭성의 측면은 무엇인지 서술하시오.

2. <strong>해석 문제:</strong> 3개의 변수(매출, 마케팅 비용, 경쟁사 가격)를 사용하여 시차 <code>p = 3</code>을 갖는 VAR(3) 모형을 추정하고자 한다. 각 방정식에 상수항이 포함된다고 가정할 때, 이 시스템 전체에서 추정해야 할 총 파라미터 수를 계산하고, 이것이 실무적으로 시사하는 바를 설명하시오.

3. <strong>간단한 실습 문제:</strong> 실습 노트북 <code>05_VAR_forecasting.ipynb</code>을 참고하여, 제공된 3개의 경제 지표(GDP, 물가, 금리) 데이터를 1차 차분하여 정상성을 확보하시오. 이후 <code>VAR(df).select_order()</code> 함수를 실행하여 도출된 AIC 기준 최적의 시차(lag) 값이 얼마인지 확인하시오.

## 11. Further Reading / References

- Sims, C. A. (1980). *Macroeconomics and Reality*. *Econometrica*, 48(1), 1–48.
- Hamilton, J. D. (1994). *Time Series Analysis*. Princeton University Press.
- Lütkepohl, H. (2005). *New Introduction to Multiple Time Series Analysis*. Springer.
- 정낙현. (2026). *Time Series Analysis 1: 시계열 분석 기초 강의안*.
- 실습 코드 저장소 (GitHub): <code>https://github.com/nhjung-phd/TimeSeriesAnalysis</code> (<code>05_VAR_forecasting.ipynb</code>, <code>06_SVAR_forecasting.ipynb</code>)