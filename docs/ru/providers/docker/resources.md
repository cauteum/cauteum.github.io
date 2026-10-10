<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cautem
SPDX-License-Identifier: Apache-2.0
-->

# Ресурсы и лимиты (Docker)

Docker применяет CPU, память и PIDs как runtime-лимиты контейнера. Без
`--memory` память не ограничена (паритет с OpenShell на пути Docker).

## Флаги

| Флаг | Пример | Эффект |
|------|--------|--------|
| `--cpu` | `2` | `NanoCPUs` |
| `--memory` | `2g`, `512m` | `HostConfig.Memory` |
| `--pids-limit` | `2048`, `-1` | cgroup PIDs; `-1` — без лимита |

PIDs по умолчанию **2048**, если не задано (как OpenShell `sandbox_pids_limit`).
`CAUTEM_SANDBOX_PIDS_LIMIT=0` — без лимита.

## Soft defaults (опционально)

Приоритет: **флаг → template → `config.yaml` → env**.

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

Жёсткого default memory на create нет. Оператор включает лимит флагом,
template, config или env.

## Proxy sidecar

Egress sidecar идёт со slim-образом (`debian:bookworm-slim`), не с образом
агента. Override: `CAUTEM_PROXY_IMAGE`.

GUI / noVNC выделяют **1 GiB** `/dev/shm` под Chromium.

## Проверка

```bash
docker stats --no-stream
docker inspect cautem-demo --format '{{.HostConfig.Memory}} {{.HostConfig.NanoCpus}} {{.HostConfig.PidsLimit}}'
```
