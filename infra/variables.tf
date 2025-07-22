variable "aws_region" {
  description = "AWS region to deploy to"
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
  description = "AMI ID for the EC2 instance (Amazon Linux 2 by default)"
  type        = string
  default     = "ami-0c55b159cbfafe1f0"  # Amazon Linux 2 in eu-central-1
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

variable "domain_name" {
  description = "Domain name for the application (leave empty if not using custom domain)"
  type        = string
  default     = ""
}

variable "hosted_zone_id" {
  description = "Route 53 hosted zone ID (required if using custom domain)"
  type        = string
  default     = ""
}

variable "github_public_key" {
  description = "Public SSH key for GitHub Actions to access EC2"
  type        = string
}

variable "environment" {
  description = "Deployment environment (e.g., dev, staging, prod)"
  type        = string
  default     = "production"
}

variable "ssh_key_name" {
  description = "Name of the SSH key pair to use for the EC2 instance"
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
