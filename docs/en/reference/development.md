# Development

cauteum uses independent Git repositories and Go 1.27 modules. A local
workspace can place the checkouts next to each other; the root itself does not
need a Git repository. Run Git commands inside the module you are changing.

## Go workspace

Use a `go.work` file to link sibling modules. Keep local replacements in that
file, not in published `go.mod` files. Replacements for workspace modules must
include the dependency version:

```bash
go work edit -replace=github.com/cauteum/cauteum-core@v0.1.0-beta.1=./cauteum-core
git -C cauteum-cli status
```

Match replacement versions to the checked-out manifests. Release checks must
also build without a workspace once the dependency versions are published.

The workspace `Taskfile.yml` runs shared checks. Use `task workspace:sync` after adding or renaming a Go checkout, `task check` for the Go modules, and `task compat:pin-check`, `task compat:proto`, and `task compat:gaps` for the pinned OpenShell contract. Run module tests from their own checkout before publishing.

The proto check uses an exact OpenShell source checkout. Prepare it with `bash tools/fetch-openshell-upstream.sh`; the script checks an existing checkout against `tools/upstream/UPSTREAM_SHA` and fetches that commit when absent.

## Releases

Modules use semantic version tags. Alpha, beta, and release candidate tags are prereleases. Nightly CLI builds are manual and are not part of the current public Releases page. Each module has its own release. When a public module path or API changes, release dependencies first, update consumer requirements, and test a clean build with `GOWORK=off` and no local replacements. Do not rewrite published tags.

The latest CLI beta is `v0.1.0-beta.2`. Core, runtime, proxy, gateway, and driver are at `v0.1.0-beta.1`; display, providers, and SDK remain at `v0.1.0-alpha.2` because they have not needed a new release. The Python package is tagged `v0.1.0-beta.1` (`0.1.0b1` as a Python version); it is not published on PyPI. Use the version declared in each checkout's `go.mod` rather than assuming one tag across modules.

The logging checkout is locally named `cauteum-slogx`, while its published module path is still `github.com/cauteum/slogx`. Change the public path only together with a new repository and a tested consumer migration.

## Review conventions

- Declare small interfaces in the consuming package; keep helpers private.
- Use semantic map aliases for public payloads, such as SDK `Credentials` and
  `Labels`, while preserving compatibility with ordinary maps.
- Return errors that affect correctness. Explain intentional discarded errors;
  a blank identifier alone does not require a comment in Go.
- Keep shared paths, ports, host aliases, and endpoints in `core/defaults`.
- Apply standard Go modernization with `go fix`, reviewing behavior changes.
  Changes to JSON parsing or serialization require a compatibility review.

Validate formatting, build, race tests, vet, platform-specific compilation,
and the linters configured in each repository. Build this site with
`mkdocs build --strict` before submitting documentation changes.

## Inference endpoints

Provider records may set `config.base_url` to an HTTP(S) upstream with a host
and without embedded credentials. Known provider types use their defaults;
unknown types have no implicit OpenAI fallback. DeepInfra uses its own endpoint.
The sandbox policy must allow the configured destination.
