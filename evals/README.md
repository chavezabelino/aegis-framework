# Aegis Framework Evaluation Suite

**First-class evals in CI** - Golden prompts, expected artifacts, and automated quality gates.

## 🎯 Overview

The `/evals` directory contains:
- **Golden prompts**: Canonical test cases for blueprint generation
- **Expected artifacts**: Reference outputs for comparison
- **LLM-as-judge**: Style and quality evaluation (not correctness)
- **Delta detection**: Baseline comparison for regression testing

## 📁 Structure

```
evals/
├── golden-prompts/           # Test case definitions
│   ├── feat-user-auth.yaml
│   ├── feat-data-table.yaml
│   └── feat-public-viewing.yaml
├── expected-artifacts/       # Reference outputs
│   ├── feat-user-auth/
│   │   ├── output.strict.json
│   │   ├── generated-code/
│   │   └── validation-results.json
│   └── ...
├── baselines/               # Performance baselines
│   ├── generation-speed.json
│   ├── quality-scores.json
│   └── compliance-rates.json
├── judges/                  # LLM evaluation prompts
│   ├── code-quality.md
│   ├── documentation.md
│   └── architectural-alignment.md
└── configs/                 # Evaluation configurations
    ├── ci-config.yaml
    ├── local-config.yaml
    └── enterprise-config.yaml
```

## 🚀 Usage

```bash
# Run full evaluation suite
aegis eval

# Run specific evaluation
aegis eval feat-user-auth

# Compare against baseline
aegis eval --baseline main

# CI mode (fail on regression)
aegis eval --ci --threshold 0.95
```

## 🎬 CI Integration

Add to your `.github/workflows/aegis-eval.yml`:

```yaml
- name: Run Aegis Evaluations
  run: |
    aegis eval --ci --baseline main
    # Auto-fails if quality drops below threshold
```
