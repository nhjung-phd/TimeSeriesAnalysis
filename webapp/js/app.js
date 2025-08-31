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
      options:{ responsive:true, maintainAspectRatio:false }
    });
    return prepChart;
  };

  // ✅ 기본 CSV 자동 로드
  const raw = await fetch("data/tsla_sample.csv").then(r=>r.text());
  const parsed = TSData.parseCSVDateClose(raw);
  TS_STATE.dates = parsed.dates;
  TS_STATE.close = parsed.closes;

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
});
