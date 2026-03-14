# Time Series Analysis Lecture Notes

대학원 수준의 시계열 분석 강의를 위한 부교재 모음입니다.  
이 페이지는 각 장의 주제와 링크를 한눈에 볼 수 있도록 정리한 마스터 인덱스입니다.

## 구성 안내

- 본 부교재는 시계열 분석의 기초부터 고전 모형, 다변량 분석, 인과추론, 머신러닝/딥러닝, 응용, GitHub 기반 재현가능성까지 순차적으로 다룹니다.
- 각 장은 강의 슬라이드, 실습 노트북, 뉴스레터 연재문, 전공 서적을 바탕으로 작성되었습니다.
- 실습 노트북은 저장소의 `notebooks/` 폴더와 함께 사용하는 것을 권장합니다.

---

## Part I. Foundations of Time Series Analysis

### Chapter 1. 시계열분석이란 무엇인가
- 파일: [ch01_intro_time_series.md](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch01_intro_time_series.md)
- 주제: 시계열 데이터의 정의, 시간 순서의 중요성, 예측·설명·인과의 구분

### Chapter 2. 시계열 데이터의 구조와 시각화
- 파일: [ch02_ts_structure.md](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch02_ts_structure.md)
- 주제: 시간 인덱스, 빈도, 결측치·이상치, 분해와 시각화

### Chapter 3. 정상성, 자기상관, 그리고 백색잡음
- 파일: [ch03_stationarity_acf.md](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch03_stationarity_acf.md)
- 주제: 정상성, 단위근, 랜덤워크, ACF/PACF, 차분

### Chapter 4. AR, MA, ARMA 모형의 기초
- 파일: [ch04_arma.md](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch04_arma.md)
- 주제: AR/MA/ARMA 구조, ACF/PACF 해석, 인과성과 가역성

---

## Part II. Classical Time Series Models

### Chapter 5. ARIMA와 Box–Jenkins 절차
- 파일: [ch05_arima.md](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch05_arima.md)
- 주제: ARIMA 모형, 식별·추정·진단·예측, auto_arima, Ljung-Box 검정

### Chapter 6. 계절성과 SARIMA
- 파일: [ch06_sarima.md](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch06_sarima.md)
- 주제: 계절성, 계절 차분, SARIMA 구조, 계절 데이터 예측

### Chapter 7. 예측, 백테스트, 성능평가
- 파일: [ch07_forecasting.md](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch07_forecasting.md)
- 주제: 시계열 예측 절차, walk-forward validation, MAPE/RMSE 등 평가 지표

---

## Part III. Multivariate Time Series and Structural Analysis

### Chapter 8. 다변량 시계열과 VAR
- 파일: [ch08_var.md](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch08_var.md)
- 주제: VAR 모형, 상호작용 구조, 다변량 예측

### Chapter 9. Granger 인과성, 충격반응, 분산분해
- 파일: [ch09_granger.md](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch09_granger.md)
- 주제: Granger causality, impulse response, FEVD

### Chapter 10. 공적분과 장기균형 관계
- 파일: [ch10_cointegration.md](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch10_cointegration.md)
- 주제: 공적분, 장기균형, 오차수정모형(ECM)

### Chapter 11. 구조변화, 이상치, 개입분석
- 파일: [ch11_breaks.md](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch11_breaks.md)
- 주제: structural breaks, 이상치, intervention analysis

---

## Part IV. Advanced Topics and Applications

### Chapter 12. 시계열 인과추론 입문
- 파일: [ch12_causal_ts.md](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch12_causal_ts.md)
- 주제: interrupted time series, 정책효과 분석, 시계열 인과추론의 기초

### Chapter 13. 머신러닝과 딥러닝 기반 시계열의 개요
- 파일: [ch13_ml_dl.md](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch13_ml_dl.md)
- 주제: ML/DL 기반 시계열 예측, LSTM, Transformer, 전통 모형과의 비교

### Chapter 14. 금융·경영·환경 데이터 응용
- 파일: [ch14_applications.md](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch14_applications.md)
- 주제: 주가·매출·수요·환경 데이터 등 도메인별 시계열 응용

### Chapter 15. 재현 가능한 시계열분석과 GitHub 운영
- 파일: [ch15_github.md](https://github.com/nhjung-phd/TimeSeriesAnalysis/blob/main/lecture_notes/ch15_github.md)
- 주제: GitHub 기반 강의 운영, 재현가능성, 프로젝트 구조화

---

## 권장 학습 순서

1. Chapter 1–3: 시계열의 기초 개념과 정상성 이해  
2. Chapter 4–7: 고전적 시계열 예측 모형 숙지  
3. Chapter 8–11: 다변량 구조와 장기균형, 구조변화 이해  
4. Chapter 12–15: 인과추론, 최신 방법론, 응용, 재현가능성 확장  

---

## 관련 자료

- 전체 저장소: [TimeSeriesAnalysis](https://github.com/nhjung-phd/TimeSeriesAnalysis)
- 실습 노트북 폴더: [notebooks](https://github.com/nhjung-phd/TimeSeriesAnalysis/tree/main/notebooks)
- 강의 노트 폴더: [lecture_notes](https://github.com/nhjung-phd/TimeSeriesAnalysis/tree/main/lecture_notes)
- 문서 자료 폴더: [docs](https://github.com/nhjung-phd/TimeSeriesAnalysis/tree/main/docs)

---

## Note

이 부교재는 지속적으로 보완 중인 강의용 초안입니다.  
오탈자, 설명 보완, 실습 개선, 참고문헌 추가는 학기 진행과 함께 업데이트될 수 있습니다.