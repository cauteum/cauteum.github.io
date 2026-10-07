---
status: soon
---

<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
-->

# MicroVM

<div class="ws-soon" markdown>

![В разработке](../../assets/images/under-construction.svg){ width="420" }

**Скоро.** Этот провайдер пока строится.

</div>

## Что планируется

- Лёгкая виртуальная машина на каждую песочницу вместо контейнера — граница
  изоляции прочнее. Выбор — `WHALESHELL_DRIVER=vm`.
- **libkrun** для обычных песочниц, **QEMU + VFIO**, когда нужен проброс GPU.
- Egress по-прежнему проходит через политику; для GPU-гостей контроль может
  выполняться на стороне хоста.

Сейчас драйвер `vm` — заглушка. Для работы с GPU используйте Docker, в
остальных случаях — [Docker](docker/index.md) или [Podman](podman/index.md).
