# ReelMatch Infrastructure as Code

Dieses Verzeichnis enthält die Terraform-Konfiguration für die ReelMatch-Infrastruktur.

## Voraussetzungen

1. **AWS Konto** mit Administratorrechten
2. **Terraform** (mindestens Version 1.0)
3. **AWS CLI** (für lokale Tests)
4. **GitHub Repository** mit aktivierten GitHub Actions

## Einrichtung

1. **GitHub Secrets einrichten**
   Gehen Sie zu Ihrem GitHub Repository → Settings → Secrets → Actions und fügen Sie folgende Secrets hinzu:
   - `AWS_ACCESS_KEY_ID` - Ihr AWS Access Key
   - `AWS_SECRET_ACCESS_KEY` - Ihr AWS Secret Key
   - `DOCKERHUB_USERNAME` - Ihr Docker Hub Benutzername
   - `DOCKERHUB_TOKEN` - Ihr Docker Hub Access Token
   - `SSH_PRIVATE_KEY` - Ein privater SSH-Schlüssel für den Zugriff auf die EC2-Instanz

2. **Terraform initialisieren**
   ```bash
   cd infra
   terraform init
   ```

3. **Terraform Variablen konfigurieren**
   Kopieren Sie die Beispielkonfiguration und passen Sie sie an:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   # Bearbeiten Sie die Datei mit Ihren Werten
   ```

4. **Planen und Anwenden**
   ```bash
   terraform plan
   terraform apply
   ```

## GitHub Actions Workflow

Der Workflow in `.github/workflows/deploy.yml` führt folgende Schritte aus:

1. **Infrastruktur bereitstellen**
   - Erstellt eine EC2-Instanz mit allen notwendigen Sicherheitsgruppen
   - Richtet eine Elastic IP ein
   - Konfiguriert IAM-Rollen und -Richtlinien

2. **Anwendung bauen**
   - Baut das Frontend- und Backend-Docker-Image
   - Lädt die Images in Docker Hub hoch

3. **Anwendung bereitstellen**
   - Stellt eine SSH-Verbindung zur EC2-Instanz her
   - Installiert Docker und Docker Compose
   - Startet die Anwendung mit dem produktionellen docker-compose File

## Wartung

### Infrastruktur aktualisieren
```bash
cd infra
terraform plan
terraform apply
```

### Infrastruktur zerstören
```bash
cd infra
terraform destroy
```

## Wichtige Ausgaben

Nach erfolgreicher Ausführung von `terraform apply` werden folgende Informationen angezeigt:
- Öffentliche IP der EC2-Instanz
- SSH-Befehl zur Verbindung mit der Instanz
- URL der Anwendung

## Sicherheit

- **SSH-Zugriff** ist standardmäßig nur von Ihrer IP-Adresse aus möglich
- Alle Daten werden verschlüsselt gespeichert
- Regelmäßige Sicherungen der Datenbank werden empfohlen

## Fehlerbehebung

### SSH-Verbindungsprobleme
- Stellen Sie sicher, dass Ihre IP-Adresse in `your_ip` korrekt eingetragen ist
- Überprüfen Sie die Sicherheitsgruppen in der AWS-Konsole

### Docker-Probleme
- Überprüfen Sie die Docker-Logs: `docker-compose logs`
- Stellen Sie sicher, dass alle Umgebungsvariablen korrekt gesetzt sind
