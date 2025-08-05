#!/usr/bin/env node

/**
 * Aegis Framework Changelog Generator
 * 
 * This tool analyzes framework changes and generates meaningful changelog entries
 * based on the impact assessment framework defined in docs/evolution-strategy.md
 */

import fs from "fs";
import path from "path";
import yaml from "js-yaml";

interface ChangeAnalysis {
  type: 'breaking' | 'added' | 'enhanced' | 'infrastructure';
  category: string;
  description: string;
  impact: {
    agents: boolean;
    blueprints: boolean;
    users: boolean;
    migration: boolean;
    docs: boolean;
  };
  files: string[];
}

class ChangelogGenerator {
  private changes: ChangeAnalysis[] = [];
  private version: string;

  constructor(version: string) {
    this.version = version;
  }

  analyzeFileChanges(filePaths: string[]): ChangeAnalysis[] {
    const changes: ChangeAnalysis[] = [];

    filePaths.forEach(filePath => {
      if (filePath.includes('framework/framework-core')) {
        changes.push({
          type: 'breaking',
          category: 'Framework Foundation',
          description: `Updated core framework specification to ${this.version}`,
          impact: {
            agents: true,
            blueprints: true,
            users: true,
            migration: true,
            docs: true
          },
          files: [filePath]
        });
      }

      if (filePath.includes('blueprints/') && filePath.endsWith('.yaml')) {
        changes.push({
          type: 'enhanced',
          category: 'Blueprint Contracts',
          description: 'Updated blueprint examples for new version compatibility',
          impact: {
            agents: true,
            blueprints: true,
            users: false,
            migration: false,
            docs: true
          },
          files: [filePath]
        });
      }

      if (filePath.includes('tools/') || filePath.includes('cli/')) {
        changes.push({
          type: 'enhanced',
          category: 'Developer Tooling',
          description: 'Updated CLI and validation tools',
          impact: {
            agents: false,
            blueprints: false,
            users: true,
            migration: false,
            docs: true
          },
          files: [filePath]
        });
      }

      if (filePath.includes('.github/copilot-instructions.md')) {
        changes.push({
          type: 'enhanced',
          category: 'AI Agent Guidance',
          description: 'Updated agent instructions for new framework version',
          impact: {
            agents: true,
            blueprints: false,
            users: false,
            migration: false,
            docs: true
          },
          files: [filePath]
        });
      }
    });

    return changes;
  }

  generateChangelogEntry(changes: ChangeAnalysis[]): string {
    const sections = {
      breaking: [] as string[],
      added: [] as string[],
      enhanced: [] as string[],
      infrastructure: [] as string[]
    };

    changes.forEach(change => {
      const bullet = `- **${change.category}**: ${change.description}`;
      sections[change.type].push(bullet);
    });

    let changelog = `## [${this.version}] - ${new Date().toISOString().split('T')[0]}\n\n`;

    if (sections.breaking.length > 0) {
      changelog += `### Breaking Changes\n${sections.breaking.join('\n')}\n\n`;
    }

    if (sections.added.length > 0) {
      changelog += `### Added\n${sections.added.join('\n')}\n\n`;
    }

    if (sections.enhanced.length > 0) {
      changelog += `### Enhanced\n${sections.enhanced.join('\n')}\n\n`;
    }

    if (sections.infrastructure.length > 0) {
      changelog += `### Infrastructure\n${sections.infrastructure.join('\n')}\n\n`;
    }

    return changelog;
  }

  generateMigrationGuide(changes: ChangeAnalysis[]): string {
    const migrationNeeded = changes.filter(c => c.impact.migration);
    
    if (migrationNeeded.length === 0) {
      return "No migration required for this version.\n";
    }

    let guide = `# Migration Guide to ${this.version}\n\n`;
    
    migrationNeeded.forEach(change => {
      guide += `## ${change.category}\n`;
      guide += `${change.description}\n\n`;
      guide += `**Files affected**: ${change.files.join(', ')}\n\n`;
      
      if (change.type === 'breaking') {
        guide += `⚠️ **Breaking Change**: This requires manual updates to existing projects.\n\n`;
      }
    });

    return guide;
  }
}

// CLI Usage
const [,, version, ...filePaths] = process.argv;

if (!version) {
  console.error("Usage: node generate-changelog.ts <version> [file1] [file2] ...");
  console.error("Example: node generate-changelog.ts 1.0.0-alpha framework/framework-core.md");
  process.exit(1);
}

const generator = new ChangelogGenerator(version);
const changes = generator.analyzeFileChanges(filePaths);
const changelogEntry = generator.generateChangelogEntry(changes);
const migrationGuide = generator.generateMigrationGuide(changes);

console.log("📝 Generated Changelog Entry:");
console.log("=" .repeat(50));
console.log(changelogEntry);

console.log("🔄 Migration Guide:");
console.log("=" .repeat(50));
console.log(migrationGuide);

export { ChangelogGenerator, ChangeAnalysis };
