/**
 * Sync the API reference MDX from the `api` repo's protobufs.
 *
 * The api publish-docs workflow generates one OpenAPI 3.1 file per service
 * via `protoc-gen-connect-openapi`, tars them, and uploads the bundle as
 * `openapi.tar.gz` on a rolling `openapi-latest` release. This script:
 *
 *   1. Resolves the rolling tag (`openapi-latest`) — overridable via $API_TAG
 *   2. Downloads `openapi.tar.gz` and extracts it
 *   3. Runs `fumadocs-openapi generate` against the extracted directory
 *
 * Run from the docs `sync.yml` workflow when an `api-released` dispatch
 * fires.
 */

import { execSync } from 'node:child_process';
import { mkdtempSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const REPO = 'agentcrate/api';
const OUT_DIR = join(process.cwd(), 'content/docs/api');

const tag = process.env.API_TAG ?? 'openapi-latest';

const work = mkdtempSync(join(tmpdir(), 'api-docs-'));
console.log(`Downloading openapi.tar.gz for ${tag} into ${work}`);

execSync(
  `gh release download ${tag} --repo ${REPO} --pattern 'openapi.tar.gz' --dir '${work}'`,
  { stdio: 'inherit' },
);

const extracted = join(work, 'openapi');
mkdirSync(extracted, { recursive: true });
execSync(`tar -xzf '${work}/openapi.tar.gz' -C '${extracted}'`, {
  stdio: 'inherit',
});

mkdirSync(OUT_DIR, { recursive: true });

execSync(
  `pnpm dlx fumadocs-openapi generate --input '${extracted}' --output '${OUT_DIR}'`,
  { stdio: 'inherit' },
);

console.log(`API docs synced from ${tag} → ${OUT_DIR}`);
