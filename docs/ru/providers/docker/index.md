<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
-->

# Провайдер Docker

**Провайдер вычислений** — движок, на котором работают песочница и её
egress-прокси. Выбирается через `WHALESHELL_DRIVER`, виден в
`whaleshell status`.

| Провайдер | `WHALESHELL_DRIVER` | Статус |
|-----------|---------------------|--------|
| Docker | `docker` | <span class="ws-badge ws-badge--ok">по умолчанию</span> |
| Podman | `podman` | <span class="ws-badge ws-badge--ok">поддерживается</span> |
| [Kubernetes](../kubernetes.md) | `kubernetes` | <span class="ws-badge ws-badge--soon">скоро</span> |
| [MicroVM](../microvm.md) | `vm` | <span class="ws-badge ws-badge--soon">скоро</span> |

Docker — провайдер по умолчанию. whaleshell обращается к локальному Engine API
(`DOCKER_HOST` / сокет Desktop), создаёт внутреннюю сеть на sandbox, поднимает
egress-sidecar, затем sandbox-контейнер.

## Схема (один sandbox)

```text
host Docker Engine
├── whaleshell-<name>              sandbox (образ агента)
├── whaleshell-proxy-<name>        egress sidecar (slim base)
├── whaleshell-net-<name>          внутренняя сеть
├── whaleshell-data-<name>         опциональный data volume
└── whaleshell-ca-<name>           MITM CA (если proxy включён)
```

## Активация

```bash
unset WHALESHELL_DRIVER          # или: export WHALESHELL_DRIVER=docker
whaleshell doctor
whaleshell status
```

В статусе ожидайте `driver: docker`.

!!! tip "Не путать с credential-провайдерами"
    `--provider github`, `--provider cursor` и другие подключают к песочнице
    секреты и egress-правила. Они работают с любым провайдером вычислений —
    см. [Credential-провайдеры](../../guides/credentials.md).
