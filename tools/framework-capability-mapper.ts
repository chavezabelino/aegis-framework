#!/usr/bin/env node

/**
 * @aegisFrameworkVersion: 2.5.0
 * @intent: Live capability mapping system that auto-discovers framework features
 * @context: Solves observability debt by providing real-time capability inventory
 * @mode: strict
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface FrameworkCapability {
  id: string;
  name: string;
  category: 'core' | 'governance' | 'safeguard' | 'tool' | 'integration' | 'experimental';
  status: 'stable' | 'beta' | 'alpha' | 'deprecated' | 'experimental';
  description: string;
  implementation: string[];
  dependencies: string[];
  usageExample?: string;
  documentation?: string;
  blueprint?: string;
  lastModified: Date;
  codeSignature: string;
}

interface CapabilityMap {
  generated: Date;
  frameworkVersion: string;
  totalCapabilities: number;
  categories: Record<string, FrameworkCapability[]>;
  executionPaths: Record<string, string[]>;
  healthStatus: 'healthy' | 'warnings' | 'issues';
  issues: string[];
}

export class FrameworkCapabilityMapper {
  private projectRoot: string;
  private capabilities: Map<string, FrameworkCapability> = new Map();
  private frameworkVersion: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.frameworkVersion = this.getFrameworkVersion();
  }

  /**
   * Discover all framework capabilities from codebase
   */
  async discoverCapabilities(): Promise<CapabilityMap> {
    console.log('🔍 Discovering framework capabilities...');

    // Clear existing capabilities
    this.capabilities.clear();

    // Discover capabilities from different sources
    await this.discoverFromTools();
    await this.discoverFromFrameworkCore();
    await this.discoverFromGovernance();
    await this.discoverFromBlueprints();
    await this.discoverFromCLI();

    // Generate capability map
    const map = this.generateCapabilityMap();

    console.log(
      `✅ Discovered ${map.totalCapabilities} capabilities across ${Object.keys(map.categories).length} categories`
    );

    return map;
  }

  /**
   * Discover capabilities from tools directory
   */
  private async discoverFromTools(): Promise<void> {
    const toolsDir = path.join(this.projectRoot, 'tools');
    const toolFiles = this.getTypeScriptFiles(toolsDir);

    for (const file of toolFiles) {
      const capability = await this.analyzeToolFile(file);
      if (capability) {
        this.capabilities.set(capability.id, capability);
      }
    }
  }

  /**
   * Discover capabilities from framework core
   */
  private async discoverFromFrameworkCore(): Promise<void> {
    const frameworkDir = path.join(this.projectRoot, 'framework');
    const coreFiles = this.getTypeScriptFiles(frameworkDir);

    for (const file of coreFiles) {
      const capability = await this.analyzeFrameworkFile(file);
      if (capability) {
        this.capabilities.set(capability.id, capability);
      }
    }
  }

  /**
   * Discover governance capabilities
   */
  private async discoverFromGovernance(): Promise<void> {
    const governanceDir = path.join(this.projectRoot, 'framework/governance');
    if (!fs.existsSync(governanceDir)) return;

    const govFiles = this.getTypeScriptFiles(governanceDir);

    for (const file of govFiles) {
      const capability = await this.analyzeGovernanceFile(file);
      if (capability) {
        this.capabilities.set(capability.id, capability);
      }
    }
  }

  /**
   * Discover capabilities from blueprints
   */
  private async discoverFromBlueprints(): Promise<void> {
    const blueprintsDir = path.join(this.projectRoot, 'blueprints');
    if (!fs.existsSync(blueprintsDir)) return;

    const blueprintDirs = fs
      .readdirSync(blueprintsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const dir of blueprintDirs) {
      const capability = await this.analyzeBlueprintDir(path.join(blueprintsDir, dir));
      if (capability) {
        this.capabilities.set(capability.id, capability);
      }
    }
  }

  /**
   * Discover CLI capabilities
   */
  private async discoverFromCLI(): Promise<void> {
    const cliDir = path.join(this.projectRoot, 'cli');
    const cliFiles = this.getTypeScriptFiles(cliDir);

    for (const file of cliFiles) {
      const capability = await this.analyzeCLIFile(file);
      if (capability) {
        this.capabilities.set(capability.id, capability);
      }
    }
  }

  /**
   * Analyze a tool file for capabilities
   */
  private async analyzeToolFile(filePath: string): Promise<FrameworkCapability | null> {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath, '.ts');

    // Extract metadata from file header
    const metadata = this.extractFileMetadata(content);
    if (!metadata.intent) return null;

    // Analyze exports and classes
    const exports = this.extractExports(content);
    const classes = this.extractClasses(content);

    const stats = fs.statSync(filePath);

    return {
      id: `tool-${fileName}`,
      name: this.humanizeFileName(fileName),
      category: 'tool',
      status: this.determineStatus(metadata, content),
      description: metadata.intent || `Tool: ${fileName}`,
      implementation: [filePath],
      dependencies: this.extractDependencies(content),
      usageExample: this.extractUsageExample(content),
      documentation: this.findDocumentation(fileName),
      blueprint: metadata.blueprint,
      lastModified: stats.mtime,
      codeSignature: this.generateCodeSignature(content),
    };
  }

  /**
   * Analyze a framework core file
   */
  private async analyzeFrameworkFile(filePath: string): Promise<FrameworkCapability | null> {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath, '.ts');

    const metadata = this.extractFileMetadata(content);
    if (!metadata.intent) return null;

    const stats = fs.statSync(filePath);

    return {
      id: `framework-${fileName}`,
      name: this.humanizeFileName(fileName),
      category: 'core',
      status: this.determineStatus(metadata, content),
      description: metadata.intent || `Framework component: ${fileName}`,
      implementation: [filePath],
      dependencies: this.extractDependencies(content),
      documentation: this.findDocumentation(fileName),
      blueprint: metadata.blueprint,
      lastModified: stats.mtime,
      codeSignature: this.generateCodeSignature(content),
    };
  }

  /**
   * Analyze a governance file
   */
  private async analyzeGovernanceFile(filePath: string): Promise<FrameworkCapability | null> {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath, '.ts');

    const metadata = this.extractFileMetadata(content);
    if (!metadata.intent) return null;

    const stats = fs.statSync(filePath);

    return {
      id: `governance-${fileName}`,
      name: this.humanizeFileName(fileName),
      category: 'governance',
      status: this.determineStatus(metadata, content),
      description: metadata.intent || `Governance component: ${fileName}`,
      implementation: [filePath],
      dependencies: this.extractDependencies(content),
      documentation: this.findDocumentation(fileName),
      blueprint: metadata.blueprint,
      lastModified: stats.mtime,
      codeSignature: this.generateCodeSignature(content),
    };
  }

  /**
   * Analyze a blueprint directory
   */
  private async analyzeBlueprintDir(dirPath: string): Promise<FrameworkCapability | null> {
    const blueprintFile = path.join(dirPath, 'blueprint.yaml');
    if (!fs.existsSync(blueprintFile)) return null;

    const content = fs.readFileSync(blueprintFile, 'utf8');
    const dirName = path.basename(dirPath);

    // Parse YAML for blueprint metadata
    const metadata = this.parseBlueprintYAML(content);
    const stats = fs.statSync(blueprintFile);

    return {
      id: `blueprint-${dirName}`,
      name: metadata.name || this.humanizeFileName(dirName),
      category: 'integration',
      status: metadata.status || 'stable',
      description: metadata.description || `Blueprint: ${dirName}`,
      implementation: [blueprintFile],
      dependencies: metadata.dependencies || [],
      documentation: this.findDocumentation(dirName),
      blueprint: blueprintFile,
      lastModified: stats.mtime,
      codeSignature: this.generateCodeSignature(content),
    };
  }

  /**
   * Analyze a CLI file
   */
  private async analyzeCLIFile(filePath: string): Promise<FrameworkCapability | null> {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath, '.ts');

    const metadata = this.extractFileMetadata(content);
    if (!metadata.intent) return null;

    const stats = fs.statSync(filePath);

    return {
      id: `cli-${fileName}`,
      name: this.humanizeFileName(fileName),
      category: 'tool',
      status: this.determineStatus(metadata, content),
      description: metadata.intent || `CLI tool: ${fileName}`,
      implementation: [filePath],
      dependencies: this.extractDependencies(content),
      usageExample: this.extractCLIUsage(content),
      documentation: this.findDocumentation(fileName),
      blueprint: metadata.blueprint,
      lastModified: stats.mtime,
      codeSignature: this.generateCodeSignature(content),
    };
  }

  /**
   * Extract metadata from file header comments
   */
  private extractFileMetadata(content: string): any {
    const metadata: any = {};

    const lines = content.split('\n').slice(0, 20); // Check first 20 lines

    for (const line of lines) {
      const intentMatch = line.match(/@intent:\s*(.+)/);
      if (intentMatch) {
        metadata.intent = intentMatch[1].trim();
      }

      const contextMatch = line.match(/@context:\s*(.+)/);
      if (contextMatch) {
        metadata.context = contextMatch[1].trim();
      }

      const blueprintMatch = line.match(/@aegisBlueprint:\s*(.+)/);
      if (blueprintMatch) {
        metadata.blueprint = blueprintMatch[1].trim();
      }

      const modeMatch = line.match(/@mode:\s*(.+)/);
      if (modeMatch) {
        metadata.mode = modeMatch[1].trim();
      }
    }

    return metadata;
  }

  /**
   * Extract exports from file content
   */
  private extractExports(content: string): string[] {
    const exports: string[] = [];
    const exportMatches = content.match(/export\s+(class|function|interface|type|const)\s+(\w+)/g);

    if (exportMatches) {
      for (const match of exportMatches) {
        const nameMatch = match.match(/export\s+(?:class|function|interface|type|const)\s+(\w+)/);
        if (nameMatch) {
          exports.push(nameMatch[1]);
        }
      }
    }

    return exports;
  }

  /**
   * Extract class names from content
   */
  private extractClasses(content: string): string[] {
    const classes: string[] = [];
    const classMatches = content.match(/class\s+(\w+)/g);

    if (classMatches) {
      for (const match of classMatches) {
        const nameMatch = match.match(/class\s+(\w+)/);
        if (nameMatch) {
          classes.push(nameMatch[1]);
        }
      }
    }

    return classes;
  }

  /**
   * Extract dependencies from import statements
   */
  private extractDependencies(content: string): string[] {
    const dependencies: string[] = [];
    const importMatches = content.match(/import.*from\s+['"]([^'"]+)['"]/g);

    if (importMatches) {
      for (const match of importMatches) {
        const pathMatch = match.match(/from\s+['"]([^'"]+)['"]/);
        if (pathMatch) {
          const importPath = pathMatch[1];
          if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
            dependencies.push(importPath);
          }
        }
      }
    }

    return dependencies;
  }

  /**
   * Extract usage example from comments or main function
   */
  private extractUsageExample(content: string): string | undefined {
    // Look for usage examples in comments
    const usageMatch = content.match(/\/\*\*[\s\S]*?Usage:?\s*\n([\s\S]*?)\*\//);
    if (usageMatch) {
      return usageMatch[1].trim();
    }

    // Look for main function
    const mainMatch = content.match(/async function main\(\)[^{]*{([\s\S]*?)^}/m);
    if (mainMatch) {
      return `// Example usage:\n${mainMatch[1].slice(0, 300)}...`;
    }

    return undefined;
  }

  /**
   * Extract CLI usage from help text or main function
   */
  private extractCLIUsage(content: string): string | undefined {
    // Look for usage patterns
    const usagePatterns = [/Usage:\s*(.+)/, /console\.log\(['"]Usage[^'"]*['"][^)]*\)/, /aegis-\w+.*</];

    for (const pattern of usagePatterns) {
      const match = content.match(pattern);
      if (match) {
        return match[1] || match[0];
      }
    }

    return undefined;
  }

  /**
   * Determine capability status from metadata and content
   */
  private determineStatus(metadata: any, content: string): FrameworkCapability['status'] {
    // Check for explicit status markers
    if (content.includes('experimental') || content.includes('EXPERIMENTAL')) {
      return 'experimental';
    }

    if (content.includes('alpha') || content.includes('ALPHA')) {
      return 'alpha';
    }

    if (content.includes('beta') || content.includes('BETA')) {
      return 'beta';
    }

    if (content.includes('deprecated') || content.includes('DEPRECATED')) {
      return 'deprecated';
    }

    // Check mode for stability
    if (metadata.mode === 'strict') {
      return 'stable';
    }

    return 'stable'; // Default to stable
  }

  /**
   * Find related documentation
   */
  private findDocumentation(fileName: string): string | undefined {
    const docPatterns = [
      `docs/implementation/${fileName}.md`,
      `docs/implementation/${fileName}-*.md`,
      `docs/${fileName}.md`,
      `README.md`,
    ];

    for (const pattern of docPatterns) {
      const fullPath = path.join(this.projectRoot, pattern);
      if (fs.existsSync(fullPath)) {
        return pattern;
      }
    }

    return undefined;
  }

  /**
   * Parse blueprint YAML for metadata
   */
  private parseBlueprintYAML(content: string): any {
    const metadata: any = {};

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

      const statusMatch = line.match(/status:\s*(.+)/);
      if (statusMatch) {
        metadata.status = statusMatch[1].trim().replace(/['"]/g, '');
      }
    }

    return metadata;
  }

  /**
   * Generate capability map
   */
  private generateCapabilityMap(): CapabilityMap {
    const categories: Record<string, FrameworkCapability[]> = {};
    const issues: string[] = [];

    // Group capabilities by category
    for (const capability of this.capabilities.values()) {
      if (!categories[capability.category]) {
        categories[capability.category] = [];
      }
      categories[capability.category].push(capability);

      // Check for issues
      if (capability.status === 'deprecated') {
        issues.push(`${capability.name} is deprecated`);
      }

      if (!capability.documentation) {
        issues.push(`${capability.name} has no documentation`);
      }
    }

    // Sort categories
    for (const category in categories) {
      categories[category].sort((a, b) => a.name.localeCompare(b.name));
    }

    return {
      generated: new Date(),
      frameworkVersion: this.frameworkVersion,
      totalCapabilities: this.capabilities.size,
      categories,
      executionPaths: this.generateExecutionPaths(),
      healthStatus: issues.length === 0 ? 'healthy' : issues.length < 5 ? 'warnings' : 'issues',
      issues,
    };
  }

  /**
   * Generate execution paths for capabilities
   */
  private generateExecutionPaths(): Record<string, string[]> {
    const paths: Record<string, string[]> = {};

    for (const capability of this.capabilities.values()) {
      paths[capability.id] = capability.implementation;
    }

    return paths;
  }

  /**
   * Get framework version
   */
  private getFrameworkVersion(): string {
    try {
      const versionFile = path.join(this.projectRoot, 'VERSION');
      if (fs.existsSync(versionFile)) {
        return fs.readFileSync(versionFile, 'utf8').trim();
      }

      const packageFile = path.join(this.projectRoot, 'package.json');
      if (fs.existsSync(packageFile)) {
        const pkg = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
        return pkg.version;
      }
    } catch (error) {
      // Ignore errors
    }

    return 'unknown';
  }

  /**
   * Get TypeScript files from directory
   */
  private getTypeScriptFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];

    const files: string[] = [];

    function walkDir(currentDir: string) {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          walkDir(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
          files.push(fullPath);
        }
      }
    }

    walkDir(dir);
    return files;
  }

  /**
   * Humanize file name for display
   */
  private humanizeFileName(fileName: string): string {
    return fileName
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Generate code signature for change detection
   */
  private generateCodeSignature(content: string): string {
    // Simple hash of key elements
    const keyElements = [
      content.match(/export\s+(class|function|interface)/g)?.join(''),
      content.match(/@intent:\s*(.+)/)?.[1],
      content.match(/\/\*\*[\s\S]*?\*\//)?.[0],
    ]
      .filter(Boolean)
      .join('|');

    return Buffer.from(keyElements).toString('base64').slice(0, 16);
  }

  /**
   * Save capability map to file
   */
  async saveCapabilityMap(map: CapabilityMap, outputPath?: string): Promise<string> {
    const filePath = outputPath || path.join(this.projectRoot, '.framework/capability-map.json');

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(map, null, 2));

    console.log(`💾 Capability map saved to ${filePath}`);
    return filePath;
  }

  /**
   * Generate markdown report
   */
  generateMarkdownReport(map: CapabilityMap): string {
    let markdown = `# Aegis Framework Capability Map\n\n`;
    markdown += `**Generated**: ${map.generated.toISOString()}\n`;
    markdown += `**Framework Version**: ${map.frameworkVersion}\n`;
    markdown += `**Total Capabilities**: ${map.totalCapabilities}\n`;
    markdown += `**Health Status**: ${map.healthStatus.toUpperCase()}\n\n`;

    if (map.issues.length > 0) {
      markdown += `## Issues\n\n`;
      for (const issue of map.issues) {
        markdown += `- ⚠️ ${issue}\n`;
      }
      markdown += `\n`;
    }

    for (const [category, capabilities] of Object.entries(map.categories)) {
      markdown += `## ${category.toUpperCase()} (${capabilities.length})\n\n`;

      for (const capability of capabilities) {
        markdown += `### ${capability.name}\n\n`;
        markdown += `**Status**: ${capability.status}\n`;
        markdown += `**Description**: ${capability.description}\n`;
        markdown += `**Implementation**: ${capability.implementation.join(', ')}\n`;

        if (capability.dependencies.length > 0) {
          markdown += `**Dependencies**: ${capability.dependencies.join(', ')}\n`;
        }

        if (capability.documentation) {
          markdown += `**Documentation**: [${capability.documentation}](${capability.documentation})\n`;
        }

        if (capability.usageExample) {
          markdown += `**Usage**:\n\`\`\`\n${capability.usageExample}\n\`\`\`\n`;
        }

        markdown += `**Last Modified**: ${capability.lastModified.toISOString()}\n\n`;
      }
    }

    return markdown;
  }
}

/**
 * CLI interface
 */
async function main() {
  const mapper = new FrameworkCapabilityMapper();

  console.log('🧠 Aegis Framework Capability Mapper');
  console.log('=====================================\n');

  try {
    const map = await mapper.discoverCapabilities();

    // Save JSON map
    const jsonPath = await mapper.saveCapabilityMap(map);

    // Generate and save markdown report
    const markdown = mapper.generateMarkdownReport(map);
    const markdownPath = path.join(process.cwd(), '.framework/capability-map.md');
    fs.writeFileSync(markdownPath, markdown);

    console.log(`📊 Framework Capability Summary:`);
    console.log(`   Total Capabilities: ${map.totalCapabilities}`);
    console.log(`   Categories: ${Object.keys(map.categories).length}`);
    console.log(`   Health Status: ${map.healthStatus.toUpperCase()}`);

    if (map.issues.length > 0) {
      console.log(`   Issues: ${map.issues.length}`);
    }

    console.log(`\n📄 Reports generated:`);
    console.log(`   JSON: ${jsonPath}`);
    console.log(`   Markdown: ${markdownPath}`);

    // Show category breakdown
    console.log(`\n📋 Category Breakdown:`);
    for (const [category, capabilities] of Object.entries(map.categories)) {
      console.log(`   ${category}: ${capabilities.length} capabilities`);
    }
  } catch (error) {
    console.error('❌ Failed to map capabilities:', error);
    process.exit(1);
  }
}

// Run if this is the main module
if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}
