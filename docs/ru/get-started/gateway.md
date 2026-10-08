<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
-->

# Запуск gateway

Gateway — control plane: хранит секреты в зашифрованном виде и позволяет
подключать credential-провайдеров к песочницам через `--provider`. Выберите
один способ запуска.

### через ensure <small>рекомендуется</small> { #with-ensure data-toc-label="через ensure" }

Одна команда поднимает локальный контейнер gateway и выбирает его:

```bash
whaleshell gateway ensure
whaleshell gateway info
```

### через Docker Compose

Compose — когда нужна постоянная установка рядом с другими сервисами:

```bash
# опционально постоянный ключ хранилища секретов:
# export WHALESHELL_SECRETS_KEK="$(openssl rand -base64 32)"

docker compose -f whaleshell-gateway/compose/docker-compose.yml up -d --build
whaleshell gateway add http://127.0.0.1:7443 --local --name local
whaleshell gateway select local
whaleshell gateway info
```

!!! warning "Сохраните ключ"
    Без `WHALESHELL_SECRETS_KEK` gateway сам создаёт `secrets.kek` в своём
    data volume. Потеряете volume — сохранённые секреты уже не расшифровать.

### через локальный бинарь

Удобно при разработке самого gateway:

```bash
go build -C whaleshell-gateway -o whaleshell-gateway ./cmd/whaleshell-gateway
./whaleshell-gateway --listen 127.0.0.1:7443 &

whaleshell gateway add http://127.0.0.1:7443 --local --name local
whaleshell gateway select local
whaleshell gateway info
```

`gateway info` должен показать выбранный gateway доступным. Остальные
варианты — [руководство по gateway](../guides/gateway.md).
