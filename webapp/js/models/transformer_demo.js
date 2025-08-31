window.Models = window.Models || {};
window.Models.TRANS = (()=>{
  const init = (canvasId) => {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const labels = Array.from({length:30}, (_,i)=>i+1);
    const data = labels.map(i=> Math.sin(i/3) + (Math.random()-0.5)*0.2);
    new Chart(ctx, {type:'line', data:{labels, datasets:[{label:'Transformer 데모 시퀀스', data, borderColor:'rgb(99,102,241)'}]},
      options:{responsive:true, maintainAspectRatio:false}});
  };
  return { init };
})();