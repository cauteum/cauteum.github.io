<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: MIT
-->

# Gateway

The gateway is the optional control plane: encrypted credential store, sandbox
registry, observation log rings, and policy proposal workflow.

## Run

```bash
whaleshell gateway ensure
whaleshell gateway add http://127.0.0.1:7443 --local --name local
whaleshell gateway select local
whaleshell gateway info
```

Compose: `packaging/compose/docker-compose.yml`.

Listen address defaults to `127.0.0.1:7443`.
If you enable `WHALESHELL_GATEWAY_ALLOW_UNAUTHENTICATED=1` or pass
`--allow-unauthenticated-users`, the gateway accepts only a loopback listen
address. It refuses to start on a public or LAN address in this mode.
`whaleshell gateway info` reports `allow_unauthenticated`, and
`whaleshell status` displays a warning. Keep reverse proxies and port
forwarding in mind: they can expose a loopback listener to other machines.

## Responsibilities

| Surface | Role |
|---------|------|
| Secrets | AES-GCM store; KEK via `WHALESHELL_SECRETS_KEK` or `secrets.kek` |
| Providers | Named instances + profile composition metadata |
| Sandboxes | Registry upsert/delete; log ring; proposals |
| Sidecar | Resolves secrets over `host.whaleshell.internal` |

## When required

| Operation | Gateway |
|-----------|---------|
| `--provider` attach | Required |
| Egress proxy + rewrite | Required |
| Plain create `--no-proxy` without providers | Optional (dev) |

## Config

Gateways are recorded in `~/.config/whaleshell/config.yaml`:

```yaml
current: local
gateways:
  local:
    url: http://127.0.0.1:7443
```

OIDC fields and tokens may appear for authenticated gateways after
`whaleshell gateway login`.

## Related

- [Credentials](./credentials.md)
- [Policy](./policy.md)
- Hub packaging: `packaging/compose/`
