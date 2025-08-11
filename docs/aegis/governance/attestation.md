# Attestation & Provenance Verification

## Provenance Fields

Every AI-generated artifact MUST include:

- `@aegisBlueprint`, `@version`, `@mode`, `@intent`, `@context`, `@model`, `@hash`.
- Non-commentable files use `path.ext.prov.JSON` sidecars.

## Hashing Rules

- Compute `SHA256(body)` with:
  - LF newline normalization.
  - Excluding the `@hash` line.

## HMAC Signatures

- CI signs each file hash using `$AEGIS_HMAC_KEY` (HMAC-SHA256).
- Signature is written to `.Aegis/attestations/<commit>/<relpath>.sig` as JSON:
  `{ file, hash, signature, timestamp, commit, algorithm }`.

## Tools

- Generate signatures: `node tools/attest.ts attest <dir>`
- Verify signatures: `node tools/attest.ts verify <dir>`

## CI Requirements

- CI MUST rerun hashing and verify all signatures for changed files.
- Any mismatch MUST fail the build.

## Audit

- Attestation artifacts MUST be uploaded in CI.
