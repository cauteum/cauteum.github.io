<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cauteum
SPDX-License-Identifier: Apache-2.0
-->

# Recreate a sandbox

Use recreate when policy, proxy bindings, LogConfig, or resource limits must
apply from a clean create. Running containers keep create-time HostConfig until
replaced.

## What delete removes

| Removed | Kept |
|---------|------|
| `cauteum-<name>` | Gateway provider secrets |
| `cauteum-proxy-<name>` | Gateway registry entries until deleted |
| `cauteum-net-<name>` | |
| `cauteum-data-<name>` volume | |
| `cauteum-ca-<name>` volume | |

Deleting the data volume clears Cursor `agent login` state.

## Procedure

```bash
cauteum sandbox delete cursor

cauteum gateway ensure
cauteum doctor
cauteum provider list

cauteum sandbox create \
  --name cursor \
  --from cursor \
  --workspace "$PWD" \
  --policy cauteum-cli/policies/cursor-github-push-cauteum.yaml \
  --provider cursor \
  --provider gh \
  --memory 2g

cauteum sandbox connect cursor -- agent login
cauteum logs cursor --tail --source proxy
```

## Hot reload vs recreate

| Change | Prefer |
|--------|--------|
| Narrow policy rule | `cauteum policy set … --wait` / rule approve |
| New LogConfig / PIDs / memory | Recreate |
| New workspace binds / image | Recreate |
| Rotated secret in store | `provider refresh` (often enough) |
