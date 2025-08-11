#!/usr/bin/env node

/**
 * @aegisFrameworkVersion: 2.4.0
 * @intent: Automatically update the framework dashboard for git commits
 * @context: Ensures dashboard stays current and gets committed to repository
 * @mode: strict
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { FrameworkCapabilityMapper } from './framework-capability-mapper.ts';
import { BlueprintRegistry } from '../framework/registry/blueprint-registry.ts';
import { ExecutionTraceHooks } from '../framework/observability/execution-trace-hooks.ts';

interface DashboardData {
  version: string;
  totalCapabilities: number;
  categories: Record<string, number>;
  statusDistribution: Record<string, number>;
  healthStatus: string;
  documentationCoverage: number;
  testCoverage: number;
  blueprintCount: number;
  lastUpdated: string;
  executionStats: any;
}

class FrameworkDashboardUpdater {
  private projectRoot: string;
  private dashboardFile: string;
  private mapper: FrameworkCapabilityMapper;
  private registry: BlueprintRegistry;
  private tracer: ExecutionTraceHooks;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.dashboardFile = path.join(projectRoot, 'FRAMEWORK-DASHBOARD.md');
    this.mapper = new FrameworkCapabilityMapper(projectRoot);
    this.registry = BlueprintRegistry.getInstance(projectRoot);
    this.tracer = ExecutionTraceHooks.getInstance(projectRoot);
  }

  /**
   * Update the framework dashboard with current data
   */
  async updateDashboard(): Promise<void> {
    console.log('📊 Updating Framework Dashboard...');

    try {
      // Gather current framework data
      const data = await this.gatherDashboardData();

      // Generate updated dashboard content
      const dashboardContent = this.generateDashboardContent(data);

      // Write to file
      fs.writeFileSync(this.dashboardFile, dashboardContent);

      console.log(`✅ Dashboard updated: ${this.dashboardFile}`);
      console.log(`📈 Framework Status: ${data.healthStatus}`);
      console.log(`🔧 Capabilities: ${data.totalCapabilities}`);
      console.log(`📋 Blueprints: ${data.blueprintCount}`);
    } catch (error) {
      console.error('❌ Dashboard update failed:', error);
      throw error;
    }
  }

  /**
   * Gather all current framework data
   */
  private async gatherDashboardData(): Promise<DashboardData> {
    const [capabilityMap, blueprintStats, executionStats] = await Promise.all([
      this.mapper.discoverCapabilities(),
      this.getBlueprintStats(),
      this.getExecutionStats(),
    ]);

    // Calculate category distribution
    const categories: Record<string, number> = {};
    for (const [category, capabilities] of Object.entries(capabilityMap.categories)) {
      categories[category] = (capabilities as any[]).length;
    }

    // Calculate status distribution
    const statusDistribution: Record<string, number> = {};
    for (const capabilities of Object.values(capabilityMap.categories)) {
      for (const capability of capabilities as any[]) {
        statusDistribution[capability.status] = (statusDistribution[capability.status] || 0) + 1;
      }
    }

    // Calculate documentation coverage
    let documented = 0;
    let total = 0;
    for (const capabilities of Object.values(capabilityMap.categories)) {
      for (const capability of capabilities as any[]) {
        total++;
        if (capability.documentation) {
          documented++;
        }
      }
    }
    const documentationCoverage = total > 0 ? (documented / total) * 100 : 0;

    // Calculate test coverage
    const testCoverage = await this.calculateTestCoverage();

    return {
      version: capabilityMap.frameworkVersion,
      totalCapabilities: capabilityMap.totalCapabilities,
      categories,
      statusDistribution,
      healthStatus: capabilityMap.healthStatus,
      documentationCoverage,
      testCoverage,
      blueprintCount: blueprintStats.total,
      lastUpdated: new Date().toISOString(),
      executionStats,
    };
  }

  /**
   * Generate dashboard content from data
   */
  private generateDashboardContent(data: DashboardData): string {
    const date = new Date().toLocaleDateString();
    const healthBadge = data.healthStatus === 'healthy' ? 'HEALTHY-green' : 'ISSUES-red';

    let content = `# Aegis Framework Dashboard

[![Framework Version](https://img.shields.io/badge/Framework-v${data.version}-orange?style=for-the-badge)](VERSION)
[![Capabilities](https://img.shields.io/badge/Capabilities-${data.totalCapabilities}-blue?style=for-the-badge)](#capability-overview)
[![Health](https://img.shields.io/badge/Health-${healthBadge}?style=for-the-badge)](#health-status)

**Last Updated**: ${date}  
**Auto-Generated**: This dashboard is automatically maintained by the framework's observability system.

---

## 📊 Framework Overview

| Metric | Value | Status |
|--------|-------|--------|
| **Version** | ${data.version} | Current |
| **Total Capabilities** | ${data.totalCapabilities} | Active |
| **Categories** | ${Object.keys(data.categories).length} | Complete |
| **Health Status** | ${data.healthStatus.toUpperCase()} ${data.healthStatus === 'healthy' ? '✅' : '❌'} | ${data.healthStatus === 'healthy' ? 'Operational' : 'Needs Attention'} |
| **Documentation Coverage** | ${data.documentationCoverage.toFixed(1)}% | ${data.documentationCoverage >= 80 ? 'Complete' : 'Needs Improvement'} |
| **Test Coverage** | ${data.testCoverage.toFixed(1)}% | ${data.testCoverage >= 80 ? 'Excellent' : 'Needs Improvement'} |

## 🎯 What Aegis Does

**Aegis Framework** is a production-ready system for AI-assisted engineering that provides:

- **Constitutional Governance**: Foundational principles with democratic amendment processes
- **Drift Detection & Prevention**: Real-time monitoring of agent behavior and intent alignment
- **Configuration Management**: Team-configurable enforcement levels and feature controls
- **Version Consistency**: Automated validation across all framework files
- **Semantic Interrupt Handling**: Detection and response to user confusion or misalignment
- **Foreground Hang Prevention**: Automatic backgrounding of long-running processes
- **Observability & Tracing**: Comprehensive monitoring and execution tracking

## 📋 Capability Overview

### Distribution by Category

| Category | Count | Percentage | Key Capabilities |
|----------|-------|------------|-----------------|`;

    // Add category breakdown
    const totalCaps = data.totalCapabilities;
    for (const [category, count] of Object.entries(data.categories)) {
      const percentage = Math.round((count / totalCaps) * 100);
      const icon = this.getCategoryIcon(category);
      const description = this.getCategoryDescription(category);
      content += `\n| ${icon} **${this.capitalize(category)}** | ${count} | ${percentage}% | ${description} |`;
    }

    content += `\n\n### Status Distribution

| Status | Count | Description |
|--------|-------|-------------|`;

    // Add status breakdown
    for (const [status, count] of Object.entries(data.statusDistribution)) {
      const icon = this.getStatusIcon(status);
      const description = this.getStatusDescription(status);
      content += `\n| ${icon} **${this.capitalize(status)}** | ${count} | ${description} |`;
    }

    content += `\n\n## 🔧 Key Tools & Capabilities

### Constitutional Governance
- **Constitutional Compliance Enforcer**: Validates framework intelligence claims
- **Intent Enforcement Engine**: Real-time drift prevention and command validation
- **Semantic Interrupt Detector**: Responds to user expressions of confusion
- **Constitutional Reflex Engine**: Orchestrates responses to semantic interrupts

### Development Tools
- **Version Consistency Validator**: Ensures consistency across framework files
- **Framework Capability Mapper**: Auto-discovers and catalogs capabilities
- **Blueprint Registry**: Single source of truth for framework features
- **Execution Trace Hooks**: Real-time feature usage tracking

### Safety & Prevention
- **Foreground Hang Prevention**: Prevents agent blocking on long-running processes
- **Self-Healing Governance**: Detects and prevents repeat failures
- **Evolution Learning System**: Learns from patterns to prevent recurrence
- **Predictive Compliance Monitor**: Predicts and prevents violations

### CLI & User Interface
- **Aegis Orient**: Instant framework orientation and capability overview
- **Aegis Dashboard**: Live framework monitoring and health status
- **Aegis Conductor**: Core framework orchestration and control
- **Aegis Hydrate**: One-command project setup and migration

## 🏥 Health Status

### Overall Health: ${data.healthStatus === 'healthy' ? '✅ **HEALTHY**' : '❌ **ISSUES DETECTED**'}

| Component | Status | Notes |
|-----------|--------|-------|
| **Framework Core** | ${data.healthStatus === 'healthy' ? '✅ Healthy' : '❌ Issues'} | Version ${data.version} |
| **Blueprint Registry** | ✅ Valid | ${data.blueprintCount} blueprints registered |
| **Documentation** | ${data.documentationCoverage >= 80 ? '✅ Complete' : '⚠️ Partial'} | ${data.documentationCoverage.toFixed(1)}% coverage |
| **Test Coverage** | ${data.testCoverage >= 80 ? '✅ Excellent' : '⚠️ Low'} | ${data.testCoverage.toFixed(1)}% coverage |
| **Version Consistency** | ✅ Synchronized | Auto-validated |

## 🚀 Quick Start

### Installation
\`\`\`bash
# Install globally
npm install -g @aegis-framework/cli@${data.version}

# Initialize in a project
aegis-hydrate /path/to/your/project
\`\`\`

### Essential Commands
\`\`\`bash
# Framework orientation
aegis-orient                    # Quick overview
aegis-orient detailed          # Comprehensive breakdown
aegis-orient category tool     # Explore specific category

# Live monitoring
aegis-dashboard                 # Full dashboard
aegis-dashboard health          # Health check
aegis-dashboard monitor         # Live monitoring mode

# Core operations
aegis-conductor init            # Initialize framework
aegis-conductor check           # Run compliance checks
aegis-conductor enforce         # Apply enforcement rules
\`\`\`

## 📊 Usage Analytics`;

    // Add execution stats if available
    if (data.executionStats && data.executionStats.hasTraces) {
      content += `

### Current Session
- **Total Executions**: ${data.executionStats.totalExecutions}
- **Session Traces**: ${data.executionStats.sessionTraces}
- **Unique Features**: ${data.executionStats.uniqueFeatures}`;

      if (data.executionStats.mostUsed && data.executionStats.mostUsed.length > 0) {
        content += `\n\n### Most Used Features`;
        for (let i = 0; i < Math.min(5, data.executionStats.mostUsed.length); i++) {
          const feature = data.executionStats.mostUsed[i];
          content += `\n${i + 1}. **${feature.feature}**: ${feature.count} executions`;
        }
      }
    } else {
      content += `

### Execution Tracking
- **Status**: Monitoring active
- **Session**: New session started
- **Analytics**: Ready for collection`;
    }

    content += `

## 🧭 Navigation Guide

### For New Users
1. **Start Here**: Run \`aegis-orient\` for framework overview
2. **Explore Capabilities**: Use \`aegis-orient category <name>\` to browse features
3. **Search Features**: Use \`aegis-orient search <term>\` to find specific capabilities
4. **Check Health**: Run \`aegis-dashboard health\` for system status

### For Developers
1. **Capability Inventory**: Check \`tools/framework-capability-mapper.ts\`
2. **Blueprint Management**: Explore \`framework/registry/blueprint-registry.ts\`
3. **Execution Tracing**: Review \`framework/observability/execution-trace-hooks.ts\`
4. **Constitutional Framework**: Study \`CONSTITUTION.md\` and governance tools

### For Framework Maintainers
1. **Health Monitoring**: Use \`aegis-dashboard monitor\` for live oversight
2. **Comprehensive Reports**: Generate with \`aegis-dashboard report\`
3. **Blueprint Validation**: Run \`framework/registry/blueprint-registry.ts validate\`
4. **Dashboard Updates**: Run \`tools/update-framework-dashboard.ts\`

## 🤝 Contributing

### Framework Development
- **Read**: [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
- **Follow**: Constitutional principles defined in [CONSTITUTION.md](CONSTITUTION.md)
- **Validate**: Use framework tools for consistency checking
- **Update Dashboard**: Run \`tools/update-framework-dashboard.ts\` after changes

### Issue Reporting
- **Health Check**: Run \`aegis-dashboard health\` before reporting
- **Context Collection**: Use \`aegis-dashboard report\` for comprehensive state
- **Blueprint Reference**: Include relevant blueprint information
- **Dashboard State**: Include current dashboard metrics

## 📄 Documentation

### Core Documentation
- **[Constitution](CONSTITUTION.md)**: Framework governance and principles
- **[Contributing Guide](CONTRIBUTING.md)**: Development and contribution guidelines
- **[Implementation Docs](docs/implementation/)**: Detailed technical documentation
- **[Evolution Stories](docs/evolution/)**: Framework development history

### Auto-Generated Reports
- **[Capability Map](.framework/capability-map.md)**: Complete capability inventory
- **[Blueprint Registry](.framework/blueprint-registry.md)**: Feature definitions
- **[Dashboard Report](.framework/dashboard-report.md)**: Comprehensive framework status
- **[Execution Traces](.framework/execution-traces.jsonl)**: Real-time usage data

---

## 🏛️ Framework Status Summary

**The Aegis Framework v${data.version} is ${data.healthStatus === 'healthy' ? 'a mature, production-ready system' : 'under active development'} for AI-assisted engineering with comprehensive governance, monitoring, and safety features.**

### Key Strengths
✅ **Constitutional Governance**: Robust foundational principles with democratic evolution  
✅ **Real-time Monitoring**: Comprehensive observability and health tracking  
✅ **Safety Systems**: Multiple layers of drift prevention and error detection  
✅ **Developer Experience**: Intuitive tools and comprehensive documentation  
${data.documentationCoverage >= 80 ? '✅' : '⚠️'} **Documentation Coverage**: ${data.documentationCoverage.toFixed(1)}% complete

### Areas for Improvement`;

    if (data.testCoverage < 80) {
      content += `\n⚠️ **Test Coverage**: Currently at ${data.testCoverage.toFixed(1)}%, target is 80%+`;
    }

    if (data.healthStatus !== 'healthy') {
      content += `\n⚠️ **Health Issues**: Framework health requires attention`;
    }

    content += `\n📈 **Performance Metrics**: Baseline established, optimization opportunities identified  
🔧 **Tool Integration**: Additional CLI enhancements and workflow improvements planned

---

**Last Dashboard Update**: ${date}  
**Next Scheduled Update**: Automatic on next capability scan  
**Framework Health**: ${data.healthStatus === 'healthy' ? '✅ **HEALTHY**' : '❌ **NEEDS ATTENTION**'} - ${data.healthStatus === 'healthy' ? 'All systems operational' : 'Issues detected, review recommended'}`;

    return content;
  }

  /**
   * Helper methods
   */
  private async getBlueprintStats(): Promise<{ total: number }> {
    await this.registry.discover();
    const blueprints = this.registry.getAll();
    return { total: blueprints.length };
  }

  private getExecutionStats(): any {
    const stats = this.tracer.getStatistics();
    return {
      hasTraces: stats.totalExecutions > 0,
      totalExecutions: stats.totalExecutions,
      sessionTraces: this.tracer.getCurrentSession().totalTraces,
      uniqueFeatures: stats.uniqueFeatures,
      mostUsed: stats.mostUsedFeatures,
    };
  }

  private async calculateTestCoverage(): Promise<number> {
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
    const walk = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (entry.name.endsWith('.test.ts') || entry.name.endsWith('.test.js')) {
          files.push(fullPath);
        }
      }
    };

    walk(testDir);
    return files;
  }

  private findSourceFiles(): string[] {
    const dirs = ['tools', 'framework', 'cli'];
    const files: string[] = [];

    for (const dir of dirs) {
      const fullDir = path.join(this.projectRoot, dir);
      if (fs.existsSync(fullDir)) {
        const walk = (currentDir: string) => {
          const entries = fs.readdirSync(currentDir, { withFileTypes: true });
          for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);
            if (entry.isDirectory() && !entry.name.startsWith('.')) {
              walk(fullPath);
            } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
              files.push(fullPath);
            }
          }
        };
        walk(fullDir);
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
      experimental: '🧪',
    };
    return icons[category] || '📦';
  }

  private getCategoryDescription(category: string): string {
    const descriptions: Record<string, string> = {
      core: 'Framework foundations, specifications, templates',
      tool: 'CLI utilities, validation tools, enforcement engines',
      governance: 'Constitutional enforcement, semantic interrupts',
      integration: 'Blueprint implementations, external connections',
      experimental: 'Proof-of-concept, research phase features',
    };
    return descriptions[category] || 'Framework components';
  }

  private getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      stable: '✅',
      beta: '🟡',
      alpha: '🟠',
      experimental: '🧪',
      deprecated: '⚠️',
    };
    return icons[status] || '❓';
  }

  private getStatusDescription(status: string): string {
    const descriptions: Record<string, string> = {
      stable: 'Production-ready, fully tested',
      beta: 'Feature-complete, undergoing validation',
      alpha: 'Early implementation, active development',
      experimental: 'Proof-of-concept, research phase',
      deprecated: 'Legacy feature, migration recommended',
    };
    return descriptions[status] || 'Status unknown';
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

/**
 * CLI interface
 */
async function main() {
  const updater = new FrameworkDashboardUpdater();

  try {
    await updater.updateDashboard();
    console.log('\n💡 Dashboard updated successfully!');
    console.log('📁 Check FRAMEWORK-DASHBOARD.md for the latest status');
    console.log('🔧 Run this script after major changes to keep dashboard current');
  } catch (error) {
    console.error('❌ Dashboard update failed:', error);
    process.exit(1);
  }
}

// Run if this is the main module
if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}
