#!/usr/bin/env ts-node
/**
 * @aegisFrameworkVersion: 2.4.0
 * @intent: Template-driven, agent-agnostic instruction generator
 * @context: Assembles agent instructions from modular templates, agent profiles, and framework docs
 */
// Polyfill __dirname for ESM/ts-node
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import * as ejs from 'ejs';

// Utility to load a template section
function loadSection(section: string): string {
  const sectionPath = path.join(__dirname, '../framework/templates/sections', `${section}.template.md`);
  return fs.readFileSync(sectionPath, 'utf8');
}

// Utility to load an agent profile
function loadAgentProfile(agentId: string): any {
  const profilePath = path.join(__dirname, '../framework/templates/agent-profiles', `${agentId}.yaml`);
  if (!fs.existsSync(profilePath)) throw new Error(`Agent profile not found: ${agentId}`);
  return yaml.load(fs.readFileSync(profilePath, 'utf8'));
}

// Utility to load the main template
function loadMainTemplate(): string {
  const templatePath = path.join(__dirname, '../framework/templates/agent-instructions.template.md');
  return fs.readFileSync(templatePath, 'utf8');
}

// Utility to get framework version
function getFrameworkVersion(): string {
  return fs.readFileSync(path.join(__dirname, '../VERSION'), 'utf8').trim();
}

// Utility to get last updated date
function getLastUpdated(): string {
  return new Date().toISOString().split('T')[0];
}

// Utility to get framework capabilities (stub for now)
function getFrameworkCapabilities(): string {
  // In a real implementation, this would parse framework docs and codebase
  return [
    '- **Core**: Blueprint-driven development with v1.0.0-alpha specification',
    '- **Multi-Agent**: v1.1.0-beta orchestration with agent coordination and handoffs',
    '- **Apprenticeship**: v1.3.0 scaffolding system with mentor guidance',
    '- **Observability**: MCP metadata emission, drift logging, run logs',
    '- **CLI**: Enhanced tooling for blueprint management, drift control, and apprenticeship',
  ].join('\n');
}

// Utility to load and render all sections
function renderSections(agent: any): Record<string, string> {
  // In a real implementation, these would be dynamically extracted from docs
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
  };
}

function generateInstructions(agentId: string) {
  const agent = loadAgentProfile(agentId);
  const frameworkVersion = getFrameworkVersion();
  const lastUpdated = getLastUpdated();
  const sections = renderSections(agent);
  const mainTemplate = loadMainTemplate();
  const output = ejs.render(mainTemplate, { agent, frameworkVersion, lastUpdated, sections });
  const outPath = path.join(__dirname, `../framework/generated/instructions/current/${agentId}.md`);
  fs.writeFileSync(outPath, output);
  console.log(`✅ Generated instructions for ${agent.displayName}: ${outPath}`);
}

// CLI
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: ts-node cli/generate-agent-instructions-v2.ts <agent-id>');
  process.exit(0);
}
try {
  generateInstructions(args[0]);
} catch (e) {
  console.error('❌ Error:', e instanceof Error ? e.message : String(e));
  process.exit(1);
}
