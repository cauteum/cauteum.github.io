<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cautem
SPDX-License-Identifier: Apache-2.0
-->

# Recreate a sandbox

Use recreate when policy, proxy bindings, LogConfig, or resource limits must
apply from a clean create. Running containers keep create-time HostConfig until
replaced.

## What delete removes

| Removed | Kept |
|---------|------|
| `cautem-<name>` | Gateway provider secrets |
| `cautem-proxy-<name>` | Gateway registry entries until deleted |
| `cautem-net-<name>` | |
| `cautem-data-<name>` volume | |
| `cautem-ca-<name>` volume | |

Deleting the data volume clears Cursor `agent login` state.

## Procedure

```bash
cautem sandbox delete cursor

cautem gateway ensure
cautem doctor
cautem provider list

cautem sandbox create \
  --name cursor \
  --from cursor \
  --workspace "$PWD" \
  --policy cautem-cli/policies/cursor-github-push-cautem.yaml \
  --provider cursor \
  --provider gh \
  --memory 2g

cautem sandbox connect cursor -- agent login
cautem logs cursor --tail --source proxy
```

## Hot reload vs recreate

| Change | Prefer |
|--------|--------|
| Narrow policy rule | `cautem policy set … --wait` / rule approve |
| New LogConfig / PIDs / memory | Recreate |
| New workspace binds / image | Recreate |
| Rotated secret in store | `provider refresh` (often enough) |
