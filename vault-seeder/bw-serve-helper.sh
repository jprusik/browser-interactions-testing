#!/usr/bin/env bash

ROOT_DIR=$(git rev-parse --show-toplevel)

# shellcheck source=.env
eval "$(grep -v '^#' "$ROOT_DIR/.env" | xargs)"
export BITWARDENCLI_APPDATA_DIR="$ROOT_DIR/vault-seeder/tmp"
mkdir -p "$BITWARDENCLI_APPDATA_DIR"

BW_COMMAND() {
    # docker run --platform linux/amd64 --rm --network host -it -v "$BITWARDENCLI_APPDATA_DIR:/root/.config/Bitwarden CLI" tangowithfoxtrot/bw-cli:serve-latest bw "$@"
  bw "$@"
}

if [[ -z "${SERVER_HOST_URL:-}" || "$SERVER_HOST_URL" =~ "localhost" || "$SERVER_HOST_URL" =~ "127" ]]; then
    echo "SERVER_HOST_URL is not set, using local dev values"
    export SERVER_HOST_URL='--api http://localhost:4000 --identity http://localhost:33656 --web-vault https://localhost:8080 --events http://localhost:46273'
fi

# Login to the vault
# shellcheck disable=SC2086 # we want to pass the server host url as a single argument
BW_COMMAND config server $SERVER_HOST_URL || true # no error if already configured
BW_COMMAND login "$VAULT_EMAIL" "$VAULT_PASSWORD" || true # no error if already logged in
BW_COMMAND sync || true # no error if already synced

# Start Vault Management API
pushd "$ROOT_DIR" >/dev/null || exit 1 # ensure the mount points for docker-compose are correct
docker-compose --profile bw_api up -d
popd || exit 0

while ! curl -s "$BW_SERVE_API_HOST:$BW_SERVE_API_PORT/status" > /dev/null; do
    echo "Waiting for Vault Management API to start..."
    sleep 1
done