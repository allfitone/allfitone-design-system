# Changesets

Add a changeset whenever a pull request changes the public API or behavior of a publishable `@allfitone/*` package:

```bash
npm run changeset
```

The five public packages are kept in one fixed version group while the design system is in `0.x`. Documentation-only changes do not need a changeset.
