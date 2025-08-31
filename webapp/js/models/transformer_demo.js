window.Models = window.Models || {};
window.Models.TRANS = (() => {
  const init = (canvasId) => {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const tokens = Array.from({length:12}, (_,i)=>`t${i+1}`);
    const weights = tokens.map(()=> Math.random()*0.9+0.1);
    return Charts.bar(ctx, tokens, [{
      label:'Self-Attention(데모 가중치)', data:weights, backgroundColor:'rgba(100,116,139,0.5)'
    }]);
  };
  return { init };
})();