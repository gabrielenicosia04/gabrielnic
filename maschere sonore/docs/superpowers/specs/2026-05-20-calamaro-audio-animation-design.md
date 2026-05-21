# Calamaro Audio-Reactive Animation

## Overview
Single HTML file that animates an SVG squid between two states ("fermo" / "movimento") driven by real-time microphone volume.

## SVG Structure
Both SVGs share the same group ID structure with matching elements inside each group:

| Gruppo     | Elementi | Descrizione             |
|------------|----------|-------------------------|
| `occhi`    | 2 path   | Occhi                   |
| `corpo`    | 1 path   | Corpo centrale (statico) |
| `penne`    | 2 path   | Pinne laterali della testa |
| `tentacoli`| 4 path   | Tentacoli (escluso centrale) |
| `sfondo`   | 1 rect   | Sfondo rosso (#e7401e) |

## Moving Parts & Animation Strategy

### Occhi (path morphing)
Gli occhi nei due SVG hanno una struttura del path identica (M → c × 4 → Z). La funzione di morphing estrae i punti numerici dal `d` attribute e interpola linearmente ogni coordinata tra fermo (0%) e movimento (100%).

### Tentacoli & Penne (transform animation)
I path di tentacoli e penne hanno struttura diversa tra fermo e movimento (numero di comandi diverso) → morphing diretto impossibile.

Strategia: per ogni elemento si usa il path del SVG movimento come riferimento. A volume 0%, una transform (scale + translate + rotate) "riporta" visivamente il tentacolo/penna nella posizione di riposo che ha nel SVG fermo. A volume 100%, la transform è identity (posizione movimento naturale). I valori intermedi interpolano la transform.

La transform per ogni parte è derivata dal confronto dei bounding box tra le due versioni, con transform-origin stimato dal punto di attacco sul corpo.

Le transform-origin sono stimate dai punti di attacco sul corpo (regolabili dall'utente dopo la prima build).

## Audio Pipeline
1. `getUserMedia({ audio: true })` → stream
2. `AudioContext` + `AnalyserNode` (FFT 256)
3. RMS calcolato ogni frame dai valori FFT
4. Normalizzato 0–1 con smooth passa-basso (α ~0.3)
5. Il valore smooth guida direttamente il fattore di animazione: 0 = fermo, 1 = massimo movimento

## Smoothing
- Passa-basso esponenziale: `smooth = smooth * 0.7 + raw * 0.3`
- Previene tremolii e dà risposta naturale

## Render Loop
`requestAnimationFrame`:
1. Legge volume dal microfono
2. Applica smoothing
3. Aggiorna `d` attribute degli occhi con path interpolato
4. Aggiorna `transform` di tentacoli e penne

## File
Singolo `index.html` con tutto inline (SVG, CSS, JS). Nessuna dipendenza esterna. Si apre direttamente nel browser.
