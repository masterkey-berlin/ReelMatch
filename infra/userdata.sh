#!/bin/bash
sudo apt-get update -y
sudo apt-get install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
sudo mkdir -p /home/ubuntu/reelmatch
sudo chown -R ubuntu:ubuntu /home/ubuntu/reelmatch