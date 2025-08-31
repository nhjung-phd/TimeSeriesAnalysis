// js/models/stat_models.js
// AR / MA / ARMA / ARIMA / SARIMA (7:3 split)
// 의존: Chart.js, TS_STATE (app.js), TSData (data.js)

(function () {
  const StatModels = {};
  window.StatModels = StatModels;

  // ---------- 유틸 ----------
  const mean = arr => arr.reduce((a,b)=>a+b,0)/arr.length;
  function mae(y, yhat){ let s=0, n=Math.min(y.length,yhat.length); for(let i=0;i<n;i++) s+=Math.abs(y[i]-yhat[i]); return s/n; }
  function rmse(y, yhat){ let s=0, n=Math.min(y.length,yhat.length); for(let i=0;i<n;i++){ const e=y[i]-yhat[i]; s+=e*e; } return Math.sqrt(s/n); }

  function getSeries(){
    if (!window.TS_STATE?.dates?.length || !window.TS_STATE?.close?.length){
      throw new Error('시계열이 비어 있습니다.');
    }
    return { dates: TS_STATE.dates, close: TS_STATE.close };
  }

  // ---------- 선형대수 도우미 ----------
  function transpose(A){ return A[0].map((_,j)=>A.map(row=>row[j])); }
  function matMul(A,B){
    const r=A.length, c=B[0].length, k=B.length;
    const out=Array.from({length:r},()=>Array(c).fill(0));
    for(let i=0;i<r;i++) for(let j=0;j<c;j++){ let s=0; for(let t=0;t<k;t++) s+=A[i][t]*B[t][j]; out[i][j]=s; }
    return out;
  }
  function vecMul(A, v){ return A.map(row => row.reduce((s, a, i)=> s + a*v[i], 0)); }
  function solve(A, b){
    const n = A.length;
    const M = A.map((row,i)=> row.concat([b[i]]));
    for(let i=0;i<n;i++){
      let maxR=i; for(let r=i+1;r<n;r++) if(Math.abs(M[r][i])>Math.abs(M[maxR][i])) maxR=r;
      if (maxR!==i){ const tmp=M[i]; M[i]=M[maxR]; M[maxR]=tmp; }
      const piv = M[i][i] || 1e-12;
      for(let j=i;j<=n;j++) M[i][j]/=piv;
      for(let r=0;r<n;r++){ if (r===i) continue; const f=M[r][i]; for(let j=i;j<=n;j++) M[r][j]-=f*M[i][j]; }
    }
    return M.map(row=>row[n]);
  }

  // ---------- AR/MA/ARMA ----------
  // 최소자승 AR(p) 적합
  function fitAR(train, p){
    const n = train.length;
    const rows = n - p;
    if (rows <= 0) return new Array(p).fill(0);
    const X = Array.from({length: rows}, (_,i)=> train.slice(i, i+p).reverse());
    const y = train.slice(p);
    const XT = transpose(X);
    const XTX = matMul(XT, X);
    const XTy = vecMul(XT, y);
    const beta = solve(XTX, XTy);
    return beta; // [phi1..phip]
  }

  // AR(p) one-step 예측(롤링 업데이트)
  function predictAR(train, test, p){
    if (p <= 0) return new Array(test.length).fill(train[train.length-1]);
    const phi = fitAR(train, p);
    const history = train.slice();
    const preds = [];
    for(let t=0;t<test.length;t++){
      let yhat = 0;
      for(let i=1;i<=p;i++) yhat += phi[i-1] * history[history.length - i];
      preds.push(yhat);
      history.push(test[t]); // one-step 업데이트
    }
    return preds;
  }

  // MA(q) — 단순(잔차가 아니라) 최근 q값 평균으로 근사
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

  // ARMA(p,q) 간이: AR + 최근 q 잔차 평균
  function predictARMA(train, test, p, q){
    const phi = p>0 ? fitAR(train, p) : [];
    const history = train.slice();
    let resHist = [];
    if (p>0){
      for(let t=p;t<history.length;t++){
        let yhat=0; for(let i=1;i<=p;i++) yhat+=phi[i-1]*history[t-i];
        resHist.push(history[t]-yhat);
      }
    } else {
      resHist = new Array(history.length).fill(0);
    }
    const preds=[];
    for(let t=0;t<test.length;t++){
      let yhat=0;
      if (p>0){ for(let i=1;i<=p;i++) yhat+=phi[i-1]*history[history.length - i]; }
      else { yhat = history[history.length-1]; }
      const epsMean = q>0 ? mean(resHist.slice(-q)) : 0;
      yhat += epsMean;
      preds.push(yhat);
      const actualNext = test[t];
      const resid = actualNext - yhat;
      resHist.push(resid);
      history.push(actualNext);
    }
    return preds;
  }

  // ---------- (계절)차분/복원 ----------
  function diffN(arr, d){
    let out = arr.slice();
    for(let k=0;k<d;k++){
      const tmp=[]; for(let i=1;i<out.length;i++) tmp.push(out[i]-out[i-1]);
      out = tmp;
    }
    return out;
  }
  function undiffN(lastValues, diffs, d){
    if (d===0) return diffs.slice();
    let prev = lastValues[lastValues.length-1];
    const first = diffs.map(dv => (prev = prev + dv));
    return first;
  }
  function sdiff(arr, s){
    if (!s || s<=0) return arr.slice();
    const out=[]; for(let i= s; i<arr.length; i++) out.push(arr[i]-arr[i-s]);
    return out;
  }
  function undiffS(lastSeason, diffs, s){
    if (!s || s<=0) return diffs.slice();
    const out=[]; const hist=lastSeason.slice();
    for(let i=0;i<diffs.length;i++){
      const y = diffs[i] + hist[hist.length - s];
      out.push(y); hist.push(y);
    }
    return out;
  }

  // ---------- 공용 차트 렌더 ----------
  let statChart=null;
  function renderChartAndMetrics(dates, y, splitIdx, preds, name){
    // 예측 시점에 맞춰 패딩
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
    return { labels: dates.slice(split), yTrue: test, yHat: preds };
  };

  StatModels.runMA = async function(q=2){
    const {dates, close:y} = getSeries();
    const split = Math.floor(y.length*0.7);
    const train = y.slice(0, split);
    const test  = y.slice(split);
    const preds = predictMA(train, test.length, Math.max(1, q));
    renderChartAndMetrics(dates, y, split, preds, `MA(${q}) (SMA)`);
    return { labels: dates.slice(split), yTrue: test, yHat: preds };
  };

  StatModels.runARMA = async function(p=2, q=2){
    const {dates, close:y} = getSeries();
    const split = Math.floor(y.length*0.7);
    const train = y.slice(0, split);
    const test  = y.slice(split);
    const preds = predictARMA(train, test, Math.max(0,p), Math.max(0,q));
    renderChartAndMetrics(dates, y, split, preds, `ARMA(${p},${q}) (approx)`);
    return { labels: dates.slice(split), yTrue: test, yHat: preds };
  };

  StatModels.runARIMA = async function(p=2, d=1, q=2){
    const {dates, close:y} = getSeries();
    const split = Math.floor(y.length*0.7);
    const test  = y.slice(split);

    const dN = Math.max(0, d|0);
    const yDiff = dN>0 ? diffN(y, dN) : y.slice();
    const splitDiff = yDiff.length - test.length;

    const trainDiff = yDiff.slice(0, splitDiff);
    const testDiff  = yDiff.slice(splitDiff);
    const predsDiff = predictARMA(trainDiff, testDiff, Math.max(0,p), Math.max(0,q));

    const lastVals = y.slice(split - dN, split);
    const preds = dN>0 ? undiffN(lastVals, predsDiff, dN) : predsDiff;

    const yHat = preds.slice(0, test.length);
    renderChartAndMetrics(dates, y, split, yHat, `ARIMA(${p},${d},${q}) (approx)`);
    return { labels: dates.slice(split), yTrue: test, yHat };
  };

  // SARIMA: 비계절(d), 계절(s) 차분 후 ARMA 근사, 역복원
  StatModels.runSARIMA = async function argFlex(/* (p,d,q,s) | (tsState, p,d,q,s) */){
    // --- 1) 인자 정규화: (tsState, p,d,q,s)도 허용 ---
    let p, d, q, s;
    if (typeof arguments[0] === 'object') {
      // 옛 시그니처: (tsState, p, d, q, s)
      p = Number(arguments[1] ?? 2);
      d = Number(arguments[2] ?? 1);
      q = Number(arguments[3] ?? 2);
      s = Number(arguments[4] ?? 0);
    } else {
      // 새 시그니처: (p, d, q, s)
      p = Number(arguments[0] ?? 2);
      d = Number(arguments[1] ?? 1);
      q = Number(arguments[2] ?? 2);
      s = Number(arguments[3] ?? 0);
    }
    p = Math.max(0, p|0);
    d = Math.max(0, d|0);
    q = Math.max(0, q|0);
    s = Math.max(0, s|0);

    // --- 2) 데이터 가져오기 ---
    const { dates, close: y } = getSeries();
    const N = y.length;
    const split = Math.floor(N * 0.7);
    const test  = y.slice(split);
    if (test.length <= 0) {
      console.warn('SARIMA: 테스트 구간이 없습니다.');
      return null;
    }

    // --- 3) 차분 (d, s) ---
    // 비계절 차분
    const yD  = d > 0 ? diffN(y, d) : y.slice();         // 길이: N - d
    // 계절 차분
    const yDS = s > 0 ? sdiff(yD, s) : yD;               // 길이: N - d - s

    // 차분 공간에서의 split 인덱스 (테스트 길이를 맞춤)
    // (원본 split에 해당하는 차분 인덱스는 대략 split - d - s)
    const splitDS = Math.max(0, yDS.length - test.length);

    const trainDS = yDS.slice(0, splitDS);
    const testDS  = yDS.slice(splitDS);                  // 길이 ~= test.length

    // --- 4) 차분 공간에서 ARMA(p,q) 근사 예측 ---
    const predsDiff = predictARMA(trainDS, testDS, p, q); // 차분공간 예측

    // --- 5) 계절 복원 (yDS -> yD) ---
    let restored = predsDiff.slice();
    if (s > 0) {
      // yDS[i] = yD[i+s] - yD[i] 이므로,
      // 예측 시작 시점의 yD 과거 s개가 필요 => yD.slice(splitDS, splitDS + s)
      let lastSeason = yD.slice(splitDS, splitDS + s);
      if (lastSeason.length < s) {
        // 부족하면 앞쪽에서 채워 넣기
        const need = s - lastSeason.length;
        const pad  = yD.slice(Math.max(0, splitDS - need), splitDS);
        lastSeason = pad.concat(lastSeason);
      }
      restored = undiffS(lastSeason, predsDiff, s); // yD 공간으로 복원
    }

    // --- 6) 비계절 복원 (yD -> y) ---
    const lastVals = y.slice(split - d, split);          // 비계절 복원용 과거 d개
    const preds = d > 0 ? undiffN(lastVals, restored, d) : restored;

    // --- 7) 길이 정합 (라벨/실제/예측 동일 길이) ---
    const yHat = preds.slice(0, test.length);
    const labels = dates.slice(split, split + yHat.length);
    const yTrue  = y.slice(split,  split + yHat.length);

    // --- 8) 차트 렌더 ---
    renderChartAndMetrics(dates, y, split, yHat, `SARIMA(${p},${d},${q}) s=${s} (approx)`);

    return { labels, yTrue, yHat };
  };
})();
