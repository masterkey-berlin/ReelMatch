# Vereinfachte Terraform-Konfiguration für ReelMatch
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

# AWS Provider
provider "aws" {
  region = "eu-central-1"
}

# Datenquelle für verfügbare Availability Zones
data "aws_availability_zones" "available" {
  state = "available"
}

# Default-VPC verwenden
data "aws_vpc" "existing" {
  default = true
}

# Ein Subnetz der Default-VPC auswählen
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.existing.id]
  }
}

data "aws_subnet" "default" {
  id = data.aws_subnets.default.ids[0]
}

# EC2 Instance
resource "aws_instance" "reelmatch_server" {
  ami           = "ami-02003f9f0fde924ea" // Ubuntu Server 20.04 LTS (HVM), SSD Volume Type, from eu-central-1
  instance_type          = "t2.large"
  subnet_id              = data.aws_subnet.default.id
  vpc_security_group_ids = [aws_security_group.reelmatch_sg.id]
  key_name               = "reel-match-key"   # <-- Hier direkt den Namen eintragen!
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name

  root_block_device {
    volume_size           = 30
    volume_type           = "gp3"
    encrypted             = true
    delete_on_termination = true

    tags = {
      Name        = "reelmatch-root-volume"
      Project     = "ReelMatch"
      Environment = "production"
      ManagedBy   = "terraform"
    }
  }

  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update -y
              sudo apt-get install -y docker.io docker-compose
              sudo systemctl start docker
              sudo systemctl enable docker
              sudo usermod -aG docker ubuntu
              sudo mkdir -p /home/ubuntu/reelmatch
              sudo chown -R ubuntu:ubuntu /home/ubuntu/reelmatch
              EOF

  tags = {
    Name        = "reelmatch-server"
    Project     = "ReelMatch"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

# Security Group
resource "aws_security_group" "reelmatch_sg" {
  name        = "reelmatch-sg-2"   # <--- Neuen Namen vergeben!
  description = "Allow HTTP, HTTPS, and SSH"
  vpc_id      = data.aws_vpc.existing.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Für Produktion sollte dies eingeschränkt werden
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "reelmatch-sg"
    Project     = "ReelMatch"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

# Keine Elastic IP - verwende automatische öffentliche IP (kostenlos)

# S3-Bucket für ReelMatch-Dateien (Videos, Bilder, etc.)
resource "aws_s3_bucket" "reelmatch_storage" {
  bucket = "reelmatch-storage-${random_id.bucket_suffix.hex}"

  tags = {
    Name        = "reelmatch-storage"
    Project     = "ReelMatch"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

# Random ID für eindeutigen Bucket-Namen
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# S3-Bucket Versioning
resource "aws_s3_bucket_versioning" "reelmatch_storage_versioning" {
  bucket = aws_s3_bucket.reelmatch_storage.id
  versioning_configuration {
    status = "Enabled"
  }
}

# S3-Bucket Verschlüsselung
resource "aws_s3_bucket_server_side_encryption_configuration" "reelmatch_storage_encryption" {
  bucket = aws_s3_bucket.reelmatch_storage.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# S3-Bucket Public Access Block (Sicherheit)
resource "aws_s3_bucket_public_access_block" "reelmatch_storage_pab" {
  bucket = aws_s3_bucket.reelmatch_storage.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# IAM-Rolle für EC2-Instanz (für S3-Zugriff)
resource "aws_iam_role" "ec2_s3_role" {
  name = "reelmatch-ec2-s3-role-2" # <--- Hier neuen Namen vergeben

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "reelmatch-ec2-s3-role-2"
    Project     = "ReelMatch"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

resource "aws_iam_role_policy" "ec2_s3_policy" {
  name = "reelmatch-ec2-s3-policy-2" # <--- Auch hier neuen Namen vergeben
  role = aws_iam_role.ec2_s3_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.reelmatch_storage.arn,
          "${aws_s3_bucket.reelmatch_storage.arn}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "reelmatch-ec2-profile-3" # <--- Noch neuerer Name!
  role = aws_iam_role.ec2_s3_role.name

  tags = {
    Name        = "reelmatch-ec2-profile-3"
    Project     = "ReelMatch"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

# Outputs
output "public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.reelmatch_server.public_ip
}

output "public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.reelmatch_server.public_dns
}

output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh -i ~/.ssh/id_rsa ubuntu@${aws_instance.reelmatch_server.public_ip}"
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket for ReelMatch storage"
  value       = aws_s3_bucket.reelmatch_storage.bucket
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket for ReelMatch storage"
  value       = aws_s3_bucket.reelmatch_storage.arn
}

output "instance_storage" {
  description = "EC2 instance storage information"
  value       = "30GB GP3 SSD (encrypted) - Videos stored in S3"
}
