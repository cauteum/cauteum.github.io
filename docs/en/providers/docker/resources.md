<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cautem
SPDX-License-Identifier: Apache-2.0
-->

# Resources and limits (Docker)

Docker applies CPU, memory, and PIDs as container runtime limits. Omitting
`--memory` leaves memory uncapped (OpenShell parity on the Docker path).

## Flags

| Flag | Example | Effect |
|------|---------|--------|
| `--cpu` | `2` | `NanoCPUs` |
| `--memory` | `2g`, `512m` | `HostConfig.Memory` |
| `--pids-limit` | `2048`, `-1` | cgroup PIDs; `-1` unlimited |

Default PIDs limit is **2048** when unset (OpenShell `sandbox_pids_limit`).
Set `CAUTEM_SANDBOX_PIDS_LIMIT=0` for unlimited.

## Soft defaults (optional)

Priority: **flag → template → `config.yaml` → env**.

```yaml
# ~/.config/cautem/config.yaml
defaults:
  memory: 2g
  cpu: 2
  pids_limit: 2048
```

```bash
export CAUTEM_DEFAULT_MEMORY=2g
export CAUTEM_DEFAULT_CPU=2
export CAUTEM_DEFAULT_PIDS_LIMIT=2048
```

There is no hard-coded create memory. Operators opt in via flag, template,
config, or env.

## Proxy sidecar

The egress sidecar uses a slim base image (`debian:bookworm-slim`), not the
agent image. Override with `CAUTEM_PROXY_IMAGE`.

GUI / noVNC sandboxes allocate **1 GiB** `/dev/shm` for Chromium.

## Verify

```bash
docker stats --no-stream
docker inspect cautem-demo --format '{{.HostConfig.Memory}} {{.HostConfig.NanoCpus}} {{.HostConfig.PidsLimit}}'
```
