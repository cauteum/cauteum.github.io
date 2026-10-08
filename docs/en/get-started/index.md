<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cauteum
SPDX-License-Identifier: Apache-2.0
-->

# Get started

cauteum is a single CLI that runs coding agents in policy-bound sandboxes on
Docker or Podman. Install the CLI, make sure a container engine is running and
pull a sandbox image — then [start the gateway](gateway.md) and
[create your first sandbox](first-sandbox.md).

## Install the CLI

### with the installer <small>recommended</small> { #with-installer data-toc-label="with the installer" }

The current CLI beta is `v0.1.0-beta.2`. Pin it when installing so this guide
keeps working even when a newer prerelease is published.
Open a terminal and run:

```bash
curl -LsSf https://raw.githubusercontent.com/cauteum/cauteum-cli/main/install.sh \
  | CAUTEUM_VERSION=v0.1.0-beta.2 sh
cauteum version
```

The binary goes to `~/.local/bin` — make sure it is on your `PATH`.

To install into another directory:

```bash
curl -LsSf https://raw.githubusercontent.com/cauteum/cauteum-cli/main/install.sh \
  | CAUTEUM_VERSION=v0.1.0-beta.2 CAUTEUM_INSTALL_DIR=/usr/local/bin sh
```

### from source

Build from the hub checkout if you want the latest `main` or work on
cauteum itself:

```bash
cd /path/to/cauteum
export GOWORK=$PWD/go.work

go build -C cauteum-cli -o cauteum ./cmd/cauteum
./cauteum-cli/cauteum install
./cauteum-cli/cauteum version
```

## Start a container engine

cauteum needs a running compute provider. Docker is the default; Podman
works through the same Engine API.

=== "Docker"

    Docker Engine 24+ or Docker Desktop. On macOS and Windows prefer the
    **Docker VMM** backend.

    ```bash
    docker info
    cauteum doctor
    cauteum status
    ```

=== "Podman on macOS"

    ```bash
    podman machine init     # once
    podman machine start
    export CAUTEUM_DRIVER=podman
    cauteum status
    ```

=== "Podman on Linux"

    ```bash
    systemctl --user enable --now podman.socket
    export CAUTEUM_DRIVER=podman
    cauteum status
    ```

`cauteum status` should print the driver you picked (`docker` or `podman`).
Engine details: [Docker](../providers/docker/index.md) ·
[Podman](../providers/podman/index.md).

## Get a sandbox image

Pull the base image — it has the CLI tooling an agent needs:

```bash
docker pull ghcr.io/cauteum/cauteum/sandboxes/base:latest
```

!!! tip "Building images yourself"
    From the hub: `task runtime:image:cli` builds the base image and
    `task docker:agent:cursor` the Cursor agent. The full list is in
    [Images](../reference/images.md).
