# ReelMatch: (Arbeitstitel für Projekt "Kurzvideo-Intro & Themen-Speed-Dating")

Willkommen zum Abschlussprojekt! Dieses Repository dokumentiert die Planung und (zukünftige) Entwicklung einer innovativen Dating-App, die auf Kurzvideo-Intros und themenbasiertem Kennenlernen basiert.

## Projektübersicht

Die Idee hinter "ReelMatch" ist es, eine authentischere und interaktivere Alternative zu herkömmlichen Dating-Apps zu bieten. Nutzer können sich durch kurze Videos vorstellen und über gemeinsame Interessen in thematischen "Video-Diskussionsräumen" austauschen, bevor ein direkter Kontakt entsteht.

## Technische Planung

Eine detaillierte technische Konzeption und Umsetzungsplanung für das Projekt (MVP) befindet sich im folgenden Dokument:

➡️ **[Technische Planungsdokumentation (technical_plan.md)](./technical_plan.md)**



Dieses Dokument beinhaltet:
*   Detaillierte Architektur & Komponenten
*   Datenbank Schema Design
*   Detaillierter Technologie-Stack
*   Kubernetes Deployment Design
*   IaC (Terraform) Design
*   CI/CD Pipeline Design
*   Testing, Security, Monitoring & Logging Planung
*   Detaillierter Umsetzungszeitplan
*   Reflexion zu technischen Herausforderungen und Entscheidungen

## Nächste Schritte

Die Umsetzung des im Planungsdokument beschriebenen Minimum Viable Product (MVP).

---

Dieses Repository wird im Laufe des Projekts mit dem Quellcode für das Frontend, Backend, Docker-Konfigurationen, Kubernetes-Manifeste, Terraform-Skripte und die CI/CD-Pipeline gefüllt.


## Definition of Done (DoD)

Für dieses Projekt wurde eine detaillierte **Definition of Done (DoD)** erarbeitet, um sicherzustellen, dass alle Arbeitspakete (User Stories, Tasks) einen einheitlichen Qualitätsstandard erfüllen, bevor sie als "fertig" gelten.

Die vollständige DoD finden Sie hier:
➡️ **[Definition of Done (DoD)](./DEFINITION_OF_DONE.md)**

## Product Backlog

Der initiale Product Backlog für das Projekt wurde erstellt und enthält die bekannten Anforderungen, User Stories, technischen Aufgaben und deren Priorisierung für das Minimum Viable Product (MVP).

➡️ **Das Product Backlog befindet sich in meinem [Jira Board]**

Dieses Backlog ist ein lebendes Dokument und wird im Laufe des Projekts kontinuierlich verfeinert und aktualisiert.

## Technische Planung

Eine detaillierte technische Konzeption und Umsetzungsplanung für das Projekt (MVP) befindet sich im folgenden Dokument:

➡️ **[Technische Planungsdokumentation (technical_plan.md)](./technical_plan.md)**

## Nächste Schritte

Beginn der Umsetzung der hochpriorisierten Product Backlog Items aus dem Backlog in Form eines Sprints von jeweils 1 Woche länge.

## Sprint 1

## Sprint Goal: 
"Am Ende von Sprint 1 kann sich ein Nutzer rudimentär 'registrieren' (Username speichern), ein Video-Intro hochladen und dieses in einer einfachen Profilansicht sehen. Die technische Basis (Projekt-Setup, DB-Schema) ist gelegt."
**Link zum Produc-/Sprintbacklog:
[https://tn-team-z6sbz38d.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog?selectedIssue=SCRUM-51]**

## Renamed the Project from ReelMatch in to ReelMatch, because its better to remember. 

## Changing Remote-URL was successful



## 🚀 Projekt-Cockpit

Willkommen im Cockpit für "ReelMatch"! Dies ist die zentrale Anlaufstelle für alle wichtigen Ressourcen und Routinen meines Projekts.

| Ressource                 | Link / Information                                            |
| ------------------------- | ------------------------------------------------------------- |
| **GitHub Repository**     | [https://github.com/masterkey-berlin/ReelMatch]() |
| **Projektmanagement-Board** | [https://tn-team-z6sbz38d.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog?selectedIssue=SCRUM-16]      |
| **Meeting-Raum**          | [Virtueller Raum (Google Meet)]([Nicht vorhanden!!!]) |
| **Daily Scrum**           | Täglich, Mo-Fr um 09:15 Uhr                                   |

---
### Der Sinn meines Daily Scrums

Das Daily Scrum ist ein 15-minütiges Event für die Entwickler des Scrum Teams. Der Zweck des Daily Scrums ist es, den Fortschritt in Richtung des Sprint-Ziels zu überprüfen und den Sprint-Backlog bei Bedarf anzupassen, um den Arbeitsplan für den nächsten Arbeitstag abzustimmen. 

Als Einzelperson nutze ich diesen täglichen Check-in, um:
1.  Meinen Fortschritt vom Vortag zu bewerten.
2.  Meinen Plan für den heutigen Tag zu konkretisieren.
3.  Eventuelle Hindernisse (Impediments) frühzeitig zu identifizieren und Lösungsstrategien zu überlegen.

Es ist keine Status-Runde für den Product Owner oder Scrum Master, sondern ein kurzes Planungsmeeting für das Team selbst, um die Zusammenarbeit und Leistung zu optimieren und eventuelle Hindernisse (Impediments) frühzeitig zu identifizieren.


# Sprint 2

## Sprint Planung – Sprint 2 für "ReelMatch"

**Sprint-Länge:** 1 Woche  
**Tool:** Agiles Projektmanagement-Tool (Jira) mit dem bestehenden Product Backlog

---

## Teil 1: Das "Warum" - Sprint Goal definieren

**Diskussion (Selbstreflexion):** Was ist der nächste, logische Wert, den ich für den Nutzer schaffen muß? Nach dem Sehen von Videos ist der nächste Schritt das Initiieren von Kontakt.

### Sprint Goal:
> **"Am Ende von Sprint 2 kann ein Nutzer Interesse an anderen Nutzern bekunden, wird über entstandene Matches informiert und kann mit seinen Matches in einem einfachen Text-Chat kommunizieren. Der Kern-Loop vom Entdecken bis zur Konversation ist damit geschlossen."**

**Warum dieses Goal?** Es implementiert die zentrale "Dating"-Funktionalität und macht aus der Video-Galerie eine echte Kennenlern-Plattform.

---

## Teil 2: Das "Was" - Items für den Sprint auswählen

Ich ziehe die nächsten hochpriorisierten User Stories aus dem Product Backlog in mein Sprint Backlog.

### Ausgewählte Product Backlog Items (PBIs) für Sprint 2:

#### 1. User Story: Interesse bekunden
**Als Nutzer, möchte ich mein Interesse an einem anderen Nutzer bekunden können (basierend auf Intro-Video oder Video-Post), damit potenziell ein Match entsteht.**
- **Priorität:** Sehr Hoch
- **Gesch. Aufwand:** 2 Tage

#### 2. User Story: Matches sehen
**Als Nutzer, möchte ich über neue Matches benachrichtigt werden (MVP: UI-Indikator) und eine Liste meiner Matches sehen, damit ich weiß, mit wem ich chatten kann.**
- **Priorität:** Sehr Hoch
- **Gesch. Aufwand:** 1 - 1.5 Tage

#### 3. User Story: Text-Chat
**Als Nutzer mit einem Match, möchte ich einen einfachen Text-Chat starten und Nachrichten senden/empfangen können, damit wir uns weiter austauschen können.**
- **Priorität:** Sehr Hoch
- **Gesch. Aufwand:** 2 - 2.5 Tage

#### 4. Technische Aufgabe: Datenbank-Schema erweitern
**Beschreibung:** Die Tabellen `interests_matches`, `chats` und `messages` müssen erstellt und mit den bestehenden Tabellen verknüpft werden.
- **Priorität:** Sehr Hoch (Blocker für die anderen Stories)
- **Gesch. Aufwand:** 0.5 Tage

---

## Teil 3: Das "Wie" - Den Plan erstellen (Task Breakdown)

Jetzt zerlegen ich jedes PBI in konkrete technische Tasks.

### 🗄️ Technische Aufgabe: Datenbank-Schema erweitern

- [ ] **Task:** Neues Migrationsskript erstellen (`npx knex migrate:make create_social_tables`)
- [ ] **Task:** In der Migration die Tabellen `interests_matches`, `chats` und `messages` mit allen Spalten, Primär- und Fremdschlüsseln (wie im technischen Plan definiert) erstellen
- [ ] **Task:** Migration ausführen (`npx knex migrate:latest`) und das Schema in einem DB-Tool verifizieren

### 💝 User Story: Interesse an einem anderen Nutzer bekunden

#### Frontend Tasks:
- [ ] **Task (FE):** "Interesse"-Button (z.B. Herz-Icon) auf der Profilseite und bei Video-Posts anderer Nutzer hinzufügen
- [ ] **Task (FE):** API-Call zum `/interest`-Endpunkt implementieren, wenn der Button geklickt wird
- [ ] **Task (FE):** UI-Feedback geben (z.B. Button ändert Farbe, kleine Animation)

#### Backend Tasks:
- [ ] **Task (BE):** API-Endpunkt `POST /api/v1/matches/interest` erstellen (Route, Controller, Model). Erwartet die ID des Ziel-Nutzers im Body
- [ ] **Task (BE):** Service-Logik für `bekundeInteresse` implementieren:
  - Prüfen, ob bereits ein Interesse in diese Richtung existiert, um Duplikate zu vermeiden
  - Einen neuen Eintrag in der `interests_matches`-Tabelle erstellen (`initiator_user_id` = eingeloggter User, `target_user_id` = Ziel-User)
  - Prüfen, ob ein umgekehrtes Interesse bereits besteht (hat der Ziel-User schon Interesse am eingeloggten User bekundet?)
  - Wenn ja: Den Status beider `interests_matches`-Einträge auf `matched` aktualisieren und einen neuen Eintrag in der `chats`-Tabelle für diese beiden Nutzer erstellen
- [ ] **Task (BE):** Unit-Tests für die Matching-Service-Logik schreiben

### 👥 User Story: Matches sehen und benachrichtigt werden

#### Backend Tasks:
- [ ] **Task (BE):** API-Endpunkt `GET /api/v1/matches` erstellen, der alle Matches (`status = 'matched'`) des eingeloggten Nutzers zurückgibt (inkl. der Daten des Match-Partners)

#### Frontend Tasks:
- [ ] **Task (FE):** Neue Komponente `MatchList.jsx` erstellen, die die Matches anzeigt (z.B. mit Profilbild-Platzhalter und Username)
- [ ] **Task (FE):** API-Call zum `/matches`-Endpunkt implementieren, um die Liste zu füllen
- [ ] **Task (FE):** Jeden Match-Eintrag in der Liste zu einem klickbaren Link zum Chat machen (`/chat/:chatId`)
- [ ] **Task (FE):** (MVP-Benachrichtigung) Im `Layout.jsx`, einen API-Call zum `/matches` Endpunkt hinzufügen. Wenn `matches.length > 0`, zeige einen kleinen Punkt oder eine Zahl neben dem "Mein Profil" oder einem neuen "Matches"-Navigationslink an

### 💬 User Story: Text-Chat mit einem Match

#### Backend Tasks:
- [ ] **Task (BE):** API-Endpunkt `GET /api/v1/chats/:chatId/messages` erstellen. Der Controller muss prüfen, ob der eingeloggte Nutzer Teil dieses Chats ist (Sicherheit!)
- [ ] **Task (BE):** API-Endpunkt `POST /api/v1/chats/:chatId/messages` erstellen. Auch hier Autorisierung prüfen
- [ ] **Task (BE):** Unit-Tests für das Senden und Empfangen von Nachrichten schreiben

#### Frontend Tasks:
- [ ] **Task (FE):** Neue Komponente `ChatView.jsx` erstellen, die über die Route `/chat/:chatId` erreichbar ist
- [ ] **Task (FE):** In `ChatView.jsx` mit `useEffect` die Nachrichten vom `GET .../messages` Endpunkt abrufen
- [ ] **Task (FE):** UI für den Chat erstellen: ein Anzeigebereich für die Nachrichten (scrollbar) und ein Formular (Input-Feld + Sende-Button) unten
- [ ] **Task (FE):** API-Call zum `POST .../messages` Endpunkt implementieren, wenn der Sende-Button geklickt wird
- [ ] **Task (FE):** Nach dem Senden einer Nachricht die Nachrichtenliste neu laden, um die eigene Nachricht sofort zu sehen (im MVP ist manuelles oder intervallbasiertes Polling für neue Nachrichten von anderen ausreichend)

---

## 📋 Das Ergebnis: Sprint Backlog für Sprint 2

Das Projektmanagement-Board für Sprint 2 enthält:

### Sprint Goal:
> **"Am Ende des Sprints kann ein Nutzer Interesse an anderen Nutzern bekunden, sieht seine entstandenen Matches und kann mit ihnen in einem einfachen Text-Chat kommunizieren."**

### Liste der PBIs:
- ✅ 4 User Stories und Technische Aufgaben (siehe oben)

### Detaillierter Plan aus Tasks:
- ✅ Jedes PBI ist in technische Tasks heruntergebrochen
- ✅ Frontend- und Backend-Tasks klar getrennt
- ✅ Abhängigkeiten identifiziert

---

**Dieser Plan ist ambitioniert, aber machbar**, da ich mich auf die Kernfunktionalität konzentriere und auf Echtzeit-Features (wie WebSockets für den Chat) im MVP bewusst verzichte.

**Sprint 1 wurde früher fertig als erwartet und sogar übererfüllt, da ich noch eine weiteres nicht geplantes Feature einbauen konnte (Delete-Button).**