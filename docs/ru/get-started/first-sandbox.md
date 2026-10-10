<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cauteum
SPDX-License-Identifier: Apache-2.0
-->

# Первая песочница

CLI установлен, gateway запущен — создайте песочницу для проекта, с которым
будет работать агент.

## Создание

Запускайте из папки проекта:

```bash
cauteum sandbox create \
  --name demo \
  --workspace "$PWD" \
  --policy cauteum-cli/policies/default.yaml \
  --memory 2g
```

| Флаг | Что делает |
|------|------------|
| `--name` | Имя песочницы; контейнер — `cauteum-<name>` |
| `--workspace` | Папка хоста, монтируется в `/workspace` |
| `--policy` | YAML сетевой политики (всё запрещено + allowlist) |
| `--memory` | Лимит памяти; рекомендуется на Docker Desktop |

## Работа внутри

```bash
cauteum sandbox list
cauteum sandbox exec demo -- uname -a
cauteum sandbox connect demo
```

`connect` открывает интерактивный shell в песочнице; проект лежит в
`/workspace`.

## Доступы

Опционально. Секреты хранятся в gateway и не попадают в песочницу — агент
видит только плейсхолдеры:

```bash
GITHUB_TOKEN=… cauteum provider create --name gh --type github --credential GITHUB_TOKEN

cauteum sandbox create \
  --name demo \
  --workspace "$PWD" \
  --policy cauteum-cli/policies/default.yaml \
  --provider gh
```

Подробнее: [Credential-провайдеры](../guides/credentials.md) ·
[Cursor Agent](../guides/cursor.md).

## Логи, остановка, удаление

```bash
cauteum logs demo --tail --source proxy
cauteum sandbox stop demo
cauteum sandbox delete demo
```

`delete` удаляет песочницу, её proxy sidecar, сеть и data volumes. Секреты
провайдеров остаются в gateway.

## Что дальше

Когда агент упирается в заблокированный хост, он получает 403 с причиной.
В разделе [Политика](../guides/policy.md) — как одобрить узкое правило без
пересоздания песочницы, а в [Пересоздание sandbox](../guides/recreate-sandbox.md) —
какие изменения всё же требуют нового контейнера.
