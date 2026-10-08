<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cauteum
SPDX-License-Identifier: Apache-2.0
-->

# Troubleshooting (Docker)

| Symptom | Action |
|---------|--------|
| `docker not available` | Start Engine/Desktop; check `docker info` and `DOCKER_HOST` |
| Desktop VM RSS climbs past 10+ GiB | Use Docker VMM; set `--memory`; confirm log rotation; prune stopped containers |
| Image pull / missing tag | `task runtime:image:cli` or pull GHCR catalog |
| Proxy cannot reach gateway | Create with gateway selected; sidecar uses `host.cauteum.internal` |
| `CONNECT 403` / policy deny | Narrow allow via `cauteum rule approve` / policy set |
| Guest shows raw secrets | Use `--provider`, not `--env KEY=secret` |
| Cursor `invalid API key` | Do not inject `CURSOR_API_KEY`; run `agent login` in guest |
| Landlock noise on Desktop | Expected when ABI is 0; rely on container boundary |
| Stale sizing after upgrade | Recreate sandbox — LogConfig/PidsLimit apply at create time |

```bash
cauteum doctor
docker ps -a --filter label=cauteum.sandbox=1
docker stats --no-stream
cauteum logs <name> --source proxy
```
