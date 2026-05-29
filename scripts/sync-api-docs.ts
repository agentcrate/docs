/**
 * Sync the API reference MDX from the `api` repo's protobufs.
 *
 * The api publish-docs workflow generates one OpenAPI 3.1 file per service
 * via `protoc-gen-connect-openapi`, tars them, and uploads the bundle as
 * `openapi.tar.gz` on a rolling `openapi-latest` release. This script:
 *
 *   1. Resolves the rolling tag (`openapi-latest`) — overridable via $API_TAG
 *   2. Downloads `openapi.tar.gz` and extracts it
 *   3. Invokes fumadocs-openapi's `generateFiles` against the extracted
 *      schemas (no CLI exists in v10 — only a programmatic API)
 *
 * Run from the docs `sync.yml` workflow when an `api-released` dispatch
 * fires.
 */

import { execSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, globSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generateFiles } from 'fumadocs-openapi';
import { createOpenAPI } from 'fumadocs-openapi/server';

const REPO = 'agentcrate/api';
const OUT_DIR = join(process.cwd(), 'content/docs/api');

const tag = process.env.API_TAG ?? 'openapi-latest';
if (!/^[\w.\-/]+$/.test(tag)) {
  console.error(`Invalid API_TAG: ${tag}`);
  process.exit(1);
}

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

const schemaPaths = globSync('**/*.json', { cwd: extracted }).map((name) =>
  join(extracted, name),
);

if (schemaPaths.length === 0) {
  console.error(`No .json schemas found under ${extracted}`);
  process.exit(1);
}

console.log(`Generating MDX for ${schemaPaths.length} schemas → ${OUT_DIR}`);

const server = createOpenAPI({ input: schemaPaths });

mkdirSync(OUT_DIR, { recursive: true });

await generateFiles({
  input: server,
  output: OUT_DIR,
});

console.log(`API docs synced from ${tag} → ${OUT_DIR}`);
