# Releasing public packages

The npm organization is `@allfitone`. The packages are public and use one global version. The bootstrap release is `0.1.0`.

## Public packages

1. `@allfitone/tokens`
2. `@allfitone/brand`
3. `@allfitone/icons`
4. `@allfitone/react`
5. `@allfitone/react-native`

`@allfitone/docs` is private and is never published.

## Bootstrap release: 0.1.0

The first release must be published interactively because npm cannot configure a trusted publisher until each package exists. It is already versioned as `0.1.0`; the repository carries an empty bootstrap Changeset so validation passes without a semver bump. Do not run `npm run version-packages` for this bootstrap release. Enable 2FA on the npm account first, then run:

```bash
npm login
npm whoami
npm run check:release
npm publish --workspace @allfitone/tokens --access public --tag next
npm publish --workspace @allfitone/brand --access public --tag next
npm publish --workspace @allfitone/icons --access public --tag next
npm publish --workspace @allfitone/react --access public --tag next
npm publish --workspace @allfitone/react-native --access public --tag next
```

Do not place npm credentials in this repository.

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

Create a protected GitHub environment named `npm` and require approval before deployment. Once one OIDC release succeeds, set each npm package to require 2FA and disallow traditional publishing tokens.

## Global version contract

Every public package exports the same runtime value:

```ts
import { designSystemVersion } from "@allfitone/react";
```

Token consumers can also inspect `tokenBundle.meta.version`, `@allfitone/tokens/tokens.json`, or the CSS custom property `--afo-design-system-version`. `npm run check:versions` rejects any mismatch across public packages, Docs, internal dependencies, and `package-lock.json`.

## Normal release flow after 0.1.0

1. Run `npm run changeset` in any pull request that modifies a public contract. Because the public packages form a fixed Changesets group, they receive one global version.
2. Merge the change into `main` after CI passes.
3. Review and merge the automated `chore: version packages` pull request.
4. After the full **CI** workflow succeeds for the merged `main` commit, manually dispatch **Publish to npm** from that exact `main` ref. The publish job rejects other branches and waits for the matching CI run, including canonical Windows visual regression.
5. Confirm the published versions and install them in a smoke consumer before updating product applications.

## Promoting the pilot

Publish the bootstrap release under the `next` tag first. After Landing installs that exact version and its production build and responsive QA pass, promote the already-published artifacts without rebuilding them:

```bash
npm dist-tag add @allfitone/tokens@0.1.0 latest
npm dist-tag add @allfitone/brand@0.1.0 latest
npm dist-tag add @allfitone/icons@0.1.0 latest
npm dist-tag add @allfitone/react@0.1.0 latest
npm dist-tag add @allfitone/react-native@0.1.0 latest
```

Product repositories should pin exact `0.x` versions and receive upgrades through reviewed dependency pull requests.
