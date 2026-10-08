<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
-->

# Cursor Agent

## Образ

```bash
task docker:agent:cursor
# или: docker pull ghcr.io/whaleshell/whaleshell/sandboxes/cursor:latest
```

## Провайдеры и policy

```bash
CURSOR_API_KEY=… whaleshell provider create --name cursor --type cursor --credential CURSOR_API_KEY
GITHUB_TOKEN=…   whaleshell provider create --name gh --type github --credential GITHUB_TOKEN

ORG=YOUR_ORG
sed "s/YOUR_ORG/${ORG}/g" whaleshell-cli/policies/cursor-github-push.yaml \
  > /tmp/cursor-github-push.yaml
```

Профиль `cursor` в основном даёт egress allow (`**.cursor.sh` / `**.cursor.com`).
`CURSOR_API_KEY` в guest **не** инжектится (`inject_env: false`).

Builtin `github` — в основном read/clone. Для push нужна write-capable base
policy (пример выше).

## Create

```bash
whaleshell sandbox create \
  --name cursor \
  --from cursor \
  --workspace "$PWD" \
  --policy /tmp/cursor-github-push.yaml \
  --provider cursor \
  --provider gh \
  --memory 2g
```

Проверка:

```bash
whaleshell sandbox exec cursor -- env | grep -E 'TOKEN|KEY|CURSOR' || true
# ожидаем: GITHUB_TOKEN=whaleshell:resolve:… ; нет CURSOR_API_KEY
```

## Login и запуск

```bash
whaleshell sandbox connect cursor -- agent login
whaleshell sandbox connect cursor -- agent
```

OAuth пишется на persist volume (`/whaleshell/data`). После `stop`/`start`
login обычно сохраняется, пока volume не удалён.

```bash
whaleshell logs cursor --tail --source proxy
whaleshell term
```

## Host IDE (C2)

Откройте в Cursor IDE ту же папку, что в `--workspace`. Сеть и git гоняйте
через sandbox:

```bash
whaleshell sandbox exec cursor -- go test ./...
whaleshell sandbox exec cursor -- gh repo view
```

Не монтируйте `~/.ssh`, `~/.cursor`, `$HOME` без осознанного `--i-know`.

## Режимы

| Режим | Смысл |
|-------|-------|
| C1 | Agent CLI внутри sandbox |
| C2 | IDE на хосте + sandboxed workspace / exec |
