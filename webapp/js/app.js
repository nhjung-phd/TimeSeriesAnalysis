// js/app.js

// 탭 기능 활성화
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(id).classList.add('active');
    // Chart.js 반응형을 위해 약간의 지연 후 리사이즈 트리거
    setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
  });
});

// 전역 상태 객체
window.TS_STATE = { dates: [], close: [], closeTransformed: null };

// DOM 로딩이 완료되면 실행
window.addEventListener('DOMContentLoaded', async () => {
  const preStart = document.getElementById('pre-start');
  const preEnd = document.getElementById('pre-end');
  const preBtn = document.getElementById('pre-preview');
  const preReset = document.getElementById('pre-reset');
  let prepChart = null;
  
  // 통계/ML 탭의 차트 인스턴스를 관리할 변수
  let statChart = null;

  // ---------- 차트 생성 및 업데이트 함수 ----------

  // 데이터 준비 탭의 차트를 생성/초기화하는 함수
  const ensurePrepChart = () => {
    if (prepChart) return prepChart;
    const ctx = document.getElementById('chart-prep').getContext('2d');
    prepChart = new Chart(ctx, {
      type: 'line',
      data: { labels: [], datasets: [{ label: 'Close', data: [], borderColor: 'rgb(37,99,235)', tension: .12 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });
    return prepChart;
  };

  // 통계 모델 탭의 차트를 생성/업데이트하는 함수
  const showStat = (labels, yTrue, yHat, title) => {
    const ctx = document.getElementById('chart-stat').getContext('2d');
    const series = [
      { label: '실제값 (Test)', data: yTrue, borderColor: 'rgb(59, 130, 246)', tension: 0.1, pointRadius: 0 },
      { label: '예측값', data: yHat, borderColor: 'rgb(239, 68, 68)', tension: 0.1, pointRadius: 0 }
    ];

    if (statChart) {
      statChart.destroy(); // 이전 차트가 있으면 파괴
    }
    
    statChart = Charts.line(ctx, labels, series);
    
    if (statChart.options.plugins.title) {
      statChart.options.plugins.title.display = true;
      statChart.options.plugins.title.text = title;
    }
    statChart.update();
    
    // MAE, RMSE 값 업데이트
    const maeVal = TSData.mae(yTrue, yHat).toFixed(3);
    const rmseVal = TSData.rmse(yTrue, yHat).toFixed(3);
    document.getElementById('stat-metrics').innerHTML = `MAE: <span class="font-bold">${maeVal}</span> / RMSE: <span class="font-bold">${rmseVal}</span>`;
  }

  // 데이터가 로드되었는지 확인하는 헬퍼 함수
  const needData = () => {
    if (!TS_STATE.dates || TS_STATE.dates.length === 0) {
      alert('먼저 CSV 파일을 로드해주세요.');
      return true;
    }
    return false;
  };

  // ---------- 이벤트 리스너 설정 ----------

  // 1) 데이터 로드 및 준비
  // 기본 CSV 자동 로드 (tsla_sample.csv)
  try {
    const res = await fetch('./tsla_sample.csv');
    if (!res.ok) throw new Error('기본 CSV 파일을 찾을 수 없습니다.');
    const text = await res.text();
    const { dates, closes } = TSData.parseCSVDateClose(text);
    window.TS_STATE = { dates, close: closes };
    const chart = ensurePrepChart();
    chart.data.labels = dates;
    chart.data.datasets[0].data = closes;
    chart.update();
    preStart.value = dates[0];
    preEnd.value = dates[dates.length - 1];
  } catch (e) {
    console.warn(e);
    document.getElementById('csv-info').textContent = 'tsla_sample.csv 로딩 실패. 파일을 직접 업로드해주세요.';
  }

  // 파일 업로드 리스너
  document.getElementById('csv-file').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { dates, closes } = await TSData.loadCSVDateCloseFromFile(file);
      window.TS_STATE = { dates, close: closes, closeTransformed: null };
      const chart = ensurePrepChart();
      chart.data.labels = dates;
      chart.data.datasets[0].data = closes;
      chart.update();
      preStart.value = dates[0];
      preEnd.value = dates[dates.length - 1];
      document.getElementById('csv-info').textContent = `로드됨: ${file.name} (${dates.length} points)`;
    } catch (err) {
      alert('파일 처리 오류: ' + err.message);
    }
  });

  // 데이터 슬라이싱 (미리보기)
  preBtn.addEventListener('click', () => {
    if (needData()) return;
    const { dates, values } = TSData.sliceByDate(TS_STATE.dates, TS_STATE.close, preStart.value, preEnd.value);
    const chart = ensurePrepChart();
    chart.data.labels = dates;
    chart.data.datasets[0].data = values;
    chart.update();
  });

  // 슬라이싱 리셋
  preReset.addEventListener('click', () => {
    if (needData()) return;
    const chart = ensurePrepChart();
    chart.data.labels = TS_STATE.dates;
    chart.data.datasets[0].data = TS_STATE.close;
    chart.update();
  });

  // 2) 데이터 탐색 (ACF/PACF)
  document.getElementById('btn-run-acf').addEventListener('click', () => {
    if (needData()) return;
    const lags = 40;
    const acfData = TSData.acf(TS_STATE.close, lags);
    const pacfData = TSData.pacf(TS_STATE.close, lags);
    const labels = Array.from({ length: lags + 1 }, (_, i) => i);
    Charts.acf(document.getElementById('chart-acf').getContext('2d'), labels, acfData);
    Charts.acf(document.getElementById('chart-pacf').getContext('2d'), labels, pacfData, 'PACF');
  });

  // 3) 통계 모델 (SARIMA)
  document.getElementById('btn-run-sarima').addEventListener('click', async () => {
    if (needData()) return;
    const p = parseInt(document.getElementById('ar-p').value || '2');
    const d = parseInt(document.getElementById('arima-d').value || '1');
    const q = parseInt(document.getElementById('ma-q').value || '2');
    const s = parseInt(document.getElementById('season-s').value || '0');

    // 수정된 StatModels.runSARIMA 호출
    const results = await StatModels.runSARIMA(window.TS_STATE, p, d, q, s);

    // 결과가 있을 경우에만 차트 함수 호출
    if (results) {
      showStat(results.labels, results.yTrue, results.yHat, `SARIMA(${p},${d},${q}) s=${s} (approx)`);
    }
  });

  // 4) 머신러닝 (데모용)
  new Chart(document.getElementById('chart-ml'), {
    type: 'bar',
    data: { labels: ['T1', 'T2', 'T3'], datasets: [{ label: 'Demo', data: [3, 5, 2] }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
  });

  // 5) 딥러닝 (데모용)
  const lstm = Models.LSTM.init('chart-lstm', 'lstm-status');
  document.getElementById('btn-lstm').addEventListener('click', () => Models.LSTM.trainAndPredict(lstm));

  // 6) 최신 모델 (데모용)
  Models.TRANS.init('chart-trans');

}); // End of DOMContentLoaded