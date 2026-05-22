# Calamaro Sound-Responsive Animation

## Overview
Single HTML file that morphs a squid SVG between "quiet" and "moving" states based on real-time microphone input. The morphing is linear interpolation of path coordinates, driven by the RMS volume level.

## Architecture
- **Single HTML file** — no dependencies, pure vanilla JS
- **2 hidden source SVGs** (quiet + moving) used as data
- **1 visible SVG** renders the interpolated result in real-time
- **Effects layer** applies shake/zoom to the visible SVG
- **`requestAnimationFrame` loop** — reads audio, computes morphing + shake at 60fps

## Audio Pipeline
1. `navigator.mediaDevices.getUserMedia` → microphone stream
2. `AnalyserNode` (fftSize: 256) → frequency amplitude array
3. RMS computed across all frequencies → raw volume 0–1
4. Exponential moving average smoothing: `smooth = smooth * 0.7 + raw * 0.3`
5. Smoothed value `t` drives morphing and shake intensity

## Morphing
- **Eyes:** paths `d` coordinates interpolated directly (same structure)
- **Tentacles → Penne:** both paths sampled into N equidistant points (200) via `getPointAtLength()`, then each point interpolated linearly
- **Result drawn as a new `<path>`** with `M L L L...` commands
- Formula: `P = P_quiete * (1 - t) + P_movimento * t` where `t ∈ [0, 1]`

## Shake & Zoom Effects
Applied to the entire squid container:
- Translation: `±t * 8px` random jitter
- Rotation: `±t * 2deg`
- Scale: `1.0 + t * 0.03`

## Technical Details
- SVG embedded as inline `<svg>` elements
- Hidden SVGs used as data sources; a third visible SVG renders the interpolated result
- Path sampling via SVG DOM API (`getPointAtLength` / `getTotalLength`)
- No external libraries
