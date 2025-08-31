// Tabs
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const id = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(s=>s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(id).classList.add('active');
    // Chart.js 반응형을 위해 약간의 지연 후 리사이즈 트리거
    setTimeout(()=>window.dispatchEvent(new Event('resize')), 50);
  });
});

// Shared state
window.TS_STATE = { dates: [], close: [], closeTransformed: null };

window.addEventListener('DOMContentLoaded', async ()=>{
  const preStart = document.getElementById('pre-start');
  const preEnd   = document.getElementById('pre-end');
  const preBtn   = document.getElementById('pre-preview');
  const preReset = document.getElementById('pre-reset');
  let prepChart = null;

  const ensurePrepChart = () => {
    if (prepChart) return prepChart;
    const ctx = document.getElementById('chart-prep').getContext('2d');
    prepChart = new Chart(ctx, {
      type: 'line',
      data: { labels: [], datasets: [{ label:'Close', data:[], borderColor:'rgb(37,99,235)', tension:.12 }]},
      options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}}
    });
    return prepChart;
  };

  // ✅ 기본 CSV 자동 로드 (webapp/data/tsla_sample.csv)
  try {
    const raw = await fetch("data/tsla_sample.csv", { cache:'no-store' }).then(r=>{
      if(!r.ok) throw new Error('CSV fetch 실패');
      return r.text();
    });
    const parsed = TSData.parseCSVDateClose(raw);
    TS_STATE.dates = parsed.dates;
    TS_STATE.close = parsed.closes;
  } catch (e){
    console.error(e);
    alert("기본 데이터 로드 실패: webapp/data/tsla_sample.csv 경로를 확인하세요.");
  }

  const redraw = ()=>{
    const {dates, values} = TSData.sliceByDate(TS_STATE.dates, TS_STATE.close, preStart.value, preEnd.value);
    const ch = ensurePrepChart();
    ch.data.labels = dates;
    ch.data.datasets[0].data = values;
    ch.update();
  };

  preBtn.addEventListener('click', redraw);
  preReset.addEventListener('click', ()=>{
    preStart.value=''; preEnd.value='';
    redraw();
  });

  // 처음에도 한번 그려주기
  redraw();

  // === 아래부터 시계열분석, 통계모델 등은 TS_STATE 재사용 ===
  // 2) 시계열분석
  // 이동평균/지수평활
  const maBtn = document.getElementById('btn-ma-es');
  const maWin = document.getElementById('ma-window');
  const esAlpha = document.getElementById('es-alpha');
  let maChart = new Chart(document.getElementById('chart-ma-es'), { type:'line', data:{labels:[], datasets:[]},
    options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}}});

  maBtn.addEventListener('click', ()=>{
    if (!TS_STATE.close.length) return alert('기본 CSV가 로드되지 않았습니다.');
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
    options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}}});
  deBtn.addEventListener('click', ()=>{
    if (!TS_STATE.close.length) return alert('기본 CSV가 로드되지 않았습니다.');
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
    options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}}});
  acfBtn.addEventListener('click', ()=>{
    if (!TS_STATE.close.length) return alert('기본 CSV가 로드되지 않았습니다.');
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
    options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}}});
  stBtn.addEventListener('click', ()=>{
    if (!TS_STATE.close.length) return alert('기본 CSV가 로드되지 않았습니다.');
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
    options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}}});
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

  // 3) 통계모델 — stat_models.js가 실제 학습/예측/차트/지표를 처리
  const needData = () => {
    if (!TS_STATE.close.length) { alert('CSV 먼저 로드'); return true; }
    return false;
  };

  // AR
  document.getElementById('btn-run-ar').addEventListener('click', async ()=>{
    if (needData()) return;
    const p = parseInt(document.getElementById('ar-p').value||'2');
    await StatModels.runAR(p);
  });

  // MA
  document.getElementById('btn-run-ma').addEventListener('click', async ()=>{
    if (needData()) return;
    const q = parseInt(document.getElementById('ma-q').value||'2');
    await StatModels.runMA(q);
  });

  // ARMA
  document.getElementById('btn-run-arma').addEventListener('click', async ()=>{
    if (needData()) return;
    const p = parseInt(document.getElementById('ar-p').value||'2');
    const q = parseInt(document.getElementById('ma-q').value||'2');
    await StatModels.runARMA(p, q);
  });

  // ARIMA
  document.getElementById('btn-run-arima').addEventListener('click', async ()=>{
    if (needData()) return;
    const p = parseInt(document.getElementById('ar-p').value||'2');
    const d = parseInt(document.getElementById('arima-d').value||'1');
    const q = parseInt(document.getElementById('ma-q').value||'2');
    await StatModels.runARIMA(p, d, q);
  });

  // SARIMA
  document.getElementById('btn-run-sarima').addEventListener('click', async ()=>{
    if (needData()) return;
    const p = parseInt(document.getElementById('ar-p').value||'2');
    const d = parseInt(document.getElementById('arima-d').value||'1');
    const q = parseInt(document.getElementById('ma-q').value||'2');
    const s = parseInt(document.getElementById('season-s').value||'0');
    await StatModels.runSARIMA(p, d, q, s);
  });

  // Auto-ARIMA (버튼이 존재할 때만)
  const autoBtn = document.getElementById('btn-run-auto');
  if (autoBtn){
    autoBtn.addEventListener('click', async ()=>{
      if (needData()) return;
      const s = parseInt(document.getElementById('season-s').value||'0');
      await StatModels.runAutoARIMA(s);
    });
  }

  // 4) ML placeholder
  new Chart(document.getElementById('chart-ml'), {
    type:'bar',
    data:{labels:['T1','T2','T3'], datasets:[{label:'Demo', data:[3,5,2]}]},
    options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}}
  });

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
