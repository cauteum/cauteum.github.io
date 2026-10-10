<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cauteum
SPDX-License-Identifier: Apache-2.0
-->

# Создание sandbox (Podman)

```bash
export CAUTEUM_DRIVER=podman

cauteum sandbox create \
  --name demo \
  --workspace "$PWD" \
  --policy cauteum-cli/policies/default.yaml \
  --memory 2g

cauteum sandbox exec demo -- uname -a
cauteum sandbox delete demo
```

С proxy и providers сначала выберите gateway:

```bash
cauteum gateway select local
cauteum sandbox create \
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
