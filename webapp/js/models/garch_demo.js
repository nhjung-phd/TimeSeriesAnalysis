window.Models = window.Models || {};
window.Models.GARCH = (() => {
  let chart;
  const init = (canvasId) => {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const price = TSData.gen(80, 100);
    const vol = price.map((v,i,arr)=> i===0?0.5 : Math.abs(arr[i]-arr[i-1]) + Math.random()*0.3);
    const lbls = TSData.labels(price.length);
    chart = new Chart(ctx, {
      type:'bar',
      data:{ labels: lbls,
        datasets:[
          { type:'line', label:'가격', data:price, borderColor:'rgb(99,102,241)', yAxisID:'y' },
          { type:'bar',  label:'변동성(데모)', data:vol, backgroundColor:'rgba(16,185,129,0.35)', yAxisID:'y1' }
        ]
      },
      options:{
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ position:'top' } },
        scales:{ y:{ position:'left' }, y1:{ position:'right', grid:{ drawOnChartArea:false } } }
      }
    });
    return chart;
  };
  const run = () => chart.update();
  return { init, run };
})();