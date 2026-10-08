<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cauteum
SPDX-License-Identifier: Apache-2.0
-->

# Политика

Sandbox стартует в режиме default-deny. Базовый YAML плюс composition
credential-профилей дают effective allowlist, который enforcing egress proxy.

## Set и get

```bash
cauteum policy get demo --full
cauteum policy set demo --policy /path/to/policy.yaml --wait
```

`--wait` ждёт, пока sidecar перечитает bind-mounted effective YAML.

## policy.local (guest)

Внутри sandbox агент может читать deny и предлагать узкие правила через
`policy.local` (MITM HTTPS к sidecar):

| Method | Path |
|--------|------|
| GET | `/v1/policy/current` |
| GET | `/v1/denials?last=N` |
| POST | `/v1/proposals` |
| GET | `/v1/proposals/{id}/wait` |

## Цикл approve у оператора

```bash
cauteum rule get --status pending
cauteum rule approve --chunk-id chk_…
# или: cauteum rule reject --chunk-id chk_… --reason "narrow to /docs"
```

Approve мержит правило в base policy sandbox, переписывает live policy file и
делает hot-reload sidecar. Предпочитайте минимальный `addRule`.

## Ключи схемы

Документы policy используют `filesystem_policy`, `landlock` и
`network_policies` (`cauteum-core/policy`). L7-правила могут задавать
`protocol: rest|graphql|mcp` с method/path/tool.

## Связанное

- Skill: `/etc/cauteum/skills/policy-advisor`
