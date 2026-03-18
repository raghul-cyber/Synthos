#!/bin/bash
# deploy.sh
# Deployment script for DigitalOcean App Platform

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Deploy Process for Synthos...${NC}"

# Check for doctl
if ! command -v doctl &> /dev/null; then
    echo -e "${RED}doctl could not be found. Please install it to proceed.${NC}"
    exit 1
fi

# Ensure API token is passed
if [ -z "$DIGITALOCEAN_TOKEN" ]; then
    echo -e "${RED}Error: DIGITALOCEAN_TOKEN environment variable is not set.${NC}"
    echo "Usage: DIGITALOCEAN_TOKEN=your_token ./deploy.sh"
    exit 1
fi

echo -e "${GREEN}Authenticating with DigitalOcean...${NC}"
doctl auth init -t "$DIGITALOCEAN_TOKEN"

echo -e "${GREEN}Checking if app exists...${NC}"
APP_ID=$(doctl apps list --format ID,Spec.Name --no-header | grep "synthos" | awk '{print $1}')

if [ -z "$APP_ID" ]; then
    echo -e "${GREEN}Creating new App Platform deployment from .do/app.yaml...${NC}"
    doctl apps create --spec .do/app.yaml
    echo -e "${GREEN}App creation initiated. Wait a few minutes for the build and deployment to finish.${NC}"
else
    echo -e "${GREEN}Updating existing App Platform deployment (ID: $APP_ID)...${NC}"
    doctl apps update "$APP_ID" --spec .do/app.yaml
    echo -e "${GREEN}App creation update. Wait a few minutes for the build and deployment to finish.${NC}"
fi

echo -e "${GREEN}Deployment configuration applied! Run 'doctl apps list' to track progress.${NC}"
