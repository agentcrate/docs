# AgentCrate Docs

The documentation site for **AgentCrate** (the platform) and **CrateHub**
(the registry). Built on [Fumadocs](https://fumadocs.dev) + Next.js,
deployed on Vercel.

- **Staging**: <https://docs.cratehub.dev>
- **Production**: <https://docs.agentcrate.ai>

## Local dev

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

## Structure

```text
app/                 Next.js App Router
content/docs/        MDX pages
  get-started/         Hand-written quickstart
  guides/              Hand-written guides
  cli/                 Auto-generated from `crate` releases — DO NOT EDIT
  api/                 Auto-generated from `api` releases — DO NOT EDIT
scripts/
  sync-cli-docs.ts    Pulls cli MDX from a `crate` release
  sync-api-docs.ts    Renders api MDX from a `protoc-gen-connect-openapi` artifact
lib/source.ts        Fumadocs source loader
```

## Adding a page

1. Drop a new `.mdx` under `content/docs/<section>/`
2. Add it to that section's `meta.json` (or omit to let Fumadocs sort
   alphabetically)
3. The dev server hot-reloads

## Auto-generated sections

The CLI reference (`content/docs/cli/`) and API reference
(`content/docs/api/`) are rewritten by `pnpm sync:cli` and `pnpm sync:api`.
Both scripts pull release assets from `agentcrate/crate` and `agentcrate/api`
respectively. The docs release workflow runs them after each upstream release,
opens a PR back into `main`, and lets `gitar-bot` review.

## Deployment

Vercel project `agentcrate-docs`:

- **Production** branch `main` → `docs.agentcrate.ai`
- **Preview** branches → `docs.cratehub.dev` + preview URLs

DNS is managed in `agentcrate/infra/cloudflare/`.
