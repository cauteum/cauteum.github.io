<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cauteum
SPDX-License-Identifier: Apache-2.0
-->

# Environment

| Variable | Purpose |
|----------|---------|
| `CAUTEUM_DRIVER` | `docker` (default) \| `podman` |
| `CAUTEUM_PODMAN_SOCKET` | Explicit Podman API socket |
| `DOCKER_HOST` | Engine API endpoint |
| `CAUTEUM_DEFAULT_MEMORY` | Soft create default when `--memory` unset |
| `CAUTEUM_DEFAULT_CPU` | Soft create default when `--cpu` unset |
| `CAUTEUM_DEFAULT_PIDS_LIMIT` | Soft create default when `--pids-limit` unset |
| `CAUTEUM_SANDBOX_PIDS_LIMIT` | Driver PIDs default (`0` = unlimited) |
| `CAUTEUM_PROXY_IMAGE` | Slim proxy base image |
| `CAUTEUM_DOCKER_LOG_DRIVER` | `json-file` \| `none` |
| `CAUTEUM_DOCKER_LOG_MAX_SIZE` | json-file `max-size` (default `10m`) |
| `CAUTEUM_DOCKER_LOG_MAX_FILE` | json-file `max-file` (default `3`) |
| `CAUTEUM_SECRETS_KEK` | Gateway secrets key |
| `CAUTEUM_LOG_LEVEL` | Process log level (slogx) |

Config file: `~/.config/cauteum/config.yaml` (`defaults:`, `images:`, gateways).
