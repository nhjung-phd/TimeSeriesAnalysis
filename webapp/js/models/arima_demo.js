window.Models = window.Models || {};
window.Models.ARIMA = (() => {
  let chart, actual;
  const init = (canvasId) => {
    const ctx = document.getElementById(canvasId).getContext('2d');
    actual = TSData.gen(40, 100);
    const lbls = TSData.labels(50);
    chart = Charts.line(ctx, lbls, [{
      label:'실제', data:[...actual, ...Array(10).fill(null)],
      borderColor:'rgb(75,192,192)', tension:0.15
    }]);
    return chart;
  };

  const run = () => {
    const last = actual[actual.length-1];
    const fc = Array.from({length:10}, (_,i)=> last + (i+1)*0.6 + (Math.random()-0.5));
    chart.data.datasets = chart.data.datasets.filter(d => d.label !== 'ARIMA 예측(데모)');
    chart.data.datasets.push({
      label:'ARIMA 예측(데모)',
      data:[...Array(actual.length-1).fill(null), actual[actual.length-1], ...fc],
      borderColor:'rgb(255,99,132)', borderDash:[5,5], tension:0.15
    });
    chart.update();
  };

  return { init, run };
})();