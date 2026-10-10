<!--
SPDX-FileCopyrightText: Copyright (c) 2026 cautem
SPDX-License-Identifier: Apache-2.0
-->

# Create a sandbox (Podman)

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

With proxy and providers, ensure the gateway is selected first:

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

CLI surface matches Docker. Smoke without egress proxy first if rootless
networking is unproven on your host (`--no-proxy` where applicable, or a
minimal policy).
