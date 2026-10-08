<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
-->

# Start the gateway

The gateway is the control plane: it stores secrets encrypted at rest and lets
you attach credential providers to sandboxes with `--provider`. Pick one way to
run it.

### with ensure <small>recommended</small> { #with-ensure data-toc-label="with ensure" }

One command starts a local gateway container and selects it:

```bash
whaleshell gateway ensure
whaleshell gateway info
```

### with Docker Compose

Use Compose when you want a durable setup next to other services:

```bash
# optional durable key for the secrets store:
# export WHALESHELL_SECRETS_KEK="$(openssl rand -base64 32)"

docker compose -f whaleshell-gateway/compose/docker-compose.yml up -d --build
whaleshell gateway add http://127.0.0.1:7443 --local --name local
whaleshell gateway select local
whaleshell gateway info
```

!!! warning "Keep the key"
    Without `WHALESHELL_SECRETS_KEK` the gateway generates `secrets.kek` in its
    data volume. Lose the volume and stored secrets can no longer be decrypted.

### with a local binary

Handy while developing the gateway itself:

```bash
go build -C whaleshell-gateway -o whaleshell-gateway ./cmd/whaleshell-gateway
./whaleshell-gateway --listen 127.0.0.1:7443 &

whaleshell gateway add http://127.0.0.1:7443 --local --name local
whaleshell gateway select local
whaleshell gateway info
```

`gateway info` should report the selected gateway as reachable. More options:
[Gateway guide](../guides/gateway.md).
