window.StatModels = (() => {
  // ---------- helpers ----------
  const dot = (a,b)=> a.reduce((s,v,i)=> s+v*b[i],0);
  const transpose = (A)=> A[0].map((_,j)=> A.map(row=>row[j]));
  const matmul = (A,B)=> {
    const Bt = transpose(B);
    return A.map(row => Bt.map(col => dot(row, col)));
  };
  const matvec = (A,v)=> A.map(row=> dot(row,v));

  // Solve linear system A x = b (Gaussian elimination)
  const solve = (A, b) => {
    const n = A.length;
    const M = A.map((row,i)=> row.concat([b[i]]));
    for (let i=0;i<n;i++){
      // pivot
      let piv = i;
      for (let r=i+1;r<n;r++) if (Math.abs(M[r][i])>Math.abs(M[piv][i])) piv=r;
      const tmp = M[i]; M[i]=M[piv]; M[piv]=tmp;
      let div = M[i][i]; if (Math.abs(div) < 1e-9) div = 1e-9;
      for (let j=i;j<=n;j++) M[i][j] /= div;
      for (let r=0;r<n;r++){
        if (r===i) continue;
        const factor = M[r][i];
        for (let j=i;j<=n;j++) M[r][j] -= factor*M[i][j];
      }
    }
    return M.map(row=> row[n]);
  };

  // ---------- AR fit/predict ----------
  const fitAR = (y, p=2) => {
    const X = [], Y = [];
    for (let t=p;t<y.length;t++){
      X.push([1, ...Array.from({length:p}, (_,k)=> y[t-k-1])]);
      Y.push(y[t]);
    }
    const Xt = transpose(X);
    const beta = solve(matmul(Xt, X), matvec(Xt, Y)); // [b0, b1..bp]
    return { beta, p };
  };
  const predictAR = (model, yInit, nSteps) => {
    const { beta, p } = model;
    const out = [];
    const buf = yInit.slice(-p);
    for (let i=0;i<nSteps;i++){
      const x = [1, ...buf.slice().reverse()];
      const yhat = dot(beta, x);
      out.push(yhat);
      buf.shift(); buf.push(yhat);
    }
    return out;
  };

  // ---------- MA naive ----------
  const predictMA = (y, q=2, nSteps=1) => {
    const out=[]; const buf = y.slice();
    for (let i=0;i<nSteps;i++){
      const win = buf.slice(-q);
      const yhat = win.reduce((a,b)=>a+b,0)/Math.max(win.length,1);
      out.push(yhat); buf.push(yhat);
    }
    return out;
  };

  // ---------- wrappers (7:3 split) ----------
  const split73 = (dates, y) => {
    const n = y.length, cut = Math.floor(n*0.7);
    return { datesTr: dates.slice(0,cut), yTr: y.slice(0,cut), datesTe: dates.slice(cut), yTe: y.slice(cut) };
  };

  const runAR = (dates, y, p=2) => {
    const { datesTr, yTr, datesTe, yTe } = split73(dates, y);
    const model = fitAR(yTr, p);
    const yHat = predictAR(model, yTr, yTe.length);
    return { labels: datesTe, yTrue: yTe, yHat };
  };

  const runMA = (dates, y, q=2) => {
    const { datesTr, yTr, datesTe, yTe } = split73(dates, y);
    const yHat = predictMA(yTr, q, yTe.length);
    return { labels: datesTe, yTrue: yTe, yHat };
  };

  const runARMA = (dates, y, p=2, q=2) => {
    const { datesTr, yTr, datesTe, yTe } = split73(dates, y);
    const model = fitAR(yTr, p);
    const arPred = predictAR(model, yTr, yTe.length);
    // 간단히: 훈련 잔차 평균을 보정값으로 추가(naive MA)
    const X = [], Y = [];
    for (let t=p;t<yTr.length;t++){
      X.push([1, ...Array.from({length:p}, (_,k)=> yTr[t-k-1])]);
      Y.push(yTr[t]);
    }
    const Xt = transpose(X), beta = model.beta;
    const yFit = X.map(x=> dot(beta, x));
    const resid = Y.map((v,i)=> v - yFit[i]);
    const bias = resid.reduce((a,b)=>a+b,0)/Math.max(resid.length,1);
    const yHat = arPred.map(v=> v + bias);
    return { labels: datesTe, yTrue: yTe, yHat };
  };

  const difference = (y, d=1) => {
    let out = y.slice();
    for (let k=0;k<d;k++) out = out.slice(1).map((v,i)=> v - out[i]);
    return out;
  };

  const integrate = (yDiff, lastOrig, d=1) => {
    let out = yDiff.slice();
    let base = lastOrig;
    for (let k=0;k<d;k++){
      const tmp = [];
      for (let i=0;i<out.length;i++){
        base = base + out[i];
        tmp.push(base);
      }
      out = tmp; // now at one lower diff order
    }
    return out;
  };

  const runARIMA = (dates, y, p=2, d=1, q=2) => {
    const { datesTr, yTr, datesTe, yTe } = split73(dates, y);
    const yTrDiff = d>0 ? difference(yTr, d) : yTr.slice();
    const model = fitAR(yTrDiff, p);
    const yDiffHat = predictAR(model, yTrDiff, yTe.length);
    const lastOrig = yTr.slice(-d)[0] ?? yTr[yTr.length-1];
    const yHat = d>0 ? integrate(yDiffHat, lastOrig, d) : yDiffHat;
    return { labels: datesTe, yTrue: yTe, yHat };
  };

  const seasonalDifference = (y, s=0) => {
    if (!s || s<=0) return y.slice();
    const out = [];
    for (let i=s;i<y.length;i++) out.push(y[i]-y[i-s]);
    return out;
  };
  const seasonalIntegrate = (yDiff, history, s=0) => {
    if (!s || s<=0) return yDiff.slice();
    const out = []; const buf = history.slice(); // use last s original
    for (let i=0;i<yDiff.length;i++){
      const yhat = yDiff[i] + (buf[buf.length - s] ?? buf[buf.length-1] ?? 0);
      out.push(yhat);
      buf.push(yhat);
    }
    return out;
  };

  const runSARIMA = (dates, y, p=2, d=1, q=2, s=0) => {
    const { datesTr, yTr, datesTe, yTe } = split73(dates, y);
    const yTrSd = seasonalDifference(yTr, s);
    const yTrSdd = d>0 ? difference(yTrSd, d) : yTrSd;
    const model = fitAR(yTrSdd, p);
    const ySddHat = predictAR(model, yTrSdd, yTe.length);
    const lastSeasonHist = yTr.slice(-s) || yTr.slice(-1);
    const ySdHat = d>0 ? integrate(ySddHat, yTrSd.slice(-1)[0] ?? yTr[yTr.length-1], d) : ySddHat;
    const yHat = seasonalIntegrate(ySdHat, lastSeasonHist, s);
    return { labels: datesTe, yTrue: yTe, yHat };
  };

  return { runAR, runMA, runARMA, runARIMA, runSARIMA };
})();