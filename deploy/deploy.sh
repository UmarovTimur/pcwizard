#!/usr/bin/env bash
# Puts the current working tree on the VPS: builds the image here (the server is too short of RAM
# to build on), loads it into the server's docker and restarts the app container.
# The server keeps its own .env and media/ in ~/srv/pcwizard; this script does not touch them.
set -euo pipefail

DIR=srv/pcwizard
SITE_URL=https://camping-rent.uz
TAG=$(date +%Y%m%d-%H%M)

cd "$(dirname "$0")/.."

# The server's address stays out of the repository: DEPLOY_HOST=user@host in .env or the environment
HOST=${DEPLOY_HOST:-$(grep -s '^DEPLOY_HOST=' .env | cut -d= -f2- || true)}
[ -n "$HOST" ] || { echo "Set DEPLOY_HOST=user@host in .env" >&2; exit 1; }

docker build --target runner --build-arg NEXT_PUBLIC_SITE_URL="$SITE_URL" -t "pcwizard:$TAG" -t pcwizard:latest .
# The dated tag stays on the server for rollback: docker tag pcwizard:<old> pcwizard:latest && docker compose up -d
docker save "pcwizard:$TAG" pcwizard:latest | gzip | ssh "$HOST" 'gunzip | docker load'
scp -q deploy/compose.yml "$HOST:$DIR/compose.yml"
ssh "$HOST" "cd $DIR && docker compose up -d && docker compose ps"
