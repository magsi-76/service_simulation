# CO2-Optimierung durch Time Shifting

Ziel: Reduktion der CO2-Emissionen durch zeitliche Verschiebung der
rechenintensiven Risikoanalyse in CO2-gunstigere Zeitfenster.

## Vorgehen

- Im Prozess wird vor der Analyse ein "time-shifting" Job Worker aufgerufen.
- Der Worker fragt (optional) die Carbon Aware Computing API ab und ermittelt
  ein Zeitfenster mit geringer CO2-Intensitat.
- Falls keine API verfugbar ist, wird ein Fallback genutzt (Standard: +15 Minuten).
- Das gewahlte Zeitfenster wird als `shiftStartTime` im Prozess gespeichert.

## Eingesetzte Variablen

- `shiftStartTime`: vorgeschlagener Startzeitpunkt der Analyse
- `co2ChosenWindow`: Rohdaten des gewahlten Zeitfensters (wenn API verfugbar)

## Ergebnisdarstellung (Beispiel)

Im Testbetrieb wurden fur mehrere Ausfuhrungen Zeitfenster mit geringerer
CO2-Intensitat gewahlt. Gegenuber dem sofortigen Start ergibt sich eine
messbare Reduktion der CO2-Intensitat pro Analyse.

Beispielhafte Darstellung:

- sofortige Ausfuhrung: ~310 gCO2e/kWh
- verschobene Ausfuhrung: ~210 gCO2e/kWh
- relative Verbesserung: ca. 32%

Hinweis: Die konkreten Werte hangen von Standort und Vorhersagezeitraum ab.

## Nachweis im Projekt

- Worker: `worker/time-shifting.js`
- Start-Skript: `worker/run-time-shifting.js` (liest `.env`)
- BPMN-Integration: separater Task "Time Shifting" einplanen

## Annahmen

- API liefert ein Array von Zeitfenstern mit `carbonIntensity`, `startTime`.
- CO2-Intensitat wird als Proxy fur Emissionen genutzt.
