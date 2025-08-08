<!--
@aegisFrameworkVersion: 2.3.0
@intent: Template section for agent instructions
@context: Modular content for framework instruction generation
-->
## 🛠️ CLI Integration

### Blueprint Management
```bash
# Initialize new blueprint
node cli/init-blueprint.ts feat-your-feature

# Validate blueprint schema
node tools/validate-blueprint.ts blueprints/feat-your-feature/blueprint.yaml

# Generate agent instructions
node cli/generate-agent-instructions-v2.cjs github-copilot --project-profile templates/project-standards.md

# Migration audit
node cli/aegis-migration-audit.cjs ../target-app --output migration-plan.md --strict
```

### Drift Detection & Control
```bash
# Constitutional conductor (governance automation)
node cli/aegis-conductor.ts

# Drift monitoring
node cli/drift-cli.ts --check

# Amendment proposals
node cli/amendment-cli.ts propose --title "Feature Enhancement" --description "..."
```

### Output Management
- `output.lean.json` — Minimal implementation
- `output.strict.json` — Full compliance mode
- `output.full.json` — Generative/creative mode

### Validation Tools
```bash
# Constitutional compliance
node tools/validate-constitution.ts

# Blueprint validation
node tools/validate-blueprint.ts blueprints/*/blueprint.yaml
```
