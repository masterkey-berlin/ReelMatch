# Abschlußprojekt: Detaillierte Technische Planung für ReelMatch: "Kurzvideo-Intro & Themen-Speed-Dating" (MVP)

**Dokument:** technical_plan.md

---

## (1) Detaillierte Architektur & Komponenten

**Gesamtarchitektur:**  
Monolithisches Backend (Node.js/Express.js) mit einem separaten Frontend (React).

**Begründung:**  
Für ein MVP von einer Person ist ein Monolith einfacher zu entwickeln, zu testen und zu deployen. Microservices würden den Overhead in der Planungs- und Umsetzungsphase von 4 Wochen unnötig erhöhen.

### Komponenten-Diagramm

- **User (Browser/PWA)**  
  Interagiert mit: Frontend (React App)

- **Frontend (React App mit Vite)**  
  Kommuniziert mit: Backend API (Node.js/Express) via REST (HTTPS).  
  Zuständig für: UI-Darstellung, Nutzerinteraktion, Video-Upload/-Anzeige, Chat-Interface.

- **Backend API (Node.js/Express.js)**  
  Kommuniziert mit: PostgreSQL Datenbank, Videospeicher (MVP: Lokales Volume, Vision: S3-kompatibler Objektspeicher).  
  Zuständig für: Nutzerauthentifizierung (MVP: sehr einfach, z.B. Username ohne PW für Demo), Profilverwaltung, Video-Metadaten-Management, Upload-Handling, Logik für Themenräume (asynchron), einfache Matching-Logik (Interesse an Videos/Beiträgen), Chat-Nachrichten-Speicherung.

- **PostgreSQL Datenbank**  
  Speichert: Nutzerprofile, Video-Metadaten, Themenraum-Definitionen, Video-Beiträge zu Räumen, "Matches"/Verbindungen, Chat-Nachrichten.

- **Videospeicher (MVP: Docker Volume, später Objektspeicher)**  
  Speichert: Die hochgeladenen Videodateien.

#### Interaktionen

- Frontend sendet HTTP-Requests (GET, POST, PUT, DELETE) an Backend API.
- Backend API führt Datenbankoperationen aus (CRUD).
- Backend API speichert/liest Videodateien vom Videospeicher.
- (Später, nicht MVP) Für Echtzeit-Chat: WebSocket-Verbindung zwischen Frontend und Backend (z.B. mit Socket.IO). Für asynchrones Video-Messaging im MVP nicht zwingend nötig für die erste Version des Chats.

---

## (2) Datenbank Schema Design (Konzeptionell für PostgreSQL)

**users**
- user_id (PK, SERIAL)
- username (VARCHAR, UNIQUE, NOT NULL)
- profile_video_path (VARCHAR, Pfad zur Videodatei des Intros)
- short_bio (TEXT, optional)
- created_at (TIMESTAMP, DEFAULT NOW())

**theme_rooms**
- room_id (PK, SERIAL)
- name (VARCHAR, UNIQUE, NOT NULL, z.B. "Reisen", "Tech")
- description (TEXT)

**video_posts (Beiträge in Themenräumen)**
- post_id (PK, SERIAL)
- user_id (FK zu users.user_id, NOT NULL)
- room_id (FK zu theme_rooms.room_id, NOT NULL)
- video_path (VARCHAR, Pfad zur Videodatei des Beitrags)
- text_content (TEXT, optional, begleitender Text zum Video)
- created_at (TIMESTAMP, DEFAULT NOW())

**interests_matches (Wenn Nutzer A Interesse an Nutzer B zeigt, basierend auf Intro oder Post)**
- interest_id (PK, SERIAL)
- initiator_user_id (FK zu users.user_id, NOT NULL)
- target_user_id (FK zu users.user_id, NOT NULL)
- status (VARCHAR, z.B. 'pending', 'matched', 'declined', DEFAULT 'pending') - Ein Match entsteht, wenn beide Interesse zeigen.
- created_at (TIMESTAMP, DEFAULT NOW())
- UNIQUE Constraint auf (initiator_user_id, target_user_id)

**chats (Entsteht nach einem Match)**
- chat_id (PK, SERIAL)
- match_id (FK zu interests_matches.interest_id, UNIQUE, NOT NULL) - oder direkter Bezug zu den 2 Usern.
- user1_id (FK zu users.user_id)
- user2_id (FK zu users.user_id)
- created_at (TIMESTAMP, DEFAULT NOW())

**messages**
- message_id (PK, SERIAL)
- chat_id (FK zu chats.chat_id, NOT NULL)
- sender_user_id (FK zu users.user_id, NOT NULL)
- content (TEXT, NOT NULL)
- sent_at (TIMESTAMP, DEFAULT NOW())

**Visualisierung:**  
Einfaches ERD mit den genannten Tabellen und Beziehungen.

---

## (3) Detaillierter Technologie-Stack

**Frontend:**
- React (v18+) mit Vite
- JavaScript (ES6+)
- CSS-Module oder Styled Components (oder Tailwind CSS)
- axios für API-Requests
- React Router für Navigation
- Video Player Komponente (z.B. react-player oder HTML5 `<video>`)
- Formular-Handling (z.B. React Hook Form)
- Zustandsmanagement (React Context API oder Zustand/Redux Toolkit für komplexere Zustände)

**Backend:**
- Node.js (v18+ LTS)
- Express.js
- pg (node-postgres) für PostgreSQL-Verbindung
- multer für Dateiuploads (Videos)
- jsonwebtoken (JWT) für einfache Token-basierte Authentifizierung (MVP: vielleicht sogar nur User ID im Header für Demo)
- dotenv für Umgebungsvariablen

**Datenbank:** PostgreSQL (v14+)

Innerhalb des Backends:
- DB-Verbindung über pg Pool.
- ENV Vars (aus K8s ConfigMap/Secret) für DB-Host, User, PW, DB-Name, Port, Video-Upload-Pfad.
- Video-Uploads werden mit multer verarbeitet, Pfad in DB gespeichert, Datei im Volume.

---

## (4) Kubernetes Deployment Design

- **Namespaces:** dev für Entwicklung/Test, prod (Vision). Für das MVP alles in default oder einem project7-mvp Namespace.

**Frontend (Deployment):**
- Replikate: MVP: 1, später 2-3 für Verfügbarkeit.
- Konfiguration: ConfigMap für VITE_API_URL (URL des Backend-Service). Übergabe als ENV Var.
- Kein persistenter Speicher.

**Backend (Deployment):**
- Replikate: MVP: 1, später 2-3.
- Konfiguration:
  - ConfigMap: DB_HOST, DB_PORT, DB_NAME, VIDEO_STORAGE_PATH.
  - Secret: DB_USER, DB_PASSWORD.
  - Übergabe als ENV Vars.

**Persistenter Speicher (für Videos im MVP, wenn lokales Volume):**
- PersistentVolumeClaim für /app/uploads (oder wo Videos gespeichert werden). Größe: MVP 1Gi, Access Mode: ReadWriteOnce. StorageClass: Standard des lokalen Clusters.

**Datenbank (StatefulSet):**
- Replikate: MVP: 1.
- Konfiguration: Secret für POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB. Übergabe als ENV Vars an den Postgres-Container.
- Persistenter Speicher: PersistentVolumeClaim (definiert im volumeClaimTemplates des StatefulSets) für /var/lib/postgresql/data. Größe: MVP 2Gi, Access Mode: ReadWriteOnce. StorageClass: Standard.

**Services:**
- frontend-svc (ClusterIP): Zielt auf Frontend Pods, Port 80.
- backend-svc (ClusterIP): Zielt auf Backend Pods, Port (z.B. 3000 oder 8080).
- db-svc (ClusterIP): Zielt auf Datenbank Pod, Port 5432.

**Ingress:**
- Host: ReelMatch.local (oder ähnlich für lokale Tests).
- Pfade:
  - `/` -> frontend-svc Port 80
  - `/api/` -> backend-svc Port (z.B. 3000)

**Resource Requests & Limits (MVP - initiale Schätzungen):**
- Frontend: CPU: 100m, Memory: 128Mi
- Backend: CPU: 200m, Memory: 256Mi
- Datenbank: CPU: 250m, Memory: 512Mi

---

## (5) IaC (Terraform) Design

**Was wird provisioniert (MVP-Fokus):**  
Die Kubernetes-Objekte selbst mit dem Terraform Kubernetes Provider oder Helm Provider.

**Begründung:**  
Erlaubt die Versionierung und das Management der K8s-Konfiguration als Code. Lokaler K8s-Cluster (Minikube/Docker Desktop) wird vorausgesetzt und nicht mit Terraform erstellt.

**Haupt-Terraform-Ressourcen:**
- kubernetes_deployment (für FE, BE)
- kubernetes_stateful_set (für DB, alternativ helm_release für ein fertiges Postgres Helm Chart)
- kubernetes_service (für FE, BE, DB)
- kubernetes_ingress_v1
- kubernetes_config_map
- kubernetes_secret
- kubernetes_persistent_volume_claim (falls nicht durch StatefulSet oder Helm Chart gemanagt)

**Struktur der Terraform-Dateien:**
- provider.tf (Kubernetes Provider Konfiguration)
- variables.tf (Image Tags, Replica Counts, Ports, Hostnamen)
- main.tf (oder aufgeteilt: frontend.tf, backend.tf, database.tf, network.tf)
- outputs.tf (z.B. Ingress IP/Hostname)

**Variablen:**  
Image-Tags (aus CI), Replica Counts, externe Ports, Ingress-Host, DB-Credentials (aus sicherer Quelle wie Vault oder CI Secrets, für Demo aus .tfvars oder CLI, nicht ins Git!).

---

## (6) CI/CD Pipeline Design (GitHub Actions)

**Stages/Jobs:**

**lint-and-test (parallel für FE & BE):**
- Checkout Code
- Setup Node.js
- Install Dependencies (npm ci)
- Run Linters (npm run lint)
- Run Unit Tests (npm test)

**build-and-push-images (parallel für FE & BE, nach lint-and-test):**
- Checkout Code
- Setup Docker Buildx
- Login to Docker Hub (mit Secrets DOCKERHUB_USERNAME, DOCKERHUB_TOKEN)
- Build Docker Image (mit dynamischem Tag github.sha und latest)
- Push Docker Image

**deploy-to-k8s-dev (nach build-and-push-images):**
- Checkout Code
- Setup kubectl und terraform
- Configure kubectl context für K8s Cluster (ggf. mit Kubeconfig aus Secret)
- terraform init
- terraform apply -auto-approve (mit Variablen für Image Tags etc.)

**Tools:**  
actions/checkout, docker/setup-buildx-action, docker/login-action, docker/build-push-action, hashicorp/setup-terraform.

**Secrets in Pipeline:**  
DOCKERHUB_USERNAME, DOCKERHUB_TOKEN, KUBECONFIG_DEV (Base64-kodierter Inhalt der Kubeconfig für den Dev-Cluster).

**Deployment-Strategie:**  
Standard Rolling Update von Kubernetes Deployments.

**Gates/Approvals:**  
Für MVP nicht, später für Staging/Prod.

---

## (7) Detaillierter Testing Plan (MVP)

**Unit Tests (Backend):**  
Mit Jest. Fokus auf Service-Logik (Matching, Raum-Logik), API-Request-Handler (ohne DB-Calls, gemockt). Ziel: >70% Abdeckung kritischer Logik. Laufen in CI.

**Unit/Component Tests (Frontend):**  
Mit Jest & React Testing Library. Fokus auf einzelne Komponenten (z.B. Video Player, Upload Form). Ziel: Testen der Kern-UI-Elemente. Laufen in CI.

**Manuelle E2E Tests (MVP):**
- Registrierung/Login (simuliert).
- Video-Intro hochladen & ansehen.
- Themenraum beitreten, Video-Post erstellen/ansehen.
- Interesse an anderem Nutzer/Post bekunden -> Match -> Chat starten.
- Nach jedem Deployment auf Dev durchführen.

---

## (8) Detaillierte Security Planung (MVP)

**Anwendung:**
- Input-Validierung im Backend für alle API-Endpunkte (z.B. mit express-validator).
- MVP-Auth: Einfacher Token oder User-ID im Header (für Demo). Keine echten Passwörter speichern ohne Hashing! (Später: JWTs, bcrypt für Passwörter).
- Video-Uploads: Dateityp- und Größenbeschränkung serverseitig.
- Schutz vor gängigen Web-Angriffen (XSS, CSRF durch Framework-Mittel, z.B. Helmet für Express).

**Infrastruktur:**
- K8s Secrets für DB-Credentials, API-Keys.
- Network Policies (Vision, nicht MVP): Zugriff zwischen Pods einschränken.
- Regelmäßige Updates der Basis-Images (Node, Nginx, Postgres).

---

## (9) Detaillierte Monitoring & Logging Planung (MVP)

**Logging:**
- Backend: Konsolen-Logging (stdout/stderr) mit Zeitstempel, Loglevel, Request-ID. Format: JSON.
- Frontend: Konsolen-Logs im Browser.
- K8s: `kubectl logs <pod-name>` für Zugriff auf Container-Logs.
- Kein zentrales Logging im MVP, aber Struktur der Logs so, dass sie später leicht von Tools wie Loki erfasst werden können.

**Monitoring (MVP - sehr rudimentär):**
- K8s Dashboard (falls im lokalen Cluster verfügbar) für Pod-Status, CPU/Memory-Nutzung.
- Manuelle Überprüfung der Anwendungsverfügbarkeit über den Ingress.
- Kein Prometheus/Grafana im MVP.

---

## (10) Detaillierter Umsetzungszeitplan (Beispiel für 4 Wochen)

**Woche 1: Backend & Datenbank**
- Setup Projekt, Git Repo.
- DB-Schema finalisieren, Migrationen (Knex.js oder Prisma Migrate).
- Backend: User-Grundgerüst, API für Video-Intro Upload/Abruf, Themenraum CRUD.
- Dockerfile für Backend.

**Woche 2: Frontend & erste Integration**
- Frontend-Grundgerüst, Routing.
- UI für Profil (Video-Intro Upload/Anzeige).
- UI für Themenräume (Anzeige, Erstellung von Video-Posts).
- Dockerfile für Frontend.
- Erste Integration FE-BE für Video-Funktionen.

**Woche 3: Kernlogik & Kubernetes**
- Backend: Matching-Logik (einfach), Chat-Grundgerüst (Nachrichten speichern/abrufen).
- Frontend: Chat-UI (einfach).
- Kubernetes-Manifeste (oder Terraform-Konfig für K8s-Objekte) für FE, BE, DB.
- Manuelles Deployment auf lokalen K8s-Cluster, Ingress-Setup.

**Woche 4: IaC, CI/CD, Testing & Abschluss**
- Terraform-Konfiguration für K8s-Objekte finalisieren.
- CI/CD-Pipeline (GitHub Actions) für Build, Image Push, K8s Deploy.
- Unit-Tests schreiben (Fokus Backend).
- Manuelle E2E-Tests, Bugfixing.
- Dokumentation (README, technical_plan.md) fertigstellen.
- Vorbereitung der Abschlusspräsentation des Projekts (falls gefordert).

---

## (11) Reflexion

**Schwierigste technische Aspekte:**
- Zuverlässiges Handling von Video-Uploads und deren Speicherung/Streaming im MVP.
- Implementierung einer robusten, aber einfachen Matching-Logik.
- Sicherstellung, dass der local-exec Provisioner (falls für Video-Processing genutzt) oder alternative Methoden für Video-Handling in der CI/CD und K8s-Umgebung funktionieren. (Besser: Verarbeitung im Backend).

**Größte technische Risiken:**
- Zeitaufwand für die Video-Komponente unterschätzt.
- Komplexität des K8s-Deployments und der Terraform-Konfiguration als Einzelperson.
- Minimierung: MVP-Scope sehr eng halten, Fokus auf Kernfunktionen, frühzeitiges Testen des Deployments.

**Entscheidungen, die Recherche erfordern:**
- Optimale Methode für Video-Speicherung und -Auslieferung im K8s-Kontext (auch für MVP).
- Best Practices für Secrets Management in Terraform für K8s-Deployments.

**Sicherstellung der Integration gelernter Bausteine:**
- Der Plan sieht explizit Dockerfiles, K8s-Objekte (Deployment, Service, Ingress, Secret, ConfigMap, PVC/StatefulSet), Terraform für K8s-Deployment und eine CI/CD-Pipeline vor. Monitoring/Logging sind konzeptionell für das MVP geplant, aber die Logs sind für kubectl logs formatiert.



## Skizzen:

## Gesamtarchitektur: Monolithisches Backend (Node.js/Express.js) mit einem separaten Frontend (React).

+---------------------+      HTTPS      +-------------------------+
| User (Browser/PWA)  |<--------------->| Frontend (React/Vite)   |
+---------------------+                 | (läuft im Browser)      |
                                        +-----------|-------------+
                                                    | REST API (HTTPS)
                                                    v
+---------------------------------------------------|---------------------------------------------------+
| Kubernetes Cluster                                |                                                   |
|                                                   |                                                   |
|  +-------------------------------------------+    |    +-------------------------------------------+  |
|  | Pod: Frontend (Nginx serving static files)|    |    | Pod: Backend API (Node.js/Express)        |  |
|  +-------------------------------------------+    |    +----------------------|--------------------+  |
|       ^                                           |                           | DB Calls             |  |
|       | Ingress                                   |                           v                      |  |
|  +----------------------+                         |    +----------------------|--------------------+  |
|  | Ingress Controller   |                         |    | Pod: PostgreSQL DB (StatefulSet)          |  |
|  +----------------------+                         |    +----------------------|--------------------+  |
|                                                   |                           | Volume Mount         |  |
|                                                   |                           v                      |  |
|                                                   |    +----------------------|--------------------+  |
|                                                   |    | Persistent Volume (PV/PVC) für DB Data    |  |
|                                                   |    +-------------------------------------------+  |
|                                                   |                                                   |
|  (MVP: Video-Uploads zum Backend,                 |    +-------------------------------------------+  |
|   dann auf Volume im Backend-Pod oder            |    | Videospeicher (MVP: Docker Volume Backend)  |  |
|   separates Volume, Vision: S3)                  |    | (Vision: S3-kompatibler Objektspeicher)   |  |
|                                                   |    +-------------------------------------------+  |
|                                                   |                                                   |
+-------------------------------------------------------------------------------------------------------+


##  Datenbank Schema Design (Konzeptionell für PostgreSQL)

[users]
 - user_id (PK)
 - username
 - profile_video_path
 - short_bio
 - created_at

[theme_rooms]
 - room_id (PK)
 - name
 - description

[video_posts]
 - post_id (PK)
 - user_id (FK to users) ---< users.user_id
 - room_id (FK to theme_rooms) ---< theme_rooms.room_id
 - video_path
 - text_content
 - created_at

[interests_matches]
 - interest_id (PK)
 - initiator_user_id (FK to users) ---< users.user_id
 - target_user_id (FK to users) ---< users.user_id
 - status
 - created_at

[chats]
 - chat_id (PK)
 - match_id (FK to interests_matches) ---< interests_matches.interest_id (oder user1_id, user2_id)
 - user1_id (FK)
 - user2_id (FK)
 - created_at

[messages]
 - message_id (PK)
 - chat_id (FK to chats) ---< chats.chat_id
 - sender_user_id (FK to users) ---< users.user_id
 - content
 - sent_at



 ## Skizze der K8s-Objekte und deren Beziehungen (vereinfacht)

Ingress (project7.local)
    |-- path: / -> Service (frontend-svc) -> Deployment (frontend-app) -> Pods (React/Nginx)
    |-- path: /api/ -> Service (backend-svc) -> Deployment (backend-api) -> Pods (Node.js/Express)
                                                                                  | (ENV Vars from ConfigMap/Secret)
                                                                                  | (Volume Mount für Videos - MVP)
                                                                                  v
                                                                      Service (db-svc)
                                                                                  |
                                                                                  v
                                                                StatefulSet (postgresql-db) -> Pod (PostgreSQL)
                                                                                                | (ENV Vars from Secret)
                                                                                                | (Volume Mount via PVC)
                                                                                                v
                                                                                            PVC (db-data) -> PV
Secrets:
  - db-credentials
  - backend-app-secrets (z.B. JWT Secret)

ConfigMaps:
  - frontend-config (VITE_API_URL)
  - backend-config (DB_HOST, etc.)




  ##  CI/CD Pipeline Design (GitHub Actions)

  Trigger: Push to 'main' / PR to 'main'
    |
    +---- [Job: lint-and-test-frontend] -----> [Job: build-and-push-frontend-image] --+
    |     - Checkout                             - Checkout                            |
    |     - Setup Node                           - Setup Docker Buildx                 |
    |     - npm ci                               - Login to Docker Hub                 |
    |     - npm run lint                         - Build & Tag Image                   |
    |     - npm test                             - Push Image                          |
    |                                                                                  v
    +---- [Job: lint-and-test-backend] ------> [Job: build-and-push-backend-image] ---> [Job: deploy-to-k8s-dev]
          - Checkout                             - Checkout                               - Checkout
          - Setup Node                           - Setup Docker Buildx                      - Setup kubectl/Terraform
          - npm ci                               - Login to Docker Hub                      - Configure K8s Context
          - npm run lint                         - Build & Tag Image                        - terraform init
          - npm test                             - Push Image                               - terraform apply


## Monolithisches Backend für "ReelMatch" (Node.js/Express.js)

ReelMatch-backend/
├── src/
│   ├── api/                     # Haupt-Router für API-Versionierung (z.B. /api/v1)
│   │   ├── index.js             # Sammelt alle untergeordneten Router
│   │   ├── auth.routes.js       # Routen für Registrierung, Login (MVP: sehr einfach)
│   │   ├── users.routes.js      # Routen für Nutzerprofile, Video-Intros
│   │   ├── rooms.routes.js      # Routen für Themenräume
│   │   ├── posts.routes.js      # Routen für Video-Posts in Räumen
│   │   ├── matches.routes.js    # Routen für Interessenbekundungen, Matches
│   │   └── chats.routes.js      # Routen für Chat-Nachrichten
│   │
│   ├── controllers/             # Controller-Logik (Request-Handling, Validierung, Service-Aufrufe)
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── room.controller.js
│   │   ├── post.controller.js
│   │   ├── match.controller.js
│   │   └── chat.controller.js
│   │
│   ├── services/                # Geschäftslogik, komplexere Operationen (Abstraktion von Controllern)
│   │   ├── auth.service.js      # User-Erstellung, Login-Prüfung
│   │   ├── user.service.js      # Profil-Updates, Video-Intro-Handling
│   │   ├── video.service.js     # Logik für Video-Upload, -Speicherung, -Metadaten
│   │   ├── room.service.js      # Erstellen/Abrufen von Räumen
│   │   ├── post.service.js      # Erstellen/Abrufen von Video-Posts
│   │   ├── matching.service.js  # Logik zur Erstellung von Matches
│   │   └── chat.service.js      # Senden/Empfangen von Chat-Nachrichten
│   │
│   ├── models/                  # Datenbankmodelle oder Datenzugriffsschicht (DAL)
│   │   ├── user.model.js        # DB-Operationen für User
│   │   ├── room.model.js
│   │   ├── post.model.js
│   │   ├── match.model.js
│   │   ├── chat.model.js
│   │   └── db.js                # Datenbankverbindung (z.B. pg Pool-Konfiguration)
│   │
│   ├── middleware/              # Express Middleware
│   │   ├── auth.middleware.js   # JWT-Validierung (später, MVP vielleicht ohne)
│   │   └── errorHandler.js      # Globale Fehlerbehandlung
│   │   └── upload.middleware.js # Multer-Konfiguration für Video-Uploads
│   │
│   ├── config/                  # Konfigurationsdateien
│   │   └── index.js             # Lädt Umgebungsvariablen (DB-URL, JWT_SECRET, Port etc.)
│   │
│   └── app.js                   # Haupt-Express-Anwendung (Middleware einbinden, Router einbinden)
│   └── server.js                # Startet den HTTP-Server, lauscht auf Port
│
├── public/                    # (Optional) Für statische Dateien, falls das Backend welche direkt ausliefert
├── uploads/                   # (MVP) Verzeichnis zum Speichern hochgeladener Videos (muss per Volume gemountet werden)
│
├── package.json
├── package-lock.json
└── .env (nicht versionieren!) # Umgebungsvariablen für lokale Entwicklung
└── .gitigno




![Screenshot 6](image-examples/Screenshot%202025-06-26%20113251.png)
![Screenshot 7](image-examples/Screenshot%202025-06-26%20113340.png)
![Screenshot 8](image-examples/Screenshot%202025-06-26%20113451.png)
![Screenshot 9](image-examples/Screenshot%202025-06-26%20113503.png)
![Screenshot 10](image-examples/Screenshot%202025-06-26%20113552.png)

## Sprint 2 Backlog Screenshots

![Sprint Backlog Overview](image-examples/Screenshot%202025-07-07%20121757%20copy.png)
![Sprint Planning Details](image-examples/Screenshot%202025-07-07%20121817%20copy.png) 
![Task Breakdown Structure](image-examples/Screenshot%202025-07-07%20121823.png) 
![Progress Tracking View](image-examples/Screenshot%202025-07-07%20121904%20copy.png)

