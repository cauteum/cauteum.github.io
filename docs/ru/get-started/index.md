<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cauteum
SPDX-License-Identifier: Apache-2.0
-->

# Быстрый старт

cauteum — один CLI, который запускает coding-агентов в песочницах с
политикой на Docker или Podman. Установите CLI, убедитесь, что контейнерный
движок работает, и скачайте образ песочницы — затем
[запустите gateway](gateway.md) и [создайте первую песочницу](first-sandbox.md).

## Установка CLI

### через установщик <small>рекомендуется</small> { #with-installer data-toc-label="через установщик" }

Последняя опубликованная версия CLI — `v0.1.2`. Закрепите её при
установке, чтобы инструкции оставались воспроизводимыми до выхода стабильного релиза.
Откройте терминал и выполните:

```bash
curl -LsSf https://raw.githubusercontent.com/cauteum-haven/cauteum-cli/main/install.sh \
  | CAUTEUM_VERSION=v0.1.2 sh
cauteum version
```

Бинарь ставится в `~/.local/bin` — этот каталог должен быть в `PATH`.

Для установки в другой каталог:

```bash
curl -LsSf https://raw.githubusercontent.com/cauteum-haven/cauteum-cli/main/install.sh \
  | CAUTEUM_VERSION=v0.1.2 CAUTEUM_INSTALL_DIR=/usr/local/bin sh
```

### из исходников

Сборка из checkout hub — если нужен свежий `main` или вы разрабатываете
cauteum:

```bash
cd /path/to/cauteum
export GOWORK=$PWD/go.work

go build -C cauteum-cli -o cauteum ./cmd/cauteum
./cauteum-cli/cauteum install
./cauteum-cli/cauteum version
```

## Контейнерный движок

Нужен работающий провайдер вычислений. По умолчанию — Docker; Podman работает
через тот же Engine API.

=== "Docker"

    Docker Engine 28.0+ или Docker Desktop. На macOS и Windows лучше backend
    **Docker VMM**.

    ```bash
    docker info
    cauteum doctor
    cauteum status
    ```

=== "Podman на macOS"

    ```bash
    podman machine init     # один раз
    podman machine start
    export CAUTEUM_DRIVER=podman
    cauteum status
    ```

=== "Podman на Linux"

    ```bash
    systemctl --user enable --now podman.socket
    export CAUTEUM_DRIVER=podman
    cauteum status
    ```

`cauteum status` должен показать выбранный драйвер (`docker` или `podman`).
Подробнее о движках: [Docker](../providers/docker/index.md) ·
[Podman](../providers/podman/index.md).

## Образ песочницы

Скачайте базовый образ — в нём есть всё, что нужно агенту в CLI:

```bash
docker pull ghcr.io/cauteum/cauteum/sandboxes/base:latest
```

!!! tip "Собрать образы самому"
    Из hub: `task runtime:image:cli` собирает базовый образ,
    `task docker:agent:cursor` — агента Cursor. Полный список —
    [Образы](../reference/images.md).
