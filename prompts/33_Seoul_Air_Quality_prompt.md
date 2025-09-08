# 📌 **서울시 대기질 데이터의 기본 통계 및 시각화 제공 프롬프트**  

이 문서는 **GPT를 활용하여 서울시 대기질 데이터의 기본 통계 및 시각화 제공 코드를 자동 생성**할 수 있도록 도와줍니다.  
아래 **프롬프트를 GPT에 입력**하면,서울시 대기질 데이터의 기본 통계 및 시각화 제공 시계열 분석 코드를 쉽게 생성할 수 있습니다. 🚀  

---

## 🛠️ **소스만들기**  
```plaintext
Python에서 TensorFlow/Keras를 사용하여 Transformer Encoder 기반 시계열 예측 모델을 구축하는 코드를 작성해줘.  
필요한 라이브러리는 pandas, numpy, matplotlib, tensorflow.keras 등이 포함되어야 해.

다음 프로그램을 혹시 만들어 줄수 있니? 이 앱은 서울시 대기질 데이터를 활용하여 시계열 데이터를 분석하고 시각화하는 도구입니다. 🌟 주요 기능 데이터 탐색: 서울시 대기질 데이터의 기본 통계 및 시각화 제공 시계열 분해: 추세(Trend), 계절성(Seasonality), 불규칙성(Irregularity) 분석 모델 비교: ARIMA/SARIMA, 지수평활법, Prophet, LSTM 등 다양한 예측 모델 지원 예측 성능 평가: RMSE, MAE, R² 등 다양한 메트릭 기반 평가 🛠️ 사용 방법 사이드바에서 데이터 업로드 또는 API 수집 옵션 선택 분석할 측정소와 변수(PM10, PM2.5 등) 선택 시계열 분석 옵션 설정 후 모델 학습 실행 결과 탭에서 다양한 모델의 예측 결과 비교 및 분석
```
```python
# -*- coding: utf-8 -*-
"""
서울시 대기질 시계열 분석/예측 대시보드 (Streamlit)

🌟 주요 기능
- 데이터 수집: CSV 업로드 또는 서울열린데이터광장 API (사용자 키 필요)
- 데이터 탐색: 기본 통계/결측치/시각화
- 시계열 분해: Trend/Seasonal/Residual
- 모델 비교: ARIMA/SARIMA, Exponential Smoothing, Prophet, LSTM
- 성능 평가: MAE, RMSE, R²

실행 방법
$ pip install streamlit pandas numpy matplotlib plotly scikit-learn statsmodels pmdarima prophet yfinance tensorflow
$ streamlit run seoul_air_quality_timeseries_app.py

주의
- Prophet 설치가 OS/환경에 따라 "prophet" 또는 "fbprophet" 패키지명일 수 있습니다.
- 서울시 API 사용 시, 본 파일 상단의 API_KEY 값을 사용자 키로 변경하세요.


import os
import io
import time
import json
import math
import warnings
from typing import Tuple, Dict, Optional

import numpy as np
import pandas as pd
import streamlit as st
import matplotlib.pyplot as plt
import plotly.express as px
import plotly.graph_objects as go

from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import MinMaxScaler

warnings.filterwarnings("ignore")

# =============================
# 글로벌 설정
# =============================
st.set_page_config(
    page_title="서울시 대기질 시계열 분석",
    page_icon="🌫️",
    layout="wide",
)

API_KEY = os.getenv("SEOUL_OPEN_API_KEY", "PUT_YOUR_API_KEY_HERE")
API_ENDPOINT = "http://openapi.seoul.go.kr:8088/{key}/json/TimeAverageAirQuality/{start}/{end}/{date}/{station}"

# =============================
# 유틸 함수
# =============================
@st.cache_data(show_spinner=False)
def read_csv(content: bytes, encoding: str = "utf-8") -> pd.DataFrame:
    try:
        return pd.read_csv(io.BytesIO(content), encoding=encoding)
    except Exception:
        return pd.read_csv(io.BytesIO(content), encoding="cp949")


def safe_to_datetime(s, utc=False):
    x = pd.to_datetime(s, errors="coerce")
    if utc:
        try:
            x = x.dt.tz_localize(None)
        except Exception:
            pass
    return x


def train_test_split_series(y: pd.Series, test_size: int) -> Tuple[pd.Series, pd.Series]:
    if test_size <= 0:
        return y, pd.Series(dtype=float)
    return y.iloc[:-test_size], y.iloc[-test_size:]


def metrics_dict(y_true, y_pred) -> Dict[str, float]:
    y_true = np.asarray(y_true, dtype=float)
    y_pred = np.asarray(y_pred, dtype=float)
    mae = mean_absolute_error(y_true, y_pred)
    mse = mean_squared_error(y_true, y_pred)
    rmse = float(np.sqrt(mse))
    r2 = r2_score(y_true, y_pred)
    return {"MAE": mae, "RMSE": rmse, "R2": r2}


def plot_actual_vs_pred(df_true: pd.DataFrame, df_pred: pd.DataFrame, date_col: str, y_col: str, model_name: str):
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=df_true[date_col], y=df_true[y_col], name="Actual", mode="lines"))
    fig.add_trace(go.Scatter(x=df_pred[date_col], y=df_pred["yhat"], name=f"Predicted - {model_name}", mode="lines"))
    fig.update_layout(title=f"Actual vs Predicted ({model_name})", xaxis_title="Date", yaxis_title=y_col, height=420)
    st.plotly_chart(fig, use_container_width=True)


# =============================
# 데이터 수집
# =============================
@st.cache_data(show_spinner=True)
def fetch_seoul_air_quality(station: str, start_date: str, end_date: str, pollutant: str) -> pd.DataFrame:
    """
    서울 열린데이터광장 예시 Endpoint를 가정합니다. 실제 운영과 스키마는 사용자 키/데이터셋에 맞춰 조정 필요.
    반환 컬럼 예시: [date, station, PM10, PM25, O3, NO2, CO, SO2]
    """
    # 본 API는 예시입니다. 데이터셋마다 스키마가 다르므로 사용자 맞춤 수정이 필요합니다.
    # 안전하게는 업로드 CSV를 권장합니다.
    try:
        import requests
        rows = []
        # 단순 예시: 하루 단위 루프 호출 (실서버 과금/쿼터 주의)
        dates = pd.date_range(start=start_date, end=end_date, freq="D")
        for d in dates:
            url = API_ENDPOINT.format(
                key=API_KEY,
                start=1,
                end=1000,
                date=d.strftime("%Y%m%d"),
                station=station,
            )
            r = requests.get(url, timeout=10)
            if r.status_code != 200:
                continue
            js = r.json()
            # 사용자의 실제 스키마에 맞게 파싱 로직 변경 필요
            # 여기서는 가상의 JSON 구조를 가정합니다.
            data = js.get("TimeAverageAirQuality", {}).get("row", [])
            for item in data:
                rows.append(item)
        df = pd.DataFrame(rows)
        # 표준화 예시
        if not df.empty:
            # 컬럼 존재 가정
            rename_map = {
                "MSRDT": "date",
                "MSRSTE_NM": "station",
                "PM10": "PM10",
                "PM25": "PM2.5",
                "O3": "O3",
                "NO2": "NO2",
                "CO": "CO",
                "SO2": "SO2",
            }
            df = df.rename(columns=rename_map)
            df["date"] = safe_to_datetime(df["date"])  # YYYY-MM-DD HH:MM
            df = df.sort_values("date").dropna(subset=[pollutant])
        return df
    except Exception as e:
        st.warning(f"API 수집 실패: {e}\nCSV 업로드를 권장합니다.")
        return pd.DataFrame()


# =============================
# 시계열 분해
# =============================

def decompose_series(df: pd.DataFrame, date_col: str, y_col: str, model: str = "additive", period: Optional[int] = None):
    from statsmodels.tsa.seasonal import seasonal_decompose
    s = df.set_index(date_col)[y_col].asfreq("D")  # 일단위 빈도 가정
    s = s.interpolate(limit_direction="both")
    result = seasonal_decompose(s, model=model, period=period)
    figs = []
    for name, comp in zip(["Observed", "Trend", "Seasonal", "Residual"], [s, result.trend, result.seasonal, result.resid]):
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=comp.index, y=comp.values, mode="lines", name=name))
        fig.update_layout(title=name, height=300)
        figs.append(fig)
    return figs


# =============================
# 모델: ARIMA/SARIMA
# =============================

def fit_arima(df: pd.DataFrame, date_col: str, y_col: str, seasonal: bool, m: int, test_size: int):
    try:
        import pmdarima as pm
    except Exception:
        st.error("pmdarima가 설치되어 있지 않습니다. pip install pmdarima 후 다시 시도하세요.")
        return None

    y = df[y_col].astype(float).values
    train, test = y[:-test_size], y[-test_size:]

    if seasonal:
        model = pm.auto_arima(
            train,
            seasonal=True,
            m=m,
            stepwise=True,
            suppress_warnings=True,
            error_action="ignore",
            trace=False,
        )
    else:
        model = pm.auto_arima(
            train,
            seasonal=False,
            stepwise=True,
            suppress_warnings=True,
            error_action="ignore",
            trace=False,
        )

    preds = model.predict(n_periods=test_size)
    met = metrics_dict(test, preds)
    # 예측 시계열 프레임
    pred_df = df[[date_col]].iloc[-test_size:].copy()
    pred_df["yhat"] = preds
    return model, pred_df, met


# =============================
# 모델: Exponential Smoothing
# =============================

def fit_expsmoothing(df: pd.DataFrame, date_col: str, y_col: str, seasonal: bool, m: int, test_size: int):
    from statsmodels.tsa.holtwinters import ExponentialSmoothing

    y = df[y_col].astype(float).values
    train, test = y[:-test_size], y[-test_size:]

    if seasonal:
        model = ExponentialSmoothing(train, trend="add", seasonal="add", seasonal_periods=m)
    else:
        model = ExponentialSmoothing(train, trend="add", seasonal=None)

    fit = model.fit(optimized=True)
    preds = fit.forecast(test_size)
    met = metrics_dict(test, preds)
    pred_df = df[[date_col]].iloc[-test_size:].copy()
    pred_df["yhat"] = preds
    return fit, pred_df, met


# =============================
# 모델: Prophet
# =============================

def fit_prophet(df: pd.DataFrame, date_col: str, y_col: str, use_log: bool, test_size: int, weekly=True, yearly=True):
    # prophet import 호환 처리
    try:
        from prophet import Prophet
    except Exception:
        try:
            from fbprophet import Prophet  # type: ignore
        except Exception:
            st.error("prophet/fbprophet가 설치되어 있지 않습니다. pip install prophet 후 다시 시도하세요.")
            return None

    d = df[[date_col, y_col]].rename(columns={date_col: "ds", y_col: "y"}).copy()
    if use_log:
        d["y"] = np.log1p(d["y"].astype(float))

    train, test = d.iloc[:-test_size].copy(), d.iloc[-test_size:].copy()

    m = Prophet(weekly_seasonality=weekly, yearly_seasonality=yearly, daily_seasonality=False, changepoint_prior_scale=0.1)
    m.add_country_holidays(country_name="KR")
    m.fit(train)

    f = test[["ds"]].copy()
    fc = m.predict(f)

    y_true = test["y"].values
    y_pred = fc["yhat"].values
    if use_log:
        y_true = np.expm1(y_true)
        y_pred = np.expm1(y_pred)

    met = metrics_dict(y_true, y_pred)
    pred_df = pd.DataFrame({"ds": test["ds"], "yhat": y_pred})
    pred_df = pred_df.rename(columns={"ds": date_col})
    return m, pred_df, met


# =============================
# 모델: LSTM (간단 구현)
# =============================

def make_sliding_window(arr: np.ndarray, look_back: int) -> Tuple[np.ndarray, np.ndarray]:
    X, y = [], []
    for i in range(len(arr) - look_back):
        X.append(arr[i : i + look_back])
        y.append(arr[i + look_back])
    X = np.array(X)
    y = np.array(y)
    return X, y


def fit_lstm(df: pd.DataFrame, date_col: str, y_col: str, look_back: int, epochs: int, batch: int, test_size: int):
    try:
        import tensorflow as tf
        from tensorflow.keras import layers, models
    except Exception:
        st.error("TensorFlow가 설치되어 있지 않습니다. pip install tensorflow 후 다시 시도하세요.")
        return None

    values = df[y_col].astype(float).values.reshape(-1, 1)
    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(values)

    X, y = make_sliding_window(scaled.flatten(), look_back)
    X = X.reshape((X.shape[0], X.shape[1], 1))

    X_train, X_test = X[:-test_size], X[-test_size:]
    y_train, y_test = y[:-test_size], y[-test_size:]

    model = models.Sequential([
        layers.Input(shape=(look_back, 1)),
        layers.LSTM(64, return_sequences=True),
        layers.Dropout(0.2),
        layers.LSTM(32),
        layers.Dense(1)
    ])
    model.compile(optimizer="adam", loss="mse")
    with st.spinner("LSTM 학습 중..."):
        model.fit(X_train, y_train, epochs=epochs, batch_size=batch, verbose=0, validation_data=(X_test, y_test))

    preds_scaled = model.predict(X_test, verbose=0).flatten()
    preds = scaler.inverse_transform(preds_scaled.reshape(-1, 1)).flatten()
    y_true = scaler.inverse_transform(y_test.reshape(-1, 1)).flatten()

    met = metrics_dict(y_true, preds)
    pred_df = df[[date_col]].iloc[-test_size:].copy()
    pred_df["yhat"] = preds
    return model, pred_df, met


# =============================
# 앱 UI
# =============================

def main():
    st.title("🌫️ 서울시 대기질 시계열 분석 & 예측")
    st.caption("CSV 업로드 또는 API 수집 후, 다양한 모델로 예측하고 성능을 비교하세요.")

    with st.sidebar:
        st.header("데이터 입력")
        src = st.radio("데이터 소스", ["CSV 업로드", "서울시 API"], horizontal=True)

        default_pollutants = ["PM10", "PM2.5", "O3", "NO2", "CO", "SO2"]

        if src == "CSV 업로드":
            file = st.file_uploader("CSV 파일 업로드", type=["csv"])
            date_col = st.text_input("날짜 컬럼명", value="date")
            station_col = st.text_input("측정소 컬럼명", value="station")
            pollutant = st.selectbox("변수 선택", options=default_pollutants, index=0)
        else:
            st.info("API 사용 시, 환경변수 SEOUL_OPEN_API_KEY 또는 코드 상단 API_KEY에 키를 넣어주세요.")
            station = st.text_input("측정소명 (예: 종로구)", value="종로구")
            start_date = st.date_input("시작일", value=pd.to_datetime("2024-01-01").date())
            end_date = st.date_input("종료일", value=pd.to_datetime("today").date())
            pollutant = st.selectbox("변수 선택", options=default_pollutants, index=0)

        st.divider()
        st.header("시계열 설정")
        test_size = st.number_input("테스트 기간(포인트 수)", min_value=7, max_value=180, value=30, step=1)
        seasonal = st.checkbox("계절성 사용 (ARIMA/ES)", value=True)
        m = st.number_input("계절 주기 m (일 단위)", min_value=1, max_value=365, value=7)

        st.divider()
        st.header("모델 선택")
        use_arima = st.checkbox("ARIMA/SARIMA", value=True)
        use_es = st.checkbox("Exponential Smoothing", value=True)
        use_prophet = st.checkbox("Prophet", value=True)
        use_lstm = st.checkbox("LSTM", value=False)

        if use_prophet:
            use_log = st.checkbox("Prophet 로그변환", value=True)
        else:
            use_log = False

        if use_lstm:
            look_back = st.number_input("LSTM look_back", min_value=5, max_value=60, value=20)
            epochs = st.number_input("LSTM epochs", min_value=5, max_value=200, value=50)
            batch = st.number_input("LSTM batch_size", min_value=8, max_value=256, value=32)
        else:
            look_back = epochs = batch = None

    # 데이터 로딩
    df = pd.DataFrame()
    if src == "CSV 업로드" and file is not None:
        df = read_csv(file.getvalue())
        # 표준 컬럼명 체크
        if date_col not in df.columns:
            st.error(f"CSV에 '{date_col}' 컬럼이 없습니다.")
            return
        if pollutant not in df.columns:
            st.error(f"CSV에 '{pollutant}' 컬럼이 없습니다.")
            return
        if station_col not in df.columns:
            st.warning(f"CSV에 '{station_col}' 컬럼이 없어 전체 데이터를 사용합니다.")
            df[station_col] = "UNKNOWN"
        df = df[[date_col, station_col, pollutant]].copy()
        df[date_col] = safe_to_datetime(df[date_col], utc=True)
        df = df.dropna(subset=[date_col, pollutant]).sort_values(date_col)
    elif src == "서울시 API":
        df = fetch_seoul_air_quality(
            station=station,
            start_date=str(start_date),
            end_date=str(end_date),
            pollutant=pollutant,
        )
        if df.empty:
            st.stop()
        date_col = "date"
        station_col = "station"
    else:
        st.info("사이드바에서 CSV를 업로드하거나 API 옵션을 선택하세요.")
        st.stop()

    st.subheader("데이터 미리보기")
    st.dataframe(df.head(20), use_container_width=True)

    st.subheader("기본 통계")
    c1, c2, c3 = st.columns(3)
    with c1:
        st.metric("기간", f"{df[date_col].min().date()} ~ {df[date_col].max().date()}")
    with c2:
        st.metric("관측치 수", f"{len(df):,}")
    with c3:
        st.metric("결측치 수", f"{df[pollutant].isna().sum():,}")

    st.subheader("시각화")
    line_fig = px.line(df, x=date_col, y=pollutant, color=station_col if station_col in df.columns else None, title=f"{pollutant} 시계열")
    st.plotly_chart(line_fig, use_container_width=True)

    with st.expander("히스토그램 / 상자그림"):
        c1, c2 = st.columns(2)
        with c1:
            st.plotly_chart(px.histogram(df, x=pollutant, nbins=40, title="분포"), use_container_width=True)
        with c2:
            st.plotly_chart(px.box(df, y=pollutant, points="suspectedoutliers", title="상자그림"), use_container_width=True)

    # 특정 측정소 필터 옵션 (CSV에 station_col 있는 경우)
    if station_col in df.columns:
        stations = sorted(df[station_col].dropna().unique().tolist())
        sel_station = st.selectbox("분석할 측정소", options=stations)
        dfx = df[df[station_col] == sel_station].copy()
    else:
        sel_station = "ALL"
        dfx = df.copy()

    dfx = dfx.dropna(subset=[pollutant]).sort_values(date_col)

    # 시계열 분해
    st.subheader("시계열 분해")
    try:
        figs = decompose_series(dfx[[date_col, pollutant]], date_col, pollutant, model="additive", period=m if seasonal else None)
        for fig in figs:
            st.plotly_chart(fig, use_container_width=True)
    except Exception as e:
        st.warning(f"시계열 분해 실패: {e}")

    # 모델 학습 & 비교
    st.subheader("모델 학습 및 비교")
    if len(dfx) <= test_size + 10:
        st.error("데이터가 충분하지 않습니다. 테스트 구간 + 10 이상의 관측치가 필요합니다.")
        st.stop()

    results = []  # (name, pred_df, metrics)

    # 공통 표준화 프레임
    std_df = dfx[[date_col, pollutant]].rename(columns={pollutant: "y"}).copy()

    # ARIMA/SARIMA
    if use_arima:
        with st.spinner("ARIMA/SARIMA 학습 중..."):
            out = fit_arima(std_df, date_col, "y", seasonal=seasonal, m=int(m), test_size=int(test_size))
        if out is not None:
            model, pred_df, met = out
            results.append(("ARIMA/SARIMA", pred_df, met))
            plot_actual_vs_pred(std_df.iloc[-test_size:], pred_df, date_col, "y", "ARIMA/SARIMA")

    # Exponential Smoothing
    if use_es:
        with st.spinner("Exponential Smoothing 학습 중..."):
            out = fit_expsmoothing(std_df, date_col, "y", seasonal=seasonal, m=int(m), test_size=int(test_size))
        if out is not None:
            model, pred_df, met = out
            results.append(("ExpSmoothing", pred_df, met))
            plot_actual_vs_pred(std_df.iloc[-test_size:], pred_df, date_col, "y", "ExpSmoothing")

    # Prophet
    if use_prophet:
        with st.spinner("Prophet 학습 중..."):
            out = fit_prophet(std_df, date_col, "y", use_log=use_log, test_size=int(test_size))
        if out is not None:
            model, pred_df, met = out
            results.append(("Prophet", pred_df, met))
            plot_actual_vs_pred(std_df.iloc[-test_size:], pred_df, date_col, "y", "Prophet")

    # LSTM
    if use_lstm:
        with st.spinner("LSTM 학습 중..."):
            out = fit_lstm(std_df, date_col, "y", look_back=int(look_back), epochs=int(epochs), batch=int(batch), test_size=int(test_size))
        if out is not None:
            model, pred_df, met = out
            results.append(("LSTM", pred_df, met))
            plot_actual_vs_pred(std_df.iloc[-test_size:], pred_df, date_col, "y", "LSTM")

    # 성능 비교 테이블
    if results:
        st.subheader("성능 비교 (테스트 구간)")
        rows = []
        for name, _, met in results:
            row = {"Model": name}
            row.update(met)
            rows.append(row)
        score_df = pd.DataFrame(rows).sort_values("RMSE")
        st.dataframe(score_df, use_container_width=True)

        # 종합 비교 플롯 (겹쳐 보기)
        st.subheader("예측 결과 겹쳐 보기")
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=std_df.iloc[-test_size:][date_col], y=std_df.iloc[-test_size:]["y"], name="Actual", mode="lines"))
        for name, pred_df, _ in results:
            fig.add_trace(go.Scatter(x=pred_df[date_col], y=pred_df["yhat"], name=name, mode="lines"))
        fig.update_layout(title="Test Window Forecast Comparison", xaxis_title="Date", yaxis_title=pollutant, height=500)
        st.plotly_chart(fig, use_container_width=True)

    st.success("완료! 사이드바 옵션을 변경해 다른 조합도 실험해 보세요.")


if __name__ == "__main__":
    main()

```