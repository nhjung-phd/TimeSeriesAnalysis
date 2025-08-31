// js/models/stat_models.js
// 실제 동작하는 AR/MA/ARMA/ARIMA/SARIMA/Auto-ARIMA 구현 (7:3 split)
// 의존: Chart.js, window.ARIMAPromise (cdn.jsdelivr.net/npm/arima/async.js), window.TSData (data.js)

(function () {
  const StatModels = {};
  window.StatModels = StatModels;

  // -------- 공용 유틸 --------
  const ema = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const mae = (y, yhat) => {
    let s = 0, n = Math.min(y.length, yhat.length);
    for (let i = 0; i < n; i++) s += Math.abs(y[i] - yhat[i]);
    return s / n;
  };
  const rmse = (y, yhat) => {
    let s = 0, n = Math.min(y.length, yhat.length);
    for (let i = 0; i < n; i++) {
      const e = (y[i] - yhat[i]);
      s += e * e;
    }
    return Math.sqrt(s / n);
  };

  // 데이터 접근: TSData에서 Close 시계열 읽기 (없으면 예외)
  function getCloseSeries() {
    if (!window.TSData || !TSData.getAll) {
      throw new Error('TSData가 초기화되지 않았습니다. data.js가 먼저 로드되어야 합니다.');
    }
    const { dates, close } = TSData.getAll();
    if (!dates?.length || !close?.length) {
      throw new Error('시계열 데이터가 비어 있습니다.');
    }
    return { dates, close };
  }

  // Chart.js 인스턴스
  let statChart = null;
  function renderChart(dates, actual, predStartIdx, preds) {
    const predSeries = new Array(actual.length).fill(null);
    for (let i = 0; i < preds.length; i++) {
      predSeries[predStartIdx + i] = preds[i];
    }
    const ctx = document.getElementById('chart-stat');
    if (statChart) statChart.destroy();
    statChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: '실제 Close',
            data: actual,
            borderWidth: 1.8,
            tension: 0.15,
          },
          {
            label: '예측',
            data: predSeries,
            borderWidth: 1.8,
            borderDash: [6, 6],
            tension: 0.15,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${Number(ctx.parsed.y).toFixed(2)}` } }
        },
        scales: {
          x: { ticks: { maxTicksLimit: 8 } },
          y: { ticks: { callback: (v) => Number(v).toFixed(0) } }
        }
      }
    });
  }

  // js/models/stat_models.js  안의 ensureARIMA()를 아래로 교체
  let ARIMAClass = null;
  async function ensureARIMA() {
    if (ARIMAClass) return ARIMAClass;

    // 1) index.html에서 전역 Promise를 준 경우
    if (window.ARIMAPromise && typeof window.ARIMAPromise.then === 'function') {
      ARIMAClass = await window.ARIMAPromise;
      return ARIMAClass;
    }
    // 2) 전역 동기 ARIMA가 있는 경우
    if (window.ARIMA) {
      ARIMAClass = window.ARIMA;
      return ARIMAClass;
    }
    // 3) 둘 다 없으면, ESM로 최후의 수단(CDN) 시도
    try {
      const mod = await import('https://cdn.jsdelivr.net/npm/arima@0.2.5/async.js/+esm');
      const maybePromise = (mod && 'default' in mod) ? mod.default : mod;
      ARIMAClass = await maybePromise;
      return ARIMAClass;
    } catch (e) {
      console.error(e);
      throw new Error('ARIMA 로드 실패: CDN 접근 또는 네트워크를 확인하세요.');
    }
  }

  // 공통 실행기: 학습/예측/그리기/메트릭
  async function runWithOptions(opts) {
    const ARIMA = await ensureARIMA();
    const { dates, close } = getCloseSeries();

    const n = close.length;
    if (n < 20) throw new Error('표본이 너무 적습니다(최소 20개 이상 권장).');

    const split = Math.floor(n * 0.7);
    const train = close.slice(0, split);
    const test = close.slice(split);
    const horizon = test.length;

    // 학습
    const model = new ARIMA({ verbose: false, ...opts }).train(train);

    // 예측 (멀티스텝)
    const [pred, _err] = model.predict(horizon);

    // 지표
    const M = {
      mae: mae(test, pred),
      rmse: rmse(test, pred)
    };

    // 차트
    renderChart(dates, close, split, pred);

    // 지표 출력
    const $m = document.getElementById('stat-metrics');
    $m.textContent = `MAE ${M.mae.toFixed(3)}  |  RMSE ${M.rmse.toFixed(3)}`;

    return { pred, metrics: M, split };
  }

  // -------- 공개 API (버튼 핸들러에서 호출) --------
  StatModels.runAR = async function (p = 2) {
    return runSafe(() => runWithOptions({ p, d: 0, q: 0 }));
  };
  StatModels.runMA = async function (q = 2) {
    return runSafe(() => runWithOptions({ p: 0, d: 0, q }));
  };
  StatModels.runARMA = async function (p = 2, q = 2) {
    return runSafe(() => runWithOptions({ p, d: 0, q }));
  };
  StatModels.runARIMA = async function (p = 2, d = 1, q = 2) {
    return runSafe(() => runWithOptions({ p, d, q }));
  };
  // SARIMA: UI엔 계절 주기(s)만 받고, 계절차수(P,D,Q)는 안전한 기본값 사용
  StatModels.runSARIMA = async function (p = 1, d = 1, q = 1, s = 12) {
    const seasonal = Number(s) > 0 ? { P: 1, D: Math.min(1, d), Q: 1, s: Number(s) } : {};
    return runSafe(() => runWithOptions({ p, d, q, ...seasonal }));
  };
  // Auto-ARIMA: 간단한 탐색 상한 (p,d,q)≤(5,2,5), (P,D,Q)≤(2,1,2)
  StatModels.runAutoARIMA = async function (s = 0) {
    const seasonal = Number(s) > 0 ? { P: 2, D: 1, Q: 2, s: Number(s) } : {};
    return runSafe(() => runWithOptions({ auto: true, p: 5, d: 2, q: 5, ...seasonal }));
  };

  async function runSafe(fn) {
    const btns = document.querySelectorAll('#tab-stat button[id^="btn-run-"]');
    btns.forEach(b => b.disabled = true);
    try {
      return await fn();
    } catch (err) {
      console.error(err);
      alert('모델 실행 중 오류: ' + err.message);
    } finally {
      btns.forEach(b => b.disabled = false);
    }
  }
})();