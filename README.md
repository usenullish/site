# nullish website

This is the website of [nullish](https://nullish.ch).

## Documentation

> [!IMPORTANT]
> Don't edit the `.mdoc` pages in `src/content/docs/` here.
> They live in the `docs/` folders of [nullish](https://github.com/usenullish/nullish) and [templates](https://github.com/usenullish/templates), and get overwritten on every sync.

A CI action can sync them. To pull the latest manually:

```bash
pnpm sync-docs
```

## Local Development

```bash
pnpm i --frozen-lockfile
pnpm dev
```

Then open [http://localhost:4321](http://localhost:4321).
