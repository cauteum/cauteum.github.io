<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
-->

# Podman provider

Podman is a first-class compute provider. whaleshell discovers a Podman API
socket and reuses the Docker Engine client path (`driver.OpenEngine("podman")`).
Sandbox labels, networks, proxy sidecar, and exec flows match Docker.

## Activate

```bash
export WHALESHELL_DRIVER=podman
# optional:
# export WHALESHELL_PODMAN_SOCKET=$XDG_RUNTIME_DIR/podman/podman.sock

whaleshell status    # driver: podman
```

Resource flags, log rotation, slim proxy image, and soft defaults behave the
same as on Docker — see [Docker resources](../docker/resources.md) and
[Docker logging](../docker/logging.md).
