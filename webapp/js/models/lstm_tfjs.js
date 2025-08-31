window.Models = window.Models || {};
window.Models.LSTM = (() => {
  let chart, statusEl;

  const init = (canvasId, statusId) => {
    statusEl = document.getElementById(statusId);
    const ctx = document.getElementById(canvasId).getContext('2d');
    const lbls = TSData.labels(120);
    chart = Charts.line(ctx, lbls, [{
      label:'실제(정규화)', data:Array(120).fill(null), borderColor:'rgb(16,185,129)'
    },{
      label:'예측', data:Array(120).fill(null), borderColor:'rgb(244,63,94)'
    }]);
    return chart;
  };

  const trainAndPredict = async () => {
    status('데이터 준비 중…');
    const raw = TSData.gen(140, 100);
    const norm = TSData.minmax(raw);
    const { X, y } = TSData.makeWindows(norm, 20);
    const split = Math.floor(X.length*0.8);
    const xTr = tf.tensor3d(X.slice(0,split).map(w=>w.map(v=>[v]))); // [N,20,1]
    const yTr = tf.tensor2d(y.slice(0,split), [split,1]);
    const xTe = tf.tensor3d(X.slice(split).map(w=>w.map(v=>[v])));
    const yTe = tf.tensor2d(y.slice(split), [X.length-split,1]);

    status('모델 구성…');
    const model = tf.sequential();
    model.add(tf.layers.lstm({ units:16, inputShape:[20,1], returnSequences:false }));
    model.add(tf.layers.dense({ units:1 }));
    model.compile({ optimizer:tf.train.adam(0.01), loss:'mse' });

    status('학습 중…(10 epochs)');
    await model.fit(xTr, yTr, { epochs:10, batchSize:16, verbose:0 });

    status('예측 중…');
    const pred = model.predict(xTe).dataSync();

    status('차트 갱신…');
    const show = norm.slice(0,120);
    const startIdx = 20 + split;
    const predSeries = Array(120).fill(null);
    for (let i=0; i<pred.length && (startIdx+i)<120; i++) predSeries[startIdx+i] = pred[i];

    chart.data.datasets[0].data = show;
    chart.data.datasets[1].data = predSeries;
    chart.update();

    xTr.dispose(); yTr.dispose(); xTe.dispose(); yTe.dispose(); model.dispose();
    status('완료!');
  };

  const status = (msg) => { if (statusEl) statusEl.textContent = msg; };

  return { init, trainAndPredict };
})();