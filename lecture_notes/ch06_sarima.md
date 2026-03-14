# Chapter 6. 계절성과 SARIMA

<p><strong>Recommended Week:</strong> Week 6</p>
<p><strong>Notebook:</strong> <code>06_SARIMA_Modeling.ipynb</code></p>

## Learning Objectives

- 시계열 데이터에 존재하는 계절성(Seasonality)의 개념과 특징을 이해하고, 이를 시각적으로 식별할 수 있다.
- 기존 ARIMA 모형이 계절성 데이터를 처리하지 못하는 한계를 인식하고, 계절 차분(Seasonal Differencing)의 원리를 파악한다.
- SARIMA 모형의 비계절성 모수 <code>(p, d, q)</code>와 계절성 모수 <code>(P, D, Q)<sub>m</sub></code>의 구조적 차이를 수학적·직관적으로 구분한다.
- 파이썬을 활용하여 시계열을 분해(Decomposition)하고, 정보 기준(AIC)과 MAPE 지표를 통해 최적의 SARIMA 모형을 선정 및 평가할 수 있다.

## 1. Opening

동네의 작은 가게에서 아이스크림 재고를 준비한다고 상상해 보자. 날씨가 따뜻해지면서 매출이 꾸준히 증가하는 추세라면, 다음 주 주문량은 이번 주보다 다소 많아야 할 것이다. 하지만 “얼마나 더 많아야 하는가”는 단순히 지난주와 이번 주의 차이만으로는 설명하기 어렵다. 왜냐하면 아이스크림 매출은 매년 여름이라는 특정 시기마다 폭발적으로 증가하고 겨울에는 감소하는, 1년을 주기로 하는 명확한 반복 패턴을 갖기 때문이다.

앞선 장에서 우리는 과거의 흐름(AR)과 오차(MA)를 결합하여 추세를 예측하는 강력한 도구인 ARIMA 모형을 배웠다. 그러나 기존의 ARIMA는 고정된 주기로 반복되는 이러한 계절성(Seasonality)을 자체적으로 처리하지 못한다는 한계를 가진다. 시간의 흐름은 종종 직선이 아니라 나선형으로 순환한다. 이 장에서는 겉으로 보이는 단기적인 변화뿐만 아니라, 해마다 혹은 달마다 반복되는 시간의 거대한 톱니바퀴를 모델링하는 SARIMA(Seasonal ARIMA)의 세계로 들어가 본다.

## 2. Why This Topic Matters

현실 세계의 비즈니스 및 경제 데이터는 거의 예외 없이 계절성을 띤다. 항공 여객 수, 주택 착공 건수(Housing Starts), 특정 주류의 월별 판매량(Liquor Sales), 심지어 일일 전력 소비량 데이터 등은 명확한 주기적 변동성을 보인다.

이러한 패턴을 무시하고 단순한 ARIMA 모형을 적용하면, 예측은 주기적 변동을 따라가지 못하고 평탄해지거나 완전히 빗나가게 된다. 또한 최근 학술 연구에서는 단순히 매출액 예측을 넘어, 계절성이 존재하는 환경 데이터나 사이버 범죄 발생 및 검거 건수(Cybercrime Incidents)를 예측하는 데에도 SARIMA와 외생변수가 추가된 ARIMAX 모형이 활발히 활용되고 있다. 따라서 계절성을 분리하고 모델링하는 능력은 이론적 완전성을 넘어 실무와 연구에서 예측의 정확도(Accuracy)를 끌어올리는 필수 역량이다.

## 3. Core Concepts

### 3.1 계절성 (Seasonality)

계절성이란 데이터가 일정한 주기(Frequency)를 가지고 규칙적으로 반복되는 패턴을 의미한다. 예를 들어 월별 데이터에서 매년 7월마다 값이 급증한다면, 이 데이터의 계절성 주기 <code>m</code>은 12가 된다. 계절성은 트렌드(Trend)와 달리 주기의 길이가 고정되어 있고 명확하게 알려져 있다는 특징이 있다.

### 3.2 계절 차분 (Seasonal Differencing)

일반적인 1차 차분이 “오늘의 값에서 어제의 값을 빼는 것”이라면, 계절 차분은 “오늘의 값에서 정확히 한 주기 전의 값을 빼는 것”이다.

항공 승객 수 데이터에서 올해 7월 승객 수에서 작년 7월 승객 수를 빼는 과정을 통해, 매년 여름마다 반복되는 계절적 비정상성을 제거하고 순수한 변동분만을 남길 수 있다.

### 3.3 SARIMA(p, d, q)(P, D, Q)_m 모형의 구조

SARIMA 모형은 기존 ARIMA에 계절성 변동을 설명하는 파라미터를 추가한 확장 모형이다.

- <strong><code>(p, d, q)</code></strong>: 단기적인 비계절성(Non-seasonal) 자기회귀, 차분, 이동평균 차수이다. 예를 들어 어제, 그제 데이터의 영향을 반영한다.
- <strong><code>(P, D, Q)<sub>m</sub></code></strong>: 거시적인 계절성(Seasonal) 자기회귀, 차분, 이동평균 차수이다. 예를 들어 작년 같은 달, 재작년 같은 달 데이터의 영향을 반영한다.
- <strong><code>m</code></strong>: 계절성 패턴이 한 번 반복되는 데 걸리는 기간(Frequency)이다. 월별 데이터의 연간 계절성은 12, 분기별 데이터는 4가 된다.

## 4. Mathematical Formulation

수학적으로 SARIMA 모형은 기존의 후방 이동 연산자(Backward Shift Operator, <code>B</code>)에 더하여, 한 주기를 건너뛰는 <strong>계절성 후방 이동 연산자</strong>를 결합하여 표현한다. 문헌에 따라 주기를 <code>s</code> 또는 <code>m</code>으로 표기한다.

비정상 시계열 <code>X<sub>t</sub></code>에 대하여 일반 차분 <code>d</code>번과 계절 차분 <code>D</code>번을 수행하여 얻은 정상 시계열 <code>Y<sub>t</sub></code>는 다음과 같이 정의된다.<br><br>

<code>Y<sub>t</sub> = (1 - B)<sup>d</sup>(1 - B<sup>s</sup>)<sup>D</sup>X<sub>t</sub></code><br><br>

이 정상화된 시계열에 비계절성 ARMA와 계절성 ARMA를 동시에 적합하는 일반적인 SARIMA 수식은 다음과 같다.<br><br>

<code>Φ(B<sup>s</sup>)φ(B)Y<sub>t</sub> = Θ(B<sup>s</sup>)θ(B)Z<sub>t</sub></code><br><br>

여기서 각 항의 의미는 다음과 같다.

- <code>φ(B)</code>, <code>θ(B)</code>: 비계절성 AR 및 MA 다항식
- <code>Φ(B<sup>s</sup>)</code>, <code>Θ(B<sup>s</sup>)</code>: 계절성 AR 및 MA 다항식
- <code>Z<sub>t</sub></code>: 백색잡음(White Noise)

이 수식은 현재의 상태가 최근 며칠간의 흐름뿐만 아니라 과거 몇 번의 동일 시즌의 흐름에 의해 복합적으로 결정됨을 의미한다.

## 5. Visual Intuition

계절성을 시각적으로 진단하는 데에는 다음 두 가지 방법이 가장 효과적이다.

1. <strong>시계열 요소 분해 (Time Series Decomposition)</strong>: 원본 데이터(Observed)를 추세(Trend), 계절성(Seasonal), 잔차(Residual) 플롯으로 분해한다. 만약 데이터에 뚜렷한 계절성이 있다면, Seasonal 플롯이 0을 중심으로 위아래로 일정하게 요동치는 명확한 파동(Wave) 형태를 보일 것이다.

2. <strong>주기적 스파이크를 가진 ACF 플롯</strong>: 계절성을 띠는 시계열 데이터의 ACF를 그리면, 시차가 주기의 배수, 예를 들어 <code>lag = 12, 24, 36</code>이 될 때마다 상관계수가 크게 튀어 오르는(Spike) 현상을 관찰할 수 있다. 이는 과거의 특정 달과 현재 달의 상태가 매우 강하게 묶여 있음을 보여준다.

## 6. Python Practice

### 6.1 Data

실습에서는 시계열 분석의 고전이자 강한 추세와 뚜렷한 계절성을 동시에 가진 <strong>월별 항공 승객 수 데이터 (Air Passengers dataset)</strong> 또는 <strong>Johnson & Johnson 분기별 주당 순이익(EPS) 데이터</strong>를 활용한다. 이 데이터들은 매년 여름 휴가철 등에 값이 급증하는 승법(Multiplicative) 형태의 변동을 보여준다.

### 6.2 Code Walkthrough

<code>06_SARIMA_Modeling.ipynb</code>에서는 <code>statsmodels</code> 라이브러리의 <code>SARIMAX</code> 클래스를 사용하여 모형을 구축한다.

1. <strong>차수 결정 및 그리드 탐색 (Grid Search)</strong>  
   모델링을 위해 <code>p</code>, <code>d</code>, <code>q</code>뿐만 아니라 계절성 모수인 <code>P</code>, <code>D</code>, <code>Q</code>도 결정해야 한다. <code>itertools.product</code>를 활용하여 모수들의 후보군 리스트를 생성하고 반복문을 돌려 여러 조합의 모형을 적합한다.

2. <strong>모형 적합 (Model Fitting)</strong>

```python
from statsmodels.tsa.statespace.sarimax import SARIMAX

# SARIMA(1, 1, 1)(1, 0, 1, 12) 예시
model = SARIMAX(
    train_data,
    order=(1, 1, 1),
    seasonal_order=(1, 0, 1, 12),
    simple_differencing=False
)
results = model.fit(disp=False)
````

<code>order</code> 인자에는 비계절성 <code>(p, d, q)</code>를, <code>seasonal_order</code>에는 계절성 <code>(P, D, Q, m)</code>을 입력한다. 여기서 12는 월별 데이터의 1년 주기 <code>m</code>을 의미한다.

### 6.3 What to Observe

반복문이 종료되면 추출된 결과 데이터프레임에서 <strong>AIC 값이 가장 낮은 모수 조합</strong>이 무엇인지 확인해야 한다. 또한, 최적 모형의 <code>plot_diagnostics()</code> 함수를 실행하여 Q-Q 플롯이 직선을 따르는지, 그리고 잔차(Residual)의 ACF 플롯에 뚜렷한 상관성이 남아 있지 않은지, 즉 백색잡음에 가까운지 검토해야 한다.

## 7. Interpretation of Results

모델의 성능을 평가할 때는 훈련 데이터(Train set)가 아닌 미래의 테스트 데이터(Test set)에 대한 예측력을 보아야 한다.

실무적으로 예측 모형들의 성능을 직관적으로 비교할 때 <strong>MAPE(Mean Absolute Percentage Error)</strong> 지표를 널리 사용한다. 예를 들어 단순 계절성 예측(Naive seasonal)의 MAPE가 9.99%이고, 일반 ARIMA 모형이 3.85%, SARIMA 모형이 2.85%로 산출되었다면, SARIMA 모형이 계절성 요인을 잘 흡수하여 가장 낮은 오차율로 미래를 예측했다고 해석할 수 있다.

## 8. Common Mistakes

* <strong>주기 모수 <code>m</code>의 오설정</strong>: 월별 데이터에 <code>m = 12</code>, 분기별 데이터에 <code>m = 4</code>를 설정하는 것은 직관적이다. 하지만 주간 데이터나 일별 데이터에서 무조건 <code>m</code>을 잘못 설정하면 모델이 크게 흔들릴 수 있다. 분석 전에 데이터의 생성 빈도(Frequency)를 명확히 이해해야 한다.
* <strong>과대 차분 (Over-differencing)</strong>: 트렌드를 잡기 위한 일반 차분 <code>d</code>와 계절성을 잡기 위한 계절 차분 <code>D</code>를 모두 과도하게 적용하면, 오히려 필수적인 데이터 구조가 훼손되고 분산이 커져 예측이 흔들릴 수 있다. 통상적으로 <code>d + D</code>는 2를 넘지 않도록 주의하는 경우가 많다.
* <strong>데이터 분할 시 정보 누수</strong>: 머신러닝처럼 데이터를 무작위로 섞어서 훈련/테스트 셋을 나누면 시계열의 시간적 연속성이 파괴된다. 테스트 셋은 반드시 시간 순서의 마지막 부분, 예를 들어 마지막 12개월로 설정해야 한다.

## 9. Summary

자연 현상과 비즈니스 환경에는 1년, 1분기 등 특정 주기마다 반복되는 계절적 파동이 존재한다. 기존의 통계적 예측 모형이 가진 한계를 극복하기 위해 등장한 SARIMA 모형은, 계절 차분을 통해 주기적 팽창을 정상화하고, 한 주기 전의 과거 데이터가 현재에 미치는 영향을 계절성 파라미터 <code>(P, D, Q)<sub>m</sub></code>를 통해 구조화한다. 시계열 분해와 그리드 탐색을 거쳐 정보 기준(AIC)이 가장 낮은 모형을 찾아내는 과정은 다소 복잡하지만, 이 절차를 숙지하면 경영 전략 수립 및 수요 예측에서 신뢰할 수 있는 인사이트를 도출할 수 있다.

## 10. Exercises

1. <strong>개념 문제:</strong> SARIMA 모형 수식에서 <code>(p, d, q)</code> 부분과 <code>(P, D, Q)<sub>m</sub></code> 부분이 각각 데이터의 어떤 변동 특성을 학습하기 위해 설계되었는지 그 차이를 설명하시오.

2. <strong>해석 문제:</strong> 월별 항공 승객 수 데이터의 ACF 플롯을 확인했더니, 시차(lag) 1, 2, 3에서는 상관계수가 점진적으로 감소하지만, <code>lag = 12, 24, 36</code>에서 매우 뚜렷한 스파이크가 관찰되었다. 이 데이터를 정상화하기 위해 어떤 전처리(차분)가 필요한지 수식이나 개념으로 서술하시오.

3. <strong>간단한 실습 문제:</strong> 실습 노트북 <code>06_SARIMA_Modeling.ipynb</code>에서 Johnson & Johnson 데이터(분기별 데이터)를 로드하고, <code>statsmodels</code>의 <code>seasonal_decompose</code>를 사용하여 추세와 계절성으로 분해한 그래프를 출력하시오. 분기별 데이터이므로 <code>period</code> 옵션을 얼마로 주어야 하는지 유의하여 작성하시오.

## 11. Further Reading / References

* Brockwell, P. J., & Davis, R. A. (2016). *Introduction to Time Series and Forecasting (3rd ed.)*. Springer.
* Peixeiro, M. (2022). *Time Series Forecasting in Python*. Manning Publications.
* Diebold, F. X. (2015). *Forecasting in Economics, Business, Finance and Beyond*.
* 정낙현. (2025). *뉴스레터: Ep.1 – ARIMA와 친구들: 숫자 속 전략을 읽는 법*.
* 정낙현. (2026). *Time Series Analysis 1: 시계열 분석 기초 강의안*.
* 논문 참고: 사이버 범죄 예측 및 전자상거래 변화 분석 등 SARIMA 활용 최신 연구.


