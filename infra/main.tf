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

# EC2 Instance
resource "aws_instance" "reelmatch_server" {
  ami           = "ami-02003f9f0fde924ea" // Ubuntu Server 20.04 LTS (HVM), SSD Volume Type, from eu-central-1
  instance_type          = "t2.large"
  subnet_id              = aws_subnet.public.id
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

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "reelmatch-vpc"
    Project     = "ReelMatch"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "reelmatch-igw"
    Project     = "ReelMatch"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

# Public Subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = {
    Name        = "reelmatch-public-subnet"
    Project     = "ReelMatch"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

# Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name        = "reelmatch-public-rt"
    Project     = "ReelMatch"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

# Route Table Association
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Security Group
resource "aws_security_group" "reelmatch_sg" {
  name        = "reelmatch-sg"
  description = "Allow HTTP, HTTPS, and SSH"
  vpc_id      = aws_vpc.main.id

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
  name = "reelmatch-ec2-s3-role"

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
    Name        = "reelmatch-ec2-s3-role"
    Project     = "ReelMatch"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

# IAM-Policy für S3-Zugriff
resource "aws_iam_role_policy" "ec2_s3_policy" {
  name = "reelmatch-ec2-s3-policy"
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

# IAM Instance Profile
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "reelmatch-ec2-profile"
  role = aws_iam_role.ec2_s3_role.name

  tags = {
    Name        = "reelmatch-ec2-profile"
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
