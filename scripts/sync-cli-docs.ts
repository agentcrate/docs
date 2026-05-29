/**
 * Sync the CLI reference MDX from a `crate` release.
 *
 * The crate release pipeline invokes `crate docs gen --out cli/` (powered by
 * cobra/doc.GenMarkdownTree) and uploads the resulting tree as a release
 * asset named `crate-docs.tar.gz`. This script:
 *
 *   1. Resolves the latest crate release tag (or one passed via $CRATE_TAG)
 *   2. Downloads crate-docs.tar.gz
 *   3. Replaces content/docs/cli/** with the new tree
 *   4. Writes content/docs/cli/meta.json from the tree's index
 *
 * Run from the docs release workflow after the corresponding crate release.
 */

import { execSync } from 'node:child_process';
import { mkdtempSync, rmSync, cpSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const REPO = 'agentcrate/crate';
const OUT_DIR = join(process.cwd(), 'content/docs/cli');

const tag =
  process.env.CRATE_TAG ??
  execSync(`gh release view --repo ${REPO} --json tagName -q .tagName`)
    .toString()
    .trim();

if (!tag) {
  console.error('No CLI tag resolved — set CRATE_TAG or ensure gh is auth\'d.');
  process.exit(1);
}

const work = mkdtempSync(join(tmpdir(), 'crate-docs-'));
console.log(`Downloading crate-docs.tar.gz for ${tag} into ${work}`);

execSync(
  `gh release download ${tag} --repo ${REPO} --pattern 'crate-docs.tar.gz' --dir '${work}'`,
  { stdio: 'inherit' },
);

execSync(`tar -xzf '${work}/crate-docs.tar.gz' -C '${work}'`, {
  stdio: 'inherit',
});

rmSync(OUT_DIR, { recursive: true, force: true });
cpSync(join(work, 'cli'), OUT_DIR, { recursive: true });

writeFileSync(
  join(OUT_DIR, 'meta.json'),
  JSON.stringify(
    {
      title: 'CLI reference',
      description: `Generated from \`crate ${tag}\`.`,
      pages: ['index', '...'],
    },
    null,
    2,
  ) + '\n',
);

console.log(`CLI docs synced from ${tag} → ${OUT_DIR}`);
