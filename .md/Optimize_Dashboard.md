# Optimize Dashboard – Vorschlag (Aufgabe 6)

## Ziel

Klarer Überblick über Prozessleistung, Analysepfade, Fehler und RPA‑Risiken.

## Dashboard 1: Management‑Overview

### 1) Durchlaufzeit Gesamtprozess

- **Widget:** Process Duration (Histogram + Median/P95)
- **Metric:** Duration of Process Instances
- **Filter:** Prozess = Risikoanalyse Niederspannungsnetz
- **Zweck:** Schnell erkennen, ob SLA eingehalten wird.

### 2) Anteil Standard vs. Erweiterte Analyse

- **Widget:** Pie/Bar (Decision Outcome)
- **Variable:** `analyseverfahren`
- **Mapping:** `standard` / `erweitert` (oder `true`/`false`, falls boolean)
- **Zweck:** Anteil der aufwändigen Analysen sichtbar machen.

### 3) Abbruchrate

- **Widget:** KPI (Count / Percent)
- **Variable:** `abgebrochen` oder Abbruch‑Endevent zählen
- **Zweck:** Prozessabbrüche durch Netzplaner verfolgen.

### 4) Reruns pro Auftrag

- **Widget:** Bar / KPI
- **Variable:** `erneut_simulieren` (Entscheidung)
- **Zweck:** Wie oft wird eine Simulation erneut gestartet?

### 5) Fehlerquote Service‑Aufruf

- **Widget:** Incidents by Task
- **Tasks:** Standardanalyse / Erweiterte Analyse
- **Zweck:** Stabilität der Analyse‑Services.

---

## Dashboard 2: Operative Steuerung

### 1) Zeit bis Maßnahme erfasst

- **Widget:** Duration between User Tasks
- **From:** Ergebnis bewerten → Maßnahme im Legacy‑System erfassen
- **Zweck:** Engpass in der manuellen Erfassung erkennen.

### 2) Entscheidungsergebnis

- **Widget:** Bar
- **Variable:** `entscheidung`
- **Werte:** `massnahme`, `keine_massnahme`, `erneut_simulieren`

### 3) RPA‑Fehlschläge

- **Widget:** Incidents by Task (RPA)
- **Fallback:** Manuelle Erfassung

### 4) Risiko‑Heatmap

- **Widget:** Heatmap
- **Achsen:** erwartete Last / Störfälle
- **Metrik:** Risiko‑Score

---

## Daten & Variablen (müssen im Prozess verfügbar sein)

- `analyseverfahren`
- `entscheidung`
- `massnahmeErfasst`
- `riskResponse`
- Optional: `shiftStartTime`, `co2Forecast`

## Reporting‑Zyklus (für Bericht)

- **Wöchentlich:** KPIs + Ausreißer
- **Monatlich:** Trendvergleich + CO2‑Optimierungseffekt
