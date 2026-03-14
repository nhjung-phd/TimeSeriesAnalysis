# Chapter 15. 재현 가능한 시계열분석과 GitHub 운영

<p><strong>Recommended Week:</strong> Week 15</p>
<p><strong>Notebook:</strong> <code>colab.md</code>, <code>README.md</code></p>

## Learning Objectives

- 학술 연구 및 실무 프로젝트에서 재현가능성(Reproducibility)이 갖는 과학적, 비즈니스적 가치를 이해한다.
- 시계열 분석 프로젝트의 디렉토리 구조를 체계적으로 설계하고, Notebook과 Script의 역할을 분리할 수 있다.
- 버전 관리 시스템(Version Control System)의 철학을 이해하고, Git과 GitHub를 활용하여 프로젝트 코드를 안전하게 관리할 수 있다.
- 다른 연구자나 실무자가 즉시 코드를 실행하고 결과를 검증할 수 있도록, README 작성 및 환경 의존성(Dependencies) 관리 기법을 습득한다.

## 1. Opening

“어제까지만 해도 완벽하게 돌아가던 모델인데, 오늘 다시 실행해보니 에러가 납니다.”

데이터 분석가나 대학원생들이 자주 겪는 이 당혹스러운 상황은 왜 발생할까? 우리가 정교한 수식을 세우고 ARIMA와 딥러닝 모델의 하이퍼파라미터를 완벽하게 튜닝했다 하더라도, 그 결과를 동료 연구자나 6개월 뒤의 나 자신이 다시 만들어낼 수 없다면 그 분석은 과학적 신뢰성을 잃게 된다.

시계열 분석 프로젝트의 완성은 뛰어난 예측 오차 지표를 도출하는 것에서 끝나지 않는다. 데이터가 수집된 순간부터 결측치를 정제하고, 모델을 훈련하여 예측 결과를 내놓기까지의 모든 궤적이 투명하게 기록되고 관리되어야 한다. 이 장에서는 수학과 알고리즘의 영역을 넘어, 분석 파이프라인을 견고하게 건축하고 전 세계의 연구자들과 협업하는 <strong>재현 가능한 시계열 분석(Reproducible Time Series Analysis)</strong>과 <strong>GitHub 운영 전략</strong>을 다룬다.

## 2. Why This Topic Matters

프랜시스 디볼드(F. X. Diebold)는 그의 저술에서, 개인적인 소규모 프로젝트는 단순한 클라우드 저장소로도 관리할 수 있지만, 본격적인 개발과 심도 있는 분석 프로젝트에서는 Git과 같은 버전 관리 시스템의 도입이 필수적이라고 강조한다.

특히 시계열 분석에서는 횡단면 데이터 분석보다 버전 관리가 더 중요하다. 이유는 시계열 데이터가 시간이 지남에 따라 계속 업데이트되기 때문이다. 오늘 훈련한 예측 모델이 다음 달 새로운 데이터가 들어왔을 때도 동일한 전처리 파이프라인을 거쳐 안정적으로 작동하려면, 코드와 데이터 흐름이 체계적으로 구조화되어 있어야 한다.

또한 최근 학술 논문 심사 과정에서는 분석 코드와 데이터 접근 경로가 담긴 GitHub 저장소 링크를 요구하는 경우가 많아지고 있다. 따라서 GitHub 운영 능력은 현대 대학원생과 실무 분석가가 갖추어야 할 필수 역량이다.

## 3. Core Concepts

### 3.1 재현가능성 (Reproducibility)

재현가능성이란 타인, 또는 미래의 자신이 사용한 원본 데이터와 분석 코드를 그대로 넘겨받아 실행했을 때, 논문이나 보고서에 제시된 것과 동일한 통계량, 그래프, 예측 결과를 다시 도출할 수 있는 성질을 의미한다. 이를 위해서는 코드뿐 아니라 파이썬 패키지 버전, 운영 환경, 실행 순서 등의 정보까지 함께 제공되어야 한다.

### 3.2 버전 관리와 Git

버전 관리 시스템(VCS)은 소스 코드의 변경 이력을 시간 순서대로 저장하는 시스템이다. 코드를 수정하다가 오류가 발생해도 과거의 특정 정상 시점으로 즉시 되돌릴 수 있으며, 여러 명이 동시에 서로 다른 모델이나 실험을 병렬적으로 개발한 뒤 하나로 병합할 수 있게 해준다. GitHub는 이러한 Git 시스템을 클라우드 환경에서 시각적으로 제공하는 협업 플랫폼이다.

### 3.3 프로젝트 폴더 구조화 (Directory Structure)

하나의 Jupyter Notebook 파일 안에 데이터 로딩, 전처리, 모델링, 시각화 코드를 모두 몰아넣는 것은 재현성을 약화시키는 대표적 원인이다. 분석 프로젝트는 모듈화되어 물리적인 폴더 구조로 분리되어야 한다. 강의용 저장소 <code>TimeSeriesAnalysis</code> 역시 <code>data/</code>, <code>notebooks/</code>, <code>docs/</code>, <code>lecture_notes/</code>, <code>prompts/</code> 등의 체계적인 구조를 사용하고 있다.

### 3.4 Notebook과 Script의 역할 분리

- <strong>Jupyter Notebook (<code>.ipynb</code>)</strong>: 데이터를 처음 탐색하는 EDA, 그래프 확인, 실험적 모델 피팅, 설명용 시각화에 적합하다.
- <strong>Python Script (<code>.py</code>)</strong>: 확정된 전처리 로직, 반복 호출되는 함수, 평가지표 계산, 재사용 가능한 유틸리티 코드는 별도의 스크립트 파일로 분리하는 것이 바람직하다.

이 구분을 통해 가독성, 유지보수성, 재현성을 동시에 높일 수 있다.

## 4. Configuration Logic

이 장에서는 수식 대신 표준화된 <strong>시계열 분석 프로젝트 폴더 템플릿</strong>을 제시한다. 다음 구조는 학술 논문 작성과 실무 파이프라인에서 모두 유용하다.

```text
My_TimeSeries_Project/
├── data/                  # 데이터 폴더
│   ├── raw/               # 원본 데이터 (수정하지 않음)
│   └── processed/         # 전처리 완료 데이터
├── notebooks/             # 탐색 및 실험용 Notebook
├── src/                   # 핵심 함수 및 클래스 스크립트
├── docs/                  # 논문 초안, 발표 자료, 문서
├── results/               # 예측 결과, 저장된 모델, 로그
├── requirements.txt       # 재현용 파이썬 패키지 및 버전 명세
└── README.md              # 프로젝트 개요, 실행 방법, 데이터 설명
````

이 구조의 핵심은 다음과 같다.

* <code>raw/</code> 데이터는 원칙적으로 손대지 않는다.
* 전처리 결과는 <code>processed/</code>에 저장한다.
* Notebook은 실험용, Script는 재사용용으로 분리한다.
* 결과물은 <code>results/</code>에 버전과 함께 축적한다.
* 최상단의 <code>README.md</code>가 전체 프로젝트의 입구 역할을 한다.

## 5. Visual Intuition

GitHub 저장소의 뼈대를 시각적으로 상상해 보자.

1. <strong>Commit History</strong>
   메인(Main) 줄기에서 시작하여, 한 사람은 ARIMA 모델을 실험하는 가지(Branch)를 만들고 다른 사람은 LSTM 모델을 실험하는 가지를 만든다. 실험이 끝난 뒤 더 나은 결과를 낸 모델을 메인 줄기로 병합한다. 이 모든 변경의 타임라인이 프로젝트의 역사로 남는다.

2. <strong>README.md 대시보드</strong>
   누군가 저장소에 접속했을 때 가장 먼저 마주하는 간판이다. 어떤 데이터를 썼는지, 어떤 시계열 모형을 썼는지, 어떻게 실행하는지가 명확하게 정리되어 있어야 한다. 좋은 README는 연구의 입구이자 운영 매뉴얼이다.

## 6. Python Practice (GitHub Operation)

### 6.1 Environment

강의용 공식 실습 저장소인 <code>[https://github.com/nhjung-phd/TimeSeriesAnalysis](https://github.com/nhjung-phd/TimeSeriesAnalysis)</code>를 바탕으로 프로젝트 운영 방식을 실습한다. 이 저장소는 <code>notebooks</code>, <code>docs</code>, <code>lecture_notes</code>, <code>prompts</code> 폴더 등을 포함하여 시계열 분석의 주요 산출물을 관리하고 있다.

### 6.2 Code Walkthrough

GitHub를 통한 재현 가능한 분석 환경 구축의 기본 흐름은 다음과 같다.

1. <strong>환경 의존성 고정 및 복원</strong>
   자신의 로컬 PC에서 작동하는 환경을 <code>requirements.txt</code>로 추출한다.

```bash
pip freeze > requirements.txt
```

이후 다른 연구자가 동일한 환경을 설치할 때는 다음 명령어를 사용한다.

```bash
pip install -r requirements.txt
```

2. <strong>상대 경로(Relative Path)의 사용</strong>
   Notebook 파일에서 데이터를 불러올 때 절대 경로를 쓰면 타인의 PC에서 에러가 발생한다. 반드시 저장소 최상단을 기준으로 한 상대 경로를 사용해야 한다.

```python
# Bad
# df = pd.read_csv("C:/Users/MyName/Desktop/data/stock.csv")

# Good
df = pd.read_csv("../data/processed/stock_returns.csv")
```

3. <strong>재현 가능한 로그 저장</strong>
   모델 실행 시 주요 파라미터, 예측 결과, 날짜를 함께 저장한다.

```python
forecast_df.to_csv("../results/forecast_20260315_arima.csv", index=False)
```

### 6.3 What to Observe

수강생은 GitHub 저장소 상단의 <strong>Issues</strong>와 <strong>Pull requests</strong> 메뉴를 관찰해야 한다. 코드에 버그가 있거나 특정 기간의 데이터 전처리에 대한 논의가 필요할 때, 카카오톡이나 이메일이 아니라 Issue를 생성하여 토론의 기록을 프로젝트 자산으로 남기는 협업 방식이 중요하다.

## 7. Interpretation of Results

시계열 예측 결과를 해석하는 것을 넘어, 그 결과를 <strong>안전하게 보관하고 추적 가능하게 만드는 것</strong>이 중요하다.

모델을 튜닝할 때마다 결과가 달라질 수 있으므로, 특정 일자에 수행한 예측 결과, 예를 들어 <code>forecast_20260315_ARIMA_p1d1q1.csv</code>와 그때 사용한 하이퍼파라미터 로그를 <code>results/</code> 폴더에 타임스탬프와 함께 저장해야 한다. 이를 통해 지도교수나 상사가 “지난주 보여준 그 예측 그래프를 어떻게 만들었는가?”라고 물었을 때, 해당 결과를 재생산할 수 있다.

즉, 결과 해석은 숫자에 대한 설명만이 아니라, <strong>그 숫자가 언제, 어떤 코드와 환경으로 생성되었는가를 설명할 수 있는 상태</strong>까지 포함한다.

## 8. Common Mistakes

* <strong>대용량 원본 데이터의 GitHub 직접 푸시</strong>: GitHub는 대용량 파일 업로드에 제한이 있다. 고빈도 금융 데이터나 센서 원시 데이터를 직접 올리려다 에러가 나는 경우가 많다. 일반적으로 <code>.gitignore</code>에 <code>data/</code>를 등록하고, 데이터는 다운로드 링크나 API 경로로 제공하는 편이 바람직하다.
* <strong>Random Seed 미설정</strong>: 딥러닝이나 시뮬레이션 코드에서 랜덤 시드를 고정하지 않으면 실행할 때마다 결과가 달라져 재현이 어려워진다.
* <strong>수작업 전처리의 개입</strong>: 원본 CSV 파일을 엑셀로 열어 손으로 수정하면, 그 변경 이력이 남지 않아 재현성이 크게 훼손된다. 데이터 변환은 반드시 코드로 수행해야 한다.
* <strong>Notebook 하나에 모든 것을 몰아넣기</strong>: 탐색, 전처리, 모델링, 시각화, 결과 저장을 모두 한 Notebook에 넣으면 나중에 어느 단계에서 무엇이 바뀌었는지 추적하기 어려워진다.

## 9. Summary

시계열 분석 프로젝트는 정교한 통계적, 수학적 기법을 적용하는 것만큼이나, 그 과정을 누구나 신뢰하고 검증할 수 있도록 투명하게 설계하는 것이 중요하다. 모듈화된 프로젝트 폴더 구조를 갖추고, Notebook과 Script의 역할을 분리하며, 절대 경로 대신 상대 경로를 사용하는 것은 기본 중의 기본이다. 더 나아가 Git과 GitHub를 활용한 버전 통제, <code>README.md</code>, 환경 명세서(<code>requirements.txt</code>)의 제공은 분석 결과를 일회성 스크립트가 아니라 지속적으로 확장 가능한 소프트웨어 자산으로 만들어 준다. 재현가능성은 부가 기능이 아니라 현대 시계열 분석의 핵심 품질 기준이다.

## 10. Exercises

1. <strong>개념 문제:</strong> 대규모 시계열 분석 프로젝트에서 탐색적 데이터 분석을 수행하는 코드와, 실제 예측 및 평가지표 산출 코드를 각각 어떤 파일 형태(Notebook vs Script)로 분리하는 것이 유리한지 재현가능성과 유지보수성의 관점에서 설명하시오.

2. <strong>해석 문제:</strong> 동료 연구자의 시계열 예측 모델 코드를 GitHub에서 다운로드하여 실행했으나, <code>FileNotFoundError</code>와 <code>ModuleNotFoundError</code>가 동시에 발생했다. 이 두 오류가 재현성 측면에서 왜 발생했는지, 경로 설정과 환경 의존성의 관점에서 설명하시오.

3. <strong>간단한 실습 문제:</strong> GitHub 저장소를 하나 새로 생성하고, <code>data/</code>, <code>notebooks/</code>, <code>docs/</code> 폴더를 만드시오. 그리고 최상단에 <code>README.md</code> 파일을 생성하여 자신이 진행할 시계열 분석 프로젝트의 목적, 사용하는 데이터, 분석 기법을 Markdown 형식으로 작성하시오.

## 11. Further Reading / References

* Diebold, F. X. (2015). *Forecasting in Economics, Business, Finance and Beyond*.
* 정낙현. (2025). <code>nhjung-phd/TimeSeriesAnalysis</code> GitHub Repository.
* GitHub 공식 문서. Repository 생성 및 Pull Request 협업 가이드.
* 정낙현. (2026). *Time Series Analysis 6: 시계열 분석 논문 기초*.

