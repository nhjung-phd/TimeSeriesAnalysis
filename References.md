## 📌 참고 문헌 (References)  

### **1️⃣ 전통적인 시계열 분석 (통계적 접근법)**
이 단계에서는 ARIMA, 상태공간 모델, 베이지안 접근법 등 전통적인 시계열 모델들이 소개됩니다.  

📄 **Box, G. E., Jenkins, G. M., Reinsel, G. C., & Ljung, G. M. (2015).**  
🔹 *Time Series Analysis: Forecasting and Control*  
📌 시계열 분석에서 가장 중요한 개념 중 하나인 Box-Jenkins 방법론(ARIMA 모델의 기반)을 정립한 연구  
🔗 [DOI: 10.1002/9781118619193](https://doi.org/10.1002/9781118619193)  

📄 **Hamilton, J. D. (1994).**  
🔹 *Time Series Analysis*  
📌 Markov Switching Models과 동적 거시경제 모델을 설명한 대표적인 교과서  
🔗 [Book Link](https://press.princeton.edu/books/hardcover/9780691042893/time-series-analysis)  

📄 **Hyndman, R. J., & Athanasopoulos, G. (2018).**  
🔹 *Forecasting: Principles and Practice*  
📌 ARIMA, ETS(지수평활법), 상태공간 모델(State-Space Models) 등의 실전 적용법을 설명  
📌 R 패키지 `forecast`의 개발자인 Rob Hyndman 교수의 연구  
🔗 [Online Free Book](https://otexts.com/fpp3/)  

📄 **Brockwell, P. J., & Davis, R. A. (2016).**  
🔹 *Introduction to Time Series and Forecasting*  
📌 시계열 분석 입문서로, 확률 과정과 시계열 예측 기법을 다룸  
🔗 [DOI: 10.1007/978-3-319-29854-2](https://doi.org/10.1007/978-3-319-29854-2)  

📄 **Harvey, A. C. (1990).**  
🔹 *Forecasting, Structural Time Series Models and the Kalman Filter*  
📌 구조적 시계열 모델 및 칼만 필터(Kalman Filter)를 이용한 예측 기법 정리  
🔗 [DOI: 10.1017/CBO9781107049994](https://doi.org/10.1017/CBO9781107049994)  

📄 **Mills, T. C. (2019).**  
🔹 *Applied Time Series Analysis*  
📌 응용 시계열 분석 개념과 예측 기법 소개  
🔗 [DOI: 10.1017/9781108525312](https://doi.org/10.1017/9781108525312)  

📄 **Shumway, R. H., & Stoffer, D. S. (2017).**  
🔹 *Time Series Analysis and Its Applications*  
📌 시계열 분석의 이론과 응용을 종합적으로 다룬 연구서  
🔗 [Book Link](https://www.springer.com/gp/book/9783319524511)  

---

### **2️⃣ 머신러닝 및 딥러닝 기반 시계열 예측**  
최근 시계열 분석에서는 딥러닝(Deep Learning)과 머신러닝 기반 방법론이 활발하게 연구되고 있음.  

📄 **Hochreiter, S., & Schmidhuber, J. (1997).**  
🔹 *Long Short-Term Memory (LSTM)*  
📌 LSTM 모델을 처음 제안한 논문으로, 순환신경망(RNN)의 장기 의존성(Long-Term Dependency) 문제를 해결  
🔗 [Paper](https://www.bioinf.jku.at/publications/older/2604.pdf)  

📄 **Vaswani, A., et al. (2017).**  
🔹 *Attention Is All You Need*  
📌 Transformer 모델을 처음 제안한 논문  
📌 NLP(자연어 처리)뿐만 아니라, 시계열 데이터에도 Transformer 모델이 도입되는 계기가 된 연구  
🔗 [Paper](https://arxiv.org/abs/1706.03762)  

📄 **Lim, B., Arık, S. O., Loeff, N., & Pfister, T. (2021).**  
🔹 *Temporal Fusion Transformers for Interpretable Multi-horizon Time Series Forecasting*  
📌 시계열 데이터를 위한 Transformer 기반 모델을 제안  
📌 멀티 스텝 예측(Multi-Horizon Forecasting) 에 특화됨  
🔗 [Paper](https://arxiv.org/abs/1912.09363)  

📄 **Zerveas, G., et al. (2021).**  
🔹 *A Transformer-based Framework for Multivariate Time Series Representation Learning*  
📌 다변량 시계열(multivariate time series)을 Transformer로 모델링하는 방법을 제안  
🔗 [Paper](https://arxiv.org/abs/2010.02803)  

📄 **Brownlee, J. (2020).**  
🔹 *Deep Learning for Time Series Forecasting*  
📌 딥러닝을 활용한 시계열 분석 개요 및 기법 소개  
🔗 [Book Link](https://machinelearningmastery.com/deep-learning-for-time-series-forecasting/)  

---

### **3️⃣ 최신 시계열 예측 및 생성 모델**  
최근에는 딥러닝을 활용한 시계열 생성, 이상 탐지(Anomaly Detection), 비정형 데이터 활용 등의 연구가 활발하게 진행됨.  

📄 **Kantz, H., & Schreiber, T. (2004).**  
🔹 *Nonlinear Time Series Analysis*  
📌 비선형 시계열 분석 방법론을 다룬 연구  
🔗 [DOI: 10.1017/CBO9780511755798](https://doi.org/10.1017/CBO9780511755798)  

📄 **Oord, A. v. d., et al. (2016).**  
🔹 *WaveNet: A Generative Model for Raw Audio*  
📌 Google DeepMind에서 제안한 WaveNet 모델  
📌 시계열 데이터에서 Convolutional Neural Network (CNN)을 활용한 딥러닝 기법  
🔗 [Paper](https://arxiv.org/abs/1609.03499)  

📄 **Salinas, D., Flunkert, V., Gasthaus, J., & Januschowski, T. (2020).**  
🔹 *DeepAR: Probabilistic Forecasting with Autoregressive Recurrent Networks*  
📌 Amazon에서 개발한 확률적 시계열 예측 모델 (Probabilistic Forecasting)  
📌 딥러닝을 활용한 시계열 분포 예측을 제안  
🔗 [Paper](https://arxiv.org/abs/1704.04110)  

---


논문은 계속 추가중 👍
