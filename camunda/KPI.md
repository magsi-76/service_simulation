# KPI und Optimize Dashboard

## KPI (Vorschlag)

- Durchlaufzeit Gesamtprozess (Median, P95)
- Anteil Standard vs. Erweiterte Analyse
- Abbruchrate durch Netzplaner
- Anzahl Simulationen pro Auftrag (Reruns)
- Zeit bis Ma?nahme erfasst (wenn erforderlich)
- Fehlerquote Service-Aufruf (HTTP Connector)
- Anteil RPA-Fehlschlag mit manuellem Fallback

## Reporting-Zyklus

- Wochentlich: KPIs + Ausreisser
- Monatlich: Trendvergleich + CO2-Optimierungseffekt

## Optimize Widgets (Beispiele)

- Process Duration (Median/P95)
- Count by Decision (massnahme/keine/erneut_simulieren)
- Count by Analyseverfahren (Standard/Erweitert)
- Incidents/Failures by Task (Analyse, RPA)
- Heatmap: Storfalle/Last vs. Risiko-Outcome

## Variablen (im Prozess vorhanden)

- analyseverfahren, entscheidung, massnahmeErfasst, riskResponse
- Optional: shiftStartTime, co2Forecast
