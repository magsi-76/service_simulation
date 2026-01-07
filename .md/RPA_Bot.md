# Bonus-Aufgabe 8/9 - RPA Bot (UiPath) Nachweis

## Ziel

Automatisierte Erfassung einer Massnahme im Legacy-Frontend und Ruecknahme bei Abbruch.

## Legacy-Frontend (Demo)

URL:
`https://anhe0003.github.io/this-and-that/Legazy_Ma%C3%9Fnahmen_erfassen.html`

## Umsetzung in UiPath

### Workflow: Massnahme anlegen

- Use Application/Browser (Legacy-URL)
- Eingaben:
  - Netzsegment (Select Item / Click + Click Option)
  - Prioritaet (Select Item / Click + Click Option)
  - Risiko (Type Into)
  - Geplanter Termin (Type Into)
  - Kurzbeschreibung (Type Into)
- Click: "Massnahme anlegen"

### Fehlerbehandlung (Pflicht)

- Try/Catch um den gesamten UI-Block
- Catch:
  - Take Screenshot
  - Log Message (Error)
  - Throw: BusinessRuleException("RPA_FAILED")

### Ruecknahme bei Abbruch

- Separater Workflow "RPA Ruecknahme"
- Use Application/Browser (Legacy-URL)
- Click: "Form leeren" als Ruecknahme-Aktion

## Screenshots

Workflow (Massnahme anlegen):
![RPA Workflow](rpa_workflow.png)

Ergebnis im Legacy-Frontend:
![RPA Run Success](rpa_run_success.png)

Fehlerbehandlung (Try/Catch):
![RPA Error Catch](rpa_error_catch.png)

Ruecknahme-Workflow:
![RPA Rollback Workflow](rpa_rollback_workflow.png)

Ruecknahme ausgefuehrt:
![RPA Rollback Run](rpa_rollback_run.png)
