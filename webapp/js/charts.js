window.Charts = (() => {
  const base = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'top' }, tooltip: { mode: 'index', intersect: false } },
    scales: { x: { display: true }, y: { display: true } }
  };

  const line = (ctx, labels, series) =>
    new Chart(ctx, { type: 'line', data: { labels, datasets: series }, options: base });

  const bar  = (ctx, labels, series) =>
    new Chart(ctx, { type: 'bar',  data: { labels, datasets: series }, options: base });

  // ACF/PACF 전용: 0 기준선과 막대 그래프
  const acf = (ctx, labels, values, title='ACF') => {
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ label: title, data: values, borderWidth: 0 }]
      },
      options: {
        ...base,
        plugins: {
          ...base.plugins,
          title: { display: true, text: title }
        },
        scales: {
          x: { grid: { display: false } },
          y: { suggestedMin: -1, suggestedMax: 1 }
        }
      }
    });
    return chart;
  };

  return { line, bar, acf };
})();
