<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
-->

# Your first sandbox

With the CLI installed and the gateway running, create a sandbox for the
project you want the agent to work on.

## Create

Run this from the project folder:

```bash
whaleshell sandbox create \
  --name demo \
  --workspace "$PWD" \
  --policy whaleshell-cli/policies/default.yaml \
  --memory 2g
```

| Flag | What it does |
|------|--------------|
| `--name` | Sandbox name; the container is `whaleshell-<name>` |
| `--workspace` | Host folder mounted at `/workspace` |
| `--policy` | Network policy YAML (default-deny + allowlist) |
| `--memory` | Memory cap; recommended on Docker Desktop |

## Work inside

```bash
whaleshell sandbox list
whaleshell sandbox exec demo -- uname -a
whaleshell sandbox connect demo
```

`connect` opens an interactive shell inside the sandbox; your project is in
`/workspace`.

## Give it credentials

Optional. Secrets live in the gateway and never enter the sandbox — the agent
only sees placeholders:

```bash
GITHUB_TOKEN=… whaleshell provider create --name gh --type github --credential GITHUB_TOKEN

whaleshell sandbox create \
  --name demo \
  --workspace "$PWD" \
  --policy whaleshell-cli/policies/default.yaml \
  --provider gh
```

More: [Credential providers](../guides/credentials.md) ·
[Cursor agent](../guides/cursor.md).

## Watch, stop, clean up

```bash
whaleshell logs demo --tail --source proxy
whaleshell sandbox stop demo
whaleshell sandbox delete demo
```

`delete` removes the sandbox, its proxy sidecar, network and data volumes.
Provider secrets stay in the gateway.

## What's next

When the agent hits a blocked host, it gets a 403 with the reason. See
[Policy](../guides/policy.md) to approve a narrow rule without recreating the
sandbox, and [Recreate a sandbox](../guides/recreate-sandbox.md) for changes
that do need a fresh container.
