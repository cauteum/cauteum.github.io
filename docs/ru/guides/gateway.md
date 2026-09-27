<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: MIT
-->

# Gateway

Gateway — опциональный control plane: encrypted store секретов, registry
sandbox, observation log rings и workflow policy proposals.

## Запуск

```bash
whaleshell gateway ensure
whaleshell gateway add http://127.0.0.1:7443 --local --name local
whaleshell gateway select local
whaleshell gateway info
```

Compose: `packaging/compose/docker-compose.yml`.

Адрес по умолчанию: `127.0.0.1:7443`.
При `WHALESHELL_GATEWAY_ALLOW_UNAUTHENTICATED=1` или флаге
`--allow-unauthenticated-users` gateway запускается только на loopback-адресе.
На публичном или LAN-адресе запуск завершается ошибкой. Поле
`allow_unauthenticated` видно в `whaleshell gateway info`, а `whaleshell status`
показывает предупреждение. Reverse proxy и проброс порта могут открыть
loopback-сервис другим машинам — учитывайте это при развёртывании.

## Зоны ответственности

| Поверхность | Роль |
|-------------|------|
| Secrets | AES-GCM store; KEK через `WHALESHELL_SECRETS_KEK` или `secrets.kek` |
| Providers | Именованные инстансы + метаданные composition |
| Sandboxes | Registry upsert/delete; log ring; proposals |
| Sidecar | Resolve секретов через `host.whaleshell.internal` |

## Когда обязателен

| Операция | Gateway |
|----------|---------|
| Attach `--provider` | Обязателен |
| Egress proxy + rewrite | Обязателен |
| Create `--no-proxy` без providers | Опционален (dev) |

## Конфиг

Gateways пишутся в `~/.config/whaleshell/config.yaml`:

```yaml
current: local
gateways:
  local:
    url: http://127.0.0.1:7443
```

Поля OIDC и токены появляются после `whaleshell gateway login`.

## Связанное

- [Credentials](./credentials.md)
- [Политика](./policy.md)
- Packaging: `packaging/compose/`
