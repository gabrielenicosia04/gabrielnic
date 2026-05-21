# SPILLA — Tipografia Cinetica: Lettere che Cuciono un Pantalone

## Concept

Animazione tipografica 2D in HTML/Canvas. La parola **"SPILLA"** (6 lettere) entra nella vita di un **pantalone**, le lettere percorrono la cucitura interna, e il filo esce dal fondo gamba per formare una **spilla da balio** che contiene la parola. Loop continuo, zero dipendenze, controlli con slider.

## Componenti visivi

1. **Pantalone** — silhouette stilizzata di un paio di pantaloni (due gambe), con texture tessuto jeans/tela tramite pattern canvas. Le linee di cucitura sono evidenziate (possono coincidere col percorso del filo).
2. **Tessuto** — pattern a trama incrociata, semi-trasparente (opacità regolabile). Mostra il filo che passa all'interno.
3. **Filo** — linea curva (Bézier) di colore vivo/contrastante. Segue le cuciture del pantalone. Attaccato alla lettera **S** (l'ultima a entrare).
4. **Lettere (S P I L L A)** — caratteri tipografici bold, che si muovono lungo il percorso del filo.

## Sequenza di animazione (loop)

1. Le lettere appaiono sopra la **vita del pantalone**, allineate al centro (tra le due gambe).
2. **A** entra per prima nella vita, scende nella **gamba sinistra**, seguendo la cucitura del fianco interno.
3. **L** (seconda), **L** (terza), **I** (quarta), **P** (quinta) seguono con stagger (ritardo scalato), stesso percorso.
4. **S** entra per **ultima** — ed è attaccata al filo. Il filo segue S.
5. Le lettere percorrono la cucitura lungo la gamba sinistra: fianco interno → cavallo → fondo gamba.
6. Il filo **esce dal fondo della gamba sinistra**, seguito da tutte le lettere.
7. Sotto la gamba sinistra: il filo si arrotola a formare **l'occhiello della spilla da balio**, abbraccia le lettere allineate (S P I L L A in ordine), e si chiude a **punta**.
8. L'animazione ricomincia immediatamente — **loop infinito**.

Restano sempre visibili: il filo dentro/tra le cuciture, e la spilla completa sotto.

## Timing

| Parametro | Valore |
|-----------|--------|
| Durata per lettera | ~2s |
| Stagger tra lettere | ~0.4s |
| Ciclo completo | ~4.5s (con sovrapposizioni) |
| Loop | Continuo, senza gap |

## Tecnologia

- **Piattaforma:** Browser (HTML + CSS + JS)
- **Rendering:** Canvas 2D
- **Dipendenze:** Zero (solo JS vanilla)
- **File unico:** `index.html` con tutto embedded

## Trasformazione lettera → spilla

Le lettere **non cambiano forma**. Sono sempre sé stesse tipograficamente. Ciò che compone la spilla è:
- Il **filo** che disegna il contorno della spilla (occhiello + punta)
- Le **lettere** disposte in linea all'interno del perimetro della spilla

Il lettore vede la parola "SPILLA" racchiusa nella forma di una spilla da balio.

## UI Controlli (Slider)

Pannello overlay (toggle con bottone) con slider per:

| Opzione | Range/Valori |
|---------|-------------|
| Velocità | 0.2x – 3x |
| Colore filo | Color picker |
| Colore lettere | Color picker |
| Spessore filo | 1 – 10 px |
| Opacità tessuto | 0% – 100% |
| Dimensione lettere | 12 – 120 px |
| Stagger delay | 0 – 1.5 s |

## Stile visivo

- **Tipografia:** Bold sans-serif (es. Helvetica, Montserrat)
- **Colori predefiniti:** Tessuto chiaro, filo rosso (tipo filo da cucito), lettere nere
- **Pantalone:** Silhouette stilizzata, linee pulite, texture tessuto all'interno

## File struttura

```
tipografia cinetica/
  index.html              — singolo file con HTML/CSS/JS
  docs/
    superpowers/
      specs/
        2026-05-19-spilla-trousers-typography-design.md
```
