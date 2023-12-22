#!/usr/bin/env bash

git clone git@github.com:bitwarden/test-the-web.git test-site

# Mac OSX
if [[ "$OSTYPE" == "darwin"* ]]; then
    find -E . -type f -maxdepth 1 -mindepth 1 -regex '.*\.(crt|key)' -exec cp '{}' test-site/api/ ';'
# If not Mac OS, assume *nix
else
    find . -maxdepth 1 -mindepth 1 -type f -regex ".*\.\(crt\|key\)" -exec cp -t ./test-site/api -- {} +
fi

cd test-site
npm ci
npm run build
