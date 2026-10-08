<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
-->

# Get started

whaleshell is a single CLI that runs coding agents in policy-bound sandboxes on
Docker or Podman. Install the CLI, make sure a container engine is running and
pull a sandbox image — then [start the gateway](gateway.md) and
[create your first sandbox](first-sandbox.md).

## Install the CLI

### with the installer <small>recommended</small> { #with-installer data-toc-label="with the installer" }

The release binary is the fastest way in. Open up a terminal and run:

```bash
curl -LsSf https://raw.githubusercontent.com/whaleshell/whaleshell-cli/main/install.sh | sh
whaleshell version
```

The binary goes to `~/.local/bin` — make sure it is on your `PATH`.

=== "Pin a version"

    ```bash
    curl -LsSf https://raw.githubusercontent.com/whaleshell/whaleshell-cli/main/install.sh \
      | WHALESHELL_VERSION=v0.1.0-alpha.1 sh
    ```

=== "Another directory"

    ```bash
    curl -LsSf https://raw.githubusercontent.com/whaleshell/whaleshell-cli/main/install.sh \
      | WHALESHELL_INSTALL_DIR=/usr/local/bin sh
    ```

### from source

Build from the hub checkout if you want the latest `main` or work on
whaleshell itself:

```bash
cd /path/to/whaleshell
export GOWORK=$PWD/go.work

go build -C whaleshell-cli -o whaleshell ./cmd/whaleshell
./whaleshell-cli/whaleshell install
./whaleshell-cli/whaleshell version
```

## Start a container engine

whaleshell needs a running compute provider. Docker is the default; Podman
works through the same Engine API.

=== "Docker"

    Docker Engine 24+ or Docker Desktop. On macOS and Windows prefer the
    **Docker VMM** backend.

    ```bash
    docker info
    whaleshell doctor
    whaleshell status
    ```

=== "Podman on macOS"

    ```bash
    podman machine init     # once
    podman machine start
    export WHALESHELL_DRIVER=podman
    whaleshell status
    ```

=== "Podman on Linux"

    ```bash
    systemctl --user enable --now podman.socket
    export WHALESHELL_DRIVER=podman
    whaleshell status
    ```

`whaleshell status` should print the driver you picked (`docker` or `podman`).
Engine details: [Docker](../providers/docker/index.md) ·
[Podman](../providers/podman/index.md).

## Get a sandbox image

Pull the base image — it has the CLI tooling an agent needs:

```bash
docker pull ghcr.io/whaleshell/whaleshell/sandboxes/base:latest
```

!!! tip "Building images yourself"
    From the hub: `task runtime:image:cli` builds the base image and
    `task docker:agent:cursor` the Cursor agent. The full list is in
    [Images](../reference/images.md).
