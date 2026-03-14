# Chapter 9. Granger 인과성, 충격반응, 분산분해

<p><strong>Recommended Week:</strong> Week 10</p>
<p><strong>Notebook:</strong> <code>07_GrangerCausality_VAR.ipynb</code></p>

## Learning Objectives

- 철학적 인과성(Cause-and-effect)과 통계적 예측 선행성을 의미하는 그랜저 인과성(Granger Causality)의 근본적인 차이를 이해한다.
- 벡터자기회귀(VAR) 모형에서 특정 변수의 충격이 시스템 내 다른 변수들에 미치는 동태적 파급 경로를 충격반응함수(IRF)를 통해 분석한다.
- 예측 오차 분산분해(FEVD)의 개념을 이해하고, 시계열 변동성의 원인을 각 변수별 기여도로 정량화할 수 있다.
- 파이썬의 <code>statsmodels</code> 라이브러리를 활용하여 위 세 가지 도구를 실제 데이터에 적용하고 그 비즈니스·경제적 함의를 해석한다.

## 1. Opening

“수탉이 울면 해가 뜬다.”

이 오래된 속담에서 수탉의 울음소리는 해가 뜨는 원인일까? 철학적, 과학적 관점에서 대답은 당연히 “아니오”이다. 하지만 시계열 분석가의 관점은 조금 다르다. 만약 수탉이 우는 사건이 해가 뜨는 사건보다 항상 시간적으로 먼저 발생한다면, 우리는 수탉의 울음소리를 듣고 곧 해가 뜰 것이라는 사실을 유용하게 예측할 수 있다.

이전 장에서 우리는 모든 변수가 서로 영향을 주고받는 다변량 VAR 모형을 구축했다. 그러나 VAR 모형이 쏟아내는 수십 개의 복잡한 행렬 계수만으로는 “그래서 금리를 올리면 내년도 집값은 어떻게 되는가?”라는 실무적 질문에 답하기 어렵다. 이 얽히고설킨 블랙박스 속에서 정보의 흐름, 즉 누가 누구를 이끄는지 파악하고, 외부의 충격이 어떻게 파도처럼 번져나가는지 추적하기 위해 우리는 시계열 분석의 세 가지 핵심 도구인 <strong>그랜저 인과성, 충격반응함수, 그리고 분산분해</strong>를 꺼내 들어야 한다.

## 2. Why This Topic Matters

현업에서 거시경제 정책을 입안하거나 기업의 전략을 수립할 때, 단순한 상관관계를 아는 것만으로는 부족하다. 정책 입안자들은 기준금리 인상이라는 충격이 발생했을 때 물가와 주택 가격이 즉각적으로 하락하는지, 아니면 일정 시간이 지난 후에 효과가 나타나는지, 그리고 그 파급 효과가 얼마나 지속되는지 충격반응의 형태로 살펴보아야 한다.

또한 포트폴리오 매니저는 특정 주식의 변동성 중 도대체 몇 퍼센트가 시장 금리의 변동 때문이고, 몇 퍼센트가 기업 고유의 이슈 때문인지 분산분해를 통해 분리해 내어 리스크를 관리해야 한다. 이러한 분석은 단순한 수학적 추정을 넘어, 과거의 데이터를 바탕으로 미래의 시나리오를 정량적으로 그려내는 현대 경제학 및 금융공학의 핵심적인 의사결정 프레임워크이다.

## 3. Core Concepts

### 3.1 그랜저 인과관계 (Granger Causality)

노벨 경제학상 수상자 클라이브 그랜저(Clive Granger)가 제안한 개념으로, 통계적 의미의 <strong>예측 선행성</strong>을 뜻한다. 특정 시계열 변수 <code>X</code>의 과거 정보가 또 다른 변수 <code>Y</code>의 미래 값을 예측하는 데 유의미한 도움을 준다면, “<code>X</code>는 <code>Y</code>의 그랜저 원인(Granger-cause)이다”라고 말한다. 이는 철학적 인과관계가 아니라 과거 정보의 유용성에 기반한 통계적 인과성이다.

### 3.2 충격반응함수 (IRF: Impulse Response Function)

시스템 내 한 변수에 발생한 예상치 못한 외부 충격(Shock)이 시간이 지남에 따라 시스템 내 다른 변수들에 어떻게 전파되는지를 추적하는 동태적 시뮬레이션 도구이다. 예를 들어 “금리의 1 표준편차 인상”이라는 양(+)의 충격이 가해졌을 때, 향후 여러 기간 동안 경제 성장률이 어떤 곡선을 그리며 하락하고 다시 회복하는지를 보여준다.

### 3.3 예측 오차 분산분해 (FEVD: Forecast Error Variance Decomposition)

“특정 변수의 변동성을 파이로 나눈다면, 각각의 조각은 누구의 책임인가?”를 묻는 도구이다. 미래 특정 시점, 예를 들어 10개월 후에 발생할 수 있는 <code>Y</code> 변수의 예측 오차 분산을 100%로 두었을 때, 이 중 몇 퍼센트가 <code>Y</code> 자신의 충격 때문이고, 몇 퍼센트가 시스템 내 다른 변수 <code>X</code>나 <code>Z</code>의 충격 때문인지를 상대적 비율로 쪼개어 설명한다.

## 4. Mathematical Formulation

### 4.1 그랜저 인과성 검정

목표 변수 <code>Y<sub>t</sub></code>를 예측하기 위해 두 가지 회귀 모델을 비교한다.

1. <strong>기본 모델 (Restricted Model)</strong>: 오직 <code>Y</code> 자신의 과거값만 사용한다.<br><br>
   <code>Y<sub>t</sub> = α<sub>0</sub> + Σ α<sub>i</sub>Y<sub>t-i</sub> + ε<sub>t</sub></code>

2. <strong>확장 모델 (Unrestricted Model)</strong>: <code>Y</code>의 과거값과 <code>X</code>의 과거값을 모두 사용한다.<br><br>
   <code>Y<sub>t</sub> = α<sub>0</sub> + Σ α<sub>i</sub>Y<sub>t-i</sub> + Σ β<sub>j</sub>X<sub>t-j</sub> + u<sub>t</sub></code>

확장 모델이 기본 모델보다 잔차를 통계적으로 유의미하게 줄인다면, 즉 <code>β<sub>j</sub></code>들이 모두 0이라는 가설을 기각할 수 있다면, <code>X</code>는 <code>Y</code>를 그랜저-인과한다고 결론 내린다.

### 4.2 충격반응함수 (IRF)

VAR 모형은 무한 이동평균 형태로 변환될 수 있다.<br><br>

<code>Y<sub>t</sub> = μ + ε<sub>t</sub> + Ψ<sub>1</sub>ε<sub>t-1</sub> + Ψ<sub>2</sub>ε<sub>t-2</sub> + ...</code><br><br>

여기서 행렬 <code>Ψ<sub>s</sub></code>의 각 성분은 다음과 같이 해석할 수 있다.<br><br>

<code>∂y<sub>i,t+s</sub> / ∂ε<sub>j,t</sub></code><br><br>

즉, 시점 <code>t</code>에 발생한 <code>j</code>번째 변수의 충격 <code>ε<sub>j,t</sub></code>가 <code>s</code>기간 뒤 <code>i</code>번째 변수 <code>y<sub>i</sub></code>에 미치는 반응 값을 모아놓은 것이 충격반응함수이다.

## 5. Visual Intuition

이 장의 분석 결과는 숫자표보다 그래프로 해석하는 것이 훨씬 중요하다.

1. <strong>충격반응함수 (IRF) 플롯</strong>  
   가로축은 시간(기간, Horizon)을, 세로축은 반응의 크기를 나타낸다. 예를 들어 주택규제 강화라는 충격이 주어졌을 때, 그래프가 처음 1~3기 동안 0 아래로 급격히 내려가며 집값 하락을 보이고, 이후 다시 0 위로 올라서는 형태를 보일 수 있다. 정상적 시스템이라면 이 곡선은 장기적으로 다시 0 근처로 회귀해야 한다.

2. <strong>분산분해 (FEVD) 플롯</strong>  
   가로축은 예측 기간을, 세로축은 0에서 100%까지의 비율을 나타낸다. 짧은 기간에는 변수 스스로의 충격이 대부분을 차지하지만, 시간이 지날수록 다른 변수들이 차지하는 면적이나 막대의 비중이 점차 커지는 모습을 볼 수 있다.

## 6. Python Practice

### 6.1 Data

실습 노트북에서는 다변량 변수 간의 동적 관계를 파악하기 위해 <strong>테슬라(TSLA) 주가 수익률, 거래량(Volume), 금리 등 거시 지표</strong>가 결합된 데이터프레임을 사용한다.

### 6.2 Code Walkthrough

<code>07_GrangerCausality_VAR.ipynb</code> 노트북에서는 <code>statsmodels</code>를 활용하여 세 가지 분석을 순차적으로 수행한다.

1. <strong>그랜저 인과성 검정</strong>

```python
from statsmodels.tsa.stattools import grangercausalitytests

# Volume이 Return을 예측하는지 최대 4시차까지 검정
grangercausalitytests(df[['Return', 'Volume']], maxlag=4)
````

2. <strong>IRF 및 FEVD 시각화 (VAR 모델 적합 후)</strong>

```python
# VAR 모델 적합 결과인 results 객체 활용
irf = results.irf(periods=10)
irf.plot(orth=True)

fevd = results.fevd(periods=10)
fevd.plot()
```

### 6.3 What to Observe

수강생은 그랜저 인과성 검정 결과에서 출력되는 여러 통계량 가운데 특히 <strong>p-value</strong>를 확인해야 한다. p-value가 0.05 미만으로 떨어지는 시차가 존재한다면 유의미한 예측 선행성이 있다고 볼 수 있다. 또한 IRF 그래프에서 신뢰구간이 0을 포함하지 않는 구간이 어느 시점까지인지 유심히 관찰하여, 통계적으로 유의미한 반응이 지속되는 기간을 파악해야 한다.

## 7. Interpretation of Results

* <strong>가설 검정의 주의점</strong>: 그랜저 검정의 귀무가설 <code>H<sub>0</sub></code>는 “<code>X</code>는 <code>Y</code>의 그랜저 원인이 아니다”이다. 따라서 p-value가 유의수준보다 <strong>작아야만</strong> 귀무가설을 기각하고, “예측에 도움이 되는 통계적 인과성이 있다”고 해석할 수 있다.
* <strong>분산분해의 비즈니스 함의</strong>: 특정 회사의 매출액을 예측하는 VAR 모형에서, 12개월 뒤 매출 예측 오차의 분산분해 결과 마케팅 비용 충격이 40%, 경쟁사 가격 충격이 30%를 차지한다고 해석된다면, 경영진은 자사의 마케팅 활동 못지않게 경쟁사 동향 모니터링에도 자원을 배분해야 한다는 전략적 결론을 내릴 수 있다.

## 8. Common Mistakes

* <strong>철학적 인과성으로의 비약</strong>: “주가 지수가 실물 경제 지표를 그랜저-인과한다”는 결과를 보고, 주가를 억지로 끌어올리면 실물 경제가 좋아질 것이라고 해석하는 것은 대표적인 오류이다. 그랜저 인과성은 단지 주식 시장이 경제의 기대감을 먼저 반영해 움직였다는, 즉 예측력의 문제를 보여줄 뿐이다.
* <strong>비정상 데이터의 입력</strong>: 단위근이 존재하는 비정상 데이터를 차분하지 않고 VAR에 넣어 인과성 검정을 수행하면, 상관없는 두 변수가 서로 인과관계가 있는 것으로 나타나는 <strong>가짜 회귀(Spurious Causality)</strong>가 발생할 수 있다. 반드시 정상성 검정을 통과한 데이터로 수행해야 한다.
* <strong>변수 배치 순서(Ordering)의 무시</strong>: 직교화된 충격반응(Orthogonalized IRF)과 분산분해를 계산할 때 Cholesky 분해를 사용하면, 모형에 변수를 입력하는 순서에 따라 결과가 크게 달라질 수 있다. 경제 이론이나 비즈니스 상식에 따라 가장 외생적인 변수부터 순서대로 모델에 배치하는 구조적 고민이 필요하다.

## 9. Summary

VAR 모형의 진정한 가치는 모형 적합 그 자체보다, 적합 이후에 수행되는 사후 분석 도구들에 있다. 그랜저 인과관계 검정은 어떤 변수가 다른 변수의 선행 지표 역할을 하는지 방향성을 제시해 주고, 충격반응함수(IRF)는 외부 충격이 시스템을 훑고 지나가는 동태적 물결을 시각화한다. 마지막으로 예측 오차 분산분해(FEVD)는 미래의 불확실성을 유발하는 요인들의 상대적 비중을 계산한다. 이 세 가지 분석은 얽혀 있는 경제 현상과 복잡한 비즈니스 지표들 사이에서 인과적 직관을 구조화하고, 데이터에 기반한 전략적 시나리오를 수립하는 강력한 나침반 역할을 한다.

## 10. Exercises

1. <strong>개념 문제:</strong> 그랜저 인과관계의 통계적 정의를 과거 정보의 유용성(Predictability) 관점에서 서술하고, 이것이 실제 인과관계(True Causality)와 어떻게 다른지 구체적인 예시를 들어 설명하시오.

2. <strong>해석 문제:</strong> 중앙은행의 기준금리 인상이 부동산 가격에 미치는 영향을 분석하기 위해 IRF를 도출했다. 충격 발생 후 1~3개월까지는 95% 신뢰구간 하한이 모두 0보다 큰 양(+)의 영역에 있었으나, 4개월 차부터는 신뢰구간이 0을 포함하게 되었다. 이 결과를 통계적 유의성의 관점에서 어떻게 해석해야 하는지 서술하시오.

3. <strong>간단한 실습 문제:</strong> 실습 노트북 <code>07_GrangerCausality_VAR.ipynb</code>에서 제공하는 테슬라 주가 데이터셋을 활용하여, 거래량(Volume)의 변화율이 주가 수익률(Return)을 그랜저-인과하는지 최대 시차 <code>maxlag = 3</code>으로 검정하는 파이썬 코드를 작성하고 p-value를 확인하여 결과를 해석하시오.

## 11. Further Reading / References

* Hamilton, J. D. (1994). *Time Series Analysis*. Princeton University Press.
* Lütkepohl, H. (2005). *New Introduction to Multiple Time Series Analysis*. Springer.
* 정낙현. (2026). *Time Series Analysis 1: 시계열 분석 기초 강의안*.
* 실습 코드 저장소 (GitHub): <code>[https://github.com/nhjung-phd/TimeSeriesAnalysis](https://github.com/nhjung-phd/TimeSeriesAnalysis)</code> (<code>07_GrangerCausality_VAR.ipynb</code>)

