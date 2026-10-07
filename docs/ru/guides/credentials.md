<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
-->

# Credential-провайдеры

Credential-провайдеры привязывают именованные секреты и egress endpoints к
sandbox. Это не compute backend ([Docker](../providers/docker/index.md), [Podman](../providers/podman/index.md)).

## Store один раз

Секреты читаются из **env текущего процесса**, не из sticky `export` и не из
значений в argv.

```bash
GITHUB_TOKEN=… whaleshell provider create --name gh --type github --credential GITHUB_TOKEN
CURSOR_API_KEY=… whaleshell provider create --name cursor --type cursor --credential CURSOR_API_KEY

# если ключи уже в env этого процесса:
# whaleshell provider create --name gh --type github --from-existing

whaleshell provider list
whaleshell provider get gh
```

`list` / `get` никогда не печатают значения. Ciphertext — в encrypted store
gateway (`secrets.enc.json`).

## Attach на create

```bash
whaleshell sandbox create \
  --name demo \
  --workspace "$PWD" \
  --policy /path/to/policy.yaml \
  --provider gh \
  --provider cursor \
  --memory 2g
```

Composition подмешивает endpoints, binaries и `credential_keys` профиля в
effective policy. В guest — placeholders вида
`whaleshell:resolve:env:GITHUB_TOKEN`. Proxy делает rewrite на egress.

## Поведение профилей

| `--type` | Типичные ключи | Guest |
|----------|----------------|-------|
| `github` | `GITHUB_TOKEN` / `GH_TOKEN` | Placeholder + rewrite |
| `cursor` | `CURSOR_API_KEY` (опц.) | **Без** ключа (`inject_env: false`) → `agent login` |
| `nvidia` | `NVIDIA_API_KEY` | Placeholder |
| `claude-code` | `ANTHROPIC_API_KEY` | Placeholder |

```bash
whaleshell provider profile list
whaleshell provider profile show github
```

## Ротация

```bash
GITHUB_TOKEN=ghp_new… whaleshell provider refresh gh
# или: GITHUB_TOKEN=… whaleshell provider update gh --from-existing
```

## Не делайте

```bash
whaleshell sandbox create … --env GITHUB_TOKEN=ghp_…     # сырой секрет в guest
whaleshell sandbox create … --env CURSOR_API_KEY=whaleshell:resolve:…  # ломает Cursor Agent
```

## KEK

| Элемент | Деталь |
|---------|--------|
| Env | `WHALESHELL_SECRETS_KEK` (passphrase, base64 или hex ≥16 байт) |
| File fallback | `secrets.kek` в data dir gateway (mode 0600) |
| Doctor | Предупреждает, если KEK не закреплён в env |

Закрепите KEK для compose и долгоживущих gateway, иначе recreate может
осиротить ciphertext.
