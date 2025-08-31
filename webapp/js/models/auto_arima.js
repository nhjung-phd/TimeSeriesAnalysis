// js/models/auto_arima.js (LEAN) — 통계모델2 전용, Box–Jenkins 진단은 분리됨
(function(){
  const AutoARIMA = {};
  window.AutoARIMA = AutoARIMA;

  // --------- utils ---------
  const clampNum = (x)=> (Number.isFinite(x)? x : 0);
  const mean = arr => arr.reduce((a,b)=>a+b,0)/Math.max(arr.length,1);
  const mae = (y,yh)=>{
    const n=Math.min(y.length,yh.length); let s=0,c=0;
    for(let i=0;i<n;i++){ const z=yh[i]; if(z==null) continue; s+=Math.abs(y[i]-z); c++; }
    return s/Math.max(c,1);
  };
  const rmse = (y,yh)=>{
    const n=Math.min(y.length,yh.length); let s=0,c=0;
    for(let i=0;i<n;i++){ const z=yh[i]; if(z==null) continue; const e=y[i]-z; s+=e*e; c++; }
    return Math.sqrt(s/Math.max(c,1));
  };

  // --------- differencing ---------
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
    return diffs.map(dv => (prev = prev + dv));
  }

  // --------- AR/ARMA approx ----------
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
  function fitAR(train, p){
    const n = train.length;
    const rows = n - p;
    if (p<=0 || rows<=0) return new Array(Math.max(p,0)).fill(0);
    const X = Array.from({length: rows}, (_,i)=> train.slice(i, i+p).reverse());
    const y = train.slice(p);
    const XT = transpose(X);
    const XTX = matMul(XT, X);
    const XTy = vecMul(XT, y);
    const beta = solve(XTX, XTy).map(clampNum);
    return beta;
  }
  function predictARMA(train, test, p, q){
    const phi = p>0 ? fitAR(train, p) : [];
    const history = train.slice();
    let resHist = [];
    if (p>0){
      for(let t=p;t<history.length;t++){
        let yhat=0; for(let i=1;i<=p;i++) yhat+=(phi[i-1]||0)*history[t-i];
        resHist.push(history[t]-yhat);
      }
    } else { resHist = new Array(history.length).fill(0); }
    const preds=[];
    for(let t=0;t<test.length;t++){
      let yhat=0;
      if (p>0){ for(let i=1;i<=p;i++) yhat+=(phi[i-1]||0)*history[history.length - i]; }
      else { yhat = history[history.length-1]; }
      const epsMean = q>0 ? mean(resHist.slice(-q)) : 0;
      yhat = clampNum(yhat + epsMean);
      preds.push(yhat);
      const actualNext = test[t];
      const resid = actualNext - yhat;
      resHist.push(resid);
      history.push(actualNext);
    }
    return preds;
  }

  function aicFromResids(residuals, k){
    const n = residuals.length;
    const rss = residuals.reduce((s,e)=> s + e*e, 0);
    const sigma2 = rss / Math.max(n,1);
    return n*Math.log(Math.max(sigma2, 1e-12)) + 2*k;
  }

  function arimaPredictNoRender(y, split, p,d,q){
    const test = y.slice(split);
    const dN = Math.max(0, d|0);
    const yDiff = dN>0 ? diffN(y, dN) : y.slice();
    const splitDiff = yDiff.length - test.length;
    const trainDiff = yDiff.slice(0, splitDiff);
    const testDiff  = yDiff.slice(splitDiff);
    const predsDiff = predictARMA(trainDiff, testDiff, Math.max(0,p), Math.max(0,q));
    const lastVals = y.slice(split - dN, split);
    const preds = dN>0 ? undiffN(lastVals, predsDiff, dN) : predsDiff;
    const yHat = preds.slice(0, test.length);
    const residuals = test.map((v,i)=> v - yHat[i]);
    return { yTrue: test, yHat, residuals };
  }

  function renderChartAndMetrics2(dates, y, split, preds, name){
    const padded = new Array(y.length).fill(null);
    for(let i=0;i<preds.length;i++) padded[split+i] = preds[i];
    const ctx = document.getElementById('chart-stat2').getContext('2d');
    if (renderChartAndMetrics2._chart) renderChartAndMetrics2._chart.destroy();
    renderChartAndMetrics2._chart = new Chart(ctx,{
      type:'line',
      data:{
        labels:dates,
        datasets:[
          {label:'실제', data:y,     borderColor:'rgb(30,64,175)', tension:.12, pointRadius:0},
          {label:name,  data:padded, borderColor:'rgb(220,38,38)', borderDash:[6,6], tension:.12, pointRadius:0}
        ]
      },
      options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}}
    });
    const yTest = y.slice(split);
    const mEl = document.getElementById('stat2-metrics');
    if (mEl){
      const maeV = mae(yTest, preds).toFixed(3);
      const rmseV= rmse(yTest, preds).toFixed(3);
      mEl.textContent = `MAE: ${maeV} / RMSE: ${rmseV}`;
    }
  }

  AutoARIMA.autoFit = async function(pMax=3, dMax=2, qMax=3){
    if (!window.TS_STATE?.dates?.length || !window.TS_STATE?.close?.length){
      alert('먼저 CSV를 로드해주세요.'); return;
    }
    const dates = TS_STATE.dates, y = TS_STATE.close;
    const split = Math.floor(y.length*0.7);
    const status = document.getElementById('autoarima-status');
    const btn = document.getElementById('btn-auto-arima');
    if (btn) btn.disabled = true;
    if (status) status.textContent = '탐색중...';

    let best = { aic: Infinity, p:0,d:0,q:0, res:null };
    const combos = [];
    for (let d=0; d<=dMax; d++){
      for (let p=0; p<=pMax; p++){
        for (let q=0; q<=qMax; q++){
          combos.push({p,d,q});
        }
      }
    }
    combos.sort((a,b)=> (a.d-b.d) || ((a.p+a.q)-(b.p+b.q)) );

    for (let i=0;i<combos.length;i++){
      const {p,d,q} = combos[i];
      const res = arimaPredictNoRender(y, split, p,d,q);
      const k = p + q + (d>0?1:0) + 1;
      const aic = aicFromResids(res.residuals, k);
      if (aic < best.aic){ best = { aic, p,d,q, res }; }
      if (status) status.textContent = `탐색중... (${i+1}/${combos.length}) best: ARIMA(${best.p},${best.d},${best.q}) AIC=${best.aic.toFixed(1)}`;
      await new Promise(r=>setTimeout(r,0)); // UI responsive
    }

    renderChartAndMetrics2(dates, y, split, best.res.yHat, `AutoARIMA → ARIMA(${best.p},${best.d},${best.q})`);
    const out = document.getElementById('autoarima-out');
    if (out){ out.textContent = `선택: ARIMA(${best.p},${best.d},${best.q}), AIC=${best.aic.toFixed(1)}`; }
    if (status) status.textContent = '완료';
    if (btn) btn.disabled = false;
    AutoARIMA._lastBest = best; // 진단 모듈에서 잔차 접근
    return best;
  };

  // ---------- DOM 바인딩 (이 파일이 스스로 바인딩) ----------
  window.addEventListener('DOMContentLoaded', ()=>{
    const btn = document.getElementById('btn-auto-arima');
    if (btn){
      btn.addEventListener('click', ()=>{
        const pMax = Math.max(0, parseInt(document.getElementById('auto-pmax')?.value||'3',10));
        const dMax = Math.max(0, parseInt(document.getElementById('auto-dmax')?.value||'2',10));
        const qMax = Math.max(0, parseInt(document.getElementById('auto-qmax')?.value||'3',10));
        AutoARIMA.autoFit(pMax, dMax, qMax);
      });
    }
  });

})();
