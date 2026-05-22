# Calamaro Audio-Reactive Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Single HTML file that animates an SVG squid between "fermo" and "movimento" states based on microphone volume.

**Architecture:** One `index.html` with inline SVG, CSS, and JS. Audio via Web Audio API. Eyes use direct path interpolation (matching path structure). Tentacles and penne use point-sampling path morphing (`getPointAtLength`). All rendering in a `requestAnimationFrame` loop.

**Tech Stack:** Vanilla HTML/CSS/JS, Web Audio API, SVG DOM.

---

### Task 1: HTML scaffold with SVG templates and CSS

**Files:**
- Create: `index.html`

- [ ] **Step 1: Create `index.html` with basic structure**

```html
<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Calamaro Sonoro</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 100%; height: 100%; overflow: hidden; }
body { display: flex; align-items: center; justify-content: center; }
svg { display: block; width: 100%; height: 100%; }
#controls {
  position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
  color: white; font-family: monospace; font-size: 14px;
  background: rgba(0,0,0,0.5); padding: 10px 20px; border-radius: 8px;
}
</style>
</head>
<body>
<svg id="canvas" viewBox="0 0 595.28 841.89">
  <defs id="svg-templates">
    <!-- Fermo SVG will be embedded here as hidden -->
    <g id="svg-fermo" style="display:none">
      ...
    </g>
    <!-- Movimento SVG will be embedded here as hidden -->
    <g id="svg-movimento" style="display:none">
      ...
    </g>
  </defs>
  <!-- Active elements will be rendered here -->
  <g id="sfondo"></g>
  <g id="active-corpo"></g>
  <g id="active-occhi"></g>
  <g id="active-penne"></g>
  <g id="active-tentacoli"></g>
</svg>
<div id="controls">Click per attivare il microfono</div>
<script>
// JS defined in Tasks 2–5
</script>
</body>
</html>
```

- [ ] **Step 2: Embed fermo SVG data**

Copy the entire `<g id="sfondo">`, `<g id="occhi">`, `<g id="corpo">`, `<g id="penne">`, `<g id="tentacoli">` from the fermo SVG into `<g id="svg-fermo" style="display:none">`.

- [ ] **Step 3: Embed movimento SVG data**

Copy the entire `<g id="sfondo">`, `<g id="Livello_1">`, `<g id="corpo">`, `<g id="penne">`, `<g id="tentacoli">` from the movimento SVG into `<g id="svg-movimento" style="display:none">`.

**Note:** The movimento SVG uses `id="Livello_1"` for eyes instead of `id="occhi"`. Standardize to `occhi` by renaming the group in the template.

- [ ] **Step 4: Initialize active SVG from movimento structure**

In the `<script>` block:
```javascript
function initSVG() {
  const template = document.getElementById('svg-movimento');
  const activeCorpo = template.querySelector('#corpo').cloneNode(true);
  document.getElementById('active-corpo').appendChild(activeCorpo);

  const activeOcchi = template.querySelector('#Livello_1').cloneNode(true);
  activeOcchi.id = 'occhi';
  document.getElementById('active-occhi').appendChild(activeOcchi);

  const activePenne = template.querySelector('#penne').cloneNode(true);
  document.getElementById('active-penne').appendChild(activePenne);

  const activeTentacoli = template.querySelector('#tentacoli').cloneNode(true);
  document.getElementById('active-tentacoli').appendChild(activeTentacoli);

  const sfondo = template.querySelector('#sfondo').cloneNode(true);
  document.getElementById('sfondo').appendChild(sfondo);
}
initSVG();
```

After cloning, store references to all moving path elements:
```javascript
const occhiPaths = document.querySelectorAll('#active-occhi path');
const pennePaths = document.querySelectorAll('#active-penne path');
const tentacoliPaths = document.querySelectorAll('#active-tentacoli path');
```

---

### Task 2: Audio pipeline

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add audio setup function**

```javascript
let audioCtx, analyser, dataArray;
let audioEnabled = false;

async function setupAudio() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    audioEnabled = true;
    document.getElementById('controls').textContent = 'Microfono attivo';
  } catch (e) {
    document.getElementById('controls').textContent = 'Errore microfono: ' + e.message;
  }
}
```

- [ ] **Step 2: Add RMS volume function**

```javascript
let smoothVolume = 0;

function getVolume() {
  if (!audioEnabled) return 0;
  analyser.getByteTimeDomainData(dataArray);
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    const val = dataArray[i] / 128 - 1;
    sum += val * val;
  }
  const rms = Math.sqrt(sum / dataArray.length);
  const raw = Math.min(rms * 3, 1);
  smoothVolume = smoothVolume * 0.7 + raw * 0.3;
  return smoothVolume;
}
```

- [ ] **Step 3: Wire mic activation to user gesture**

```javascript
document.addEventListener('click', () => {
  if (!audioCtx) setupAudio();
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}, { once: false });
```

---

### Task 3: Eye path morphing

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Extract fermo and movimento eye path data**

```javascript
function initEyeData() {
  const fermo = document.getElementById('svg-fermo');
  const movimento = document.getElementById('svg-movimento');
  const fermoEyes = fermo.querySelectorAll('#occhi path');
  const movimentoEyes = movimento.querySelectorAll('#Livello_1 path');

  window.eyeData = [];
  for (let i = 0; i < fermoEyes.length; i++) {
    window.eyeData.push({
      rest: fermoEyes[i].getAttribute('d'),
      move: movimentoEyes[i].getAttribute('d')
    });
  }
}
initEyeData();
```

- [ ] **Step 2: Implement path interpolation for matching structures**

```javascript
function interpolatePath(restD, moveD, t) {
  const restNums = restD.match(/[-\d.]+/g).map(Number);
  const moveNums = moveD.match(/[-\d.]+/g).map(Number);
  if (restNums.length !== moveNums.length) return restD;
  const interpolated = restNums.map((n, i) => n + (moveNums[i] - n) * t);
  let idx = 0;
  return restD.replace(/[-\d.]+/g, () => interpolated[idx++].toFixed(2));
}
```

- [ ] **Step 3: Add eye update function**

```javascript
function updateEyes(t) {
  occhiPaths.forEach((path, i) => {
    if (window.eyeData && window.eyeData[i]) {
      path.setAttribute('d', interpolatePath(window.eyeData[i].rest, window.eyeData[i].move, t));
    }
  });
}
```

---

### Task 4: Tentacle & penna path morphing via point sampling

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add path sampling function**

```javascript
function samplePath(d, steps) {
  const ns = 'http://www.w3.org/2000/svg';
  const el = document.createElementNS(ns, 'path');
  el.setAttribute('d', d);
  const len = el.getTotalLength();
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    pts.push(el.getPointAtLength((i / steps) * len));
  }
  return pts;
}
```

- [ ] **Step 2: Pre-sample all moving parts at init**

```javascript
function initMorphData() {
  const fermo = document.getElementById('svg-fermo');
  const movimento = document.getElementById('svg-movimento');
  const STEPS = 40;

  window.penneData = [];
  const fermoPenne = fermo.querySelectorAll('#penne path');
  const movimentoPenne = movimento.querySelectorAll('#penne path');
  for (let i = 0; i < Math.min(fermoPenne.length, movimentoPenne.length); i++) {
    window.penneData.push({
      rest: samplePath(fermoPenne[i].getAttribute('d'), STEPS),
      move: samplePath(movimentoPenne[i].getAttribute('d'), STEPS)
    });
  }

  window.tentacoliData = [];
  const fermoTent = fermo.querySelectorAll('#tentacoli path');
  const movimentoTent = movimento.querySelectorAll('#tentacoli path');
  for (let i = 0; i < Math.min(fermoTent.length, movimentoTent.length); i++) {
    window.tentacoliData.push({
      rest: samplePath(fermoTent[i].getAttribute('d'), STEPS),
      move: samplePath(movimentoTent[i].getAttribute('d'), STEPS)
    });
  }
}
initMorphData();
```

- [ ] **Step 3: Add update functions for penne and tentacoli**

```javascript
function interpolatePoints(restPts, movePts, t) {
  if (restPts.length === 0 || restPts.length !== movePts.length) return '';
  let d = `M ${(restPts[0].x + (movePts[0].x - restPts[0].x) * t).toFixed(2)} ${(restPts[0].y + (movePts[0].y - restPts[0].y) * t).toFixed(2)}`;
  for (let i = 1; i < restPts.length; i++) {
    d += ` L ${(restPts[i].x + (movePts[i].x - restPts[i].x) * t).toFixed(2)} ${(restPts[i].y + (movePts[i].y - restPts[i].y) * t).toFixed(2)}`;
  }
  d += ' Z';
  return d;
}

function updatePenne(t) {
  pennePaths.forEach((path, i) => {
    if (window.penneData && window.penneData[i]) {
      path.setAttribute('d', interpolatePoints(window.penneData[i].rest, window.penneData[i].move, t));
    }
  });
}

function updateTentacoli(t) {
  tentacoliPaths.forEach((path, i) => {
    if (window.tentacoliData && window.tentacoliData[i]) {
      path.setAttribute('d', interpolatePoints(window.tentacoliData[i].rest, window.tentacoliData[i].move, t));
    }
  });
}
```

---

### Task 5: Render loop

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Wire all updates into requestAnimationFrame**

```javascript
function animate() {
  const t = getVolume();
  updateEyes(t);
  updatePenne(t);
  updateTentacoli(t);
  requestAnimationFrame(animate);
}
animate();
```

- [ ] **Step 2: Verify everything works together**

Open `index.html` in a browser. Click to enable microphone. Make noise → the squid should smoothly animate between rest and movement states.

---

### Task 6: Polish and edge cases

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Handle missing mic gracefully**

Show a clear error message in `#controls` if `getUserMedia` fails or is denied. Keep the squid visible (in fermo state).

- [ ] **Step 2: Adjust smoothing and sensitivity**

If animation is too jittery, increase smoothing: `smoothVolume = smoothVolume * 0.85 + raw * 0.15`
If too sluggish, decrease: `smoothVolume = smoothVolume * 0.5 + raw * 0.5`
If max volume doesn't reach full animation, increase RMS multiplier: `Math.min(rms * 4, 1)`

- [ ] **Step 3: Add volume indicator**

```javascript
// In the animate loop, after getVolume:
const pct = Math.round(t * 100);
document.getElementById('controls').textContent = `Volume: ${pct}%`;
```
