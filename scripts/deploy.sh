#!/bin/bash
set -e

# Create necessary directories
mkdir -p ~/reelmatch/nginx

# Create .env file
cat > ~/reelmatch/.env << EOF
NODE_ENV=production
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=reelmatch
JWT_SECRET=$(openssl rand -base64 32)
REACT_APP_API_URL=/api
EOF

# Pull and run containers
cd ~/reelmatch
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

echo "Deployment completed successfully!"
