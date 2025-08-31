window.TSData = (() => {
  // 간단한 시계열 생성 (랜덤 워크 + 약간의 추세)
  const gen = (n = 60, start = 100) => {
    const arr = [start];
    for (let i = 1; i < n; i++) arr[i] = arr[i-1] + (Math.random()-0.5)*2 + 0.2;
    return arr;
  };

  const labels = n => Array.from({length:n}, (_,i)=>`T${i+1}`);

  // 정규화
  const minmax = arr => {
    const mn = Math.min(...arr), mx = Math.max(...arr);
    return arr.map(v => (v - mn) / (mx - mn + 1e-9));
  };

  // 슬라이딩 윈도우 (LSTM 학습용)
  const makeWindows = (arr, win = 20) => {
    const X = [], y = [];
    for (let i = 0; i < arr.length - win; i++) {
      X.push(arr.slice(i, i+win));
      y.push(arr[i+win]);
    }
    return { X, y };
  };

  return { gen, labels, minmax, makeWindows };
})();