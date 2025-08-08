<!--
@aegisFrameworkVersion: 2.4.0
@intent: Validation and testing template section
@context: Testing standards and validation tooling for AI agents
-->

## 🔍 Validation & Testing

### Constitutional Compliance Validation
```bash
# Validate constitutional compliance
node tools/validate-constitution.ts

# Check annotation compliance
grep -r "@aegisBlueprint" src/ --include="*.ts" --include="*.js"

# Verify semantic versioning
node tools/validate-blueprint.ts blueprints/*/blueprint.yaml
```

### Snapshot Testing
```typescript
// Blueprint fidelity validation
describe('Blueprint Fidelity', () => {
  test('feat-example generates consistent output', async () => {
    const output = await generateFromBlueprint('feat-example');
    expect(output).toMatchSnapshot();
  });
});
```

### Replay Testing
```typescript
// Deterministic output validation
describe('Blueprint Replay', () => {
  test('same blueprint produces identical output', async () => {
    const output1 = await generateFromBlueprint('feat-example');
    const output2 = await generateFromBlueprint('feat-example');
    expect(output1).toEqual(output2);
  });
});
```

### Visual Regression Testing
```typescript
// Required for public routes
describe('Visual Regression', () => {
  test('public route renders consistently', async () => {
    await page.goto('/public/example');
    const screenshot = await page.screenshot();
    expect(screenshot).toMatchImageSnapshot();
  });
});
```

### Validation Files Structure
```
tests/
├── snapshot-tests/
│   ├── blueprint-fidelity.test.ts
│   └── apprenticeship-scaffolds.test.ts
├── replay-diff-tests/
│   ├── blueprint-replay.test.ts
│   └── apprenticeship-scaffolds-replay.test.ts
└── visual-regression/
    └── public-routes.test.ts
```

### Pre-Commit Validation Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit
node tools/validate-constitution.ts || exit 1
node tools/validate-blueprint.ts blueprints/*/blueprint.yaml || exit 1
npm run test:snapshot || exit 1
```
