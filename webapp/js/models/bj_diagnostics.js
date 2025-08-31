
// js/models/bj_diagnostics.js — Box–Jenkins Diagnostics 전용 모듈
(function(){
  const BJDiag = {};
  window.BJDiag = BJDiag;

  // ----- safe helpers (namespaced) -----
  const bjMean = arr => arr.reduce((a,b)=>a+b,0)/Math.max(arr.length,1);
  const bjVariance = arr => { const m=bjMean(arr); return bjMean(arr.map(v=>(v-m)*(v-m))); };

  function transpose(A){ return A[0].map((_,j)=>A.map(row=>row[j])); }
  function matMul(A,B){
    const r=A.length, c=B[0].length, k=B.length;
    const out=Array.from({length:r},()=>Array(c).fill(0));
    for(let i=0;i<r;i++) for(let j=0;j<c;j++){ let s=0; for(let t=0;t<k;t++) s+=A[i][t]*B[t][j]; out[i][j]=s; }
    return out;
  }
  function vecMul(A, v){ return A.map(row => row.reduce((s, a, i)=> s + a*v[i], 0)); }
  function inv(A){
    const n=A.length;
    const M = A.map((row,i)=> row.concat( Array.from({length:n}, (_,j)=> i===j?1:0) ));
    for(let i=0;i<n;i++){
      let maxR=i; for(let r=i+1;r<n;r++) if(Math.abs(M[r][i])>Math.abs(M[maxR][i])) maxR=r;
      if (maxR!==i){ const tmp=M[i]; M[i]=M[maxR]; M[maxR]=tmp; }
      const piv = M[i][i] || 1e-12;
      for(let j=i;j<2*n;j++) M[i][j]/=piv;
      for(let r=0;r<n;r++){ if (r===i) continue; const f=M[r][i]; for(let j=i;j<2*n;j++) M[r][j]-=f*M[i][j]; }
    }
    return M.map(row=> row.slice(n));
  }

  // ----- ACF / PACF -----
  function acfRaw(arr, maxLag){
    const m = bjMean(arr);
    const denom = arr.reduce((s,v)=> s + (v-m)*(v-m), 0) || 1e-9;
    const out=[1];
    for(let k=1;k<=maxLag;k++){
      let num=0; for(let t=k;t<arr.length;t++) num += (arr[t]-m)*(arr[t-k]-m);
      out.push(num/denom);
    }
    return out;
  }
  // Yule-Walker pacf (Durbin-Levinson)
  function pacfYW(arr, L){
    const n = arr.length;
    const rho = acfRaw(arr, L);
    const pacf = [1];
    let phi = Array(L+1).fill(0).map(()=>Array(L+1).fill(0));
    let sig = Array(L+1).fill(0);
    sig[0] = 1;
    for (let k=1;k<=L;k++){
      let num = rho[k] - Array.from({length:k-1},(_,j)=> phi[k-1][j+1]*rho[k-(j+1)]).reduce((a,b)=>a+b,0);
      let den = 1 - Array.from({length:k-1},(_,j)=> phi[k-1][j+1]*rho[j+1]).reduce((a,b)=>a+b,0);
      phi[k][k] = den ? num/den : 0;
      for (let j=1;j<k;j++){
        phi[k][j] = phi[k-1][j] - phi[k][k]*phi[k-1][k-j];
      }
      pacf.push(phi[k][k]);
    }
    return pacf;
  }

  // ----- Ljung-Box & chi-square -----
  const chi95 = {1:3.84,2:5.99,3:7.81,4:9.49,5:11.07,6:12.59,7:14.07,8:15.51,9:16.92,10:18.31,
    11:19.68,12:21.03,13:22.36,14:23.68,15:25.00,16:26.30,17:27.59,18:28.87,19:30.14,20:31.41};
  function chiCrit95(df){ return chi95[df] || (df>30 ? df + 1.64*Math.sqrt(2*df) : 31.41); }
  function erf(x){
    const s = Math.sign(x); x = Math.abs(x);
    const a1=0.254829592, a2=-0.284496736, a3=1.421413741, a4=-1.453152027, a5=1.061405429, p=0.3275911;
    const t = 1/(1+p*x);
    const y = 1 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-x*x);
    return s*y;
  }
  function pvalChiSqWH(Q, df){
    const z = ((Math.pow(Q/df,1/3) - (1 - 2/(9*df))) / Math.sqrt(2/(9*df)));
    const p = 1 - 0.5*(1 + erf(z/Math.SQRT2));
    return Math.max(0, Math.min(1, p));
  }
  function ljungBoxQ(resid, maxLag=20){
    const n = resid.length;
    const m = bjMean(resid);
    const e = resid.map(v=> (v - m));
    const acf = acfRaw(e, maxLag);
    let Q=0;
    for (let k=1;k<=maxLag;k++){ Q += (acf[k]*acf[k]) / (n - k); }
    Q *= n*(n+2);
    return { Q, df: maxLag };
  }

  // ----- ADF (level, no trend), KPSS(level) -----
  function diff1(arr){ const out=[]; for(let i=1;i<arr.length;i++) out.push(arr[i]-arr[i-1]); return out; }
  function ols(X,y){
    const XT = transpose(X);
    const XTX = matMul(XT,X);
    const XTy = vecMul(XT,y);
    const beta = matMul(inv(XTX), [XTy]).map(v=>v[0]);
    const yhat = X.map(row => row.reduce((s,a,i)=> s + a*beta[i], 0));
    const resid = y.map((v,i)=> v - yhat[i]);
    const n = y.length, k = X[0].length;
    const s2 = resid.reduce((s,e)=> s + e*e, 0) / Math.max(n-k,1);
    const cov = matMul(scal(inv(XTX), s2), eye(k));
    const se = cov.map((row,i)=> Math.sqrt(Math.max(row[i], 1e-12)));
    const tvals = beta.map((b,i)=> b / (se[i]||1e-9));
    return {beta, se, tvals, resid, rss: resid.reduce((s,e)=>s+e*e,0)};
  }
  function eye(n){ const I=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=> i===j?1:0)); return I; }
  function scal(M, s){ return M.map(row => row.map(v=> v)); } // cov는 inv(X'X)*s2 이므로 이 함수는 placeholder

  function adfTest(y, k=1){
    const dy = diff1(y);
    const y1 = y.slice(0,-1);
    const X = []; const Y = [];
    for(let i=k;i<dy.length;i++){
      const row=[1, y1[i]]; // const + y_{t-1}
      for(let j=1;j<=k;j++) row.push(dy[i-j]); // Δy_{t-j}
      X.push(row); Y.push(dy[i]);
    }
    const fit = ols(X,Y);
    const t = fit.tvals[1];
    return { t, lags:k, n: Y.length };
  }

  function kpssTest(y){
    const n = y.length;
    const m = bjMean(y);
    const e = y.map(v=> v - m);
    let s=0; const S = e.map(v=> (s+=v));
    const bw = Math.max(1, Math.floor(1.1447*Math.pow(n,1/3)));
    const gamma0 = e.reduce((a,v)=>a+v*v,0)/n;
    let lrv = gamma0;
    for (let j=1;j<=bw;j++){
      let cov=0; for (let t=j;t<n;t++) cov += e[t]*e[t-j];
      cov/=n;
      lrv += 2*(1 - j/(bw+1))*cov;
    }
    const eta = S.reduce((a,v)=> a + v*v, 0) / (n*n);
    const stat = eta / Math.max(lrv,1e-12);
    return { stat, bw };
  }

  // ----- Rendering -----
  function renderCharts(res){
    const dates = TS_STATE.dates.slice(TS_STATE.dates.length - res.length);
    // residual
    const ctxR = document.getElementById('chart-bj-resid')?.getContext('2d');
    if (ctxR){
      if (renderCharts._r) renderCharts._r.destroy();
      renderCharts._r = new Chart(ctxR,{ type:'line',
        data:{ labels:dates, datasets:[{label:'Residual', data: res, borderColor:'rgb(107,114,128)', pointRadius:0, tension:.1}] },
        options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}} }
      });
    }
    // ACF/PACF
    const L = Math.min(30, Math.floor(res.length/3));
    const acf = acfRaw(res, L);
    const ci = 1.96 / Math.sqrt(res.length);
    const labels = Array.from({length:L+1}, (_,i)=>i);
    const ctxA = document.getElementById('chart-bj-acf')?.getContext('2d');
    if (ctxA){
      if (renderCharts._a) renderCharts._a.destroy();
      renderCharts._a = new Chart(ctxA,{ type:'bar',
        data:{ labels, datasets:[{label:'ACF(resid)', data:acf, backgroundColor:'rgba(59,130,246,0.5)'}] },
        options:{ responsive:true, maintainAspectRatio:false,
          plugins:{ legend:{position:'bottom'}, title:{display:true,text:`Residual ACF (±${ci.toFixed(2)})`} },
          scales:{ y:{ suggestedMin:-1, suggestedMax:1 } }
        }
      });
    }
    const pacf = (window.TSData && window.TSData.pacf_yw) ? TSData.pacf_yw(res, L) : pacfYW(res, L);
    const ctxP = document.getElementById('chart-bj-pacf')?.getContext('2d');
    if (ctxP){
      if (renderCharts._p) renderCharts._p.destroy();
      renderCharts._p = new Chart(ctxP,{ type:'bar',
        data:{ labels, datasets:[{label:'PACF(resid)', data: pacf, backgroundColor:'rgba(16,185,129,0.55)'}] },
        options:{ responsive:true, maintainAspectRatio:false,
          plugins:{ legend:{position:'bottom'}, title:{display:true,text:'Residual PACF'} },
          scales:{ y:{ suggestedMin:-1, suggestedMax:1 } }
        }
      });
    }
    // Ljung-Box series
    const LQ = Math.min(20, Math.floor(res.length/4));
    let Qs=[]; for (let k=1;k<=LQ;k++){ Qs.push(ljungBoxQ(res, k).Q); }
    const ctxQ = document.getElementById('chart-bj-ljung')?.getContext('2d');
    if (ctxQ){
      if (renderCharts._q) renderCharts._q.destroy();
      renderCharts._q = new Chart(ctxQ,{ type:'line',
        data:{ labels: Array.from({length:LQ},(_,i)=>i+1),
          datasets:[
            {label:'Ljung–Box Q_k', data: Qs, borderColor:'rgb(234,88,12)', pointRadius:0},
            {type:'line', label:'χ²(0.95,k)', data: Array.from({length:LQ},(_,i)=> chiCrit95(i+1)), borderColor:'rgb(59,130,246)', borderDash:[6,6], pointRadius:0}
          ]},
        options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{position:'bottom'} } }
      });
    }
  }

  BJDiag.run = function(){
    if (!window.AutoARIMA || !AutoARIMA._lastBest){
      alert('먼저 통계모델2 탭에서 AutoARIMA를 실행하세요.'); return;
    }
    const res = AutoARIMA._lastBest?.res?.residuals || [];
    if (!res.length){ alert('잔차가 없습니다. AutoARIMA 결과를 확인하세요.'); return; }

    // tests
    const y = TS_STATE.close;
    const adf = adfTest(y, 1);
    const kpss = kpssTest(y);
    const lb = ljungBoxQ(res, Math.min(20, Math.floor(res.length/4)));
    const pLB = pvalChiSqWH(lb.Q, lb.df);

    // badges + summary
    const adfCrit = { '1%': -3.43, '5%': -2.86, '10%': -2.57 };
    const kpssCrit = { '10%': 0.347, '5%': 0.463, '1%': 0.739 };
    const adfVerd = adf.t < adfCrit['5%'] ? '정상(기각)' : '비정상(미기각)';
    const kpssVerd = kpss.stat < kpssCrit['5%'] ? '정상(미기각)' : '비정상(기각)';
    const lbVerd = pLB < 0.05 ? '잔차 비독립(기각)' : '잔차 독립(미기각)';
    const badge = document.getElementById('bj-badges');
    if (badge) badge.textContent = `ADF: ${adfVerd} / KPSS: ${kpssVerd} / LB: ${lbVerd} (p≈${pLB.toFixed(3)})`;

    const el = document.getElementById('bj-out');
    if (el){
      el.innerHTML = [
        `<b>식별(Identification)</b>: ACF/PACF로 차수 가늠 (상단 탭 참조)`,
        `<b>추정(Estimation)</b>: AutoARIMA가 AIC 최소 조합 선택`,
        `<b>진단(Diagnostics)</b>: Ljung-Box Q=${lb.Q.toFixed(2)} (df=${lb.df}, p≈${pLB.toFixed(3)}), ADF t=${adf.t.toFixed(2)} (crit 5% ${adfCrit['5%']}), KPSS=${kpss.stat.toFixed(3)} (crit 5% ${kpssCrit['5%']}, bw=${kpss.bw})`
      ].join('<br/>');
    }

    renderCharts(res);
  };

  // DOM bind
  window.addEventListener('DOMContentLoaded', ()=>{
    const bj = document.getElementById('btn-bj');
    if (bj){ bj.addEventListener('click', ()=> BJDiag.run()); }
  });

})();
