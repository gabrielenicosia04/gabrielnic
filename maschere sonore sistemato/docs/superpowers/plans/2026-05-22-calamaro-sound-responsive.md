# Calamaro Sound-Responsive Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Single HTML file that morphs two squid SVGs linearly based on microphone noise level.

**Architecture:** Two hidden source SVGs (quiet + moving), one visible SVG rendering interpolated paths. Web Audio API for mic input drives morphing and shake effects. 60fps via requestAnimationFrame.

**Tech Stack:** Vanilla JS, SVG DOM API, Web Audio API

---

### Task 1: HTML Shell with Embedded SVGs

**Files:**
- Create: `index.html`

- [ ] **Step 1: Create index.html with SVG sources and structure**

```html
<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Calamaro Sound Responsive</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #e7401e;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    overflow: hidden;
    font-family: system-ui, sans-serif;
  }
  #container {
    position: relative;
    width: 595.28px;
    height: 841.89px;
  }
  #container svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .hidden-svg { display: none; }
  #controls {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }
  #controls button {
    padding: 12px 32px;
    font-size: 18px;
    border: none;
    border-radius: 8px;
    background: #fff;
    color: #e7401e;
    cursor: pointer;
    font-weight: bold;
  }
  #controls button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  #status {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: 14px;
    z-index: 10;
  }
</style>
</head>
<body>
  <div id="status">Premi "Avvia" per attivare il microfono</div>

  <div id="container">
    <svg id="output-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 595.28 841.89">
      <rect width="595.28" height="841.89" fill="#e7401e"/>
      <g id="output-occhi"></g>
      <g id="output-corpo"></g>
      <g id="output-morph"></g>
    </svg>
  </div>

  <div id="controls">
    <button id="startBtn">Avvia Microfono</button>
  </div>

  <svg id="quiet-svg" class="hidden-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 595.28 841.89">
    <rect width="595.28" height="841.89" fill="#e7401e"/>
    <g id="quiet-occhi">
      <path d="M190.03,444.76c-14.86-2.98-21.83-17.57-21.38-29.4.48-12.54,8.37-25.07,22.34-27.62,18.26-3.33,31.67,10.93,32.75,27.78,1.05,16.47-13.8,33.23-33.71,29.24Z"/>
      <path d="M393.3,444.78c-14.85-2.84-21.8-17.5-21.45-29.39.37-12.58,8.45-25.04,22.58-27.63,17.81-3.26,31.68,11.24,32.45,27.34.81,16.83-13.53,33.52-33.58,29.68Z"/>
    </g>
    <g id="quiet-corpo">
      <line class="st0" x1="231.15" y1="111.16" x2="227.45" y2="105.83"/>
      <line class="st0" x1="208.38" y1="78.4" x2="201.05" y2="67.85"/>
      <line class="st0" x1="391.91" y1="67.85" x2="385.77" y2="77.14"/>
      <line class="st0" x1="367.6" y1="104.63" x2="363.28" y2="111.16"/>
    </g>
    <g id="quiet-tentacoli">
      <path d="M575.97,550.69c-15.44,20.83-41.01,34.44-70.27,35.89-.23.02-.46.03-.69.04-39.28,1.71-74.33-19.31-97.84-50.87-14.86-19.93-28.44-38.71-45.46-56.62,2.33,22.78,11.38,40.22,20.04,58.84,22.21,47.78,20.14,78.46,16.73,109.08-2.58,23.34-5.94,46.64.08,77.46,7.18,36.74,27.22,64.84,53.72,94.76-60.22-12.31-102.41-67.74-101.76-129.41.17-16.27,1.46-30.03,2.53-42.81,2.51-30.01,3.82-54.56-13.46-93.23l-15.35-34.35-1.45,225.84c-.19,29.57-12.21,55.44-24.72,82.87-13.23-25.64-25.18-53.83-25.36-83.71l-1.31-224.69-13.33,28c-18.61,39.1-18.08,70.04-15.82,99.27,2.24,29.01,6.17,56.33-5.25,88.24-15.4,43.01-49.49,76.27-95.8,84.15,47.65-44.22,67.43-102.77,56.65-165.79-.38-2.21-.72-4.41-1.02-6.6-5.24-38.02.73-74.59,17.05-109.48,8.93-19.11,17.65-36.84,20.21-59.09-16.95,18.36-30.96,36.99-45.73,56.96-16.36,22.11-37.96,38.75-62.92,46.51-11.62,3.62-23.97,5.31-36.85,4.73-29.86-1.35-56.23-16.92-71.36-38.72-17.78-25.61-22.64-56.26-10.61-84.83,11.76-27.92,39.12-47.27,70.85-49.93-29.65,21.48-46.53,51.53-37.46,86.29,4.55,17.47,16.1,32.74,33.23,38.85,18.63,6.65,36.3,4.54,52.2-2.86,29.74-13.83,53.31-46.17,65.48-74.29,17.07,1.29,34.71-1.46,46.84-14.23,12.51-13.18,17.82-30,11.83-48.84-4.33-13.61-16.75-26.03-34.57-31.31,13.02-10.9,29.97-14.92,48.87-17.85-19.26-15.45-45.58-11.38-66.66,4.75-3.49-62.47,1.73-124.21,21.16-183.81l34.73-106.55c-9.43,13.71-17.98,27.89-25.67,42.48-28.78,54.55-45.68,114.93-52.69,178.4-27.67-15.09-55.11-32.39-76.07-57.81,23.03-58.62,63.68-105.61,109.69-148.02,28.59-26.36,59.25-50.94,89.03-75.45,28.72,23.06,59.41,47.54,88.36,74.19,46.91,43.19,89.26,92.08,111.23,149.87-22.31,25.32-48.06,42.03-75.9,57.73-6.86-62.88-23.66-123.89-53.5-180.11-7.3-13.76-15.39-27.24-24.3-40.38l36.26,113.34c18.3,57.22,22.74,116.21,18.61,176.3-21.24-15.99-47.58-20.74-66.49-4.99,19.06,2.92,35.57,7.56,48.82,18.05-27.13,7.69-42.41,31.98-35.03,59.2,6.44,23.77,31.47,39.78,59.18,34.56,15.07,38.83,56.46,86.05,101.05,81.64,5.48-.54,11-1.86,16.52-4.07,26.11-10.43,37.84-36.98,35.41-64.15-2.34-26.11-18.32-43.51-39.25-61.33,33.82,3.22,62.21,24.95,72.55,56.16,9.49,28.66,2.97,57.54-14.96,81.73Z"/>
    </g>
  </svg>

  <svg id="moving-svg" class="hidden-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 595.28 841.89">
    <rect width="595.28" height="841.89" fill="#e7401e"/>
    <g id="moving-occhi">
      <path d="M190.03,444.76c-14.86-2.98-9.48-17.37-9.03-29.2.48-12.54-3.98-25.27,9.99-27.82,18.26-3.33,14.86,11.72,15.93,28.57,1.05,16.47,3.01,32.44-16.89,28.45Z"/>
      <path d="M393.3,444.78c-14.85-2.84-9.37-17.32-9.01-29.21.37-12.58-3.99-25.22,10.14-27.81,17.81-3.26,19.47,11.71,20.24,27.81.81,16.83-1.32,33.05-21.37,29.21Z"/>
    </g>
    <g id="moving-corpo">
      <line class="st0" x1="231.15" y1="111.16" x2="227.45" y2="105.83"/>
      <line class="st0" x1="208.38" y1="78.4" x2="201.05" y2="67.85"/>
      <line class="st0" x1="391.91" y1="67.85" x2="385.77" y2="77.14"/>
      <line class="st0" x1="367.6" y1="104.63" x2="363.28" y2="111.16"/>
    </g>
    <g id="moving-penne">
      <path d="M478.4,475.4c-2.81,5.67-8.09,16.33-8.09,16.33-.23.02-7.8,15.73-18.69,20.63-12.28,5.54-16.38,6.23-36.94,1.19-24.15-5.92-35.94-16.52-52.96-34.43,2.33,22.78,11.38,40.22,20.04,58.84,22.21,47.78,58.44,78.46,55.03,109.08-2.58,23.34-36.22,43.39-30.2,74.21,7.18,36.74-49.25,109.46-44.23,97.41,20.67-49.62,14.7-63.41,8.42-121.28.77-22.99,26.65-37.56,27.72-50.34,2.51-30.01-41.61-54.56-58.89-93.23l-15.35-34.35-1.45,225.84c-.19,29.57-12.21,55.44-24.72,82.87-13.23-25.64-25.18-53.83-25.36-83.71l-1.31-224.69-13.33,28c-31.43,41.69-97.79,74.5-73.44,99.27,15.04,21.32,2.44,32.97-26.51,59.91-42.45,39.51,24.06,68.16,47.63,106.82-61.97-35.63-121.39-46.51-86.33-106.83,24.97-23.99,39.24-33.13,27.03-59.9-13.24-18.38,3.71-44.13,67.44-109.48,14.73-15.1,35.12-75.8,20.21-59.09-12.09,13.55-25.3,21.52-38.05,22.88-7.91.85-36.84-7.55-41.05-21.08-10.2-27.31-23.14-34.18-60.16-34.94-37.63-.78-63.96,28.12-63.9,54.23.09,35.45,23.53,87.04,64.48,87.04,16.13,0-1.25-.04-1.25-.04C-.01,586.62,3.06,537.67,3.06,499.58c0-49.83,34.58-86.78,88.56-86.78,69,0,77.48,27.13,80.79,36.49,2.65,7.48,11.55,23.38,24.41,23.32,15.77-.07,28.8-12.88,40.93-25.65,12.51-13.18,17.82-30,11.83-48.84-4.33-13.61-16.75-26.03-34.57-31.31,13.02-10.9,29.97-14.92,48.87-17.85-19.26-15.45-45.58-11.38-66.66,4.75-3.49-62.47,1.73-124.21,21.16-183.81l34.73-106.55c-9.43,13.71-17.98,27.89-25.67,42.48-28.78,54.55-141.57-27.45-148.58,36.02-27.67-15.09-27.68-20.36-48.64-45.78,23.03-58.62,132.15,24.74,178.16-17.67,28.59-26.36,59.25-50.94,89.03-75.45,28.72,23.06,59.41,47.54,88.36,74.19,46.91,43.19,169.01-4.53,190.98,53.26-22.31,25.32-31.53,41.53-59.37,57.23-6.86-62.88-119.94-26.78-149.78-83-7.3-13.76-15.39-27.24-24.3-40.38l36.26,113.34c18.3,57.22,22.74,116.21,18.61,176.3-21.24-15.99-47.58-20.74-66.49-4.99,19.06,2.92,35.57,7.56,48.82,18.05-27.13,7.69-42.41,31.98-35.03,59.2,6.44,23.77,31.47,39.78,59.18,34.56,25.65,40.78,43.11,8.34,52.16-2.98,4.14-5.18,19.94-44.93,67.03-44.93,43.24,0,71.14,49.79,71.44,76.69.48,42.03-20.04,97.13-80.57,97.13v-.04c115.58-98.19,3.79-192.19-36.31-111.18Z"/>
    </g>
  </svg>

  <script>
    // ... code in subsequent tasks
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify file created**

Run: `ls -la index.html`
Expected: file exists, non-empty

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: initial html shell with embedded svgs"
```

---

### Task 2: Audio Capture and RMS Computation

**Files:**
- Modify: `index.html` (add JS at the bottom, before closing `</body>`)

- [ ] **Step 1: Add audio capture JS**

Replace the `<script>...</script>` placeholder with:

```html
<script>
const startBtn = document.getElementById('startBtn');
const statusEl = document.getElementById('status');
const container = document.getElementById('container');

let audioContext = null;
let analyser = null;
let source = null;
let mediaStream = null;
let isRunning = false;
let smoothVolume = 0;

async function startMicrophone() {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    source = audioContext.createMediaStreamSource(mediaStream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    isRunning = true;
    startBtn.disabled = true;
    startBtn.textContent = 'In ascolto...';
    statusEl.textContent = 'Microfono attivo';
    animate();
  } catch (err) {
    statusEl.textContent = 'Errore: ' + err.message;
    console.error(err);
  }
}

function getVolume() {
  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i] * data[i];
  }
  const rms = Math.sqrt(sum / data.length);
  const normalized = Math.min(1, rms / 128);
  smoothVolume = smoothVolume * 0.7 + normalized * 0.3;
  return smoothVolume;
}

startBtn.addEventListener('click', startMicrophone);
</script>
```

- [ ] **Step 2: Open in browser and test mic button**

Open `index.html` in browser, click "Avvia Microfono".
Expected: browser asks for mic permission, button changes to "In ascolto...", status shows "Microfono attivo"

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add audio capture and rms computation"
```

---

### Task 3: Path Sampling and Interpolation

**Files:**
- Modify: `index.html` (add JS functions inside the `<script>` tag)

- [ ] **Step 1: Add path sampling and interpolation functions**

Add these functions before `startBtn.addEventListener`:

```js
function samplePath(pathEl, numPoints) {
  const len = pathEl.getTotalLength();
  const pts = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = (i / numPoints) * len;
    const p = pathEl.getPointAtLength(t);
    pts.push({ x: p.x, y: p.y });
  }
  return pts;
}

function interpolatePoints(ptsA, ptsB, t) {
  const result = [];
  for (let i = 0; i < ptsA.length; i++) {
    result.push({
      x: ptsA[i].x + (ptsB[i].x - ptsA[i].x) * t,
      y: ptsA[i].y + (ptsB[i].y - ptsA[i].y) * t
    });
  }
  return result;
}

function pointsToPath(pts) {
  return 'M' + pts.map(p => `${p.x},${p.y}`).join('L');
}
```

- [ ] **Step 2: Cache sampled paths on startup**

Add after `startBtn.addEventListener`:

```js
let quietPts = null;
let movingPts = null;
const NUM_POINTS = 200;
let quietEyesPaths = [];
let movingEyesPaths = [];

function cachePaths() {
  const quietTenta = document.querySelector('#quiet-tentacoli path');
  const movingPenne = document.querySelector('#moving-penne path');
  quietPts = samplePath(quietTenta, NUM_POINTS);
  movingPts = samplePath(movingPenne, NUM_POINTS);

  document.querySelectorAll('#quiet-occhi path').forEach(el => {
    quietEyesPaths.push(el.getAttribute('d'));
  });
  document.querySelectorAll('#moving-occhi path').forEach(el => {
    movingEyesPaths.push(el.getAttribute('d'));
  });
}

cachePaths();
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add path sampling and interpolation functions"
```

---

### Task 4: Render Loop with Morphing and Shake

**Files:**
- Modify: `index.html` (add `animate()` and `updateSquid()` functions, extend `cachePaths()`)

- [ ] **Step 1: Extend cachePaths to also sample eye paths**

Replace the existing `quietPts`/`movingPts` declarations and `cachePaths` function. Add the new declarations before the function, and re-call `cachePaths()` after:

```js
const EYE_NUM_POINTS = 100;
let quietPts = null;
let movingPts = null;
let quietEyePoints = [];
let movingEyePoints = [];
const NUM_POINTS = 200;

function cachePaths() {
  const quietTenta = document.querySelector('#quiet-tentacoli path');
  const movingPenne = document.querySelector('#moving-penne path');
  quietPts = samplePath(quietTenta, NUM_POINTS);
  movingPts = samplePath(movingPenne, NUM_POINTS);

  document.querySelectorAll('#quiet-occhi path').forEach(el => {
    quietEyePoints.push(samplePath(el, EYE_NUM_POINTS));
  });
  document.querySelectorAll('#moving-occhi path').forEach(el => {
    movingEyePoints.push(samplePath(el, EYE_NUM_POINTS));
  });
}

cachePaths();
```

- [ ] **Step 2: Add updateSquid() and animate()**

Add before `startBtn.addEventListener`:

```js
function updateSquid(t) {
  const outputMorph = document.getElementById('output-morph');
  const outputOcchi = document.getElementById('output-occhi');

  const interpTenta = interpolatePoints(quietPts, movingPts, t);
  outputMorph.innerHTML = `<path d="${pointsToPath(interpTenta)}" fill="#000"/>`;

  const existingEyes = outputOcchi.querySelectorAll('path');
  quietEyePoints.forEach((qPts, i) => {
    const mPts = movingEyePoints[i];
    const interp = interpolatePoints(qPts, mPts, t);
    const d = pointsToPath(interp) + 'Z';
    if (existingEyes[i]) {
      existingEyes[i].setAttribute('d', d);
    } else {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', '#000');
      outputOcchi.appendChild(path);
    }
  });
}

function animate() {
  if (!isRunning) return;
  const volume = getVolume();
  updateSquid(volume);

  const shakeX = (Math.random() - 0.5) * 2 * volume * 8;
  const shakeY = (Math.random() - 0.5) * 2 * volume * 8;
  const rot = (Math.random() - 0.5) * 2 * volume * 2;
  const scale = 1 + volume * 0.03;
  const outputSvg = document.getElementById('output-svg');
  outputSvg.style.transform = `translate(${shakeX}px, ${shakeY}px) rotate(${rot}deg) scale(${scale})`;

  requestAnimationFrame(animate);
}
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add render loop with morphing and shake"
```

---

### Task 5: Styling and Polish

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add stroke styling to eyes and morph path**

Eyes should be filled, tentacles should look like the original. Update `updateSquid`:

In `updateSquid`, change the morph path creation:
```js
outputMorph.innerHTML = `<path d="${pointsToPath(interpTenta)}" fill="none" stroke="#e7401e" stroke-width="0"/>`;
```

Wait — the path needs a fill. The original tentacoli path uses fill. Let me think about what fill to use.

Actually, looking at the original SVGs, the tentacoli and penne paths have no explicit `fill` attribute set (they're just `<path>` with only `d`). In the original SVG rendering, they would inherit some fill from the parent or default. Let me check... The original SVGs have no fill set on the path inside `tentacoli` and `penne`, so they'd be black by default.

Let me update the morph path to have proper fill:
```js
outputMorph.innerHTML = `<path d="${pointsToPath(interpTenta)}" fill="#000"/>`;
```

And eyes:
```js
const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
path.setAttribute('d', d);
path.setAttribute('fill', '#000');
outputOcchi.appendChild(path);
```

Actually this is already done. Let me also add a nice background and make sure everything looks good.

- [ ] **Step 2: Test in browser**

Open `index.html`, click "Avvia Microfono", make noise.
Expected: squid morphs between quiet and moving states based on volume, shakes with noise.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: finalize styling and polish"
```
