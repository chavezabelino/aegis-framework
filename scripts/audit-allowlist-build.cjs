#!/usr/bin/env node
const fs = require('node:fs');

const SRC = '.aegis/security/allowlist.json';
const OUT = 'audit-ci.generated.json';

const now = new Date();

function parseDate(s) {
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid date in allowlist: ${s}`);
  }
  return d;
}

const spec = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const active = [];
const expired = [];

(spec.entries || []).forEach(e => {
  const exp = parseDate(e.expires);
  if (exp >= now) active.push(e.id);
  else expired.push(e);
});

const cfg = {
  report: true,
  low: true,
  moderate: true,
  high: true,
  critical: true,
  allowlist: active,
  'skip-dev': false,
  'pass-enoaudit': true,
};

fs.writeFileSync(OUT, JSON.stringify(cfg, null, 2));
if (expired.length) {
  console.warn('⚠️  Expired allowlist entries (not included):');
  expired.forEach(e => console.warn(`  - ${e.id} (expired ${e.expires}) :: ${e.reason || ''}`));
}
console.log(`Wrote ${OUT} with ${active.length} active allowlist entries.`);
