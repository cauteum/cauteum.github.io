<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
-->

# Cursor agent

## Image

```bash
task docker:agent:cursor
# or: docker pull ghcr.io/whaleshell/whaleshell/sandboxes/cursor:latest
```

## Providers and policy

```bash
CURSOR_API_KEY=… whaleshell provider create --name cursor --type cursor --credential CURSOR_API_KEY
GITHUB_TOKEN=…   whaleshell provider create --name gh --type github --credential GITHUB_TOKEN

ORG=YOUR_ORG
sed "s/YOUR_ORG/${ORG}/g" whaleshell-cli/policies/cursor-github-push.yaml \
  > /tmp/cursor-github-push.yaml
```

The `cursor` profile primarily contributes egress allow rules
(`**.cursor.sh` / `**.cursor.com`). It does **not** inject `CURSOR_API_KEY` into
the guest (`inject_env: false`).

Builtin `github` is mostly read/clone. Push needs a write-capable base policy
(example above).

## Create

```bash
whaleshell sandbox create \
  --name cursor \
  --from cursor \
  --workspace "$PWD" \
  --policy /tmp/cursor-github-push.yaml \
  --provider cursor \
  --provider gh \
  --memory 2g
```

Verify:

```bash
whaleshell sandbox exec cursor -- env | grep -E 'TOKEN|KEY|CURSOR' || true
# expect: GITHUB_TOKEN=whaleshell:resolve:… ; no CURSOR_API_KEY
```

## Login and run

```bash
whaleshell sandbox connect cursor -- agent login
whaleshell sandbox connect cursor -- agent
```

OAuth state lands under the persist volume (`/whaleshell/data`). After
`stop`/`start`, login usually survives until the volume is deleted.

```bash
whaleshell logs cursor --tail --source proxy
whaleshell term
```

## Host IDE (C2)

Open the same folder as `--workspace` in the host Cursor IDE. Run network and
git commands through the sandbox:

```bash
whaleshell sandbox exec cursor -- go test ./...
whaleshell sandbox exec cursor -- gh repo view
```

Do not mount `~/.ssh`, `~/.cursor`, or `$HOME` unless you intentionally pass
`--i-know`.

## Modes

| Mode | Meaning |
|------|---------|
| C1 | Agent CLI inside the sandbox |
| C2 | Host IDE + sandboxed workspace / exec |
