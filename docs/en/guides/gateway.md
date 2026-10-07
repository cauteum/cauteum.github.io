<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
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

Compose: `whaleshell-gateway/compose/docker-compose.yml`.

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
- Compose files: `whaleshell-gateway/compose/`

## OpenShell gateway TOML

The daemon reads `--config gateway.toml`, then `OPENSHELL_GATEWAY_CONFIG`,
then an optional `$XDG_CONFIG_HOME/openshell/gateway.toml`
(`~/.config/openshell/gateway.toml` fallback). Explicit missing files fail.
Supported values follow flag > environment > file precedence.

Current startup applies the main bind address, installation name in logs,
simple log levels, SSH session TTL, local auth, OIDC/JWKS settings, TLS server
and client certificates, external SNI certificates, mTLS identity, and builtin
or user `provider_profile_sources`. Referenced paths remain literal and
relative to the process working directory. `disable_tls=true` ignores server
certificate material; configuring a client CA at the same time is rejected.

This support is partial. Full OpenShell deployment files still require missing
driver, storage, gateway JWT, OTLP, rate-limit, middleware, interceptor, and
complete readiness/metrics consumers. Supplied unsupported settings fail before the daemon
creates state or opens listeners. The loader also rejects unknown/duplicate
keys, invalid required fields/enums, and a database URL embedded in TOML.
Without an OpenShell file, the existing whaleshell defaults still apply.
The optional `health_bind_address` and `metrics_bind_address` tables, plus
`OPENSHELL_HEALTH_PORT` / `OPENSHELL_METRICS_PORT` and matching port flags,
start separate listeners. Health routes are available at `/healthz`, `/readyz`,
and `/health`; metrics currently exports only a gateway-up gauge. Database
readiness monitoring and full Prometheus instrumentation remain incomplete.

OpenShell OIDC issuer, audience, JWKS cache TTL, and role claim settings feed
the JWT validator. Admin roles may write gateway resources; user roles are
read-only; admins also satisfy the user role. When `scopes_claim` is set,
known REST route groups require the corresponding `sandbox:read/write`,
`provider:read/write`, or `config:read/write` claim; unmapped routes fail
closed. This REST mapping is not yet the full per-RPC descriptor matrix. OIDC
signature validation supports the OpenShell RSA, P-256/P-384 ECDSA, and
Ed25519 key families.

TLS can load a client CA and an external certificate pair from the original
gateway TOML. The client CA is optional verification when OIDC is enabled;
mTLS-only authentication requires a verified client certificate. External
certificates are selected by configured exact or wildcard SNI names. Automatic
local PKI generation and watched certificate reload are still pending.

By default, profiles come from both the built-in and stored user catalogs. The
source list can restrict that selection, for example:

```toml
[openshell.gateway]
provider_profile_sources = [{ type = "builtin" }]
```

An interceptor profile source is rejected until the gateway interceptor
runtime and its catalog protocol are implemented.
