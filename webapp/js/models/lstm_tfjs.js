window.Models = window.Models || {};
window.Models.LSTM = (()=>{
  const init = (canvasId, statusId) => {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const chart = new Chart(ctx, { type:'line', data:{labels:[], datasets:[]}, options:{responsive:true, maintainAspectRatio:false} });
    return { chart, statusEl: document.getElementById(statusId) };
  };

  const makeToyData = () => {
    const xs = [], ys = [];
    for (let t=0;t<400;t++){ const v = Math.sin(t/12) + Math.random()*0.1; xs.push(v); }
    for (let t=1;t<xs.length;t++) ys.push(xs[t]);
    return xs.slice(0,-1).map((v,i)=>[v]), ys;
  };

  const toTensor = (arr, shape) => tf.tensor(arr, shape);

  const trainAndPredict = async (ctx) => {
    ctx.statusEl.textContent = '학습중...';
    const [xRaw, yRaw] = makeToyData();
    const X = toTensor(xRaw, [xRaw.length, 1, 1]);
    const Y = toTensor(yRaw, [yRaw.length, 1]);
    const model = tf.sequential();
    model.add(tf.layers.lstm({units:16, inputShape:[1,1]}));
    model.add(tf.layers.dense({units:1}));
    model.compile({optimizer:'adam', loss:'mse'});
    await model.fit(X, Y, {epochs:5, batchSize:16, verbose:0});
    // predict next 50
    let last = xRaw[xRaw.length-1];
    const preds=[]; const labels=[];
    for (let i=0;i<50;i++){
      const p = (await model.predict(toTensor([[last]], [1,1,1]))).dataSync()[0];
      preds.push(p); labels.push(`+${i+1}`); last = p;
    }
    ctx.chart.data.labels = labels;
    ctx.chart.data.datasets = [{label:'LSTM 예측(데모)', data:preds, borderColor:'rgb(220,38,38)'}];
    ctx.chart.update();
    ctx.statusEl.textContent = '완료';
  };

  return { init, trainAndPredict };
})();