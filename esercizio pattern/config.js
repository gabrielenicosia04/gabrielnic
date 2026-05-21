const CONFIG = {
  // Geometria
  numLines: 20,
  amplitude: 30,
  frequency: 0.02,
  phaseShift: Math.PI / 4,

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

  // Intreccio
  weaveAmplitude: 15,
  weaveFrequency: 0.003,

  // Animazione
  animate: false,
  animationSpeed: 0.5,

  // Randomicità
  amplitudeJitter: 0,
  frequencyJitter: 0,
};
