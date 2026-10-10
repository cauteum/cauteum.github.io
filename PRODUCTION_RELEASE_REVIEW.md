# Cauteum: архитектурное ревью и план следующего релиза

Дата среза: 2026-10-10. Область: Docker/Podman, gateway, runtime, CLI, Go/Python/TypeScript SDK, Control RPC, браузерная консоль. Kubernetes и MicroVM остаются экспериментальными и не входят в критерий готовности релиза. Модули выпущены согласованным beta-набором; финальная production-приёмка, staging и canary всё ещё требуют целевого окружения.

## Решение по выпуску

**Beta-релиз опубликован и проходит независимый consumer gate, но до production rollout остаются P0 проверки и окружение.** Все модули слиты и помечены beta-тегами; CLI `v0.1.0-beta.3` содержит CLI, Gateway, Go console и Linux helpers. `task release:published` повторно прошёл с `GOWORK=off` против опубликованных тегов. Полный `task compat:release` повторно прошёл 2026-10-10: lint, vet, vuln, unit/integration/race, standalone/published consumers, release artifacts/SBOM, strict docs и Docker/Podman E2E. Отдельно прошли TypeScript SDK typecheck, production build UI, Python SDK (`4 passed`) и Playwright E2E Go console. В Driver, Gateway и CLI обновлён Docker CLI до `v29.2.0`; кроссплатформенный CI, архивная установка и Podman 6.1.3 rootful/rootless CI прошли. `govulncheck -show verbose` не обнаруживает достижимых уязвимостей; остаётся module-level advisory для `x/crypto/openpgp` без версии исправления, Cauteum использует из этого модуля только `scrypt`. Gateway через Podman 6, rootless host-gateway route, Podman 6 Gateway E2E, production ingress/OIDC browser E2E, staging и canary пока не подтверждены. Локальный Podman 5.8.7 корректно пропускает только capability-gated proxy lanes. Docker Gateway E2E подтверждает global UpdateConfig → `LOADED` ack → сохранение active revision после рестарта Gateway; после рестарта живой proxy пропускает разрешённый CONNECT (200) и блокирует запрещённый (403).

| Приоритет | Вывод ревью | Доказательство и влияние | Требуемое закрытие |
| --- | --- | --- | --- |
| Closed | Beta dependencies and consumers are published | `task release:published` passed twice with `GOWORK=off` against published module tags; CLI release archives include CLI, Gateway, console and helpers, and Linux x86_64 archive checksum was verified after download. | Keep the consumer gate required for each release. |
| P0 | Матрица E2E ещё имеет пустые платформенные клетки | Docker DinD gateway/SSH и lifecycle E2E прошли на Docker Desktop 29.8. Driver Podman 6.1.3 rootful/rootless jobs прошли в GitHub Actions; rootful route checks входят в `TestPodmanEngineE2E`, rootless service recovery и userns auto/host прошли. Rootless proxy route и Gateway/SSH через Podman 6 не входят в зелёную матрицу. Локальный Podman 5.8.7 корректно skip-нул capability-gated host-gateway сценарии. | Добавить обязательные Linux lanes для native Docker Engine и Podman 6 rootful/rootless Gateway/SSH/relay; подтвердить route enforcement и запрет обхода. Capability skip не считать PASS для поддержки Podman 6. |
| P0 | Runtime policy: update/ack переживает Gateway restart; прямое решение proxy ещё не проверено | Fault tests покрывают 0/1/N ack, компенсационную ревизию и concurrent CAS. Docker Gateway E2E выполняет global UpdateConfig для живого supervisor, проверяет `LOADED` и active global revision после рестарта Gateway, затем делает живые CONNECT-пробы через активный proxy: разрешённый sandbox endpoint получает 200, запрещённый — 403. Podman 6 повторение остаётся открытым в отдельном E2E-гейте. | Сохранять Docker allow/deny probe обязательным; повторить Gateway/SSH/relay and policy routes на Podman 6 rootful/rootless. |
| P1 | Go console реализован, но ещё не развёрнут | Серверный OIDC PKCE/session, workspace inventory, logs и lifecycle actions реализованы поверх Go SDK; локальный live-gateway browser E2E проходит, но production same-origin ingress и reverse-proxy browser E2E отсутствуют. | Развернуть через production ingress, проверить auth/proxy/error cases, затем удалить React migration prototype. |
| P1 | UI повторял запросы и допускал устаревший ответ после смены контекста | `refresh` зависел от `selected`, а каждый ответ создавал новый `selected`; запросы старой workspace/сессии могли завершиться позже новых. | Исправлены зависимости effect, generation guard и очистка состояния при выходе; `npm run build` проходит. Добавить browser regression в UI E2E gate. |
| P1 | Корневой план 15 OpenShell issues содержит незакрытые live probes | Bind ownership rootless, private registry, CA rotation, TLS ingress, WSL2, stream parity и doctor prerequisites перечислены в соседнем плане. | Для заявляемых Docker/Podman функций иметь положительный, отрицательный и recovery probe с версией engine/OS; остальное явно пометить beta limitation. |
| P1 | Digest pinning внедрён для release gateway/sandbox и инструментального образа GoReleaser | Dockerfile и release script закреплены digest-ами; `docker build --check` прошёл для gateway и sandbox, `task images:pins` проходит. Digest не заменяет регулярное обновление базовых образов. | Оставить обязательный CI pin-check; обновлять digest отдельным reviewed PR с multi-arch build, SBOM и vulnerability scan. |
| P1 | Плавающие checkout refs устранены | 90 workflow checkout steps используют SHA из `tools/modules.lock`; `task ci:pins` включён в `task check` и проходит. | Сохранять pin-check как required CI gate и обновлять lock вместе с проверенным набором модулей. |
| P2 | Control API ещё связан с Gateway Go module | SDK импортирует generated contract из Gateway и обязан обновляться после него. | Выделить версионированный контракт либо формально закрепить Gateway как contract artifact; buf breaking против предыдущего релиза, generated TS/Python/Go от одного Proto. |

## Порядок исправлений: от checkout до production

### 1. Зафиксировать границы релиза

- [x] Согласовать поддерживаемые ОС/engine: release gate — Docker Engine 24+ Linux и Podman 6 Linux rootful/rootless; Docker Desktop — beta с host smoke; Podman 5 — lifecycle subset без proxy host-gateway; WSL2 не release-gated. Kubernetes/VM не заявляются production-ready.
- [x] Перечислить публичные RPC по ролям: pinned OpenShell inventory уже проверяется против descriptor/options/handlers/tests; все 44 Control RPC теперь имеют машинно проверяемую auth route + disclosure policy. Общий Connect interceptor fail closed проверяет principal/scope до handler, включая отдельное supervisor-only исключение для append logs.
- [x] Сохранить snapshot схемы Control API: immutable Buf image от commit `5e20fa2f6943`, SHA-256 в `api/schema/README.md`; CI всегда запускает `buf lint`, `buf breaking` и regeneration drift, а PR дополнительно сравнивается с `main`.
- [ ] Разобрать незакоммиченные изменения в каждом checkout; собрать связанный набор commit/PR без смешивания старых пользовательских правок.
- [x] Зафиксировать для межрепозиторного CI immutable SHA каждого соседа: 90 checkout шагов переведены с `ref: main` на `tools/modules.lock`; `tools/pin-workflow-checkouts.py --check` включён в корневой `task check`.

### 2. Закрыть целостность и безопасность

- [x] Исправить пустой OCI USER на runtime: образ без явного USER теперь может пройти обычный sandbox identity fallback; Docker smoke проверил реальный путь.
- [x] Добавить gate сборки потребителя без workspace/replacements: `task release:published`; он проходит на опубликованных beta-тегах и включён в `prerelease` и `compat:release`.
- [x] Глобальный policy update: fault tests покрывают 0/1/N ack, compensating revision, concurrent CAS и reopen persisted pending revision. Running sandbox с отключённым supervisor теперь даёт явный failure и компенсацию вместо silent success; focused race проходит.
- [x] Rootless ownership: opt-in reconciliation вызывается только для именованного `/cauteum/data`, не получает workspace bind, требует privileged init, отклоняет symlink root и не следует по symlink children. Runtime unit tests и Podman userns matrix покрывают границу; live смена UID map остаётся recovery probe, а не блокером безопасности workspace.
- [x] Доктор CLI должен предсказывать невозможный create: Landlock, userns, сеть, socket, gateway endpoint, rootless mode. Ошибка должна содержать конкретное действие оператора.
- [x] Private registry auth: Docker/Podman authfile, выбор registry, приоритет credential sources и secret-safe ошибки покрыты unit tests.
- [ ] CA lifecycle остаётся открытым: bundle mount/rotation, неверный сертификат и подтверждение отсутствия утечки секретов в логах требуют live engine probes.

### 3. Довести функциональные сценарии

- [ ] Docker и Podman: create/start/stop/delete, повтор create после pull/start failure, reboot/reconcile и сохранность workspace/data.
- [ ] SSH, exec, port forward и relay через TLS termination: half-close, cancel, timeout, reconnect, token rotation, отсутствие plaintext на внешнем listener.
- [x] Control RPC через Go web console: capabilities, list/detail, bounded logs, create/start/stop/delete и recovery результата через durable operation; SDK использует request ID и текущую resource version. Server streaming остаётся отдельным улучшением после proxy E2E.
- [ ] Go/Python/TypeScript SDK и CLI: один корпус API- и error-сценариев, версии схемы, таймауты и cancellation. SDK не отдаёт внутренние методы supervisor как публичные.

### 4. Одна Go-основа UI для браузера и desktop

- [x] Зафиксировать роли: Gateway остаётся единственным владельцем авторизации, политики и состояния; CLI/TUI используют Go SDK напрямую. Браузер не запускает Go SDK: отдельный Go web console использует его на сервере и отдаёт HTML.
- [x] Реализовать `cauteum-console` как Go сервис: `html/template`, отдельный CSS asset и Go SDK без второго набора бизнес-правил. Первый вертикальный срез включает вход, workspace, overview, список/detail/logs и lifecycle forms.
- [x] Проверить console против реального локального Gateway: loopback bootstrap, SDK-запросы, пустое состояние и CSS route; smoke прошёл. Unit/race тесты дополнительно покрывают OIDC PKCE и CSRF. Production reverse-proxy/browser E2E остаются открытыми.
- [x] Реализовать browser security в console: серверный OIDC code+PKCE, opaque Secure/HttpOnly/SameSite session cookie, browser binding для callback, CSRF + exact Origin, HTTPS вне loopback, CSP без script/inline-style, лимиты тела, immutable CSS и `no-store` для страниц с данными. Owner/supervisor токены в UI не передаются.
- [ ] Развернуть console и gateway через production same-origin ingress и проверить callback/proxy headers. Локальный loopback режим проверен Playwright против живого Gateway. Внешний HTTP запрещён конфигурацией; production ingress/proxy headers и внешняя OIDC callback проверка остаются открытыми.
- [x] Действия: server handlers валидируют ввод и подтверждение delete; Go SDK создаёт `request_id`, читает текущую resource version и возвращает durable operation IDs. При неопределённом результате console запрашивает `GetOperation`; Gateway повторно проверяет права на каждом RPC.
- [ ] Desktop: тот же Go console, те же шаблоны и CSS в системном WebView. Исследовать тонкую Go-оболочку Wails; она поднимает локальный loopback console и не содержит отдельных экранов или бизнес-правил. Проверить, поддерживает ли выбранный WebView нужные потоки и callback на macOS/Windows/Linux; при ограничениях оставить desktop отдельным будущим артефактом.
- [x] Browser E2E: Playwright с живыми Gateway и Go console проверяет loopback login, overview, CSP/CSS, HttpOnly session, отсутствие-Origin отказ, logout и удаление сессии. Найден и исправлен logout loopback auto-login; для Chromium `Origin: null` принимается только с same-origin Referer плюс валидным CSRF.
- [ ] Дополнить browser E2E истёкшей OIDC сессией, workspace isolation, запретом записи, повтором запроса, конфликтом версии, отменой watch, длинным списком и ошибками gateway. Проверить внешний OIDC callback/proxy и после parity удалить React/Vite prototype.

`html/template` делает контекстное экранирование данных в HTML ([документация Go](https://pkg.go.dev/html/template)); CSRF, session security и авторизация остаются отдельными обязанностями console/gateway. [Wails](https://wails.io/docs/introduction/) подходит как Go-оболочка, но его [ограничения asset server и потоков](https://wails.io/docs/reference/options/) нужно проверить прототипом до выбора desktop release.

### 5. Проверки и выпуск модулей

- [x] Локальный базис: fmt/lint/vet/vuln/unit/integration, `task race`, `task e2e:podman` (с указанными capability skips), Docker MVP smoke. UI `npm run build` проходит. `task release:published` проходит на опубликованных beta-тегах.
- [x] Локальные release checks: `task check`, native `task race`, Docker DinD gateway/SSH/lifecycle E2E и strict docs прошли на текущем хосте.
- [x] Podman 6.1.3 driver Linux CI: rootful lifecycle/recovery/pull/digest tests и rootless service-recovery/userns auto+host прошли; полный driver build/test/lint прошёл на Ubuntu/macOS/Windows в draft PR #5.
- [x] Опубликованный consumer check: `task release:published` прошёл с `GOWORK=off` и без replacements на всех модулях после слияния/тегирования; CLI, SDK и Gateway разрешаются из beta-тегов.
- [ ] Остальная Linux CI матрица: `task check`, race/integration, Docker daemon E2E, Gateway/SSH, relay/proxy и browser E2E. Podman 6.1.3 rootful/rootless driver jobs уже прошли; Gateway Podman 6 rootless route и полные relay/SSH lanes остаются открытыми. Падение required lane останавливает выпуск; skip требует указать неподдерживаемую конфигурацию.
- [x] Образные и контрактные локальные проверки: digest pin-check, `docker build --check` для gateway/sandbox, Buf lint/breaking/generate drift, strict EN/RU docs.
- [ ] Локальный release artifact gate и CLI GitHub archive/install CI прошли; SBOM и LICENSE/NOTICE проверены. Нужны Linux-native engine lanes и staging artifact verification для целевого deployment.
- [ ] Опубликованный beta DAG закрыт: `slogx`, `core`, `display` → `providers`, `proxy`, `driver` → `runtime` → `gateway` → `sdk` → `cli`. Downstream `go.mod`, CI checkout pins и GoReleaser inputs используют опубликованные beta tags.
- [ ] Staging: применить миграции к копии данных, проверить upgrade существующих sandboxes, policy revisions, secret rotation и rollback на предыдущий образ с сохранением данных. Прогнать ручной browser smoke через production ingress.
- [ ] Canary: малая доля gateway/driver, метрики ошибок Control RPC, policy ack lag, sandbox create failure, relay disconnect, audit gaps; сравнить с исходным уровнем и остановить продвижение при регрессии.
- [ ] Production rollout: подписанные immutable image digests и версии CLI/SDK; мониторить canary, затем расширить rollout. Проверить опубликованные пакеты и документацию внешним клиентом. Держать проверенный rollback образ/конфигурацию и план восстановления состояния.

## Критерий готовности

Beta-релиз опубликован после зелёного `release:published`. Production rollout разрешается только после закрытия P0, полного Linux Docker/Podman 6 matrix по заявленным функциям, проверки upgrade/rollback и same-origin console через staging ingress. Browser UI можно включить в релиз только после Go console, same-origin deployment и auth/E2E. Desktop публикуется отдельным артефактом после трёхплатформенного прототипа; его Go console и шаблоны остаются общими.
