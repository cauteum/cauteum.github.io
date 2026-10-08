<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cauteum
SPDX-License-Identifier: Apache-2.0
-->

# Create a sandbox (Podman)

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

With proxy and providers, ensure the gateway is selected first:

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

CLI surface matches Docker. Smoke without egress proxy first if rootless
networking is unproven on your host (`--no-proxy` where applicable, or a
minimal policy).
