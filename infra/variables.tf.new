variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-central-1"
}

variable "aws_access_key" {
  description = "AWS access key"
  type        = string
  sensitive   = true
}

variable "aws_secret_key" {
  description = "AWS secret key"
  type        = string
  sensitive   = true
}

variable "ami_id" {
  description = "AMI ID for EC2 instance"
  type        = string
  default     = "ami-0b7fd829e7758b06d" # Amazon Linux 2023 AMI (HVM), SSD Volume Type
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.medium"
}

variable "your_ip" {
  description = "Your public IP address for SSH access (e.g., '123.45.67.89/32')"
  type        = string
  default     = "0.0.0.0/0"  # Ändern Sie dies auf Ihre IP für mehr Sicherheit
}

variable "github_public_key" {
  description = "Public SSH key for GitHub Actions"
  type        = string
  default     = ""  # Wird über GitHub Actions gesetzt
}

variable "domain_name" {
  description = "Domain name for the application (leave empty if not using a domain)"
  type        = string
  default     = ""
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID (leave empty if not using a domain)"
  type        = string
  default     = ""
}

variable "key_name" {
  description = "Name of AWS key pair"
  type        = string
  default     = "reelmatch-key"
}

variable "tags" {
  description = "A map of tags to add to all resources"
  type        = map(string)
  default     = {
    Project     = "ReelMatch"
    ManagedBy   = "Terraform"
    Environment = "production"
  }
}
