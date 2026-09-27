<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: MIT
-->

# Безопасность

| Граница | Доверие |
|---------|---------|
| Host Engine / Desktop | Доверенная машина оператора |
| Sandbox-контейнер | Недоверенный агент |
| Egress proxy | Доверенный sidecar |
| Store секретов gateway | Доверенный control plane |
| noVNC / display | Только loopback оператора |

## По умолчанию

- Нет `docker.sock` в sandbox
- Bind workspace с deny-list для `$HOME`, `~/.ssh`, `~/.aws`, `~/.cursor`
- Default-deny сеть; allowlist из policy + composition провайдеров
- Секреты как `whaleshell:resolve:env:…` с rewrite только на egress
- Default seccomp Docker; `no-new-privileges`; `CapDrop=NET_RAW`
- Landlock через `whaleshell-init` при ABI ≥ 1 (на Desktop часто ABI 0)

Egress proxy один раз разрешает имя назначения и подключается к проверенному
IP. Зарезервированные, loopback и link-local адреса остаются закрытыми даже
при `allowed_ips` в политике. Если настроен корпоративный HTTP proxy, имя
назначения разрешает уже он. Считайте его частью доверенной сетевой границы;
маршруты с `allowed_ips` в таком режиме отклоняются.

На Docker Desktop для macOS прокси может не получить достоверную идентичность
бинаря, открывшего соединение. Правило, зависящее от конкретного бинаря,
требует платформу с такой идентификацией; граница контейнера и ограничения
монтирования продолжают действовать.

## Credentials

Предпочитайте `provider create`, а не `--env`. Cursor — через `agent login`,
без инжекта `CURSOR_API_KEY`. См. [Credentials](../guides/credentials.md).

## Гигиена ресурсов

Агенты без лимита и безлимитные container logs раздувают VM Docker Desktop.
Используйте `--memory`, soft defaults и ротацию json-file по умолчанию:

- [Ресурсы Docker](../providers/docker/resources.md)
- [Логи Docker](../providers/docker/logging.md)
