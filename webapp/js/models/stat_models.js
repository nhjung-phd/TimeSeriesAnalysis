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
  StatModels.runSARIMA = async function(p=2, d=1, q=2, s=0){
    const { dates, close: y } = getSeries();
    const split = Math.floor(y.length*0.7);
    const test  = y.slice(split);

    const dN = Math.max(0, d|0);
    const sN = Math.max(0, s|0);

    // 1) 비계절 차분
    const yD = dN>0 ? diffN(y, dN) : y.slice();
    // 2) 계절 차분
    const yDS = sN>0 ? sdiff(yD, sN) : yD;

    // 차분된 공간에서의 split 인덱스 = (원본 split) - d - s
    const splitDS = yDS.length - test.length;
    const trainDS = yDS.slice(0, splitDS);
    const testDS  = yDS.slice(splitDS);

    // ARMA 예측(차분 공간) — 여기선 AR(p) + 잔차평균 q
    const predsDiff = predictARMA(trainDS, testDS, Math.max(0,p), Math.max(0,q));

    // 3) 계절 복원
    let restored = predsDiff.slice();
    if (sN>0){
      // 비계절 차분된 yD에서 splitDS 이후의 최근 s개를 계절 기준으로 사용
      let lastSeason = yD.slice(splitDS, splitDS + sN);
      if (lastSeason.length < sN){
        const need = sN - lastSeason.length;
        lastSeason = yD.slice(Math.max(0, splitDS - need), splitDS).concat(lastSeason);
      }
      restored = undiffS(lastSeason, predsDiff, sN);
    }

    // 4) 비계절 복원
    const lastVals = y.slice(split - dN, split);
    const preds = dN>0 ? undiffN(lastVals, restored, dN) : restored;

    const yHat = preds.slice(0, test.length);
    renderChartAndMetrics(dates, y, split, yHat, `SARIMA(${p},${d},${q}) s=${s} (approx)`);
    return { labels: dates.slice(split), yTrue: test, yHat };
  };
})();
