/**
 * Sync the API reference MDX from the `api` repo's protobufs.
 *
 * The api release pipeline emits `api/openapi/agentcrate.v1.json` from
 * `protoc-gen-connect-openapi` and publishes it as a release asset. This
 * script:
 *
 *   1. Resolves the latest api tag (or one passed via $API_TAG)
 *   2. Downloads the OpenAPI artifact
 *   3. Runs `fumadocs-openapi generate` to produce MDX under content/docs/api
 *
 * Run from the docs release workflow after the corresponding api release.
 */

import { execSync } from 'node:child_process';
import { mkdtempSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const REPO = 'agentcrate/api';
const OUT_DIR = join(process.cwd(), 'content/docs/api');

const tag =
  process.env.API_TAG ??
  execSync(`gh release view --repo ${REPO} --json tagName -q .tagName`)
    .toString()
    .trim();

if (!tag) {
  console.error('No API tag resolved — set API_TAG or ensure gh is auth\'d.');
  process.exit(1);
}

const work = mkdtempSync(join(tmpdir(), 'api-docs-'));
console.log(`Downloading agentcrate.v1.json for ${tag} into ${work}`);

execSync(
  `gh release download ${tag} --repo ${REPO} --pattern 'agentcrate.v1.json' --dir '${work}'`,
  { stdio: 'inherit' },
);

mkdirSync(OUT_DIR, { recursive: true });

execSync(
  `pnpm dlx fumadocs-openapi generate --input '${work}/agentcrate.v1.json' --output '${OUT_DIR}'`,
  { stdio: 'inherit' },
);

console.log(`API docs synced from ${tag} → ${OUT_DIR}`);
