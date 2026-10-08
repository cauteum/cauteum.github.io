---
status: soon
---

<!--
SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
SPDX-License-Identifier: Apache-2.0
-->

# MicroVM

<div class="ws-soon" markdown>

![Under construction](../../assets/images/under-construction.svg){ width="420" }

**Coming soon.** This provider is under construction.

</div>

## What is planned

- A lightweight virtual machine per sandbox instead of a container — a
  stronger isolation boundary. Selected with `WHALESHELL_DRIVER=vm`.
- **libkrun** for regular sandboxes, **QEMU + VFIO** when a GPU is passed
  through.
- Egress still goes through policy; for GPU guests it may be enforced on the
  host side.

Today the `vm` driver is a stub. For GPU work use Docker; otherwise
[Docker](docker/index.md) or [Podman](podman/index.md).
