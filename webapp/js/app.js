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

  // 기본 CSV 자동 로드
// (상단 any import들 뒤 적당한 위치)
const CSV_PATH = './data/tsla_sample.csv';  // ✅ 기본 CSV 경로

// --- 기본 CSV 자동 로드 ---
try {
  const res = await fetch(CSV_PATH);
  if (!res.ok) throw new Error('기본 CSV 파일을 찾을 수 없습니다.');
  const text = await res.text();
  const { dates, closes } = TSData.parseCSVDateClose(text);
  window.TS_STATE = { dates, close: closes };

  const chart = ensurePrepChart();
  chart.data.labels = dates;
  chart.data.datasets[0].data = closes;
  chart.update();

  preStart.value = dates[0];
  preEnd.value   = dates[dates.length - 1];

  // csv-info 요소가 없는 경우를 대비한 널가드
  const infoEl = document.getElementById('csv-info');
  if (infoEl) infoEl.textContent = `샘플 로드: ${CSV_PATH} (${dates.length} points)`;
} catch (e) {
  console.warn(e);
  const infoEl = document.getElementById('csv-info');
  if (infoEl) infoEl.textContent = `샘플 로딩 실패: ${CSV_PATH} 를 확인하거나 직접 업로드하세요.`;as
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

  // ACF/PACF (ID: btn-acf 로 수정)
  document.getElementById('btn-acf').addEventListener('click', ()=>{
    if (needData()) return;
    const lags = parseInt(document.getElementById('acf-lag').value || '30');
    const acfData  = TSData.acf(TS_STATE.close, lags);
    const pacfData = TSData.pacf_yw(TS_STATE.close, lags);
    const labels = Array.from({length: lags+1}, (_,i)=>i);
    Charts.acf(document.getElementById('chart-acf').getContext('2d'),  labels, acfData,  'ACF');
    Charts.acf(document.getElementById('chart-pacf').getContext('2d'), labels, pacfData, 'PACF');
  });

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
