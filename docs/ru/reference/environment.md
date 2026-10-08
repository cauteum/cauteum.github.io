<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cauteum
SPDX-License-Identifier: Apache-2.0
-->

# Окружение

| Переменная | Назначение |
|------------|------------|
| `CAUTEUM_DRIVER` | `docker` (default) \| `podman` |
| `CAUTEUM_PODMAN_SOCKET` | Явный API-сокет Podman |
| `DOCKER_HOST` | Endpoint Engine API |
| `CAUTEUM_DEFAULT_MEMORY` | Soft default create без `--memory` |
| `CAUTEUM_DEFAULT_CPU` | Soft default без `--cpu` |
| `CAUTEUM_DEFAULT_PIDS_LIMIT` | Soft default без `--pids-limit` |
| `CAUTEUM_SANDBOX_PIDS_LIMIT` | Default PIDs драйвера (`0` = без лимита) |
| `CAUTEUM_PROXY_IMAGE` | Slim-образ proxy |
| `CAUTEUM_DOCKER_LOG_DRIVER` | `json-file` \| `none` |
| `CAUTEUM_DOCKER_LOG_MAX_SIZE` | json-file `max-size` (default `10m`) |
| `CAUTEUM_DOCKER_LOG_MAX_FILE` | json-file `max-file` (default `3`) |
| `CAUTEUM_SECRETS_KEK` | Ключ secrets gateway |
| `CAUTEUM_LOG_LEVEL` | Уровень process-логов (slogx) |

Конфиг: `~/.config/cauteum/config.yaml` (`defaults:`, `images:`, gateways).
