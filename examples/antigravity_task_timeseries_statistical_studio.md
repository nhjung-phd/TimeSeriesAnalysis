# Antigravity IDE Master Task v2

## Time Series Statistical Studio

아래 내용을 Antigravity IDE의 **Agent Manager**에 그대로 붙여넣어 실행하세요.  
목표는 웹에서 주식 데이터를 자동으로 가져와, 대학원 시계열분석 강의에서 배운 통계적 방법을 노코딩 방식으로 실습할 수 있는 Streamlit 앱을 만드는 것입니다.

---

## 사용 방법

1. Antigravity IDE에서 새 폴더를 엽니다.
2. 이 파일의 `PROJECT TASK` 전체를 Agent Manager에 붙여넣습니다.
3. 먼저 구현 계획(Plan)을 검토합니다.
4. 필요한 경우 댓글로 수정 요청을 남깁니다.
5. Proceed 후 생성된 파일을 확인합니다.
6. `streamlit run app.py`로 실행합니다.
7. 브라우저에서 앱을 검증합니다.

---

######################################################################
# PROJECT TASK
# Time Series Statistical Studio
# No-Code Statistical Time Series Analysis for Graduate Education
######################################################################
######################################################################

대학원 시계열분석 강의에서 학습하는 주요 통계적 시계열 분석 방법을
코딩 없이 하나의 웹 애플리케이션에서 체험할 수 있도록
완성도 높은 교육용 프로그램을 개발해줘.

프로젝트명:
Time Series Statistical Studio

한글 부제:
시계열 통계분석 노코딩 스튜디오

핵심 철학:
Data → Diagnose → Model → Validate → Forecast → Interpret

중요 원칙:
1. 먼저 구현 계획과 파일 구조를 제안해줘.
2. 터미널 명령 실행 전에는 반드시 확인을 요청해줘.
3. 삭제, 덮어쓰기, 대량 파일 이동, 환경 초기화 명령은 실행 전 반드시 확인해줘.
4. Python traceback을 사용자 화면에 그대로 노출하지 말고 친절한 오류 메시지로 처리해줘.
5. 그래프 제목, 축, 범례는 영어로 표시해줘.
6. 통계 결과 해석은 영어와 한글을 모두 제공해줘.

######################################################################
######################################################################
# 1. 기술 스택
######################################################################
######################################################################

Python
Streamlit
pandas
numpy
scipy
matplotlib
plotly
statsmodels
pmdarima
arch
scikit-learn
yfinance
openpyxl

선택:
kaleido
reportlab 또는 PDF export 지원 라이브러리

######################################################################
######################################################################
# 2. 프로젝트 구조
######################################################################
######################################################################

다음처럼 모듈화해줘.

project/
│
├── app.py
├── requirements.txt
├── README.md
│
├── modules/
│   ├── __init__.py
│   ├── stock_data.py
│   ├── data_loader.py
│   ├── preprocessing.py
│   ├── visualization.py
│   ├── descriptive.py
│   ├── decomposition.py
│   ├── stationarity.py
│   ├── autocorrelation.py
│   ├── arima_models.py
│   ├── volatility_models.py
│   ├── multivariate_models.py
│   ├── cointegration.py
│   ├── state_space.py
│   ├── diagnostics.py
│   ├── evaluation.py
│   ├── interpretation.py
│   ├── recommendations.py
│   └── report.py
│
└── assets/

app.py가 모든 분석 코드를 직접 담는 거대한 파일이 되지 않도록
기능별로 모듈화해줘.

######################################################################
######################################################################
# 3. 메인 UI
######################################################################
######################################################################

메인 제목:
Time Series Statistical Studio

부제:
No-Code Statistical Time Series Analysis

한글 설명:
시계열 데이터를 선택하고 통계적 특성을 진단한 뒤,
적절한 모형을 선택하고 결과를 해석하는 교육용 분석 도구

메인 UI 색상은 Deep Green 또는 Teal 계열을 사용해줘.
교수 강의용 / 대학원 실습용으로 깔끔하게 설계해줘.

전체 workflow를 홈 화면에 표시해줘.

Data
↓
Diagnose
↓
Model
↓
Validate
↓
Forecast
↓
Interpret

Box-Jenkins workflow도 표시해줘.

Identification
→ Estimation
→ Diagnosis
→ Forecasting

######################################################################
######################################################################
# 4. 사이드바 메뉴
######################################################################
######################################################################

사이드바 메뉴:

HOME

DATA
- Stock Data
- Upload Data
- Sample Data

EXPLORE
- Visualization
- Descriptive Statistics

PREPROCESS
- Missing Values
- Outliers
- Resampling
- Transformation

DIAGNOSE
- Decomposition
- Stationarity
- ACF / PACF
- Ljung-Box

UNIVARIATE MODELS
- AR
- MA
- ARMA
- ARIMA
- Auto ARIMA
- SARIMA
- ARIMAX
- SARIMAX

VOLATILITY
- ARCH Test
- ARCH
- GARCH

MULTIVARIATE
- Correlation
- VAR
- Granger
- IRF
- Cointegration
- VECM

ADVANCED
- SVAR
- State Space
- Kalman Filter

INTERVENTION
- ITS

MODEL EVALUATION
- Residual Diagnostics
- Forecast Metrics
- Model Comparison

AUTO ANALYSIS

REPORT

######################################################################
######################################################################
# 5. 데이터 입력 방식
######################################################################
######################################################################

첫 화면에서 다음 중 선택 가능하게 해줘.

1. Web Stock Data
2. Upload CSV / Excel
3. Generate Sample Data

기본 선택값은 Web Stock Data로 해줘.

######################################################################
######################################################################
# 6. 웹 주식 데이터 자동수집
######################################################################
######################################################################

Yahoo Finance 데이터를 사용해줘.
Python package는 yfinance를 사용해줘.
API Key는 사용하지 마.

기본 코드:

import yfinance as yf

df = yf.download(
    ticker,
    start=start_date,
    end=end_date,
    interval=interval,
    auto_adjust=True,
    progress=False
)

yfinance가 MultiIndex 컬럼을 반환할 수 있으므로 반드시 처리해줘.

if isinstance(df.columns, pd.MultiIndex):
    df.columns = df.columns.get_level_values(0)

반드시 다음 컬럼을 사용할 수 있게 해줘.
Open
High
Low
Close
Volume

######################################################################
######################################################################
# 7. 주식 Market 선택
######################################################################
######################################################################

Market 선택:

US
Korea
Japan
Europe
Index / ETF
Other

######################################################################
######################################################################
# 8. Quick Stock Select
######################################################################
######################################################################

사용자가 종목 코드를 몰라도 선택할 수 있도록 Quick Select를 제공해줘.

US Mega Tech:
Apple — AAPL
Microsoft — MSFT
NVIDIA — NVDA
Amazon — AMZN
Alphabet — GOOGL
Meta — META
Tesla — TSLA

Semiconductor:
NVIDIA — NVDA
AMD — AMD
Intel — INTC
TSMC — TSM
Micron — MU
Broadcom — AVGO

Korea:
Samsung Electronics — 005930.KS
SK Hynix — 000660.KS
NAVER — 035420.KS
Kakao — 035720.KS
Hyundai Motor — 005380.KS
LG Chem — 051910.KS
Samsung SDI — 006400.KS

Index:
S&P 500 — ^GSPC
NASDAQ Composite — ^IXIC
Dow Jones — ^DJI
KOSPI — ^KS11
KOSDAQ — ^KQ11

ETF:
SPY
QQQ
IWM
TLT
GLD

직접 ticker 입력도 가능하게 해줘.
예:
AAPL
NVDA
005930.KS
000660.KS

Ticker validation을 수행하고, 데이터가 없으면 다음 메시지를 보여줘.

선택한 종목 데이터를 가져오지 못했습니다.
Ticker 또는 기간을 확인해 주세요.

######################################################################
######################################################################
# 9. 분석기간과 Interval
######################################################################
######################################################################

Start Date
End Date

Quick Period:
1 Month
3 Months
6 Months
1 Year
3 Years
5 Years
10 Years
Max

기본값:
5 Years

Interval:
1d
5d
1wk
1mo

기본값:
1d

Advanced:
1h

Intraday 데이터는 Yahoo Finance의 기간 제한이 있으므로 안내문을 표시해줘.

######################################################################
######################################################################
# 10. 복수 종목 선택
######################################################################
######################################################################

여러 종목을 동시에 선택할 수 있게 해줘.
예:
AAPL
MSFT
NVDA
AMD

복수 종목 선택 시 가격 패널을 자동 생성해줘.

Date | AAPL | MSFT | NVDA | AMD

복수 종목일 때 다음 메뉴를 활성화해줘.
Correlation
VAR
Granger Causality
IRF
Cointegration
VECM

######################################################################
######################################################################
# 11. Benchmark
######################################################################
######################################################################

Benchmark 선택 가능하게 해줘.
예:
^GSPC
SPY
^KS11

출력:
Stock vs Benchmark Price
Return Comparison
Cumulative Return Comparison

######################################################################
######################################################################
# 12. 가격 및 파생변수
######################################################################
######################################################################

분석 대상:
Open
High
Low
Close
Volume

추가 생성:
Simple Return
Log Return
Log Price
Rolling Volatility
Volume Change

Simple Return:
Return_t = P_t / P_(t-1) - 1

Python:
df["Return"] = df["Close"].pct_change()

Log Return:
LogReturn_t = log(P_t / P_(t-1))

Python:
df["Log_Return"] = np.log(df["Close"] / df["Close"].shift(1))

######################################################################
######################################################################
# 13. 데이터 기본정보와 기술통계
######################################################################
######################################################################

데이터 로드 직후 다음 출력.
Ticker
Company Name 가능하면 표시
Start Date
End Date
Frequency
Observations
Missing Values
최근 10개 행

기술통계:
Mean
Std
Median
Min
Max
Skewness
Kurtosis

Price와 Return을 구분해서 표시해줘.

######################################################################
######################################################################
# 14. 데이터 시각화
######################################################################
######################################################################

자동 생성:
Price Chart
Volume Chart
Return Chart

그래프 텍스트는 영어 사용.
예:
NVDA Historical Price
NVDA Trading Volume
NVDA Daily Return

복수 종목 비교 시 시작값 100으로 지수화해줘.
Indexed_t = Price_t / Price_0 × 100

그래프:
Indexed Stock Price Comparison

복수 종목 수익률 상관계수도 계산하고 heatmap과 표를 제공해줘.

######################################################################
######################################################################
# 15. CSV / Excel 업로드
######################################################################
######################################################################

보조 기능으로 다음 지원.
CSV
XLSX
XLS

사용자가 선택:
Date Column
Y Variable
X Variables

Datetime 자동 변환
시간순 정렬
중복 날짜 경고

######################################################################
######################################################################
# 16. Frequency와 Resampling
######################################################################
######################################################################

Frequency 자동 감지 기능 제공.
Auto Detect
Daily
Weekly
Monthly
Quarterly
Yearly
Hourly

불규칙한 간격이면 경고.

Resampling:
Daily
Weekly
Monthly
Quarterly

Aggregation:
Mean
Last
Sum

######################################################################
######################################################################
# 17. Missing Values / Outliers
######################################################################
######################################################################

Missing Values 처리:
Keep
Drop
Forward Fill
Backward Fill
Linear Interpolation
Time Interpolation

처리 전/후 그래프 비교.

Outlier Detection:
Z-score
IQR
Rolling Z-score

이상치는 자동 삭제하지 말고 사용자 선택:
Keep
Remove
Winsorize

안내문:
통계적 이상치가 반드시 데이터 오류를 의미하는 것은 아닙니다.
금융시장의 실제 충격일 가능성도 있습니다.

######################################################################
######################################################################
# 18. Rolling Statistics
######################################################################
######################################################################

Rolling Mean
Rolling Standard Deviation

Window:
5
10
20
60
120
Custom

######################################################################
######################################################################
# 19. Time Series Decomposition
######################################################################
######################################################################

지원:
Additive
Multiplicative
STL

사용자 입력:
Seasonal Period

출력:
Observed
Trend
Seasonal
Residual

각 성분에 대한 한글/영문 설명 제공.

######################################################################
######################################################################
# 20. 정상성 검정
######################################################################
######################################################################

ADF Test
KPSS Test 제공.

ADF:
H0 = Unit Root exists / Non-stationary
p < 0.05 → Reject H0 → Stationarity evidence

KPSS:
H0 = Stationary
p < 0.05 → Reject H0 → Non-stationarity evidence

ADF + KPSS 통합해석:

Case 1:
ADF Reject, KPSS Not Reject
→ Strong evidence of Stationarity

Case 2:
ADF Not Reject, KPSS Reject
→ Strong evidence of Non-stationarity

Case 3:
ADF Reject, KPSS Reject
→ Possible trend-stationarity, structural break, or specification issue

Case 4:
ADF Not Reject, KPSS Not Reject
→ Inconclusive / possible low test power

출력은 영어 + 한글 둘 다 제공.

######################################################################
######################################################################
# 21. 차분
######################################################################
######################################################################

Difference Order:
0
1
2

Seasonal Difference:
On / Off

차분 전후 그래프 출력.

차분 후 자동 재실행 가능:
ADF
KPSS
ACF
PACF

######################################################################
######################################################################
# 22. ACF / PACF
######################################################################
######################################################################

사용자 최대 Lag 지정.
기본 40.

ACF Plot
PACF Plot

자동 교육용 해석:
ACF cuts off → MA possibility
PACF cuts off → AR possibility
Both decay → ARMA possibility
Slow decay → Possible non-stationarity

안내:
모형 선택은 ACF/PACF만으로 확정할 수 없습니다.

######################################################################
######################################################################
# 23. White Noise / Random Walk 비교
######################################################################
######################################################################

현재 데이터를 simulated white noise 및 random walk와 비교할 수 있게 해줘.

출력:
Time Plot
ACF

교육 설명:
White Noise
- no memory
- stable variance
- near-zero autocorrelation

Random Walk
- shocks accumulate
- persistent autocorrelation
- variance grows
- unit-root behavior

######################################################################
######################################################################
# 24. Ljung-Box Test
######################################################################
######################################################################

사용자 Lag:
5
10
20
Custom

출력:
Lag
Q Statistic
p-value
Conclusion

자동 해석:
p < .05 → Residual autocorrelation remains
p >= .05 → No strong evidence of residual autocorrelation

한글 + 영어 출력.

######################################################################
######################################################################
# 25. AR / MA / ARMA / ARIMA
######################################################################
######################################################################

AR(p)
MA(q)
ARMA(p,q)
ARIMA(p,d,q)

사용자 입력:
p
d
q
Forecast Horizon

출력:
Model Summary
Coefficient
p-value
AIC
BIC
Forecast
95% Prediction Interval
Residual Plot
Residual ACF
Residual Diagnostics

######################################################################
######################################################################
# 26. Auto ARIMA / SARIMA / ARIMAX / SARIMAX
######################################################################
######################################################################

Auto ARIMA는 pmdarima 사용.

설정:
Seasonal Yes/No
max_p
max_q
max_d
m

출력:
Best Order
Seasonal Order
AIC
BIC
추천 이유

SARIMA:
(p,d,q)(P,D,Q,m)

ARIMAX/SARIMAX:
외생변수 선택이 필요.
X가 없으면 실행 버튼 비활성화.

출력:
Coefficient
p-value
AIC
BIC
Forecast
외생변수별 자동 해석

######################################################################
######################################################################
# 27. Forecast Evaluation
######################################################################
######################################################################

시간순 Train/Test 분할.
절대 Random Shuffle 금지.

기본:
Train 80%
Test 20%

평가지표:
MAE
MSE
RMSE
MAPE
sMAPE
R² 가능하면 보조 제공

######################################################################
######################################################################
# 28. ARCH / GARCH
######################################################################
######################################################################

ARCH LM Test:
H0 = No ARCH effect
p < .05 → Conditional heteroskedasticity exists

ARCH(p)
기본 ARCH(1)

GARCH(p,q)
기본 GARCH(1,1)

출력:
Omega
Alpha
Beta
Conditional Volatility
Persistence = Alpha + Beta

해석:
Alpha = Shock Effect
Beta = Volatility Persistence
Alpha + Beta close to 1 = High volatility persistence

그래프:
Return
Conditional Volatility
Rolling Volatility

######################################################################
######################################################################
# 29. VAR / Granger / IRF
######################################################################
######################################################################

VAR:
복수 변수 2개 이상일 때 활성화.
실행 전 정상성 확인.
비정상일 경우 경고:
VAR in levels may produce misleading results.

Lag Selection:
AIC
BIC
HQIC
FPE

출력:
VAR Summary
Selected Lag
Forecast

Granger Causality:
Cause X
Effect Y
Max Lag

출력:
Lag
F Statistic
p-value
Conclusion

자동 해석:
p < .05 → X contains predictive information for Y

반드시 표시:
Granger causality is predictive causality, not structural causal identification.

한글:
Granger 인과관계는 구조적 인과관계가 아니라 예측 정보의 추가성을 의미합니다.

IRF:
VAR 적합 후 활성화.
Shock Variable
Response Variable
Periods

Impulse Response Function 출력.
가능하면 95% CI 표시.

######################################################################
######################################################################
# 30. SVAR / Cointegration / VECM
######################################################################
######################################################################

SVAR:
Advanced 메뉴.
Recursive / Cholesky identification.
변수 ordering 변경 가능.

경고:
SVAR results are sensitive to ordering and identification assumptions.

Cointegration:
Engle-Granger
Johansen

Johansen 출력:
Trace Statistic
Max Eigen Statistic 가능하면
Critical Values
Cointegration Rank

VECM:
공적분 확인 시 추천.
입력:
Cointegration Rank
Lag Difference

출력:
Error Correction Term
Short-run Coefficients
VECM Summary

ECT가 음(-)이고 유의한 경우:
Long-run equilibrium recovery mechanism

######################################################################
######################################################################
# 31. State Space / Kalman Filter
######################################################################
######################################################################

지원:
Local Level
Local Linear Trend

출력:
Observed
Filtered State
Forecast

Kalman Filter:
Observed Series
Kalman Filtered Series

교육 설명:
Prediction
Observation
Update

3단계를 반복하며 hidden state 추정.

######################################################################
######################################################################
# 32. Residual Diagnostics
######################################################################
######################################################################

모든 주요 예측모델에 제공.

Residual Time Plot
Histogram
Residual ACF
Q-Q Plot

Test:
Ljung-Box
Jarque-Bera
ARCH LM

결과:
Autocorrelation: PASS / CHECK
Normality: PASS / CHECK
Heteroskedasticity: PASS / CHECK

######################################################################
######################################################################
# 33. Model Comparison
######################################################################
######################################################################

실행된 모델을 Session State에 저장.

비교 테이블:
Model
Parameters
AIC
BIC
MAE
RMSE
MAPE
Ljung-Box p-value

AIC/BIC와 Forecast Accuracy를 구분해서 설명.

######################################################################
######################################################################
# 34. Automatic Model Recommendation
######################################################################
######################################################################

Rule-based diagnostic engine 구현.

Non-stationary → ARIMA / Differencing
Strong Seasonality → SARIMA
Exogenous Variables → ARIMAX / SARIMAX
ARCH Effect → ARCH / GARCH
Multiple Stationary Series → VAR
VAR + directional predictive relationship → Granger + IRF
Cointegrated I(1) Variables → VECM
Noisy Hidden State Problem → State Space / Kalman

자동 추천에는 항상 이유 포함.

예:
Recommended Model: GARCH(1,1)
Reason: ARCH-LM p-value = 0.002. The return series shows significant conditional heteroskedasticity.

한글:
ARCH-LM 검정에서 유의한 조건부 이분산성이 발견되어 GARCH 모형을 후보로 추천합니다.

######################################################################
######################################################################
# 35. Auto Analysis
######################################################################
######################################################################

버튼:
Run Automatic Time Series Analysis

클릭 시 자동 실행:
1. Download Data
2. Data Quality Check
3. Descriptive Statistics
4. Price Plot
5. Return Generation
6. ADF
7. KPSS
8. ACF
9. PACF
10. Ljung-Box
11. ARCH LM
12. Seasonality Check
13. Candidate Model Recommendation

결과를 Dashboard 형식으로 표시.

자동 추천은 정답 모델이 아니라 Candidate + Reason + Evidence로 제시.

######################################################################
######################################################################
# 36. ITS 이벤트 분석
######################################################################
######################################################################

사용자가 Event Date 선택 가능.
Event Name 입력 가능.

예:
2020-12-21
TSLA S&P 500 Inclusion

자동 생성:
time
post
time_after

모형:
Y_t = β0 + β1 Time_t + β2 Post_t + β3 TimeAfter_t + ε_t

출력:
Immediate Level Change
Post-event Slope Change
Coefficient
p-value
95% CI

결과 해석:
영어 + 한글.

HAC 표준오차 옵션 제공.

모든 관련 그래프에 이벤트 날짜를 수직선으로 표시.

######################################################################
######################################################################
# 37. 교육용 Explanation Box
######################################################################
######################################################################

각 분석화면 아래 4개 박스 표시.

1. What is this?
2. Why use it?
3. How to read?
4. Common mistake

예: ADF

What is this?
Unit Root Test

Why use it?
Check whether a time series is stationary.

How to read?
p < .05 → Reject unit-root null hypothesis

Common mistake:
ADF p-value가 작으면 비정상이라고 반대로 해석하는 오류.

######################################################################
######################################################################
# 38. 결과 자동해석
######################################################################
######################################################################

모든 통계검정에서 숫자만 출력하지 않는다.

반드시:
Numeric Result
English Interpretation
한글 해석

세 가지를 함께 제공.

예:
ADF statistic: -4.32
p-value: 0.001

English:
The null hypothesis of a unit root is rejected.
The series provides evidence of stationarity.

한글:
단위근이 존재한다는 귀무가설을 기각합니다.
해당 시계열은 정상적이라는 통계적 증거가 있습니다.

######################################################################
######################################################################
# 39. Statistical Caution
######################################################################
######################################################################

통계적 유의성과 경제적 중요성을 구분한다.

예:
A statistically significant coefficient is not necessarily economically important.

한글:
통계적으로 유의하다고 해서 반드시 경제적으로 중요한 효과를 의미하는 것은 아닙니다.

######################################################################
######################################################################
# 40. Analysis History
######################################################################
######################################################################

Session State 활용.

예:
✓ Stock Downloaded
✓ Return Generated
✓ ADF
✓ KPSS
✓ ACF/PACF
✓ ARIMA(1,1,1)
✓ GARCH(1,1)
✓ Ljung-Box

######################################################################
######################################################################
# 41. Report
######################################################################
######################################################################

Report 버튼 제공.

내용:
Dataset Information
Ticker
Analysis Period
Frequency
Missing Values
Descriptive Statistics
Stationarity
ACF/PACF Summary
Selected Model
Model Parameters
Forecast Metrics
Residual Diagnosis
Interpretation
Limitations

Export:
CSV
HTML
가능하면 PDF

######################################################################
######################################################################
# 42. Sample Data
######################################################################
######################################################################

웹 접속 오류가 있거나 통계 개념 교육을 위해 Sample Data 제공.

Generate:
White Noise
Random Walk
Trend
Seasonality
Trend + Seasonality
AR(1)
MA(1)
ARMA
GARCH-like Returns
Cointegrated Pair

######################################################################
######################################################################
# 43. 오류 처리
######################################################################
######################################################################

다음 오류 처리.

Invalid ticker
No stock data
Network failure
Too few observations
No date column
Missing numeric variable
Seasonal period too long
ADF failure
KPSS failure
Model convergence failure
VAR needs >= 2 variables
VECM insufficient observations
Exogenous variable missing
GARCH convergence failure

사용자에게 Python traceback 출력 금지.

######################################################################
######################################################################
# 44. 코드 문서화
######################################################################
######################################################################

각 함수에는 상세 docstring.

예:

def run_adf_test(series):
    '''
    Augmented Dickey-Fuller unit root test.

    Null hypothesis:
        The series has a unit root.

    Interpretation:
        p < 0.05 suggests rejection of the unit-root null.
    '''

통계검정의 H0/H1를 코드 주석에 반드시 명시.

######################################################################
######################################################################
# 45. 그래프 정책
######################################################################
######################################################################

그래프는 영어로 표시.

예:
Historical Price
Daily Return
ACF
PACF
Conditional Volatility
Forecast
Impulse Response

한글은 그래프 바깥 Explanation Box에서 제공.

######################################################################
######################################################################
# 46. 수식 표현
######################################################################
######################################################################

Streamlit에서 LaTeX를 사용한다.

st.latex()

수식을 이미지로 넣지 않는다.
확대해도 깨지지 않도록 한다.

######################################################################
######################################################################
# 47. 자동 추천 안내문
######################################################################
######################################################################

자동 분석 화면 아래 항상 표시.

한국어:
본 프로그램의 자동 추천은 교육을 위한 통계적 진단 결과이며,
최종 모형 선택은 연구목적, 데이터 생성과정,
표본기간 및 경제적 맥락을 함께 고려해야 합니다.

English:
Automatic recommendations are educational statistical diagnostics.
Final model selection should also consider the research objective,
data-generating process, sample period, and economic context.

######################################################################
######################################################################
# 48. 구현 순서
######################################################################
######################################################################

한 번에 모든 기능을 대충 구현하지 말고 다음 Phase 순서로 완성한다.

PHASE 1:
Stock download
Basic UI
Visualization
Returns
Descriptive Statistics

PHASE 2:
ADF
KPSS
ACF
PACF
Differencing
Ljung-Box

PHASE 3:
AR
MA
ARMA
ARIMA
Auto ARIMA
SARIMA

PHASE 4:
ARCH LM
ARCH
GARCH

PHASE 5:
Multiple stock download
Correlation
VAR
Granger
IRF

PHASE 6:
Cointegration
VECM

PHASE 7:
State Space
Kalman

PHASE 8:
ITS

PHASE 9:
Model Comparison
Auto Recommendation
Report

######################################################################
######################################################################
# 49. 테스트
######################################################################
######################################################################

프로그램 개발 완료 후 브라우저에서 실제로 직접 테스트한다.

TEST 1:
NVDA
5 years
Daily
실행:
Price
Return
ADF
KPSS
ACF/PACF
ARIMA
GARCH

TEST 2:
NVDA
AMD
INTC
실행:
Correlation
VAR
Granger
IRF

TEST 3:
SPY
QQQ
실행:
Cointegration

TEST 4:
TSLA
Event:
2020-12-21
실행:
ITS

TEST 5:
Sample Random Walk
확인:
ADF Non-stationary
Differencing
ADF Stationary

README에 Tested Functions 섹션을 만들고 PASS / FAIL / WARNING으로 기록해줘.

######################################################################
######################################################################
# 50. 최종 산출물
######################################################################
######################################################################

반드시 다음 결과를 완성한다.

app.py
requirements.txt
README.md
modules/*.py

README 내용:
Project Description
Features
Installation
Execution
Statistics Included
Example Workflow
Limitations
Tested Functions

설치:
pip install -r requirements.txt

실행:
streamlit run app.py

######################################################################
######################################################################
# 51. 최종 목표
######################################################################
######################################################################

최종 프로그램은 단순한 통계 패키지가 아니다.

학생이 다음 질문을 순서대로 이해하게 만드는
교육용 No-Code Statistical Time Series Studio여야 한다.

1. 이 데이터는 어떤 시계열인가?
2. 정상적인가?
3. 과거를 기억하는가?
4. 계절성이 있는가?
5. 어떤 모형이 후보인가?
6. 추정된 모형은 적절한가?
7. 잔차는 백색잡음인가?
8. 변동성 군집이 있는가?
9. 다른 변수와 동적 관계가 있는가?
10. 장기균형 관계가 있는가?
11. 충격은 어떻게 전달되는가?
12. 미래는 어떻게 예측되는가?
13. 특정 이벤트가 구조를 변화시켰는가?
14. 결과를 어떻게 해석해야 하는가?

즉,
DATA → STRUCTURE → DIAGNOSIS → MODEL → VALIDATION → FORECAST → INTERPRETATION
이라는 시계열분석 전체 사고과정을 하나의 프로그램에서 학습할 수 있게 완성해줘.
```
