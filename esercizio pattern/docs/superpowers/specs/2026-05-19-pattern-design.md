# Pattern Design — Onde Intrecciate

## Obiettivo

Generare un pattern visivo statico su canvas HTML full-screen composto da linee ondulate verticali che si intrecciano tra loro tramite curve di connessione alle estremità.

## Tecnologia

- HTML + CSS + JavaScript
- Canvas 2D API
- Full-screen responsivo

## Architettura

- Pagina HTML singola
- CSS: `margin: 0`, `overflow: hidden`, canvas occupa `100vw x 100vh`
- JS: ridimensionamento automatico tramite `window.resize`
- Parametri esposti in un oggetto `config` globale per semplice sperimentazione

## Parametri configurabili

### Geometria

| Parametro | Default | Descrizione |
|-----------|---------|-------------|
| `numLines` | 20 | Numero di linee verticali |
| `amplitude` | 30 | Ampiezza dell'onda in pixel |
| `frequency` | 0.02 | Frequenza dell'onda (periodi per pixel) |
| `phaseShift` | `π/4` | Sfasamento progressivo tra linee vicine |
| `curveHeightRatio` | 0.1 | Frazione dell'altezza dedicata alle curve di connessione (top + bottom) |
| `curveTension` | 0.5 | Tensione delle curve di connessione (0 = linea retta, 1 = max arco) |
| `resolution` | 2 | Distanza in pixel tra punti campionati lungo ogni linea |
| `mirrorX` | `false` | Specchia il pattern orizzontalmente |
| `mirrorY` | `false` | Specchia il pattern verticalmente |

### Stile

| Parametro | Default | Descrizione |
|-----------|---------|-------------|
| `lineWidth` | 3 | Spessore del tratto (usato se `lineWidthMin/Max` non impostati) |
| `lineWidthMin` | `null` | Spessore minimo (per spessore variabile lungo Y) |
| `lineWidthMax` | `null` | Spessore massimo (per spessore variabile lungo Y) |
| `strokeStyle` | `'#333'` | Colore singolo o array di colori (cicla per linea) |
| `backgroundColor` | `'#fff'` | Colore di sfondo del canvas |
| `opacity` | 1.0 | Opacità globale delle linee |
| `lineCap` | `'round'` | `'round'` / `'butt'` / `'square'` |
| `useGradient` | `false` | Se `true`, colore sfuma lungo l'asse Y |

### Randomicità

| Parametro | Default | Descrizione |
|-----------|---------|-------------|
| `amplitudeJitter` | 0 | Variazione casuale massima di ampiezza per linea |
| `frequencyJitter` | 0 | Variazione casuale massima di frequenza per linea |

## Pattern di disegno

1. Distribuire `numLines` posizioni base X uniformemente lungo la larghezza del canvas
2. Per ogni linea, generare una sinusoide verticale: `x(y) = baseX + amplitude * sin(2π * frequency * y + phase)`
3. Ad altezza `y < curveHeightRatio * height` (top) e `y > (1 - curveHeightRatio) * height` (bottom), le linee si curvano per connettersi alla linea adiacente
4. Schema di connessione sfalsato:
   - **Top:** linea 0 ↔ 1, 2 ↔ 3, 4 ↔ 5, ...
   - **Bottom:** linea 1 ↔ 2, 3 ↔ 4, 5 ↔ 6, ...
   - Se `numLines` è dispari, ultima linea si connette alla prima
5. La tensione della curva (`curveTension`) controlla quanto è pronunciato l'arco di connessione
6. Ogni linea è disegnata come un unico `Path2D` per pulizia e performance

## Casi limite

- `numLines = 1`: singola linea ondulata senza connessioni
- `amplitude = 0`: linee dritte verticali con solo curve di connessione
- `curveHeightRatio = 0`: nessuna connessione, solo linee ondulate parallele
- `amplitudeJitter > amplitude`: possibile, ma alcune linee potrebbero invertire direzione
- Schermi molto stretti o molto larghi: `numLines` dovrebbe essere regolato per evitare linee troppo vicine

## Struttura del codice (bozza)

```
index.html          — struttura pagina + canvas
style.css           — stili full-screen
pattern.js          — funzione drawPattern(canvas, config)
config.js           — oggetto config con tutti i parametri e valori default
main.js            — setup canvas, resize, chiamata a drawPattern
```
