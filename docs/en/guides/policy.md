<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cautem
SPDX-License-Identifier: Apache-2.0
-->

# Policy

Sandboxes start default-deny. The base policy YAML plus composed credential
provider profiles form the effective allowlist enforced by the egress proxy.

## Set and get

```bash
cautem policy get demo --full
cautem policy set demo --policy /path/to/policy.yaml --wait
```

`--wait` blocks until the sidecar reloads the bind-mounted effective YAML.

## policy.local (guest)

Inside the sandbox, agents can query denials and propose narrow rules via
`policy.local` (MITM HTTPS to the sidecar):

| Method | Path |
|--------|------|
| GET | `/v1/policy/current` |
| GET | `/v1/denials?last=N` |
| POST | `/v1/proposals` |
| GET | `/v1/proposals/{id}/wait` |

## Operator approve loop

```bash
cautem rule get --status pending
cautem rule approve --chunk-id chk_…
# or: cautem rule reject --chunk-id chk_… --reason "narrow to /docs"
```

Approve merges into the sandbox base policy, rewrites the live policy file, and
hot-reloads the sidecar. Prefer the smallest `addRule` that unblocks the task.

## Schema keys

Policy documents use `filesystem_policy`, `landlock`, and `network_policies`
(`cautem-core/policy`). L7 rules may set `protocol: rest|graphql|mcp` with
method/path/tool constraints.

## Related

- Skill: `/etc/cautem/skills/policy-advisor`
