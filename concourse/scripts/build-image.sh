#!/usr/bin/env bash
# Mirror .github/workflows/ci.yaml build job — BuildKit push mainnet-SHA and latest.
set -euo pipefail

REGISTRY="${REGISTRY:-ghcr.io}"
IMAGE_NAME="${IMAGE_NAME:-reactive-network/documentation}"

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "${ROOT}"

CI_SHARED_DIR="${CI_SHARED_DIR:-../ci-shared}"
if [ ! -f "${CI_SHARED_DIR}/concourse/scripts/buildkit-remote.sh" ]; then
  echo "CI_SHARED_DIR must point at Reactive-Network/ci checkout (missing buildkit-remote.sh)" >&2
  exit 1
fi

TAG="$(bash concourse/scripts/image-tag.sh)"
TAG_IMAGE="${REGISTRY}/${IMAGE_NAME}:${TAG}"
LATEST_TAG="${REGISTRY}/${IMAGE_NAME}:latest"

# shellcheck source=buildkit-remote.sh
source "${CI_SHARED_DIR}/concourse/scripts/buildkit-remote.sh"

echo "Building and pushing ${TAG_IMAGE} and ${LATEST_TAG}"

setup_registry_auth "${REGISTRY}" "${GHCR_USERNAME}" "${GHCR_PASSWORD}"
verify_ghcr_push_access "${IMAGE_NAME}"

ensure_buildctl

cache_ref="${BUILDKIT_CACHE_REGISTRY}/cache/${IMAGE_NAME}:buildcache"
buildctl --addr "${BUILDKIT_HOST}" build \
  --frontend dockerfile.v0 \
  --local context=. \
  --local dockerfile=. \
  --opt platform=linux/amd64 \
  --opt build-arg:BUILDNUM=1 \
  --opt "build-arg:GOOGLE_TAG=${GOOGLE_TAG:?GOOGLE_TAG required}" \
  --opt "build-arg:ALGOLIA_ID=${ALGOLIA_ID:?ALGOLIA_ID required}" \
  --opt "build-arg:ALGOLIA_KEY=${ALGOLIA_KEY:?ALGOLIA_KEY required}" \
  --import-cache "type=registry,ref=${cache_ref}" \
  --export-cache "type=registry,ref=${cache_ref},mode=max,ignore-error=true" \
  --output "type=image,name=${TAG_IMAGE},push=true" \
  --output "type=image,name=${LATEST_TAG},push=true"

echo "Pushed ${TAG_IMAGE} and ${LATEST_TAG}"
