<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cauteum
SPDX-License-Identifier: Apache-2.0
-->

# Docker prerequisites

## Engine

- Docker Engine 24+ or Docker Desktop with a working API socket.
- Linux: `/var/run/docker.sock` or rootless user socket.
- macOS / Windows: Docker Desktop; prefer the current **Docker VMM** backend for
  better memory reclaim under load.

```bash
docker version
docker info
```

## Images

Pull or build at least one sandbox image before create:

```bash
# Local hub build
task runtime:image:cli          # cauteum-sandbox:local
task docker:agent:cursor        # cauteum-sandbox:cursor

# Or GHCR catalog
docker pull ghcr.io/cauteum/cauteum/sandboxes/base:latest
```

Catalog and BYOC: [Images reference](../../reference/images.md).

## Gateway (recommended)

Proxy, secrets, and provider attach require a reachable gateway:

```bash
cauteum gateway ensure
cauteum gateway add http://127.0.0.1:7443 --local --name local
cauteum gateway select local
```

Gateway Compose file: `cauteum-gateway/compose/docker-compose.yml`.

## Desktop memory

Uncapped agent containers and unbounded container logs inflate the Desktop VM.
Set soft defaults (optional) and keep log rotation enabled (default):

```yaml
# ~/.config/cauteum/config.yaml
defaults:
  memory: 2g
  cpu: 2
```

See [Resources and limits](./resources.md) and [Logging](./logging.md).
