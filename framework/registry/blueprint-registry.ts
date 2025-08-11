#!/usr/bin/env node

/**
 * @aegisFrameworkVersion: 2.5.0
 * @intent: Single source of truth blueprint registry for framework features
 * @context: Centralizes feature descriptions to prevent documentation drift
 * @mode: strict
 */

import fs from 'fs';
import path from 'path';
import { trace } from '../observability/execution-trace-hooks.ts';

interface BlueprintMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  category: 'core' | 'tool' | 'governance' | 'integration' | 'experimental';
  status: 'stable' | 'beta' | 'alpha' | 'deprecated';
  implementation: string[];
  dependencies: string[];
  documentation: string[];
  usageExamples: string[];
  author?: string;
  created: Date;
  lastModified: Date;
  tags: string[];
  codeReferences: CodeReference[];
  testCoverage?: TestCoverage;
}

interface CodeReference {
  file: string;
  line?: number;
  function?: string;
  class?: string;
  description: string;
}

interface TestCoverage {
  hasTests: boolean;
  testFiles: string[];
  coverage: number; // percentage
}

interface RegistryIndex {
  version: string;
  generated: Date;
  blueprints: BlueprintMetadata[];
  categories: Record<string, string[]>;
  tags: Record<string, string[]>;
  totalBlueprints: number;
}

export class BlueprintRegistry {
  private static instance: BlueprintRegistry;
  private projectRoot: string;
  private registryFile: string;
  private blueprintsDir: string;
  private blueprints: Map<string, BlueprintMetadata> = new Map();

  private constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.blueprintsDir = path.join(projectRoot, 'blueprints');
    this.registryFile = path.join(projectRoot, '.framework/blueprint-registry.json');

    // Ensure directories exist
    if (!fs.existsSync(this.blueprintsDir)) {
      fs.mkdirSync(this.blueprintsDir, { recursive: true });
    }

    const registryDir = path.dirname(this.registryFile);
    if (!fs.existsSync(registryDir)) {
      fs.mkdirSync(registryDir, { recursive: true });
    }

    this.loadRegistry();
  }

  /**
   * Get singleton instance
   */
  static getInstance(projectRoot?: string): BlueprintRegistry {
    if (!BlueprintRegistry.instance) {
      BlueprintRegistry.instance = new BlueprintRegistry(projectRoot);
    }
    return BlueprintRegistry.instance;
  }

  /**
   * Register a new blueprint
   */
  register(blueprint: Partial<BlueprintMetadata>): BlueprintMetadata {
    const traceCtx = trace(
      'blueprint-registry',
      'register',
      'registerBlueprint',
      { id: blueprint.id },
      blueprint.id,
      'docs/implementation/blueprint-registry.md'
    );

    try {
      if (!blueprint.id || !blueprint.name) {
        throw new Error('Blueprint ID and name are required');
      }

      const metadata: BlueprintMetadata = {
        id: blueprint.id,
        name: blueprint.name,
        version: blueprint.version || '1.0.0',
        description: blueprint.description || '',
        category: blueprint.category || 'experimental',
        status: blueprint.status || 'alpha',
        implementation: blueprint.implementation || [],
        dependencies: blueprint.dependencies || [],
        documentation: blueprint.documentation || [],
        usageExamples: blueprint.usageExamples || [],
        author: blueprint.author,
        created: blueprint.created || new Date(),
        lastModified: new Date(),
        tags: blueprint.tags || [],
        codeReferences: blueprint.codeReferences || [],
        testCoverage: blueprint.testCoverage,
      };

      this.blueprints.set(blueprint.id, metadata);
      this.saveRegistry();

      console.log(`📋 Blueprint registered: ${metadata.name} (${metadata.id})`);
      traceCtx.complete(metadata);
      return metadata;
    } catch (error) {
      traceCtx.error(error);
      throw error;
    }
  }

  /**
   * Get blueprint by ID
   */
  get(id: string): BlueprintMetadata | null {
    return this.blueprints.get(id) || null;
  }

  /**
   * Get all blueprints
   */
  getAll(): BlueprintMetadata[] {
    return Array.from(this.blueprints.values());
  }

  /**
   * Get blueprints by category
   */
  getByCategory(category: string): BlueprintMetadata[] {
    return this.getAll().filter(bp => bp.category === category);
  }

  /**
   * Get blueprints by status
   */
  getByStatus(status: string): BlueprintMetadata[] {
    return this.getAll().filter(bp => bp.status === status);
  }

  /**
   * Search blueprints
   */
  search(query: string): BlueprintMetadata[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getAll().filter(
      bp =>
        bp.name.toLowerCase().includes(lowercaseQuery) ||
        bp.description.toLowerCase().includes(lowercaseQuery) ||
        bp.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  /**
   * Auto-discover blueprints from filesystem
   */
  async discover(): Promise<void> {
    const traceCtx = trace(
      'blueprint-registry',
      'discover',
      'discoverBlueprints',
      {},
      undefined,
      'docs/implementation/blueprint-registry.md'
    );

    try {
      console.log('🔍 Discovering blueprints from filesystem...');

      let discovered = 0;

      // Discover from blueprints directory
      if (fs.existsSync(this.blueprintsDir)) {
        const blueprintDirs = fs
          .readdirSync(this.blueprintsDir, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory());

        for (const dir of blueprintDirs) {
          const blueprintPath = path.join(this.blueprintsDir, dir.name);
          const yamlFile = path.join(blueprintPath, 'blueprint.yaml');

          if (fs.existsSync(yamlFile)) {
            const blueprint = await this.parseYamlBlueprint(yamlFile);
            if (blueprint) {
              this.register(blueprint);
              discovered++;
            }
          }
        }
      }

      // Discover from code annotations
      await this.discoverFromCodeAnnotations();

      console.log(`✅ Discovered ${discovered} blueprints`);
      traceCtx.complete({ discovered });
    } catch (error) {
      traceCtx.error(error);
      throw error;
    }
  }

  /**
   * Generate registry index
   */
  generateIndex(): RegistryIndex {
    const blueprints = this.getAll();
    const categories: Record<string, string[]> = {};
    const tags: Record<string, string[]> = {};

    for (const bp of blueprints) {
      // Group by category
      if (!categories[bp.category]) {
        categories[bp.category] = [];
      }
      categories[bp.category].push(bp.id);

      // Group by tags
      for (const tag of bp.tags) {
        if (!tags[tag]) {
          tags[tag] = [];
        }
        tags[tag].push(bp.id);
      }
    }

    return {
      version: this.getFrameworkVersion(),
      generated: new Date(),
      blueprints,
      categories,
      tags,
      totalBlueprints: blueprints.length,
    };
  }

  /**
   * Export registry to markdown
   */
  exportToMarkdown(): string {
    const index = this.generateIndex();

    let markdown = `# Blueprint Registry\n\n`;
    markdown += `**Generated**: ${index.generated.toISOString()}\n`;
    markdown += `**Framework Version**: ${index.version}\n`;
    markdown += `**Total Blueprints**: ${index.totalBlueprints}\n\n`;

    // Categories
    for (const [category, ids] of Object.entries(index.categories)) {
      markdown += `## ${category.toUpperCase()}\n\n`;

      for (const id of ids) {
        const bp = this.get(id)!;
        markdown += `### ${bp.name}\n\n`;
        markdown += `**ID**: \`${bp.id}\`\n`;
        markdown += `**Version**: ${bp.version}\n`;
        markdown += `**Status**: ${bp.status}\n`;
        markdown += `**Description**: ${bp.description}\n`;

        if (bp.implementation.length > 0) {
          markdown += `**Implementation**: ${bp.implementation.join(', ')}\n`;
        }

        if (bp.dependencies.length > 0) {
          markdown += `**Dependencies**: ${bp.dependencies.join(', ')}\n`;
        }

        if (bp.documentation.length > 0) {
          markdown += `**Documentation**: ${bp.documentation.map(doc => `[${path.basename(doc)}](${doc})`).join(', ')}\n`;
        }

        if (bp.tags.length > 0) {
          markdown += `**Tags**: ${bp.tags.join(', ')}\n`;
        }

        markdown += `**Last Modified**: ${bp.lastModified.toISOString()}\n\n`;
      }
    }

    return markdown;
  }

  /**
   * Validate blueprint consistency
   */
  validate(): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    for (const bp of this.getAll()) {
      // Check required fields
      if (!bp.name) {
        issues.push(`Blueprint ${bp.id} missing name`);
      }

      if (!bp.description) {
        issues.push(`Blueprint ${bp.id} missing description`);
      }

      // Check implementation files exist
      for (const impl of bp.implementation) {
        const fullPath = path.isAbsolute(impl) ? impl : path.join(this.projectRoot, impl);
        if (!fs.existsSync(fullPath)) {
          issues.push(`Blueprint ${bp.id} references non-existent file: ${impl}`);
        }
      }

      // Check documentation files exist
      for (const doc of bp.documentation) {
        const fullPath = path.isAbsolute(doc) ? doc : path.join(this.projectRoot, doc);
        if (!fs.existsSync(fullPath)) {
          issues.push(`Blueprint ${bp.id} references non-existent documentation: ${doc}`);
        }
      }
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }

  /**
   * Private helper methods
   */
  private async parseYamlBlueprint(yamlFile: string): Promise<Partial<BlueprintMetadata> | null> {
    try {
      const content = fs.readFileSync(yamlFile, 'utf8');
      const dirName = path.basename(path.dirname(yamlFile));

      // Simple YAML parsing for blueprint metadata
      const metadata: Partial<BlueprintMetadata> = {
        id: dirName,
      };

      const lines = content.split('\n');
      for (const line of lines) {
        const nameMatch = line.match(/name:\s*(.+)/);
        if (nameMatch) {
          metadata.name = nameMatch[1].trim().replace(/['"]/g, '');
        }

        const descMatch = line.match(/description:\s*(.+)/);
        if (descMatch) {
          metadata.description = descMatch[1].trim().replace(/['"]/g, '');
        }

        const versionMatch = line.match(/version:\s*(.+)/);
        if (versionMatch) {
          metadata.version = versionMatch[1].trim().replace(/['"]/g, '');
        }

        const statusMatch = line.match(/status:\s*(.+)/);
        if (statusMatch) {
          metadata.status = statusMatch[1].trim().replace(/['"]/g, '') as any;
        }
      }

      metadata.implementation = [yamlFile];
      metadata.category = 'integration';

      const stats = fs.statSync(yamlFile);
      metadata.lastModified = stats.mtime;

      return metadata;
    } catch (error) {
      console.warn(`Failed to parse blueprint YAML: ${yamlFile}`, error);
      return null;
    }
  }

  private async discoverFromCodeAnnotations(): Promise<void> {
    // Discover blueprints from @aegisBlueprint annotations in code
    const codeFiles = this.getCodeFiles();

    for (const file of codeFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const blueprintMatches = content.match(/@aegisBlueprint:\s*(.+)/g);

        if (blueprintMatches) {
          for (const match of blueprintMatches) {
            const blueprintId = match.replace('@aegisBlueprint:', '').trim();

            // Extract intent as description
            const intentMatch = content.match(/@intent:\s*(.+)/);
            const description = intentMatch ? intentMatch[1].trim() : '';

            // Check if blueprint already exists
            if (!this.get(blueprintId)) {
              const blueprint: Partial<BlueprintMetadata> = {
                id: blueprintId,
                name: this.humanizeId(blueprintId),
                description,
                category: 'experimental',
                status: 'alpha',
                implementation: [file],
                codeReferences: [
                  {
                    file,
                    description: 'Blueprint annotation found in code',
                  },
                ],
              };

              this.register(blueprint);
            }
          }
        }
      } catch (error) {
        // Ignore file reading errors
      }
    }
  }

  private getCodeFiles(): string[] {
    const files: string[] = [];
    const extensions = ['.ts', '.js', '.tsx', '.jsx'];

    function walkDir(dir: string) {
      if (!fs.existsSync(dir)) return;

      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          walkDir(fullPath);
        } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    }

    walkDir(this.projectRoot);
    return files;
  }

  private humanizeId(id: string): string {
    return id
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
  }

  private getFrameworkVersion(): string {
    try {
      const versionFile = path.join(this.projectRoot, 'VERSION');
      if (fs.existsSync(versionFile)) {
        return fs.readFileSync(versionFile, 'utf8').trim();
      }
    } catch (error) {
      // Ignore errors
    }
    return 'unknown';
  }

  private loadRegistry(): void {
    try {
      if (fs.existsSync(this.registryFile)) {
        const data = fs.readFileSync(this.registryFile, 'utf8');
        const index: RegistryIndex = JSON.parse(data);

        for (const bp of index.blueprints) {
          this.blueprints.set(bp.id, {
            ...bp,
            created: new Date(bp.created),
            lastModified: new Date(bp.lastModified),
          });
        }

        console.log(`📋 Loaded ${this.blueprints.size} blueprints from registry`);
      }
    } catch (error) {
      console.warn('Failed to load blueprint registry:', error);
    }
  }

  private saveRegistry(): void {
    try {
      const index = this.generateIndex();
      fs.writeFileSync(this.registryFile, JSON.stringify(index, null, 2));
    } catch (error) {
      console.warn('Failed to save blueprint registry:', error);
    }
  }
}

/**
 * CLI interface
 */
async function main() {
  const registry = BlueprintRegistry.getInstance();
  const command = process.argv[2];

  switch (command) {
    case 'discover':
      await registry.discover();
      break;

    case 'list':
      const blueprints = registry.getAll();
      console.log(`📋 ${blueprints.length} blueprints found:`);
      for (const bp of blueprints) {
        console.log(`   ${bp.id}: ${bp.name} (${bp.status})`);
      }
      break;

    case 'export':
      const markdown = registry.exportToMarkdown();
      const exportPath = path.join(process.cwd(), '.framework/blueprint-registry.md');
      fs.writeFileSync(exportPath, markdown);
      console.log(`📄 Registry exported to: ${exportPath}`);
      break;

    case 'validate':
      const validation = registry.validate();
      if (validation.valid) {
        console.log('✅ All blueprints are valid');
      } else {
        console.log('❌ Blueprint validation issues:');
        for (const issue of validation.issues) {
          console.log(`   • ${issue}`);
        }
      }
      break;

    default:
      console.log('📋 Blueprint Registry');
      console.log('Usage:');
      console.log('  node blueprint-registry.ts discover  - Discover blueprints from filesystem');
      console.log('  node blueprint-registry.ts list     - List all blueprints');
      console.log('  node blueprint-registry.ts export   - Export to markdown');
      console.log('  node blueprint-registry.ts validate - Validate blueprint consistency');
  }
}

// Run if this is the main module
if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}
