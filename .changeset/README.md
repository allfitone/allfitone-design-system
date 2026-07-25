# Changesets

Add a changeset whenever a pull request changes the public API or behavior of a publishable `@allfitone/*` package:

```bash
npm run changeset
```

Select only the packages whose published contract changes. Changesets versions packages independently and adds dependent packages only when an internal dependency range must change. Documentation-only changes do not need a changeset.
