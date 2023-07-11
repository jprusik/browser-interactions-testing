#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

ROOT_DIR=$(git rev-parse --show-toplevel)

# shellcheck source=.env
eval "$(grep -v '^#' "$ROOT_DIR/.env" | xargs)"
export BITWARDENCLI_APPDATA_DIR="$ROOT_DIR/vault-seeder/tmp"
mkdir -p "$BITWARDENCLI_APPDATA_DIR"

BW_COMMAND() {
    docker run --platform linux/amd64 --rm -it -v "$BITWARDENCLI_APPDATA_DIR:/root/.config/Bitwarden CLI" tangowithfoxtrot/bw-cli:serve-latest bw "$@"
}

# Use local dev values if not pointed at a hosted environment
if [ -z "$SERVER_HOST_URL" ]; then
    echo "SERVER_HOST_URL is not set, using local dev values"
    export SERVER_HOST_URL="--api http://localhost:4000 --identity http://localhost:33656 --web-vault https://localhost:8080 --events http://localhost:46273"
fi

# Login to the vault
BW_COMMAND config server "$SERVER_HOST_URL"
BW_COMMAND login "$VAULT_EMAIL" "$VAULT_PASSWORD" || true # no error if already logged in

# Start Vault Management API
pushd "$ROOT_DIR" >/dev/null || exit 1 # ensure the mount points for docker-compose are correct
docker-compose --profile bw_api up -d
popd || exit 0

while ! curl -s "$BW_SERVE_API_HOST:$BW_SERVE_API_PORT/status" > /dev/null; do
    echo "Waiting for Vault Management API to start..."
    sleep 1
done
