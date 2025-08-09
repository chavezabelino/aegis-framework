#!/usr/bin/env node

/**
 * @aegisFrameworkVersion: 2.4.0
 * @intent: Live framework dashboard that shows real-time capability status and usage
 * @context: Complete observability solution binding truth to live system state
 * @mode: strict
 */

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { FrameworkCapabilityMapper } from '../tools/framework-capability-mapper.ts';
import { BlueprintRegistry } from '../framework/registry/blueprint-registry.ts';
import { ExecutionTraceHooks } from '../framework/observability/execution-trace-hooks.ts';

interface DashboardConfig {
  refreshInterval: number;
  maxRecentTraces: number;
  categories: string[];
  showTracing: boolean;
  showBlueprints: boolean;
  showHealth: boolean;
}

class AegisDashboard {
  private program: Command;
  private projectRoot: string;
  private mapper: FrameworkCapabilityMapper;
  private registry: BlueprintRegistry;
  private tracer: ExecutionTraceHooks;
  private config: DashboardConfig;

  constructor() {
    this.program = new Command();
    this.projectRoot = process.cwd();
    this.mapper = new FrameworkCapabilityMapper(this.projectRoot);
    this.registry = BlueprintRegistry.getInstance(this.projectRoot);
    this.tracer = ExecutionTraceHooks.getInstance(this.projectRoot);
    
    this.config = {
      refreshInterval: 5000,
      maxRecentTraces: 10,
      categories: ['core', 'tool', 'governance', 'integration'],
      showTracing: true,
      showBlueprints: true,
      showHealth: true
    };
    
    this.setupCommands();
  }

  private setupCommands(): void {
    this.program
      .name('aegis-dashboard')
      .description('Live Aegis Framework dashboard and observability')
      .version(this.getFrameworkVersion());

    // Full dashboard
    this.program
      .command('show', { isDefault: true })
      .description('Show live framework dashboard')
      .option('--no-tracing', 'Hide execution tracing')
      .option('--no-blueprints', 'Hide blueprint information')
      .option('--no-health', 'Hide health status')
      .action((options) => this.showDashboard(options));

    // Quick status
    this.program
      .command('status')
      .alias('s')
      .description('Quick framework status')
      .action(() => this.showQuickStatus());

    // Live monitoring
    this.program
      .command('monitor')
      .alias('m')
      .description('Live monitoring mode (auto-refresh)')
      .option('-i, --interval <seconds>', 'Refresh interval in seconds', '5')
      .action((options) => this.startMonitoring(parseInt(options.interval)));

    // Health check
    this.program
      .command('health')
      .alias('h')
      .description('Comprehensive health check')
      .action(() => this.showHealthCheck());

    // Generate reports
    this.program
      .command('report')
      .alias('r')
      .description('Generate comprehensive framework report')
      .option('-o, --output <path>', 'Output file path')
      .action((options) => this.generateReport(options.output));
  }

  private async showDashboard(options: any): Promise<void> {
    console.clear();
    console.log(chalk.blue.bold('🏛️ AEGIS FRAMEWORK DASHBOARD'));
    console.log(chalk.gray('='.repeat(60)));
    console.log(chalk.gray(`Generated: ${new Date().toLocaleString()}`));
    console.log();

    try {
      // Discover current state
      const [capabilityMap, blueprintStats, tracingStats] = await Promise.all([
        this.mapper.discoverCapabilities(),
        this.getBluerintStats(),
        this.getTracingStats()
      ]);

      // Framework Overview
      await this.showFrameworkOverview(capabilityMap);

      // Capability Breakdown
      if (options.tracing !== false) {
        await this.showCapabilityBreakdown(capabilityMap);
      }

      // Blueprint Registry
      if (options.blueprints !== false) {
        await this.showBlueprintSummary(blueprintStats);
      }

      // Execution Tracing
      if (options.tracing !== false) {
        await this.showExecutionTracing(tracingStats);
      }

      // Health Status
      if (options.health !== false) {
        await this.showHealthSummary(capabilityMap);
      }

      // Quick Actions
      this.showQuickActions();

    } catch (error) {
      console.error(chalk.red('❌ Dashboard failed:'), error);
    }
  }

  private async showFrameworkOverview(map: any): Promise<void> {
    console.log(chalk.cyan.bold('📊 FRAMEWORK OVERVIEW'));
    
    const stats = {
      version: map.frameworkVersion,
      capabilities: map.totalCapabilities,
      categories: Object.keys(map.categories).length,
      health: map.healthStatus
    };

    console.log(`${chalk.yellow('Version:')} ${stats.version}`);
    console.log(`${chalk.yellow('Capabilities:')} ${stats.capabilities}`);
    console.log(`${chalk.yellow('Categories:')} ${stats.categories}`);
    console.log(`${chalk.yellow('Health:')} ${this.formatHealthStatus(stats.health)}`);
    
    // Visual capability distribution
    console.log(chalk.yellow('\nCapability Distribution:'));
    for (const [category, capabilities] of Object.entries(map.categories)) {
      const count = (capabilities as any[]).length;
      const percentage = Math.round((count / map.totalCapabilities) * 100);
      const bar = '█'.repeat(Math.round(percentage / 5));
      const icon = this.getCategoryIcon(category);
      
      console.log(`${icon} ${category.padEnd(12)} ${count.toString().padStart(2)} ${bar} ${percentage}%`);
    }
    
    console.log();
  }

  private async showCapabilityBreakdown(map: any): Promise<void> {
    console.log(chalk.cyan.bold('🔧 CAPABILITY BREAKDOWN'));
    
    // Show status distribution
    const statusCounts = this.getStatusBreakdown(map);
    console.log(chalk.yellow('Status Distribution:'));
    
    for (const [status, count] of Object.entries(statusCounts)) {
      const icon = this.getStatusIcon(status);
      console.log(`  ${icon} ${status}: ${count}`);
    }
    
    // Show recent modifications
    const allCapabilities = Object.values(map.categories).flat() as any[];
    const recentMods = allCapabilities
      .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
      .slice(0, 5);
    
    console.log(chalk.yellow('\nRecently Modified:'));
    for (const cap of recentMods) {
      const timeAgo = this.timeAgo(new Date(cap.lastModified));
      console.log(`  • ${cap.name} (${timeAgo})`);
    }
    
    console.log();
  }

  private async showBlueprintSummary(stats: any): Promise<void> {
    console.log(chalk.cyan.bold('📋 BLUEPRINT REGISTRY'));
    
    console.log(`${chalk.yellow('Total Blueprints:')} ${stats.total}`);
    console.log(`${chalk.yellow('Active:')} ${stats.active}`);
    console.log(`${chalk.yellow('Experimental:')} ${stats.experimental}`);
    
    if (stats.recent.length > 0) {
      console.log(chalk.yellow('\nRecent Blueprints:'));
      for (const bp of stats.recent) {
        const statusIcon = this.getStatusIcon(bp.status);
        console.log(`  ${statusIcon} ${bp.name} (${bp.category})`);
      }
    }
    
    console.log();
  }

  private async showExecutionTracing(stats: any): Promise<void> {
    if (!stats.hasTraces) {
      console.log(chalk.cyan.bold('🔍 EXECUTION TRACING'));
      console.log(chalk.gray('No execution traces recorded yet'));
      console.log();
      return;
    }

    console.log(chalk.cyan.bold('🔍 EXECUTION TRACING'));
    
    console.log(`${chalk.yellow('Total Executions:')} ${stats.totalExecutions}`);
    console.log(`${chalk.yellow('Session Traces:')} ${stats.sessionTraces}`);
    console.log(`${chalk.yellow('Active Session:')} ${stats.sessionId.substring(0, 12)}...`);
    
    if (stats.mostUsed.length > 0) {
      console.log(chalk.yellow('\nMost Used Features:'));
      for (const feature of stats.mostUsed.slice(0, 5)) {
        console.log(`  • ${feature.feature}: ${feature.count} executions`);
      }
    }
    
    if (stats.recentActivity.length > 0) {
      console.log(chalk.yellow('\nRecent Activity:'));
      for (const trace of stats.recentActivity.slice(0, 5)) {
        const timeAgo = this.timeAgo(new Date(trace.timestamp));
        const duration = trace.duration ? ` (${trace.duration}ms)` : '';
        console.log(`  • ${trace.feature}.${trace.capability}${duration} - ${timeAgo}`);
      }
    }
    
    console.log();
  }

  private async showHealthSummary(map: any): Promise<void> {
    console.log(chalk.cyan.bold('🏥 HEALTH STATUS'));
    
    const healthMetrics = {
      overall: map.healthStatus,
      issues: map.issues.length,
      documentation: this.calculateDocumentationCoverage(map),
      testing: await this.calculateTestCoverage()
    };

    console.log(`${chalk.yellow('Overall:')} ${this.formatHealthStatus(healthMetrics.overall)}`);
    console.log(`${chalk.yellow('Issues:')} ${healthMetrics.issues === 0 ? chalk.green('0') : chalk.red(healthMetrics.issues)}`);
    console.log(`${chalk.yellow('Documentation:')} ${this.formatPercentage(healthMetrics.documentation)}`);
    console.log(`${chalk.yellow('Test Coverage:')} ${this.formatPercentage(healthMetrics.testing)}`);
    
    if (map.issues.length > 0 && map.issues.length <= 3) {
      console.log(chalk.yellow('\nTop Issues:'));
      for (const issue of map.issues.slice(0, 3)) {
        console.log(`  ${chalk.red('•')} ${issue}`);
      }
    }
    
    console.log();
  }

  private showQuickActions(): void {
    console.log(chalk.cyan.bold('⚡ QUICK ACTIONS'));
    console.log(`${chalk.green('•')} Full capabilities: ${chalk.yellow('aegis-orient detailed')}`);
    console.log(`${chalk.green('•')} Search features: ${chalk.yellow('aegis-orient search <term>')}`);
    console.log(`${chalk.green('•')} Health check: ${chalk.yellow('aegis-dashboard health')}`);
    console.log(`${chalk.green('•')} Live monitoring: ${chalk.yellow('aegis-dashboard monitor')}`);
    console.log(`${chalk.green('•')} Generate report: ${chalk.yellow('aegis-dashboard report')}`);
    console.log();
  }

  private async showQuickStatus(): Promise<void> {
    console.log(chalk.blue.bold('🚀 Aegis Framework Status'));
    
    try {
      const map = await this.mapper.discoverCapabilities();
      const tracingStats = this.getTracingStats();
      
      console.log(`Version: ${chalk.yellow(map.frameworkVersion)}`);
      console.log(`Capabilities: ${chalk.yellow(map.totalCapabilities)}`);
      console.log(`Health: ${this.formatHealthStatus(map.healthStatus)}`);
      
      if (tracingStats.hasTraces) {
        console.log(`Active Session: ${chalk.yellow(tracingStats.sessionTraces)} traces`);
      }
      
      if (map.issues.length > 0) {
        console.log(`${chalk.red('Issues:')} ${map.issues.length}`);
      }
      
    } catch (error) {
      console.error(chalk.red('❌ Status check failed:'), error);
    }
  }

  private async startMonitoring(interval: number): Promise<void> {
    console.log(chalk.blue.bold(`🔄 Starting live monitoring (${interval}s intervals)`));
    console.log(chalk.gray('Press Ctrl+C to stop\n'));
    
    const monitor = async () => {
      await this.showDashboard({ tracing: true, blueprints: false, health: false });
      console.log(chalk.gray(`\nNext refresh in ${interval}s... (Ctrl+C to stop)`));
    };
    
    // Initial display
    await monitor();
    
    // Set up interval
    const intervalId = setInterval(monitor, interval * 1000);
    
    // Handle cleanup
    process.on('SIGINT', () => {
      clearInterval(intervalId);
      console.log(chalk.yellow('\n👋 Monitoring stopped'));
      process.exit(0);
    });
  }

  private async showHealthCheck(): Promise<void> {
    console.log(chalk.blue.bold('🏥 Comprehensive Health Check'));
    console.log(chalk.gray('='.repeat(40)));
    
    try {
      const map = await this.mapper.discoverCapabilities();
      const validation = this.registry.validate();
      
      // Overall health
      console.log(chalk.cyan('\n📊 Overall Health'));
      console.log(`Framework Status: ${this.formatHealthStatus(map.healthStatus)}`);
      console.log(`Blueprint Registry: ${validation.valid ? chalk.green('VALID') : chalk.red('INVALID')}`);
      
      // Detailed issues
      if (map.issues.length > 0) {
        console.log(chalk.red('\n⚠️ Framework Issues'));
        for (const issue of map.issues) {
          console.log(`  • ${issue}`);
        }
      }
      
      if (validation.issues.length > 0) {
        console.log(chalk.red('\n📋 Blueprint Issues'));
        for (const issue of validation.issues) {
          console.log(`  • ${issue}`);
        }
      }
      
      // Recommendations
      console.log(chalk.blue('\n💡 Recommendations'));
      if (map.issues.length === 0 && validation.valid) {
        console.log(`${chalk.green('•')} Framework is healthy - no immediate action needed`);
      } else {
        console.log(`${chalk.yellow('•')} Address documentation gaps`);
        console.log(`${chalk.yellow('•')} Run capability rescan after fixes`);
      }
      
    } catch (error) {
      console.error(chalk.red('❌ Health check failed:'), error);
    }
  }

  private async generateReport(outputPath?: string): Promise<void> {
    console.log(chalk.blue.bold('📄 Generating Comprehensive Report'));
    
    try {
      const [map, blueprintStats, tracingStats] = await Promise.all([
        this.mapper.discoverCapabilities(),
        this.getBluerintStats(),
        this.getTracingStats()
      ]);
      
      let report = '# Aegis Framework Dashboard Report\n\n';
      report += `**Generated**: ${new Date().toISOString()}\n`;
      report += `**Framework Version**: ${map.frameworkVersion}\n\n`;
      
      // Framework summary
      report += '## Framework Overview\n\n';
      report += `- **Total Capabilities**: ${map.totalCapabilities}\n`;
      report += `- **Categories**: ${Object.keys(map.categories).length}\n`;
      report += `- **Health Status**: ${map.healthStatus.toUpperCase()}\n`;
      report += `- **Issues**: ${map.issues.length}\n\n`;
      
      // Capability breakdown
      report += '## Capability Breakdown\n\n';
      for (const [category, capabilities] of Object.entries(map.categories)) {
        const count = (capabilities as any[]).length;
        report += `- **${category}**: ${count} capabilities\n`;
      }
      report += '\n';
      
      // Blueprint registry
      report += '## Blueprint Registry\n\n';
      report += `- **Total Blueprints**: ${blueprintStats.total}\n`;
      report += `- **Active**: ${blueprintStats.active}\n`;
      report += `- **Experimental**: ${blueprintStats.experimental}\n\n`;
      
      // Execution tracing
      if (tracingStats.hasTraces) {
        report += '## Execution Tracing\n\n';
        report += `- **Total Executions**: ${tracingStats.totalExecutions}\n`;
        report += `- **Session Traces**: ${tracingStats.sessionTraces}\n`;
        report += `- **Unique Features**: ${tracingStats.uniqueFeatures}\n\n`;
      }
      
      // Issues
      if (map.issues.length > 0) {
        report += '## Issues\n\n';
        for (const issue of map.issues) {
          report += `- ⚠️ ${issue}\n`;
        }
        report += '\n';
      }
      
      // Save report
      const filePath = outputPath || path.join(this.projectRoot, '.framework/dashboard-report.md');
      fs.writeFileSync(filePath, report);
      
      console.log(`✅ Report generated: ${filePath}`);
      
    } catch (error) {
      console.error(chalk.red('❌ Report generation failed:'), error);
    }
  }

  // Helper methods
  private async getBluerintStats(): Promise<any> {
    await this.registry.discover();
    const blueprints = this.registry.getAll();
    
    return {
      total: blueprints.length,
      active: blueprints.filter(bp => bp.status === 'stable' || bp.status === 'beta').length,
      experimental: blueprints.filter(bp => bp.status === 'alpha' || bp.status === 'experimental').length,
      recent: blueprints
        .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
        .slice(0, 3)
    };
  }

  private getTracingStats(): any {
    const stats = this.tracer.getStatistics();
    const session = this.tracer.getCurrentSession();
    
    return {
      hasTraces: stats.totalExecutions > 0,
      totalExecutions: stats.totalExecutions,
      sessionTraces: session.totalTraces,
      sessionId: session.sessionId,
      uniqueFeatures: stats.uniqueFeatures,
      mostUsed: stats.mostUsedFeatures,
      recentActivity: stats.recentActivity
    };
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

  private calculateDocumentationCoverage(map: any): number {
    let documented = 0;
    let total = 0;
    
    for (const capabilities of Object.values(map.categories)) {
      for (const capability of capabilities as any[]) {
        total++;
        if (capability.documentation) {
          documented++;
        }
      }
    }
    
    return total > 0 ? (documented / total) * 100 : 0;
  }

  private async calculateTestCoverage(): Promise<number> {
    // Simple test coverage calculation
    try {
      const testFiles = this.findTestFiles();
      const sourceFiles = this.findSourceFiles();
      
      return sourceFiles.length > 0 ? (testFiles.length / sourceFiles.length) * 100 : 0;
    } catch (error) {
      return 0;
    }
  }

  private findTestFiles(): string[] {
    const testDir = path.join(this.projectRoot, 'tests');
    if (!fs.existsSync(testDir)) return [];
    
    const files: string[] = [];
    const entries = fs.readdirSync(testDir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.test.ts')) {
        files.push(entry.name);
      }
    }
    
    return files;
  }

  private findSourceFiles(): string[] {
    const dirs = ['tools', 'framework', 'cli'];
    const files: string[] = [];
    
    for (const dir of dirs) {
      const fullDir = path.join(this.projectRoot, dir);
      if (fs.existsSync(fullDir)) {
        const entries = fs.readdirSync(fullDir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isFile() && entry.name.endsWith('.ts')) {
            files.push(entry.name);
          }
        }
      }
    }
    
    return files;
  }

  private getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      core: '🏛️',
      tool: '🔧',
      governance: '⚖️',
      integration: '🔗',
      experimental: '🧪'
    };
    return icons[category] || '📦';
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

  private formatPercentage(value: number): string {
    if (value >= 80) {
      return chalk.green(`${value.toFixed(1)}%`);
    } else if (value >= 60) {
      return chalk.yellow(`${value.toFixed(1)}%`);
    } else {
      return chalk.red(`${value.toFixed(1)}%`);
    }
  }

  private timeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
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

  public run(): void {
    this.program.parse();
  }
}

// CLI execution
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const dashboard = new AegisDashboard();
  dashboard.run();
}
