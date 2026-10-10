<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cauteum
SPDX-License-Identifier: Apache-2.0
-->

# Logging (Docker)

## Container logs

Sandbox and proxy containers use Docker `json-file` with rotation:

| Setting | Default |
|---------|---------|
| Driver | `json-file` |
| `max-size` | `10m` |
| `max-file` | `3` |

```bash
export CAUTEUM_DOCKER_LOG_DRIVER=json-file   # or none
export CAUTEUM_DOCKER_LOG_MAX_SIZE=10m
export CAUTEUM_DOCKER_LOG_MAX_FILE=3
```

`none` disables Engine container logs when you rely only on gateway observation.

Daemon-wide fallback (all containers on the host):

```json
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "3" }
}
```

## Observation ring

Gateway keeps a per-sandbox in-memory ring (4096 lines). Deleted sandboxes drop
their ring. Stream with:

```bash
cauteum logs demo --tail --source proxy
```

Process logs (CLI / gateway / proxy) use slogx.
