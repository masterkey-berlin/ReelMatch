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

variable "dockerhub_username" {
  description = "DockerHub username"
  type        = string
  default     = ""
  sensitive   = true
}

variable "dockerhub_token" {
  description = "DockerHub token"
  type        = string
  default     = ""
  sensitive   = true
}

variable "ami_id" {
  description = "AMI ID for the EC2 instance (Amazon Linux 2 by default)"
  type        = string
  default     = "ami-0669b163befffbdfc"  # Amazon Linux 2 in eu-central-1 (aktualisierte AMI-ID)
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
  default     = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDZ/0HxsneheYiqZWQNpDNyALk9XEGb30hGJnsOF1rN1HOZGIT4NiXYwgQet49XkIUjZX5I8tIUSyDyNDz95cDq02oPXhw8UqtaO3wJF5/QMowCD5+C3SKcV1KraSQW/B1uzNkFgNm2ULsARc+EQOZ14Z75LcWW5+pGqVDuhLtmmmWC6E/U/L2ClVrmYOywi93gRNBysd0ap9DsIm6Yx2hiyFOu4yNvSQADA+Z/DToNkex9o4MrrRQjhG8GDTosigIelfrdTEK4QiJqZ7HWratFpjynuEftE/mCz1EFcgopit75sVkry5EgAffZjUs5yWg/S7Vny472oLvSQLaFs/XrOOaQvkIQ2FFfC8WjcfXXDs2zFkFFTLzb2FzhNynXr8EC6szmeVVgBFCn428AYNh/NhXdJ8umxdsZlFiSy7pwQV9dfFbyYcvSSON2hzmY3rhuzT+CxxxnGEbnTl2wvX0WFo9yrfTwuE0GzlWfRROgHqMKmnFkXx95CxUxOXsLvLR3onNzGeyjZ3ZTTHBEzz4+VV1batflm7uaEq1UCJWVLeSXnADZHclcPl0ghzPPGN8sdH2xl0UBMpCA2UE/31FS9Cy3Pp265cBdKphUiQEi7sLxkMIlqoSQVqYoOUQDG9PRGqAIaOhvO9t8jGQoEhWB7scAFi+URIxRUvE4AbVPNQ== reelmatch@reelmatch"
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
