# documentation: Concourse migration inventory

Concourse pipeline `documentation` on team `ci` is the **primary CI/CD path** for this repo.

**Tracked branch:** `main`

---

## Operator sequence (R1 before R6)

1. **[R1]** Merge `concourse/**` PR → bootstrap / smoke on cluster (`set-self`, `build-image`).
2. **[R6]** Separate PR or step: retire GHA build/deploy (`.github/workflows/_legacy-*` only).

Local commits may include both pipeline and GHA renames; **do not merge GHA retirement before Concourse is live.**

---

## Human sign-off

| Reviewer | Date | Approved |
|----------|------|----------|
| | | ☐ |

---

## Review list

| Capability | Concourse job | Trigger | Notes |
|------------|---------------|---------|-------|
| Build image | `build-image` | auto on push | — |
| Deploy mainnet | `deploy-mainnet-from-build` | manual (R3) | R10-a; `passed: [build-image]` |

### Operator commands

| Job | Action |
|-----|--------|
| `deploy-mainnet-from-build` | `fly -t ci trigger-job -j documentation/deploy-mainnet-from-build` |

---

## Production deploy (R10)

| Env | Job | Trigger | Build chain |
|-----|-----|---------|-------------|
| `mainnet` | `deploy-mainnet-from-build` | manual (`trigger: false`) | `passed: [build-image]` |

### R10-b deferral

No `deploy-mainnet-from-tag` in this pass — no R9 release capability / `:v*` release images yet.
Add **`deploy-mainnet-from-tag`** when release capability is added. See [Production deploy modes (R10-b)](https://github.com/Reactive-Network/infra/blob/master/docs/ci.md#production-deploy-modes-r10) in org `docs/ci.md`.

---

## GitHub Actions (R6)

| Legacy workflow | Status |
|-----------------|--------|
| `_legacy-ci.yaml` | Retired; `workflow_dispatch` only |

`check.yaml` is unchanged (local build check only; not prod deploy).

---

## Release (R9)

**Not in scope** — no release jobs in this pipeline.
