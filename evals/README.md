# Aegis Framework Evaluation Suite

**First-class evals in CI__ - Golden prompts, expected artifacts, and automated quality gates.

## 🎯 Overview

The `/evals` directory contains:

- __Golden prompts__: Canonical test cases for Blueprint generation
- __Expected artifacts__: Reference outputs for comparison
- __LLM-as-judge__: Style and quality evaluation (not correctness)
- __Delta detection__: Baseline comparison for regression testing

## 📁 Structure

```text
evals/
├── golden-prompts/           # Test case definitions
│   ├── feat-user-auth.YAML
│   ├── feat-data-table.YAML
│   └── feat-public-viewing.YAML
├── expected-artifacts/       # Reference outputs
│   ├── feat-user-auth/
│   │   ├── output.strict.JSON
│   │   ├── generated-code/
│   │   └── validation-results.JSON
│   └── ...
├── baselines/               # Performance baselines
│   ├── generation-speed.JSON
│   ├── quality-scores.JSON
│   └── compliance-rates.JSON
├── judges/                  # LLM evaluation prompts
│   ├── code-quality.md
│   ├── documentation.md
│   └── architectural-alignment.md
└── configs/                 # Evaluation configurations
    ├── ci-config.YAML
    ├── local-config.YAML
    └── enterprise-config.YAML
```text

## 🚀 Usage

```bash
# Run full evaluation suite
Aegis eval

# Run specific evaluation
Aegis eval feat-user-auth

# Compare against baseline
Aegis eval --baseline main

# CI mode (fail on regression)
Aegis eval --ci --threshold 0.95
```text

## 🎬 CI Integration

Add to your `.GitHub/workflows/Aegis-eval.yml`:

```yaml
- name: Run Aegis Evaluations
  run: |
    Aegis eval --ci --baseline main
    # Auto-fails if quality drops below threshold
```text
