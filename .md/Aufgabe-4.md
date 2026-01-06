# Aufgabe 4 ? Prozessautomatisierung mit Camunda

**Prof. Dr. Andreas Heberle**  
**Abgabe:** 08.01.2026, 18:00 Uhr (ILIAS)  
? Andreas Heberle

## Praktische Anwendung eines BPM-Systems (Camunda BPM)

- Modellierung
- Automatisierung
- Ausf?hrung
- Analyse und Optimierung

**Wichtig:**  
Der Prozess soll nat?rlich auch in Fehlersituationen ein sinnvolles Verhalten zeigen.

---

## Ziele

Ein regionaler Energieversorger f?hrt regelm??ig eine Risikoanalyse f?r sein kleines Niederspannungsnetz durch, das nur wenige, klar definierte Netzsegmente enth?lt. Ziel ist es, potenzielle ?berlastungen und Ausfallrisiken fr?hzeitig zu erkennen.

---

## Prozess ? Risikoanalyse von Stromnetzen

### Ablauf

1. Ein Netzplaner erfasst die grundlegenden Informationen zu den Netzsegmenten und startet den Prozess zur Risikoanalyse
   - ?ber ein Formular **oder**
   - durch einen RESTful Call an das BPMS.
2. Ein Netzingenieur pr?ft die Eingabedaten und stellt bei Fehlern R?ckfragen an den Netzplaner.
3. Automatisiert wird eine Analyse durchgef?hrt, um das Risiko f?r das Stromnetz vorherzusagen.
   - Abh?ngig von den Eingabeparametern wird ein Standardverfahren oder eine erweiterte Analyse gemacht.
   - Die Laufzeit des Analyse-Service kann sehr unterschiedlich sein.
   - Ergebnis: Risikoeinsch?tzung inkl. Handlungsempfehlung.
4. Ein Netzingenieur bewertet das Ergebnis und entscheidet:
   - ob eine Ma?nahme erforderlich ist,
   - ob keine Ma?nahme erforderlich ist,
   - oder ob die Simulation erneut ausgef?hrt werden soll.
5. Falls eine Ma?nahme erforderlich ist: Eintrag in ein **Legacy-Wartungssystem**
   - Das Legacy-System hat **keine API**, nur ein Web-Frontend, daher manuelle Erfassung.
6. Abschluss: Ein Netzingenieur dokumentiert, dass die Ergebnisse gepr?ft und alle Ma?nahmen korrekt eingetragen wurden.

### Abbruchregel

- Ein Netzplaner kann seinen Auftrag w?hrend der Bearbeitung zu jedem Zeitpunkt abbrechen.
- Sollte schon ein Eintrag im Wartungssystem erfolgt sein, muss dieser zur?ckgenommen werden (wieder ?ber das Web-Frontend des Wartungssystems).

---

## Prozessdetails ? Informationen zum Netz

Das Netz des Energieversorgers besteht aus vier Segmenten:

1. Segment A ? Wohngebiet
2. Segment B ? Gewerbegebiet
3. Segment C ? Landwirtschaft
4. Segment D ? Kleines Industriegebiet

F?r jedes Segment liegen folgende Eingangsdaten vor:

- aktuelle Last in kW (> 0)
- erwartete Last f?r die n?chsten 24 Stunden (> 0)
- Wetterlage (gut / mittel / schlecht)
- Anzahl der St?rf?lle im letzten Jahr

---

## Prozessdetails ? Analyseverfahren (DMN)

Die Auswahl des Analyseverfahrens erfolgt automatisiert nach festen Regeln. Diese Regeln sollten m?glichst einfach anpassbar sein.

### Ansatz: DMN (Decision Modeling Notation)

- Regeln werden mit DMN modelliert, als Entscheidungstabelle.
- Durch einfaches Anpassen der Entscheidungstabelle kann ein(e) Netzwerkingenieur(in) Regeln ?ndern, ohne Unterst?tzung durch die IT.
- Die Regeln / Entscheidungstabelle werden im Camunda Modeler definiert.
- Camunda hat eine eingebaute Rules (Decision) Engine zur Ausf?hrung.

### Entscheidungsregeln

- Wenn erwartete Last eines Segments > aktuelle Last \* 1.3 ? **Erweiterte Analyse**
- Wenn Wetter = ?schlecht? ? **Erweiterte Analyse**
- Wenn alle Segmente stabil ? **Standardanalyse**

---

## Prozessdetails ? Services

Die Risikoanalyse wird durch einen RESTful Service implementiert, der folgendes Ergebnis berechnet:

- eine Risiko-Kennzahl pro Segment
- Identifikation eines Top-Risiko-Segments
- Berechnung der Wahrscheinlichkeit einer ?berlastung
- Handlungsempfehlung

### Hinweise

- Die Berechnung ist rechenintensiv und kann sehr unterschiedlich lange dauern.
- Zur Simulation des Service kann ein passend konfigurierter JSON-Server genutzt werden.

---

## Simulation von Services (JSON-Server)

Mit JSON-Server kann man eine RESTful API mit Daten aus einem JSON-File generieren und damit Services simulieren.

- Definieren Sie eine `db.json` Datei mit passenden Daten f?r die Risikobewertung.
- F?r die Aufgabe benutzen wir einen speziellen JSON-Server, der Anfragen mit unterschiedlicher Laufzeit beantwortet.

### Installation und Nutzung

- [https://github.com/lwluc/slowed-down-json-server](https://github.com/lwluc/slowed-down-json-server)

### Standard-URL

- [http://localhost:3000](http://localhost:3000)

### Hinweis

Wenn Sie aus der Cloud von Camunda direkt auf einen Service zugreifen wollen, der unter `localhost` l?uft, dann geht das nicht. Hier kann das Tool **ngrok** helfen. Eine Alternative ist, f?r die Ausf?hrung einen **Job Worker** zu nutzen (siehe Camunda Doku).

---

## Prozessdetails ? Legacy-System

Das Legacy-System kann ?ber ein einfaches Web-Frontend simuliert werden. Beispiel:

- [https://anhe0003.github.io/this-and-that/Legazy_Ma?nahmen_erfassen.html](https://anhe0003.github.io/this-and-that/Legazy_Ma?nahmen_erfassen.html)

---

## Aufgabe ? Automatisierung

Die Risikoanalyse soll in Camunda umgesetzt werden. Benutzen Sie die Camunda Cloud Services:

- [https://docs.camunda.io/docs/guides/](https://docs.camunda.io/docs/guides/)

### Vorgaben

1. Es gibt f?r jede Gruppe ein Projekt, in dem die Automatisierung umgesetzt wird.
   - Jedes Gruppenmitglied sollte einen (Trial-)User Account bei Camunda anlegen.
   - Teilen Sie die User bitte dem Dozenten mit; sie werden dann dem entsprechenden Projekt zugeordnet.
2. Erweitern Sie f?r den Prozess die existierende Process Application.
   - Bei fachlichen Unklarheiten: Annahmen treffen und kenntlich machen **oder** beim Fachbereich (Herrn Heberle) nachfragen.
3. Digitalisieren und automatisieren Sie den Prozess mit Camunda 8.
   - Sie k?nnen alle Komponenten von Camunda verwenden (siehe Dokumentation).
4. Testen Sie den Workflow in unterschiedlichen Szenarien.

### Hinweis I

Kl?ren Sie bei Bedarf mit dem Dozenten die notwendigen Details der L?sung.

---

## Aufgabe ? Controlling

Als Verantwortlicher f?r das Risikomanagement sind Sie auch f?r den Prozess verantwortlich. Das System f?r die Risikoanalyse war in der Vergangenheit ein Problemkind und ist ?fters ausgefallen. Das Management will wissen, ob weiterhin so viele Probleme auftreten.

5.Definieren Sie sinnvolle KPIs und Reporting-Zyklen, um das Management zufrieden zu stellen.
6.Erstellen Sie daf?r ein Dashboard in Camunda Optimize.

---

## Aufgabe ? (CO2-)Optimierung

Sie haben mittels Auswertung der zuvor definierten KPIs erkannt, dass die Risikoanalyse immer sehr lange dauert. Au?erdem wollen Sie den CO2-Verbrauch des Prozesses reduzieren. Sie haben von **Time Shifting** geh?rt und m?chten dies sinnvoll einsetzen.

7.Bauen Sie Time Shifting sinnvoll in Ihren Prozess ein und berichten Sie die Verbesserung des eingesparten CO2, mindestens an das Management oder sogar an den Kunden.

## Hinweise

- Zur Vorhersage der besten Ausf?hrungszeit (geringste CO2-Kosten) kann die **Carbon Aware Computing API** genutzt werden
  - komplett kostenlos, bereitgestellt von der Karlsruher Bluehands GmbH.
- Time Shifting sollte:
  - SLAs aus dem Prozess ber?cksichtigen und
  - (historische) Daten ?ber die Ausf?hrungszeiten ber?cksichtigen.

---

## Bonus-Aufgabe ? RPA Bot

Die Erfassung der Ma?nahmen erfolgt bisher manuell ?ber das Web-Frontend des Wartungssystems.

8.Entwickeln Sie einen RPA Bot mit UIPath, der den Eintrag automatisiert vornimmt.
9.Integrieren Sie den RPA Bot in Ihren automatisierten Camunda-Prozess.

## Hinweis II

Berücksichtigen Sie, dass der Eintrag nicht immer klappt.

---

## Aufgabe ? Feedback

10.Geben Sie dem Dozenten Feedback zum Kapitel Prozessautomatisierung:

- Was h?tten Sie mit Ihrem aktuellen Wissen ?ber Prozessautomatisierung gerne vorher gewusst?
- Fehlt Ihnen etwas, das Sie praktisch noch gerne ausprobiert h?tten?

---

## Abgabe

- Stimmen Sie mit dem Dozenten die Details der L?sung ab. Stellen Sie Fragen rechtzeitig, um unn?tige Mehrarbeit zu vermeiden.
- Der/die GruppenleiterIn l?dt das Ergebnis in ILIAS hoch:
  - das/die erstellte(n) BPMN-Modell(e)
  - zus?tzlich notwendiger Code (z. B. `db.json`) ?ber GitHub bereit stellen
  - Tragen Sie **ALLE** Gruppenteilnehmer bei der Abgabe ein!

### Wichtig

- Kopieren ist nicht erlaubt!
- Wenn Sie KI-Werkzeuge verwenden, dann machen Sie das bitte kenntlich und dokumentieren Sie den Input, den Sie von einem Werkzeug bekommen haben!

**Deadline:** Donnerstag, 08.01.2026, 18:00 Uhr

---

## Interessante Seiten

- Camunda Platform 8: [https://docs.camunda.io/](https://docs.camunda.io/)
- Camunda Academy: [https://academy.camunda.com](https://academy.camunda.com)
- Camunda auf GitHub: [https://github.com/camunda](https://github.com/camunda)
- Camunda bei YouTube: [https://youtube.com/playlist?list=PLJG25HlmvsOUvvKB7Iiy6H5brYhb_W8Lc&feature=shared](https://youtube.com/playlist?list=PLJG25HlmvsOUvvKB7Iiy6H5brYhb_W8Lc&feature=shared)
