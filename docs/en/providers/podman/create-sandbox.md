<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
-->

# Create a sandbox (Podman)

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

With proxy and providers, ensure the gateway is selected first:

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

CLI surface matches Docker. Smoke without egress proxy first if rootless
networking is unproven on your host (`--no-proxy` where applicable, or a
minimal policy).
