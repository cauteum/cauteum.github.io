# Workspace cleanup and OpenShell compatibility

Updated: 2026-10-07. This is a working checklist for the separate repositories in the local workspace. Published product documentation lives at https://whaleshell.github.io/ and in each module's README.

Scope: Docker, rootful/rootless Podman, gateway, supervisor, proxy/policy, providers, CLI, Go and Python SDK. Kubernetes and microVM are outside this compatibility pass.

## 0. Establish the baseline

- [x] Record the initial checkout HEADs below and inspect `git status --short` in all 12 repositories. Every checkout had pre-existing local changes; keep those changes intact during this migration. Capture the final per-repo diff before any commit.
- [x] Preserve root docs, dev notes, and the existing `.workspace-backups` history in the sibling `../agent-blocker-backups` directory before removing those paths from the active workspace.
- [x] Record the OpenShell pin (`a0814443f19c07102b19ff09d6ead3d3ba59f9c5`) in this plan. Current task/check outputs still need a baseline run; distinguish them from historic claims.
- [x] Finish the owner-by-owner inventory of root entries. Stale docs, dev notes, backups, duplicate installer, historical hub guidance, root Git/coverage files, and inactive root workflows are in the sibling backup directory. Active orchestration remains in `Taskfile.yml`, `scripts/`, `tools/`; the root `packaging/` now contains only a clearly labeled, unverified Kubernetes chart stub. `LICENSE`, `NOTICE`, `AGENTS.md`, Go workspace files, local IDE settings, and local policy remain intentionally at the workspace root; their content audit is separate below.

## 1. Names and module boundaries

- [x] Move the Python checkout from `sdk/python` to sibling `whaleshell-python`; keep its import package `whaleshell`.
- [x] Rename the local checkout to `whaleshell-slogx`; update workspace, checks and checkout lock. The public repository does not yet exist, so the remote, Go module path, imports, and published-version transition remain open.
- [ ] Regenerate `go.work` and test each module both in workspace and as a consumer of published dependencies, without local replacements.
- [ ] Preserve OpenShell wire names, proto fields, environment names, and flags required by the pinned public contract.

## 2. Root and dev cleanup

- [x] Keep the root as a local multi-repo orchestrator: short README, AGENTS, workspace files, Taskfile, and necessary shared tools. The remaining root packaging directory is an explicit Kubernetes stub, not an advertised installation path.
- [x] Move the runnable Compose setup to `whaleshell-gateway/compose/` and example recipes to `whaleshell-cli/examples/`; update their tasks, checks, READMEs, and site references. Archive duplicate gateway Dockerfile and unusable Homebrew/Snap drafts outside the workspace. Both base and OIDC Compose configurations parse; the two example policies pass CLI validation. The image build and live OIDC flow have not been tested yet.
- [ ] Review any remaining shared test, install, and CI material for an owning repository; keep cross-module orchestration in the root only when necessary.
- [ ] Audit root license, notices, release notes, contributor guidance, local policy, IDE files, and backup history individually.
- [x] Move the active smoke Taskfile, OpenShell pin, and exact-SHA upstream checkout under `tools/`; repoint proto and pin checks. Archive historic dev notes outside the workspace. `tools/fetch-openshell-upstream.sh` recreates the checkout from the pin.
- [ ] Extract still-open work from dev plans and spikes; remove obsolete plans and backup files after verifying no live link or task remains.

## 3. Compatibility evidence and fixes

- [x] Move the JSON report from root `docs/` to gateway testdata and expose known open requirements explicitly. Complete requirement-level coverage and evidence remain to be done.
- [ ] Reconcile the register with the existing checklist and the pinned upstream source. Ensure the gap check validates completeness, not only JSON syntax.
- [x] Add a fixed 14-ID baseline to `compat:gaps`, pin and nonempty-evidence validation, RPC service/method count checks, the descriptor-level Go inventory test, and negative tests for deleted or duplicate requirements and a removed public RPC method. This catches regressions in the current inventory, but discovering every applicable requirement in the pinned source is still open.
- [ ] Test config defaults, precedence, validation and runtime effects for gateway, Docker and Podman.
- [ ] Test public gRPC and related driver/middleware protocols: payloads, streams, authz, metadata, status, deadline, cancellation, and real runtime effects.
- [ ] Test supervisor/lifecycle and recovery: startup, relay, exit/finalize, signals/reap, token rotation, daemon or gateway restart, rollback and cleanup.
- [ ] Test template, image, mount, resource, GPU/CDI, network and security behavior on Docker and applicable Podman rootful/rootless lanes.
- [ ] Test credentials, refresh, workload identity, external drivers, proxy/policy allow/deny/audit, and bypass attempts.
- [ ] Close the October 2026 security review's remaining live policy, Podman 6 route, Docker dual-stack, and workspace bind-race checks.
- [ ] Build a CLI and Go/Python SDK command/API corpus from pinned OpenShell, including output and error cases.
- [x] Compare the 16 top-level OpenShell CLI command names in the pinned `Commands` enum with whaleshell's dispatch switch. All names are present; leaf commands, flags, output and runtime behavior remain unverified. Rename stale `_osg` shell-completion functions to `_whaleshell` and cover them with a test.
- [ ] Fix confirmed differences; associate each closed item with a test and observed result. Keep backend limitations explicit.
- [ ] Verify release builds and dependency resolution outside this workspace without local Go replacements. An isolated CLI check on 2026-10-07 fails on old module paths and unavailable alpha versions; this is a confirmed release blocker.

## 4. Documentation and root `docs/` removal

- [x] Publish an initial EN/RU compatibility status and remaining security limits; the full config, driver, CLI and SDK reference still needs a content pass.
- [x] Move the compatibility JSON report to gateway testdata. Historic audit probes are retained in `../agent-blocker-backups/root-docs-20261007/audit/security-probes`; useful cases still need current regression tests.
- [ ] Finish the editorial pass on each module README: purpose, install, minimal usage, local validation, and a direct link to the relevant site page. All module READMEs now link to the site; unsupported `go get`/`go install` and PyPI instructions were removed after external checks. Duplicated feature tables and remaining commands still need review.
- [x] Correct the CLI workspace build output paths in the README and moved recipes; remove the misleading standalone `go get` example from `whaleshell-slogx` until the published module path is repaired.
- [x] Replace live links to root `docs/` in AGENTS, READMEs, scripts, inventories, examples, and CLI output. The inactive root CI workflows were archived outside the workspace; the site has its own CI.
- [x] Remove active root `docs/` and archive its original contents under `../agent-blocker-backups/root-docs-20261007`. The MkDocs `whaleshell-docs/docs/` tree stays; remaining reference cleanup is tracked above.
- [ ] Verify every documented command, local link, EN/RU page pair, and `mkdocs build --strict`; inspect the published site after deployment. Cross-repository README links moved in the packaging/examples pass now target the site rather than a sibling checkout.
- [x] Run strict EN/RU MkDocs build after the packaging/examples link changes (2026-10-07). This is a source build, not a published-site check.

## Completion rule

The cleanup is complete when all remaining root files have an owner and all tests and links work after removal. Full OpenShell compatibility is a separate claim: every applicable pinned requirement must have positive and negative evidence on Docker and Podman where supported, the requirement register must have no open applicable item, and the external OpenShell SDK/gRPC corpus plus release checks must pass.

## Go quality and release preparation (2026-10-07)

- [x] Audit repeated nested map shapes in active Go code. Use an API-compatible `DriverConfigs` alias for the gateway's decoded driver tables and a named `managedSecretKeys` set for CLI gateway-secret fallback tracking. Leave short-lived local sets and wire-format `map[string]any` values as maps; a generic alias there would obscure rather than clarify their meaning.
- [x] Run workspace `task check`: formatting, lint/staticcheck, vet, vulnerability scanner, and Go tests passed for all ten Go modules. CLI and gateway Linux/amd64 and Darwin/arm64 builds also passed. Rerun the relevant gates after any further edits.
- [x] Resolve standalone module builds for the release candidates. CLI's isolated GoReleaser snapshot and gateway's standalone tests/vet/build pass with released dependency versions; the release workflows no longer depend on local-only Go replacements.
- [x] Choose release versions without rewriting existing tags. CLI already has a remote `v0.1.0-alpha.2` tag with no release, so its follow-up is `v0.1.0-alpha.3`; gateway alpha.2 remains available and its PR is in final CI.
- [x] Publish Gateway `v0.1.0-alpha.2` and CLI `v0.1.0-alpha.3` without rewriting tags or adding co-author trailers. Verify the CLI GoReleaser workflow and release assets; close the post-merge macOS race-test issue and verify the final Gateway main CI/image runs.
- [x] Preserve the Apache-2.0 license for slogx; apply Apache-2.0 to the other 11 modules. Correct the Apache copyright holder to whaleshell contributors and retain NVIDIA attribution only for OpenShell-derived files in NOTICE/header notices.
- [x] Release slogx `v0.1.0-alpha.2`: commits `fbebb72` and `7d97466` on `release/v0.1.0-alpha.2`; [PR #2](https://github.com/whaleshell/slogx/pull/2) merged as `1520968`; annotated tag and prerelease published at https://github.com/whaleshell/slogx/releases/tag/v0.1.0-alpha.2. Confirmed the published license remains MIT.
- [x] Core `v0.1.0-alpha.2`: commit `95cf277` merged in [PR #3](https://github.com/whaleshell/whaleshell-core/pull/3) as `c6e00dd`; all 8 CI checks and standalone test/vet/lint/platform builds passed. Published annotated tag and prerelease: https://github.com/whaleshell/whaleshell-core/releases/tag/v0.1.0-alpha.2. Retained `github.com/gobwas/glob` v0.2.3 for this alpha because v1 rewrites the matcher engine; defer migration to a dedicated compatibility change.
- [x] Providers `v0.1.0-alpha.2`: commit `b82ebde` merged in [PR #2](https://github.com/whaleshell/whaleshell-providers/pull/2) as `800ffc4`; all 8 CI checks and standalone test/vet/lint/platform/vulnerability checks passed. Published tag and prerelease: https://github.com/whaleshell/whaleshell-providers/releases/tag/v0.1.0-alpha.2.
- [x] Display `v0.1.0-alpha.2`: commit `aae214e` merged in [PR #2](https://github.com/whaleshell/whaleshell-display/pull/2) as `1a2b522`; all 8 CI checks and standalone test/vet/lint/platform/vulnerability checks passed. Published tag and prerelease: https://github.com/whaleshell/whaleshell-display/releases/tag/v0.1.0-alpha.2.
- [x] SDK `v0.1.0-alpha.2`: commit `831d692` merged in [PR #3](https://github.com/whaleshell/whaleshell-sdk/pull/3) as `9c918e2`; all 8 CI checks and standalone race/test/vet/lint/platform/vulnerability checks passed. Published tag and prerelease: https://github.com/whaleshell/whaleshell-sdk/releases/tag/v0.1.0-alpha.2.
- [x] Driver `v0.1.0-alpha.2`: commits `a63c069` and `af59512` merged in [PR #2](https://github.com/whaleshell/whaleshell-driver/pull/2) as `4aea4e1`; updated Testcontainers/Moby and `golang.org/x/crypto` to v0.44.0/v1.56.1/v0.6.1/v0.3.3/v0.57.0 after govulncheck found reachable SSH findings, and fixed Windows path assumptions. All 8 CI checks passed. Published tag and prerelease: https://github.com/whaleshell/whaleshell-driver/releases/tag/v0.1.0-alpha.2.
- [x] Proxy `v0.1.0-alpha.2`: commits `c259fc7` and `49d154f` merged in [PR #2](https://github.com/whaleshell/whaleshell-proxy/pull/2) as `32b02b9`. Fixed the CI race by serializing audit writes and synchronizing the concurrent test; corrected Windows proxy environment handling and skipped the Unix-socket-only SPIFFE fixture on Windows (that client uses named pipes there). All 8 CI checks passed. Published tag and prerelease: https://github.com/whaleshell/whaleshell-proxy/releases/tag/v0.1.0-alpha.2.
- [x] Runtime `v0.1.0-alpha.2`: PR #2 merged as `7d40fb2`; fixed cross-platform supervisor tests, Landlock defaults, and Linux child-process coverage. CI, image builds, race tests, vet, lint, and platform checks passed. Published prerelease: https://github.com/whaleshell/whaleshell-runtime/releases/tag/v0.1.0-alpha.2.
- [x] CLI `v0.1.0-alpha.3`: [PR #4](https://github.com/whaleshell/whaleshell-cli/pull/4) merged as `b80878f`; all CI checks, Windows tests, image builds, and GoReleaser snapshot passed. Published prerelease and archives: https://github.com/whaleshell/whaleshell-cli/releases/tag/v0.1.0-alpha.3. The pre-existing alpha.2 tag was left untouched.
- [x] Gateway `v0.1.0-alpha.2`: [PR #3](https://github.com/whaleshell/whaleshell-gateway/pull/3) merged as `b7d4adc`; all PR CI checks and gateway image build passed. Published prerelease: https://github.com/whaleshell/whaleshell-gateway/releases/tag/v0.1.0-alpha.2. Fixed the post-merge macOS race-test startup flake in [PR #4](https://github.com/whaleshell/whaleshell-gateway/pull/4), merged as `b17e47d`; final main CI and image builds passed.
- [x] Audited the earlier Nightly run `37624297198`: it used the pre-runtime-release dependency snapshot and failed on stale runtime agentconfig symbols. Dispatched the current `main` workflow (`37633663127`); cross-platform builds and publication passed, updating the `nightly` prerelease with 12 assets at https://github.com/whaleshell/whaleshell-cli/releases/tag/nightly.

## Initial checkout baseline

The initial HEADs below are local, not the revisions in `tools/modules.lock`; that lock must be updated only after module changes are committed and published. Each checkout has its own `origin` under `github.com/whaleshell/`, except `whaleshell-docs` (`whaleshell.github.io`) and locally named `whaleshell-slogx` (`slogx`).

| Checkout | Initial HEAD |
| --- | --- |
| `whaleshell-cli` | `67fd0ae2d7bba3b16ec243a39a47b7107cec5b05` |
| `whaleshell-core` | `5e771eae7410ca36c2300b594c313cca227857e6` |
| `whaleshell-display` | `c5513e77aa9924e3a45dbc1de1a41ef7babf0a6f` |
| `whaleshell-docs` | `2777a3ea54b13c62b9029ab4fa7498b79dc57021` |
| `whaleshell-driver` | `61a49abf4db0dcea31014c7d640330102c601b89` |
| `whaleshell-gateway` | `19a4009d868cbf91836af0fef5b54c02bf5c510e` |
| `whaleshell-providers` | `2fbc7099d972f351846d8dc426cddfa1c9a37344` |
| `whaleshell-proxy` | `183c4369adc5fe084c0f1aaa3c4c44c29f77cce9` |
| `whaleshell-python` | `bd41cc84fce057f3c5f938b5a28930399b526417` |
| `whaleshell-runtime` | `7b11c77083fbd978441c91e776a540fabb5c667b` |
| `whaleshell-sdk` | `cf42eabfc3fd5482620faa12821110a42a9f0b62` |
| `whaleshell-slogx` | `5c5f9adb38bc8fcaa94d1141a8cf875fd23aaf74` |
