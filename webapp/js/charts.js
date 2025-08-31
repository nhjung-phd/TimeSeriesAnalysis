window.Charts = (() => {
  const base = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'top' }, tooltip: { mode: 'index', intersect: false } },
    scales: { x: { display: true }, y: { display: true } }
  };
  const line = (ctx, labels, series) => new Chart(ctx, { type: 'line', data: { labels, datasets: series }, options: base });
  const bar  = (ctx, labels, series) => new Chart(ctx, { type: 'bar',  data: { labels, datasets: series }, options: base });
  return { line, bar };
})();