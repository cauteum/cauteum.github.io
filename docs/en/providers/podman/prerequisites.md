<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cautem
SPDX-License-Identifier: Apache-2.0
-->

# Podman prerequisites

## Linux (rootless)

```bash
systemctl --user enable --now podman.socket
export CAUTEM_DRIVER=podman
# export CAUTEM_PODMAN_SOCKET=$XDG_RUNTIME_DIR/podman/podman.sock
# or: export DOCKER_HOST=unix:///run/user/$UID/podman/podman.sock

podman info
cautem status
```

## macOS (Podman Machine)

```bash
podman machine init     # once
podman machine start
export CAUTEM_DRIVER=podman
cautem status
```

Discovery also checks
`~/.local/share/containers/podman/machine/podman.sock` and `podman info`.

## Images

Use the same sandbox tags as Docker (`cautem-sandbox:local`, `:cursor`, …
or GHCR catalog). Build with Docker tooling on a host that can push/load into
Podman’s store, or `podman pull` / `podman load` equivalents.

```bash
podman images | grep cautem
```

## Gateway

Gateway still runs on the host (binary or compose). Select it before create with
providers or proxy enabled — same as Docker.
