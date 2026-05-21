# Hand Gesture Shape Spawner — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Single HTML file that uses the camera + TensorFlow.js hand pose detection to spawn shapes when different fingers touch the thumb.

**Architecture:** Single self-contained `index.html` with inline CSS/JS. TensorFlow.js + hand-pose-detection + MediaPipe loaded via CDN. A video element captures the camera, a canvas overlay renders landmarks and spawned shapes, and a "Ripulisci" button clears all shapes.

**Tech Stack:** TensorFlow.js, hand-pose-detection (MediaPipe runtime), Canvas 2D, `getUserMedia` API.

**File structure:**
- `index.html` — the entire application
- (no other files)

---

### Task 1: HTML Skeleton, CSS, and CDN Script Loading

**Files:**
- Create: `index.html`

- [ ] **Step 1: Write base HTML structure with CDN scripts**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hand Shape Spawner</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #000; overflow: hidden; font-family: sans-serif; }

    video { display: none; }

    canvas {
      display: block;
      width: 100vw;
      height: 100vh;
      object-fit: cover;
    }

    #clear-btn {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 10;
      padding: 10px 20px;
      font-size: 16px;
      border: none;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      color: white;
      cursor: pointer;
      transition: background 0.2s;
    }
    #clear-btn:hover { background: rgba(255, 255, 255, 0.3); }

    #status {
      position: fixed;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
      color: rgba(255,255,255,0.7);
      font-size: 14px;
      text-align: center;
    }
  </style>
</head>
<body>
  <video id="video" playsinline></video>
  <canvas id="canvas"></canvas>
  <button id="clear-btn">Ripulisci</button>
  <div id="status">Caricamento...</div>

  <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core"></script>
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands"></script>
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection"></script>
  <script>
    // JS goes here in subsequent tasks
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify the file opens and CDN scripts load**

Open `index.html` in a browser. Open DevTools Console. Verify no CDN 404 errors.

---

### Task 2: Camera Initialization and Hand Detector Setup

**Files:**
- Modify: `index.html` (add JS inside the `<script>` tag)

- [ ] **Step 1: Add camera and detector initialization logic**

Replace the empty `<script>` block with:

```html
<script>
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const statusEl = document.getElementById('status');
  const clearBtn = document.getElementById('clear-btn');

  let detector = null;
  let shapes = [];

  const FINGER_MAP = {
    8: 'triangle',
    12: 'square',
    16: 'circle',
    20: 'polygon',
  };

  const THRESHOLD = 10;
  let prevPinchState = {};

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  async function init() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      await video.play();

      await tf.setBackend('webgl');
      const model = handPoseDetection.SupportedModels.MediaPipeHands;
      detector = await handPoseDetection.createDetector(model, {
        runtime: 'mediapipe',
        modelType: 'full',
        maxHands: 4,
      });

      statusEl.textContent = 'Pronto! Fai un pinch per creare forme.';
      requestAnimationFrame(detectLoop);
    } catch (err) {
      statusEl.textContent = 'Errore: ' + err.message;
      console.error(err);
    }
  }

  init();
</script>
```

- [ ] **Step 2: Verify camera works**

Open the file. Confirm camera permission prompt appears and "Pronto!" message shows.

---

### Task 3: Hand Detection Loop — Detect and Render Landmarks

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add the detect loop that renders camera and landmarks**

Add after `init()` call:

```html
<script>
  function drawLandmarks(landmarks) {
    for (const lm of landmarks) {
      const x = lm[0] * canvas.width;
      const y = lm[1] * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#00ff88';
      ctx.fill();
    }
  }

  function drawConnections(landmarks, connections) {
    for (const [i, j] of connections) {
      const xi = landmarks[i][0] * canvas.width;
      const yi = landmarks[i][1] * canvas.height;
      const xj = landmarks[j][0] * canvas.width;
      const yj = landmarks[j][1] * canvas.height;
      ctx.beginPath();
      ctx.moveTo(xi, yi);
      ctx.lineTo(xj, yj);
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  async function detectLoop() {
    if (detector) {
      const hands = await detector.estimateHands(video);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      for (const hand of hands) {
        const lm = hand.keypoints.map(kp => [kp.x / video.videoWidth, kp.y / video.videoHeight]);
        drawConnections(lm, CONNECTIONS);
        drawLandmarks(lm);

        // Highlight finger tips
        const tips = [4, 8, 12, 16, 20];
        for (const idx of tips) {
          const kp = hand.keypoints[idx];
          const x = kp.x * canvas.width / video.videoWidth;
          const y = kp.y * canvas.height / video.videoHeight;
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, 2 * Math.PI);
          ctx.fillStyle = '#ff3366';
          ctx.fill();
          ctx.font = '12px sans-serif';
          ctx.fillStyle = 'white';
          ctx.fillText(idx, x + 10, y);
        }
      }
    }
    requestAnimationFrame(detectLoop);
  }

  const CONNECTIONS = [
    [0,1],[1,2],[2,3],[3,4],
    [0,5],[5,6],[6,7],[7,8],
    [0,9],[9,10],[10,11],[11,12],
    [0,13],[13,14],[14,15],[15,16],
    [0,17],[17,18],[18,19],[19,20],
    [5,9],[9,13],[13,17],
  ];
</script>
```

- [ ] **Step 2: Verify landmarks render**

Open file. Confirm dots and connections appear on the hand, with numbered tips in pink.

---

### Task 4: Pinch Detection with Edge Trigger

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add pinch detection logic inside the hand loop**

Replace the `for (const hand of hands)` loop body in `detectLoop` with:

```js
for (const hand of hands) {
  const lm = hand.keypoints.map(kp => [kp.x / video.videoWidth, kp.y / video.videoHeight]);
  drawConnections(lm, CONNECTIONS);
  drawLandmarks(lm);

  const tips = [4, 8, 12, 16, 20];
  for (const idx of tips) {
    const kp = hand.keypoints[idx];
    const x = kp.x * canvas.width / video.videoWidth;
    const y = kp.y * canvas.height / video.videoHeight;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#ff3366';
    ctx.fill();
    ctx.font = '12px sans-serif';
    ctx.fillStyle = 'white';
    ctx.fillText(idx, x + 10, y);
  }

  const thumb = hand.keypoints[4];
  const thumbX = thumb.x / video.videoWidth;
  const thumbY = thumb.y / video.videoHeight;
  const handId = hand.handedness + '_' + hand.keypoints[0].x;

  let closestFinger = null;
  let minDist = Infinity;

  for (const fingerIdx of [8, 12, 16, 20]) {
    const fp = hand.keypoints[fingerIdx];
    const fx = fp.x / video.videoWidth;
    const fy = fp.y / video.videoHeight;
    const dx = fx - thumbX;
    const dy = fy - thumbY;
    const dist = Math.sqrt(dx * dx + dy * dy) * canvas.width;

    if (dist < minDist) {
      minDist = dist;
      closestFinger = fingerIdx;
    }
  }

  const isPinching = minDist < THRESHOLD;
  const wasPinching = prevPinchState[handId] || false;

  if (isPinching && !wasPinching && closestFinger) {
    const shapeType = FINGER_MAP[closestFinger];
    if (shapeType) {
      spawnShape(shapeType);
    }
  }

  prevPinchState[handId] = isPinching;
}
```

- [ ] **Step 2: Add the `spawnShape` function**

Add before `detectLoop`:

```js
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomColor() {
  const h = Math.floor(Math.random() * 360);
  return `hsl(${h}, 70%, 60%)`;
}

function spawnShape(type) {
  const size = randomBetween(30, 60);
  shapes.push({
    type,
    x: randomBetween(size, canvas.width - size),
    y: randomBetween(size, canvas.height - size),
    size,
    color: randomColor(),
  });
}
```

---

### Task 5: Shape Rendering and Clear Button

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add shape drawing functions**

Add before `detectLoop`:

```js
function drawTriangle(ctx, x, y, size) {
  const h = size * (Math.sqrt(3) / 2);
  ctx.beginPath();
  ctx.moveTo(x, y - h / 2);
  ctx.lineTo(x - size / 2, y + h / 2);
  ctx.lineTo(x + size / 2, y + h / 2);
  ctx.closePath();
  ctx.fill();
}

function drawShape(shape) {
  const { type, x, y, size, color } = shape;
  ctx.fillStyle = color;

  switch (type) {
    case 'triangle':
      drawTriangle(ctx, x, y, size);
      break;
    case 'square':
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
      break;
    case 'circle':
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
      ctx.fill();
      break;
    case 'polygon': {
      const sides = 5;
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
        const px = x + (size / 2) * Math.cos(angle);
        const py = y + (size / 2) * Math.sin(angle);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      break;
    }
  }
}
```

- [ ] **Step 2: Add shape rendering to the detect loop**

After `ctx.restore()` (which is after drawing the video) and before the hand loop, add:

```js
for (const shape of shapes) {
  drawShape(shape);
}
```

- [ ] **Step 3: Wire up the clear button**

Add before `init()`:

```js
clearBtn.addEventListener('click', () => {
  shapes = [];
});
```

---

### Task 6: Final Verification

**Files:**
- Verify: `index.html`

- [ ] **Step 1: Open in browser and test all gestures**

Open `index.html`. Verify:
- Camera starts and shows mirrored feed
- Hand landmarks render correctly
- Pinch thumb+index → triangle appears at random position
- Pinch thumb+middle → square appears
- Pinch thumb+ring → circle appears
- Pinch thumb+pinky → pentagon appears
- Multiple shapes accumulate on screen
- Click "Ripulisci" → all shapes disappear
- Both hands work independently
- Repeated same pinch doesn't spam shapes (edge trigger works)

- [ ] **Step 2: Clean up old `prevPinchState` entries for hands no longer visible**

After the hand loop in `detectLoop`, add:

```js
const visibleIds = new Set(hands.map(h => h.handedness + '_' + h.keypoints[0].x));
for (const id in prevPinchState) {
  if (!visibleIds.has(id)) {
    delete prevPinchState[id];
  }
}
```

- [ ] **Step 3: Final review of `index.html`**

Ensure the file is complete, no syntax errors, and opens without issues.
