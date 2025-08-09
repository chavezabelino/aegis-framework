#!/usr/bin/env node

/**
 * @aegisFrameworkVersion: 2.4.0
 * @intent: Instant framework orientation command that explains what Aegis does and how
 * @context: Solves observability debt by providing immediate framework understanding
 * @mode: strict
 */

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { FrameworkCapabilityMapper } from '../tools/framework-capability-mapper.ts';
import { TraceabilityGate } from './aegis-traceability-gate.js';

interface OrientationMode {
  mode: 'quick' | 'detailed' | 'category' | 'search' | 'health';
  target?: string;
}

class AegisOrientationCLI {
  private program: Command;
  private projectRoot: string;
  private mapper: FrameworkCapabilityMapper;

  constructor() {
    this.program = new Command();
    this.projectRoot = process.cwd();
    this.mapper = new FrameworkCapabilityMapper(this.projectRoot);
    this.setupCommands();
  }

  private setupCommands(): void {
    this.program
      .name('aegis-orient')
      .description('Instant Aegis Framework orientation and capability overview')
      .version(this.getFrameworkVersion());

    // Quick overview (default)
    this.program
      .command('quick', { isDefault: true })
      .description('Quick framework overview (default)')
      .action(() => this.runOrientation({ mode: 'quick' }));

    // Detailed overview
    this.program
      .command('detailed')
      .alias('full')
      .description('Detailed capability breakdown')
      .action(() => this.runOrientation({ mode: 'detailed' }));

    // Category-specific overview
    this.program
      .command('category <category>')
      .alias('cat')
      .description('Show capabilities in specific category (core, tool, governance, integration)')
      .action((category) => this.runOrientation({ mode: 'category', target: category }));

    // Search capabilities
    this.program
      .command('search <term>')
      .alias('find')
      .description('Search capabilities by name or description')
      .action((term) => this.runOrientation({ mode: 'search', target: term }));

    // Health check
    this.program
      .command('health')
      .alias('status')
      .description('Framework health status and issues')
      .action(() => this.runOrientation({ mode: 'health' }));

    // Constitutional traceability check
    this.program
      .command('trace')
      .description('Verify traceability of capability claims (Constitutional Article I §1)')
      .option('--strict', 'Fail on any violations', true)
      .option('--claims <path>', 'Path to capability claims file', '.aegis/capability-claims.yaml')
      .action(async (options) => {
        console.log(chalk.yellow('🏛️  Constitutional Traceability Gate'));
        console.log(chalk.gray('⚖️  Authority: CONSTITUTION.md Article I §1 (Traceability)\n'));
        
        const passed = await TraceabilityGate.enforceTraceability(options.claims);
        
        if (!passed) {
          console.error(chalk.red('\n🚨 CONSTITUTIONAL VIOLATION DETECTED'));
          console.error(chalk.red('Cannot proceed with unverifiable capability claims.'));
          process.exit(1);
        } else {
          console.log(chalk.green('\n✅ All capability claims constitutionally verified'));
        }
      });

    // Interactive mode
    this.program
      .command('interactive')
      .alias('i')
      .description('Interactive capability exploration')
      .action(() => this.runInteractiveMode());
  }

  private async runOrientation(options: OrientationMode): Promise<void> {
    try {
      console.log(chalk.blue.bold('\n🧭 Aegis Framework Orientation'));
      console.log(chalk.gray('='.repeat(50)));

      // Discover capabilities
      const map = await this.mapper.discoverCapabilities();

      switch (options.mode) {
        case 'quick':
          await this.showQuickOverview(map);
          break;
        case 'detailed':
          await this.showDetailedOverview(map);
          break;
        case 'category':
          await this.showCategoryOverview(map, options.target!);
          break;
        case 'search':
          await this.showSearchResults(map, options.target!);
          break;
        case 'health':
          await this.showHealthStatus(map);
          break;
      }

    } catch (error) {
      console.error(chalk.red('❌ Orientation failed:'), error);
      process.exit(1);
    }
  }

  private async showQuickOverview(map: any): Promise<void> {
    console.log(chalk.cyan('\n📊 Framework Summary'));
    console.log(`Version: ${chalk.yellow(map.frameworkVersion)}`);
    console.log(`Capabilities: ${chalk.yellow(map.totalCapabilities)}`);
    console.log(`Health: ${this.formatHealthStatus(map.healthStatus)}`);
    console.log(`Last Scan: ${chalk.gray(new Date(map.generated).toLocaleString())}`);

    console.log(chalk.cyan('\n🎯 What Aegis Does'));
    console.log('Aegis is a framework for AI-assisted engineering with:');
    console.log(`${chalk.green('•')} Constitutional governance patterns`);
    console.log(`${chalk.green('•')} Drift detection and prevention`);
    console.log(`${chalk.green('•')} Configuration management`);
    console.log(`${chalk.green('•')} Version consistency validation`);
    console.log(`${chalk.green('•')} Semantic interrupt handling`);

    console.log(chalk.cyan('\n📋 Capability Categories'));
    for (const [category, capabilities] of Object.entries(map.categories)) {
      const count = (capabilities as any[]).length;
      const icon = this.getCategoryIcon(category);
      console.log(`${icon} ${chalk.yellow(category)}: ${count} capabilities`);
    }

    console.log(chalk.cyan('\n🚀 Getting Started'));
    console.log(`${chalk.green('•')} View category details: ${chalk.yellow('aegis-orient category <name>')}`);
    console.log(`${chalk.green('•')} Search capabilities: ${chalk.yellow('aegis-orient search <term>')}`);
    console.log(`${chalk.green('•')} Detailed overview: ${chalk.yellow('aegis-orient detailed')}`);
    console.log(`${chalk.green('•')} Interactive mode: ${chalk.yellow('aegis-orient interactive')}`);
    console.log(`${chalk.green('•')} Health check: ${chalk.yellow('aegis-orient health')}`);

    if (map.issues.length > 0) {
      console.log(chalk.yellow(`\n⚠️  ${map.issues.length} issues detected. Run 'aegis-orient health' for details.`));
    }
  }

  private async showDetailedOverview(map: any): Promise<void> {
    console.log(chalk.cyan('\n📊 Detailed Framework Overview'));
    
    // Framework summary
    console.log(chalk.blue('\n🏛️ Framework Information'));
    console.log(`Version: ${chalk.yellow(map.frameworkVersion)}`);
    console.log(`Total Capabilities: ${chalk.yellow(map.totalCapabilities)}`);
    console.log(`Categories: ${chalk.yellow(Object.keys(map.categories).length)}`);
    console.log(`Health Status: ${this.formatHealthStatus(map.healthStatus)}`);
    console.log(`Generated: ${chalk.gray(new Date(map.generated).toLocaleString())}`);

    // Category breakdown with top capabilities
    for (const [category, capabilities] of Object.entries(map.categories)) {
      const caps = capabilities as any[];
      console.log(chalk.blue(`\n${this.getCategoryIcon(category)} ${category.toUpperCase()} (${caps.length})`));
      
      // Show top 5 capabilities in each category
      const topCaps = caps.slice(0, 5);
      for (const cap of topCaps) {
        const statusIcon = this.getStatusIcon(cap.status);
        console.log(`  ${statusIcon} ${chalk.yellow(cap.name)} - ${cap.description.slice(0, 80)}...`);
      }
      
      if (caps.length > 5) {
        console.log(chalk.gray(`  ... and ${caps.length - 5} more`));
      }
    }

    // Usage examples
    console.log(chalk.blue('\n🔧 Key Tools'));
    const keyTools = [
      'aegis-conductor',
      'team-config-loader',
      'intent-enforcement-engine',
      'validate-version-consistency',
      'semantic-interrupt-detector'
    ];

    for (const tool of keyTools) {
      const capability = this.findCapabilityByName(map, tool);
      if (capability) {
        console.log(`${chalk.green('•')} ${chalk.yellow(capability.name)}: ${capability.description}`);
      }
    }

    console.log(chalk.blue('\n📚 Next Steps'));
    console.log(`${chalk.green('•')} Explore a category: ${chalk.yellow('aegis-orient category <name>')}`);
    console.log(`${chalk.green('•')} Search for specific capability: ${chalk.yellow('aegis-orient search <term>')}`);
    console.log(`${chalk.green('•')} Interactive exploration: ${chalk.yellow('aegis-orient interactive')}`);
  }

  private async showCategoryOverview(map: any, category: string): Promise<void> {
    const capabilities = map.categories[category.toLowerCase()];
    
    if (!capabilities) {
      console.log(chalk.red(`❌ Category '${category}' not found.`));
      console.log(chalk.gray('Available categories:'), Object.keys(map.categories).join(', '));
      return;
    }

    console.log(chalk.cyan(`\n${this.getCategoryIcon(category)} ${category.toUpperCase()} CAPABILITIES`));
    console.log(chalk.gray(`${capabilities.length} capabilities found\n`));

    for (const capability of capabilities) {
      const statusIcon = this.getStatusIcon(capability.status);
      console.log(`${statusIcon} ${chalk.yellow.bold(capability.name)}`);
      console.log(`   ${capability.description}`);
      console.log(`   ${chalk.gray('Implementation:')} ${capability.implementation.join(', ')}`);
      
      if (capability.dependencies.length > 0) {
        console.log(`   ${chalk.gray('Dependencies:')} ${capability.dependencies.slice(0, 3).join(', ')}${capability.dependencies.length > 3 ? '...' : ''}`);
      }
      
      if (capability.documentation) {
        console.log(`   ${chalk.gray('Docs:')} ${capability.documentation}`);
      }
      
      if (capability.usageExample) {
        const example = capability.usageExample.split('\n')[0]; // First line only
        console.log(`   ${chalk.gray('Usage:')} ${example.slice(0, 60)}...`);
      }
      
      console.log(''); // Blank line
    }

    console.log(chalk.blue('🔗 Related Commands'));
    console.log(`${chalk.green('•')} Search this category: ${chalk.yellow(`aegis-orient search ${category}`)}`);
    console.log(`${chalk.green('•')} View other categories: ${chalk.yellow('aegis-orient category <name>')}`);
  }

  private async showSearchResults(map: any, searchTerm: string): Promise<void> {
    const term = searchTerm.toLowerCase();
    const results: any[] = [];

    for (const capabilities of Object.values(map.categories)) {
      for (const capability of capabilities as any[]) {
        if (
          capability.name.toLowerCase().includes(term) ||
          capability.description.toLowerCase().includes(term) ||
          capability.implementation.some((impl: string) => impl.toLowerCase().includes(term))
        ) {
          results.push(capability);
        }
      }
    }

    console.log(chalk.cyan(`\n🔍 Search Results for "${searchTerm}"`));
    console.log(chalk.gray(`${results.length} matches found\n`));

    if (results.length === 0) {
      console.log(chalk.yellow('No capabilities found matching your search.'));
      console.log(chalk.gray('Try searching for:'));
      console.log('• "governance" - constitutional features');
      console.log('• "validation" - checking and validation tools');
      console.log('• "config" - configuration management');
      console.log('• "semantic" - semantic interrupt features');
      return;
    }

    for (const capability of results.slice(0, 10)) { // Limit to 10 results
      const statusIcon = this.getStatusIcon(capability.status);
      const categoryIcon = this.getCategoryIcon(capability.category);
      
      console.log(`${statusIcon} ${chalk.yellow.bold(capability.name)} ${categoryIcon}`);
      console.log(`   ${capability.description}`);
      console.log(`   ${chalk.gray('File:')} ${capability.implementation[0]}`);
      
      // Highlight matching text
      const matchReason = capability.name.toLowerCase().includes(term) ? 'name' :
                          capability.description.toLowerCase().includes(term) ? 'description' : 'implementation';
      console.log(`   ${chalk.gray('Match:')} ${matchReason}`);
      console.log('');
    }

    if (results.length > 10) {
      console.log(chalk.gray(`... and ${results.length - 10} more matches`));
    }
  }

  private async showHealthStatus(map: any): Promise<void> {
    console.log(chalk.cyan('\n🏥 Framework Health Status'));
    console.log(`Overall Status: ${this.formatHealthStatus(map.healthStatus)}`);
    console.log(`Last Check: ${chalk.gray(new Date(map.generated).toLocaleString())}\n`);

    // Health metrics
    console.log(chalk.blue('📊 Health Metrics'));
    console.log(`Total Capabilities: ${chalk.yellow(map.totalCapabilities)}`);
    console.log(`Categories: ${chalk.yellow(Object.keys(map.categories).length)}`);
    console.log(`Issues Found: ${map.issues.length === 0 ? chalk.green('0') : chalk.red(map.issues.length)}`);

    // Status breakdown
    const statusCounts = this.getStatusBreakdown(map);
    console.log(chalk.blue('\n🏷️ Status Breakdown'));
    for (const [status, count] of Object.entries(statusCounts)) {
      const icon = this.getStatusIcon(status);
      console.log(`${icon} ${status}: ${chalk.yellow(count)}`);
    }

    // Issues
    if (map.issues.length > 0) {
      console.log(chalk.red('\n⚠️ Issues Found'));
      for (const issue of map.issues) {
        console.log(`${chalk.red('•')} ${issue}`);
      }
    } else {
      console.log(chalk.green('\n✅ No issues found - framework is healthy!'));
    }

    // Recommendations
    console.log(chalk.blue('\n💡 Recommendations'));
    if (map.issues.length > 0) {
      console.log(`${chalk.yellow('•')} Address documentation gaps for missing docs`);
      console.log(`${chalk.yellow('•')} Review deprecated capabilities for removal or migration`);
    } else {
      console.log(`${chalk.green('•')} Framework is in good health`);
      console.log(`${chalk.green('•')} Consider running capability scan regularly`);
    }

    console.log(chalk.blue('\n🔧 Health Commands'));
    console.log(`${chalk.green('•')} Run capability scan: ${chalk.yellow('node tools/framework-capability-mapper.ts')}`);
    console.log(`${chalk.green('•')} View detailed report: ${chalk.yellow('cat .framework/capability-map.md')}`);
  }

  private async runInteractiveMode(): Promise<void> {
    console.log(chalk.blue('\n🎮 Interactive Capability Explorer'));
    console.log(chalk.gray('This feature will be implemented in the next iteration.'));
    console.log(chalk.gray('For now, use the other commands to explore capabilities.'));
  }

  private findCapabilityByName(map: any, name: string): any | null {
    for (const capabilities of Object.values(map.categories)) {
      for (const capability of capabilities as any[]) {
        if (capability.name.toLowerCase().includes(name.toLowerCase()) ||
            capability.implementation.some((impl: string) => impl.toLowerCase().includes(name.toLowerCase()))) {
          return capability;
        }
      }
    }
    return null;
  }

  private getStatusBreakdown(map: any): Record<string, number> {
    const counts: Record<string, number> = {};
    
    for (const capabilities of Object.values(map.categories)) {
      for (const capability of capabilities as any[]) {
        counts[capability.status] = (counts[capability.status] || 0) + 1;
      }
    }
    
    return counts;
  }

  private getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      core: '🏛️',
      tool: '🔧',
      governance: '⚖️',
      integration: '🔗',
      safeguard: '🛡️',
      experimental: '🧪'
    };
    return icons[category.toLowerCase()] || '📦';
  }

  private getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      stable: '✅',
      beta: '🟡',
      alpha: '🟠',
      experimental: '🧪',
      deprecated: '⚠️'
    };
    return icons[status] || '❓';
  }

  private formatHealthStatus(status: string): string {
    switch (status) {
      case 'healthy':
        return chalk.green('HEALTHY ✅');
      case 'warnings':
        return chalk.yellow('WARNINGS ⚠️');
      case 'issues':
        return chalk.red('ISSUES ❌');
      default:
        return chalk.gray('UNKNOWN ❓');
    }
  }

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

  public run(): void {
    this.program.parse();
  }
}

// CLI execution
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const cli = new AegisOrientationCLI();
  cli.run();
}

export { AegisOrientationCLI };
