function drawPattern(ctx, w, h, config, time) {
  ctx.fillStyle = config.backgroundColor;
  ctx.fillRect(0, 0, w, h);

  const key = `${config.numLines}-${w}-${h}-${config.amplitude}-${config.frequency}-${config.phaseShift}-${config.mirrorX}-${config.mirrorY}-${config.amplitudeJitter}-${config.frequencyJitter}-${config.weaveAmplitude}-${config.weaveFrequency}`;
  if (drawPattern._cacheKey !== key) {
    drawPattern._cacheKey = key;
    drawPattern._lineData = [];
    const spacing = w / (config.numLines + 1);
    for (let i = 0; i < config.numLines; i++) {
      const idx = config.mirrorX ? (config.numLines - 1 - i) : i;
      const baseX = spacing * (idx + 1);
      const amp = (config.mirrorY ? -1 : 1) * (config.amplitude
        + (Math.random() - 0.5) * 2 * (config.amplitudeJitter || 0));
      const freq = config.frequency
        + (Math.random() - 0.5) * 2 * (config.frequencyJitter || 0);
      const phase = i * (config.phaseShift || Math.PI / 4);
      const weaveAmp = config.weaveAmplitude || 0;
      const weaveFreq = config.weaveFrequency || 0;
      drawPattern._lineData.push({ baseX, amp, freq, phase, weaveAmp, weaveFreq });
    }
  }
  const lineData = drawPattern._lineData;

  ctx.globalAlpha = config.opacity ?? 1.0;
  ctx.lineCap = config.lineCap || 'round';

  let gradient;
  if (config.useGradient) {
    gradient = ctx.createLinearGradient(0, 0, 0, h);
    const colors = Array.isArray(config.strokeStyle)
      ? config.strokeStyle
      : [config.strokeStyle, config.strokeStyle];
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[colors.length - 1]);
  }

  const step = Math.max(1, config.resolution || 2);
  const weaveFreq = config.weaveFrequency || 0.003;
  const bandH = weaveFreq > 0 ? 1 / (2 * weaveFreq) : h;
  const overlap = bandH * 0.2;
  const numBands = Math.ceil(h / bandH);

  for (let b = 0; b < numBands; b++) {
    const y0 = Math.max(0, b * bandH);
    const y1 = Math.min(h, (b + 1) * bandH + overlap);

    const order = [];
    for (let i = 0; i < config.numLines; i++) order.push(i);

    if (b % 2 === 0) {
      order.sort((a, bb) => (a % 2) - (bb % 2));
    } else {
      order.sort((a, bb) => (bb % 2) - (a % 2));
    }

    for (const i of order) {
      const d = lineData[i];
      const phaseOffset = time || 0;
      const x = (y) => d.baseX + d.amp * Math.sin(2 * Math.PI * d.freq * y + d.phase + phaseOffset)
        + d.weaveAmp * Math.sin(2 * Math.PI * d.weaveFreq * y + i * Math.PI + phaseOffset);

      ctx.strokeStyle = getLineColor(config, i, gradient);
      ctx.lineWidth = getLineWidth(config, i, h);

      ctx.beginPath();
      ctx.moveTo(x(y0), y0);
      for (let y = y0 + step; y <= y1; y += step) {
        ctx.lineTo(x(y), y);
      }
      ctx.stroke();
    }
  }
}

function getLineColor(config, i, gradient) {
  if (config.useGradient && gradient) return gradient;
  const style = config.strokeStyle;
  if (Array.isArray(style)) return style[i % style.length];
  return style;
}

function getLineWidth(config, i, h) {
  if (config.lineWidthMin != null && config.lineWidthMax != null) {
    const t = i / Math.max(1, config.numLines - 1);
    return config.lineWidthMin + (config.lineWidthMax - config.lineWidthMin) * t;
  }
  return config.lineWidth || 3;
}
