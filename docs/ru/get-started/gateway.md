<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cauteum
SPDX-License-Identifier: Apache-2.0
-->

# Запуск gateway

Gateway — control plane: хранит секреты в зашифрованном виде и позволяет
подключать credential-провайдеров к песочницам через `--provider`. Выберите
один способ запуска.

### через ensure <small>рекомендуется</small> { #with-ensure data-toc-label="через ensure" }

Одна команда поднимает локальный контейнер gateway и выбирает его:

```bash
cauteum gateway ensure
cauteum gateway info
```

### через Docker Compose

Compose — когда нужна постоянная установка рядом с другими сервисами:

```bash
# опционально постоянный ключ хранилища секретов:
# export CAUTEUM_SECRETS_KEK="$(openssl rand -base64 32)"

docker compose -f cauteum-gateway/compose/docker-compose.yml up -d --build
cauteum gateway add http://127.0.0.1:7443 --local --name local
cauteum gateway select local
cauteum gateway info
```

!!! warning "Сохраните ключ"
    Без `CAUTEUM_SECRETS_KEK` gateway сам создаёт `secrets.kek` в своём
    data volume. Потеряете volume — сохранённые секреты уже не расшифровать.

### через локальный бинарь

Удобно при разработке самого gateway:

```bash
go build -C cauteum-gateway -o cauteum-gateway ./cmd/cauteum-gateway
./cauteum-gateway --listen 127.0.0.1:7443 &

cauteum gateway add http://127.0.0.1:7443 --local --name local
cauteum gateway select local
cauteum gateway info
```

`gateway info` должен показать выбранный gateway доступным. Остальные
варианты — [руководство по gateway](../guides/gateway.md).
