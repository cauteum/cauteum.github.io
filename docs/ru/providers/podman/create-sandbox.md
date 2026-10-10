<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cautem
SPDX-License-Identifier: Apache-2.0
-->

# Создание sandbox (Podman)

```bash
export CAUTEM_DRIVER=podman

cautem sandbox create \
  --name demo \
  --workspace "$PWD" \
  --policy cautem-cli/policies/default.yaml \
  --memory 2g

cautem sandbox exec demo -- uname -a
cautem sandbox delete demo
```

С proxy и providers сначала выберите gateway:

```bash
cautem gateway select local
cautem sandbox create \
  --name cursor \
  --from cursor \
  --workspace "$PWD" \
  --policy /path/to/policy.yaml \
  --provider cursor \
  --provider gh \
  --memory 2g
```

CLI совпадает с Docker. Если rootless-сеть ещё не проверена — сначала smoke без
egress proxy (`--no-proxy` где доступно, или минимальная policy).
