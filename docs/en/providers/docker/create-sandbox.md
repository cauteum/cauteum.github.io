<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cautem
SPDX-License-Identifier: Apache-2.0
-->

# Create a sandbox (Docker)

## Minimal create

```bash
cautem sandbox create \
  --name demo \
  --workspace "$PWD" \
  --policy cautem-cli/policies/default.yaml \
  --memory 2g
```

With an agent image and credential providers:

```bash
cautem sandbox create \
  --name cursor \
  --from cursor \
  --workspace "$PWD" \
  --policy /path/to/policy.yaml \
  --provider cursor \
  --provider gh \
  --memory 2g
```

## Lifecycle

```bash
cautem sandbox list
cautem sandbox status demo
cautem sandbox exec demo -- uname -a
cautem sandbox connect demo          # interactive bash -il
cautem sandbox stop demo
cautem sandbox start demo
cautem sandbox delete demo
```

Delete removes the sandbox container, proxy sidecar, network, and labeled volumes.

## What create does

1. Resolves image (`--image` / `--from` / default).
2. Ensures Engine images (sandbox + slim proxy base).
3. Creates `cautem-net-<name>` (internal when proxy is on).
4. Starts `cautem-proxy-<name>` from `debian:bookworm-slim` (override:
   `CAUTEM_PROXY_IMAGE`).
5. Creates and starts `cautem-<name>` with policy, workspace bind, optional
   data volume, CPU/memory/PIDs limits.
6. Registers with the gateway when configured.

## Templates

Bake sizing into a reusable template (OpenShell-style):

```bash
cautem sandbox template create \
  --name desk \
  --from cursor \
  --memory 2g \
  --cpu 2 \
  --pids-limit 2048

cautem sandbox create --template desk --name worker --workspace "$PWD"
```

Flag values override template fields. Soft defaults from config/env fill gaps
only when flags and template omit them — see [Resources](./resources.md).
