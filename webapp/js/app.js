// 탭 기능
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const id = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(s=>s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(id).classList.add('active');
    setTimeout(()=>window.dispatchEvent(new Event('resize')), 50);
  });
});

// 전역 상태
window.TS_STATE = { dates: [], close: [], closeTransformed: null };

window.addEventListener('DOMContentLoaded', async ()=>{
  const preStart = document.getElementById('pre-start');
  const preEnd   = document.getElementById('pre-end');
  const preBtn   = document.getElementById('pre-preview');
  const preReset = document.getElementById('pre-reset');
  const csvInfo  = document.getElementById('csv-info');
  let prepChart = null;
  let statChart = null;

  const ensurePrepChart = ()=>{
    if (prepChart) return prepChart;
    const ctx = document.getElementById('chart-prep').getContext('2d');
    prepChart = new Chart(ctx,{
      type:'line',
      data:{ labels:[], datasets:[{ label:'Close', data:[], borderColor:'rgb(37,99,235)', tension:.12 }]},
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom' } } }
    });
    return prepChart;
  };

  const showStat = (labels, yTrue, yHat, title)=>{
    const ctx = document.getElementById('chart-stat').getContext('2d');
    const series = [
      { label:'실제값 (Test)', data:yTrue, borderColor:'rgb(59, 130, 246)', tension:.1, pointRadius:0 },
      { label:'예측값', data:yHat, borderColor:'rgb(239, 68, 68)', tension:.1, pointRadius:0 }
    ];
    if (statChart) statChart.destroy();
    statChart = Charts.line(ctx, labels, series);
    statChart.options.plugins.title = { display:true, text:title };
    statChart.update();
    const maeVal = TSData.mae(yTrue, yHat).toFixed(3);
    const rmseVal = TSData.rmse(yTrue, yHat).toFixed(3);
    document.getElementById('stat-metrics').innerHTML =
      `MAE: <span class="font-bold">${maeVal}</span> / RMSE: <span class="font-bold">${rmseVal}</span>`;
  };

  const needData = ()=>{
    if (!TS_STATE.dates || TS_STATE.dates.length===0){
      alert('먼저 CSV 파일을 로드해주세요.');
      return true;
    }
    return false;
  };

// app.js 상단 DOMContentLoaded 내부의 "기본 CSV 자동 로드" 구간 교체
// ✅ 기본 CSV 자동 로드
try {
  // index.html 기준으로 절대 URL 계산 (GitHub Pages 서브경로에서도 안전)
//  const CSV_URL = new URL('data/tsla_sample.csv', document.baseURI).href;
  const CSV_URL = 'https://nhjung-phd.github.io/TimeSeriesAnalysis/data/tsla_sample.csv';


  const res = await fetch(CSV_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error('CSV fetch 실패');
  const text = await res.text();

  const { dates, closes } = TSData.parseCSVDateClose(text);
  TS_STATE.dates = dates;
  TS_STATE.close = closes;

  // 초기 그리기
  const ch = ensurePrepChart();
  ch.data.labels = dates;
  ch.data.datasets[0].data = closes;
  ch.update();

  // 시작/종료일 기본값 세팅
  preStart.value = dates[0];
  preEnd.value   = dates[dates.length - 1];

  // (선택) CSV 정보 표기 요소가 있으면 업데이트
  const infoEl = document.getElementById('csv-info');
  if (infoEl) infoEl.textContent = `샘플 로드: ${CSV_URL} (${dates.length} points)`;
} catch (e) {
  console.error(e);
  const infoEl = document.getElementById('csv-info');
  if (infoEl) infoEl.textContent = '샘플 로딩 실패: 기본 CSV를 찾을 수 없습니다.';
  alert('기본 데이터 로드 실패: 샘플 CSV 경로 또는 서버 구동 상태를 확인하세요.');
}



  // 파일 업로드 (ID: pre-file 로 수정)
  document.getElementById('pre-file').addEventListener('change', async (e)=>{
    const file = e.target.files[0];
    if (!file) return;
    try{
      const { dates, closes } = await TSData.loadCSVDateCloseFromFile(file);
      TS_STATE = { dates, close: closes, closeTransformed: null };
      const chart = ensurePrepChart();
      chart.data.labels = dates;
      chart.data.datasets[0].data = closes;
      chart.update();
      preStart.value = dates[0];
      preEnd.value   = dates[dates.length-1];
      if (csvInfo) csvInfo.textContent = `로드됨: ${file.name} (${dates.length} points)`;
    }catch(err){
      alert('파일 처리 오류: ' + err.message);
    }
  });

  // 기간 슬라이싱 미리보기
  preBtn.addEventListener('click', ()=>{
    if (needData()) return;
    const { dates, values } = TSData.sliceByDate(TS_STATE.dates, TS_STATE.close, preStart.value, preEnd.value);
    const chart = ensurePrepChart();
    chart.data.labels = dates;
    chart.data.datasets[0].data = values;
    chart.update();
  });

  // 원복
  preReset.addEventListener('click', ()=>{
    if (needData()) return;
    const chart = ensurePrepChart();
    chart.data.labels = TS_STATE.dates;
    chart.data.datasets[0].data = TS_STATE.close;
    chart.update();
  });

  /* =========================
 * 2) 시계열분석 — 보강 코드
 * (기존 코드 유지, 없는 핸들러만 추가)
 * ========================= */

// 공통 가드
const _needTS = () => {
  if (!window.TS_STATE || !Array.isArray(TS_STATE.close) || TS_STATE.close.length === 0) {
    alert('먼저 데이터전처리 탭에서 CSV를 로드하세요.');
    return true;
  }
  return false;
};

/* ---- (A) 이동평균/지수평활: btn-ma-es → chart-ma-es ---- */
(() => {
  const btn = document.getElementById('btn-ma-es');
  const canvas = document.getElementById('chart-ma-es');
  if (!btn || !canvas) return; // 요소 없으면 스킵

  let maEsChart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom' } } }
  });

  btn.addEventListener('click', () => {
    if (_needTS()) return;
    const winEl   = document.getElementById('ma-window');
    const alphaEl = document.getElementById('es-alpha');
    const w = Math.max(2, parseInt((winEl?.value ?? '20'), 10));
    const a = Math.min(0.95, Math.max(0.05, parseFloat((alphaEl?.value ?? '0.3'))));

    const labels = TS_STATE.dates;
    const y      = TS_STATE.close;
    const ma     = TSData.movingAverage(y, w);
    const es     = TSData.expSmooth(y, a);

    maEsChart.data.labels = labels;
    maEsChart.data.datasets = [
      { label:'Close',   data:y,  borderColor:'rgb(30,64,175)', tension:.12, pointRadius:0 },
      { label:`MA(${w})`, data:ma, borderColor:'rgb(16,185,129)', tension:.12, pointRadius:0 },
      { label:`ES(α=${a})`, data:es, borderColor:'rgb(244,63,94)', tension:.12, pointRadius:0 },
    ];
    maEsChart.update();
  });
})();

/* ---- (B) 요소분해: btn-decomp → chart-decomp ---- */
(() => {
  const btn = document.getElementById('btn-decomp');
  const canvas = document.getElementById('chart-decomp');
  if (!btn || !canvas) return;

  let decompChart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom' } } }
  });

  btn.addEventListener('click', () => {
    if (_needTS()) return;
    const seasonEl = document.getElementById('decomp-season');
    const s = Math.max(2, parseInt((seasonEl?.value ?? '20'), 10));

    const { trend, seasonal, irregular } = TSData.decomposeAdditive(TS_STATE.close, s);

    decompChart.data.labels = TS_STATE.dates;
    decompChart.data.datasets = [
      { label:'Trend',     data:trend,     borderColor:'rgb(99,102,241)',  tension:.12, pointRadius:0 },
      { label:'Seasonal',  data:seasonal,  borderColor:'rgb(234,179,8)',   tension:.12, pointRadius:0 },
      { label:'Irregular', data:irregular, borderColor:'rgb(107,114,128)', tension:.12, pointRadius:0 },
    ];
    decompChart.update();
  });
})();

/* ---- (C) 정상성 검사: btn-stationarity → chart-stationarity, stat-result ---- */
(() => {
  const btn = document.getElementById('btn-stationarity');
  const badge = document.getElementById('stat-result');
  const canvas = document.getElementById('chart-stationarity');
  if (!btn || !canvas) return;

  let stationChart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom' } } }
  });

  btn.addEventListener('click', () => {
    if (_needTS()) return;
    const wEl = document.getElementById('stat-window');
    const w = Math.max(10, parseInt((wEl?.value ?? '60'), 10));

    const { meanSeries, varSeries, ac1Series, verdict } = TSData.stationarityScan(TS_STATE.close, w);

    if (badge){
      badge.textContent = verdict ? '정상(간이)' : '비정상(간이)';
      badge.style.background = verdict ? '#dcfce7' : '#fee2e2';
      badge.style.color      = verdict ? '#065f46' : '#991b1b';
    }

    stationChart.data.labels = TS_STATE.dates;
    stationChart.data.datasets = [
      { label:'Mean(win)', data: TSData.padLeft(meanSeries), borderColor:'rgb(99,102,241)',  tension:.12, pointRadius:0 },
      { label:'Var(win)',  data: TSData.padLeft(varSeries),  borderColor:'rgb(234,88,12)',  tension:.12, pointRadius:0 },
      { label:'ACF1(win)', data: TSData.padLeft(ac1Series),  borderColor:'rgb(16,185,129)', tension:.12, pointRadius:0 },
    ];
    stationChart.update();
  });
})();

/* ---- (D) 차분/평활화: btn-diff1 / btn-smooth / btn-reset-ts → chart-transform ---- */
(() => {
  const btnDiff   = document.getElementById('btn-diff1');
  const btnSmooth = document.getElementById('btn-smooth');
  const btnReset  = document.getElementById('btn-reset-ts');
  const canvas    = document.getElementById('chart-transform');
  if (!canvas) return;

  let transformChart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom' } } }
  });

  btnDiff?.addEventListener('click', () => {
    if (_needTS()) return;
    const y1 = TSData.diff(TS_STATE.close, 1);
    transformChart.data.labels = TS_STATE.dates.slice(1);
    transformChart.data.datasets = [
      { label:'1차 차분', data:y1, borderColor:'rgb(234,88,12)', tension:.12, pointRadius:0 }
    ];
    transformChart.update();
  });

  btnSmooth?.addEventListener('click', () => {
    if (_needTS()) return;
    const ma5 = TSData.movingAverage(TS_STATE.close, 5);
    transformChart.data.labels = TS_STATE.dates;
    transformChart.data.datasets = [
      { label:'평활(5)', data:ma5, borderColor:'rgb(16,185,129)', tension:.12, pointRadius:0 }
    ];
    transformChart.update();
  });

  btnReset?.addEventListener('click', () => {
    transformChart.data.labels = [];
    transformChart.data.datasets = [];
    transformChart.update();
  });
})();


  // ACF/PACF (ID: btn-acf 로 수정)
  document.getElementById('btn-acf').addEventListener('click', ()=>{
  const btn = document.getElementById('btn-acf');
  const cvACF  = document.getElementById('chart-acf');
  const cvPACF = document.getElementById('chart-pacf');
  if (!btn || !cvACF || !cvPACF) return;

  let acfChart  = null;
  let pacfChart = null;

  btn.addEventListener('click', () => {
    if (!TS_STATE?.close?.length) { alert('먼저 CSV를 로드하세요.'); return; }
    const L = Math.max(1, parseInt(document.getElementById('acf-lag').value || '30', 10));
    const labels = Array.from({length: L+1}, (_,i)=>i);
    const acf  = TSData.acf(TS_STATE.close, L);
    const pacf = TSData.pacf_yw(TS_STATE.close, L);

    // ACF
    if (acfChart) acfChart.destroy();
    acfChart = new Chart(cvACF.getContext('2d'), {
      type:'bar',
      data:{ labels, datasets:[{ label:'ACF', data:acf, backgroundColor:'rgba(59,130,246,.5)' }]},
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{position:'bottom'}, title:{display:true, text:'ACF'} } }
    });

    // PACF
    if (pacfChart) pacfChart.destroy();
    pacfChart = new Chart(cvPACF.getContext('2d'), {
      type:'bar',
      data:{ labels, datasets:[{ label:'PACF', data:pacf, backgroundColor:'rgba(16,185,129,.5)' }]},
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{position:'bottom'}, title:{display:true, text:'PACF'} } }
    });
  });
})();

  // 통계모델: 버튼 리스너 추가
  const readInt = (id, def)=> parseInt(document.getElementById(id).value || String(def));
  document.getElementById('btn-run-ar').addEventListener('click', ()=>{
    if (needData()) return;
    const p = readInt('ar-p', 2);
    StatModels.runAR(p);
  });
  document.getElementById('btn-run-ma').addEventListener('click', ()=>{
    if (needData()) return;
    const q = readInt('ma-q', 2);
    StatModels.runMA(q);
  });
  document.getElementById('btn-run-arma').addEventListener('click', ()=>{
    if (needData()) return;
    const p = readInt('ar-p', 2);
    const q = readInt('ma-q', 2);
    StatModels.runARMA(p, q);
  });
  document.getElementById('btn-run-arima').addEventListener('click', ()=>{
    if (needData()) return;
    const p = readInt('ar-p', 2);
    const d = readInt('arima-d', 1);
    const q = readInt('ma-q', 2);
    StatModels.runARIMA(p, d, q);
  });
  document.getElementById('btn-run-sarima').addEventListener('click', async ()=>{
    if (needData()) return;
    const p = readInt('ar-p', 2);
    const d = readInt('arima-d', 1);
    const q = readInt('ma-q', 2);
    const s = readInt('season-s', 0);
    const results = await StatModels.runSARIMA(window.TS_STATE, p, d, q, s);
    if (results){
      showStat(results.labels, results.yTrue, results.yHat, `SARIMA(${p},${d},${q}) s=${s} (approx)`);
    }
  });

  // ML (데모)
  new Chart(document.getElementById('chart-ml'), {
    type:'bar',
    data:{ labels:['T1','T2','T3'], datasets:[{ label:'Demo', data:[3,5,2] }] },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom' } } }
  });

  // LSTM (데모)
  const lstm = Models.LSTM.init('chart-lstm', 'lstm-status');
  document.getElementById('btn-lstm').addEventListener('click', ()=> Models.LSTM.trainAndPredict(lstm));

  // Transformer 데모는 있을 때만 안전하게 호출
  if (window.Models && window.Models.TRANS && typeof window.Models.TRANS.init === 'function') {
    try { Models.TRANS.init('chart-transformer'); } catch(e){ console.warn(e); }
  }
});
