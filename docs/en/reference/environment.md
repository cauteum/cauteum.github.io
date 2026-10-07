<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
-->

# Environment

| Variable | Purpose |
|----------|---------|
| `WHALESHELL_DRIVER` | `docker` (default) \| `podman` |
| `WHALESHELL_PODMAN_SOCKET` | Explicit Podman API socket |
| `DOCKER_HOST` | Engine API endpoint |
| `WHALESHELL_DEFAULT_MEMORY` | Soft create default when `--memory` unset |
| `WHALESHELL_DEFAULT_CPU` | Soft create default when `--cpu` unset |
| `WHALESHELL_DEFAULT_PIDS_LIMIT` | Soft create default when `--pids-limit` unset |
| `WHALESHELL_SANDBOX_PIDS_LIMIT` | Driver PIDs default (`0` = unlimited) |
| `WHALESHELL_PROXY_IMAGE` | Slim proxy base image |
| `WHALESHELL_DOCKER_LOG_DRIVER` | `json-file` \| `none` |
| `WHALESHELL_DOCKER_LOG_MAX_SIZE` | json-file `max-size` (default `10m`) |
| `WHALESHELL_DOCKER_LOG_MAX_FILE` | json-file `max-file` (default `3`) |
| `WHALESHELL_SECRETS_KEK` | Gateway secrets key |
| `WHALESHELL_LOG_LEVEL` | Process log level (slogx) |

Config file: `~/.config/whaleshell/config.yaml` (`defaults:`, `images:`, gateways).
