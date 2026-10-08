<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
-->

# Требования Docker

## Engine

- Docker Engine 24+ или Docker Desktop с рабочим API-сокетом.
- Linux: `/var/run/docker.sock` или rootless user socket.
- macOS / Windows: Docker Desktop; для reclaim памяти предпочтителен текущий
  backend **Docker VMM**.

```bash
docker version
docker info
```

## Образы

Перед create нужен хотя бы один sandbox-образ:

```bash
# Локальная сборка в hub
task runtime:image:cli          # whaleshell-sandbox:local
task docker:agent:cursor        # whaleshell-sandbox:cursor

# Или каталог GHCR
docker pull ghcr.io/whaleshell/whaleshell/sandboxes/base:latest
```

Каталог и BYOC: [Справка по образам](../../reference/images.md).

## Gateway (рекомендуется)

Proxy, секреты и `--provider` требуют доступный gateway:

```bash
whaleshell gateway ensure
whaleshell gateway add http://127.0.0.1:7443 --local --name local
whaleshell gateway select local
```

Compose gateway: `whaleshell-gateway/compose/docker-compose.yml`.

## Память Desktop

Агенты без `--memory` и безлимитные container logs раздувают VM Desktop.
Задайте soft defaults (по желанию) и оставьте ротацию логов (включена по умолчанию):

```yaml
# ~/.config/whaleshell/config.yaml
defaults:
  memory: 2g
  cpu: 2
```

См. [Ресурсы и лимиты](./resources.md) и [Логирование](./logging.md).
