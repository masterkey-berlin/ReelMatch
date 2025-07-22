#!/bin/bash

echo "🚀 ReelMatch Einfaches Lokales Deployment"
echo "=========================================="

# Wechsle in das Infrastruktur-Verzeichnis
cd infra

# Terraform Apply direkt mit Variablen
echo "🏗️ Infrastruktur wird erstellt..."
terraform apply \
  -var="aws_region=eu-central-1" \
  -var="your_ip=0.0.0.0/0" \
  -var="github_public_key=ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDZ/0HxsneheYiqZWQNpatchvO9t8jGQoEhWB7scAFi+URIxRUvE4AbVPNQ== reelmatch@reelma" \
  -var="instance_type=t3.medium" \
  -var="key_name=reelmatch-key" \
  -auto-approve

# Outputs anzeigen
echo "📊 Terraform Outputs:"
terraform output

# IP-Adresse für weiteres Deployment speichern
PUBLIC_IP=$(terraform output -raw public_ip 2>/dev/null || echo "IP nicht verfügbar")
echo "🌐 EC2 Public IP: $PUBLIC_IP"

echo "✅ Infrastruktur erfolgreich erstellt!"
if [ "$PUBLIC_IP" != "IP nicht verfügbar" ]; then
    echo "🔗 SSH-Verbindung: ssh -i ~/.ssh/id_rsa ubuntu@$PUBLIC_IP"
fi
