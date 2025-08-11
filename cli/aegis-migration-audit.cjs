#!/usr/bin/env node
/**
 * Migration Audit CLI Tool for Aegis Framework
 *
 * Scans an existing application, audits for Aegis compliance, and generates a migration plan.
 *
 * Usage:
 *   node cli/aegis-migration-audit.cjs <target-path> [options]
 *
 * Options:
 *   --output <file>   Write migration plan to file (default: stdout)
 *   --strict          Fail on first critical compliance issue
 *   --help            Show usage instructions
 *
 * @aegisBlueprint: migration-audit-tool
 * @version: 1.0.0-alpha
 * @mode: lean
 * @intent: CLI tool to audit an application and derive a migration plan for Aegis Framework compliance
 * @context: Implements blueprint-driven audit and migration planning as described in v1.4.0 changelog and user request
 */

const fs = require('fs');
const path = require('path');

function printHelp() {
  console.log(
    `\nAegis Migration Audit CLI\n\nUsage:\n  node cli/aegis-migration-audit.cjs <target-path> [options]\n\nOptions:\n  --output <file>   Write migration plan to file (default: stdout)\n  --strict          Fail on first critical compliance issue\n  --help            Show usage instructions\n`
  );
}

function scanDirectory(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      scanDirectory(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function auditFile(filePath) {
  const ext = path.extname(filePath);
  const base = path.basename(filePath);
  // Blueprint YAML
  if (ext === '.yaml' && filePath.includes('blueprints/')) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasId = /id:/i.test(content);
    const hasVersion = /version:/i.test(content);
    const hasContracts = /ruleContracts:/i.test(content);
    const hasObservability = /observability:/i.test(content);
    const hasErrorStates = /errorStates:/i.test(content);
    return {
      file: filePath,
      type: 'blueprint',
      status: 'found',
      hasId,
      hasVersion,
      hasContracts,
      hasObservability,
      hasErrorStates,
    };
  }
  // Constitution
  if (base === 'CONSTITUTION.md') {
    return { file: filePath, type: 'constitution', status: 'found' };
  }
  // Framework version file
  if (base === 'VERSION') {
    const version = fs.readFileSync(filePath, 'utf8').trim();
    return { file: filePath, type: 'version', status: 'found', version };
  }
  // Adapter interface
  if (filePath.includes('framework/adapters/adapter-interface.ts')) {
    return { file: filePath, type: 'adapter-interface', status: 'found' };
  }
  // Contracts directory
  if (filePath.includes('framework/contracts/')) {
    return { file: filePath, type: 'contracts', status: 'found' };
  }
  // Observability events
  if (filePath.includes('framework/observability/')) {
    return { file: filePath, type: 'observability', status: 'found' };
  }
  // Output management pattern
  if (/output\.(lean|strict|full)\.json$/.test(base)) {
    return { file: filePath, type: 'output', status: 'found' };
  }
  // Check for required annotation in markdown or code files
  if (['.md', '.js', '.ts', '.cjs'].includes(ext)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasAegisBlueprint = /@aegisBlueprint:/i.test(content);
    const hasVersion = /@version:/i.test(content);
    const hasMode = /@mode:/i.test(content);
    if (hasAegisBlueprint && hasVersion && hasMode) {
      return { file: filePath, type: 'annotation', status: 'found' };
    }
  }
  return null;
}

function generateMigrationPlan(auditResults) {
  const plan = [];
  // 1. Blueprint checks
  const blueprints = auditResults.filter(r => r.type === 'blueprint');
  if (blueprints.length === 0) {
    plan.push('- [ ] Add at least one valid blueprint.yaml in blueprints/');
  } else {
    blueprints.forEach(bp => {
      if (!bp.hasId) plan.push(`- [ ] Add 'id' field to blueprint: ${bp.file}`);
      if (!bp.hasVersion) plan.push(`- [ ] Add 'version' field to blueprint: ${bp.file}`);
      if (!bp.hasContracts) plan.push(`- [ ] Add 'ruleContracts' to blueprint: ${bp.file}`);
      if (!bp.hasObservability) plan.push(`- [ ] Add 'observability' section to blueprint: ${bp.file}`);
      if (!bp.hasErrorStates) plan.push(`- [ ] Add 'errorStates' to blueprint: ${bp.file}`);
    });
  }
  // 2. Constitution
  if (!auditResults.find(r => r.type === 'constitution')) {
    plan.push('- [ ] Add CONSTITUTION.md at project root');
  }
  // 3. Framework version
  const versionFile = auditResults.find(r => r.type === 'version');
  if (!versionFile) {
    plan.push('- [ ] Add VERSION file at project root');
  } else if (!/^\d+\.\d+\.\d+(-[a-z]+)?$/.test(versionFile.version)) {
    plan.push(`- [ ] Ensure VERSION file uses semantic versioning (found: ${versionFile.version})`);
  }
  // 4. Adapter interface
  if (!auditResults.find(r => r.type === 'adapter-interface')) {
    plan.push('- [ ] Add framework/adapters/adapter-interface.ts');
  }
  // 5. Contracts directory
  if (!auditResults.find(r => r.type === 'contracts')) {
    plan.push('- [ ] Add framework/contracts/ for contract definitions');
  }
  // 6. Observability events
  if (!auditResults.find(r => r.type === 'observability')) {
    plan.push('- [ ] Add framework/observability/ for event schemas');
  }
  // 7. Output management
  if (!auditResults.find(r => r.type === 'output')) {
    plan.push('- [ ] Add output.lean.json, output.strict.json, and output.full.json for agent outputs');
  }
  // 8. Required annotations
  if (!auditResults.find(r => r.type === 'annotation')) {
    plan.push('- [ ] Add required @aegisBlueprint, @version, and @mode annotations to AI-generated files');
  }
  // 9. Summary
  if (plan.length === 0) {
    plan.push('✔ Project appears fully Aegis-compliant.');
  } else {
    plan.unshift('Migration Plan:');
    plan.push('\nSee https://github.com/chavezabelino/aegis-framework for framework docs and migration guides.');
  }
  return plan.join('\n');
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.length === 0) {
    printHelp();
    process.exit(0);
  }
  const targetPath = args[0];
  const outputIdx = args.indexOf('--output');
  const outputFile = outputIdx !== -1 ? args[outputIdx + 1] : null;
  const strict = args.includes('--strict');

  if (!fs.existsSync(targetPath)) {
    console.error('Target path does not exist:', targetPath);
    process.exit(1);
  }

  const allFiles = scanDirectory(targetPath);
  const auditResults = allFiles.map(auditFile).filter(Boolean);
  const migrationPlan = generateMigrationPlan(auditResults);

  if (outputFile) {
    fs.writeFileSync(outputFile, migrationPlan, 'utf8');
    console.log('Migration plan written to', outputFile);
  } else {
    console.log('\nMigration Plan:\n');
    console.log(migrationPlan);
  }

  if (strict && migrationPlan.includes('- [ ]')) {
    process.exit(2);
  }
}

main();
