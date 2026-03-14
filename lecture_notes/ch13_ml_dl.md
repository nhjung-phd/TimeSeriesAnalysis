# Chapter 13. 머신러닝과 딥러닝 기반 시계열의 개요

<p><strong>Recommended Week:</strong> Week 13</p>
<p><strong>Notebook:</strong> <code>13_ML_DL_Forecasting.ipynb</code></p>

## Learning Objectives

- 전통적 통계 기반 시계열 모형(ARIMA 등)과 머신러닝·딥러닝 기반 예측 모형의 철학적, 구조적 차이를 이해한다.
- 시계열 데이터를 머신러닝 알고리즘에 학습시키기 위한 지연 변수(Lag feature) 기반의 지도학습 데이터 변환(Windowing) 기법을 습득한다.
- 은닉층(Hidden Layer)을 통해 데이터의 비선형성(Non-linear relationship)을 학습하는 딥러닝(LSTM, Transformer)의 기본 원리를 파악한다.
- 성능(예측력), 해석력(Interpretability), 운영성 측면에서 전통 모형과 기계학습 모형의 장단점을 비교하고 적절한 모델을 선택할 수 있다.

## 1. Opening

지금까지 우리는 과거의 오차와 자기상관성을 수학적 방정식으로 우아하게 풀어내는 전통적 시계열 모형, 예를 들어 ARIMA와 VAR를 다루었다. 이 모형들은 데이터가 일정한 규칙, 특히 선형성에 가까운 구조를 따른다는 강한 가정하에 작동한다.

하지만 현실의 데이터는 어떨까? 수십 개의 센서가 뿜어내는 공장 설비 데이터나, 인간의 심리와 거시경제 지표가 복잡하게 얽혀 요동치는 주식 시장의 데이터는 결코 하나의 깔끔한 선형 수식으로 정의되기 어렵다. 금융 시계열 예측 분야에서도 오랫동안 ARIMA가 표준으로 쓰였으나, 최근에는 이러한 한계를 극복하기 위해 딥러닝 모델로 그 영역이 빠르게 확장되고 있다. 이제 우리는 방정식의 구조를 미리 정해두는 대신, 기계 스스로 방대한 데이터 속에서 숨겨진 비선형적 패턴을 찾아내도록 허락하는 머신러닝과 딥러닝의 세계로 들어간다.

## 2. Why This Topic Matters

경영과 경제 현장에서는 두 가지 상충하는 목표가 존재한다. 하나는 “왜 그런 결과가 나왔는가?”를 설명하는 <strong>해석력(Interpretability)</strong>이고, 다른 하나는 “그래서 내일 얼마가 될 것인가?”를 정확히 맞히는 <strong>예측력(Predictive Power)</strong>이다.

은닉층이 없는 단순한 회귀 모형이나 ARIMA 모형은 각 변수가 미치는 영향을 비교적 투명하게 설명할 수 있지만, 복잡한 패턴을 예측하는 데는 한계가 있다. 반면 하나 이상의 은닉층을 가진 심층 신경망(Deep Neural Network)은 변수들 간의 복잡한 비선형 관계를 모델링할 수 있어 예측 정확도를 높일 수 있다. 수많은 외생변수(Exogenous variables)가 존재하고 데이터 규모가 방대할 때, 딥러닝은 단순한 벤치마크(Baseline) 모델의 한계를 돌파하는 강력한 대안이 된다.

## 3. Core Concepts

### 3.1 전통 시계열과 머신러닝의 차이

전통적 시계열 모델은 시간의 흐름(Time Dependency) 자체를 모델의 내재적 구조로 사용한다. 예를 들어 <code>y<sub>t</sub></code>는 <code>y<sub>t-1</sub></code>의 함수로 표현될 수 있다. 반면 일반적인 머신러닝 모델(Random Forest, XGBoost 등)은 입력된 데이터의 순서를 스스로 알지 못한다. 따라서 머신러닝이 시간을 이해할 수 있도록 데이터를 인위적으로 재구성해야 한다.

### 3.2 Lag Feature를 활용한 지도학습 데이터 변환

머신러닝 모델에 시계열을 적용하기 위해서는 과거의 관측치들을 독립 변수(Feature, <code>X</code>)로, 미래의 예측 시점을 종속 변수(Target, <code>y</code>)로 매핑하는 슬라이딩 윈도우(Sliding Window) 기법이 필수적이다. 과거 <code>p</code>개의 시차 데이터를 옆으로 이어 붙여 일반적인 표 형태의 데이터를 생성한다.

### 3.3 Tree-based 모델의 시계열 적용과 한계

의사결정나무 기반의 앙상블 모델(XGBoost, LightGBM 등)은 변수 간의 상호작용을 파악하는 데 뛰어나며 훈련 속도가 빠르다. 하지만 트리 모델의 구조적 특성상, 훈련 데이터에서 관측된 최대값이나 최소값을 벗어나는 미래의 추세(Trend)를 외삽(Extrapolation)하여 예측하기 어렵다는 한계가 있다.

### 3.4 딥러닝(LSTM과 Transformer)의 개요

- <strong>LSTM (Long Short-Term Memory)</strong>: 과거의 정보를 얼마나 보존하고 얼마나 잊을지 결정하는 게이트(Gate) 구조를 가져, 시계열의 장기 의존성(Long-term memory)을 효과적으로 학습하는 순환신경망(RNN)의 발전 형태이다.
- <strong>Transformer</strong>: 데이터의 순서대로 학습하는 RNN과 달리, 어텐션(Attention) 메커니즘을 통해 시퀀스 전체를 한 번에 병렬로 조망한다. 어떤 과거 시점의 데이터가 현재 예측에 가장 중요한지 스스로 가중치를 부여하는 최신 구조이다.

## 4. Mathematical Formulation

일반적인 딥러닝 모형은 입력 벡터 <code>x<sub>t</sub> = [y<sub>t-1</sub>, y<sub>t-2</sub>, ..., y<sub>t-p</sub>]</code>를 여러 겹의 은닉층에 통과시키며 고차원적인 비선형 변환을 수행한다.

첫 번째 은닉층은 다음처럼 쓸 수 있다.<br><br>

<code>h<sub>1</sub> = σ(W<sub>1</sub>x<sub>t</sub> + b<sub>1</sub>)</code><br><br>

두 번째 은닉층은 다음과 같다.<br><br>

<code>h<sub>2</sub> = σ(W<sub>2</sub>h<sub>1</sub> + b<sub>2</sub>)</code><br><br>

최종 출력은 다음처럼 표현할 수 있다.<br><br>

<code>ŷ<sub>t</sub> = W<sub>out</sub>h<sub>2</sub> + b<sub>out</sub></code><br><br>

여기서 <code>W</code>는 가중치 행렬, <code>b</code>는 편향(bias), <code>σ</code>는 비선형 활성화 함수(예: ReLU)이다. 이처럼 은닉층이 깊어질수록 모형은 단순 선형 결합으로는 포착할 수 없는 미묘한 상호작용과 비선형 패턴을 근사할 수 있다.

## 5. Visual Intuition

이 장에서는 데이터를 변환하고 분할하는 개념적 이미지를 이해하는 것이 중요하다.

1. <strong>지도학습용 데이터 매트릭스 (Windowing)</strong>  
   마치 창문(Window)을 오른쪽으로 한 칸씩 밀듯이 데이터를 스캔한다.

   - Window 1: <code>X = [y<sub>1</sub>, y<sub>2</sub>, y<sub>3</sub>]</code>, Target <code>y = [y<sub>4</sub>]</code>
   - Window 2: <code>X = [y<sub>2</sub>, y<sub>3</sub>, y<sub>4</sub>]</code>, Target <code>y = [y<sub>5</sub>]</code>

   이런 식으로 시계열은 일반적인 지도학습 데이터셋으로 변환된다.

2. <strong>데이터 분할 구조도 (Train/Validation/Test Split)</strong>  
   딥러닝 훈련에서는 데이터 누수를 막기 위해 무작위로 섞지 않고 시간 순서를 엄격히 유지한다. 전체 데이터의 첫 70%를 훈련 세트(Train set), 다음 20%를 검증 세트(Validation set), 마지막 10%를 테스트 세트(Test set)로 분할하는 계단식 구조를 갖는다.

## 6. Python Practice

### 6.1 Data

실습에서는 이전 장들에서 다루었던 전통적 모델(ARIMA 등)과 성능을 직접 비교하기 위해, <strong>소매점의 위젯 판매량(Widget Sales)</strong>이나 <strong>금융 주가 시계열 데이터</strong>를 동일하게 사용할 수 있다.

### 6.2 Code Walkthrough

<code>13_ML_DL_Forecasting.ipynb</code> 노트북에서는 딥러닝 모델 학습을 위한 데이터 전처리와 Keras(또는 PyTorch)를 활용한 모델링을 수행한다.

1. <strong>데이터 분할 (Data Splitting)</strong>

```python
# 시간 순서를 유지하며 Train, Validation, Test 셋으로 분할
train_df = df.iloc[:int(len(df) * 0.7)]
val_df = df.iloc[int(len(df) * 0.7):int(len(df) * 0.9)]
test_df = df.iloc[int(len(df) * 0.9):]
````

이와 같이 70:20:10 비율로 분할하여 훈련, 검증, 테스트 셋을 구성한다.

2. <strong>비율 스케일링 (Scaling)</strong>
   딥러닝은 값의 범위에 민감하므로 <code>MinMaxScaler</code> 등을 통해 0과 1 사이로 정규화한다.

3. <strong>네트워크 구성</strong>
   은닉층을 추가하여 비선형성을 포착하는 DNN 또는 LSTM 레이어를 쌓고 모델을 학습(Fit)한다.

### 6.3 What to Observe

딥러닝 모델이 학습을 반복(Epoch)함에 따라 훈련 손실(Train loss)과 검증 손실(Validation loss)이 어떻게 감소하는지 그래프를 통해 관찰해야 한다. 또한 단순한 계절성 단순 예측(Naive seasonal)과 같은 베이스라인 모델과 비교했을 때, 딥러닝 모델의 평가지표(MAPE 등)가 얼마나 유의미하게 향상되었는지 정량적으로 확인해야 한다.

## 7. Interpretation of Results

모델의 결과를 현업에 보고할 때는 성능(예측력)과 해석력 간의 상충 관계를 명확히 해야 한다.

만약 LSTM 모델의 MAPE가 5%로 ARIMA의 10%보다 훨씬 우수하게 나왔다면, 예측 도구로서는 충분히 경쟁력이 있다고 볼 수 있다. 그러나 “왜 이런 예측값이 도출되었는가?”라는 경영진의 질문에 명확한 인과적 설명을 제공하기는 어렵다. 따라서 실무에서는 정책 효과를 분석할 때는 통계적 시계열 모델이나 인과추론 기법을 사용하고, 순수한 자동화된 수요 예측이 목적일 때는 Prophet이나 딥러닝 모델을 사용하는 이원화 전략이 현실적이다.

## 8. Common Mistakes

* <strong>훈련/테스트 데이터의 무작위 분할 (Random Shuffling)</strong>: 머신러닝 라이브러리의 일반적인 데이터 분할 함수를 시계열 데이터에 그대로 적용하면, 미래의 정보가 과거의 훈련 과정에 유출되는 치명적인 오류가 발생한다. 반드시 시간 순서를 유지한 채로 데이터를 분할해야 한다.
* <strong>스케일러(Scaler)의 정보 누수</strong>: 전체 데이터를 대상으로 스케일링을 수행한 뒤 Train/Test로 나누면 안 된다. 반드시 Train set에 대해서만 <code>fit</code>한 스케일러 파라미터를 사용하여 Validation과 Test를 <code>transform</code>해야 한다.
* <strong>Tree 기반 모델에 강한 추세 데이터 사용</strong>: 데이터가 우상향하는 강한 추세를 가지고 있을 때 차분 없이 트리 기반 머신러닝을 적용하면, 모델은 과거에 학습한 범위를 넘어서는 값을 잘 예측하지 못할 수 있다.

## 9. Summary

데이터의 규모가 커지고 고려해야 할 외생 변수가 많아질수록, 선형적 제약에 묶인 전통적 시계열 모델은 한계를 맞이한다. 머신러닝과 딥러닝 모델은 지연 변수 기반의 지도학습 형태로 데이터를 재구성함으로써, 변수들 사이의 숨겨진 복잡한 비선형 관계를 은닉층을 통해 학습한다. 특히 LSTM과 Transformer 같은 딥러닝 아키텍처는 시계열 고유의 장기 의존성 패턴을 효과적으로 포착하여 강력한 예측 성능을 낼 수 있다. 비록 해석력이 떨어진다는 블랙박스의 단점이 있지만, 엄격한 데이터 분할과 베이스라인 비교를 거친 딥러닝 모형은 현대 금융 및 수요 예측 실무에서 중요한 도구가 되고 있다.

## 10. Exercises

1. <strong>개념 문제:</strong> 은닉층이 없는 단순 선형 모델과 비교하여, 다수의 은닉층을 가진 심층 신경망이 시계열 데이터를 학습할 때 가지는 본질적 장점을 비선형 관계의 관점에서 서술하시오.

2. <strong>해석 문제:</strong> 어떤 매출 데이터 예측을 위해 딥러닝 모델을 구축했다. 데이터를 Train, Validation, Test 셋으로 분할하여 학습한 결과, Train loss는 계속 감소하는데 Validation loss는 어느 시점 이후부터 다시 상승하기 시작했다. 이 현상이 의미하는 바를 설명하고, 시계열 예측에서 Validation set이 왜 필수적인지 서술하시오.

3. <strong>간단한 실습 문제:</strong> 실습 노트북 <code>13_ML_DL_Forecasting.ipynb</code>을 열어 제공된 금융 시계열 데이터를 불러오시오. <code>iloc</code> 또는 인덱싱을 사용하여 전체 데이터의 70%를 <code>train_df</code>, 20%를 <code>val_df</code>, 10%를 <code>test_df</code>로 분할하는 코드를 작성하고 분할된 각 데이터셋의 길이를 확인하시오.

## 11. Further Reading / References

* Peixeiro, M. (2022). *Time Series Forecasting in Python*. Manning Publications.
* Taylor, S. J., & Letham, B. (2017). *Forecasting at Scale*. *PeerJ Preprints*, 5, e3190v2.
* 정낙현. (2026). *Time Series Analysis 6: 시계열 분석 논문 기초*.

