#!/usr/bin/env bash

ROOT_DIR=$(git rev-parse --show-toplevel)

# shellcheck source=.env
set -o allexport
source $ROOT_DIR/.env
set +o allexport

export NODE_EXTRA_CA_CERTS=$ROOT_DIR/$BW_SSL_CERT

export CLI_APPDATA_DIR="$ROOT_DIR/vault-seeder/tmp"
mkdir -p "$CLI_APPDATA_DIR"

BW_COMMAND() {
  bw "$@"
}

if [[ -z "${CLI_CONFIG_SERVER:-}" ]]; then
    echo "CLI_SERVE_HOST is not set, using local dev values"
    export CLI_CONFIG_SERVER='--api http://localhost:4000 --identity http://localhost:33656 --web-vault https://localhost:8080 --events http://localhost:46273'
fi

# Login to the vault
# shellcheck disable=SC2086 # we want to pass the server host url as a single argument
BW_COMMAND logout --quiet # In case there's an active outdated session (e.g. docker container was rebuilt)
BW_COMMAND config server $CLI_CONFIG_SERVER || true # no error if already configured
BW_COMMAND login "$VAULT_EMAIL" "$VAULT_PASSWORD" --nointeraction || true # no error if already logged in
BW_COMMAND sync || true # no error if already synced

# Start Vault Management API
BW_COMMAND serve --hostname $CLI_SERVE_HOST --port $CLI_SERVE_PORT &
