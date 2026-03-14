# Chapter 5. ARIMA와 Box–Jenkins 절차

<p><strong>Recommended Week:</strong> Week 5</p>
<p><strong>Notebook:</strong> <code>04_ARIMA_forecasting.ipynb</code></p>

## Learning Objectives

- 비정상 시계열을 정상화하여 예측하는 ARIMA(Autoregressive Integrated Moving Average) 모형의 수학적, 직관적 구조를 이해한다.
- 시계열 분석의 표준 패러다임인 Box-Jenkins 4단계 방법론(식별, 추정, 진단, 예측)을 숙지하고 실무에 적용할 수 있다.
- 정보 기준(AIC, BIC)과 오컴의 면도날(Occam's razor) 원리를 바탕으로 최적의 모델 차수 <code>p</code>, <code>d</code>, <code>q</code>를 선택하는 방법을 파악한다.
- 잔차 진단을 위한 Ljung-Box 검정의 의미를 이해하고, Python의 <code>auto_arima</code>를 활용하여 모델링을 자동화하는 기법을 습득한다.

## 1. Opening

시계열 분석을 처음 배우게 되면 만나게 되는 가장 고전적이고 강력한 분석 모형이 바로 ARIMA(자기회귀 누적이동평균) 모형이다.

우리는 종종 이 모형을 복잡한 통계 수식의 집합으로만 오해하곤 한다. 하지만 경영과 전략의 관점에서 바라보면, ARIMA는 “과거로부터 미래를 배우는 정교한 철학적 프레임워크”에 가깝다. 자기회귀(AR)를 통해 “나는 과거에 어떤 흐름을 따라왔는가”를 돌아보고, 이동평균(MA)을 통해 “과거에 우리가 어떤 예측 실수를 했는가”를 반성하며 그 흔적을 지운다. 그리고 차분(I)이라는 과정을 통해 겉으로 요동치는 표면적인 흐름을 걷어내고, 데이터 이면에 숨겨진 진짜 본질적 변화의 시작점을 찾아낸다.

단순히 숫자를 쫓아가는 것을 넘어 직관을 구조화하고 감각을 수치로 번역해주는 전략 도구, ARIMA의 세계로 들어가 보자.

## 2. Why This Topic Matters

현실 세계에서 우리가 마주하는 대부분의 데이터(주가, 매출액, 거시경제 지표 등)는 시간이 지남에 따라 평균이나 분산이 변화하는 비정상성(Non-stationarity)을 띠고 있다. 앞선 장에서 배운 ARMA 모형은 오직 정상 시계열에서만 작동하기 때문에 이러한 현실 데이터를 직접 다룰 수 없다는 한계가 있었다.

ARIMA 모형은 데이터 내부에 존재하는 비정상적 요소를 차분(Differencing)이라는 명시적인 단계(I)를 통해 정제함으로써 이 문제를 해결한다. 특히 1970년 George Box와 Gwilym Jenkins가 제안한 Box-Jenkins 절차는 데이터를 살펴보고, 모델을 선택하고, 검증한 뒤 예측에 이르는 일련의 과정을 4단계로 규격화했다. 이는 현대 시계열 분석가들이 딥러닝이나 복잡한 AI 모델을 다룰 때에도 기준점(Baseline)으로 삼는 체계적이고 표준화된 사고방식을 제공한다. 따라서 이 절차를 마스터하는 것은 어떤 복잡한 모델을 다루더라도 길을 잃지 않게 해주는 단단한 기반이 된다.

## 3. Core Concepts

### 3.1 ARIMA(p, d, q) 모형의 3대 구성 요소

ARIMA 모델은 다음 세 가지 요소를 결합하여 과거 데이터의 패턴을 모형화한다.

1. <strong>AR (AutoRegressive, 자기회귀 - <code>p</code>)</strong>: 현재의 상태가 과거의 상태에 얼마나 의존하는지를 나타낸다. 과거 흐름이 미래에도 이어질 것이라는 가정하에, 데이터의 “전략적 신뢰도”를 보여준다.
2. <strong>I (Integrated, 차분 - <code>d</code>)</strong>: 비정상 시계열을 정상 시계열로 변환하기 위해 데이터를 차분하는 횟수이다. 상승·하락의 단순한 추세를 걷어내고 실제 구조적 신호만을 남기는 필터 역할을 한다.
3. <strong>MA (Moving Average, 이동평균 - <code>q</code>)</strong>: 과거의 예측 오차(백색잡음)들을 활용하여 현재의 상태를 설명한다. 모델이 과거에 저질렀던 오류를 학습하고 궤도를 수정하는 “전략적 면역 시스템”처럼 작동한다.

### 3.2 Box-Jenkins 4단계 방법론

시계열 데이터를 분석하고 예측하기 위해 제안된 체계적인 절차로, 다음의 4단계 순환 구조를 가진다.

1. <strong>식별 (Identification)</strong>: 데이터의 추세나 계절성 등 비정상성 여부를 확인하고, 단위근 검정 등을 통해 적절한 차분 횟수 <code>d</code>를 결정한다. 이후 ACF와 PACF 그래프를 분석하여 AR(<code>p</code>)와 MA(<code>q</code>)의 초기 차수 후보군을 추정한다.
2. <strong>추정 (Estimation)</strong>: 식별된 모델의 파라미터(계수)들을 최대우도추정법(MLE)이나 최소제곱법 등을 활용하여 통계적으로 추정한다.
3. <strong>진단 (Diagnosis)</strong>: 추정된 모델이 데이터의 패턴을 모두 흡수했는지 평가한다. 남은 잔차(Residual)가 무작위한 백색잡음(White Noise) 상태인지를 검정(예: Ljung-Box 검정)하며, 조건을 만족하지 못하면 1단계로 돌아가 모델을 수정한다.
4. <strong>예측 (Forecasting)</strong>: 검증을 통과한 최종 모델을 사용하여 미래 시점의 값을 예측하고, 모델이 차분된 상태라면 이를 다시 역차분하여 본래 데이터의 스케일로 복원한다.

### 3.3 정보 기준과 오컴의 면도날 (AIC & BIC)

후보 모델들 중 가장 최적의 차수 <code>p</code>, <code>q</code>를 선택하기 위해 <strong>AIC(Akaike Information Criterion)</strong>와 <strong>BIC(Bayesian Information Criterion)</strong>를 활용한다. 이 지표들은 모델이 데이터를 얼마나 잘 설명하는지(적합도)를 평가함과 동시에, 모수(파라미터)의 개수가 많아질수록 벌점(Penalty)을 부과한다. 즉, 불필요하게 복잡한 모델을 배제하고 “동일한 설명력이라면 더 단순한 모델이 낫다”는 오컴의 면도날 원리를 정량화한 수치로, 값이 작을수록 더 좋은 모델을 의미한다.

## 4. Mathematical Formulation

시계열 데이터 <code>Y<sub>t</sub></code>를 <code>d</code>번 차분하여 얻은 정상 시계열을 다음처럼 정의할 수 있다.<br><br>

<code>X<sub>t</sub> = (1 - B)<sup>d</sup> Y<sub>t</sub></code><br><br>

여기서 <code>B</code>는 후방 이동 연산자이며, <code>BY<sub>t</sub> = Y<sub>t-1</sub></code>를 뜻한다.

ARIMA(<code>p</code>, <code>d</code>, <code>q</code>) 모형의 직관적 표현은 다음과 같다.<br><br>

<code>Δy<sub>t</sub> = α + φ<sub>1</sub>Δy<sub>t-1</sub> + ... + φ<sub>p</sub>Δy<sub>t-p</sub> + ε<sub>t</sub> + θ<sub>1</sub>ε<sub>t-1</sub> + ... + θ<sub>q</sub>ε<sub>t-q</sub></code><br><br>

이 식은 차분된 변수 <code>Δy<sub>t</sub></code>의 변화량이 과거 차분값들의 선형 결합(AR 파트)과 과거 예측 오차 <code>ε</code>들의 선형 결합(MA 파트)으로 구성됨을 의미한다. 여기서 <code>ε<sub>t</sub></code>는 평균이 0이고 분산이 일정한 백색잡음이다.

모델을 평가하는 AIC 수식은 다음과 같다.<br><br>

<code>AIC = 2k - 2ln(L)</code><br><br>

여기서 <code>k</code>는 추정해야 할 파라미터의 개수이고, <code>L</code>은 모델의 최대우도(Likelihood)이다. 파라미터 <code>k</code>가 증가할수록 <code>2k</code>라는 패널티가 커지므로, 무작정 차수를 높이는 과적합(Overfitting)을 방지한다.

## 5. Visual Intuition

이 장에서는 식별과 진단 단계에서의 시각화가 중요하다.

1. <strong>차분 시각화</strong>: 지속적으로 우상향하는 원본 주식 가격(비정상) 플롯이 있을 때, 이를 1차 차분(<code>d = 1</code>)한 그래프는 0을 중심으로 위아래로 진동하는 수익률 형태(정상성)로 변환되는 것을 눈으로 확인할 수 있다.
2. <strong>잔차의 잔존 패턴 (Diagnosis Plot)</strong>: 잘 적합된 ARIMA 모형의 잔차를 선 그래프로 그리면 특정한 추세나 주기성이 없는 무작위 파동이어야 한다. 또한 잔차의 ACF 플롯을 그렸을 때, 모든 시차(Lag)에서 막대 그래프가 95% 신뢰구간 안에 들어와 있어야 모델이 과거의 “기억”을 남김없이 잘 추출해 냈다고 직관적으로 판단할 수 있다.

## 6. Python Practice

### 6.1 Data

실습에서는 강한 추세를 띠어 비정상성을 뚜렷하게 보여주는 금융 데이터인 <strong>테슬라(TSLA) 주가 데이터</strong>를 활용한다.

### 6.2 Code Walkthrough

<code>04_ARIMA_forecasting.ipynb</code> 실습에서는 Box-Jenkins의 복잡한 식별 절차를 자동화해 주는 <code>pmdarima</code> 라이브러리의 <code>auto_arima</code> 함수를 중점적으로 다룬다.

```python
from pmdarima import auto_arima

# 1. Auto ARIMA를 이용한 최적 모델 탐색
model = auto_arima(
    data,
    start_p=0, max_p=5,
    start_q=0, max_q=5,
    d=None,                 # d 값을 자동 탐색
    trace=True,             # 탐색 과정 출력
    error_action='ignore',
    suppress_warnings=True,
    stepwise=True           # 힌트를 이용해 빠르게 탐색
)

# 2. 요약 결과 확인
print(model.summary())

# 3. 모델 진단 플롯
model.plot_diagnostics(figsize=(10, 8))
plt.show()
````

이 코드는 내부적으로 ADF 검정 등을 수행하여 최적의 차분 차수 <code>d</code>를 찾고, 지정된 범위 내에서 <code>p</code>와 <code>q</code>를 변경해가며 <strong>AIC 값이 가장 낮은 최적의 파라미터 조합</strong>을 찾아 모델을 학습시킨다.

### 6.3 What to Observe

수강생은 <code>trace=True</code> 옵션을 통해 출력되는 로그를 보며, <code>p</code>, <code>d</code>, <code>q</code> 조합이 바뀔 때마다 AIC 값이 어떻게 변하는지 관찰해야 한다. 또한 <code>model.summary()</code>의 결과표 하단에 위치한 <strong>Ljung-Box (L1) (Q)</strong> 검정의 p-value를 확인하여, 이 값이 0.05보다 큰지, 즉 잔차가 백색잡음에 가까운지를 점검해야 한다.

## 7. Interpretation of Results

도출된 ARIMA 모형의 결과를 해석할 때는 다음 두 가지를 중점적으로 본다.

1. <strong>모델 차수 <code>(p, d, q)</code>의 해석</strong>: 예를 들어 최종 선택된 모델이 ARIMA(1, 1, 1)이라면, “해당 데이터는 한 번 차분했을 때 정상성을 가지며, 전날의 변화 흐름(AR 1)과 전날의 예측 오차(MA 1)를 반영할 때 가장 설명력이 높은 구조”라고 실무적으로 해석할 수 있다.
2. <strong>Ljung-Box 검정 (잔차 분석)</strong>: Box-Jenkins 절차의 진단 단계 핵심이다. 이 검정의 귀무가설 <code>H<sub>0</sub></code>는 “데이터가 독립적으로 분포되어 있으며, 자기상관이 없다(즉, 백색잡음이다)”이다. 따라서 p-value가 0.05보다 커서 귀무가설을 기각하지 못해야, 모델이 데이터의 중요한 패턴을 빼놓지 않고 모두 학습했다고 결론 내릴 수 있다.

## 8. Common Mistakes

* <strong>과대 차분 (Over-differencing)</strong>: 차분을 너무 많이 하면 비정상성을 잡으려다 데이터가 가진 고유의 분산 구조를 훼손하고 인위적인 이동평균(MA) 노이즈를 만들어내게 된다. 보통 경제 데이터에서 <code>d</code>는 1, 아주 드물게 2를 넘지 않는다.
* <strong>수작업 식별에 대한 과도한 집착</strong>: Box-Jenkins의 고전적 방식은 ACF/PACF 플롯을 눈으로 보고 <code>p</code>, <code>q</code>를 식별한다. 하지만 실제 혼합 패턴(ARMA)에서는 이것이 매우 모호하게 나타난다. 시각적 판단에만 의존해 시간을 낭비하기보다 <code>auto_arima</code>와 AIC 정량 지표를 적극 활용하는 것이 실무적으로 훨씬 유용하다.
* <strong>예측 가능성의 맹신</strong>: ARIMA 모델은 단기 예측과 구조적 이해에는 강력하지만, 모형 구조가 선형적이고 고정되어 있어 급격한 위기 상황과 같은 비선형 충격에서는 성능이 급격히 떨어질 수 있음을 인지해야 한다.

## 9. Summary

ARIMA 모형은 시계열 데이터에 내재된 자기상관성(AR), 추세로 인한 비정상성(I), 그리고 과거의 오차 보정(MA) 메커니즘을 종합적으로 모델링하는 강력한 프레임워크이다. 이 모형을 실무에 적용하기 위해 고안된 Box-Jenkins 방법론은 식별, 추정, 진단, 예측이라는 4단계의 체계적인 접근법을 제시한다. 과거에는 분석가의 직관에 의존했던 식별 단계를 최근에는 오컴의 면도날 원리를 반영한 정보 기준(AIC/BIC)과 <code>auto_arima</code> 알고리즘이 상당 부분 대체하여 객관성을 높였다. 최종적으로 추정된 모델은 잔차에 대한 Ljung-Box 검정 등을 통해 완전성을 진단받으며, 이 절차를 이해하는 것은 모든 고급 시계열 분석의 든든한 초석이 된다.

## 10. Exercises

1. <strong>개념 문제:</strong> Box-Jenkins 4단계 방법론 중 “진단(Diagnosis)” 단계에서 잔차가 백색잡음(White Noise) 형태를 띠는지 확인하는 것이 왜 중요한지, 모델 적합성의 관점에서 서술하시오.

2. <strong>해석 문제:</strong> 어떤 시계열 데이터를 분석하여 <code>auto_arima</code>를 돌린 결과, 여러 후보 모델 중 ARIMA(2, 1, 0)의 AIC는 450, ARIMA(1, 1, 1)의 AIC는 448이 나왔다. 오컴의 면도날 및 정보 기준의 관점에서 어떤 모델을 선택해야 하는지, 그리고 그 숫자가 의미하는 바는 무엇인지 설명하시오.

3. <strong>간단한 실습 문제:</strong> 실습 노트북 <code>04_ARIMA_forecasting.ipynb</code>을 열어, 테슬라(TSLA) 주가 데이터를 불러온 뒤 <code>pmdarima</code>의 <code>auto_arima</code> 함수를 적용하시오. 결과 Summary 테이블에서 선택된 <code>(p, d, q)</code> 파라미터가 무엇인지 확인하고, Ljung-Box 검정의 p-value를 바탕으로 잔차의 독립성을 평가하시오.

## 11. Further Reading / References

* Box, G. E. P., Jenkins, G. M., Reinsel, G. C., & Ljung, G. M. (2015). *Time Series Analysis: Forecasting and Control (5th ed.)*. Wiley.
* Hyndman, R. J., & Athanasopoulos, G. (2018). *Forecasting: Principles and Practice (2nd ed.)*. OTexts.
* 정낙현. (2025). *뉴스레터: EP01-ARIMA와 친구들: 숫자 속 전략을 읽는 법*.
* 정낙현. (2026). *Time Series Analysis 1: 시계열 분석 기초 강의안*.
* 실습 코드 저장소 (GitHub): <code>[https://github.com/nhjung-phd/TimeSeriesAnalysis](https://github.com/nhjung-phd/TimeSeriesAnalysis)</code>


