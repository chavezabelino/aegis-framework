#!/usr/bin/env tsx
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const WAIVERS_DIR = '.aegis/waivers';
const SCHEMA_PATH = '.aegis/schemas/waiver.schema.json';

function validateAgainstSchema(obj: any, schema: any): string[] {
  const errs: string[] = [];
  for (const k of schema.required || []) {
    if (obj[k] === undefined) errs.push(`Missing required: ${k}`);
  }
  if (obj.justification && String(obj.justification).length < 20) {
    errs.push('Justification must be at least 20 characters.');
  }
  // simple date format check
  if (obj.expiry && !/^\d{4}-\d{2}-\d{2}$/.test(obj.expiry)) {
    errs.push('Expiry must be date (YYYY-MM-DD).');
  }
  return errs;
}

function run() {
  if (!existsSync(WAIVERS_DIR)) {
    console.log('No waivers directory; OK.');
    return;
  }
  const files = readdirSync(WAIVERS_DIR).filter(f => f.endsWith('.json') || f.endsWith('.yaml') || f.endsWith('.yml'));
  const schema = JSON.parse(readFileSync(SCHEMA_PATH, 'utf8'));
  const errors: string[] = [];
  for (const f of files) {
    const full = join(WAIVERS_DIR, f);
    const raw = readFileSync(full, 'utf8');
    let obj: any;
    try {
      obj = f.endsWith('.json') ? JSON.parse(raw) : simpleYamlParse(raw);
    } catch {
      errors.push(`${f}: invalid JSON/YAML`);
      continue;
    }
    errors.push(...validateAgainstSchema(obj, schema).map(e => `${f}: ${e}`));
  }
  if (errors.length) {
    console.error('Waiver verification failed:');
    errors.forEach(e => console.error(' - ' + e));
    process.exit(1);
  }
  console.log('Waivers verify OK.');
}

function simpleYamlParse(s: string) {
  // extremely small YAML subset (key: value per line)
  const obj: any = {};
  for (const line of s.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_-]+)\s*:\s*(.+?)\s*$/);
    if (m) obj[m[1]] = m[2];
  }
  return obj;
}

run();
