<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cauteum
SPDX-License-Identifier: Apache-2.0
-->

# Создание sandbox (Docker)

## Минимальный create

```bash
cauteum sandbox create \
  --name demo \
  --workspace "$PWD" \
  --policy cauteum-cli/policies/default.yaml \
  --memory 2g
```

С образом агента и credential-провайдерами:

```bash
cauteum sandbox create \
  --name cursor \
  --from cursor \
  --workspace "$PWD" \
  --policy /path/to/policy.yaml \
  --provider cursor \
  --provider gh \
  --memory 2g
```

## Жизненный цикл

```bash
cauteum sandbox list
cauteum sandbox status demo
cauteum sandbox exec demo -- uname -a
cauteum sandbox connect demo          # интерактивный bash -il
cauteum sandbox stop demo
cauteum sandbox start demo
cauteum sandbox delete demo
```

Delete удаляет sandbox, proxy sidecar, сеть и помеченные volumes.

## Что делает create

1. Резолвит образ (`--image` / `--from` / default).
2. Подтягивает образы Engine (sandbox + slim proxy).
3. Создаёт `cauteum-net-<name>` (internal при включённом proxy).
4. Стартует `cauteum-proxy-<name>` из `debian:bookworm-slim`
   (`CAUTEUM_PROXY_IMAGE` для override).
5. Создаёт и стартует `cauteum-<name>` с политикой, bind workspace,
   опциональным data volume, лимитами CPU/memory/PIDs.
6. Регистрирует sandbox в gateway при наличии.

## Шаблоны

Фиксируйте sizing в template (как в OpenShell):

```bash
cauteum sandbox template create \
  --name desk \
  --from cursor \
  --memory 2g \
  --cpu 2 \
  --pids-limit 2048

cauteum sandbox create --template desk --name worker --workspace "$PWD"
```

Флаги перекрывают поля template. Soft defaults из config/env заполняют только
пустые поля — см. [Ресурсы](./resources.md).
