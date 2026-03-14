# Chapter 4. AR, MA, ARMA 모형의 기초

<p><strong>Recommended Week:</strong> Week 4</p>
<p><strong>Notebook:</strong> <code>04_ARMA_Modeling.ipynb</code></p>

## Learning Objectives

이 장을 학습한 후, 수강생은 다음을 할 수 있어야 한다.

- 자기회귀(AR) 모형과 이동평균(MA) 모형의 구조적 차이와 직관적 의미를 이해한다.
- 인과성(Causality)과 가역성(Invertibility)의 수학적 조건이 모델의 안정성에 미치는 영향을 파악한다.
- 자기상관함수(ACF)와 편자기상관함수(PACF)의 형태를 해석하여 AR, MA 모형의 차수 <code>p</code>, <code>q</code>를 식별할 수 있다.
- 정보 기준(AIC/BIC)을 활용하여 최적의 ARMA 모형을 선택하고 파이썬으로 구현할 수 있다.

## 1. Opening

데이터 속에 담긴 시간의 흐름을 읽어낼 때, 우리는 과거로부터 두 가지 중요한 교훈을 얻는다. 첫째는 “나는 지금까지 어떤 흐름을 따라왔는가?”를 돌아보는 것이고, 둘째는 “우리는 과거의 예측에서 어떤 실수를 했는가?”를 반성하는 것이다.

전자를 수학적으로 구현한 것이 자기회귀(AR) 모형이고, 후자의 실수의 흔적을 보정하며 궤도를 수정하는 것이 이동평균(MA) 모형이다. 현실 세계의 복잡한 시계열 데이터는 어느 하나의 단순한 규칙만으로 움직이지 않는다. 이 장에서는 과거의 흐름에 대한 신뢰(AR)와 오차에 대한 면역시스템(MA)을 유연하게 결합하여, 불확실한 미래를 정교하게 추정하는 시계열 분석의 척추, <strong>ARMA(Autoregressive Moving Average)</strong> 모형의 기초를 다진다.

## 2. Why This Topic Matters

정상성(Stationarity)을 확보한 시계열 데이터를 분석할 때, ARMA 모형은 가장 클래식하면서도 실무적으로 강력한 기준점(Baseline) 역할을 한다.

특정 변수의 시계열 패턴이 단순히 자기 자신의 과거 추세를 추종하는지, 아니면 일시적인 외부 충격(Shock)의 잔여물인지를 분리해 내는 것은 전략적 의사결정에 필수적이다. 완벽한 순수 AR이나 순수 MA 패턴을 그리는 현실 데이터는 매우 드물기 때문에, 두 모형의 결합인 ARMA를 이해하지 못하면 이후 장에서 다룰 ARIMA나 SARIMA, 나아가 딥러닝 기반의 고도화된 모델링을 설계할 때 그 내부의 “기억 구조”를 전혀 해석하지 못하는 한계에 부딪히게 된다.

## 3. Core Concepts

### 3.1 AR(p): 자기회귀 모형 (Autoregressive Model)

AR 모형은 현재 시점의 값이 과거 <code>p</code>개 시점의 자기 자신 관측치들에 선형적으로 의존한다고 가정하는 모형이다. 즉, 시간이라는 축 위에서 자기 자신을 독립변수로 삼아 다중 선형 회귀를 수행하는 것과 같다. 과거의 패턴이 얼마나 “전략적 신뢰도”를 갖고 미래로 이어지는지 측정한다.

### 3.2 MA(q): 이동평균 모형 (Moving Average Model)

MA 모형은 현재 시점의 값이 과거의 관측치가 아니라, 과거 <code>q</code>개 시점에 발생했던 예측 오차(백색잡음, 충격)들의 선형 결합으로 결정된다고 보는 모형이다. 과거의 외부 충격이 현재까지 얼마나 살아남아 영향을 미치는지를 포착한다.

### 3.3 ARMA(p, q): 자기회귀 이동평균 모형

AR 모형과 MA 모형을 결합한 형태로, 과거의 상태(State)와 과거의 충격(Shock)을 동시에 반영하여 현재를 설명한다.

### 3.4 인과성(Causality)과 가역성(Invertibility)

ARMA 모형이 수학적, 실무적 의미를 가지려면 두 가지 조건이 필요하다.

- <strong>인과성(Causality)</strong>: ARMA 과정이 미래의 오차가 아닌, 오직 순수한 과거와 현재의 백색잡음(White Noise)의 결합으로만 표현될 수 있는 성질이다. AR 다항식의 근(Roots)이 복소 평면상에서 단위원(Unit circle) 밖에 위치해야 성립한다.
- <strong>가역성(Invertibility)</strong>: 모형의 오차(백색잡음)를 과거의 관측치들의 결합으로 역산하여 표현할 수 있는 성질이다. MA 다항식의 근이 단위원 밖에 위치해야 성립하며, 이를 통해 모형을 고유하게(Uniquely) 식별할 수 있다.

## 4. Mathematical Formulation

수학적 간결성을 위해 <strong>후방 이동 연산자(Backward Shift Operator, <code>B</code>)</strong>를 도입한다. 예를 들어 <code>BX<sub>t</sub> = X<sub>t-1</sub></code> 이다.

### 4.1 AR(p) 모형

AR(<code>p</code>) 모형은 다음과 같이 쓸 수 있다.<br><br>

<code>X<sub>t</sub> = φ<sub>1</sub>X<sub>t-1</sub> + ... + φ<sub>p</sub>X<sub>t-p</sub> + Z<sub>t</sub></code><br><br>

이를 후방 이동 연산자 <code>B</code>로 묶어 표현하면 다음과 같다.<br><br>

<code>φ(B)X<sub>t</sub> = Z<sub>t</sub></code><br><br>

여기서 <code>Z<sub>t</sub></code>는 백색잡음이다.

### 4.2 MA(q) 모형

MA(<code>q</code>) 모형은 다음과 같이 쓸 수 있다.<br><br>

<code>X<sub>t</sub> = Z<sub>t</sub> + θ<sub>1</sub>Z<sub>t-1</sub> + ... + θ<sub>q</sub>Z<sub>t-q</sub></code><br><br>

마찬가지로 연산자 형태로는 다음과 같이 표현된다.<br><br>

<code>X<sub>t</sub> = θ(B)Z<sub>t</sub></code>

### 4.3 ARMA(p, q) 모형

AR과 MA를 결합한 일반형은 다음과 같다.<br><br>

<code>φ(B)X<sub>t</sub> = θ(B)Z<sub>t</sub></code><br><br>

이 방정식은 시계열 데이터 <code>X<sub>t</sub></code>의 변동이 과거의 예측 오차 <code>Z<sub>t</sub></code>들의 구조와 연결된다는 점을 수학적으로 정의한다.

## 5. Visual Intuition

모형의 차수 <code>p</code>와 <code>q</code>를 식별(Identification)하기 위해서는 <strong>ACF(자기상관함수)</strong>와 <strong>PACF(편자기상관함수)</strong> 그래프의 패턴을 관찰해야 한다.

- <strong>순수 AR(p) 판별</strong>: PACF가 시차 <code>p</code> 이후에 신뢰구간 근처로 절단(Cuts off)되고, ACF는 점진적으로 감소하거나 물결치며 감쇠(Tails off)한다.
- <strong>순수 MA(q) 판별</strong>: ACF가 시차 <code>q</code> 이후에 절단(Cuts off)되고, PACF가 점진적으로 감소(Tails off)한다.
- <strong>ARMA(p, q) 혼합 모형</strong>: ACF와 PACF 모두 특정 시차에서 뚜렷하게 절단되지 않고, 점진적으로 감소(Tails off)하는 형태를 보인다. 이 경우에는 시각적 판단만으로 정확한 차수를 알기 어려워, 정보 기준(AIC)을 사용해야 한다.

## 6. Python Practice

### 6.1 Data

실습에서는 금융 시장의 변동성을 잘 보여주는 <strong>테슬라(TSLA) 주가 수익률 데이터</strong>(1차 차분된 정상 시계열)와, 모델 식별을 명확히 연습할 수 있는 <strong>인위적으로 생성된 ARMA(1, 1) 데이터</strong>를 활용한다.

### 6.2 Code Walkthrough

<code>statsmodels</code> 라이브러리의 <code>SARIMAX</code> 함수(또는 <code>auto_arima</code>)를 사용하여 모델을 적합한다.

```python
from statsmodels.tsa.statespace.sarimax import SARIMAX

# 1. 모델 정의 및 적합 (예: ARMA(1, 1))
model = SARIMAX(endog=data, order=(1, 0, 1), simple_differencing=False)
results = model.fit(disp=False)

# 2. 결과 및 AIC 확인
print(results.summary())
print("AIC:", results.aic)
````

* <code>order=(p, d, q)</code>에서 <code>d=0</code>으로 설정하면 순수한 ARMA 모델을 훈련한다.
* <code>for</code> 루프를 사용해 다양한 <code>(p, q)</code> 조합의 모델을 적합한 뒤, 각 모델의 <code>results.aic</code> 값을 저장하고 가장 작은 값을 가진 모델을 찾는다.

### 6.3 What to Observe

수강생은 첫째, <code>(p, q)</code> 차수를 변경함에 따라 모형의 <strong>AIC(Akaike Information Criterion)</strong> 값이 어떻게 변화하는지 관찰해야 한다. 둘째, 최적 모델 적합 후 추출한 잔차(Residual) 플롯이 아무런 패턴이 없는 백색잡음(White Noise) 형태인지 시각적으로 검토해야 한다.

## 7. Interpretation of Results

도출된 결과는 철저히 검증되어야 한다.

* <strong>AIC/BIC 기반 모델 선택</strong>: 모델의 차수(복잡도)가 늘어나면 설명력은 올라가지만 과적합(Overfitting)의 위험이 있다. AIC는 모델의 적합도를 높이면서도 불필요한 파라미터 추가에 페널티를 주어, “가장 단순하면서도 설명력이 높은” 최적의 모델을 고르게 해 준다.
* <strong>잔차 진단 (Residual Diagnosis)</strong>: 잔차에 대해 <strong>Ljung-Box 테스트</strong>를 수행하여 p-value가 0.05보다 크게 나와야(귀무가설 유지) “잔차에 자기상관이 없다(즉, 모델이 데이터를 충분히 학습했다)”라고 해석할 수 있다.

## 8. Common Mistakes

* <strong>비정상 데이터에 무작정 ARMA 적용</strong>: ARMA 모형은 반드시 데이터가 약정상성(Stationarity)을 만족한다는 전제하에 작동한다. 단위근이 있는 데이터를 차분 없이 넣으면 모델 파라미터가 수렴하지 않거나 가짜 회귀에 빠질 수 있다.
* <strong>ACF/PACF의 기계적 맹신</strong>: 실제 데이터는 이론처럼 뚜렷하게 절단(Cut off)되지 않는 경우가 많다. 눈으로 그래프를 억지로 끼워 맞추려다 시간을 낭비하는 오류를 피하고, 여러 후보를 설정한 뒤 AIC를 통한 정량적 비교를 병행해야 한다.

## 9. Summary

ARMA 모형은 자기회귀(AR)를 통해 과거 자신의 흐름을 추종하는 속성과, 이동평균(MA)을 통해 과거의 오차(충격)를 보정하는 속성을 결합한 정상 시계열의 핵심 모델이다. 모형이 고유하고 안정적인 해를 갖기 위해서는 인과성과 가역성 조건이 필수적으로 요구된다. ACF와 PACF의 패턴 분석은 초기 모델 차수를 식별하는 직관적 나침반을 제공하지만, 현실의 복합적인 데이터에서는 AIC/BIC와 같은 정보 기준을 통해 여러 후보 모형을 정량적으로 평가해야 한다. 최종적으로 모델이 타당성을 인정받으려면 잔차가 백색잡음의 형태를 띠는지(Ljung-Box 검정 등) 반드시 진단해야 한다.

## 10. Exercises

1. <strong>개념 문제:</strong> 어떤 ARMA 과정이 “인과적(Causal)”이라는 것은 수학적으로 무엇을 의미하며, 시계열 예측에서 이 조건이 왜 필수적인지 설명하시오.

2. <strong>해석 문제:</strong> 시계열 데이터의 ACF 그래프를 그렸더니 시차 2 이후로 신뢰구간 안으로 절단(Cuts off)되었고, PACF는 점진적으로 0으로 수렴(Tails off)하는 형태를 보였다. Box-Jenkins 식별법에 따르면 이 데이터는 어떤 모형에 가장 적합한가?

3. <strong>간단한 실습 문제:</strong> 제공된 <code>04_ARMA_Modeling.ipynb</code>에서 파이썬 코드를 활용하여 <code>p</code>와 <code>q</code>의 여러 조합에 대해 모든 ARMA(<code>p</code>, <code>q</code>) 후보를 반복문으로 적합하고, AIC가 가장 낮은 최적의 차수 조합을 찾아 출력하는 함수를 작성하시오.

## 11. Further Reading / References

* Brockwell, P. J., & Davis, R. A. (2016). *Introduction to Time Series and Forecasting (3rd ed.)*. Springer.
* Peixeiro, M. (2022). *Time Series Forecasting in Python*. Manning Publications.
* Shumway, R. H., & Stoffer, D. S. (2017). *Time Series Analysis and Its Applications (4th ed.)*. Springer.
* 정낙현. (2026). *Time Series Analysis 1: 시계열 분석 기초 강의안*.
* 정낙현. (2025). *뉴스레터: EP01-ARIMA와 친구들: 숫자 속 전략을 읽는 법*.


