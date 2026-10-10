<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cauteum
SPDX-License-Identifier: Apache-2.0
-->

# CLI

```text
cauteum sandbox create|list|get|stop|start|delete|exec|connect|upload|download|…
cauteum sandbox template create|list|get|delete
cauteum sandbox provider …
cauteum provider create|list|get|refresh|update|delete|profile …
cauteum gateway add|select|ensure|info|login|…
cauteum policy get|set|…
cauteum rule get|approve|reject|…
cauteum logs|term|doctor|status|version|install
```

## Create (compute)

| Флаг | Смысл |
|------|-------|
| `--name` | Имя sandbox |
| `--from` / `--image` | Alias или OCI reference |
| `--workspace` | Каталог хоста → `/workspace` |
| `--policy` | Базовый YAML политики |
| `--cpu` / `--memory` / `--pids-limit` | Runtime-лимиты |
| `--template` | Именованный workload template |
| `--provider` | Credential-провайдер (повтор) |
| `--no-proxy` | Без egress sidecar (dev) |
| `--display novnc` | GUI |
| `--gpu` | NVIDIA CDI |

## Soft defaults

Если флаги (и template) не задают sizing, config/env могут заполнить пробелы —
жёсткого default memory нет. См. [Ресурсы Docker](../providers/docker/resources.md).
