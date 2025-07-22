#!/bin/bash

echo "🚀 ReelMatch Sofortiges Deployment"
echo "=================================="

# Prüfe AWS CLI Konfiguration
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI ist nicht konfiguriert. Bitte führen Sie 'aws configure' aus."
    exit 1
fi

echo "✅ AWS CLI ist konfiguriert"

# Wechsle in das Infrastruktur-Verzeichnis
cd infra



echo "🔧 Terraform wird initialisiert..."
terraform init

echo "📋 Terraform Plan wird erstellt..."
terraform plan

echo "🏗️ Infrastruktur wird erstellt..."
terraform apply -auto-approve

# Outputs anzeigen
echo "📊 Terraform Outputs:"
terraform output

# IP-Adresse für weiteres Deployment speichern
PUBLIC_IP=$(terraform output -raw public_ip 2>/dev/null || echo "IP nicht verfügbar")
echo "🌐 EC2 Public IP: $PUBLIC_IP"

echo "✅ Infrastruktur erfolgreich erstellt!"
if [ "$PUBLIC_IP" != "IP nicht verfügbar" ]; then
    echo "🔗 SSH-Verbindung: ssh -i ~/.ssh/id_rsa ubuntu@$PUBLIC_IP"
    echo ""
    echo "🐳 Als nächstes können Sie Docker-Container auf der EC2-Instanz deployen:"
    echo "   1. SSH zur Instanz: ssh -i ~/.ssh/id_rsa ubuntu@$PUBLIC_IP"
    echo "   2. Docker-Images pullen und Container starten"
    echo "   3. Nginx als Reverse-Proxy konfigurieren"
fi
