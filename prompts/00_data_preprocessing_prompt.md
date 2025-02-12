# 📌 데이터 전처리 (Preprocessing) 프롬프트

이 문서는 **GPT를 활용하여 데이터 전처리 코드를 자동 생성**할 수 있도록 도와줍니다.  
아래 **프롬프트를 GPT에 입력**하면, 원하는 전처리 코드를 쉽게 생성할 수 있습니다. 🚀

---

## 🛠️ **1. 라이브러리 불러오기**
```plaintext
Python에서 데이터 전처리를 위해 pandas, numpy, matplotlib 라이브러리를 불러오는 코드를 작성해줘.
필요하면 seaborn도 추가해줘.
```

📌 **예제 코드**
```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
```

---

## 📊 **2. 데이터 로드 및 기본 정보 확인**
```plaintext
Pandas를 사용하여 CSV 파일을 불러오고, 데이터의 기본 정보를 확인하는 코드를 작성해줘.
head(), info(), describe() 함수를 사용해줘.
```

📌 **예제 코드**
```python
df = pd.read_csv("data/sample_data.csv")

# 데이터 기본 정보 확인
print(df.head())  # 상위 5개 행 출력
print(df.info())  # 컬럼별 데이터 타입 및 결측치 확인
print(df.describe())  # 기초 통계 정보 출력
```

---

## 🧼 **3. 결측치 처리**
```plaintext
Pandas를 사용하여 데이터프레임에서 결측치를 확인하고, 평균 또는 중앙값으로 채우는 코드를 작성해줘.
```

📌 **예제 코드**
```python
# 결측치 개수 확인
print(df.isnull().sum())

# 평균값으로 결측치 채우기
df.fillna(df.mean(), inplace=True)
```

---

## 🛑 **4. 이상치 탐지 및 제거**
```plaintext
Pandas와 Matplotlib을 사용하여 Boxplot을 그리고 이상치를 탐지하는 코드를 작성해줘.
이상치는 IQR 방법을 사용해서 제거하는 코드도 추가해줘.
```

📌 **예제 코드**
```python
# Boxplot 시각화
plt.figure(figsize=(10, 5))
sns.boxplot(data=df)
plt.title("Boxplot for Outlier Detection")
plt.show()

# IQR을 이용한 이상치 제거
Q1 = df.quantile(0.25)
Q3 = df.quantile(0.75)
IQR = Q3 - Q1
df_cleaned = df[~((df < (Q1 - 1.5 * IQR)) | (df > (Q3 + 1.5 * IQR))).any(axis=1)]
```

---

## 🔄 **5. 데이터 정규화 및 표준화**
```plaintext
Pandas와 Scikit-learn을 사용하여 MinMax Scaling과 Standard Scaling을 적용하는 코드를 작성해줘.
```

📌 **예제 코드**
```python
from sklearn.preprocessing import MinMaxScaler, StandardScaler

# Min-Max Scaling
scaler = MinMaxScaler()
df_scaled = pd.DataFrame(scaler.fit_transform(df), columns=df.columns)

# Standard Scaling
scaler = StandardScaler()
df_standardized = pd.DataFrame(scaler.fit_transform(df), columns=df.columns)
```

---

## 🏷 **6. 카테고리형 변수 인코딩**
```plaintext
Pandas를 사용하여 범주형 변수(예: "gender")를 One-Hot Encoding하는 코드를 작성해줘.
```

📌 **예제 코드**
```python
df = pd.get_dummies(df, columns=["gender"], drop_first=True)
```

---

## ✅ **7. 최종 데이터 저장**
```plaintext
전처리가 완료된 데이터를 CSV 파일로 저장하는 코드를 작성해줘.
```

📌 **예제 코드**
```python
df.to_csv("data/processed_data.csv", index=False)
```

---

📌 **이 프롬프트를 사용하여 GPT에서 직접 코드 생성을 시도해보세요! 🚀**  
프롬프트를 입력하면, 자동으로 코드를 생성해줍니다.  

Colab에서 직접 실행하려면 아래 링크를 클릭하세요.  
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nhjung-phd/TimeSeriesAnalysis/blob/main/notebooks/00_data_preprocessing.ipynb)

