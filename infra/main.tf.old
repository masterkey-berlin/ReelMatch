# --- Terraform Provider und Backend-Konfiguration ---
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Für produktive Nutzung empfehlen wir ein S3-Backend,
  # für einfache Tests kann es vorerst weggelassen werden
  # backend "s3" {
  #   # Wird in CI konfiguriert oder über -backend-config Parameter
  # }
}

provider "aws" {
  region     = var.aws_region
  # Credentials werden durch GitHub Actions bereitgestellt
}

# --- Datenquellen ---
data "aws_availability_zones" "available" {}

data "aws_ami" "ubuntu" {
  most_recent = true
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
  owners = ["099720109477"] # Canonical
}

# --- Netzwerk ---
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = merge(var.tags, {
    Name = "reelmatch-vpc"
  })
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = data.aws_availability_zones.available.names[0]
  tags = merge(var.tags, {
    Name = "reelmatch-public-subnet"
  })
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
  tags = merge(var.tags, {
    Name = "reelmatch-igw"
  })
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
  tags = merge(var.tags, {
    Name = "reelmatch-public-rt"
  })
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# --- Sicherheitsgruppe ---
resource "aws_security_group" "reelmatch_sg" {
  name        = "reelmatch-sg"
  description = "Allow HTTP, HTTPS, and SSH"
  vpc_id      = aws_vpc.main.id

  # HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.your_ip]
  }

  # Ausgehender Traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "reelmatch-sg"
  })
}

# --- SSH Key Pair ---
resource "aws_key_pair" "deployer" {
  key_name   = var.key_name
  public_key = var.github_public_key
}

# --- EC2 Instanz ---
resource "aws_instance" "reelmatch_server" {
  ami                    = coalesce(var.ami_id, data.aws_ami.ubuntu.id)
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.reelmatch_sg.id]
  key_name               = aws_key_pair.deployer.key_name
  
  root_block_device {
    volume_size           = 30
    volume_type           = "gp3"
    encrypted             = true
    delete_on_termination = true
    
    tags = merge(var.tags, {
      Name = "reelmatch-root-volume"
    })
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

  tags = merge(var.tags, {
    Name = "reelmatch-server"
  })
}

# --- Elastic IP für stabile öffentliche IP ---
resource "aws_eip" "reelmatch_eip" {
  domain = "vpc"
  instance = aws_instance.reelmatch_server.id
  tags = merge(var.tags, {
    Name = "reelmatch-eip"
  })
}

# --- DNS-Record (falls konfiguriert) ---
resource "aws_route53_record" "reelmatch" {
  count = var.domain_name != "" && var.hosted_zone_id != "" ? 1 : 0
  
  zone_id = var.hosted_zone_id
  name    = var.domain_name
  type    = "A"
  ttl     = 300
  records = [aws_eip.reelmatch_eip.public_ip]
}

# --- Outputs ---
output "public_ip" {
  description = "Die öffentliche IP-Adresse der EC2-Instanz"
  value       = aws_eip.reelmatch_eip.public_ip
}

output "public_dns" {
  description = "Der öffentliche DNS-Name der EC2-Instanz"
  value       = aws_instance.reelmatch_server.public_dns
}

output "ssh_command" {
  description = "SSH-Befehl zur Verbindung mit der EC2-Instanz"
  value       = "ssh -i ~/.ssh/id_rsa ubuntu@${aws_eip.reelmatch_eip.public_ip}"
}
