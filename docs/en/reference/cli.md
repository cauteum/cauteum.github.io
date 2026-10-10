<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cauteum
SPDX-License-Identifier: Apache-2.0
-->

# CLI surface

```text
cauteum sandbox create|list|get|stop|start|delete|exec|connect|upload|download|…
cauteum sandbox template create|list|get|delete
cauteum sandbox provider …
cauteum provider create|list|get|refresh|update|delete|profile …
cauteum gateway add|select|ensure|info|login|…
cauteum policy get|set|…
cauteum rule get|approve|reject|…
cauteum logs|term|doctor|status|version|install
```

## Create (compute)

| Flag | Meaning |
|------|---------|
| `--name` | Sandbox name |
| `--from` / `--image` | Image alias or OCI reference |
| `--workspace` | Host path → `/workspace` |
| `--policy` | Base policy YAML |
| `--cpu` / `--memory` / `--pids-limit` | Runtime limits |
| `--template` | Named workload template |
| `--provider` | Credential provider (repeatable) |
| `--no-proxy` | Skip egress sidecar (dev) |
| `--display novnc` | GUI image path |
| `--gpu` | NVIDIA CDI devices |

## Soft defaults

When flags (and template) omit sizing, config/env may fill gaps — never a
hard-coded memory. See [Docker resources](../providers/docker/resources.md).
