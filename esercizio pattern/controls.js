const CONTROL_META = {
  numLines:          { label: 'Numero linee',         min: 3,   max: 100, step: 1 },
  amplitude:         { label: 'Ampiezza',             min: 0,   max: 200, step: 1 },
  frequency:         { label: 'Frequenza',            min: 0.001, max: 0.1, step: 0.001 },
  phaseShift:        { label: 'Sfasamento',           min: 0,   max: 6.28, step: 0.05 },
  resolution:        { label: 'Risoluzione',           min: 1,   max: 20,  step: 1 },
  lineWidth:         { label: 'Spessore linee',        min: 0.5, max: 20,  step: 0.5 },
  lineWidthMin:      { label: 'Spessore min',          min: 0.5, max: 20,  step: 0.5 },
  lineWidthMax:      { label: 'Spessore max',          min: 0.5, max: 20,  step: 0.5 },
  opacity:           { label: 'Opacità',               min: 0,   max: 1,   step: 0.01 },
  weaveAmplitude:    { label: 'Intreccio ampiezza',      min: 0,   max: 100, step: 1 },
  weaveFrequency:    { label: 'Intreccio frequenza',     min: 0,   max: 0.02, step: 0.0005 },
  animationSpeed:    { label: 'Velocità animazione',    min: 0,   max: 10,  step: 0.1 },
  amplitudeJitter:   { label: 'Variazione ampiezza',   min: 0,   max: 100, step: 1 },
  frequencyJitter:   { label: 'Variazione frequenza',  min: 0,   max: 0.05, step: 0.001 },
};

function buildControls() {
  const container = document.getElementById('controls');

  for (const [key, meta] of Object.entries(CONTROL_META)) {
    const group = document.createElement('div');
    group.className = 'ctrl-group';

    const label = document.createElement('label');
    const span = document.createElement('span');
    span.textContent = meta.label;
    const val = document.createElement('span');
    val.className = 'val';
    val.id = `val-${key}`;
    val.textContent = CONFIG[key];

    const input = document.createElement('input');
    input.type = 'range';
    input.min = meta.min;
    input.max = meta.max;
    input.step = meta.step;
    input.value = CONFIG[key];
    input.id = `ctrl-${key}`;

    input.addEventListener('input', () => {
      const v = parseFloat(input.value);
      CONFIG[key] = key === 'numLines' || key === 'resolution' ? Math.round(v) : v;
      val.textContent = CONFIG[key];
      redraw();
    });

    label.appendChild(span);
    label.appendChild(val);
    group.appendChild(label);
    group.appendChild(input);
    container.appendChild(group);
  }

  for (const key of ['mirrorX', 'mirrorY', 'useGradient', 'animate']) {
    const div = document.createElement('div');
    div.className = 'ctrl-checkbox';

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id = `ctrl-${key}`;
    cb.checked = CONFIG[key];
    cb.addEventListener('change', () => {
      CONFIG[key] = cb.checked;
      if (key === 'animate') toggleAnimation();
      else redraw();
    });

    const label = document.createElement('label');
    label.htmlFor = `ctrl-${key}`;
    label.textContent = key === 'mirrorX' ? 'Specchio X'
      : key === 'mirrorY' ? 'Specchio Y'
      : key === 'animate' ? 'Animazione'
      : 'Gradiente';

    div.appendChild(cb);
    div.appendChild(label);
    container.appendChild(div);
  }

  const colorKeys = [
    { key: 'strokeStyle', label: 'Colore linee' },
    { key: 'backgroundColor', label: 'Sfondo' },
  ];
  for (const { key, label: lbl } of colorKeys) {
    const group = document.createElement('div');
    group.className = 'ctrl-group';

    const label = document.createElement('label');
    label.textContent = lbl;

    const input = document.createElement('input');
    input.type = 'color';
    input.id = `ctrl-${key}`;
    input.value = CONFIG[key];
    input.addEventListener('input', () => {
      CONFIG[key] = input.value;
      redraw();
    });

    group.appendChild(label);
    group.appendChild(input);
    container.appendChild(group);
  }

  document.getElementById('toggle-controls').addEventListener('click', () => {
    container.classList.toggle('open');
  });
}

function redraw() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  drawPattern(window._ctx, w, h, CONFIG, CONFIG.animate ? (window._phaseOffset || 0) : 0);
}

document.addEventListener('DOMContentLoaded', buildControls);
