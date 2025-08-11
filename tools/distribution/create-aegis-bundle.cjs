#!/usr/bin/env node
/**
 @aegisBlueprint: planning-optimization
 @version: 2.5.0
 @mode: lean
 @intent: Build a deterministic, vendorable Aegis bundle (manifest + files + scripts)
 @context: Aegis Framework → bundle builder; no network calls; portable macOS/Linux
 @model: gpt-5-cursor
 @hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
*/
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

function exitWith(msg, code = 1) {
  console.error(`[aegis-bundle] ${msg}`);
  process.exit(code);
}

function parseArgs(argv) {
  const args = { include: null, outDir: null, help: false };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '-h' || a === '--help') args.help = true;
    else if (a === '--include') args.include = argv[++i];
    else if (a.startsWith('--include=')) args.include = a.split('=')[1];
    else if (a === '--out-dir') args.outDir = argv[++i];
    else if (a.startsWith('--out-dir=')) args.outDir = a.split('=')[1];
    else exitWith(`Unknown arg: ${a}`);
  }
  return args;
}

function repoRootFromHere() {
  let dir = __dirname;
  while (true) {
    if (fs.existsSync(path.join(dir, 'package.json'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return process.cwd();
}

function readIncludeList(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const files = [];
  let inBlock = false;
  for (const lineRaw of lines) {
    const trimmed = lineRaw.trim();
    if (trimmed.startsWith('/**')) { inBlock = true; continue; }
    if (inBlock && trimmed.includes('*/')) { inBlock = false; continue; }
    if (inBlock) continue;
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) continue;
    files.push(trimmed);
  }
  return files;
}

function sha256File(filePath) {
  const h = crypto.createHash('sha256');
  const data = fs.readFileSync(filePath);
  h.update(data);
  return h.digest('hex');
}

function sanitizeBranchName(name) {
  return name.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
}

function getGitMeta(root) {
  const opts = { cwd: root, encoding: 'utf8' };
  const branch = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], opts);
  if (branch.status !== 0) exitWith('Failed to read git branch');
  const full = spawnSync('git', ['rev-parse', 'HEAD'], opts);
  if (full.status !== 0) exitWith('Failed to read git commit');
  const short = spawnSync('git', ['rev-parse', '--short', 'HEAD'], opts);
  if (short.status !== 0) exitWith('Failed to read short commit');
  return {
    branch: branch.stdout.trim(),
    commit: full.stdout.trim(),
    shortSha: short.stdout.trim(),
  };
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyWithMode(src, dst) {
  const st = fs.statSync(src);
  ensureDir(path.dirname(dst));
  const data = fs.readFileSync(src);
  fs.writeFileSync(dst, data);
  const isExec = (st.mode & 0o111) !== 0;
  if (isExec) fs.chmodSync(dst, st.mode & 0o777);
  return { size: st.size, mode: st.mode & 0o777, isExec };
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log('Usage: node tools/distribution/create-aegis-bundle.cjs [--include <file>] [--out-dir <dir>]');
    process.exit(0);
  }

  const root = repoRootFromHere();
  const defaultPrimary = path.join(root, 'distribution', 'include.txt');
  const defaultFallback = path.join(root, 'tools', 'distribution', 'include.txt');
  const includeFile = args.include
    ? path.resolve(args.include)
    : (fs.existsSync(defaultPrimary) ? defaultPrimary : defaultFallback);

  if (!fs.existsSync(includeFile)) {
    exitWith(`Include file not found: ${includeFile}`);
  }

  const includePaths = readIncludeList(includeFile);
  if (includePaths.length === 0) exitWith('Include list is empty');

  const git = getGitMeta(root);
  const ymd = new Date().toISOString().slice(0, 10);
  const bundleName = `aegis-${sanitizeBranchName(git.branch)}-${git.shortSha}-${ymd}.tar.gz`;
  const outDir = args.outDir ? path.resolve(args.outDir)
    : path.join(root, 'dist', 'aegis-bundles');
  ensureDir(outDir);

  const stageRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'aegis-bundle-'));
  const stageDir = path.join(stageRoot, 'bundle');
  ensureDir(stageDir);

  const files = [];
  const warnings = [];
  for (const rel of includePaths) {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs)) {
      warnings.push(`Missing: ${rel}`);
      continue;
    }
    if (fs.statSync(abs).isDirectory()) {
      const stack = [rel];
      while (stack.length) {
        const currRel = stack.pop();
        const currAbs = path.join(root, currRel);
        const stat = fs.statSync(currAbs);
        if (stat.isDirectory()) {
          for (const child of fs.readdirSync(currAbs)) {
            stack.push(path.join(currRel, child));
          }
        } else {
          const dst = path.join(stageDir, currRel);
          const { size, mode, isExec } = copyWithMode(currAbs, dst);
          const hash = sha256File(currAbs);
          files.push({ path: currRel, sha256: hash, size, mode, isExec });
        }
      }
    } else {
      const dst = path.join(stageDir, rel);
      const { size, mode, isExec } = copyWithMode(abs, dst);
      const hash = sha256File(abs);
      files.push({ path: rel, sha256: hash, size, mode, isExec });
    }
  }

  if (warnings.length) {
    for (const w of warnings) console.warn(`[aegis-bundle][warn] ${w}`);
  }
  if (files.length === 0) exitWith('No files to bundle after filtering/missing warnings');

  const manifest = {
    kind: 'aegis-bundle',
    version: '1',
    createdAt: new Date().toISOString(),
    branch: git.branch,
    commit: git.commit,
    shortSha: git.shortSha,
    files,
  };
  fs.writeFileSync(path.join(stageDir, 'bundle.manifest.json'), JSON.stringify(manifest, null, 2));

  const pkgPath = path.join(root, 'package.json');
  let scriptsSubset = {};
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const recommend = ['quality', 'check:provenance', 'validate:blueprint'];
    scriptsSubset = Object.fromEntries(
      recommend
        .filter((k) => pkg.scripts && Object.prototype.hasOwnProperty.call(pkg.scripts, k))
        .map((k) => [k, pkg.scripts[k]])
    );
  } catch {
    // ignore
  }
  fs.writeFileSync(
    path.join(stageDir, 'bundle.package-scripts.json'),
    JSON.stringify(scriptsSubset, null, 2)
  );

  const outFile = path.join(outDir, bundleName);
  const tarRes = spawnSync('tar', ['-czf', outFile, '-C', stageDir, '.'], { stdio: 'inherit' });
  if (tarRes.status !== 0) exitWith('Failed to create tar.gz via system tar');

  console.log(`[aegis-bundle] Created ${outFile}`);
  process.exit(0);
}

if (require.main === module) {
  main();
}


