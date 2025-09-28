#!/bin/bash

# Setup script for n8n environment variables
# This script helps configure the environment variables needed for n8n workflows

echo "🚀 Setting up n8n environment variables..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create one based on env.example"
    exit 1
fi

# Source the .env file
source .env

# Export environment variables for n8n
export SLACK_WEBHOOK_URL="$SLACK_WEBHOOK_URL"
export OPENAI_API_KEY="$OPENAI_API_KEY"
export SMTP_FROM="$SMTP_FROM"
export FRONTEND_URL="$FRONTEND_URL"

echo "✅ Environment variables exported:"
echo "SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL"
echo "OPENAI_API_KEY=$OPENAI_API_KEY"
echo "SMTP_FROM=$SMTP_FROM"
echo "FRONTEND_URL=$FRONTEND_URL"

echo ""
echo "🔧 To run n8n with these environment variables:"
echo "   docker run -e SLACK_WEBHOOK_URL=\"$SLACK_WEBHOOK_URL\" -e OPENAI_API_KEY=\"$OPENAI_API_KEY\" -e SMTP_FROM=\"$SMTP_FROM\" n8nio/n8n"
echo ""
echo "   Or if running n8n locally:"
echo "   export SLACK_WEBHOOK_URL=\"$SLACK_WEBHOOK_URL\""
echo "   export OPENAI_API_KEY=\"$OPENAI_API_KEY\""
echo "   export SMTP_FROM=\"$SMTP_FROM\""
echo "   n8n start"
echo ""
echo "📝 For Docker Compose, add these to your docker-compose.yml:"
echo "     - SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL"
echo "     - OPENAI_API_KEY=$OPENAI_API_KEY"
echo "     - SMTP_FROM=$SMTP_FROM"
echo "     - FRONTEND_URL=$FRONTEND_URL"