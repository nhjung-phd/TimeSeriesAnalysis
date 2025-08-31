// js/models/stat_models.js
// 외부 패키지 없이 AR/MA/ARMA/ARIMA/SARIMA 동작 (7:3 split)
// 의존: Chart.js, window.TS_STATE (app.js에서 채움), window.TSData (data.js 유틸)

(function () {
  const StatModels = {};
  window.StatModels = StatModels;

  // ---------- 유틸 ----------
  const mean = arr => arr.reduce((a,b)=>a+b,0)/arr.length;

  function mae(y, yhat){
    let s=0, n=Math.min(y.length,yhat.length);
    for(let i=0;i<n;i++) s+=Math.abs(y[i]-yhat[i]);
    return s/n;
  }
  function rmse(y, yhat){
    let s=0, n=Math.min(y.length,yhat.length);
    for(let i=0;i<n;i++){ const e=y[i]-yhat[i]; s+=e*e; }
    return Math.sqrt(s/n);
  }

  function getSeries(){
    if (!window.TS_STATE?.dates?.length || !window.TS_STATE?.close?.length){
      throw new Error('시계열이 비어 있습니다.');
    }
    return { dates: TS_STATE.dates, close: TS_STATE.close };
  }

  // 최소자승 AR(p) 계수추정
  function fitAR(train, p){
    // X: [y_{t-1}..y_{t-p}], y: y_t
    const n = train.length;
    const rows = n - p;
    const X = Array.from({length: rows}, (_,i)=> train.slice(i, i+p).reverse());
    const y = train.slice(p);

    // normal equation: beta = (X'X)^(-1) X'y
    const XT = transpose(X);
    const XTX = matMul(XT, X);
    const XTy = vecMul(XT, y);
    const beta = solve(XTX, XTy); // p x 1
    return beta; // [phi1..phip]
  }

  // 선형대수 보조
  function transpose(A){ return A[0].map((_,j)=>A.map(row=>row[j])); }
  function matMul(A,B){
    const r=A.length, c=B[0].length, k=B.length;
    const out=Array.from({length:r},()=>Array(c).fill(0));
    for(let i=0;i<r;i++){
      for(let j=0;j<c;j++){
        let s=0;
        for(let t=0;t<k;t++) s+=A[i][t]*B[t][j];
        out[i][j]=s;
      }
    }
    return out;
  }
  function vecMul(A, v){
    // A (m x n), v (n)
    return A.map(row => row.reduce((s, a, i)=> s + a*v[i], 0));
  }
  function solve(A, b){
    // 가우스 소거 (작은 p,q에 충분)
    const n = A.length;
    // 확장행렬
    const M = A.map((row,i)=> row.concat([b[i]]));
    for(let i=0;i<n;i++){
      // pivot
      let maxR=i;
      for(let r=i+1;r<n;r++) if(Math.abs(M[r][i])>Math.abs(M[maxR][i])) maxR=r;
      if (maxR!==i){ const tmp=M[i]; M[i]=M[maxR]; M[maxR]=tmp; }
      const piv = M[i][i] || 1e-12;
      for(let j=i;j<=n;j++) M[i][j]/=piv;
      for(let r=0;r<n;r++){
        if (r===i) continue;
        const f=M[r][i];
        for(let j=i;j<=n;j++) M[r][j]-=f*M[i][j];
      }
    }
    return M.map(row=>row[n]);
  }

  // 단순 SMA(q) 기반 one-step 예측
  function predictMA(train, testLen, q){
    const full = train.slice();
    const preds = [];
    for(let t=0;t<testLen;t++){
      const base = full.slice(-q);
      const yhat = mean(base);
      preds.push(yhat);
      full.push(yhat);
    }
    return preds;
  }

  // AR(p) one-step 예측 (계수로 순차 예측)
  function predictAR(train, test, p){
    const phi = fitAR(train, p);
    const history = train.slice();
    const preds = [];
    for(let t=0;t<test.length;t++){
      let yhat = 0;
      for(let i=1;i<=p;i++) yhat += phi[i-1] * history[history.length - i];
      preds.push(yhat);
      history.push(test[t]); // one-step ground truth로 업데이트
    }
    return preds;
  }

  // ARMA(p,q) 간이: AR 예측 + 최근 q 잔차 평균 가산
  function predictARMA(train, test, p, q){
    const phi = p>0 ? fitAR(train, p) : [];
    const history = train.slice();
    // 학습구간 잔차 확보
    let resHist = [];
    if (p>0){
      for(let t=p;t<history.length;t++){
        let yhat=0;
        for(let i=1;i<=p;i++) yhat+=phi[i-1]*history[t-i];
        resHist.push(history[t]-yhat);
      }
    } else {
      // AR없으면 잔차=0
      resHist = new Array(history.length).fill(0);
    }
    const preds=[];
    for(let t=0;t<test.length;t++){
      let yhat=0;
      if (p>0){
        for(let i=1;i<=p;i++) yhat+=phi[i-1]*history[history.length - i];
      } else {
        yhat = history[history.length-1]; // 아주 단순한 fallback
      }
      const epsMean = q>0 ? mean(resHist.slice(-q)) : 0;
      yhat += epsMean;
      preds.push(yhat);
      // 다음 스텝을 위해 잔차 갱신(실측 기반 one-step)
      const actualNext = test[t];
      const resid = actualNext - yhat;
      resHist.push(resid);
      history.push(actualNext);
    }
    return preds;
  }

  // d차 차분
  function diffN(arr, d){
    let out = arr.slice();
    for(let k=0;k<d;k++){
      out = TSData.diff(out, 1);
    }
    return out;
  }

  // 누적 복원 (누적합으로 원상복구) — 마지막 기준값들을 사용
  function undiffN(lastValues, diffs, d){
    // d≥1 가정. lastValues: 원시 y의 마지막 d개(역복원 기준)
    // d=1: y_t = y_{t-1} + diff_t
    // d>1: 반복 복원 (간이)
    let restored = [];
    if (d===0) return diffs.slice();
    // 1차 복원
    let prev = lastValues[lastValues.length-1];
    const first = diffs.map((dv)=>{ prev = prev + dv; return prev; });

    if (d===1) return first;
    // d>1이면 단순히 이 과정을 d번 반복 (근사)
    let base = lastValues.slice(lastValues.length-1); // 최근 1개만 이어붙여도 순차 복원 가능
    let cur = diffs.slice();
    for(let k=0;k<d;k++){
      let p = base[base.length-1];
      cur = cur.map((dv)=>{ p = p + dv; return p; });
      base = base.concat(cur);
    }
    // 위 루프가 first보다 길 수 있어 first 반환이 더 안전하지만,
    // 간이 구현이라 first를 반환
    return first;
  }

  // 계절차분(s)
  function sdiff(arr, s){
    const out=[];
    for(let i=s;i<arr.length;i++) out.push(arr[i]-arr[i-s]);
    return out;
  }
  // 계절 복원(간이): 마지막 s개를 기준으로 seasonal add-back
  function undiffS(lastSeason, diffs, s){
    const out=[];
    const hist=lastSeason.slice(); // 길이 s
    for(let i=0;i<diffs.length;i++){
      const y = diffs[i] + hist[hist.length - s];
      out.push(y);
      hist.push(y);
    }
    return out;
  }

  // 공용 차트/지표 렌더
  let statChart=null;
  function renderChartAndMetrics(dates, y, splitIdx, preds, name){
    const padded = new Array(y.length).fill(null);
    for(let i=0;i<preds.length;i++) padded[splitIdx+i] = preds[i];

    const ctx = document.getElementById('chart-stat').getContext('2d');
    if (statChart) statChart.destroy();
    statChart = new Chart(ctx,{
      type:'line',
      data:{
        labels:dates,
        datasets:[
          {label:'실제', data:y, borderColor:'rgb(30,64,175)', tension:.12},
          {label:name, data:padded, borderColor:'rgb(220,38,38)', borderDash:[6,6], tension:.12}
        ]
      },
      options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}}
    });

    const maeV = mae(y.slice(splitIdx), preds).toFixed(3);
    const rmseV = rmse(y.slice(splitIdx), preds).toFixed(3);
    const mEl = document.getElementById('stat-metrics');
    if (mEl) mEl.textContent = `MAE: ${maeV} / RMSE: ${rmseV}`;
  }

  // ---------- 공개 API ----------
  StatModels.runAR = async function(p=2){
    const {dates, close:y} = getSeries();
    const split = Math.floor(y.length*0.7);
    const train = y.slice(0, split);
    const test  = y.slice(split);
    const preds = predictAR(train, test, Math.max(1, p));
    renderChartAndMetrics(dates, y, split, preds, `AR(${p})`);
  };

  StatModels.runMA = async function(q=2){
    const {dates, close:y} = getSeries();
    const split = Math.floor(y.length*0.7);
    const train = y.slice(0, split);
    const test  = y.slice(split);
    const preds = predictMA(train, test.length, Math.max(1, q));
    renderChartAndMetrics(dates, y, split, preds, `MA(${q}) (SMA)`);
  };

  StatModels.runARMA = async function(p=2, q=2){
    const {dates, close:y} = getSeries();
    const split = Math.floor(y.length*0.7);
    const train = y.slice(0, split);
    const test  = y.slice(split);
    const preds = predictARMA(train, test, Math.max(0,p), Math.max(0,q));
    renderChartAndMetrics(dates, y, split, preds, `ARMA(${p},${q}) (approx)`);
  };

  StatModels.runARIMA = async function(p=2, d=1, q=2){
    const {dates, close:y} = getSeries();
    const split = Math.floor(y.length*0.7);
    const train = y.slice(0, split);
    const test  = y.slice(split);

    const dN = Math.max(0, d|0);
    const yDiff = dN>0 ? diffN(y, dN) : y.slice();
    const splitDiff = yDiff.length - test.length; // 차분 후 길이 보정

    const trainDiff = yDiff.slice(0, splitDiff);
    const testDiff  = yDiff.slice(splitDiff);

    const predsDiff = predictARMA(trainDiff, testDiff, Math.max(0,p), Math.max(0,q));

    // 원스케일 복원: 마지막 d개 원시값 사용
    const lastVals = y.slice(split- dN, split);
    const preds = dN>0 ? undiffN(lastVals, predsDiff, dN) : predsDiff;
    renderChartAndMetrics(dates, y, split, preds, `ARIMA(${p},${d},${q}) (approx)`);
  };

  // StatModels.runSARIMA 함수를 찾아서 아래 코드로 교체해주세요.
  StatModels.runSARIMA = async function(tsState, p = 2, d = 1, q = 2, s = 0) {
    const { dates, close: y } = tsState;
    if (!dates || !y || dates.length === 0) {
      console.error("SARIMA: 데이터가 없습니다.");
      return null;
    }

    const split = Math.floor(y.length * 0.7);
    const train = y.slice(0, split);
    const test = y.slice(split);

    const dN = Math.max(0, d | 0);
    const sN = Math.max(0, s | 0);

    // 비계절 차분
    const yD = dN > 0 ? diffN(y, dN) : y.slice();

    // 계절 차분
    let yDS = yD.slice();
    let splitDSIndex = yD.length - test.length;
    let lastSeasonBase = [];
    if (sN > 0) {
      yDS = sdiff(yD, sN);
      splitDSIndex = yDS.length - (test.length);
      lastSeasonBase = yD.slice(splitDSIndex, splitDSIndex + sN);
      if (lastSeasonBase.length < sN) {
        const need = sN - lastSeasonBase.length;
        lastSeasonBase = yD.slice(splitDSIndex - need, splitDSIndex).concat(lastSeasonBase);
      }
    }

    const trainDS = yDS.slice(0, splitDSIndex);
    const coefs = fitARMA(trainDS, p, q);
    const predsDiff = predictARMA(coefs, trainDS, test.length);
    const lastVals = y.slice(split - dN, split);

    // 예측값을 원본 스케일로 복원
    let preds = predsDiff;
    if (sN > 0) {
      preds = sundiff(lastSeasonBase, predsDiff, sN).slice(sN);
    }
    if (dN > 0) {
      preds = undiffN(lastVals, preds, dN);
    }

    // 기존 renderChartAndMetrics 호출을 삭제하고, 결과를 객체로 반환합니다.
    // renderChartAndMetrics(dates, y, split, preds, `ARIMA(${p},${d},${q}) (approx)`);
    return {
      labels: dates.slice(split),
      yTrue: y.slice(split),
      yHat: preds.slice(0, test.length) // 예측 길이를 테스트 데이터 길이에 맞춤
    };
  };
})();
