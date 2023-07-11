#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

ROOT_DIR=$(git rev-parse --show-toplevel)

# shellcheck source=.env
source "$ROOT_DIR/.env"
export BITWARDENCLI_APPDATA_DIR="$ROOT_DIR/vault-seeder/tmp"

mkdir -p "$BITWARDENCLI_APPDATA_DIR"

if ! command -v bw &>/dev/null; then
    echo "bw could not be found, using dockerized version"
    export BW_COMMAND="docker run --platform linux/amd64 --rm -it -v $BITWARDENCLI_APPDATA_DIR/tmp:/tmp tangowithfoxtrot/bw-cli:serve-latest bw"
    BW_COMMAND config server "$SERVER_HOST_URL"
    BW_COMMAND login "$VAULT_EMAIL" "$VAULT_PASSWORD"
else
    bw config server "$SERVER_HOST_URL"
    bw login "$VAULT_EMAIL" "$VAULT_PASSWORD"
fi
