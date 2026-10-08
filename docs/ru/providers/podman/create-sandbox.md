<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
-->

# Создание sandbox (Podman)

```bash
export WHALESHELL_DRIVER=podman

whaleshell sandbox create \
  --name demo \
  --workspace "$PWD" \
  --policy whaleshell-cli/policies/default.yaml \
  --memory 2g

whaleshell sandbox exec demo -- uname -a
whaleshell sandbox delete demo
```

С proxy и providers сначала выберите gateway:

```bash
whaleshell gateway select local
whaleshell sandbox create \
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
