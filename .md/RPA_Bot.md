# Bonus-Aufgabe 8/9 – RPA Bot (UIPath) Schritt-für-Schritt

## Ausgangslage

- Legacy-System hat keine API, nur Web-Frontend.
- Ziel: Eintrag automatisiert anlegen, bei Fehlern sauberes Fallback.
- Link aus Aufgabenstellung (aktuell 404):  
  `https://anhe0003.github.io/this-and-that/Legazy_Maßnahmen_erfassen.html`

## 1) Vorgehen bei 404 (wichtig)

Da der Link aktuell nicht erreichbar ist, gibt es zwei saubere Wege:

- Prof kontaktieren und korrekten Link erfragen.
- Alternativ: Lokale HTML-Mock-Seite erstellen und damit den Bot testen.

Dokumentiere im Bericht: “Legacy-Frontend-Link aus Aufgabenstellung liefert 404, Bot wurde gegen lokale Mock-Seite getestet.”

## 2) UIPath Bot – Schritt-für-Schritt

### A) Projekt anlegen

1. UIPath Studio öffnen.
2. Neues Projekt: **Process** → Name: `LegacyServiceEntryBot`.
3. Haupt-Workflow: `Main.xaml`.

### B) Config/Inputs definieren

Lege in `Main.xaml` Argumente oder Config an:

- `auftragId` (String)
- `segment` (String)
- `risikoScore` (Number)
- `empfehlung` (String)
- `kontakt` (String) optional
- `legacyUrl` (String) – URL des Frontends

### C) Browser öffnen

1. **Use Application/Browser** Aktivität.
2. `legacyUrl` übergeben.
3. Timeout setzen (z. B. 30s).

### D) Formular befüllen (Beispiel-Logik)

1. `Type Into` für:
   - Auftrags-ID
   - Segment
   - Risiko-Score
   - Handlungsempfehlung
2. Dropdowns: `Select Item` / `Click` auf gewünschte Option.
3. Checkboxen: `Click` (falls vorhanden).

### E) Speichern/Absenden

1. Button “Speichern/Eintragen” klicken.
2. Erfolg prüfen:
   - `Element Exists` mit Erfolgsmeldung oder Eintragstext.

### F) Fehlerbehandlung (Pflicht)

1. **Try/Catch** um den gesamten UI-Block.
2. Bei Fehler:
   - Screenshot (`Take Screenshot`)
   - Log (`Log Message`)
   - `Throw` eigener Fehler (z. B. `RPA_FAILED`)

### G) Rücknahme bei Abbruch

Wenn Prozess abgebrochen wurde und Eintrag existiert:

1. Legacy-Frontend öffnen
2. Eintrag anhand `auftragId` suchen
3. “Löschen/Zurücknehmen” klicken
4. Erfolg prüfen

## 3) Integration in Camunda (Aufgabe 9)

### A) BPMN – RPA Service Task

1. Service Task “RPA Bot ausführen”.
2. **Job Worker** (z. B. via Node/Java/REST) triggert den UIPath Bot.
3. Inputs an den Bot übergeben (auftragId, segment, risikoScore, empfehlung).

### B) Fehlerfall

1. Bei Fehler: Worker wirft Incident (oder leitet zu User Task “Manuell erfassen”).
2. BPMN Pfad:  
   `RPA Failed` → `Manuelle Erfassung` → `Dokumentieren`.

## 4) Nachweis für Abgabe

Für die Abgabe reicht:

- Screenshot vom UIPath Workflow.
- Kurze Beschreibung der Schritte (siehe oben).
- Hinweis auf 404-Link + Test mit Mock-Frontend.
- Beschreibung der Camunda-Integration (Job Worker + Error-Pfad).

## 5) Optional (wenn Link vom Prof kommt)

Wenn der Link aktualisiert ist:

- `legacyUrl` im Bot auf korrekte URL setzen.
- 1–2 Testläufe dokumentieren (Screenshots).
