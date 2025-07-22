# Temporärer lokaler State für die Entwicklung
# In Produktion sollten Sie ein Remote-Backend wie S3 verwenden
# mit entsprechender Verschlüsselung und State-Locking

# Beispiel für S3-Backend (auskommentiert)
/*
terraform {
  backend "s3" {
    bucket         = "your-terraform-state-bucket"
    key            = "reelmatch/terraform.tfstate"
    region         = "eu-central-1"
    encrypt        = true
    dynamodb_table = "terraform-lock"
  }
}
*/

# Lokales Backend (aktiv)
terraform {
  backend "local" {
    path = "terraform.tfstate"
  }
}
