# Tests & Szenarien (Aufgabe 4)

## Ziel

Nachweis, dass der Prozess in Normal- und Fehlersituationen korrekt funktioniert.

## Szenario 1 – Normalfall (Standardanalyse)

**Eingabe:** Erwartete Last ≤ aktuelle Last \* 1.3, Wetter nicht „schlecht“  
**Erwartung:** Standardanalyse wird ausgeführt, Ergebnisbewertung, Abschluss.

**Schritte:**

1. Start über Formular (Form_Netzdaten).
2. Prüfen (keine Fehler in Daten).
3. DMN → Standardanalyse.
4. Risikoanalyse-Service liefert Ergebnis.
5. Netzingenieur entscheidet „keine Maßnahme“.
6. Abschluss dokumentieren.

**Ergebnis:** Prozess beendet, Endevent „Vorgang abgeschlossen“.

---

## Szenario 2 – Normalfall (Erweiterte Analyse)

**Eingabe:** Erwartete Last > aktuelle Last \* 1.3 ODER Wetter = „schlecht“  
**Erwartung:** Erweiterte Analyse wird ausgeführt.

**Schritte:**

1. Start über Formular.
2. Prüfen (keine Fehler).
3. DMN → Erweiterte Analyse.
4. Risikoanalyse-Service liefert Ergebnis.
5. Entscheidung: „Maßnahme erforderlich“.
6. Legacy-Eintrag erfassen.
7. Abschluss dokumentieren.

**Ergebnis:** Prozess beendet, Maßnahme dokumentiert.

---

## Szenario 3 – Fehlerfall (Analyseservice schlägt fehl)

**Eingabe:** Service nicht erreichbar / Timeout  
**Erwartung:** Incident/Fehler, manuelles Eingreifen oder Retry.

**Schritte:**

1. Start über Formular.
2. Analyse-Service schlägt fehl (z. B. HTTP 500).
3. Incident in Operate sichtbar.
4. Fehler beheben / Retry auslösen.

**Ergebnis:** Prozess läuft nach Retry weiter, Ergebnis wird bewertet.

---

## Szenario 4 – Abbruch durch Netzplaner

**Eingabe:** Abbruch-Message während Bearbeitung  
**Erwartung:** Prozess bricht ab; falls Maßnahme bereits erfasst, wird Rücknahme erzwungen.

**Schritte:**

1. Start Prozess.
2. Während Subprozess: Abbruch-Message (Message Event).
3. Gateway „Maßnahme schon erfasst?“
4. Falls ja: Legacy-Eintrag zurücknehmen.
5. Endevent „Vorgang abgebrochen“.

**Ergebnis:** Prozess sauber beendet.

---

## Szenario 5 – Rerun (Simulation erneut)

**Eingabe:** Netzingenieur wählt „erneut_simulieren“.  
**Erwartung:** Schleife zurück zur Analyseentscheidung (DMN).

**Schritte:**

1. Analyse durchgeführt.
2. Entscheidung „erneut_simulieren“.
3. DMN wird erneut ausgeführt → Standard/Erweitert.
4. Neue Analyseergebnisse, erneute Bewertung.

**Ergebnis:** Prozess läuft weiter bis Abschluss.

---

## Nachweis (für Abgabe)

- Screenshots aus Operate (Happy Path, Error/Incident, Abbruch).
- Kurze Tabelle: Szenario → Erwartung → Ergebnis.
