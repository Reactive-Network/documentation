#!/usr/bin/env bash
# Mirror .github/workflows/ci.yaml deploy job — kapp deploy to mainnet namespace.
set -euo pipefail

if [ -z "${KUBECONFIG_CONTENT:-}" ]; then
  echo "KUBECONFIG_CONTENT is required" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "${ROOT}"

KUBECONFIG_FILE="$(mktemp)"
trap 'rm -f "${KUBECONFIG_FILE}"' EXIT
printf '%s' "${KUBECONFIG_CONTENT}" > "${KUBECONFIG_FILE}"
chmod 600 "${KUBECONFIG_FILE}"
export KUBECONFIG="${KUBECONFIG_FILE}"

git config --global --add safe.directory "$(pwd)" 2>/dev/null || true

export KUBERNETES_RESOURCE_NAME="${KUBERNETES_RESOURCE_NAME:-documentation}"
export KUBERNETES_NAMESPACE="${KUBERNETES_NAMESPACE:-mainnet}"
export INGRESS_DOMAIN="${INGRESS_DOMAIN:-dev.reactive.network}"
export INGRESS_CLASS="${INGRESS_CLASS:-traefik}"
export ENV="${ENV:-mainnet}"
export COMMIT_SHORT_SHA="$(git rev-parse --short=7 HEAD)"

echo "Deploying ghcr.io/reactive-network/${KUBERNETES_RESOURCE_NAME}:${ENV}-${COMMIT_SHORT_SHA}"

for f in ./k8s/*.yaml; do
  envsubst -no-unset -no-empty -fail-fast < "${f}" | sponge "${f}"
done

kapp deploy -a "${KUBERNETES_RESOURCE_NAME}" -c -y -n "${KUBERNETES_NAMESPACE}" -f ./k8s/
kapp inspect -a "${KUBERNETES_RESOURCE_NAME}" -n "${KUBERNETES_NAMESPACE}" -t

echo "Deploy complete"
