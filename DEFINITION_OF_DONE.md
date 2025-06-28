## Definition of Done (DoD) für "ReelMatch" (Projekt: Kurzvideo-Intro & Themen-Speed-Dating)

Diese Definition of Done (DoD) beschreibt die Kriterien, die ein Backlog-Element (User Story, Task, Bugfix) erfüllen muss, um als "fertig" zu gelten. Sie dient als Qualitäts-Checkliste für die Entwicklung.

## Allgemein:

Alle Akzeptanzkriterien der User Story / des Tasks sind erfüllt und vom (simulierten) Product Owner/Tester abgenommen.
Der Code ist verständlich, wartbar und folgt den im Projekt vereinbarten Coding-Standards (z.B. konsistente Formatierung, sinnvolle Benennung).

## Code & Entwicklung:

Der Code für die Funktionalität wurde vollständig implementiert (Frontend und/oder Backend).
Der Code wurde erfolgreich gelintet (z.B. mit ESLint/Prettier) und es gibt keine kritischen Linting-Fehler.
Der Code wurde lokal erfolgreich gebaut (z.B. npm run build für Frontend, Backend startet fehlerfrei).
Alle neuen oder geänderten Code-Pfade sind durch Unit-Tests abgedeckt (Ziel: >70% für kritische Backend-Logik, >50% für wichtige Frontend-Komponenten).
Alle Unit-Tests und (falls vorhanden) Integrationstests sind erfolgreich durchgelaufen (npm test).
Der Code wurde in den Hauptentwicklungszweig (main oder develop) gemerged, nachdem er von einem (simulierten) Peer-Review geprüft wurde (als Einzelperson: Selbst-Review mit Fokus auf Best Practices).
Alle Debugging-Code-Schnipsel und unnötigen Kommentare wurden entfernt.
Sensible Daten (Passwörter, API-Keys) werden nicht hartcodiert, sondern über Umgebungsvariablen/Secrets verwaltet.

## Frontend (React mit Vite):

Die Benutzeroberfläche ist responsiv und funktioniert auf gängigen Bildschirmgrößen (Desktop, Tablet, Mobil).
Die UI entspricht den (einfachen) Wireframes/Layout-Vorgaben.
Die User Experience ist intuitiv und die Kernfunktionen sind leicht zugänglich.
Notwendige Formularvalidierungen (Client-Seite) sind implementiert.
Video-Upload und -Anzeige funktionieren zuverlässig im MVP-Rahmen.
Die Kommunikation mit dem Backend-API erfolgt korrekt und Fehler werden angemessen im UI behandelt.

## Backend (Node.js/Express.js API):

Alle API-Endpunkte sind dokumentiert (z.B. mit einfachen Kommentaren im Code oder einer kleinen Postman-Collection für das MVP).
Input-Validierung für alle API-Endpunkte ist implementiert und getestet.
Fehlerbehandlung ist robust und gibt aussagekräftige Statuscodes und Nachrichten zurück.
Die Geschäftslogik ist korrekt implementiert und durch Unit-Tests abgedeckt.
Die Datenbankinteraktionen sind effizient und sicher (keine SQL-Injection-Anfälligkeiten).
(Falls implementiert) Die Authentifizierungs- und Autorisierungsmechanismen funktionieren wie spezifiziert.
Video-Metadaten und Verweise auf Videodateien werden korrekt gespeichert und abgerufen.

## Datenbank (PostgreSQL):

Notwendige Datenbankmigrationen (Schemaänderungen) sind geschrieben, getestet und erfolgreich auf der Entwicklungsumgebung angewendet.
Das Datenbankschema ist in einer einfachen Form dokumentiert (z.B. ER-Diagramm-Skizze).
Es gibt keine unnötigen oder redundanten Daten.

## Containerisierung (Docker):

Dockerfiles (Multi-Stage für Frontend, optimiert für Backend) sind erstellt und funktionieren.
Docker Images können erfolgreich lokal gebaut werden.
Die Images sind so klein wie möglich und enthalten nur die notwendigen Abhängigkeiten.
Umgebungsvariablen für die Container sind korrekt definiert und dokumentiert.

## Orchestrierung (Kubernetes) & IaC (Terraform):

Kubernetes-Manifeste (oder Terraform-Konfigurationen für K8s-Objekte) sind erstellt oder aktualisiert für alle betroffenen Komponenten (Deployments, Services, Ingress, ConfigMaps, Secrets, PVCs etc.).
Die Konfigurationen sind parametrisiert und nutzen Variablen (z.B. für Image-Tags, Replica Counts).
Secrets werden sicher über Kubernetes Secrets verwaltet.
Die Anwendung kann mit den Manifesten/Terraform-Skripten erfolgreich auf einem lokalen Kubernetes-Cluster (z.B. Minikube, Docker Desktop K8s) deployed werden.
Der Ingress ist korrekt konfiguriert und die Anwendung ist über die definierte URL erreichbar.
(Falls zutreffend) Terraform-Code ist formatiert (terraform fmt) und validiert (terraform validate).

## CI/CD-Pipeline (GitHub Actions):

Die CI/CD-Pipeline wurde (falls durch die Story betroffen) aktualisiert.
Alle relevanten Pipeline-Schritte (Linting, Test, Build, Image Push, Deploy) laufen erfolgreich durch.
Das Deployment auf die Entwicklungsumgebung (K8s) über die Pipeline funktioniert.

## Dokumentation:

Relevante Code-Teile sind verständlich kommentiert.
Die README.md oder andere Projektdokumentationen wurden bei Bedarf aktualisiert, um neue Funktionen oder Änderungen zu beschreiben.
Entscheidungen bezüglich Architektur oder Technologie (falls signifikant für die Story) sind dokumentiert.

## Sicherheit (Grundlagen für MVP):

Offensichtliche Sicherheitslücken (z.B. XSS-Anfälligkeit durch unescapten User-Input im Frontend, SQL-Injection) wurden vermieden.
Sensible Konfigurationen und Credentials werden nicht im Code versioniert.
Input-Validierung findet sowohl im Frontend als auch im Backend statt.

## Betrieb & Monitoring (Grundlagen für MVP):

Die Anwendung startet fehlerfrei in der Deployment-Umgebung.
Die grundlegenden Logs der Anwendung sind zugänglich (z.B. über kubectl logs).

## Hinweise zur Anwendung dieser DoD als Einzelperson:

Selbst-Review: Jeder Punkt sollte in einem ehrlichen Selbst-Review durchgeführt werden.

Fokus auf Automatisierung: Es sollte versucht werden, so viele Punkte wie möglich durch die CI/CD-Pipeline und automatisierte Tests abzudecken.

Priorisierung im MVP: Für das MVP sind vielleicht nicht alle Punkte in ihrer vollen Ausprägung sofort erreichbar (z.B. 100% Testabdeckung). Deshalb sollte definiert werden, was für ein "fertiges" MVP-Feature unerlässlich ist.

Lebendes Dokument: Diese DoD ist ein Startpunkt und sollte im Laufe des Projekts angepasst werden, wenn neue Erkenntnisse gewonnen wurden.