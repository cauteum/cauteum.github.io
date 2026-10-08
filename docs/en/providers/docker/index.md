<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
-->

# Docker provider

A **compute provider** is the engine that runs the sandbox and its egress
proxy. It is picked with `WHALESHELL_DRIVER` and shown by `whaleshell status`.

| Provider | `WHALESHELL_DRIVER` | Status |
|----------|---------------------|--------|
| Docker | `docker` | <span class="ws-badge ws-badge--ok">default</span> |
| Podman | `podman` | <span class="ws-badge ws-badge--ok">supported</span> |
| [Kubernetes](../kubernetes.md) | `kubernetes` | <span class="ws-badge ws-badge--soon">coming soon</span> |
| [MicroVM](../microvm.md) | `vm` | <span class="ws-badge ws-badge--soon">coming soon</span> |

Docker is the default. whaleshell talks to the local Engine API
(`DOCKER_HOST` / Desktop socket), creates an internal network per sandbox,
starts an egress proxy sidecar, then starts the sandbox container.

## Layout (one sandbox)

```text
host Docker Engine
├── whaleshell-<name>              sandbox (agent image)
├── whaleshell-proxy-<name>        egress sidecar (slim base)
├── whaleshell-net-<name>          internal network
├── whaleshell-data-<name>         optional data volume
└── whaleshell-ca-<name>           MITM CA volume (when proxy enabled)
```

## Activate

```bash
unset WHALESHELL_DRIVER          # or: export WHALESHELL_DRIVER=docker
whaleshell doctor
whaleshell status
```

Expect `driver: docker` in status output.

!!! tip "Not the same as credential providers"
    `--provider github`, `--provider cursor` and friends attach secrets and
    egress rules to a sandbox. They work with any compute provider — see
    [Credential providers](../../guides/credentials.md).
