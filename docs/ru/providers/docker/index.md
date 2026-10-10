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
| Docker Engine 24+ на Linux | `docker` | <span class="ws-badge ws-badge--ok">поддерживается, по умолчанию</span> |
| Docker Desktop на macOS/Windows | `docker` | <span class="ws-badge ws-badge--ok">beta</span> |
| Podman 6 на Linux, rootful/rootless | `podman` | <span class="ws-badge ws-badge--ok">цель релиза</span> |
| Podman 5 | `podman` | только lifecycle; нет изоляции proxy host-gateway |
| [Kubernetes](../kubernetes.md) | `kubernetes` | <span class="ws-badge ws-badge--soon">скоро</span> |
| [MicroVM](../microvm.md) | `vm` | <span class="ws-badge ws-badge--soon">скоро</span> |

Docker — провайдер по умолчанию. cauteum обращается к локальному Engine API
(`DOCKER_HOST` / сокет Desktop), создаёт внутреннюю сеть на sandbox, поднимает
egress-sidecar, затем sandbox-контейнер.

Release gate охватывает Docker Engine на Linux и Podman 6 на Linux в rootful и
rootless режимах. Docker Desktop остаётся beta и требует прямой smoke-проверки
на каждом поддерживаемом релизе хоста. Доступность gateway из WSL2 описана ниже,
но пока не входит в обязательную release matrix. Kubernetes и MicroVM не
являются production-провайдерами этого релиза.

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

## Приватные registry

После `docker login registry.example` при загрузке образа используется Docker
CLI credential config пользователя, от имени которого работает gateway,
включая настроенные credential helpers. Данные отправляются только вместе с
запросом Engine на загрузку образа и не попадают в конфигурацию sandbox или env.

## HTTPS с частным CA

Укажите `egress_ca_bundle` в конфигурации compute-драйвера Docker и передайте
PEM bundle с доверенными корнями для проверяемых HTTPS endpoints. Он дополняет
системное хранилище; проверка цепочки и hostname остаётся включённой. Это
отдельная настройка от `proxy_ca_bundle`, который задаёт CA для HTTPS
корпоративного forward proxy. После ротации bundle пересоздайте proxy sandbox.

Если после перезапуска rootless-движка меняется UID/GID mapping, в конфигурации
compute-драйвера Docker можно включить `reconcile_data_ownership`. При включённой
настройке привилегированный init при запуске переназначит владельца файлов в
отдельном persistent volume `/cauteum/data` на пользователя sandbox. По умолчанию
настройка выключена, на больших volume операция может занять время; bind mount
workspace не затрагивается.

### Docker Desktop в WSL2

Gateway заменяет loopback listener на `host.docker.internal` для supervisor в
sandbox. Если контейнер в WSL2 всё ещё не подключается к gateway, задайте
`grpc_endpoint` явно в конфигурации Docker compute-драйвера, например
`https://host.docker.internal:17670`. Для HTTPS одновременно задайте
`guest_tls_ca`, `guest_tls_cert` и `guest_tls_key`. Endpoint должен быть доступен
из сети контейнеров Docker Desktop.

!!! tip "Не путать с credential-провайдерами"
    `--provider github`, `--provider cursor` и другие подключают к песочнице
    секреты и egress-правила. Они работают с любым провайдером вычислений —
    см. [Credential-провайдеры](../../guides/credentials.md).
