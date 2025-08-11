#!/usr/bin/env node
/**
 * @aegisFrameworkVersion: 1.4.0
 * @intent: Template-driven, agent-agnostic instruction generator (CommonJS)
 * @context: Assembles agent instructions from modular templates, agent profiles, and framework docs
 */
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const ejs = require('ejs');
const minimist = require('minimist');

function loadSection(section) {
  // Accept both 'constitutional' and 'constitutional.template.md' as input
  let sectionFile = section.endsWith('.template.md') ? section : section + '.template.md';
  const sectionPath = path.join(__dirname, '../framework/templates/sections', sectionFile);
  if (!fs.existsSync(sectionPath)) throw new Error(`Section template not found: ${sectionFile}`);
  return fs.readFileSync(sectionPath, 'utf8');
}

function loadAgentProfile(agentId) {
  const profilePath = path.join(__dirname, '../framework/templates/agent-profiles', `${agentId}.yaml`);
  if (!fs.existsSync(profilePath)) throw new Error(`Agent profile not found: ${agentId}`);
  return yaml.load(fs.readFileSync(profilePath, 'utf8'));
}

function loadMainTemplate() {
  const templatePath = path.join(__dirname, '../framework/templates/agent-instructions.template.md');
  return fs.readFileSync(templatePath, 'utf8');
}

function getFrameworkVersion() {
  return fs.readFileSync(path.join(__dirname, '../VERSION'), 'utf8').trim();
}

function getLastUpdated() {
  return new Date().toISOString().split('T')[0];
}

function getFrameworkCapabilities() {
  return [
    '- **Core**: Blueprint-driven development with v1.0.0-alpha specification',
    '- **Multi-Agent**: v1.1.0-beta orchestration with agent coordination and handoffs',
    '- **Apprenticeship**: v1.3.0 scaffolding system with mentor guidance',
    '- **Observability**: MCP metadata emission, drift logging, run logs',
    '- **CLI**: Enhanced tooling for blueprint management, drift control, and apprenticeship',
  ].join('\n');
}

function renderSections(agent) {
  return {
    constitutional: ejs.render(loadSection('constitutional.template.md'), {}),
    frameworkContext: ejs.render(loadSection('framework-context.template.md'), {
      frameworkVersion: getFrameworkVersion(),
      frameworkCapabilities: getFrameworkCapabilities(),
    }),
    agentProfile: ejs.render(loadSection('agent-profile.template.md'), { agent }),
    multiAgent: ejs.render(loadSection('multi-agent.template.md'), {
      multiAgentContent: 'See framework/versions/framework-core-v1.1.0-beta-spec.md for orchestration details.',
    }),
    blueprintCompliance: ejs.render(loadSection('blueprint-compliance.template.md'), {
      blueprintComplianceContent: 'See framework-core-v1.0.0-alpha.md for blueprint requirements.',
    }),
    mcpMetadata: ejs.render(loadSection('mcp-metadata.template.md'), {
      mcpMetadataContent: 'See framework/observability/ for MCP event schemas.',
    }),
    driftDetection: ejs.render(loadSection('drift-detection.template.md'), {
      driftDetectionContent: 'See drift log and CLI for drift management.',
    }),
    cliIntegration: ejs.render(loadSection('cli-integration.template.md'), {
      cliIntegrationContent: 'See CLI tools for blueprint, drift, and apprenticeship workflows.',
    }),
    validation: ejs.render(loadSection('validation.template.md'), {
      validationContent: 'See tests/snapshot-tests/ and validation tools.',
    }),
    knowledgeBase: ejs.render(loadSection('knowledge-base.template.md'), {
      knowledgeBaseContent: 'See docs/ for architecture, workflow, and reference.',
    }),
    aiAgentMode: ejs.render(loadSection('ai-agent-mode.template.md'), {}),
    directoryStructure: ejs.render(loadSection('directory-structure.template.md'), {}),
    rcaDebugLoop: ejs.render(loadSection('rca-debug-loop.template.md'), {}),
    codePatterns: ejs.render(loadSection('code-patterns.template.md'), {}),
    decisionMatrix: ejs.render(loadSection('decision-matrix.template.md'), {}),
  };
}

function loadProjectStandards(projectProfilePath) {
  if (!projectProfilePath) return '';
  if (!fs.existsSync(projectProfilePath)) throw new Error(`Project standards file not found: ${projectProfilePath}`);
  return fs.readFileSync(projectProfilePath, 'utf8');
}

function generateInstructions(agentId, projectProfilePath) {
  const agent = loadAgentProfile(agentId);
  const frameworkVersion = getFrameworkVersion();
  const lastUpdated = getLastUpdated();
  const sections = renderSections(agent);
  const mainTemplate = loadMainTemplate();
  const projectStandards = loadProjectStandards(projectProfilePath);
  const output = ejs.render(mainTemplate, { agent, frameworkVersion, lastUpdated, sections, projectStandards });
  let outPath;
  if (projectProfilePath) {
    outPath = path.join(__dirname, `../framework/generated/instructions/current/${agentId}-ready.md`);
  } else {
    outPath = path.join(__dirname, `../framework/generated/instructions/current/${agentId}.md`);
  }
  fs.writeFileSync(outPath, output);
  console.log(`✅ Generated instructions for ${agent.displayName}: ${outPath}`);
}

const args = minimist(process.argv.slice(2));
const agentId = args._[0];
const projectProfilePath = args['project-profile'] || args['projectProfile'];
if (!agentId) {
  console.log('Usage: node cli/generate-agent-instructions-v2.cjs <agent-id> [--project-profile <path>]');
  process.exit(0);
}
try {
  generateInstructions(agentId, projectProfilePath);
} catch (e) {
  console.error('❌ Error:', e instanceof Error ? e.message : String(e));
  process.exit(1);
}
