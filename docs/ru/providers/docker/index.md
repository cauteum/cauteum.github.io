<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cauteum
SPDX-License-Identifier: Apache-2.0
-->

# Провайдер Docker

**Провайдер вычислений** — движок, на котором работают песочница и её
egress-прокси. Выбирается через `CAUTEUM_DRIVER`, виден в
`cauteum status`.

| Провайдер | `CAUTEUM_DRIVER` | Статус |
|-----------|---------------------|--------|
| Docker | `docker` | <span class="ws-badge ws-badge--ok">по умолчанию</span> |
| Podman | `podman` | <span class="ws-badge ws-badge--ok">поддерживается</span> |
| [Kubernetes](../kubernetes.md) | `kubernetes` | <span class="ws-badge ws-badge--soon">скоро</span> |
| [MicroVM](../microvm.md) | `vm` | <span class="ws-badge ws-badge--soon">скоро</span> |

Docker — провайдер по умолчанию. cauteum обращается к локальному Engine API
(`DOCKER_HOST` / сокет Desktop), создаёт внутреннюю сеть на sandbox, поднимает
egress-sidecar, затем sandbox-контейнер.

## Схема (один sandbox)

```text
host Docker Engine
├── cauteum-<name>              sandbox (образ агента)
├── cauteum-proxy-<name>        egress sidecar (slim base)
├── cauteum-net-<name>          внутренняя сеть
├── cauteum-data-<name>         опциональный data volume
└── cauteum-ca-<name>           MITM CA (если proxy включён)
```

## Активация

```bash
unset CAUTEUM_DRIVER          # или: export CAUTEUM_DRIVER=docker
cauteum doctor
cauteum status
```

В статусе ожидайте `driver: docker`.

!!! tip "Не путать с credential-провайдерами"
    `--provider github`, `--provider cursor` и другие подключают к песочнице
    секреты и egress-правила. Они работают с любым провайдером вычислений —
    см. [Credential-провайдеры](../../guides/credentials.md).
