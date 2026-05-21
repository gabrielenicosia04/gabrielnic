# Hand Gesture Shape Spawner — Design Document

## Obiettivo

Applicazione web che usa la fotocamera e TensorFlow.js Hand Pose Detection per rilevare gesti di pinch della mano. A seconda di quale dito tocca il pollice, viene generata una forma geometrica casuale sullo schermo. Un pulsante "Ripulisci" rimuove tutte le forme.

## Architettura

Singolo file HTML. Tre elementi principali:

- **`<video>`** — feed della fotocamera in tempo reale (nascosto alla vista)
- **`<canvas>`** — overlay a schermo intero dove vengono disegnati landmarks, connessioni e forme
- **Bottone "Ripulisci"** — in sovrimpressione, elimina tutte le forme

### Librerie (CDN)

- `@tensorflow/tfjs-core` + `@tensorflow/tfjs-backend-webgl` — backend WebGL per le computazioni
- `@tensorflow-models/hand-pose-detection` — modello di hand pose detection
- `@mediapipe/hands` — runtime MediaPipe per l'esecuzione del modello

### Data Flow

```
Camera → hand detector → landmarks array (per mano)
  → calcolo distanze thumb(4) → finger(8/12/16/20)
  → edge trigger (transizione non-tocco → tocco)
  → spawn forma in array shapes[]
  → render loop: video + landmarks + shapes[] su canvas
```

## Rilevamento Pinch

Per ogni frame, per ogni mano rilevata:

1. Leggo posizione landmark 4 (punta del pollice)
2. Calcolo distanza euclidea da:
   - Landmark 8 (punta indice)   → triangolo
   - Landmark 12 (punta medio)   → quadrato
   - Landmark 16 (punta anulare) → cerchio
   - Landmark 20 (punta mignolo) → poligono
3. Se distanza < 10px → pinch attivo

**Edge trigger:** tengo traccia dello stato precedente per ogni mano. Una forma viene spawnata solo quando si passa da "non in pinch" a "in pinch". Finché le dita restano vicine non si spawnano altre forme.

Vengono tracciate entrambe le mani contemporaneamente.

## Forme

Ogni forma è un oggetto: `{ tipo, x, y, dimensione, colore }`.

| Gesto | Forma | Disegno Canvas |
|-------|-------|----------------|
| Pollice + Indice | Triangolo | 3 vertici equidistanti |
| Pollice + Medio | Quadrato | `fillRect` |
| Pollice + Anulare | Cerchio | `arc` |
| Pollice + Mignolo | Poligono | Pentagono regolare (5 lati) |

- **Posizione X/Y** — casuale, entro i limiti del canvas
- **Dimensione** — casuale tra 30px e 60px
- **Colore** — HSL casuale (saturazione 70%, luminosità 60%)

## Rendering (Ogni Frame)

1. Pulisce il canvas
2. Disegna il frame della fotocamera come sfondo (specchiato)
3. Disegna i landmarks e le connessioni per ogni mano
4. Disegna tutte le forme nell'array `shapes[]`

## UI

- Bottone "Ripulisci" in alto a destra, posizionato con CSS `position: fixed`
- Al click → svuota array `shapes[]` → prossimo frame non disegnerà nulla

## Gestione Errori

- Se la fotocamera non viene trovata o l'utente rifiuta il permesso → messaggio di errore visibile
- Se il modello non si carica → messaggio di attesa
- Se il canvas non è ridimensionato correttamente → ridimensionamento automatico via JS al load/resize
