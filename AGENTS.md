# Allfit One Design System agent guide

This file applies to the entire repository. Read the package README and the
relevant document under `docs/` before changing a public contract.

## Repository contract

- This is an npm workspace monorepo for the public `@allfitone/*` packages and
  the private Explorer in `apps/docs`.
- Treat `packages/tokens`, `packages/brand`, and `packages/icons` as canonical
  sources. Do not recreate tokens, brand geometry, wordmarks, or icon mappings
  inside applications.
- Import React capabilities from explicit `@allfitone/react/*` subpaths. Do not
  introduce an all-components barrel.
- React Native is currently an adapter scaffold, not a complete component
  implementation. Do not describe it as production-complete.
- Preserve accessibility contracts, keyboard behavior, 44 px Web targets,
  semantic tokens, both themes, forced colors, and reduced motion.

## Editing rules

- Preserve unrelated user changes and keep changes scoped to the request.
- Public API or behavior changes require tests and documentation in the same
  change.
- Explorer examples must consume public package entry points rather than
  workspace-internal source aliases.
- Use canonical public components in Foundation and Components examples.
- Update visual snapshots only for intentional visual changes. Inspect both the
  desktop and mobile result before accepting new baselines.
- Do not publish packages, create releases, change repository settings, or push
  directly to `main` unless the user explicitly requests that action.

## Validation

Run the narrowest relevant checks while iterating, then use the appropriate
repository gate before handoff:

```bash
npm run check
npm run check:e2e
npm run check:pack
```

- `npm run check` is required for code, token, package, or Explorer changes.
- `npm run check:e2e` is required for interaction, accessibility, responsive,
  routing, or visual changes.
- `npm run check:pack` is required when a publishable package, its exports, or
  its dependencies change.
- Use `npm run check:release` when preparing an actual package release.
- Never hide or bypass a failing validation. Report environmental limitations
  explicitly if a required check cannot run.

## Independent package versioning

- The Design System remains in beta throughout the `0.x.y` line. The first
  official release is `1.0.0`, after both products have been validated in
  market and that milestone is explicitly approved.
- During beta, the Explorer in `apps/docs` displays only the shared maturity
  label `v0`; do not expose package-local minor or patch versions as the Design
  System version.
- Public packages have independent semantic versions. A change to one package
  does not automatically bump the others.
- Never edit package versions, runtime `designSystemVersion` values,
  `CHANGELOG.md` files, release tags, or package-lock versions by hand.
- Add a Changeset for every public API or behavior change:

  ```bash
  npm run changeset
  ```

- Select only the affected publishable packages and the correct semver bump.
- Documentation-only and private `@allfitone/docs` changes do not need a
  Changeset.
- Internal dependents are bumped only when Changesets determines that their
  declared range must change.
- The automated `chore: version packages` pull request owns manifest version
  updates and changelog generation.

The canonical maturity and version policy lives in
`docs/PLATFORM-PACKAGES.md`. Read it together with `.changeset/README.md` and
`docs/RELEASING.md` before modifying release automation, Explorer version
labels, or preparing a publication.

## Publishing

- npm publication uses GitHub Actions Trusted Publishing with OIDC through
  `.github/workflows/publish.yml` and the `npm` environment.
- Never add an `NPM_TOKEN`, npm automation token, or publishing credential.
- Publish only from the exact `main` commit whose full CI workflow succeeded.
- The normal flow is: merge the product change, merge the generated version PR,
  then manually dispatch `Publish to npm`.
- Stable package tags and GitHub Releases use
  `<package-name>@<version>`, for example
  `@allfitone/react@0.1.2`.
- Do not create new repository-wide `vX.Y.Z` tags. `v0.1.0` is the immutable
  one-time bootstrap tag.
- Do not run manual `npm publish` or recreate tags/releases that the workflow
  owns.

## Git handoff

- Check `git status` and review the final diff before committing.
- Use an intentional commit message that describes the user-visible change.
- Do not amend, reset, force-push, or rewrite existing history unless the user
  explicitly requests it.
- When the user requests a direct `main` delivery, update from `origin/main`,
  verify the branch is a safe fast-forward, run the required checks, and push
  without force.
