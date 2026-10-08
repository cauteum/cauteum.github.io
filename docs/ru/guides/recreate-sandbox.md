<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
-->

# Пересоздание sandbox

Пересоздавайте sandbox, когда policy, bind proxy, LogConfig или лимиты ресурсов
должны примениться с чистого create. У running-контейнеров HostConfig
фиксируется на create.

## Что удаляет delete

| Удаляется | Остаётся |
|-----------|----------|
| `whaleshell-<name>` | Секреты провайдеров в gateway |
| `whaleshell-proxy-<name>` | Записи registry до явного delete |
| `whaleshell-net-<name>` | |
| volume `whaleshell-data-<name>` | |
| volume `whaleshell-ca-<name>` | |

Удаление data volume сбрасывает `agent login` Cursor.

## Порядок

```bash
whaleshell sandbox delete cursor

whaleshell gateway ensure
whaleshell doctor
whaleshell provider list

whaleshell sandbox create \
  --name cursor \
  --from cursor \
  --workspace "$PWD" \
  --policy whaleshell-cli/policies/cursor-github-push-whaleshell.yaml \
  --provider cursor \
  --provider gh \
  --memory 2g

whaleshell sandbox connect cursor -- agent login
whaleshell logs cursor --tail --source proxy
```

## Hot reload vs recreate

| Изменение | Предпочтительно |
|-----------|-----------------|
| Узкое правило policy | `whaleshell policy set … --wait` / rule approve |
| Новый LogConfig / PIDs / memory | Recreate |
| Новые binds / образ | Recreate |
| Ротация секрета в store | `provider refresh` (часто достаточно) |
