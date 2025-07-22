#!/bin/bash

echo "🚀 ReelMatch Lokales Deployment"
echo "================================"

# Prüfe AWS CLI Konfiguration
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI ist nicht konfiguriert. Bitte führen Sie 'aws configure' aus."
    exit 1
fi

echo "✅ AWS CLI ist konfiguriert"

# Wechsle in das Infrastruktur-Verzeichnis
cd infra

# Terraform initialisieren
echo "🔧 Terraform wird initialisiert..."
terraform init

# Terraform Plan
echo "📋 Terraform Plan wird erstellt..."
terraform plan -var-file="terraform.tfvars.local"

# Benutzer fragen, ob fortgefahren werden soll
read -p "Möchten Sie die Infrastruktur erstellen? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🏗️ Infrastruktur wird erstellt..."
    terraform apply -var-file="terraform.tfvars.local" -auto-approve
    
    # Outputs anzeigen
    echo "📊 Terraform Outputs:"
    terraform output
    
    # IP-Adresse für weiteres Deployment speichern
    PUBLIC_IP=$(terraform output -raw public_ip)
    echo "🌐 EC2 Public IP: $PUBLIC_IP"
    
    echo "✅ Infrastruktur erfolgreich erstellt!"
    echo "🔗 SSH-Verbindung: ssh -i ~/.ssh/id_rsa ubuntu@$PUBLIC_IP"
    
else
    echo "❌ Deployment abgebrochen"
fi
