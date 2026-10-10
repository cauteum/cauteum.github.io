<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cauteum
SPDX-License-Identifier: Apache-2.0
-->

# Your first sandbox

With the CLI installed and the gateway running, create a sandbox for the
project you want the agent to work on.

## Create

Run this from the project folder:

```bash
cauteum sandbox create \
  --name demo \
  --workspace "$PWD" \
  --policy cauteum-cli/policies/default.yaml \
  --memory 2g
```

| Flag | What it does |
|------|--------------|
| `--name` | Sandbox name; the container is `cauteum-<name>` |
| `--workspace` | Host folder mounted at `/workspace` |
| `--policy` | Network policy YAML (default-deny + allowlist) |
| `--memory` | Memory cap; recommended on Docker Desktop |

## Work inside

```bash
cauteum sandbox list
cauteum sandbox exec demo -- uname -a
cauteum sandbox connect demo
```

`connect` opens an interactive shell inside the sandbox; your project is in
`/workspace`.

## Give it credentials

Optional. Secrets live in the gateway and never enter the sandbox — the agent
only sees placeholders:

```bash
GITHUB_TOKEN=… cauteum provider create --name gh --type github --credential GITHUB_TOKEN

cauteum sandbox create \
  --name demo \
  --workspace "$PWD" \
  --policy cauteum-cli/policies/default.yaml \
  --provider gh
```

More: [Credential providers](../guides/credentials.md) ·
[Cursor agent](../guides/cursor.md).

## Watch, stop, clean up

```bash
cauteum logs demo --tail --source proxy
cauteum sandbox stop demo
cauteum sandbox delete demo
```

`delete` removes the sandbox, its proxy sidecar, network and data volumes.
Provider secrets stay in the gateway.

## What's next

When the agent hits a blocked host, it gets a 403 with the reason. See
[Policy](../guides/policy.md) to approve a narrow rule without recreating the
sandbox, and [Recreate a sandbox](../guides/recreate-sandbox.md) for changes
that do need a fresh container.
