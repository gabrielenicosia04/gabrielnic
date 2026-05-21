# Pattern Onde Intrecciate — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Creare una pagina HTML full-screen che genera un pattern di linee ondulate verticali intrecciate con curve di connessione.

**Architecture:** Singola pagina HTML con canvas full-screen. La logica di disegno è separata dalla configurazione e dal setup. I parametri sono esposti in un oggetto globale modificabile.

**Tech Stack:** HTML5, CSS3, Canvas 2D API (vanilla JS)

**File Structure:**
- `index.html` — struttura pagina con canvas
- `style.css` — stili full-screen
- `config.js` — oggetto `CONFIG` con tutti i parametri e valori default
- `pattern.js` — funzione `drawPattern(canvas, config)` che disegna il pattern
- `main.js` — setup canvas, resize handling, chiamata a `drawPattern`

---

### Task 1: index.html

**Files:**
- Create: `index.html`

- [ ] **Write index.html**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pattern Onde Intrecciate</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <canvas id="canvas"></canvas>
  <script src="config.js"></script>
  <script src="pattern.js"></script>
  <script src="main.js"></script>
</body>
</html>
```

---

### Task 2: style.css

**Files:**
- Create: `style.css`

- [ ] **Write style.css**

```css
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
  background: #fff;
}
```

---

### Task 3: config.js

**Files:**
- Create: `config.js`

- [ ] **Write config.js**

```javascript
const CONFIG = {
  // Geometria
  numLines: 20,
  amplitude: 30,
  frequency: 0.02,
  phaseShift: Math.PI / 4,
  curveHeightRatio: 0.1,
  curveTension: 0.5,
  resolution: 2,
  mirrorX: false,
  mirrorY: false,

  // Stile
  lineWidth: 3,
  lineWidthMin: null,
  lineWidthMax: null,
  strokeStyle: '#333',
  backgroundColor: '#fff',
  opacity: 1.0,
  lineCap: 'round',
  useGradient: false,

  // Randomicità
  amplitudeJitter: 0,
  frequencyJitter: 0,
};
```

---

### Task 4: pattern.js

**Files:**
- Create: `pattern.js`

- [ ] **Write pattern.js**

```javascript
function drawPattern(canvas, config) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // Sfondo
  ctx.fillStyle = config.backgroundColor;
  ctx.fillRect(0, 0, w, h);

  // Genera dati linee con jitter
  const spacing = w / (config.numLines + 1);
  const lines = [];
  for (let i = 0; i < config.numLines; i++) {
    const idx = config.mirrorX ? (config.numLines - 1 - i) : i;
    const baseX = spacing * (idx + 1);
    const amp = (config.mirrorY ? -1 : 1) * (config.amplitude
      + (Math.random() - 0.5) * 2 * (config.amplitudeJitter || 0));
    const freq = config.frequency
      + (Math.random() - 0.5) * 2 * (config.frequencyJitter || 0);
    const phase = i * (config.phaseShift || Math.PI / 4);

    lines.push({
      x: (y) => baseX + amp * Math.sin(2 * Math.PI * freq * y + phase),
      baseX,
      amp,
      freq,
      phase,
    });
  }

  // Setup stile
  ctx.globalAlpha = config.opacity ?? 1.0;
  ctx.lineCap = config.lineCap || 'round';

  // Determina se usare gradient
  let gradient;
  if (config.useGradient) {
    gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, config.strokeStyle[0] || config.strokeStyle);
    gradient.addColorStop(1, config.strokeStyle[1] || config.strokeStyle);
  }

  const curveHeight = h * (config.curveHeightRatio || 0.1);
  const tension = config.curveTension ?? 0.5;
  const step = Math.max(1, config.resolution || 2);

  // Disegna i corpi delle linee (sine wave)
  for (let i = 0; i < config.numLines; i++) {
    const color = getLineColor(config, i, gradient);
    ctx.strokeStyle = color;
    ctx.lineWidth = getLineWidth(config, i, h);

    ctx.beginPath();
    ctx.moveTo(lines[i].x(0), 0);
    for (let y = step; y <= h; y += step) {
      ctx.lineTo(lines[i].x(y), y);
    }
    ctx.stroke();
  }

  // Connessioni top: coppie (0,1), (2,3), (4,5), ...
  for (let i = 0; i < config.numLines - 1; i += 2) {
    const color = getConnectionColor(config, i, i + 1, gradient, 'top');
    ctx.strokeStyle = color;
    ctx.lineWidth = getConnectionLineWidth(config, i, h);

    const x0 = lines[i].x(0);
    const x1 = lines[i + 1].x(0);

    ctx.beginPath();
    ctx.moveTo(x0, 0);
    ctx.bezierCurveTo(x0, curveHeight * tension, x1, curveHeight * tension, x1, 0);
    ctx.stroke();
  }

  // Connessioni bottom: coppie (1,2), (3,4), (5,6), ...
  for (let i = 1; i < config.numLines - 1; i += 2) {
    const color = getConnectionColor(config, i, i + 1, gradient, 'bottom');
    ctx.strokeStyle = color;
    ctx.lineWidth = getConnectionLineWidth(config, i, h);

    const x0 = lines[i].x(h);
    const x1 = lines[i + 1].x(h);

    ctx.beginPath();
    ctx.moveTo(x0, h);
    ctx.bezierCurveTo(x0, h - curveHeight * tension, x1, h - curveHeight * tension, x1, h);
    ctx.stroke();
  }
}

function getLineColor(config, i, gradient) {
  if (config.useGradient && gradient) return gradient;

  const style = config.strokeStyle;
  if (Array.isArray(style)) {
    return style[i % style.length];
  }
  return style;
}

function getConnectionColor(config, i, j, gradient, position) {
  if (config.useGradient && gradient) return gradient;

  const style = config.strokeStyle;
  if (Array.isArray(style)) {
    return style[Math.min(i, j) % style.length];
  }
  return style;
}

function getLineWidth(config, i, height) {
  if (config.lineWidthMin != null && config.lineWidthMax != null) {
    const t = i / Math.max(1, config.numLines - 1);
    return config.lineWidthMin + (config.lineWidthMax - config.lineWidthMin) * t;
  }
  return config.lineWidth || 3;
}

function getConnectionLineWidth(config, i, height) {
  return config.lineWidth || 3;
}
```

---

### Task 5: main.js

**Files:**
- Create: `main.js`

- [ ] **Write main.js**

```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resize() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.scale(dpr, dpr);
  drawPattern(canvas, CONFIG);
}

window.addEventListener('resize', resize);
resize();
```

---

### Task 6: Verifica finale

- [ ] **Aprire index.html in browser**

Run: `open index.html` (macOS) o aprire manualmente il file nel browser

Expected: Canvas full-screen con pattern di linee ondulate verticali collegate da curve a ∩ in alto e ∪ in basso, sfasate per creare l'intreccio.

- [ ] **Testare parametri modificando CONFIG**

Aprire console del browser e modificare parametri, poi chiamare:
```javascript
CONFIG.numLines = 10;
CONFIG.amplitude = 50;
CONFIG.frequency = 0.01;
drawPattern(canvas, CONFIG);
```

Expected: Il pattern si aggiorna con nuovi parametri senza ricaricare la pagina.

- [ ] **Testare resize**

Ridimensionare la finestra. Expected: Il canvas si adatta e ridisegna il pattern.
