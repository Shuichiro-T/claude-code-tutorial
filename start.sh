#!/bin/bash

# Build and start Claude container
echo "Starting Claude container..."
docker compose up -d --build

# Show container status
echo "Container status:"
docker compose ps

# Instructions
echo ""
echo "Claude container is running!"
echo ""
echo "== Usage =="
echo "Connect to container:"
echo "  docker compose exec claude bash"
echo ""
echo "Run Claude directly:"
echo "  docker compose exec claude claude"
echo ""
echo "Execute commands:"
echo "  docker compose exec claude git status"
echo ""
echo "View logs:"
echo "  docker compose logs claude"
echo ""
echo "Stop container:"
echo "  docker compose down"
echo ""
echo "Volume 'claude-home' is mounted to /home/claude"