<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
-->

# Провайдер Podman

Podman — полноценный провайдер вычислений. whaleshell находит API-сокет Podman
и идёт по пути Docker Engine client (`driver.OpenEngine("podman")`). Labels,
сети, proxy sidecar и exec совпадают с Docker.

## Активация

```bash
export WHALESHELL_DRIVER=podman
# опционально:
# export WHALESHELL_PODMAN_SOCKET=$XDG_RUNTIME_DIR/podman/podman.sock

whaleshell status    # driver: podman
```

Флаги ресурсов, ротация логов, slim proxy и soft defaults — как у Docker:
[Ресурсы Docker](../docker/resources.md), [Логи Docker](../docker/logging.md).
