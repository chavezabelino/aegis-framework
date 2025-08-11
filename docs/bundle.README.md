<!--
 @aegisBlueprint: planning-optimization
 @version: 2.5.0
 @mode: lean
 @intent: Documentation for building vendorable Aegis bundles
 @context: Core repo → bundle builder usage, include list governance
 @model: gpt-5-cursor
 @hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
-->

### Aegis Bundle Builder

- Purpose: produce a deterministic, vendorable `.tar.gz` containing selected Aegis rules/scripts/docs/templates plus a manifest and recommended package scripts.

### Include list

- Authoritative list: `distribution/include.txt`. If your repo guardrails restrict that path, place it at `tools/distribution/include.txt` (the builder will fallback).
- Paths are relative to repo root. Missing entries are warned, not fatal.

### Build

- Script: `tools/distribution/create-aegis-bundle.cjs`
- Output: `dist/aegis-bundles/aegis-<branch>-<shortSha>-<yyyy-mm-dd>.tar.gz`
- Contents:
  - `bundle.manifest.json`: includes commit, branch, createdAt, files[{ path, sha256, size, mode, isExec }]
  - `bundle.package-scripts.json`: subset of recommended `package.json` scripts for additive merge

### Determinism

- No network calls. Exact file set governed by include list. Checksums are SHA-256. Branch/commit captured at build time.

### Usage

```bash
node tools/distribution/create-aegis-bundle.cjs
```

Options:
- `--include <path>`: override include list
- `--out-dir <dir>`: override output directory


