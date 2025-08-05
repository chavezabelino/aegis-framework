# Contributing to Aegis Framework

We welcome contributions that improve the fidelity, flexibility, or portability of the Aegis Framework.

## 🔁 Blueprint Additions
- Follow the schema in `framework/contracts/blueprint-contract.schema.yaml`.
- Include `lean`, `strict`, and `generative` outputs if relevant.
- Submit with a snapshot test in `tests/snapshot-tests/`.

## ⚖️ Contract or Schema Changes
- All changes to `framework/contracts/` must include updated docs in `docs/`.
- Version bumps should update `framework-core-vX.Y.md` and `VERSION`.

## 🧪 Test Requirements
- Run all drift + blueprint tests before opening a PR.
- New adapters or tools should include a basic test or usage example.

## 📘 Docs
- Architecture or usage guides belong in `docs/guide/`.
- README edits welcome for clarity, language, or ecosystem growth.

---

All changes should align with the goals of replayability, observability, and safety in AI-assisted systems.
