<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cautem
SPDX-License-Identifier: Apache-2.0
-->

# Запуск gateway

Gateway — control plane: хранит секреты в зашифрованном виде и позволяет
подключать credential-провайдеров к песочницам через `--provider`. Выберите
один способ запуска.

### через ensure <small>рекомендуется</small> { #with-ensure data-toc-label="через ensure" }

Одна команда поднимает локальный контейнер gateway и выбирает его:

```bash
cautem gateway ensure
cautem gateway info
```

### через Docker Compose

Compose — когда нужна постоянная установка рядом с другими сервисами:

```bash
# опционально постоянный ключ хранилища секретов:
# export CAUTEM_SECRETS_KEK="$(openssl rand -base64 32)"

docker compose -f cautem-gateway/compose/docker-compose.yml up -d --build
cautem gateway add http://127.0.0.1:7443 --local --name local
cautem gateway select local
cautem gateway info
```

!!! warning "Сохраните ключ"
    Без `CAUTEM_SECRETS_KEK` gateway сам создаёт `secrets.kek` в своём
    data volume. Потеряете volume — сохранённые секреты уже не расшифровать.

### через локальный бинарь

Удобно при разработке самого gateway:

```bash
go build -C cautem-gateway -o cautem-gateway ./cmd/cautem-gateway
./cautem-gateway --listen 127.0.0.1:7443 &

cautem gateway add http://127.0.0.1:7443 --local --name local
cautem gateway select local
cautem gateway info
```

`gateway info` должен показать выбранный gateway доступным. Остальные
варианты — [руководство по gateway](../guides/gateway.md).
