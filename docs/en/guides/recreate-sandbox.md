<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
-->

# Recreate a sandbox

Use recreate when policy, proxy bindings, LogConfig, or resource limits must
apply from a clean create. Running containers keep create-time HostConfig until
replaced.

## What delete removes

| Removed | Kept |
|---------|------|
| `whaleshell-<name>` | Gateway provider secrets |
| `whaleshell-proxy-<name>` | Gateway registry entries until deleted |
| `whaleshell-net-<name>` | |
| `whaleshell-data-<name>` volume | |
| `whaleshell-ca-<name>` volume | |

Deleting the data volume clears Cursor `agent login` state.

## Procedure

```bash
whaleshell sandbox delete cursor

whaleshell gateway ensure
whaleshell doctor
whaleshell provider list

whaleshell sandbox create \
  --name cursor \
  --from cursor \
  --workspace "$PWD" \
  --policy whaleshell-cli/policies/cursor-github-push-whaleshell.yaml \
  --provider cursor \
  --provider gh \
  --memory 2g

whaleshell sandbox connect cursor -- agent login
whaleshell logs cursor --tail --source proxy
```

## Hot reload vs recreate

| Change | Prefer |
|--------|--------|
| Narrow policy rule | `whaleshell policy set … --wait` / rule approve |
| New LogConfig / PIDs / memory | Recreate |
| New workspace binds / image | Recreate |
| Rotated secret in store | `provider refresh` (often enough) |
