<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
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

Compose: `whaleshell-gateway/compose/docker-compose.yml`.

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
- Compose-файлы: `whaleshell-gateway/compose/`

## Gateway TOML OpenShell

Daemon читает `--config gateway.toml`, затем `OPENSHELL_GATEWAY_CONFIG`,
затем необязательный `$XDG_CONFIG_HOME/openshell/gateway.toml`
(по умолчанию `~/.config/openshell/gateway.toml`). Явно указанный отсутствующий
файл вызывает ошибку. Для поддержанных settings приоритет: flag > env > file.

Startup применяет адрес основного listener, имя установки в логах,
простые log levels, SSH session TTL, local auth, OIDC/JWKS, TLS server/client
certificates, external SNI certificates, mTLS identity и выбор builtin/user
`provider_profile_sources`. Referenced paths сохраняются буквально и
вычисляются относительно рабочего каталога процесса. `disable_tls=true`
игнорирует server certificates; одновременно заданный client CA отклоняется.

Поддержка частичная. Полные deploy files OpenShell ещё требуют consumers
для drivers, storage, gateway JWT, OTLP, rate limits, middleware, interceptors
и полной readiness/metrics instrumentation. Указанные неподдержанные settings блокируют startup
до создания state и открытия listeners. Loader также отклоняет unknown/duplicate
keys, отсутствующие required fields, неверные enums и database URL внутри TOML.
Без файла OpenShell пока действуют прежние defaults whaleshell.
Необязательные `health_bind_address` и `metrics_bind_address`, а также
`OPENSHELL_HEALTH_PORT` / `OPENSHELL_METRICS_PORT` и соответствующие флаги
запускают отдельные listeners. Health routes доступны на `/healthz`, `/readyz`
и `/health`; metrics сейчас отдаёт только gauge состояния gateway. Мониторинг
готовности БД и полная Prometheus instrumentation пока не реализованы.

Настройки OpenShell OIDC issuer, audience, JWKS cache TTL и role claim
передаются JWT validator. Admin role может изменять gateway resources; user role
имеет read-only доступ; admin также удовлетворяет user role. Если указан
`scopes_claim`, известные группы REST routes требуют соответствующий scope
`sandbox:read/write`, `provider:read/write` или `config:read/write`; неизвестные
routes блокируются. Это REST mapping, а не полная per-RPC descriptor matrix.
Поддерживаются RSA, ECDSA P-256/P-384 и Ed25519 signing keys.

TLS загружает client CA и external cert/key pair из исходного gateway TOML.
При включённом OIDC клиентский сертификат проверяется, если он предъявлен;
mTLS-only authentication требует проверенный client certificate. External
certificate выбирается по настроенному точному или wildcard SNI имени.
Автоматическая local PKI и hot reload сертификатов ещё не реализованы.

По умолчанию используются встроенный и сохранённый user profile catalogs.
Исходный список позволяет выбрать только нужные источники, например:

```toml
[openshell.gateway]
provider_profile_sources = [{ type = "builtin" }]
```

Interceptor source отклоняется, пока не появятся gateway interceptor runtime
и его catalog protocol.
