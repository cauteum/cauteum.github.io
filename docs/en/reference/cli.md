<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
-->

# CLI surface

```text
whaleshell sandbox create|list|get|stop|start|delete|exec|connect|upload|download|…
whaleshell sandbox template create|list|get|delete
whaleshell sandbox provider …
whaleshell provider create|list|get|refresh|update|delete|profile …
whaleshell gateway add|select|ensure|info|login|…
whaleshell policy get|set|…
whaleshell rule get|approve|reject|…
whaleshell logs|term|doctor|status|version|install
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
