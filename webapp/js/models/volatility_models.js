
// js/models/volatility_models.js
// 변동성 탭: ARCH(1), GARCH(1,1), VAR(1), Granger 인과성(간이)
// 기존 파일 변경 없이 독립적으로 이벤트를 바인딩합니다.

(function(){
  const VolModels = {};
  window.VolModels = VolModels;

  const clampNum = (x)=> (Number.isFinite(x)? x : 0);

  // ----- 데이터 준비: 로그수익률 -----
  function logReturns(arr){
    const out=[];
    for(let i=1;i<arr.length;i++){
      const r = Math.log(arr[i]/arr[i-1]);
      out.push(r);
    }
    return out;
  }
  const movingAverage = (arr, w=5)=>{
    const o = Array(arr.length).fill(null);
    let s=0;
    for(let i=0;i<arr.length;i++){
      s+=arr[i];
      if(i>=w) s-=arr[i-w];
      if(i>=w-1) o[i] = s/w;
    }
    return o;
  };
  const mean = arr => arr.reduce((a,b)=>a+b,0)/Math.max(arr.length,1);
  const variance = arr => {
    const m = mean(arr); return mean(arr.map(v=>(v-m)*(v-m)));
  };

  // ----- 간단한 차트 유틸 -----
  function lineChart(canvasId, labels, series, title){
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return null;
    if (!lineChart._h) lineChart._h = {};
    if (lineChart._h[canvasId]) lineChart._h[canvasId].destroy();
    lineChart._h[canvasId] = new Chart(ctx, {
      type:'line',
      data:{ labels, datasets: series },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom' }, title:{ display: !!title, text: title } } }
    });
    return lineChart._h[canvasId];
  }

  // ----- OLS -----
  function ols(X, y){
    // X: n x k (이미 상수항 포함 여부는 호출부 책임)
    const XT = transpose(X);
    const XTX = matMul(XT, X);
    const XTy = vecMul(XT, y);
    const beta = solve(XTX, XTy);
    // R2
    const yhat = X.map(row => row.reduce((s,a,i)=> s + a*beta[i], 0));
    const ym = mean(y);
    const ssr = y.reduce((s,yi,i)=> s + (yhat[i]-ym)*(yhat[i]-ym), 0);
    const sst = y.reduce((s,yi)=> s + (yi-ym)*(yi-ym), 0) || 1e-12;
    const r2 = ssr/sst;
    // RSS
    const rss = y.reduce((s,yi,i)=>{ const e=yi-yhat[i]; return s + e*e; }, 0);
    return { beta, yhat, r2, rss };
  }
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

  // ----- ARCH(1) -----
  function fitARCH1(ret){
    const y = ret.map(v=> v*v);           // y_t = r_t^2
    const y1 = y.slice(0, y.length-1);    // t-1
    const y2 = y.slice(1);                // t
    const X = y1.map(v => [1, v]);        // const, y_{t-1}
    const { beta, yhat } = ols(X, y2);
    const omega = Math.max(beta[0], 1e-12);
    const alpha = Math.max(Math.min(beta[1], 0.999), 0);
    // sigma2 재귀 (예측치 사용)
    const s2 = Array(y.length).fill(null);
    s2[0] = y[0];
    for(let t=1;t<y.length;t++){
      s2[t] = omega + alpha * y[t-1];
    }
    return { omega, alpha, sigma2: s2.slice(1), y: y.slice(1) };
  }

  // ----- GARCH(1,1) 간이 추정 (그리드 탐색) -----
  function fitGARCH11(ret){
    const y = ret.map(v=> v*v); // r_t^2
    const varY = mean(y);
    let best = { mse: Infinity, omega: 0, alpha: 0.1, beta: 0.85, s2: [] };
    const alphas = [0.05,0.1,0.15,0.2,0.25,0.3];
    const betas  = [0.7,0.75,0.8,0.85,0.9,0.95];
    for (const a of alphas){
      for (const b of betas){
        if (a + b >= 0.999) continue;
        const omega = Math.max(varY*(1 - a - b), 1e-12);
        const s2 = Array(y.length).fill(null);
        s2[0] = y[0];
        for(let t=1;t<y.length;t++){
          s2[t] = omega + a*y[t-1] + b*s2[t-1];
        }
        const mse = mean(s2.map((v,i)=> (v - y[i])*(v - y[i])));
        if (mse < best.mse){
          best = { mse, omega, alpha: a, beta: b, s2 };
        }
      }
    }
    return { omega: best.omega, alpha: best.alpha, beta: best.beta, sigma2: best.s2.slice(1), y: y.slice(1) };
  }

  // ----- VAR(1) with derived second series (MA(5) of returns) -----
  function fitVAR1(ret){
    const ma5 = movingAverage(ret, 5);
    // 정렬: 유효 구간만
    const y1 = []; // [ret_t, ma5_t]
    const y0 = []; // [ret_{t-1}, ma5_{t-1}]
    for(let t=1;t<ret.length;t++){
      if (ma5[t]==null || ma5[t-1]==null) continue;
      y1.push([ret[t], ma5[t]]);
      y0.push([ret[t-1], ma5[t-1]]);
    }
    // 각 방정식에 대해 OLS: ret_t = a11*ret_{t-1} + a12*ma_{t-1} + c1
    //                        ma_t  = a21*ret_{t-1} + a22*ma_{t-1} + c2
    const X = y0.map(v=> [1, v[0], v[1]]);
    const y_ret = y1.map(v=> v[0]);
    const y_ma  = y1.map(v=> v[1]);
    const m1 = ols(X, y_ret);
    const m2 = ols(X, y_ma);
    // 행렬 형태
    const C = [m1.beta[0], m2.beta[0]];
    const A = [[m1.beta[1], m1.beta[2]],[m2.beta[1], m2.beta[2]]];
    // 예측 (one-step) for ret
    const yhat_ret = X.map(row => row[0]*m1.beta[0] + row[1]*m1.beta[1] + row[2]*m1.beta[2]);
    return { C, A, r2_ret: m1.r2, r2_ma: m2.r2, yhat_ret, y_true_ret: y_ret };
  }

  // ----- Granger (p=1, 간이 F) -----
  function granger1(ret){
    const ma5 = movingAverage(ret, 5);
    const y = []; const x = [];
    for(let t=1;t<ret.length;t++){
      if (ma5[t-1]==null) continue;
      y.push(ret[t]); x.push(ma5[t-1]);
    }
    // Restricted: y_t = c + phi*y_{t-1}
    const y_lag = [ret[0]].concat(ret.slice(1,-1)).slice(1);
    const n = Math.min(y.length, y_lag.length);
    const Xr = []; const yr = [];
    for(let i=0;i<n;i++){ Xr.push([1, y_lag[i]]); yr.push(y[i]); }
    const mr = ols(Xr, yr);
    // Full: y_t = c + phi*y_{t-1} + theta*x_{t-1}
    const Xf = []; const yf = [];
    for(let i=0;i<n;i++){ Xf.push([1, y_lag[i], x[i]]); yf.push(y[i]); }
    const mf = ols(Xf, yf);
    const m = 1; // 제약 수
    const k = 3; // full 모형 모수 수
    const df2 = n - k;
    const F = ((mr.rss - mf.rss)/m) / (mf.rss/Math.max(df2,1));
    return { F, df1: m, df2, rssR: mr.rss, rssF: mf.rss };
  }

  // ----- DOM 바인딩 -----
  function needData(){
    return !(window.TS_STATE?.dates?.length && window.TS_STATE?.close?.length);
  }

  window.addEventListener('DOMContentLoaded', ()=>{
    const hasVolTab = document.getElementById('tab-vol');
    if (!hasVolTab) return;

    const info = (msg)=>{ const el = document.getElementById('vol-status'); if (el) el.textContent = msg; };

    const archBtn = document.getElementById('btn-arch');
    if (archBtn){
      archBtn.addEventListener('click', ()=>{
        if (needData()){ alert('먼저 CSV를 로드해주세요.'); return; }
        info('ARCH(1) 추정중...');
        const ret = logReturns(TS_STATE.close);
        const fit = fitARCH1(ret);
        const labels = TS_STATE.dates.slice(1); // returns 기준
        lineChart('chart-arch', labels.slice(1), [
          { label:'r^2', data: fit.y, borderColor:'rgb(59,130,246)', pointRadius:0 },
          { label:'σ^2(ARCH)', data: fit.sigma2, borderColor:'rgb(220,38,38)', borderDash:[6,6], pointRadius:0 }
        ], 'ARCH(1) 조건부분산');
        const el = document.getElementById('arch-params');
        if (el) el.textContent = `ω=${fit.omega.toExponential(2)}, α=${fit.alpha.toFixed(3)}`;
        info('완료');
      });
    }

    const garchBtn = document.getElementById('btn-garch');
    if (garchBtn){
      garchBtn.addEventListener('click', ()=>{
        if (needData()){ alert('먼저 CSV를 로드해주세요.'); return; }
        info('GARCH(1,1) 추정중...');
        const ret = logReturns(TS_STATE.close);
        const fit = fitGARCH11(ret);
        const labels = TS_STATE.dates.slice(1);
        lineChart('chart-garch', labels.slice(1), [
          { label:'r^2', data: fit.y, borderColor:'rgb(30,64,175)', pointRadius:0 },
          { label:'σ^2(GARCH)', data: fit.sigma2, borderColor:'rgb(234,88,12)', borderDash:[6,6], pointRadius:0 }
        ], 'GARCH(1,1) 조건부분산');
        const el = document.getElementById('garch-params');
        if (el) el.textContent = `ω=${fit.omega.toExponential(2)}, α=${fit.alpha.toFixed(3)}, β=${fit.beta.toFixed(3)}`;
        info('완료');
      });
    }

    const varBtn = document.getElementById('btn-var');
    if (varBtn){
      varBtn.addEventListener('click', ()=>{
        if (needData()){ alert('먼저 CSV를 로드해주세요.'); return; }
        info('VAR(1) 적합중...');
        const ret = logReturns(TS_STATE.close);
        const fit = fitVAR1(ret);
        const labels = TS_STATE.dates.slice(6); // MA5 이후
        lineChart('chart-var', labels.slice(1), [
          { label:'ret 실제', data: fit.y_true_ret, borderColor:'rgb(16,185,129)', pointRadius:0 },
          { label:'ret 예측(VAR1)', data: fit.yhat_ret, borderColor:'rgb(220,38,38)', borderDash:[6,6], pointRadius:0 }
        ], 'VAR(1) 예측(첫 방정식)');
        const el = document.getElementById('var-params');
        if (el) el.textContent = `C=[${fit.C.map(v=>v.toFixed(4)).join(', ')}], A=[[${fit.A[0].map(v=>v.toFixed(4)).join(', ')}],[${fit.A[1].map(v=>v.toFixed(4)).join(', ')}]], R²(ret)=${fit.r2_ret.toFixed(3)}`;
        info('완료');
      });
    }

    const grBtn = document.getElementById('btn-granger');
    const svarBtn = document.getElementById('btn-svar');
    if (svarBtn){
      svarBtn.addEventListener('click', ()=>{
        if (needData()){ alert('먼저 CSV를 로드해주세요.'); return; }
        info('SVAR(Cholesky) 계산중...');
        const ret = logReturns(TS_STATE.close);
        const fit = svarCholesky(ret);
        const labels = Array.from({length:fit.irf1.length}, (_,i)=>`h${i}`);
        lineChart('chart-svar', labels, [
          { label:'IRF ret ← shock(ret)', data: fit.irf1.map(v=>v[0]), borderColor:'rgb(14,165,233)', pointRadius:0 },
          { label:'IRF ret ← shock(ma)',  data: fit.irf2.map(v=>v[0]), borderColor:'rgb(220,38,38)', borderDash:[6,6], pointRadius:0 }
        ], 'IRF (수평축: 시차 h)');
        const el = document.getElementById('svar-params');
        if (el) el.textContent = `B=[${fit.B[0].map(v=>v.toFixed(4)).join(', ')}; ${fit.B[1].map(v=>v.toFixed(4)).join(', ')}], A=[[${fit.A[0].map(v=>v.toFixed(4)).join(', ')}],[${fit.A[1].map(v=>v.toFixed(4)).join(', ')}]]`;
        info('완료');
      });
    }

    if (grBtn){
      grBtn.addEventListener('click', ()=>{
        if (needData()){ alert('먼저 CSV를 로드해주세요.'); return; }
        info('Granger(1) 계산중...');
        const ret = logReturns(TS_STATE.close);
        const g = granger1(ret);
        const el = document.getElementById('granger-out');
        if (el) el.textContent = `F(${g.df1}, ${g.df2}) = ${g.F.toFixed(3)} — (임계치 예: df1=1, df2≈200 기준 95% ≈ 3.89)`;
        info('완료');
      });
    }
  });


  // ----- SVAR(Cholesky, 2변수: ret, MA5(ret)) -----
  function svarCholesky(ret){
    const ma5 = movingAverage(ret, 5);
    const Z1 = []; // y_t   = [ret_t, ma5_t]
    const Z0 = []; // y_{t-1}
    for(let t=1;t<ret.length;t++){
      if (ma5[t]==null || ma5[t-1]==null) continue;
      Z1.push([ret[t], ma5[t]]);
      Z0.push([ret[t-1], ma5[t-1]]);
    }
    // VAR(1): y_t = c + A y_{t-1} + e_t
    const X = Z0.map(v=> [1, v[0], v[1]]);
    const y1 = Z1.map(v=> v[0]);
    const y2 = Z1.map(v=> v[1]);
    const m1 = ols(X, y1);
    const m2 = ols(X, y2);
    const C = [m1.beta[0], m2.beta[0]];
    const A = [[m1.beta[1], m1.beta[2]],[m2.beta[1], m2.beta[2]]];

    // 잔차(e_t) 추정
    const e = [];
    for (let i=0;i<X.length;i++){
      const yhat1 = X[i][0]*m1.beta[0] + X[i][1]*m1.beta[1] + X[i][2]*m1.beta[2];
      const yhat2 = X[i][0]*m2.beta[0] + X[i][1]*m2.beta[1] + X[i][2]*m2.beta[2];
      e.push([ y1[i]-yhat1, y2[i]-yhat2 ]);
    }
    // 공분산 S
    const ex = e.map(v=>v[0]), ey = e.map(v=>v[1]);
    const mx = mean(ex), my = mean(ey);
    let s11=0,s22=0,s12=0;
    for (let i=0;i<e.length;i++){
      s11 += (ex[i]-mx)*(ex[i]-mx);
      s22 += (ey[i]-my)*(ey[i]-my);
      s12 += (ex[i]-mx)*(ey[i]-my);
    }
    s11/=Math.max(e.length-1,1); s22/=Math.max(e.length-1,1); s12/=Math.max(e.length-1,1);
    const S = [[s11, s12],[s12, s22]];

    // Cholesky 분해: S = B B'
    const b11 = Math.sqrt(Math.max(S[0][0], 1e-12));
    const b21 = S[1][0] / b11;
    const b22 = Math.sqrt(Math.max(S[1][1] - b21*b21, 1e-12));
    const B = [[b11, 0],[b21, b22]]; // lower triangular

    // 간단 IRF (h=20)
    const H=20;
    const irf1 = Array(H).fill(0).map(()=>[0,0]); // shock1 ret/ma5
    const irf2 = Array(H).fill(0).map(()=>[0,0]); // shock2 ret/ma5
    // companion: y_{t+1} = A y_t + B eps_t (상수 생략, 충격 반응만)
    let Phi = [[1,0],[0,1]]; // A^0
    const A1 = A;
    // 누적을 위해 반복 곱
    function mat2mul(M,N){ return [[M[0][0]*N[0][0]+M[0][1]*N[1][0], M[0][0]*N[0][1]+M[0][1]*N[1][1]], [M[1][0]*N[0][0]+M[1][1]*N[1][0], M[1][0]*N[0][1]+M[1][1]*N[1][1]]]; }
    function mat2vec(M,v){ return [M[0][0]*v[0]+M[0][1]*v[1], M[1][0]*v[0]+M[1][1]*v[1]]; }

    for (let h=0; h<H; h++){
      const resp = (P)=> mat2mul(P, B); // 2x2
      const R = resp(Phi);
      irf1[h] = [R[0][0], R[1][0]]; // shock 1 (ret shock)
      irf2[h] = [R[0][1], R[1][1]]; // shock 2 (ma shock)
      // 다음 Phi = Phi * A
      Phi = mat2mul(Phi, A1);
    }
    return { C, A, B, S, irf1, irf2 };
  }
  VolModels.svarCholesky = svarCholesky;

})();
