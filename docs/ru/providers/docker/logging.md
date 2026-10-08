<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
-->

# Логирование (Docker)

## Логи контейнеров

Sandbox и proxy используют Docker `json-file` с ротацией:

| Параметр | По умолчанию |
|----------|--------------|
| Driver | `json-file` |
| `max-size` | `10m` |
| `max-file` | `3` |

```bash
export WHALESHELL_DOCKER_LOG_DRIVER=json-file   # или none
export WHALESHELL_DOCKER_LOG_MAX_SIZE=10m
export WHALESHELL_DOCKER_LOG_MAX_FILE=3
```

`none` отключает Engine-логи, если достаточно observation в gateway.

Запасной вариант на весь демон:

```json
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "3" }
}
```

## Observation ring

Gateway держит in-memory кольцо на sandbox (4096 строк). При delete кольцо
удаляется. Поток:

```bash
whaleshell logs demo --tail --source proxy
```
