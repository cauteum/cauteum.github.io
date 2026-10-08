<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cauteum
SPDX-License-Identifier: Apache-2.0
-->

# Docker provider

A **compute provider** is the engine that runs the sandbox and its egress
proxy. It is picked with `CAUTEUM_DRIVER` and shown by `cauteum status`.

| Provider | `CAUTEUM_DRIVER` | Status |
|----------|---------------------|--------|
| Docker | `docker` | <span class="ws-badge ws-badge--ok">default</span> |
| Podman | `podman` | <span class="ws-badge ws-badge--ok">supported</span> |
| [Kubernetes](../kubernetes.md) | `kubernetes` | <span class="ws-badge ws-badge--soon">coming soon</span> |
| [MicroVM](../microvm.md) | `vm` | <span class="ws-badge ws-badge--soon">coming soon</span> |

Docker is the default. cauteum talks to the local Engine API
(`DOCKER_HOST` / Desktop socket), creates an internal network per sandbox,
starts an egress proxy sidecar, then starts the sandbox container.

## Layout (one sandbox)

```text
host Docker Engine
├── cauteum-<name>              sandbox (agent image)
├── cauteum-proxy-<name>        egress sidecar (slim base)
├── cauteum-net-<name>          internal network
├── cauteum-data-<name>         optional data volume
└── cauteum-ca-<name>           MITM CA volume (when proxy enabled)
```

## Activate

```bash
unset CAUTEUM_DRIVER          # or: export CAUTEUM_DRIVER=docker
cauteum doctor
cauteum status
```

Expect `driver: docker` in status output.

!!! tip "Not the same as credential providers"
    `--provider github`, `--provider cursor` and friends attach secrets and
    egress rules to a sandbox. They work with any compute provider — see
    [Credential providers](../../guides/credentials.md).
