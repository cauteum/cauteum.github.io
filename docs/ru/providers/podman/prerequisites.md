<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cautem
SPDX-License-Identifier: Apache-2.0
-->

# Требования Podman

## Linux (rootless)

```bash
systemctl --user enable --now podman.socket
export CAUTEM_DRIVER=podman
# export CAUTEM_PODMAN_SOCKET=$XDG_RUNTIME_DIR/podman/podman.sock
# или: export DOCKER_HOST=unix:///run/user/$UID/podman/podman.sock

podman info
cautem status
```

## macOS (Podman Machine)

```bash
podman machine init     # один раз
podman machine start
export CAUTEM_DRIVER=podman
cautem status
```

Discovery также смотрит
`~/.local/share/containers/podman/machine/podman.sock` и `podman info`.

## Образы

Те же теги, что у Docker (`cautem-sandbox:local`, `:cursor`, … или GHCR).
Соберите через Docker tooling с загрузкой в store Podman, либо
`podman pull` / `podman load`.

```bash
podman images | grep cautem
```

## Gateway

Gateway по-прежнему на хосте (бинарь или compose). Выберите его до create с
proxy/providers — как для Docker.
