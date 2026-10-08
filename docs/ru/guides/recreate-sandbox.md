<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cauteum
SPDX-License-Identifier: Apache-2.0
-->

# Пересоздание sandbox

Пересоздавайте sandbox, когда policy, bind proxy, LogConfig или лимиты ресурсов
должны примениться с чистого create. У running-контейнеров HostConfig
фиксируется на create.

## Что удаляет delete

| Удаляется | Остаётся |
|-----------|----------|
| `cauteum-<name>` | Секреты провайдеров в gateway |
| `cauteum-proxy-<name>` | Записи registry до явного delete |
| `cauteum-net-<name>` | |
| volume `cauteum-data-<name>` | |
| volume `cauteum-ca-<name>` | |

Удаление data volume сбрасывает `agent login` Cursor.

## Порядок

```bash
cauteum sandbox delete cursor

cauteum gateway ensure
cauteum doctor
cauteum provider list

cauteum sandbox create \
  --name cursor \
  --from cursor \
  --workspace "$PWD" \
  --policy cauteum-cli/policies/cursor-github-push-cauteum.yaml \
  --provider cursor \
  --provider gh \
  --memory 2g

cauteum sandbox connect cursor -- agent login
cauteum logs cursor --tail --source proxy
```

## Hot reload vs recreate

| Изменение | Предпочтительно |
|-----------|-----------------|
| Узкое правило policy | `cauteum policy set … --wait` / rule approve |
| Новый LogConfig / PIDs / memory | Recreate |
| Новые binds / образ | Recreate |
| Ротация секрета в store | `provider refresh` (часто достаточно) |
