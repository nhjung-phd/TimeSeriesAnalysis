// 탭 기능
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const id = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(s=>s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(id).classList.add('active');
    // Canvas 크기 갱신
    setTimeout(()=>window.dispatchEvent(new Event('resize')), 50);
  });
});

// 전역 상태
window.TS_STATE = { dates: [], close: [], closeTransformed: null };

window.addEventListener('DOMContentLoaded', async ()=>{
  // ===== 공통 =====
  const byId = (id)=>document.getElementById(id);
  const preStart = byId('pre-start');
  const preEnd   = byId('pre-end');
  const preBtn   = byId('pre-preview');
  const preReset = byId('pre-reset');
  const csvInfo  = byId('csv-info');

  // ===== Preprocessing 차트 =====
  let prepChart = null;
  const ensurePrepChart = ()=>{
    if (prepChart) return prepChart;
    const ctx = byId('chart-prep').getContext('2d');
    prepChart = new Chart(ctx,{
      type:'line',
      data:{ labels:[], datasets:[{ label:'Close', data:[], borderColor:'rgb(37,99,235)', tension:.12, pointRadius:0 }]},
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom' } } }
    });
    return prepChart;
  };

  // ===== 샘플 CSV 자동 로드 (깃허브 Pages/로컬 모두 대응) =====
  function guessCsvCandidates(){
    const here = new URL(window.location.href);
    const path = here.pathname;
    // 깃허브 Pages 예: /TimeSeriesAnalysis/ 로 배포된 경우
    const base = path.includes('/TimeSeriesAnalysis/')
      ? '/TimeSeriesAnalysis/'
      : (path.endsWith('/') ? path : path.substring(0, path.lastIndexOf('/')+1));
    return [
      base + 'data/tsla_sample.csv',
      './data/tsla_sample.csv',
      'data/tsla_sample.csv',
      '/data/tsla_sample.csv'
    ];
  }

  async function fetchFirstOk(urls){
    for (const u of urls){
      try{
        const res = await fetch(u, {cache:'no-store'});
        if (res.ok){
          const text = await res.text();
          return { url:u, text };
        }
      }catch(_){/* 계속 시도 */}
    }
    throw new Error('샘플 CSV를 찾지 못했습니다.');
  }

  async function loadInitialCSV(){
    try{
      const cand = guessCsvCandidates();
      const { url, text } = await fetchFirstOk(cand);
      const { dates, closes } = TSData.parseCSVDateClose(text);
      window.TS_STATE = { dates, close: closes, closeTransformed: null };
      const ch = ensurePrepChart();
      ch.data.labels = dates;
      ch.data.datasets[0].data = closes;
      ch.update();
      preStart.value = dates[0];
      preEnd.value   = dates[dates.length-1];
      if (csvInfo) csvInfo.textContent = `샘플 로드: ${url} (${dates.length} points)`;
    }catch(e){
      console.warn(e);
      if (csvInfo) csvInfo.textContent = '샘플 로딩 실패: 직접 업로드하세요.';
    }
  }

  await loadInitialCSV();

  // 파일 업로드
  byId('pre-file').addEventListener('change', async (e)=>{
    const file = e.target.files[0];
    if (!file) return;
    try{
      const { dates, closes } = await TSData.loadCSVDateCloseFromFile(file);
      TS_STATE = { dates, close: closes, closeTransformed: null };
      const ch = ensurePrepChart();
      ch.data.labels = dates;
      ch.data.datasets[0].data = closes;
      ch.update();
      preStart.value = dates[0];
      preEnd.value   = dates[dates.length-1];
      if (csvInfo) csvInfo.textContent = `로드됨: ${file.name} (${dates.length} points)`;
    }catch(err){
      alert('파일 처리 오류: ' + err.message);
    }
  });

  const needData = ()=>{
    if (!TS_STATE?.dates?.length){
      alert('먼저 CSV를 로드해주세요.');
      return true;
    }
    return false;
  };

  // 기간 슬라이싱 미리보기
  preBtn.addEventListener('click', ()=>{
    if (needData()) return;
    const { dates, values } = TSData.sliceByDate(TS_STATE.dates, TS_STATE.close, preStart.value, preEnd.value);
    const ch = ensurePrepChart();
    ch.data.labels = dates;
    ch.data.datasets[0].data = values;
    ch.update();
  });

  // 원복
  preReset.addEventListener('click', ()=>{
    if (needData()) return;
    const ch = ensurePrepChart();
    ch.data.labels = TS_STATE.dates;
    ch.data.datasets[0].data = TS_STATE.close;
    ch.update();
  });

  // ===== 2) 시계열 분석 =====
  // 이동평균/지수평활
  const maBtn   = byId('btn-ma-es');
  const maWin   = byId('ma-window');
  const esAlpha = byId('es-alpha');
  let maChart   = null;
  function ensureMaChart(){
    if (maChart) return maChart;
    maChart = new Chart(byId('chart-ma-es').getContext('2d'), {
      type:'line', data:{labels:[], datasets:[]},
      options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}}
    });
    return maChart;
  }
  maBtn.addEventListener('click', ()=>{
    if (needData()) return;
    const labels = TS_STATE.dates;
    const y = TS_STATE.close;
    const ma = TSData.movingAverage(y, parseInt(maWin.value||'20'));
    const es = TSData.expSmooth(y, parseFloat(esAlpha.value||'0.3'));
    const ch = ensureMaChart();
    ch.data.labels = labels;
    ch.data.datasets = [
      {label:'Close', data:y, borderColor:'rgb(30,64,175)', tension:.12, pointRadius:0},
      {label:`MA(${maWin.value})`, data:ma, borderColor:'rgb(16,185,129)', tension:.12, pointRadius:0},
      {label:`ES(α=${esAlpha.value})`, data:es, borderColor:'rgb(244,63,94)', tension:.12, pointRadius:0},
    ];
    ch.update();
  });

  // 요소분해
  const deBtn = byId('btn-decomp');
  let deChart = null;
  function ensureDeChart(){
    if (deChart) return deChart;
    deChart = new Chart(byId('chart-decomp').getContext('2d'), {
      type:'line', data:{labels:[], datasets:[]},
      options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}}
    });
    return deChart;
  }
  deBtn.addEventListener('click', ()=>{
    if (needData()) return;
    const s = parseInt(byId('decomp-season').value||'20');
    const { trend, seasonal, irregular } = TSData.decomposeAdditive(TS_STATE.close, s);
    const ch = ensureDeChart();
    ch.data.labels = TS_STATE.dates;
    ch.data.datasets = [
      {label:'Trend', data:trend, borderColor:'rgb(99,102,241)', pointRadius:0},
      {label:'Seasonal', data:seasonal, borderColor:'rgb(234,179,8)', pointRadius:0},
      {label:'Irregular', data:irregular, borderColor:'rgb(107,114,128)', pointRadius:0}
    ];
    ch.update();
  });

  // ACF/PACF
  const acfBtn = byId('btn-acf');
  let acfChart=null, pacfChart=null;
  function ensureAcfChart(){
    if (!acfChart){
      acfChart = new Chart(byId('chart-acf').getContext('2d'), {
        type:'bar', data:{labels:[], datasets:[]},
        options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}}
      });
    }
    if (!pacfChart){
      pacfChart = new Chart(byId('chart-pacf').getContext('2d'), {
        type:'bar', data:{labels:[], datasets:[]},
        options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}}
      });
    }
    return {acfChart, pacfChart};
  }
  acfBtn.addEventListener('click', ()=>{
    if (needData()) return;
    const L = parseInt(byId('acf-lag').value||'30');
    const acf = TSData.acf(TS_STATE.close, L);
    const pacf = TSData.pacf_yw(TS_STATE.close, L);
    const labels = Array.from({length:L+1}, (_,i)=>i);
    const {acfChart:ac, pacfChart:pc} = ensureAcfChart();
    ac.data.labels = labels;
    ac.data.datasets = [{label:'ACF', data:acf, backgroundColor:'rgba(59,130,246,0.5)'}];
    ac.update();
    pc.data.labels = labels;
    pc.data.datasets = [{label:'PACF', data:pacf, backgroundColor:'rgba(16,185,129,0.5)'}];
    pc.update();
  });

  // 정상성
  const stBtn   = byId('btn-stationarity');
  const stWin   = byId('stat-window');
  const stBadge = byId('stat-result');
  let stChart   = null;
  function ensureStChart(){
    if (stChart) return stChart;
    stChart = new Chart(byId('chart-stationarity').getContext('2d'), {
      type:'line', data:{labels:[], datasets:[]},
      options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}}
    });
    return stChart;
  }
  stBtn.addEventListener('click', ()=>{
    if (needData()) return;
    const w = parseInt(stWin.value||'60');
    const { meanSeries, varSeries, ac1Series, verdict } = TSData.stationarityScan(TS_STATE.close, w);
    stBadge.textContent = verdict ? '정상(간이)' : '비정상(간이)';
    stBadge.style.background = verdict ? '#dcfce7' : '#fee2e2';
    stBadge.style.color = verdict ? '#065f46' : '#991b1b';
    const ch = ensureStChart();
    ch.data.labels = TS_STATE.dates;
    ch.data.datasets = [
      {label:'Mean(win)', data:TSData.padLeft(meanSeries), borderColor:'rgb(99,102,241)', pointRadius:0},
      {label:'Var(win)',  data:TSData.padLeft(varSeries),  borderColor:'rgb(234,88,12)', pointRadius:0},
      {label:'ACF1(win)', data:TSData.padLeft(ac1Series),  borderColor:'rgb(16,185,129)', pointRadius:0}
    ];
    ch.update();
  });

  // 변환(차분/평활화)
  let tfChart=null;
  function ensureTfChart(){
    if (tfChart) return tfChart;
    tfChart = new Chart(byId('chart-transform').getContext('2d'), {
      type:'line', data:{labels:[], datasets:[]},
      options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}}
    });
    return tfChart;
  }
  byId('btn-diff1').addEventListener('click', ()=>{
    if (needData()) return;
    const ch = ensureTfChart();
    TS_STATE.closeTransformed = TSData.diff(TS_STATE.close, 1);
    ch.data.labels = TS_STATE.dates.slice(1);
    ch.data.datasets = [{label:'1차 차분', data:TS_STATE.closeTransformed, borderColor:'rgb(234,88,12)', pointRadius:0}];
    ch.update();
  });
  byId('btn-smooth').addEventListener('click', ()=>{
    if (needData()) return;
    const ch = ensureTfChart();
    TS_STATE.closeTransformed = TSData.movingAverage(TS_STATE.close, 5);
    ch.data.labels = TS_STATE.dates;
    ch.data.datasets = [{label:'평활(5)', data:TS_STATE.closeTransformed, borderColor:'rgb(16,185,129)', pointRadius:0}];
    ch.update();
  });
  byId('btn-reset-ts').addEventListener('click', ()=>{
    const ch = ensureTfChart();
    TS_STATE.closeTransformed = null;
    ch.data.labels = []; ch.data.datasets = []; ch.update();
  });

  // ===== 3) 통계모델 =====
  const readInt = (id, def)=> parseInt(byId(id).value || String(def));
  byId('btn-run-ar').addEventListener('click',    ()=>{ if(!needData()) StatModels.runAR(readInt('ar-p',2)); });
  byId('btn-run-ma').addEventListener('click',    ()=>{ if(!needData()) StatModels.runMA(readInt('ma-q',2)); });
  byId('btn-run-arma').addEventListener('click',  ()=>{ if(!needData()) StatModels.runARMA(readInt('ar-p',2), readInt('ma-q',2)); });
  byId('btn-run-arima').addEventListener('click', ()=>{ if(!needData()) StatModels.runARIMA(readInt('ar-p',2), readInt('arima-d',1), readInt('ma-q',2)); });
  byId('btn-run-sarima').addEventListener('click',async ()=>{
    if (needData()) return;
    const p = readInt('ar-p',2), d = readInt('arima-d',1), q = readInt('ma-q',2), s = readInt('season-s',0);
    const res = await StatModels.runSARIMA(p,d,q,s);
    if (res){
      // 표시 텍스트만 업데이트(차트는 stat_models.js가 그림)
      // 별도 처리 불요
    }
  });

  // 4) ML 데모
  new Chart(byId('chart-ml'), {
    type:'bar',
    data:{ labels:['T1','T2','T3'], datasets:[{ label:'Demo', data:[3,5,2] }] },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom' } } }
  });

  // 5) LSTM (데모)
  if (window.Models?.LSTM){
    const lstm = Models.LSTM.init('chart-lstm','lstm-status');
    byId('btn-lstm').addEventListener('click', async ()=>{
      const btn = byId('btn-lstm'); btn.disabled = true;
      try{ await Models.LSTM.trainAndPredict(lstm); } finally { btn.disabled = false; }
    });
  }

  // 6) 최신 (있을 때만)
  if (window.Models?.TRANS?.init){
    try{ Models.TRANS.init('chart-transformer'); }catch(e){ console.warn(e); }
  }
});