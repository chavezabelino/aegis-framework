#!/usr/bin/env tsx
import { readFileSync, writeFileSync } from 'node:fs';
import { globby } from 'globby';
import { createHash } from 'node:crypto';

const HEADER_START = '/**';
const HEADER_END = '*/';
const MARKER = '@generated-by: Aegis/Cursor-Copilot';

function makeHeader(meta: { model?: string; blueprint?: string; schemaVersion?: string; promptHash?: string }) {
  const date = new Date().toISOString();
  return `/**
 * ${MARKER}
 * @model: ${meta.model ?? 'unknown'}
 * @date: ${date}
 * @blueprint: ${meta.blueprint ?? 'n/a'}
 * @promptHash: ${meta.promptHash ?? 'n/a'}
 * @schemaVersion: ${meta.schemaVersion ?? '0.0.0'}
 */\n`;
}

function hasMarker(content: string) {
  return content.includes(MARKER);
}

function sha256Short(s: string) {
  return createHash('sha256').update(s).digest('hex').slice(0, 8);
}

async function run() {
  const [, , cmd, ...rest] = process.argv;
  const metaArg = rest.find(a => a.startsWith('--meta='))?.slice(7);
  const meta = metaArg ? JSON.parse(metaArg) : {};
  const patterns = ['src/**/*.ts', 'src/**/*.tsx', 'apps/**/src/**/*.ts', 'apps/**/src/**/*.tsx'];
  const files = await globby(patterns, { gitignore: true });

  if (cmd === 'add') {
    for (const f of files) {
      const txt = readFileSync(f, 'utf8');
      if (hasMarker(txt)) continue;
      const promptHash = sha256Short(f + ':' + txt.slice(0, 500));
      const header = makeHeader({ promptHash, ...meta });
      writeFileSync(f, header + txt, 'utf8');
    }
    console.log(`Provenance headers ensured for ${files.length} files (idempotent).`);
    return;
  }
  if (cmd === 'verify') {
    const missing: string[] = [];
    for (const f of files) {
      const txt = readFileSync(f, 'utf8');
      if (!hasMarker(txt) && txt.includes('@ai-generated')) missing.push(f);
    }
    if (missing.length) {
      console.error('Provenance verify failed. Missing headers on:');
      missing.forEach(m => console.error(' - ' + m));
      process.exit(1);
    }
    console.log('Provenance verify OK.');
    return;
  }
  console.error('Usage: aegis-provenance.ts add|verify [--meta=\'{"model":"gpt-5"}\']');
  process.exit(2);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
