#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const manifestPath = 'framework/agent-manifest.json';
const outputPath = '.copilot/copilot-instructions.md';

try {
  // Read the agent manifest
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Agent manifest not found at ${manifestPath}`);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const version = manifest.aegisFrameworkVersion;

  // Read the template instructions
  const templatePath = `framework/versions/instructions-v${version}.md`;
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template instructions not found at ${templatePath}`);
  }

  const template = fs.readFileSync(templatePath, 'utf8');

  // Ensure .copilot directory exists
  const copilotDir = path.dirname(outputPath);
  if (!fs.existsSync(copilotDir)) {
    fs.mkdirSync(copilotDir, { recursive: true });
  }

  // Generate contextual instructions
  const contextualInstructions = `${template}

## 🔧 Project-Specific Context

**Current Framework Version**: ${version}
**Supported Output Types**: ${Object.keys(manifest.outputTypes).join(', ')}
**Available Validation Tools**: 
${Object.entries(manifest.validationTools)
  .map(([name, tool]) => `- ${name}: \`${tool}\``)
  .join('\n')}

**Supported Agents**: ${manifest.supportedAgents.join(', ')}

## 📝 Quick Reference

**Blueprint Schema**: ${JSON.stringify(manifest.blueprintSchema, null, 2)}

**Annotation Pattern**:
\`\`\`
${manifest.behavioralAnnotations.pattern}
\`\`\`

---
*Generated from ${manifestPath} on ${new Date().toISOString()}*
`;

  // Write the output
  fs.writeFileSync(outputPath, contextualInstructions);

  console.log(`✅ Generated agent context at ${outputPath}`);
  console.log(`📋 Framework version: ${version}`);
  console.log(`🤖 Supported agents: ${manifest.supportedAgents.length}`);
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`❌ Failed to generate agent context: ${errorMessage}`);
  process.exit(1);
}
