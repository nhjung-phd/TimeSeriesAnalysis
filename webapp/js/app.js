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

// Boot
window.addEventListener('DOMContentLoaded', ()=>{
  // 전통
  const arima = Models.ARIMA.init('chart-arima');
  document.getElementById('btn-arima').addEventListener('click', ()=>Models.ARIMA.run(arima));

  const garch = Models.GARCH.init('chart-garch');
  document.getElementById('btn-garch').addEventListener('click', ()=>Models.GARCH.run(garch));

  // ML
  Models.XGB.init('chart-xgb'); // 즉시 렌더

  // DL
  const lstm = Models.LSTM.init('chart-lstm','lstm-status');
  document.getElementById('btn-lstm').addEventListener('click', async ()=>{
    const btn = document.getElementById('btn-lstm');
    btn.disabled = true;
    await Models.LSTM.trainAndPredict(lstm);
    btn.disabled = false;
  });

  // 최신
  Models.TRANS.init('chart-transformer');
});
