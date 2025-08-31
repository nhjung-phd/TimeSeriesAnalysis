window.TSData = (() => {
  // ==== CSV 로딩/파싱 ====
  const loadCSVDateCloseFromFile = (file) => new Promise((resolve, reject)=>{
    const r = new FileReader();
    r.onload = () => {
      try { resolve(parseCSVDateClose(r.result)); } catch(e){ reject(e); }
    };
    r.onerror = reject;
    r.readAsText(file);
  });

  const parseCSVDateClose = (txt) => {
    const lines = txt.trim().split('\n');
    if (lines.length < 2) return { dates: [], closes: [] };
    const header = lines[0].split(',').map(s=>s.trim());
    const dateIdx = header.indexOf('Date');
    let closeIdx = header.indexOf('Close');
    if (dateIdx < 0) throw new Error("CSV에 'Date' 헤더가 필요합니다.");
    if (closeIdx < 0) closeIdx = header.length - 1;
    const dates = [], closes = [];
    for (let i=1;i<lines.length;i++){
      if (!lines[i]) continue;
      const cols = lines[i].split(',');
      const d = cols[dateIdx]?.trim();
      const v = parseFloat(cols[closeIdx]);
      if (d && Number.isFinite(v)){ dates.push(d); closes.push(v); }
    }
    return { dates, closes };
  };

  const sliceByDate = (dates, values, start, end) => {
    if (!start && !end) return { dates, values };
    const s = start ? new Date(start) : null;
    const e = end ? new Date(end) : null;
    const od=[], ov=[];
    for (let i=0;i<dates.length;i++){
      const d = new Date(dates[i]);
      if ((s && d < s) || (e && d > e)) continue;
      od.push(dates[i]); ov.push(values[i]);
    }
    return { dates: od, values: ov };
  };

  // ==== 기본 통계/유틸 ====
  const mean = arr => arr.reduce((a,b)=>a+b,0) / Math.max(arr.length,1);
  const variance = arr => {
    const m = mean(arr); return mean(arr.map(v => (v-m)*(v-m)));
  };
  const std = arr => Math.sqrt(variance(arr));
  const diff = (arr, d=1) => {
    let out = arr.slice();
    for (let k=0;k<d;k++) out = out.slice(1).map((v,i)=>v - out[i]);
    return out;
  };
  const movingAverage = (arr, w=5) => {
    const out = Array(arr.length).fill(null);
    let s = 0;
    for (let i=0;i<arr.length;i++){
      s += arr[i];
      if (i>=w) s -= arr[i-w];
      if (i>=w-1) out[i] = s / w;
    }
    return out;
  };
  const expSmooth = (arr, alpha=0.3) => {
    const out = Array(arr.length).fill(null);
    let s = arr[0];
    out[0]=s;
    for (let i=1;i<arr.length;i++){
      s = alpha*arr[i] + (1-alpha)*s;
      out[i]=s;
    }
    return out;
  };

  // ==== 분해 (간이 additive: 이동평균으로 추세 추정) ====
  const decomposeAdditive = (arr, season=20) => {
    const trend = movingAverage(arr, season);
    const detrended = arr.map((v,i)=> trend[i]!=null ? v - trend[i] : null);
    const seasonal = Array(arr.length).fill(null);
    for (let i=0;i<arr.length;i++){
      if (detrended[i]==null) continue;
      const phase = i % season;
      let s=0,c=0;
      for (let j=phase;j<arr.length;j+=season){
        if (detrended[j]!=null){ s+=detrended[j]; c++; }
      }
      seasonal[i] = c? s/c : 0;
    }
    const irregular = arr.map((v,i)=> (trend[i]!=null && seasonal[i]!=null) ? v - trend[i] - seasonal[i] : null);
    return { trend, seasonal, irregular };
  };

  // ==== ACF/PACF ====
  const acf = (arr, maxLag=30) => {
    const m = mean(arr);
    const denom = arr.reduce((s,v)=> s + (v-m)*(v-m), 0) || 1e-9;
    const out = [];
    for(let k=0;k<=maxLag;k++){
      let num=0;
      for(let t=k;t<arr.length;t++) num += (arr[t]-m)*(arr[t-k]-m);
      out.push(num/denom);
    }
    return out;
  };

  // Yule-Walker PACF (간이)
  const pacf_yw = (arr, maxLag=30) => {
    const r = acf(arr, maxLag);
    const phi = Array(maxLag+1).fill(0);
    const PACF = [1];
    const v = [1];
    for (let k=1;k<=maxLag;k++){
      let sum=0;
      for (let j=1;j<k;j++) sum += phi[j]*r[k-j];
      const phi_k = (r[k] - sum) / (v[k-1] || 1e-9);
      const newPhi = phi.slice();
      newPhi[k] = phi_k;
      for (let j=1;j<k;j++) newPhi[j] = phi[j] - phi_k*phi[k-j];
      for (let j=1;j<=k;j++) phi[j] = newPhi[j];
      v[k] = v[k-1]*(1 - phi_k*phi_k);
      PACF.push(phi_k);
    }
    return PACF;
  };

  // ==== 정상성 간이 스캐닝 ====
  const rolling = (arr, w, fn) => {
    const out = Array(arr.length).fill(null);
    for (let i=w-1;i<arr.length;i++){
      out[i] = fn(arr.slice(i-w+1,i+1));
    }
    return out;
  };
  const stationarityScan = (arr, w=60) => {
    const meanSeries = rolling(arr, w, mean);
    const varSeries  = rolling(arr, w, variance);
    const ac1Series  = rolling(arr, w, a=> acf(a,1)[1]);
    const mstd = std(meanSeries.filter(v=>v!=null));
    const vstd = std(varSeries.filter(v=>v!=null));
    const astd = std(ac1Series.filter(v=>v!=null));
    const verdict = (mstd < 1 && vstd < 50 && astd < 0.15);
    return { meanSeries, varSeries, ac1Series, verdict };
  };

  const padLeft = (arr) => {
    const firstIdx = arr.findIndex(v=>v!=null);
    if (firstIdx<=0) return arr;
    const head = Array(firstIdx).fill(null);
    return head.concat(arr.slice(firstIdx));
  };

  const mae = (y,yhat) => {
    const n = Math.min(y.length, yhat.length);
    let s=0,c=0; for (let i=0;i<n;i++){ if (yhat[i]==null) continue; s+=Math.abs(y[i]-yhat[i]); c++; }
    return s/Math.max(c,1);
  };
  const rmse = (y,yhat) => {
    const n = Math.min(y.length, yhat.length);
    let s=0,c=0; for (let i=0;i<n;i++){ if (yhat[i]==null) continue; s+=(y[i]-yhat[i])**2; c++; }
    return Math.sqrt(s/Math.max(c,1));
  };

  return {
    loadCSVDateCloseFromFile, parseCSVDateClose, sliceByDate,
    mean, variance, std, diff, movingAverage, expSmooth,
    decomposeAdditive, acf, pacf_yw, stationarityScan, padLeft,
    mae, rmse
  };
})();