좋습니다. 아래는 앞선 형식과 동일하게, **강조는 `<strong>...</strong>`**, 수식과 첨자 표기는 **`<code>...</code>` + `<sub>`** 형식으로 다시 정리한 버전입니다.

---

````md
# Chapter 10. 공적분과 장기균형 관계

<p><strong>Recommended Week:</strong> Week 11</p>
<p><strong>Notebook:</strong> <code>10_Cointegration_and_VECM.ipynb</code></p>

## Learning Objectives

- 비정상(I(1)) 시계열 변수들을 그대로 회귀분석할 때 발생하는 가짜 회귀(Spurious Regression)의 위험성을 이해한다.
- 공적분(Cointegration)의 수학적·직관적 개념을 파악하고, 장기 균형(Long-run Equilibrium) 관계의 의미를 설명할 수 있다.
- 공적분 관계가 존재할 때, 단기적 변동과 장기적 균형으로의 회귀를 동시에 모델링하는 오차수정모형(ECM) 및 VECM의 구조를 이해한다.
- 파이썬을 활용하여 Engle-Granger 공적분 검정을 수행하고, VECM 모형을 추정하여 그 결과를 비즈니스 및 경제학적 맥락에서 해석할 수 있다.

## 1. Opening

거리에 술에 잔뜩 취한 두 사람이 걷고 있다고 상상해 보자. 각자는 다음 발걸음을 어디로 내디딜지 전혀 예측할 수 없는 완벽한 무작위 행보(Random Walk)를 보이며 비틀거린다. 이 두 사람의 궤적을 각각 시계열 데이터로 보면 전혀 안정적이지 않은 비정상(Non-stationary) 데이터이다.

하지만 만약 이 두 사람이 서로 굳게 어깨동무를 하고 걷는다면 어떻게 될까? 비록 둘 다 여전히 비틀거리며 어디로 갈지 알 수 없지만, 적어도 두 사람 사이의 거리는 일정하게 유지될 것이다. 한 사람이 오른쪽으로 크게 휘청이면, 어깨동무를 한 다른 사람도 곧 그 방향으로 끌려가며 다시 균형을 맞추기 때문이다.

시계열 분석에서 이 어깨동무에 해당하는 개념이 바로 <strong>공적분(Cointegration)</strong>이다. 이 장에서는 불안정한 세상 속에서도 변치 않는 장기적인 균형의 끈을 찾아내고, 이를 예측에 활용하는 방법을 배운다.

## 2. Why This Topic Matters

현실의 거시경제 지표(GDP, 소비, 통화량)나 금융 자산의 가격(주가, 환율 등)은 대부분 시간이 지날수록 평균과 분산이 커지는 단위근(Unit Root), 즉 I(1) 특성을 띤다.

앞선 장에서 우리는 이런 비정상 데이터를 다룰 때 반드시 차분(Differencing)을 통해 정상 시계열로 만들어야 한다고 배웠다. 하지만 모든 변수를 무작정 차분해 버리면 치명적인 손실이 발생한다. 데이터가 원래 가지고 있던 변수 간의 소중한 장기적 수준(Level) 관계 정보가 완전히 파괴되기 때문이다.

만약 소비와 소득, 혹은 두 국가의 환율 사이에 장기적인 균형 관계가 존재한다면, 우리는 단순한 차분 VAR 모형을 넘어 <strong>벡터오차수정모형(VECM)</strong>을 사용해야 한다. 이를 통해 현재 환율이 장기 균형에서 얼마나 벗어나 있으며, 다음 달에는 균형을 맞추기 위해 어느 방향으로 얼마나 빠르게 움직일 것인지를 정교하게 시뮬레이션할 수 있다.

## 3. Core Concepts

### 3.1 가짜 회귀 (Spurious Regression)

단위근을 가진 두 개 이상의 비정상 시계열, 예를 들어 한국의 GDP와 미국의 특정 기업 매출을 아무런 전처리 없이 일반적인 선형 회귀분석에 넣는 경우를 말한다. 두 변수 사이에 실제 인과관계가 전혀 없음에도 불구하고, 단순히 둘 다 우상향한다는 이유만으로 결정계수 <code>R²</code>가 매우 높게 나오고 t-통계량이 유의미하게 도출되는 통계적 착시 현상이 발생할 수 있다.

### 3.2 공적분 (Cointegration)

각각의 시계열 변수들 <code>y<sub>t</sub></code>, <code>x<sub>t</sub></code>은 단위근을 가져 불안정한 I(1) 과정이지만, 이들의 특정한 선형 결합, 예를 들어 <code>y<sub>t</sub> - βx<sub>t</sub></code>는 단위근이 없는 안정적인 I(0) 과정이 되는 현상이다. 이는 두 변수가 장기적으로 일정한 궤도를 함께 공유하고 있음을 의미한다.

### 3.3 장기 균형과 오차수정 (Long-Run Equilibrium & Error Correction)

공적분 관계인 선형 결합 <code>y<sub>t</sub> - βx<sub>t</sub> = 0</code>은 두 변수가 도달해야 할 <strong>장기 균형(Long-run Equilibrium)</strong> 상태를 나타낸다. 현실에서는 다양한 충격으로 인해 단기적으로 이 균형 상태에서 벗어나 오차(Equilibrium error)가 발생한다. 하지만 시스템이 안정적이라면, 시간이 지남에 따라 스스로 이 오차를 수정(Error Correction)하여 다시 균형 상태로 돌아오려는 성질을 갖는다.

## 4. Mathematical Formulation

### 4.1 공적분의 수학적 정의

벡터 <code>x<sub>t</sub></code>의 각 요소가 I(1) 과정일 때, 만약 어떤 0이 아닌 벡터 <code>α</code>가 존재하여 다음을 만족한다면 공적분이 성립한다고 말한다.<br><br>

<code>z<sub>t</sub> = α'x<sub>t</sub> ~ I(0)</code><br><br>

즉, 개별 변수는 비정상이지만 특정한 선형 결합은 정상성을 띤다. 이때 <code>α</code>를 공적분 벡터(Cointegrating vector)라고 부른다. 직관적으로는 <code>y<sub>t</sub> - βx<sub>t</sub> = e<sub>t</sub></code>에서 <code>e<sub>t</sub></code>가 안정적인 정상 시계열이라면 두 변수는 공적분 관계에 있다고 해석할 수 있다.

### 4.2 오차수정모형 (ECM)과 Granger 표현 정리

엥글(Engle)과 그랜저(Granger)는 두 변수가 공적분 관계에 있다면, 이들의 동학은 반드시 오차수정모형(ECM)으로 표현될 수 있음을 보였다. 단순화된 ECM의 수식은 다음과 같다.<br><br>

<code>Δy<sub>t</sub> = γ<sub>1</sub>Δx<sub>t</sub> - α(y<sub>t-1</sub> - βx<sub>t-1</sub>) + u<sub>t</sub></code><br><br>

여기서 각 항의 의미는 다음과 같다.

- <code>Δy<sub>t</sub></code>, <code>Δx<sub>t</sub></code>: 변수들의 단기적인 변화
- <code>(y<sub>t-1</sub> - βx<sub>t-1</sub>)</code>: 이전 시점의 장기 균형으로부터의 이탈, 즉 오차
- <code>α</code>: <strong>조정 속도(Speed of adjustment)</strong> 파라미터. 균형에서 벗어났을 때 변수 <code>y</code>가 얼마나 빠르게 제자리로 돌아오려 하는지를 결정한다.

## 5. Visual Intuition

공적분 관계를 시각적으로 파악하기 위해서는 스프레드(Spread) 또는 오차(Error) 그래프를 그려보는 것이 효과적이다.

1. <strong>수준(Level) 그래프 겹쳐 그리기</strong>  
   예를 들어 미국의 소비와 소득 두 I(1) 시계열을 한 그래프에 그리면, 두 선이 끊임없이 위를 향해 불규칙하게 움직이면서도 묘하게 서로 얽혀 같이 올라가는 형태를 보일 수 있다.

2. <strong>선형 결합(잔차) 그래프</strong>  
   이 두 변수를 회귀분석하여 얻은 잔차, 즉 <code>e<sub>t</sub> = y<sub>t</sub> - βx<sub>t</sub></code>를 그려본다. 두 변수가 공적분되어 있다면, 이 잔차 그래프는 0을 중심으로 위아래로 일정한 진폭을 가지며 진동하는 전형적인 정상 시계열의 모습을 보여야 한다.

## 6. Python Practice

### 6.1 Data

본 실습에서는 거시경제의 대표적인 공적분 사례인 <strong>국가별 장단기 금리 데이터</strong>나 <strong>거시경제 지표(소득과 소비)</strong>를 활용한다. 또는 금융공학에서 페어 트레이딩(Pairs Trading)의 대상이 되는 두 상관성 높은 주식 데이터를 사용할 수도 있다.

### 6.2 Code Walkthrough

<code>10_Cointegration_and_VECM.ipynb</code> 노트북에서는 크게 Engle-Granger 2단계 검정과 VECM 모델링을 다룬다.

1. <strong>Engle-Granger 공적분 검정</strong>

```python
from statsmodels.tsa.stattools import coint

# y와 x가 공적분 관계에 있는지 검정
score, p_value, _ = coint(df['y'], df['x'])
print(f"Cointegration Test P-value: {p_value}")
````

이 함수는 <code>y</code>를 <code>x</code>에 회귀시킨 뒤, 그 잔차에 대해 ADF 단위근 검정을 수행하여 잔차가 I(0)인지 확인한다.

2. <strong>VECM (벡터오차수정모형) 적합</strong>

```python
from statsmodels.tsa.vector_ar.vecm import VECM, select_order

# 최적 시차 선택
lag_order = select_order(df[['y', 'x']], maxlags=10)

# VECM 모형 적합
vecm_model = VECM(df[['y', 'x']], k_ar_diff=lag_order.aic, coint_rank=1)
vecm_results = vecm_model.fit()

print(vecm_results.summary())
```

### 6.3 What to Observe

먼저 개별 시계열 변수가 모두 ADF 검정에서 I(1)임을 확인한 뒤, <code>coint()</code> 검정의 p-value가 0.05보다 작게 나와 잔차가 I(0)가 됨을 확인해야 한다. VECM 결과를 출력했을 때 가장 중요한 것은 <code>α</code>, 즉 <strong>오차수정계수(Error Correction Coefficient)</strong>이다. 이 값이 통계적으로 유의미한 음수(-)를 가져야 모형이 균형으로 회귀하는 시스템임을 시사한다.

## 7. Interpretation of Results

VECM의 결과를 해석하는 것은 매우 흥미로운 통찰을 제공한다.

만약 주식 A와 주식 B의 VECM 모형에서 A 방정식의 오차수정계수 <code>α<sub>y</sub></code>가 -0.15로 나왔다면, 이는 어제 두 주식 간의 가격 차이가 장기 균형에서 1만큼 벌어졌을 때, 오늘 주식 A는 그 격차를 줄이기 위해 약 15% 정도 가격을 조정할 것이라는 뜻으로 해석할 수 있다. 반면 <code>α<sub>x</sub></code>가 0에 가깝다면, 균형이 깨졌을 때 주식 B는 거의 움직이지 않고 오직 주식 A만 가격을 조정하는 것으로 볼 수 있다. 이는 실무적으로 어느 자산이 가격 조정의 주체인지, 즉 가격 선도력(price leadership)이 어디에 있는지를 판단하는 데 도움을 준다.

## 8. Common Mistakes

* <strong>상관관계(Correlation)와 공적분(Cointegration)의 혼동</strong>: 두 데이터의 상관계수가 높다고 해서 공적분이 존재하는 것은 아니다. 가짜 회귀에서도 상관계수는 매우 높게 나올 수 있다. 공적분은 단순히 같이 움직인다는 뜻이 아니라, 오차 또는 거리가 일정한 범위 내로 제한되는 장기 균형 관계를 의미한다.
* <strong>I(0) 변수에 대한 공적분 검정 남용</strong>: 공적분은 반드시 각 변수가 단위근을 가진 I(1) 비정상 시계열일 때 의미가 있다. 이미 안정적인 I(0) 변수들을 모아놓고 공적분 검정을 수행하는 것은 이론적으로 적절하지 않다.
* <strong>Johansen 검정과 EG 검정의 차이 간과</strong>: 변수가 3개 이상일 경우 장기 균형 관계, 즉 공적분 벡터는 여러 개 존재할 수 있다. Engle-Granger 검정은 종속변수를 하나 정해야 하므로 결과가 변수 선택에 따라 달라질 수 있지만, Johansen 검정은 여러 개의 공적분 벡터를 동시에 찾을 수 있어 다변량 시스템에서 더 적합하다.

## 9. Summary

경제와 비즈니스 데이터의 대부분은 충격을 영구적으로 기억하는 단위근 I(1) 특성을 가진다. 이들을 그대로 회귀분석하면 아무 관계가 없어도 인과성이 있는 것처럼 보이는 가짜 회귀(Spurious Regression)의 함정에 빠질 수 있다. 그러나 비틀거리는 두 I(1) 변수가 서로 묶여 장기적으로 일정한 궤도 I(0)를 함께한다면, 우리는 이들이 공적분(Cointegration)되어 있다고 말한다. 공적분 관계가 확인되면 단순 차분을 넘어, 오차수정모형(ECM/VECM)을 통해 변수들의 단기적 변동과 장기적 균형으로의 회복력을 하나의 모델로 결합할 수 있다. 이는 다변량 시계열 분석에서 매우 강력한 해석 도구가 된다.

## 10. Exercises

1. <strong>개념 문제:</strong> 가짜 회귀의 정의를 단위근(Unit Root)의 관점에서 설명하고, 이를 해결하기 위해 공적분 검정이 왜 선행되어야 하는지 논리적으로 서술하시오.

2. <strong>해석 문제:</strong> 소비와 소득을 이용한 오차수정모형을 추정했더니, 단기 방정식의 오차수정계수 <code>α</code>가 통계적으로 유의미한 <code>+0.5</code>가 도출되었다. 이 시스템이 장기 균형으로 수렴하는 안정적인 시스템인지 평가하고, 그 이유를 설명하시오.

3. <strong>간단한 실습 문제:</strong> 실습 노트북 <code>10_Cointegration_and_VECM.ipynb</code>의 두 가상 금융 데이터 <code>Stock_P</code>, <code>Stock_Q</code>를 불러오시오. 두 변수가 모두 I(1)임을 ADF 검정으로 확인한 뒤, <code>statsmodels</code>의 <code>coint</code> 함수를 사용하여 두 주가 사이에 공적분 관계가 성립하는지 유의수준 5%에서 판별하시오.

## 11. Further Reading / References

* Engle, R. F., & Granger, C. W. J. (1987). *Co-integration and error correction: representation, estimation and testing*. *Econometrica*, 55, 251–276.
* Hamilton, J. D. (1994). *Time Series Analysis*. Princeton University Press.
* Johansen, S. (1988). *Statistical Analysis of Cointegration Vectors*. *Journal of Economic Dynamics and Control*, 12, 231–254.
* 정낙현. (2026). *Time Series Analysis 5: 시계열 분석 추가2 강의안*.

```

원하시면 다음 장도 같은 형식으로 이어서 정리해드리겠습니다.
```
