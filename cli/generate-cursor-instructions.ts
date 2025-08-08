/**
 * @aegisFrameworkVersion: 2.4.0-alpha-dev
 * @intent: Cursor-specific instruction generator with real-time detection integration
 * @context: Generates instructions optimized for Cursor's interface patterns and capabilities
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as yaml from 'js-yaml';
import * as ejs from 'ejs';

// Polyfill __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CursorAgentProfile {
  agentId: string;
  displayName: string;
  capabilities: {
    languages: string[];
    frameworks: string[];
    specializations: string[];
    strengths: string[];
    limitations: string[];
  };
  coordination: {
    handoffs: boolean;
    parallelExecution: boolean;
    conflictResolution: string;
  };
  preferences: {
    outputStyle: string;
    exampleDepth: string;
    codeSnippets: boolean;
    realTimeDetection: boolean;
  };
  interface: {
    patterns: string[];
    realTimeDetection: {
      enabled: boolean;
      patterns: string[];
      integration: string[];
    };
  };
}

class CursorInstructionGenerator {
  private frameworkRoot: string;
  private currentVersion: string;
  private cursorProfile: CursorAgentProfile;

  constructor() {
    this.frameworkRoot = path.resolve(__dirname, '..');
    this.currentVersion = this.getFrameworkVersion();
    this.cursorProfile = this.loadCursorProfile();
  }

  private getFrameworkVersion(): string {
    const versionPath = path.join(this.frameworkRoot, 'VERSION');
    if (fs.existsSync(versionPath)) {
      return fs.readFileSync(versionPath, 'utf8').trim();
    }
    return '2.0.0-alpha-dev';
  }

  private loadCursorProfile(): CursorAgentProfile {
    const profilePath = path.join(this.frameworkRoot, 'framework', 'templates', 'agent-profiles', 'cursor.yaml');
    if (!fs.existsSync(profilePath)) {
      throw new Error(`Cursor profile not found: ${profilePath}`);
    }
    
    const profileContent = fs.readFileSync(profilePath, 'utf8');
    return yaml.load(profileContent) as CursorAgentProfile;
  }

  private loadTemplateSection(section: string): string {
    const sectionPath = path.join(this.frameworkRoot, 'framework', 'templates', 'sections', `${section}.template.md`);
    if (!fs.existsSync(sectionPath)) {
      throw new Error(`Template section not found: ${section}`);
    }
    return fs.readFileSync(sectionPath, 'utf8');
  }

  private loadMainTemplate(): string {
    const templatePath = path.join(this.frameworkRoot, 'framework', 'templates', 'agent-instructions.template.md');
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Main template not found: ${templatePath}`);
    }
    return fs.readFileSync(templatePath, 'utf8');
  }

  private renderSections(): Record<string, string> {
    const sections: Record<string, string> = {};
    
    // Load and render each section with Cursor-specific context
    const sectionNames = [
      'constitutional',
      'frameworkContext', 
      'agentProfile',
      'multiAgent',
      'blueprintCompliance',
      'mcpMetadata',
      'driftDetection',
      'cliIntegration',
      'validation',
      'knowledgeBase',
      'aiAgentMode',
      'directoryStructure',
      'rcaDebugLoop',
      'codePatterns',
      'decisionMatrix'
    ];

    for (const sectionName of sectionNames) {
      try {
        const sectionContent = this.loadTemplateSection(sectionName);
        sections[sectionName] = ejs.render(sectionContent, { 
          agent: this.cursorProfile,
          frameworkVersion: this.currentVersion,
          lastUpdated: new Date().toISOString()
        });
      } catch (error) {
        console.warn(`Section ${sectionName} not found, skipping...`);
        sections[sectionName] = '';
      }
    }

    return sections;
  }

  private generateCursorSpecificSection(): string {
    return `
## 🎨 Cursor-Specific Real-Time Evolution Detection

### Your Real-Time Capabilities
- **Interface Patterns**: ${this.cursorProfile.interface.patterns.join(', ')}
- **Real-Time Detection**: ${this.cursorProfile.interface.realTimeDetection.enabled ? 'Enabled' : 'Disabled'}
- **Visual Feedback**: Integrated with Cursor's interface for immediate response
- **Session Analysis**: Multi-turn conversation pattern recognition

### Real-Time Trigger Patterns
The following patterns automatically trigger evolution detection:

\`\`\`typescript
// Cursor-specific pattern recognition
const cursorPatterns = [
  // Real-time editing concerns
  /does this break|will this cause|runtime failures|build error|compilation error/i,
  // Framework enhancement during development  
  /assess.*pitfall|enhance.*framework.*guard|gaps in|constitutional.*safeguards/i,
  // Documentation needs during coding
  /should.*document.*somehow|systematic.*way|evolution.*stor(y|ies)|meta.*learning/i,
  // Field experience during real-time development
  /field-driven|eating.*dog food|real.*world.*usage|migration.*pitfall/i,
  // Cursor-specific interface patterns
  /cursor.*interface|real.*time.*feedback|visual.*pattern/i
];
\`\`\`

### Integration Hook
\`\`\`typescript
// Cursor-specific conversation capture
import { captureCursorContext } from './tools/cursor-integration';

// Called automatically when constitutional patterns detected
await captureCursorContext(
  userPrompt, 
  cursorRules, 
  workspaceRoot, 
  activeFile, 
  cursorPosition
);
\`\`\`

### Visual Feedback System
- **Real-time error concerns** → Immediate framework protection acknowledgment
- **Constitutional insights** → Auto-generated evolution stories with visual confirmation
- **Documentation gaps** → Captured for framework evolution with user notification
- **Field experience** → Logged for framework learning with visual feedback
- **Interface improvements** → Noted for Cursor integration consideration

### Response Guidelines for Cursor
When users express concerns about:
1. **Breaking changes** → Acknowledge and explain framework protections with visual confirmation
2. **Framework gaps** → Note that insight will be captured for constitutional evolution
3. **Documentation needs** → Mention automatic evolution story system
4. **Field friction** → Emphasize that experience feeds framework learning
5. **Interface improvements** → Log for Cursor integration consideration

### Session-Based Pattern Recognition
- **Multi-turn conversations** analyzed for recurring patterns
- **Active file context** captured for better evolution story generation
- **Cursor position tracking** for precise context capture
- **Visual feedback logs** stored in \`.aegis/cursor-feedback/\`

### Cursor-Specific Output Management
Store AI agent outputs as:
- \`output.lean.json\` - minimal implementation (Cursor-optimized)
- \`output.strict.json\` - full schema compliance with visual feedback
- \`output.full.json\` - generative/creative mode with interface patterns
`;
  }

  public async generateInstructions(): Promise<void> {
    const sections = this.renderSections();
    const mainTemplate = this.loadMainTemplate();
    
    // Add Cursor-specific section
    sections.cursorSpecific = this.generateCursorSpecificSection();
    
    // Create custom template with Cursor-specific section
    const customTemplate = mainTemplate.replace(
      '<%- sections.decisionMatrix %>',
      '<%- sections.decisionMatrix %>\n\n<%- sections.cursorSpecific %>'
    );
    
    const output = ejs.render(customTemplate, {
      agent: this.cursorProfile,
      frameworkVersion: this.currentVersion,
      lastUpdated: new Date().toISOString(),
      sections,
      projectStandards: null
    });

    // Ensure output directory exists
    const outputDir = path.join(this.frameworkRoot, 'framework', 'generated', 'instructions', 'current');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outPath = path.join(outputDir, 'cursor-ready.md');
    fs.writeFileSync(outPath, output);
    
    console.log(`✅ Generated Cursor-specific instructions: ${outPath}`);
    console.log(`🎨 Real-time detection: ${this.cursorProfile.interface.realTimeDetection.enabled ? 'Enabled' : 'Disabled'}`);
    console.log(`🔍 Pattern recognition: ${this.cursorProfile.interface.realTimeDetection.patterns.length} patterns`);
    console.log(`🎯 Visual feedback: Integrated with Cursor interface`);
  }
}

// CLI interface
async function main() {
  try {
    const generator = new CursorInstructionGenerator();
    await generator.generateInstructions();
  } catch (error) {
    console.error(`❌ Failed to generate Cursor instructions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
}

// Check if this is the main module
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
