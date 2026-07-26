# Releasing public packages

The npm organization is `@allfitone`. The packages are public and use independent semantic versions. The aggregate bootstrap release `0.1.0` is complete.

## Public packages

1. `@allfitone/tokens`
2. `@allfitone/brand`
3. `@allfitone/icons`
4. `@allfitone/react`
5. `@allfitone/react-native`

`@allfitone/docs` is private and is never published.

## Bootstrap release: 0.1.0

The five packages were published on July 25, 2026 from commit `4dbec03784040c69ec3b0d9c38210793384e67ee`. The matching annotated Git tag and GitHub Release are `v0.1.0`. This aggregate tag is the one-time baseline before package-independent versioning. Both npm dist-tags, `latest` and `next`, point to `0.1.0`.

The one-time interactive bootstrap is complete. Do not recreate its empty Changeset or attempt to publish `0.1.0` again. Do not place npm credentials in this repository.

## Trusted publishing

After the bootstrap release, configure a trusted publisher in the settings of every npm package:

| Field | Value |
| --- | --- |
| Provider | GitHub Actions |
| Organization or user | `dinnartec` |
| Repository | `allfitone-design-system` |
| Workflow filename | `publish.yml` |
| Environment | `npm` |
| Allowed action | `npm publish` |

The GitHub environment `npm` restricts deployment to `main`. The repository is private and its current GitHub plan does not expose required-reviewer protection for this environment, so manual `workflow_dispatch`, the `main` branch policy, the exact-commit CI gate, and workflow concurrency form the release boundary.

Once one OIDC release succeeds, set each npm package to require 2FA and disallow traditional publishing tokens.

## Package version contract

Every public package owns its npm version and exports that package-local value:

```ts
import { designSystemVersion } from "@allfitone/react";
```

Despite the historical export name, `designSystemVersion` means the version of the package that exports it; it is not a global release-train version. Token consumers can also inspect the Tokens package version through `tokenBundle.meta.version`, `@allfitone/tokens/tokens.json`, or `--afo-design-system-version`.

All `0.x.y` package releases belong to the beta maturity line. The first
official Design System release is `1.0.0`, after Allfit One validates both
products in market. The Explorer therefore presents only `v0` during beta;
package manifests and release tooling continue to use their complete,
independent SemVer versions.

`npm run check:versions` verifies each package against its own runtime metadata, ensures internal semver ranges accept the workspace dependency versions, and checks each workspace entry in `package-lock.json`.

## Normal release flow after 0.1.0

1. Run `npm run changeset` in any pull request that modifies a public contract. Select only the affected packages and the appropriate semver bump.
2. Merge the change into `main` after CI passes.
3. Review and merge the automated `chore: version packages` pull request. It versions changed packages independently and includes dependent packages only when an internal range must change.
4. After the full **CI** workflow succeeds for the merged `main` commit, manually dispatch **Publish to npm** from that exact `main` ref. The publish job rejects other branches and waits for the matching CI run, including canonical Windows visual regression.
5. The workflow determines which manifest versions are not yet in npm, publishes only those packages through Trusted Publishing, and verifies their version and exact `gitHead`.
6. For every published package, the workflow creates one annotated `<package>@<version>` tag and one GitHub Release with exactly the same title.
7. Confirm the published versions and install them in a smoke consumer before updating product applications.

Example for a React-only patch:

```text
@allfitone/react@0.1.1
```

Tokens, Brand, Icons, and React Native remain at `0.1.0` unless their contracts or required internal dependency ranges also change.

## Git tags and GitHub Releases

The aggregate `v0.1.0` tag remains the immutable bootstrap snapshot. Starting with the next release, tags and GitHub Releases identify the package:

```text
@allfitone/tokens@0.1.1
@allfitone/react@0.1.1
@allfitone/react-native@0.2.0
```

A plain `v0.1.1` tag is not used because different packages may reach `0.1.1` from different commits.

## npm dist-tags

The completed bootstrap currently exposes `0.1.0` through both `latest` and `next` for all five packages. npm dist-tags are package-specific registry pointers and are independent from Git tags.

Stable package releases publish to that package's `latest` tag. A future prerelease must use Changesets prerelease mode and an explicit npm dist-tag rather than moving a stable Git tag. Product repositories should pin exact `0.x` adapter versions and receive upgrades through reviewed dependency pull requests.
