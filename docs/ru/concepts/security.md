<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
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

## Что ещё проверяем

После проверки безопасности в октябре 2026 года исправлены известные пути через gateway внутренней Docker-сети, действующие CONNECT-потоки после смены политики, отсутствие SSH hardening wrapper, ошибки Docker inspect, системные mount targets и возврат удалённых gateway credentials из host environment. Для исправлений есть целевые тесты. Остаются проверки на работающем backend:

- Подтвердить, что `UpdateConfig` меняет решение запущенного proxy на Docker и на rootful/rootless Podman, в том числе после перезапуска gateway или proxy.
- Проверить блокирующий маршрут к host gateway на Podman 6.x. На версиях Podman, которые не могут обеспечить это ограничение, создание sandbox с proxy отклоняется.
- Проверить Docker IPv6 на dual-stack Engine и защитить путь workspace от гонки между проверкой и bind mount.

Эти ограничения существенны для политики с немедленным отзывом доступа. Общий статус приведён в разделе [совместимости с OpenShell](../reference/openshell-compatibility.md).

## Credentials

Предпочитайте `provider create`, а не `--env`. Cursor — через `agent login`,
без инжекта `CURSOR_API_KEY`. См. [Credentials](../guides/credentials.md).

## Гигиена ресурсов

Агенты без лимита и безлимитные container logs раздувают VM Docker Desktop.
Используйте `--memory`, soft defaults и ротацию json-file по умолчанию:

- [Ресурсы Docker](../providers/docker/resources.md)
- [Логи Docker](../providers/docker/logging.md)
