<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
-->

# Быстрый старт

whaleshell — один CLI, который запускает coding-агентов в песочницах с
политикой на Docker или Podman. Установите CLI, убедитесь, что контейнерный
движок работает, и скачайте образ песочницы — затем
[запустите gateway](gateway.md) и [создайте первую песочницу](first-sandbox.md).

## Установка CLI

### через установщик <small>рекомендуется</small> { #with-installer data-toc-label="через установщик" }

Актуальная бета CLI — `v0.1.0-beta.2`. При установке закрепите версию,
чтобы инструкции остались воспроизводимыми после выхода следующего релиза.
Откройте терминал и выполните:

```bash
curl -LsSf https://raw.githubusercontent.com/whaleshell/whaleshell-cli/main/install.sh \
  | WHALESHELL_VERSION=v0.1.0-beta.2 sh
whaleshell version
```

Бинарь ставится в `~/.local/bin` — этот каталог должен быть в `PATH`.

=== "Другая версия"

    ```bash
    curl -LsSf https://raw.githubusercontent.com/whaleshell/whaleshell-cli/main/install.sh \
      | WHALESHELL_VERSION=v0.1.0-beta.1 sh
    ```

=== "Другой каталог"

    ```bash
    curl -LsSf https://raw.githubusercontent.com/whaleshell/whaleshell-cli/main/install.sh \
      | WHALESHELL_VERSION=v0.1.0-beta.2 WHALESHELL_INSTALL_DIR=/usr/local/bin sh
    ```

### из исходников

Сборка из checkout hub — если нужен свежий `main` или вы разрабатываете
whaleshell:

```bash
cd /path/to/whaleshell
export GOWORK=$PWD/go.work

go build -C whaleshell-cli -o whaleshell ./cmd/whaleshell
./whaleshell-cli/whaleshell install
./whaleshell-cli/whaleshell version
```

## Контейнерный движок

Нужен работающий провайдер вычислений. По умолчанию — Docker; Podman работает
через тот же Engine API.

=== "Docker"

    Docker Engine 24+ или Docker Desktop. На macOS и Windows лучше backend
    **Docker VMM**.

    ```bash
    docker info
    whaleshell doctor
    whaleshell status
    ```

=== "Podman на macOS"

    ```bash
    podman machine init     # один раз
    podman machine start
    export WHALESHELL_DRIVER=podman
    whaleshell status
    ```

=== "Podman на Linux"

    ```bash
    systemctl --user enable --now podman.socket
    export WHALESHELL_DRIVER=podman
    whaleshell status
    ```

`whaleshell status` должен показать выбранный драйвер (`docker` или `podman`).
Подробнее о движках: [Docker](../providers/docker/index.md) ·
[Podman](../providers/podman/index.md).

## Образ песочницы

Скачайте базовый образ — в нём есть всё, что нужно агенту в CLI:

```bash
docker pull ghcr.io/whaleshell/whaleshell/sandboxes/base:latest
```

!!! tip "Собрать образы самому"
    Из hub: `task runtime:image:cli` собирает базовый образ,
    `task docker:agent:cursor` — агента Cursor. Полный список —
    [Образы](../reference/images.md).
