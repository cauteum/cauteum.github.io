<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cauteum
SPDX-License-Identifier: Apache-2.0
-->

# Требования Docker

## Engine

- Docker Engine 24+ или Docker Desktop с рабочим API-сокетом.
- Linux: `/var/run/docker.sock` или rootless user socket.
- macOS / Windows: Docker Desktop; для reclaim памяти предпочтителен текущий
  backend **Docker VMM**.
- Podman: версия 6+ на Linux для полного пути с egress proxy. Поддерживаются
  rootful и rootless sockets. Podman 5 запускает проверенный lifecycle subset,
  но proxy-backed create завершается fail closed, потому что нужный блокирующий
  маршрут host-gateway недоступен.

```bash
docker version
docker info
```

## Образы

Перед create нужен хотя бы один sandbox-образ:

```bash
# Локальная сборка в hub
task runtime:image:cli          # cauteum-sandbox:local
task docker:agent:cursor        # cauteum-sandbox:cursor

# Или каталог GHCR
docker pull ghcr.io/cauteum/cauteum/sandboxes/base:latest
```

Каталог и BYOC: [Справка по образам](../../reference/images.md).

## Gateway (рекомендуется)

Proxy, секреты и `--provider` требуют доступный gateway:

```bash
cauteum gateway ensure
cauteum gateway add http://127.0.0.1:7443 --local --name local
cauteum gateway select local
```

Compose gateway: `cauteum-gateway/compose/docker-compose.yml`.

## Память Desktop

Агенты без `--memory` и безлимитные container logs раздувают VM Desktop.
Задайте soft defaults (по желанию) и оставьте ротацию логов (включена по умолчанию):

```yaml
# ~/.config/cauteum/config.yaml
defaults:
  memory: 2g
  cpu: 2
```

См. [Ресурсы и лимиты](./resources.md) и [Логирование](./logging.md).
