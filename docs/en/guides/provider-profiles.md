<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: MIT
-->

# Provider profiles

Provider profiles package credential names, endpoint policy, binaries, and
discovery rules into a reusable YAML document. Whaleshell can import OpenShell
profile examples into a gateway catalog and use those profiles when creating
provider instances and composing sandbox policy.

## Review and lint a profile

Start with a profile whose endpoint hosts and binary paths match the image used
by your sandbox. Upstream profiles are examples; review the permissions and
paths before importing them.

```bash
whaleshell profile lint --url https://raw.githubusercontent.com/NVIDIA/OpenShell/main/providers/codex.yaml
whaleshell profile lint -f ./providers/codex.yaml
```

Lint checks the OpenShell schema and runtime features required by
`provider create`. Unsupported refresh strategies or token grants get a
field-specific error. Lint does not contact the provider or prove that a
credential works.

## Import a profile

Import one file, an HTTPS URL, or all supported YAML/JSON files in a directory:

```bash
whaleshell profile import --url https://raw.githubusercontent.com/NVIDIA/OpenShell/main/providers/openai.yaml
whaleshell profile import -f ./providers/codex.yaml
whaleshell profile import --from ./providers
whaleshell profile list
whaleshell profile describe codex -o yaml
```

Import creates a gateway catalog entry and fails if that ID already exists.
For an update, export the current profile first, edit it, then submit it with
`profile update`; the gateway rejects stale concurrent updates.

```bash
whaleshell profile export codex -o yaml > codex.yaml
# edit codex.yaml
whaleshell profile update -f codex.yaml
```

## Run Codex with an API key

The OpenShell Codex fixture describes `CODEX_AUTH_*` fields. For a direct
non-interactive Codex CLI run, the documented public environment variable is
`CODEX_API_KEY`; use a small image-matched profile for this flow. See the
[official Codex environment variable reference](https://learn.chatgpt.com/docs/config-file/environment-variables).

Save this as `codex-api.yaml`, then lint and import it:

```bash
cat > codex-api.yaml <<'YAML'
id: codex-api
display_name: Codex API key
category: agent
credentials:
  - name: api_key
    env_vars: [CODEX_API_KEY]
    required: true
    auth_style: bearer
    header_name: authorization
endpoints:
  - host: api.openai.com
    port: 443
    protocol: rest
    access: read-write
    enforcement: enforce
binaries: [/usr/local/bin/codex, /usr/bin/codex]
YAML

whaleshell profile lint -f codex-api.yaml
whaleshell profile import -f codex-api.yaml
CODEX_API_KEY=… whaleshell provider create --name codex --type codex-api --from-existing

whaleshell sandbox create \
  --name codex-work \
  --workspace "$PWD" \
  --provider codex
```

The profile declares credential environment names; the provider instance holds
actual values in the gateway's encrypted credential store. The CLI never prints
credential values. The guest receives placeholders and the egress proxy
resolves them only for profile-bound endpoints. Keep `endpoints` and `binaries`
aligned with the image: a profile cannot add an executable path that the image
does not contain.

OpenShell `oauth2_refresh_token` and `oauth2_client_credentials` profile
refreshes are wired into provider creation. Refresh material is stored in the
gateway's encrypted store, mapped response fields update their declared
credential keys, and sandbox secret resolution refreshes an expiring token.
The first rotation can also be requested with `whaleshell provider refresh
rotate NAME --credential-key ACCESS_TOKEN`.

The upstream Codex OAuth fixture describes `CODEX_AUTH_*` credentials, but
whaleshell does not acquire or refresh a ChatGPT login or implement Codex
workload identity federation. Token grants, AWS STS role assumption, Google
service-account JWT, and SigV4 signing are also outside the current runtime.
Profiles that request those features remain importable and exportable, while
`profile lint` and `provider create` report the unsupported field.

## Workspace and global catalogs

Workspace profiles override global profiles with the same ID inside that
workspace. Global catalog operations require the gateway's platform-admin
role; workspace writes require a workspace admin or owner.

```bash
whaleshell --workspace team-ml profile import -f codex-api.yaml
whaleshell profile list --workspace team-ml
whaleshell profile export codex-api --global -o yaml
```
