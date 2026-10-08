<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
-->

# Создание sandbox (Docker)

## Минимальный create

```bash
whaleshell sandbox create \
  --name demo \
  --workspace "$PWD" \
  --policy whaleshell-cli/policies/default.yaml \
  --memory 2g
```

С образом агента и credential-провайдерами:

```bash
whaleshell sandbox create \
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
whaleshell sandbox list
whaleshell sandbox status demo
whaleshell sandbox exec demo -- uname -a
whaleshell sandbox connect demo          # интерактивный bash -il
whaleshell sandbox stop demo
whaleshell sandbox start demo
whaleshell sandbox delete demo
```

Delete удаляет sandbox, proxy sidecar, сеть и помеченные volumes.

## Что делает create

1. Резолвит образ (`--image` / `--from` / default).
2. Подтягивает образы Engine (sandbox + slim proxy).
3. Создаёт `whaleshell-net-<name>` (internal при включённом proxy).
4. Стартует `whaleshell-proxy-<name>` из `debian:bookworm-slim`
   (`WHALESHELL_PROXY_IMAGE` для override).
5. Создаёт и стартует `whaleshell-<name>` с политикой, bind workspace,
   опциональным data volume, лимитами CPU/memory/PIDs.
6. Регистрирует sandbox в gateway при наличии.

## Шаблоны

Фиксируйте sizing в template (как в OpenShell):

```bash
whaleshell sandbox template create \
  --name desk \
  --from cursor \
  --memory 2g \
  --cpu 2 \
  --pids-limit 2048

whaleshell sandbox create --template desk --name worker --workspace "$PWD"
```

Флаги перекрывают поля template. Soft defaults из config/env заполняют только
пустые поля — см. [Ресурсы](./resources.md).
