# Gateway RPC API, SDKs, and UI

Status: **RPC migration in progress**, updated 2026-10-09. The gateway serves the pinned OpenShell gRPC API and `cauteum.control.v1` through Connect/native gRPC. Profile CRUD, partial provider credential updates, and sandbox/global policy workflows now use Control RPC; settings, services, supervisor registration, and other gateway workflows remain to migrate.

## Recommendation

Make typed RPC the primary API for CLI, UI, and SDK clients, following
OpenShell's contract-first approach. Keep the pinned `openshell.v1.OpenShell`
contract authoritative for upstream runtime workflows. Put Cauteum-specific
operator workflows behind the narrower `cauteum.control.v1` API, where the
gateway authorizes user principals and redacts responses. Expose Control RPC
through Connect for browser clients and native gRPC for native clients. REST
`/v1` is not a compatibility requirement: migrate supported clients to RPC and
remove the legacy REST client surface as those workflows move. Do not add new
features to REST. The [UI API plan](#ui-client-api-plan) defines the sequence.

Connect serves the browser because one Proto service can serve native gRPC,
Connect over HTTP, and gRPC-Web; its unary JSON calls also work over HTTP/1.1.
It does **not** preserve the existing resource-oriented REST
URLs, HTTP verbs, YAML bodies, status codes, or SSE format. Treating the same
Proto as an automatic replacement for `GET /v1/sandboxes` would silently change
the public API. [Connect Go](https://connectrpc.com/docs/go/getting-started/),
[Connect protocol](https://connectrpc.com/docs/protocol/).

## Current boundaries

| Surface | Contract and consumers | Constraint |
| --- | --- | --- |
| OpenShell RPC | Pinned upstream `openshell.proto`; 74 methods, including runtime lifecycle, supervisor, credentials, and bidirectional streams. Gateway serves it as native gRPC on the same listener as REST. | Upstream compatibility contract; some methods are for sandbox or gateway internals. |
| Gateway REST | `cauteum-gateway/api/openapi.yaml`; 56 remaining client operations after removing policy and profile routes. | Legacy surface to remove as clients migrate; no compatibility guarantee is required for beta. |
| Control RPC | Source Proto in `cauteum-gateway/api/proto/cauteum/control/v1/`; 35 methods across seven services, served by Connect/native gRPC. | Cauteum-specific user-facing contract; expose only reviewed methods with per-method authorization and redaction. |
| Go SDK / CLI | Handwritten Go facade; inventory, lifecycle, logs, providers, profiles, proposals, identity, and policy use RPC. | Finish migrating settings, services, supervisor registration, and other REST-backed facade methods. |
| Python SDK | Generated native gRPC clients for `cauteum.control.v1` and pinned OpenShell; HTTP is used only for health. Python `>=3.9`, with `grpcio>=1.70` and `protobuf>=5.29`. | Add typed error/domain wrappers and migrate only if additional resource workflows are introduced. |
| Browser | Read-only React UI uses Connect-Web and OIDC PKCE. | Production same-origin proxy and stream rendering remain; bidirectional streams stay on native/desktop transports. [Connect Web](https://connectrpc.com/docs/web/getting-started/). |

The gateway already routes HTTP/2 `application/grpc` to `grpc-go` and other
requests to the REST handler. A Connect handler would require explicit routing
and an authentication adapter; adding its path to this switch alone would not
reuse the current gRPC interceptors. The pinned OpenShell service should not be
mounted wholesale for a browser: it includes supervisor and token operations
that need different principals and authorization rules. These conclusions are
from `internal/httpapi/gateway.go`, `grpc_auth.go`, and `openshell_rpc.go`.

## Contract ownership

1. **Pinned OpenShell Proto** remains authoritative for OpenShell
   interoperability and runtime lifecycle. Do not edit its wire names or use
   its internal methods as a general browser API.
2. **Gateway REST/OpenAPI** is legacy. Do not add new SDK workflows there or
   preserve it solely for compatibility. Remove routes and contract artifacts
   as clients move to RPC; beta callers may need to update.
3. **`cauteum.control.v1` Proto** in `cauteum-gateway/api/proto/`
   owns Cauteum-specific user-facing operator APIs for UI and SDK use. Reuse
   pinned OpenShell RPCs for upstream workflows rather than cloning them. Add
   only Cauteum-specific or security-filtered operations, with stable errors,
   pagination, and method-level authorization.
4. **Application services** own business rules, authorization decisions, and
   transactions. REST, OpenShell RPC, and any new Control RPC handlers adapt
   requests to those services. They must not call each other through HTTP.

For Proto evolution, pin code generators, run `buf lint` and `buf breaking`
against the last released schema, and reserve removed field numbers/names.
`buf breaking` checks generated source and wire compatibility; it does not
replace behavioral contract tests. [Buf breaking changes](https://buf.build/docs/breaking/).

## SDK direction

Keep a small, stable handwritten facade in each language. Generate message
types and low-level transport clients behind it. A generated client alone
will not provide product-level behavior such as authentication setup,
timeouts, retries, pagination, streaming cleanup, or safe error messages.

| Consumer | First client API slice | Later evolution |
| --- | --- | --- |
| Go | Existing facade mixes REST and generated Connect. Migrate each workflow to generated native gRPC clients for Control RPC or the pinned OpenShell SDK, following the latter's resource sub-client and typed error patterns. | Remove direct REST calls; expose domain types, typed errors, cancellation, pagination, and watches. |
| Browser TypeScript | Generate Proto types and use Connect Web for the new UI API. Use the existing REST contract only for a capability that has not migrated into the client API; do not hand-copy server DTOs. [Connect Web client](https://connectrpc.com/docs/web/getting-started/). | Add typed server streams for status and logs after browser/proxy validation. |
| Python | Sandbox inventory/lifecycle and overview use generated `cauteum.control.v1`; command execution uses pinned OpenShell `ExecSandbox`. Generated stubs are checked in and reproducibly generated from the workspace pins. | Expose domain exceptions and add further curated workflows as needed; keep HTTP for health and browser-specific bootstrap only. |

Use local, pinned generation in the build pipeline initially. Buf can generate
Go, TypeScript, and Python clients; publishing generated packages to the Buf
Schema Registry is an option after the contract and release process settle.
Do not require the registry for reproducible source builds.
[Buf code generation](https://buf.build/docs/generate/).

## Browser and desktop delivery

Start with one TypeScript web UI and a small read-only workflow. Serve it from
the same origin as the gateway or through a dedicated backend-for-frontend
(BFF). The browser must not read the gateway's owner token from disk or expose
supervisor credentials. A BFF can hold server-side credentials and use a
Secure, HttpOnly session cookie with CSRF protection; cross-origin deployments
instead need an explicit CORS and browser auth design.
[Connect CORS](https://connectrpc.com/docs/cors/).

For status and log updates, use server streaming where the transport and
deployment support it. Keep interactive exec, SSH, and bidirectional relay on
the native/desktop path; browser streaming support does not cover client or
bidirectional streams reliably. A browser terminal would need a separately
designed authenticated bridge and should not determine the general API
contract. [Connect Web streaming](https://connectrpc.com/docs/web/getting-started/).

If a desktop application is needed, reuse the web UI and place local-only
operations (credential storage, SSH/PTY, file access) behind a narrow Go
bridge. Wails is a plausible Go-based shell with web frontend and generated
TypeScript bindings, but choose it only after a prototype checks packaging,
WebView behavior on supported systems, updates, and accessibility. The bridge
must not become a second implementation of gateway policy or resource rules.
[Wails architecture](https://wails.io/docs/introduction/).

## UI client API plan

The product goal is a Cauteum management console with a dashboard and
resource pages, similar in navigation to Portainer's environment dashboard and
container detail view. Cauteum resources and permissions determine the
actual API. Do not mirror Docker image, volume, network, or stack controls
unless Cauteum gains those capabilities. Portainer's UI illustrates why
resource details, logs, actions, and role-aware access need distinct backend
operations. [Portainer dashboard](https://docs.portainer.io/user/kubernetes/dashboard),
[container details](https://docs.portainer.io/user/docker/containers/view),
[roles](https://docs.portainer.io/admin/user/roles).

The first console manages one gateway. `Environment` initially means a
gateway/backend summary; multi-gateway aggregation is a separate design.
Method names below are Proto RPCs or proposals as marked in the migration plan. The initial P0 read-only methods,
`WatchSandboxes`, `GetSandboxLogs`, `WatchSandboxLogs`, `CreateSandbox`, `StartSandbox`,
`StopSandbox`, and `DeleteSandbox` are implemented in the
gateway. A private generated TypeScript Connect client and read-only UI live in
`cauteum-gateway/api/typescript` and `cauteum-gateway/ui`. Other names are
design proposals unless marked implemented in the migration plan. Each method
needs a specific permission, request/response schema, and documented error
codes before release.

Proposed service grouping: `ConsoleService` (viewer, capabilities, overview),
`SandboxService` (inventory, lifecycle, logs, events), `PolicyService`,
`ProviderService`, `WorkspaceService`, `CatalogService` (services/templates),
and `AdminService`. A Connect method such as `ListSandboxes` would have a
generated path shaped like
`/cauteum.control.v1.SandboxService/ListSandboxes`; `/v1/sandboxes`
remains the existing REST route. Final service names and method messages are
part of the Proto review. [Connect protocol](https://connectrpc.com/docs/protocol/).

| Phase | UI area | Proposed client RPCs | Existing source / required work |
| --- | --- | --- | --- |
| P0 | Session and capabilities | `GetViewer`, `GetConsoleCapabilities` | Adapt `/v1/whoami`, gateway info, enabled backend/feature state. Return only viewer-safe fields; never return paths, owner tokens, or internal endpoints. |
| P0 | Dashboard | `GetOverview` | Implemented as an authorized registry summary with timestamp; the running count is explicitly registry-derived. Runtime health aggregation remains queued. |
| P0 | Sandbox inventory | `ListSandboxes`, `GetSandbox`, `WatchSandboxes` | List/detail and reset/snapshot watch are implemented over registry state with workspace, name, status, and driver filters. Runtime status is marked unavailable; watch reconnects by taking a new snapshot and has no durable cursor. Add runtime status joining before presenting actual runtime state. |
| P0 | Sandbox actions | `CreateSandbox`, `StartSandbox`, `StopSandbox`, `DeleteSandbox` | All four actions reuse OpenShell runtime transitions with durable audit and idempotent operation records. Start/Stop/Delete require expected resource versions. Create takes a unique name and image or workspace template. Reconcile retries through `GetOperation`; in-flight work after restart is marked uncertain. Do not use REST registry upsert for runtime creation. |
| P0 | Sandbox diagnostics | `GetSandboxLogs`, `WatchSandboxLogs`, `GetSandboxEvents` | Bounded in-memory log tails/streams are implemented with timestamp/source/level filters, cursor reset, and structured-field redaction. The Go CLI watches up to 24 visible sandboxes concurrently. Durable event history and browser/proxy validation remain queued. |
| P1 | Policy | `GetGlobalPolicy`, `UpdateGlobalPolicy`, `GetSandboxPolicy`, `UpdateSandboxPolicy`, `ListSandboxPolicyRevisions`, `GetSandboxPolicyRevision` | Implemented in `PolicyService` with platform-admin global access, workspace authorization, YAML validation, bounded documents, and expected revision checks. REST policy routes are removed. |
| P1 | Proposals | `ListPolicyProposals`, `GetPolicyProposal`, `ApprovePolicyProposal`, `RejectPolicyProposal` | Adapt proposal workflow; require an explicit decision permission and audit record. |
| P1 | Providers and profiles | `ListProviders`, `GetProvider`, `CreateProvider`, `UpdateProvider`, `DeleteProvider`, `ListProfiles`, `GetProfile`, `AttachSandboxProvider`, `DetachSandboxProvider` | Adapt gateway/OpenShell operations. Redact credentials; use write-only secret inputs. Keep refresh/rotation behind separate privileged methods. |
| P1 | Workspaces and access | `ListWorkspaces`, `GetWorkspace`, `CreateWorkspace`, `DeleteWorkspace`, `ListWorkspaceMembers`, `AddWorkspaceMember`, `RemoveWorkspaceMember` | `ListWorkspaces` and `GetWorkspace` expose only workspaces visible to the caller (or all for local/platform admin) and omit member identities. Membership changes remain queued; enforce visibility on every resource query. |
| P1 | Services and templates | `ListServices`, `GetService`, `ListTemplates`, `GetTemplate` | `ListServices` and `ListTemplates` are implemented as workspace-filtered redacted summaries. Internal backend routes, template raw specs, and environment values are omitted. Add details and writes when lifecycle and permissions are clear. |
| P2 | Settings and identity | `GetGatewaySettings`, `UpdateGatewaySettings`, `GetOIDCConfiguration` | Admin-only, allowlisted fields. Keep owner token, KEK, local paths, and provider secret material out of responses. |
| P2 | Operations | `ListOperations`, `GetOperation`, `ListAuditEvents` | Implemented over durable bounded operation/audit storage. User operation lookup is actor/workspace scoped; history listing is admin-only. |
| P2 | Interactive access | `CreateSSHSession`, `RevokeSSHSession`; separate terminal bridge if needed | Native desktop/CLI path first. Browser terminal and bidirectional streams require a dedicated authenticated transport and threat review. |

Security and contract rules for every phase:

- UI users receive their own user principal and workspace-scoped permissions;
  sandbox and gateway-internal principals cannot call this client service.
  The gateway authorizes on the server for each RPC and filters list results;
  a UI role or hidden button is never an authorization decision.
- Keep sandbox supervisor, driver, middleware, relay, credential-exchange, and
  token-issuance methods off this client service. Administrative writes need
  explicit role/scope checks and audit events.
- Public responses use typed, redacted view models. They do not expose the
  gateway owner token, provider credential values, supervisor tokens, raw
  internal errors, or unrestricted host filesystem paths.
- Mutations validate inputs, use request deadlines and resource versions or
  idempotency keys where retries are possible, and map failures to stable RPC
  codes with safe messages. Long-running lifecycle actions report operation
  state rather than implying immediate completion.
- Serve the browser from the same origin or a BFF with protected sessions.
  Preserve cancellation on streams, bound message sizes, and add limits for
  list pages and log windows.
- Contract CI runs `buf lint` and `buf breaking`; handler tests check authz,
  redaction, errors, pagination, and actual lifecycle state. REST contract
  tests continue separately.

## Delivery sequence

1. Inventory the selected UI workflows against REST and OpenShell, recording
   actual backend support, workspace permissions, redaction rules, and missing
   domain services. Define the `cauteum.control.v1` Proto and ownership.
2. Build the P0 read-only slice (`GetViewer`, `GetConsoleCapabilities`,
   `GetOverview`, `ListSandboxes`, `GetSandbox`). Extract shared application
   services where REST/RPC handlers currently read storage directly. Mount
   Connect without routing it through the REST handler or reusing gRPC auth
   interceptors implicitly.
3. Add `WatchSandboxes` and validate browser streaming, cursor/reconnect,
   cancellation, and proxy behavior. Then add lifecycle actions and logs only
   after the runtime/registry distinction and operation states are correct.
4. Generate Go and TypeScript clients from the same Proto. Check browser auth,
   cancellation, deadlines, CORS or same-origin delivery, streaming through the
   real reverse proxy, and error mapping. Python gRPC bindings and the current
   Python resource facade are implemented; Python package/release validation remains.
5. Compare generated-client ergonomics, package size, dependency resolution,
   and independent consumer builds with the current SDKs. Validate that
   authorization and audit behavior are identical across transports.
6. Deliver P1 workflows by vertical slice, then P2 after storage and security
   requirements are met. Publish one versioned Proto contract and generated
   TypeScript client for the UI. Remove legacy REST routes and OpenAPI after
   every supported CLI, SDK, and UI workflow has an RPC implementation.

No REST compatibility adapter is planned for beta. The pinned OpenShell RPC
contract remains authoritative for upstream workflows; the Cauteum control
contract covers curated user-facing operations. HTTP remains for health,
browser OIDC bootstrap, and byte-stream upgrades where required by the transport.
