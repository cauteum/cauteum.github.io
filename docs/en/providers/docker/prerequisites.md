<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cautem
SPDX-License-Identifier: Apache-2.0
-->

# Docker prerequisites

## Engine

- Docker Engine 28.0+ or Docker Desktop with a working API socket.
- Linux: `/var/run/docker.sock` or rootless user socket.
- macOS / Windows: Docker Desktop; prefer the current **Docker VMM** backend for
  better memory reclaim under load.
- Podman 5.x+ on Linux runs the lifecycle subset. Podman 6+ is required for the
  current full proxy-backed sandbox path because older releases lack the
  required host-gateway blocking route. Rootful and rootless modes have
  different tested coverage; see the provider support table.

```bash
docker version
docker info
```

## Images

Pull or build at least one sandbox image before create:

```bash
# Local workspace build
task runtime:image:cli          # cautem-sandbox:local
task docker:agent:cursor        # cautem-sandbox:cursor

# Or GHCR catalog
docker pull ghcr.io/cautem/cautem/sandboxes/base:latest
```

Catalog and BYOC: [Images reference](../../reference/images.md).

## Gateway (recommended)

Proxy, secrets, and provider attach require a reachable gateway:

```bash
cautem gateway ensure
cautem gateway add http://127.0.0.1:7443 --local --name local
cautem gateway select local
```

Gateway Compose file: `cautem-gateway/compose/docker-compose.yml`.

## Desktop memory

Uncapped agent containers and unbounded container logs inflate the Desktop VM.
Set soft defaults (optional) and keep log rotation enabled (default):

```yaml
# ~/.config/cautem/config.yaml
defaults:
  memory: 2g
  cpu: 2
```

See [Resources and limits](./resources.md) and [Logging](./logging.md).
