const canvas = document.getElementById('canvas');
window._ctx = canvas.getContext('2d');
window._animFrame = null;
window._phaseOffset = 0;
let lastTime = 0;

function resize() {
  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  window._ctx.scale(dpr, dpr);
  drawFrame();
}

function drawFrame() {
  if (CONFIG.animate) {
    const now = performance.now();
    const dt = lastTime ? (now - lastTime) / 1000 : 0;
    lastTime = now;
    window._phaseOffset += dt * (CONFIG.animationSpeed || 0.5);
    drawPattern(window._ctx, window.innerWidth, window.innerHeight, CONFIG, window._phaseOffset);
    window._animFrame = requestAnimationFrame(drawFrame);
  } else {
    drawPattern(window._ctx, window.innerWidth, window.innerHeight, CONFIG, 0);
  }
}

function toggleAnimation() {
  if (window._animFrame) {
    cancelAnimationFrame(window._animFrame);
    window._animFrame = null;
  }
  if (CONFIG.animate) {
    lastTime = 0;
  } else {
    window._phaseOffset = 0;
  }
  drawFrame();
}

window.addEventListener('resize', resize);
resize();
