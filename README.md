# nullish website

This is the website of [nullish](https://nullish.ch).

## Packages

| Package                                | Description                                |
| -------------------------------------- | ------------------------------------------ |
| [`packages/client`](./packages/client) | The prerendered website and the docs.      |
| [`packages/server`](./packages/server) | An API which sends the contact form mails. |

## Documentation

> [!IMPORTANT]
> Don't edit the `.mdoc` pages in `packages/client` here.
> They live in the `docs/` folders of [nullish](https://github.com/usenullish/nullish), [document-templates](https://github.com/usenullish/document-templates) and [email-templates](https://github.com/usenullish/email-templates), and get overwritten on every sync.

A CI action can sync them. To pull the latest manually:

```bash
pnpm --filter @usenullish/site-client sync-docs
```

## Local Development

Start [Mailpit](https://mailpit.axllent.org), which receives the mails sent by the API:

```bash
pnpm env:dev
```

Then, in another terminal, install the dependencies and start the website and the API:

```bash
pnpm i --frozen-lockfile
pnpm dev
```

| URL                                            | Service                                      |
| ---------------------------------------------- | -------------------------------------------- |
| [http://localhost:4321](http://localhost:4321) | The website, which proxies `/api` to the API |
| [http://localhost:3000](http://localhost:3000) | The API                                      |
| [http://localhost:8025](http://localhost:8025) | Mailpit, to read the mails sent locally      |

After changing the English translations in `packages/client/src/assets/i18n/en.json`, regenerate their types:

```bash
pnpm --filter @usenullish/site-client i18n
```

## Tests

The end-to-end tests fill in the contact forms and check the mails in Mailpit. With Mailpit running:

```bash
pnpm e2e:playwright:install
pnpm e2e
```
