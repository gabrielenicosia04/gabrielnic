# Salame Dolce — Pagina Ricetta

## Obiettivo

Creare una singola pagina HTML che presenti la ricetta del "salame dolce" con styling自定义, per un progetto universitario.

## Specifiche

### Contenuto

- **Titolo**: "Ricetta Salame Dolce"
- **Ingredienti**: lista puntata con 6 ingredienti (biscotti secchi, cacao, zucchero, burro, uova, zucchero a velo q.b.)
- **Procedimento**: lista numerata in 7 passaggi (dalla sbriciolatura dei biscotti al taglio a fette)
- **Nota**: tempo di riposo in frigo (minimo 4 ore, idealmente tutta la notte)
- **Immagine**: `Foto-blog-4.png` — foto del salame dolce finito, posizionata sopra gli ingredienti

### Style Guide

| Elemento | Dettaglio |
|----------|-----------|
| Font | Helvetica, fallback Arial, sans-serif |
| Sfondo | Nero (`#000`) |
| Testo corpo | Bianco (`#fff`) |
| h1 (titolo) | 25px, blu puro `rgb(0,0,255)` |
| h2 (sezioni) | 20px, blu puro `rgb(0,0,255)` |
| h3 (note) | 15px, bianco `#fff` |

### Layout

- Pagina centrata orizzontalmente
- Larghezza massima contenuto: ~700px
- Padding laterale per margini leggibili
- Immagine centrata, larghezza massima 100% (responsive), bordi arrotondati

### Architettura

- Singolo file `index.html`
- CSS embedded nel `<style>` all'interno del `<head>`
- Self-contained, nessuna dipendenza esterna
- Dichiarazione DOCTYPE html5, lang="it"

### Struttura HTML

```
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>Ricetta Salame Dolce</title>
  <style>/* ... */</style>
</head>
<body>
  <h1>Ricetta Salame Dolce</h1>
  <img src="Foto-blog-4.png" alt="Salame Dolce">
  <h2>Ingredienti</h2>
  <ul>...</ul>
  <h2>Procedimento</h2>
  <ol>...</ol>
  <h3>Consiglio</h3> (tempo di riposo)
</body>
</html>
```

### Testing

Verifica visiva: aprire `index.html` in un browser. Controllare:
- Sfondo nero e testo bianco leggibile
- h1/h2 in blu con dimensioni corrette
- Immagine visibile e centrata
- Elenchi correttamente formattati
