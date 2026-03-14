# Chapter 11. 구조변화, 이상치, 개입분석

<p><strong>Recommended Week:</strong> Week 12</p>
<p><strong>Notebook:</strong> <code>11_StructuralBreaks_and_Intervention.ipynb</code></p>

## Learning Objectives

- 시계열 데이터에 나타나는 이상치(Outlier)와 구조변화(Structural Break)의 근본적인 차이를 이해하고 진단할 수 있다.
- 외부의 특정한 사건이나 정책이 시계열에 미치는 영향을 정량화하는 개입분석(Intervention Analysis)의 원리를 파악한다.
- 더미 변수(Dummy variable)를 활용하여 일시적 충격(Pulse)과 영구적 충격(Step)을 ARIMA 계열 모형에 반영하는 방법을 학습한다.
- 시계열의 생성 메커니즘 자체가 전환되는 레짐 변화(Regime Switching)의 기초적인 직관을 이해한다.

## 1. Opening

잔잔하게 흐르던 강물에 갑자기 커다란 바위가 떨어졌다고 상상해 보자. 물보라가 한 번 크게 튀어 오르겠지만, 강물은 곧 원래의 흐름을 되찾을 것이다. 이것이 이상치의 직관이다. 하지만 만약 지진이 일어나 강의 바닥 지형 자체가 푹 꺼져버린다면 어떨까? 강물은 이전과는 전혀 다른 높이와 속도로 흐르게 될 것이다. 이것이 구조변화의 직관이다.

지금까지 우리가 다룬 시계열 모형들은 과거의 패턴이 미래에도 동일한 규칙으로 유지될 것이라는 강한 믿음, 즉 정상성에 기반하고 있었다. 하지만 현실 세계는 교과서처럼 평온하지 않다. 예상치 못한 파업으로 항공기 승객이 급감하기도 하고, 팬데믹으로 인해 온라인 쇼핑 수요가 영구적으로 폭증하기도 한다. 이 장에서는 데이터의 흐름을 찢어놓는 극단적인 사건들을 단순한 오류로 치부하지 않고, 이를 적극적으로 통제하고 해석하는 <strong>개입분석</strong>과 <strong>구조변화</strong>의 세계를 탐구한다.

## 2. Why This Topic Matters

예상치 못한 비정상적 관측치를 무시하고 기존의 ARIMA나 VAR 모형을 그대로 적합시키면, 모형의 파라미터가 왜곡되고 잔차의 분산이 과대 추정될 수 있다. 결과적으로 예측구간은 지나치게 넓어지거나, 특정 구간에서는 전혀 신뢰할 수 없는 결과를 내게 된다.

더 나아가 실무 현장에서 경영자나 정책 입안자들이 가장 궁금해하는 것은 종종 예측 그 자체가 아니라 <strong>“우리가 실행한 정책이 정말로 효과가 있었는가?”</strong>이다. 예를 들어, 새로운 마케팅 캠페인을 시작한 시점 전후로 매출의 수준(Level)이 통계적으로 유의미하게 상승했는지를 증명해야 할 때가 많다. 개입분석은 외부 사건(Intervention)이 시계열의 생성 메커니즘을 어떻게 변화시켰는지 측정함으로써, 단순한 상관관계를 넘어 정책의 순수 효과를 분리해 내는 강력한 실무 도구가 된다.

## 3. Core Concepts

### 3.1 이상치 (Outliers)

이상치는 데이터의 일반적인 흐름에서 일시적으로 크게 벗어난 관측치를 말한다.

- <strong>가산 이상치 (AO: Additive Outlier)</strong>: 특정 시점 <code>t</code>에만 단발성으로 값이 튀고, 그 이후에는 즉시 원래의 패턴으로 복귀하는 충격이다. 예를 들어 시스템 오류나 단 하루의 폭우가 이에 해당한다.
- <strong>혁신 이상치 (IO: Innovational Outlier)</strong>: 특정 시점에 발생한 충격이 모형의 ARMA 구조를 타고 이후의 시계열에도 점진적으로 파급되는 형태이다.

### 3.2 구조변화 (Structural Break)

데이터를 생성하는 근본적인 통계적 특성, 예를 들어 평균, 추세, 분산 등이 특정 시점을 기점으로 영구적으로 바뀌는 현상이다. 제도 개편이나 IMF 외환위기와 같은 거시경제적 단절이 대표적 사례이다.

### 3.3 개입분석 (Intervention Analysis)

시계열 데이터에 특정한 사건이 발생했을 때, 그 효과를 정량적으로 평가하기 위해 더미 변수(Dummy variable)를 모형에 추가하는 분석 기법이다.

- <strong>펄스(Pulse) 더미</strong>: 사건이 일어난 시점만 1이고 나머지는 0인 변수이다. 일시적 충격을 측정할 때 사용한다.
- <strong>스텝(Step) 더미</strong>: 사건이 일어난 시점부터 계속 1을 유지하는 변수이다. 영구적인 수준 변화를 측정할 때 사용한다.

### 3.4 레짐 변화 (Regime Change)

개입분석이 “사건이 언제 발생했는지 알고 있을 때” 사용하는 접근이라면, 레짐 변화 모형은 경제가 호황(Bull) 상태인지 불황(Bear) 상태인지처럼 확률적으로 상태가 전환되는 잠재적 구조를 모델링한다. 이는 Markov-Switching 모형 등으로 확장될 수 있다.

## 4. Mathematical Formulation

가장 기본적인 형태의 <strong>ARMAX(개입분석) 모형</strong>은 기존의 ARMA 구조에 외생적 개입 변수 <code>I<sub>t</sub></code>를 추가하여 표현한다.<br><br>

<code>Y<sub>t</sub> = ωI<sub>t</sub> + [θ(B) / φ(B)]ε<sub>t</sub></code><br><br>

각 항의 의미는 다음과 같다.

- <code>Y<sub>t</sub></code>: 관측된 시계열 데이터
- <code>I<sub>t</sub></code>: 개입을 나타내는 지시 변수(Indicator variable). 예를 들어 시점 <code>T</code>에 정책이 시행되었다면, 스텝 함수로 <code>I<sub>t</sub> = 0</code> (<code>t &lt; T</code>), <code>I<sub>t</sub> = 1</code> (<code>t ≥ T</code>)로 정의할 수 있다.
- <code>ω</code>: <strong>개입 효과(Intervention effect)</strong>의 크기를 나타내는 파라미터이다. 이 값이 통계적으로 유의미하다면 정책 효과가 존재함을 의미한다.
- <code>[θ(B) / φ(B)]ε<sub>t</sub></code>: 개입으로 설명되지 않는 데이터 본연의 자기상관(ARMA) 노이즈 구조이다.

## 5. Visual Intuition

개입분석과 구조변화를 직관적으로 파악하려면, 시계열 플롯에 개입 시점을 수직선으로 표시하고 전후의 패턴을 비교해야 한다.

1. <strong>스텝 함수 효과 (영구적 변화)</strong>  
   수직선을 기점으로 그래프의 전체적인 평균 수준(Level)이 한 계단 위로 뛰어오른 채 계속 유지되는 형태이다. 예를 들어 팬데믹 이후 온라인 쇼핑의 영구적 증가가 이에 해당한다.

2. <strong>펄스 및 감쇠 효과 (일시적 변화)</strong>  
   수직선이 있는 시점에 값이 날카롭게 치솟았다가, 시간이 지나면서 서서히 또는 즉각적으로 원래 평균 수준으로 되돌아가는 형태이다. 예를 들어 일회성 대규모 할인 프로모션의 효과를 떠올릴 수 있다.

## 6. Python Practice

### 6.1 Data

실습에서는 코로나19 팬데믹을 전후로 한 <strong>온라인 쇼핑몰 매출액 데이터</strong> 또는 항공계 파업 시기의 <strong>항공 여객 데이터</strong>를 활용한다.

### 6.2 Code Walkthrough

<code>11_StructuralBreaks_and_Intervention.ipynb</code> 노트북에서는 <code>statsmodels</code>의 <code>SARIMAX</code> 모형에서 <code>exog</code> 파라미터를 활용한다.

```python
import numpy as np
import statsmodels.api as sm

# 1. 개입 더미 변수 생성
df['intervention_step'] = np.where(df.index >= '2020-03-01', 1, 0)

# 2. ARIMAX 모형 적합
model = sm.tsa.SARIMAX(
    df['sales'],
    exog=df['intervention_step'],
    order=(1, 1, 1)
)
results = model.fit()

# 3. 개입 효과 확인
print(results.summary())
````

### 6.3 What to Observe

먼저 더미 변수 없이 순수 ARIMA로만 적합했을 때 잔차(Residual) 그래프의 특정 시점에 큰 스파이크가 튀어 있는지 관찰해야 한다. 이후 개입 더미 변수를 <code>exog</code>로 넣고 다시 훈련했을 때, 모델 요약표에서 <code>intervention_step</code> 변수의 계수(coef)와 p-value를 확인하고, 잔차 그래프가 더 안정적인 백색잡음에 가까워지는지 확인해야 한다.

## 7. Interpretation of Results

개입분석의 가장 큰 장점은 해석의 명확성에 있다.

만약 온라인 매출 데이터를 분석한 결과 <code>intervention_step</code> 더미 변수의 계수 <code>ω</code>가 <code>15000</code>이고 p-value가 <code>0.01</code>로 도출되었다면, 실무자는 다음처럼 보고할 수 있다.

“코로나19 팬데믹이라는 구조적 개입은 기존의 시계열적 증가 추세를 통제하고도, 당사의 월간 온라인 매출을 평균적으로 약 15,000 수준만큼 영구적이고 유의미하게 끌어올렸습니다.”

이는 단순 전년동기 비교보다 훨씬 과학적이고 엄밀한 정책 효과 평가이다.

## 8. Common Mistakes

* <strong>이상치와 구조변화의 오인</strong>: 일시적으로 발생한 단순한 이상치(Pulse)를 영구적인 구조변화(Step)로 착각하여 스텝 더미를 적용하면, 이후 기간의 모든 예측값이 실제보다 과대 또는 과소 추정될 수 있다. 도메인 지식을 활용하여 이벤트의 성격을 먼저 규명해야 한다.
* <strong>너무 많은 더미 변수의 남용</strong>: 예측이 잘 맞지 않는다고 해서 튀는 값마다 펄스 더미 변수를 다수 집어넣는 행위는 모델의 자유도를 훼손하고 과적합을 유발한다. 더미 변수는 명확한 비즈니스·거시적 근거가 있을 때만 통제용으로 사용해야 한다.
* <strong>내생성(Endogeneity) 문제</strong>: 개입 시점 자체가 해당 시계열 변수 때문에 결정된 것이라면, 예를 들어 매출이 떨어져서 급하게 프로모션을 진행한 경우라면, 인과관계의 방향이 꼬이게 되어 단순 개입분석의 결과가 왜곡될 수 있다.

## 9. Summary

전통적인 시계열 모형은 데이터의 구조가 시간의 흐름에도 변하지 않는다고 가정하지만, 현실에서는 파업, 제도 변화, 팬데믹과 같은 극단적 이상치나 구조적 단절이 빈번하게 발생한다. 이러한 변화를 무시하면 예측 모형은 쉽게 붕괴한다. 개입분석(Intervention Analysis)은 발생 시점을 알고 있는 외부 충격을 펄스나 스텝 형태의 더미 변수로 모형화하여, 해당 이벤트가 시스템에 미친 순수한 파급 효과를 분리하고 정량화한다. 이를 통해 우리는 데이터 속에 숨겨진 정책의 진짜 가치를 평가하고, 구조적 충격 속에서도 신뢰할 수 있는 미래 예측 시나리오를 재구성할 수 있다.

## 10. Exercises

1. <strong>개념 문제:</strong> 혁신 이상치(Innovational Outlier)와 가산 이상치(Additive Outlier)의 차이를 ARMA 모형의 기억 구조 관점에서 서술하시오.

2. <strong>해석 문제:</strong> 경쟁사의 파업이 우리 회사의 매출에 미친 영향을 분석하기 위해 파업 기간 2개월 동안만 1의 값을 가지는 더미 변수를 넣고 ARIMAX 모형을 적합했다. 더미 변수의 계수는 양(+)의 방향으로 통계적 유의성을 가졌다. 이 결과를 경영진에게 어떻게 해석하여 보고할지 서술하시오.

3. <strong>간단한 실습 문제:</strong> 실습 노트북의 데이터를 활용하여, 전체 데이터 중 80번째 시점부터 영구적인 정책 변화가 일어났다고 가정하고 스텝(Step) 더미 변수를 생성하시오. 더미 변수 없이 훈련한 ARIMA 모델의 잔차와 더미 변수를 포함한 ARIMAX 모델의 잔차 분산을 비교하여, 개입 변수가 모델의 설명력을 어떻게 개선했는지 확인하시오.

## 11. Further Reading / References

* Abraham, B. (1980). *Intervention analysis and multiple time series*. *Biometrika*, 67, 73–80.
* Tsay, R. S. (1986). *Time series model specification in the presence of outliers*. *Journal of the American Statistical Association*, 81, 132–141.
* Hamilton, J. D. (1994). *Time Series Analysis*. Princeton University Press.
* 신충호, 조혜진. (2021). 코로나19로 인한 온라인 쇼핑 구매의 변화에 대한 시계열 분석.

