#!/usr/bin/env bash
# mainnet-<short-sha> tag (matches GHA metadata prefix=mainnet-).
set -euo pipefail

git config --global --add safe.directory "$(pwd)" 2>/dev/null || true
short_sha="$(git rev-parse --short=7 HEAD)"
echo "mainnet-${short_sha}"
