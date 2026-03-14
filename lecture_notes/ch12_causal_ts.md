# Chapter 12. 시계열 인과추론 입문

<p><strong>Recommended Week:</strong> Week 13</p>
<p><strong>Notebook:</strong> <code>12_causal_time_series_intro.ipynb</code></p>

## Learning Objectives

- 시계열 예측(Forecasting)과 시계열 인과추론(Causal Inference)의 목적 차이를 설명할 수 있다.
- 반사실(Counterfactual)의 개념을 이해하고, 시계열 인과효과를 어떻게 정의하는지 설명할 수 있다.
- 단절적 시계열 설계(Interrupted Time Series)와 비교 시계열 접근의 기본 논리를 이해할 수 있다.
- 개입 전 추세, 개입 시점, 개입 후 변화의 구조를 바탕으로 정책효과를 해석할 수 있다.
- 시계열 인과추론에서 흔히 발생하는 혼란 변수, 동시 충격, 구조변화 문제를 진단할 수 있다.

## 1. Opening

예측과 인과는 닮아 보이지만 전혀 다른 질문이다. 예측은 “다음 달 매출이 얼마인가?”를 묻고, 인과는 “광고 캠페인이 없었다면 다음 달 매출은 어땠는가?”를 묻는다. 두 질문 모두 미래와 변화를 다루지만, 하나는 정확한 숫자를 맞히는 데 관심이 있고, 다른 하나는 변화의 원인을 식별하는 데 관심이 있다.

시계열 데이터에서 인과추론이 특히 어려운 이유는 시간의 흐름 속에서 모든 것이 함께 변하기 때문이다. 정책이 시행된 시점에 경기 상황도 바뀌고, 소비 심리도 움직이며, 계절성도 동시에 작동할 수 있다. 따라서 어떤 변화가 정말로 정책이나 개입 때문인지, 아니면 원래 진행 중이던 추세나 외부 충격 때문인지를 구분해야 한다.

이 장에서는 이러한 문제를 다루는 가장 기초적인 시계열 인과추론의 관점을 소개한다. 핵심은 단순한 전후 비교가 아니라, <strong>개입이 없었더라면 관측되었을 반사실 경로</strong>를 어떻게 추론할 것인가에 있다.

## 2. Why This Topic Matters

현실의 경영 및 정책 의사결정은 대부분 개입 효과를 묻는다. 예를 들어 가격 인하가 매출을 정말 늘렸는지, 새로운 규제가 사고율을 실제로 낮췄는지, 마케팅 캠페인이 고객 유입을 증가시켰는지와 같은 질문은 모두 인과적 질문이다.

그러나 실제 데이터에서는 개입 전후의 평균만 비교한다고 해서 인과효과를 말할 수 없다. 개입 이후 수치가 증가했더라도, 그것이 원래 진행 중이던 상승 추세의 연장선일 수 있고, 계절성이나 외부 사건의 결과일 수도 있기 때문이다. 따라서 시계열 인과추론은 “변화가 있었다”는 사실을 넘어, <strong>그 변화가 왜 발생했는가</strong>를 설명하는 분석 틀을 제공한다.

또한 현대의 정책평가, 디지털 마케팅 성과 측정, 운영관리 실험, 공공보건 개입평가 등은 모두 시간축을 가진 데이터를 사용한다. 시계열 인과추론을 이해하지 못하면, 매우 그럴듯하지만 실제로는 잘못된 정책 결론을 내릴 위험이 커진다.

## 3. Core Concepts

### 3.1 예측과 인과의 차이

예측은 미래의 값을 가장 정확하게 맞히는 데 목적이 있다. 따라서 변수 간의 구조적 의미가 다소 불분명하더라도 예측력이 높다면 좋은 모형으로 평가될 수 있다.

반면 인과추론은 특정 개입이나 처치가 결과에 어떤 변화를 일으켰는지 식별하는 것이 목적이다. 따라서 설명력이나 예측력만으로는 충분하지 않으며, 개입이 없었을 경우의 결과와 비교하는 반사실적 사고가 필요하다.

즉, 예측의 질문은 “무엇이 일어날 것인가”이고, 인과의 질문은 “무엇 때문에 일어났는가”이다.

### 3.2 반사실 (Counterfactual)

인과추론의 핵심은 반사실이다. 반사실이란, 실제로는 개입이 일어났지만 <strong>만약 그 개입이 없었다면</strong> 결과가 어떻게 되었을지를 의미한다.

예를 들어 어떤 정책이 2024년 1월에 시행되었다면, 우리는 실제 관측된 2024년 2월의 값은 알 수 있지만, 정책이 없었다면 2024년 2월 값이 얼마였을지는 직접 관측할 수 없다. 인과효과는 바로 이 관측 불가능한 반사실과 실제 관측값의 차이로 정의된다.

### 3.3 단절적 시계열 설계 (Interrupted Time Series)

가장 기본적인 시계열 인과추론 설계는 <strong>단절적 시계열 설계</strong>이다. 이는 특정 개입 시점을 중심으로, 개입 전 추세와 개입 후 수준 또는 추세의 변화를 비교하는 방식이다.

핵심 질문은 다음과 같다.

- 개입 직후 수준(Level)이 갑자기 바뀌었는가
- 개입 이후 기울기(Slope)가 달라졌는가
- 그 변화가 기존 추세로 설명 가능한 범위를 넘는가

이 설계는 비교적 단순하지만, 개입 시점이 명확하고 개입 전 충분한 데이터가 있을 때 매우 유용하다.

### 3.4 비교 시계열과 통제의 필요성

단일 시계열만으로는 외부 충격과 개입 효과를 분리하기 어려운 경우가 많다. 따라서 가능하다면 비교 집단 또는 비교 시계열을 함께 두는 것이 좋다.

예를 들어 한 국가에만 정책이 시행되었고 다른 유사 국가에는 시행되지 않았다면, 비교 시계열을 통해 공통 충격과 개입 효과를 더 잘 구분할 수 있다. 이러한 사고는 synthetic control이나 difference-in-differences와도 연결된다.

## 4. Mathematical Formulation

가장 기본적인 단절적 시계열 모형은 다음과 같이 쓸 수 있다.<br><br>

<code>Y<sub>t</sub> = β<sub>0</sub> + β<sub>1</sub>Time<sub>t</sub> + β<sub>2</sub>Intervention<sub>t</sub> + β<sub>3</sub>PostTime<sub>t</sub> + ε<sub>t</sub></code><br><br>

각 항의 의미는 다음과 같다.

- <code>Y<sub>t</sub></code>: 시점 <code>t</code>에서의 결과 변수
- <code>Time<sub>t</sub></code>: 전체 시간 추세
- <code>Intervention<sub>t</sub></code>: 개입 전에는 0, 개입 후에는 1인 더미 변수
- <code>PostTime<sub>t</sub></code>: 개입 이후의 경과 시간
- <code>ε<sub>t</sub></code>: 오차항

이때 해석은 보통 다음과 같다.

- <code>β<sub>1</sub></code>: 개입 이전의 기초 추세
- <code>β<sub>2</sub></code>: 개입 직후의 수준 변화
- <code>β<sub>3</sub></code>: 개입 이후 추세 변화

즉, 이 모형은 개입이 단지 일시적 수준 점프를 만들었는지, 아니면 이후의 성장률 자체를 바꾸었는지를 구분할 수 있게 해준다.

## 5. Visual Intuition

시계열 인과추론에서는 그림이 매우 중요하다.

1. <strong>개입 전후 추세선 비교</strong>  
   원시 시계열 위에 개입 시점을 수직선으로 표시하고, 개입 전 추세선과 개입 후 추세선을 따로 그린다. 이때 수준이 갑자기 변했는지, 혹은 기울기가 바뀌었는지를 직관적으로 볼 수 있다.

2. <strong>반사실 경로와 실제 관측값 비교</strong>  
   개입 전 데이터로부터 연장된 반사실 예측선과, 실제 개입 후 관측값을 함께 그린다. 두 선 사이의 간격이 개입 효과의 시각적 표현이 된다.

3. <strong>비교 시계열 플롯</strong>  
   처리 집단과 비교 집단의 시계열을 함께 그리면, 공통 충격과 고유 충격을 구분하는 데 도움이 된다.

## 6. Python Practice

### 6.1 Data

실습에서는 정책 시행 전후의 사고 건수, 마케팅 캠페인 전후의 방문자 수, 혹은 서비스 개편 전후의 고객 이탈률과 같은 데이터를 사용할 수 있다. 핵심은 개입 시점이 명확하고, 개입 전 데이터가 충분히 길며, 가능하면 비교 시계열도 함께 존재하는 데이터이다.

### 6.2 Code Walkthrough

<code>12_causal_time_series_intro.ipynb</code>에서는 기본적인 Interrupted Time Series 회귀를 구현할 수 있다.

```python
import pandas as pd
import statsmodels.api as sm

df["time"] = range(len(df))
df["intervention"] = (df.index >= intervention_date).astype(int)
df["post_time"] = 0
df.loc[df.index >= intervention_date, "post_time"] = range(df["intervention"].sum())

X = df[["time", "intervention", "post_time"]]
X = sm.add_constant(X)
y = df["outcome"]

model = sm.OLS(y, X).fit()
print(model.summary())
````

필요하다면 자기상관 문제를 줄이기 위해 Newey-West 표준오차를 사용하거나, ARIMA 오차 구조를 결합한 회귀로 확장할 수 있다.

### 6.3 What to Observe

실습에서는 다음을 중점적으로 확인해야 한다.

* 개입 전 추세가 비교적 안정적인가
* 개입 직후 수준 점프가 존재하는가
* 개입 후 추세의 기울기가 바뀌었는가
* 잔차에 강한 자기상관이 남아 있는가
* 단순한 전후 평균 차이와 추세 통제 후 결과가 얼마나 달라지는가

## 7. Interpretation of Results

예를 들어 <code>β<sub>2</sub></code>가 양(+)이고 통계적으로 유의하다면, 개입 직후 결과 변수의 수준이 즉각적으로 상승했다고 해석할 수 있다. 반대로 <code>β<sub>3</sub></code>가 유의하다면, 개입이 단순한 일회성 점프가 아니라 장기적 추세의 기울기 자체를 바꾸었다고 볼 수 있다.

하지만 해석에서 가장 중요한 것은, 이 결과가 정말 개입 때문이라고 볼 수 있는지 점검하는 일이다. 개입 시점에 다른 외부 사건이 동시에 발생했거나, 계절성이 충분히 통제되지 않았거나, 데이터 생성 과정에 구조변화가 겹쳐 있다면, 추정된 효과는 왜곡될 수 있다.

따라서 시계열 인과효과 해석은 회귀계수의 부호와 유의성만 보는 것이 아니라, <strong>설계의 타당성</strong>과 <strong>반사실의 신뢰성</strong>을 함께 평가해야 한다.

## 8. Common Mistakes

* <strong>단순 전후 평균 비교</strong>: 개입 전후 평균만 비교하면 기존 추세와 계절성을 개입 효과로 오인할 수 있다.
* <strong>동시 충격의 무시</strong>: 개입 시점에 다른 사건이 함께 발생했을 경우, 추정된 효과는 순수한 개입 효과가 아닐 수 있다.
* <strong>자기상관 미통제</strong>: 시계열 오차의 자기상관을 무시하면 표준오차가 왜곡되어 유의성이 과대평가될 수 있다.
* <strong>개입 시점의 자의적 설정</strong>: 실제 제도 시행일과 효과 발현 시점이 다를 수 있으므로, 개입 시점을 기계적으로 설정하면 해석이 흔들릴 수 있다.

## 9. Summary

시계열 인과추론은 단순히 미래를 예측하는 것이 아니라, 특정 개입이 결과에 어떤 변화를 만들었는지를 식별하는 데 목적이 있다. 이를 위해서는 반사실의 개념이 필요하며, 단절적 시계열 설계는 가장 기본적인 접근법 중 하나이다. 이 접근은 개입 전 추세, 개입 직후 수준 변화, 개입 후 추세 변화를 분리하여 해석할 수 있게 해준다. 그러나 진정한 인과적 해석을 위해서는 동시 충격, 자기상관, 구조변화, 비교 시계열의 유무 등을 함께 고려해야 한다. 즉, 시계열 인과추론은 회귀식 하나의 문제가 아니라 설계 전체의 문제이다.

## 10. Exercises

1. <strong>개념 문제:</strong> 예측 문제와 인과추론 문제의 차이를 반사실의 관점에서 설명하시오.

2. <strong>해석 문제:</strong> 어떤 정책 개입을 분석한 결과, <code>β<sub>2</sub></code>는 유의하지 않았지만 <code>β<sub>3</sub></code>는 유의한 양(+)의 값을 가졌다. 이 결과를 수준 변화와 추세 변화의 관점에서 해석하시오.

3. <strong>간단한 실습 문제:</strong> 실습 노트북에서 제공하는 개입 전후 데이터를 활용하여 <code>time</code>, <code>intervention</code>, <code>post_time</code> 변수를 생성하고 Interrupted Time Series 회귀를 수행하시오. 이후 추정된 세 계수의 의미를 각각 설명하시오.

## 11. Further Reading / References

* Hamilton, J. D. (1994). *Time Series Analysis*. Princeton University Press.
* Bernal, J. L., Cummins, S., & Gasparrini, A. (2017). *Interrupted time series regression for the evaluation of public health interventions: a tutorial*. *International Journal of Epidemiology*, 46(1), 348–355.
* Box, G. E. P., Tiao, G. C. (1975). *Intervention analysis with applications to economic and environmental problems*. *Journal of the American Statistical Association*, 70(349), 70–79.
* 정낙현. (2026). *Time Series Analysis 강의안: 인과추론 모듈*.
