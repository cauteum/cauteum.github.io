<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cauteum
SPDX-License-Identifier: Apache-2.0
-->

# Podman provider

Podman is a first-class compute provider. cauteum discovers a Podman API
socket and reuses the Docker Engine client path (`driver.OpenEngine("podman")`).
Sandbox labels, networks, proxy sidecar, and exec flows match Docker.

## Activate

```bash
export CAUTEUM_DRIVER=podman
# optional:
# export CAUTEUM_PODMAN_SOCKET=$XDG_RUNTIME_DIR/podman/podman.sock

cauteum status    # driver: podman
```

Resource flags, log rotation, slim proxy image, and soft defaults behave the
same as on Docker — see [Docker resources](../docker/resources.md) and
[Docker logging](../docker/logging.md).
