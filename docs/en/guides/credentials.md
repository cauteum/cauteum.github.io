<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
-->

# Credential providers

Credential providers bind named secrets and egress endpoints into a sandbox.
They are not compute backends ([Docker](../providers/docker/index.md), [Podman](../providers/podman/index.md)).

## Store once

Secrets are read from the **current process environment**, not from sticky
shell exports and not from argv values.

```bash
GITHUB_TOKEN=… whaleshell provider create --name gh --type github --credential GITHUB_TOKEN
CURSOR_API_KEY=… whaleshell provider create --name cursor --type cursor --credential CURSOR_API_KEY

# if keys are already in this process env:
# whaleshell provider create --name gh --type github --from-existing

whaleshell provider list
whaleshell provider get gh
```

`list` / `get` never print secret values. Ciphertext lives in the gateway
encrypted store (`secrets.enc.json`).

## Attach on create

```bash
whaleshell sandbox create \
  --name demo \
  --workspace "$PWD" \
  --policy /path/to/policy.yaml \
  --provider gh \
  --provider cursor \
  --memory 2g
```

Composition merges profile endpoints, binaries, and `credential_keys` into the
effective policy. The guest sees placeholders such as
`whaleshell:resolve:env:GITHUB_TOKEN`. The proxy rewrites them on egress.

## Profile behavior

| `--type` | Typical keys | Guest |
|----------|--------------|-------|
| `github` | `GITHUB_TOKEN` / `GH_TOKEN` | Placeholder + rewrite |
| `cursor` | `CURSOR_API_KEY` (optional) | **No** key (`inject_env: false`) → `agent login` |
| `nvidia` | `NVIDIA_API_KEY` | Placeholder |
| `claude-code` | `ANTHROPIC_API_KEY` | Placeholder |

```bash
whaleshell provider profile list
whaleshell provider profile show github
```

## Rotate

```bash
GITHUB_TOKEN=ghp_new… whaleshell provider refresh gh
# or: GITHUB_TOKEN=… whaleshell provider update gh --from-existing
```

## Do not

```bash
whaleshell sandbox create … --env GITHUB_TOKEN=ghp_…     # raw secret in guest
whaleshell sandbox create … --env CURSOR_API_KEY=whaleshell:resolve:…  # breaks Cursor Agent
```

## KEK

| Item | Detail |
|------|--------|
| Env | `WHALESHELL_SECRETS_KEK` (passphrase, base64, or hex ≥16 bytes) |
| File fallback | `secrets.kek` in gateway data dir (mode 0600) |
| Doctor | Warns when KEK is not env-pinned |

Pin KEK for compose or long-lived gateways so recreate does not orphan
ciphertext.
