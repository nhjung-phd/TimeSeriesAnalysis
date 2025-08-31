// js/models/stat_models.js  — 외부 패키지 없이 동작하는 자체 구현
// AR / MA / ARMA(근사) / ARIMA(차분+AR) / SARIMA(계절차분+AR)
// 반환형: { labels, yTrue, yHat }  // app.js의 showStat()과 호환
// 의존: 없음(Chart 사용 안 함). app.js가 그리기/지표 표시 담당.

window.StatModels = (() => {
  // ---------- 선형대수 유틸 ----------
  const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
  const transpose = (A) => A[0].map((_, j) => A.map((row) => row[j]));
  const matmul = (A, B) => {
    const Bt = transpose(B);
    return A.map((row) => Bt.map((col) => dot(row, col)));
  };
  const matvec = (A, v) => A.map((row) => dot(row, v));

  // Gaussian elimination (가우스 소거, 간단한 정규화 + 안정성을 위한 작은 I 추가)
  const solve = (A, b, ridge = 1e-8) => {
    const n = A.length;
    // XtX + λI
    const M = A.map((row, i) =>
      row.map((v, j) => (i === j ? v + ridge : v))
    );
    // 증강행렬 [A|b]
    const Aug = M.map((row, i) => row.concat([b[i]]));

    for (let i = 0; i < n; i++) {
      // pivot
      let piv = i;
      for (let r = i + 1; r < n; r++) {
        if (Math.abs(Aug[r][i]) > Math.abs(Aug[piv][i])) piv = r;
      }
      const tmp = Aug[i];
      Aug[i] = Aug[piv];
      Aug[piv] = tmp;

      let div = Aug[i][i];
      if (Math.abs(div) < 1e-12) div = 1e-12;
      for (let j = i; j <= n; j++) Aug[i][j] /= div;

      for (let r = 0; r < n; r++) {
        if (r === i) continue;
        const factor = Aug[r][i];
        for (let j = i; j <= n; j++) Aug[r][j] -= factor * Aug[i][j];
      }
    }
    return Aug.map((row) => row[n]);
  };

  // ---------- AR 학습/예측 ----------
  const fitAR = (y, p = 2) => {
    // X: [1, y_{t-1},...,y_{t-p}],  Y: y_t
    const X = [];
    const Y = [];
    for (let t = p; t < y.length; t++) {
      X.push([1, ...Array.from({ length: p }, (_, k) => y[t - k - 1])]);
      Y.push(y[t]);
    }
    // (X'X)β = X'Y
    const Xt = transpose(X);
    const XtX = matmul(Xt, X);
    const Xty = matvec(Xt, Y);
    const beta = solve(XtX, Xty); // [b0, b1..bp]
    return { beta, p };
  };

  const predictAR = (model, yInit, nSteps) => {
    const { beta, p } = model;
    const out = [];
    const buf = yInit.slice(-p);
    for (let i = 0; i < nSteps; i++) {
      const x = [1, ...buf.slice().reverse()];
      const yhat = dot(beta, x);
      out.push(yhat);
      buf.shift();
      buf.push(yhat);
    }
    return out;
  };

  // ---------- MA (naive: 최근 q개 단순 이동평균으로 근사) ----------
  const predictMA = (y, q = 2, nSteps = 1) => {
    const out = [];
    const buf = y.slice();
    for (let i = 0; i < nSteps; i++) {
      const win = buf.slice(-q);
      const yhat =
        win.reduce((a, b) => a + b, 0) / Math.max(win.length, 1);
      out.push(yhat);
      buf.push(yhat);
    }
    return out;
  };

  // ---------- 분할 ----------
  const split73 = (dates, y) => {
    const n = y.length,
      cut = Math.floor(n * 0.7);
    return {
      datesTr: dates.slice(0, cut),
      yTr: y.slice(0, cut),
      datesTe: dates.slice(cut),
      yTe: y.slice(cut),
    };
  };

  // ---------- AR ----------
  const runAR = (dates, y, p = 2) => {
    if (y.length < Math.max(20, p + 5)) {
      return { labels: [], yTrue: [], yHat: [] };
    }
    const { datesTr, yTr, datesTe, yTe } = split73(dates, y);
    const model = fitAR(yTr, p);
    const yHat = predictAR(model, yTr, yTe.length);
    return { labels: datesTe, yTrue: yTe, yHat };
  };

  // ---------- MA ----------
  const runMA = (dates, y, q = 2) => {
    if (y.length < Math.max(20, q + 5)) {
      return { labels: [], yTrue: [], yHat: [] };
    }
    const { datesTr, yTr, datesTe, yTe } = split73(dates, y);
    const yHat = predictMA(yTr, q, yTe.length);
    return { labels: datesTe, yTrue: yTe, yHat };
  };

  // ---------- ARMA (간이): AR 예측 + 훈련 잔차 평균으로 바이어스 보정 ----------
  const runARMA = (dates, y, p = 2, q = 2) => {
    if (y.length < Math.max(20, p + q + 5)) {
      return { labels: [], yTrue: [], yHat: [] };
    }
    const { datesTr, yTr, datesTe, yTe } = split73(dates, y);
    const model = fitAR(yTr, p);

    // 훈련 적합값
    const X = [];
    const Y = [];
    for (let t = p; t < yTr.length; t++) {
      X.push([1, ...Array.from({ length: p }, (_, k) => yTr[t - k - 1])]);
      Y.push(yTr[t]);
    }
    const yFit = X.map((x) => dot(model.beta, x));
    const resid = Y.map((v, i) => v - yFit[i]);
    const bias =
      resid.reduce((a, b) => a + b, 0) / Math.max(resid.length, 1);

    const arPred = predictAR(model, yTr, yTe.length);
    const yHat = arPred.map((v) => v + bias); // q는 간단화

    return { labels: datesTe, yTrue: yTe, yHat };
  };

  // ---------- 차분/적분 ----------
  const difference = (y, d = 1) => {
    let out = y.slice();
    for (let k = 0; k < d; k++) {
      out = out.slice(1).map((v, i) => v - out[i]);
    }
    return out;
  };

  const integrate = (diffSeries, lastTail, d = 1) => {
    // lastTail: 원시 시계열의 마지막 d개 값 (배열)
    let out = diffSeries.slice();
    let tail = lastTail.slice(); // 길이 d
    for (let k = 0; k < d; k++) {
      const tmp = [];
      let prev = tail[tail.length - 1]; // 직전 원시 값
      for (let i = 0; i < out.length; i++) {
        const val = prev + out[i];
        tmp.push(val);
        prev = val;
      }
      out = tmp;
      // 다음 차수 적분을 위해 tail 갱신
      tail = tail.slice(1).concat(tmp.slice(-1));
    }
    return out;
  };

  // ---------- ARIMA(d 차분 + AR(p)) ----------
  const runARIMA = (dates, y, p = 2, d = 1, q = 0) => {
    if (y.length < Math.max(20, p + d + q + 5)) {
      return { labels: [], yTrue: [], yHat: [] };
    }
    const { datesTr, yTr, datesTe, yTe } = split73(dates, y);
    const yTrDiff = d > 0 ? difference(yTr, d) : yTr.slice();
    const model = fitAR(yTrDiff, p);
    const diffPred = predictAR(model, yTrDiff, yTe.length);

    const lastTail = d > 0 ? yTr.slice(-d) : [yTr[yTr.length - 1]];
    const yHat = d > 0 ? integrate(diffPred, lastTail, d) : diffPred;

    return { labels: datesTe, yTrue: yTe, yHat };
  };

  // ---------- 계절 차분 ----------
  const seasonalDifference = (y, s = 0) => {
    if (!s || s <= 0) return y.slice();
    const out = [];
    for (let i = s; i < y.length; i++) out.push(y[i] - y[i - s]);
    return out;
  };

  const seasonalIntegrate = (diffS, history, s = 0) => {
    if (!s || s <= 0) return diffS.slice();
    // history: 마지막 s개 원시값
    const out = [];
    const buf = history.slice(); // 길이 s
    for (let i = 0; i < diffS.length; i++) {
      const val = buf[buf.length - s] + diffS[i];
      out.push(val);
      buf.push(val);
      if (buf.length > s) buf.shift();
    }
    return out;
  };

  // ---------- SARIMA (간이): (d차 + D=1 계절차분) 후 AR(p), q는 보정 생략 ----------
  const runSARIMA = (dates, y, p = 1, d = 1, q = 0, s = 12) => {
    if (y.length < Math.max(30, p + d + s + 5)) {
      return { labels: [], yTrue: [], yHat: [] };
    }
    const { datesTr, yTr, datesTe, yTe } = split73(dates, y);

    const y1 = d > 0 ? difference(yTr, d) : yTr.slice();
    const y2 = s > 0 ? seasonalDifference(y1, s) : y1.slice();

    const model = fitAR(y2, p);
    const y2Pred = predictAR(model, y2, yTe.length);

    // 역변환: 계절적분 → 비계절 적분
    const baseForSeasonal = (s > 0 && y1.length >= s)
      ? y1.slice(-s)
      : (y1.length ? [y1[y1.length - 1]] : [0]);

    const y1Pred = seasonalIntegrate(y2Pred, baseForSeasonal, s);

    const lastTail = d > 0 ? yTr.slice(-d) : [yTr[yTr.length - 1]];
    const yHat = d > 0 ? integrate(y1Pred, lastTail, d) : y1Pred;

    return { labels: datesTe, yTrue: yTe, yHat };
  };

  return { runAR, runMA, runARMA, runARIMA, runSARIMA };
})();
