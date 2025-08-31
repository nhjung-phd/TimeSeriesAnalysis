// Tabs
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const id = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(s=>s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(id).classList.add('active');
  });
});

// Shared state
window.TS_STATE = { dates: [], close: [], closeTransformed: null };

// Boot
window.addEventListener('DOMContentLoaded', ()=>{
  // 1) 데이터전처리 업로드 & 전체그래프
  const preFile = document.getElementById('pre-file');
  const preStart = document.getElementById('pre-start');
  const preEnd = document.getElementById('pre-end');
  const preBtn = document.getElementById('pre-preview');
  const preReset = document.getElementById('pre-reset');
  let prepChart = null;

  const ensurePrepChart = () => {
    if (prepChart) return prepChart;
    const ctx = document.getElementById('chart-prep').getContext('2d');
    prepChart = new Chart(ctx, {
      type: 'line',
      data: { labels: [], datasets: [{ label: 'Close', data: [], borderColor: 'rgb(37,99,235)', tension: .12 }]},
      options: { responsive: true, maintainAspectRatio: false }
    });
    return prepChart;
  };

  preBtn.addEventListener('click', async ()=>{
    try{
      if (!TS_STATE.dates.length){
        const f = preFile.files?.[0];
        if (!f) { alert('CSV 파일을 선택하세요.'); return; }
        const { dates, closes } = await TSData.loadCSVDateCloseFromFile(f);
        TS_STATE.dates = dates; TS_STATE.close = closes; TS_STATE.closeTransformed = null;
      }
      const {dates, values} = TSData.sliceByDate(TS_STATE.dates, TS_STATE.close, preStart.value, preEnd.value);
      const ch = ensurePrepChart();
      ch.data.labels = dates; ch.data.datasets[0].data = values; ch.update();
    }catch(e){
      console.warn(e); alert('업로드/파싱 실패: CSV 형식을 확인하세요.');
    }
  });

  preReset.addEventListener('click', ()=>{
    TS_STATE.dates = []; TS_STATE.close = []; TS_STATE.closeTransformed = null;
    preFile.value=''; preStart.value=''; preEnd.value='';
    if (prepChart){ prepChart.data.labels=[]; prepChart.data.datasets[0].data=[]; prepChart.update(); }
  });

  // 2) 시계열분석
  // 이동평균/지수평활
  const maBtn = document.getElementById('btn-ma-es');
  const maWin = document.getElementById('ma-window');
  const esAlpha = document.getElementById('es-alpha');
  let maChart = new Chart(document.getElementById('chart-ma-es'), { type:'line', data:{labels:[], datasets:[]},
    options:{responsive:true, maintainAspectRatio:false}});

  maBtn.addEventListener('click', ()=>{
    if (!TS_STATE.close.length) return alert('먼저 데이터전처리 탭에서 CSV를 로드하세요.');
    const labels = TS_STATE.dates;
    const y = TS_STATE.close;
    const ma = TSData.movingAverage(y, parseInt(maWin.value||'20'));
    const es = TSData.expSmooth(y, parseFloat(esAlpha.value||'0.3'));
    maChart.data.labels = labels;
    maChart.data.datasets = [
      {label:'Close', data:y, borderColor:'rgb(30,64,175)', tension:.12},
      {label:`MA(${maWin.value})`, data:ma, borderColor:'rgb(16,185,129)', tension:.12},
      {label:`ES(α=${esAlpha.value})`, data:es, borderColor:'rgb(244,63,94)', tension:.12},
    ];
    maChart.update();
  });

  // 요소분해
  const deBtn = document.getElementById('btn-decomp');
  let deChart = new Chart(document.getElementById('chart-decomp'), { type:'line', data:{labels:[], datasets:[]},
    options:{responsive:true, maintainAspectRatio:false}});
  deBtn.addEventListener('click', ()=>{
    if (!TS_STATE.close.length) return alert('먼저 데이터전처리 탭에서 CSV를 로드하세요.');
    const s = parseInt(document.getElementById('decomp-season').value||'20');
    const { trend, seasonal, irregular } = TSData.decomposeAdditive(TS_STATE.close, s);
    deChart.data.labels = TS_STATE.dates;
    deChart.data.datasets = [
      {label:'Trend', data:trend, borderColor:'rgb(99,102,241)'},
      {label:'Seasonal', data:seasonal, borderColor:'rgb(234,179,8)'},
      {label:'Irregular', data:irregular, borderColor:'rgb(107,114,128)'}
    ];
    deChart.update();
  });

  // ACF/PACF
  const acfBtn = document.getElementById('btn-acf');
  let acfChart = new Chart(document.getElementById('chart-acf'), { type:'bar', data:{labels:[], datasets:[]},
    options:{responsive:true, maintainAspectRatio:false}});
  acfBtn.addEventListener('click', ()=>{
    if (!TS_STATE.close.length) return alert('먼저 데이터전처리 탭에서 CSV를 로드하세요.');
    const L = parseInt(document.getElementById('acf-lag').value||'30');
    const acf = TSData.acf(TS_STATE.close, L);
    const pacf = TSData.pacf_yw(TS_STATE.close, L);
    acfChart.data.labels = Array.from({length:L+1}, (_,i)=>i);
    acfChart.data.datasets = [
      {label:'ACF', data:acf, backgroundColor:'rgba(59,130,246,0.5)'},
      {label:'PACF', data:pacf, backgroundColor:'rgba(16,185,129,0.5)'}
    ];
    acfChart.update();
  });

  // 정상성 검사
  const stBtn = document.getElementById('btn-stationarity');
  const stWin = document.getElementById('stat-window');
  const stBadge = document.getElementById('stat-result');
  let stChart = new Chart(document.getElementById('chart-stationarity'), { type:'line', data:{labels:[], datasets:[]},
    options:{responsive:true, maintainAspectRatio:false}});
  stBtn.addEventListener('click', ()=>{
    if (!TS_STATE.close.length) return alert('먼저 데이터전처리 탭에서 CSV를 로드하세요.');
    const w = parseInt(stWin.value||'60');
    const { meanSeries, varSeries, ac1Series, verdict } = TSData.stationarityScan(TS_STATE.close, w);
    stBadge.textContent = verdict ? '정상(간이)' : '비정상(간이)';
    stBadge.style.background = verdict ? '#dcfce7' : '#fee2e2';
    stBadge.style.color = verdict ? '#065f46' : '#991b1b';

    stChart.data.labels = TS_STATE.dates;
    stChart.data.datasets = [
      {label:'Mean(win)', data:TSData.padLeft(meanSeries), borderColor:'rgb(99,102,241)'},
      {label:'Var(win)', data:TSData.padLeft(varSeries), borderColor:'rgb(234,88,12)'},
      {label:'ACF1(win)', data:TSData.padLeft(ac1Series), borderColor:'rgb(16,185,129)'}
    ];
    stChart.update();
  });

  // 차분/평활화 적용
  let tfChart = new Chart(document.getElementById('chart-transform'), { type:'line', data:{labels:[], datasets:[]},
    options:{responsive:true, maintainAspectRatio:false}});
  document.getElementById('btn-diff1').addEventListener('click', ()=>{
    if (!TS_STATE.close.length) return alert('CSV 먼저 로드');
    TS_STATE.closeTransformed = TSData.diff(TS_STATE.close, 1);
    tfChart.data.labels = TS_STATE.dates.slice(1);
    tfChart.data.datasets = [{label:'1차 차분', data:TS_STATE.closeTransformed, borderColor:'rgb(234,88,12)'}];
    tfChart.update();
  });
  document.getElementById('btn-smooth').addEventListener('click', ()=>{
    if (!TS_STATE.close.length) return alert('CSV 먼저 로드');
    TS_STATE.closeTransformed = TSData.movingAverage(TS_STATE.close, 5);
    tfChart.data.labels = TS_STATE.dates;
    tfChart.data.datasets = [{label:'평활(5)', data:TS_STATE.closeTransformed, borderColor:'rgb(16,185,129)'}];
    tfChart.update();
  });
  document.getElementById('btn-reset-ts').addEventListener('click', ()=>{
    TS_STATE.closeTransformed = null;
    tfChart.data.labels = []; tfChart.data.datasets = []; tfChart.update();
  });

  // 3) 통계모델
  const statCtx = document.getElementById('chart-stat').getContext('2d');
  const statChart = new Chart(statCtx, { type:'line', data:{labels:[], datasets:[]},
    options:{responsive:true, maintainAspectRatio:false}});
  const metricsEl = document.getElementById('stat-metrics');

  const showStat = (labels, yTrue, yHat, name) => {
    statChart.data.labels = labels;
    statChart.data.datasets = [
      {label:'실제', data:yTrue, borderColor:'rgb(30,64,175)'},
      {label:name, data:yHat, borderColor:'rgb(220,38,38)'}
    ];
    statChart.update();
    const mae = TSData.mae(yTrue, yHat).toFixed(3);
    const rmse = TSData.rmse(yTrue, yHat).toFixed(3);
    metricsEl.textContent = `MAE: ${mae} / RMSE: ${rmse}`;
  };

  document.getElementById('btn-run-ar').addEventListener('click', ()=>{
    if (!TS_STATE.close.length) return alert('CSV 먼저 로드');
    const p = parseInt(document.getElementById('ar-p').value||'2');
    const { labels, yTrue, yHat } = StatModels.runAR(TS_STATE.dates, TS_STATE.close, p);
    showStat(labels, yTrue, yHat, `AR(${p})`);
  });

  document.getElementById('btn-run-ma').addEventListener('click', ()=>{
    if (!TS_STATE.close.length) return alert('CSV 먼저 로드');
    const q = parseInt(document.getElementById('ma-q').value||'2');
    const { labels, yTrue, yHat } = StatModels.runMA(TS_STATE.dates, TS_STATE.close, q);
    showStat(labels, yTrue, yHat, `MA(${q}) (naive)`);
  });

  document.getElementById('btn-run-arma').addEventListener('click', ()=>{
    if (!TS_STATE.close.length) return alert('CSV 먼저 로드');
    const p = parseInt(document.getElementById('ar-p').value||'2');
    const q = parseInt(document.getElementById('ma-q').value||'2');
    const { labels, yTrue, yHat } = StatModels.runARMA(TS_STATE.dates, TS_STATE.close, p, q);
    showStat(labels, yTrue, yHat, `ARMA(${p},${q}) (approx)`);
  });

  document.getElementById('btn-run-arima').addEventListener('click', ()=>{
    if (!TS_STATE.close.length) return alert('CSV 먼저 로드');
    const p = parseInt(document.getElementById('ar-p').value||'2');
    const d = parseInt(document.getElementById('arima-d').value||'1');
    const q = parseInt(document.getElementById('ma-q').value||'2');
    const { labels, yTrue, yHat } = StatModels.runARIMA(TS_STATE.dates, TS_STATE.close, p, d, q);
    showStat(labels, yTrue, yHat, `ARIMA(${p},${d},${q}) (approx)`);
  });

  document.getElementById('btn-run-sarima').addEventListener('click', ()=>{
    if (!TS_STATE.close.length) return alert('CSV 먼저 로드');
    const p = parseInt(document.getElementById('ar-p').value||'2');
    const d = parseInt(document.getElementById('arima-d').value||'1');
    const q = parseInt(document.getElementById('ma-q').value||'2');
    const s = parseInt(document.getElementById('season-s').value||'0');
    const { labels, yTrue, yHat } = StatModels.runSARIMA(TS_STATE.dates, TS_STATE.close, p, d, q, s);
    showStat(labels, yTrue, yHat, `SARIMA(${p},${d},${q}) s=${s} (approx)`);
  });

  // 4) ML placeholder
  new Chart(document.getElementById('chart-ml'), {type:'bar', data:{labels:['T1','T2','T3'], datasets:[{label:'Demo', data:[3,5,2]}]}, options:{responsive:true, maintainAspectRatio:false}});

  // 5) LSTM (데모)
  const lstm = Models.LSTM.init('chart-lstm','lstm-status');
  document.getElementById('btn-lstm').addEventListener('click', async ()=>{
    const btn = document.getElementById('btn-lstm');
    btn.disabled = true;
    await Models.LSTM.trainAndPredict(lstm);
    btn.disabled = false;
  });

  // 6) 최신
  Models.TRANS.init('chart-transformer');
});
