<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
-->

# Окружение

| Переменная | Назначение |
|------------|------------|
| `WHALESHELL_DRIVER` | `docker` (default) \| `podman` |
| `WHALESHELL_PODMAN_SOCKET` | Явный API-сокет Podman |
| `DOCKER_HOST` | Endpoint Engine API |
| `WHALESHELL_DEFAULT_MEMORY` | Soft default create без `--memory` |
| `WHALESHELL_DEFAULT_CPU` | Soft default без `--cpu` |
| `WHALESHELL_DEFAULT_PIDS_LIMIT` | Soft default без `--pids-limit` |
| `WHALESHELL_SANDBOX_PIDS_LIMIT` | Default PIDs драйвера (`0` = без лимита) |
| `WHALESHELL_PROXY_IMAGE` | Slim-образ proxy |
| `WHALESHELL_DOCKER_LOG_DRIVER` | `json-file` \| `none` |
| `WHALESHELL_DOCKER_LOG_MAX_SIZE` | json-file `max-size` (default `10m`) |
| `WHALESHELL_DOCKER_LOG_MAX_FILE` | json-file `max-file` (default `3`) |
| `WHALESHELL_SECRETS_KEK` | Ключ secrets gateway |
| `WHALESHELL_LOG_LEVEL` | Уровень process-логов (slogx) |

Конфиг: `~/.config/whaleshell/config.yaml` (`defaults:`, `images:`, gateways).
