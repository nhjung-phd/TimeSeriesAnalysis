window.Models = window.Models || {};
window.Models.XGB = (() => {
  let chart;
  const init = (canvasId) => {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const feats = ['Momentum','Volatility','MA Dev','Volume Z','Drawdown'];
    const imp = feats.map(()=> Math.random()*0.6 + 0.2);
    chart = Charts.bar(ctx, feats, [{
      label:'Feature Importance(데모)',
      data: imp, backgroundColor:'rgba(79,70,229,0.5)'
    }]);
    return chart;
  };
  return { init };
})();