#!/usr/bin/env node

/**
 * Self-Healing Blueprint Engine
 * 
 * Automatically detects, analyzes, and repairs blueprint inconsistencies and validation errors
 * Part of Phase 3: Advanced Self-Healing Features
 * 
 * @aegisFrameworkVersion: 2.4.0-alpha
 * @intent: Implement autonomous blueprint repair and validation enhancement
 */

import fs from "fs";
import path from "path";
import yaml from "js-yaml";

interface BlueprintHealth {
  blueprintId: string;
  filePath: string;
  status: 'healthy' | 'warning' | 'critical' | 'corrupted';
  issues: BlueprintIssue[];
  repairActions: RepairAction[];
  validationScore: number;
  lastChecked: string;
  autoRepairable: boolean;
}

interface BlueprintIssue {
  id: string;
  type: 'schema-violation' | 'missing-required' | 'version-mismatch' | 'annotation-error' | 'contract-inconsistency';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: string;
  expected: string;
  actual: string;
  repairSuggestion: string;
  autoFixAvailable: boolean;
}

interface RepairAction {
  issueId: string;
  action: 'add-field' | 'update-value' | 'fix-annotation' | 'regenerate-section' | 'validate-contract';
  description: string;
  changes: BlueprintChange[];
  riskLevel: 'safe' | 'moderate' | 'high';
  requiresUserApproval: boolean;
}

interface BlueprintChange {
  path: string;
  operation: 'add' | 'update' | 'remove';
  oldValue?: any;
  newValue: any;
  rationale: string;
}

interface HealingReport {
  timestamp: string;
  blueprintsScanned: number;
  healthyCount: number;
  repairedCount: number;
  issuesDetected: number;
  issuesFixed: number;
  criticalIssues: number;
  summary: string;
  recommendations: string[];
}

class SelfHealingBlueprintEngine {
  private frameworkRoot: string;
  private blueprintsPath: string;
  private healingHistory: HealingReport[] = [];

  constructor(frameworkRoot: string = process.cwd()) {
    this.frameworkRoot = frameworkRoot;
    this.blueprintsPath = path.join(frameworkRoot, 'blueprints');
    this.loadHealingHistory();
  }

  async healAllBlueprints(autoFix: boolean = false): Promise<HealingReport> {
    console.log("🔧 Starting blueprint self-healing scan...");

    const startTime = new Date();
    const blueprints = await this.discoverBlueprints();
    const healthChecks: BlueprintHealth[] = [];
    
    let repairedCount = 0;
    let issuesDetected = 0;
    let issuesFixed = 0;
    let criticalIssues = 0;

    for (const blueprintPath of blueprints) {
      console.log(`  🔍 Analyzing ${path.basename(blueprintPath)}...`);
      
      const health = await this.analyzeBlueprint(blueprintPath);
      healthChecks.push(health);
      
      issuesDetected += health.issues.length;
      criticalIssues += health.issues.filter(i => i.severity === 'critical').length;
      
      if (autoFix && health.autoRepairable) {
        const fixed = await this.repairBlueprint(health);
        if (fixed) {
          repairedCount++;
          issuesFixed += health.issues.filter(i => i.autoFixAvailable).length;
        }
      }
    }

    const healthyCount = healthChecks.filter(h => h.status === 'healthy').length;
    
    const report: HealingReport = {
      timestamp: new Date().toISOString(),
      blueprintsScanned: blueprints.length,
      healthyCount,
      repairedCount,
      issuesDetected,
      issuesFixed,
      criticalIssues,
      summary: this.generateHealingSummary(healthChecks, autoFix),
      recommendations: this.generateHealingRecommendations(healthChecks)
    };

    await this.saveHealingReport(report);
    this.displayHealingReport(report);

    console.log(`✨ Blueprint healing completed in ${Date.now() - startTime.getTime()}ms`);
    
    return report;
  }

  async analyzeBlueprint(blueprintPath: string): Promise<BlueprintHealth> {
    const issues: BlueprintIssue[] = [];
    const repairActions: RepairAction[] = [];
    
    let blueprintData: any = {};
    let blueprintId = 'unknown';
    
    try {
      // Load and parse blueprint
      const content = fs.readFileSync(blueprintPath, 'utf8');
      blueprintData = yaml.load(content) as any;
      blueprintId = blueprintData.id || path.basename(path.dirname(blueprintPath));
      
      // Validate schema structure
      await this.validateBlueprintSchema(blueprintData, blueprintPath, issues);
      
      // Check annotations and metadata
      await this.validateAnnotations(blueprintData, blueprintPath, issues);
      
      // Validate contracts and rules
      await this.validateContracts(blueprintData, blueprintPath, issues);
      
      // Check version consistency
      await this.validateVersionConsistency(blueprintData, blueprintPath, issues);
      
      // Generate repair actions for detected issues
      for (const issue of issues) {
        const repairAction = await this.generateRepairAction(issue, blueprintData);
        if (repairAction) {
          repairActions.push(repairAction);
        }
      }
      
    } catch (error) {
      issues.push({
        id: 'parse-error',
        type: 'schema-violation',
        severity: 'critical',
        description: `Failed to parse blueprint: ${error}`,
        location: blueprintPath,
        expected: 'Valid YAML structure',
        actual: 'Parse error',
        repairSuggestion: 'Fix YAML syntax errors',
        autoFixAvailable: false
      });
    }

    const validationScore = this.calculateValidationScore(issues);
    const status = this.determineHealthStatus(validationScore, issues);
    const autoRepairable = repairActions.every(action => !action.requiresUserApproval);

    return {
      blueprintId,
      filePath: blueprintPath,
      status,
      issues,
      repairActions,
      validationScore,
      lastChecked: new Date().toISOString(),
      autoRepairable
    };
  }

  private async validateBlueprintSchema(blueprint: any, filePath: string, issues: BlueprintIssue[]): Promise<void> {
    const requiredFields = ['id', 'name', 'version'];
    
    for (const field of requiredFields) {
      if (!blueprint[field]) {
        issues.push({
          id: `missing-${field}`,
          type: 'missing-required',
          severity: 'high',
          description: `Required field '${field}' is missing`,
          location: `${filePath}:root.${field}`,
          expected: `${field}: <value>`,
          actual: 'undefined',
          repairSuggestion: `Add required ${field} field to blueprint root`,
          autoFixAvailable: field === 'version' // We can auto-generate version
        });
      }
    }

    // Check for observability events
    if (!blueprint.observability || !blueprint.observability.events) {
      issues.push({
        id: 'missing-observability',
        type: 'missing-required',
        severity: 'medium',
        description: 'Observability events section is missing',
        location: `${filePath}:observability.events`,
        expected: 'observability.events: []',
        actual: 'undefined',
        repairSuggestion: 'Add observability.events array for telemetry',
        autoFixAvailable: true
      });
    }

    // Check for error states
    if (!blueprint.errorStates || blueprint.errorStates.length === 0) {
      issues.push({
        id: 'missing-error-states',
        type: 'missing-required',
        severity: 'medium',
        description: 'Error states are not defined',
        location: `${filePath}:errorStates`,
        expected: 'errorStates: [...]',
        actual: 'undefined or empty',
        repairSuggestion: 'Add error state definitions for fallback UX',
        autoFixAvailable: true
      });
    }
  }

  private async validateAnnotations(blueprint: any, filePath: string, issues: BlueprintIssue[]): Promise<void> {
    // Check if blueprint has proper framework version annotation
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (!content.includes('@aegisFrameworkVersion')) {
      issues.push({
        id: 'missing-framework-annotation',
        type: 'annotation-error',
        severity: 'medium',
        description: 'Missing @aegisFrameworkVersion annotation',
        location: `${filePath}:metadata`,
        expected: '@aegisFrameworkVersion: 1.2.0-alpha',
        actual: 'no annotation',
        repairSuggestion: 'Add framework version annotation to blueprint header',
        autoFixAvailable: true
      });
    }

    if (!content.includes('@intent')) {
      issues.push({
        id: 'missing-intent-annotation',
        type: 'annotation-error',
        severity: 'low',
        description: 'Missing @intent annotation',
        location: `${filePath}:metadata`,
        expected: '@intent: <description>',
        actual: 'no annotation',
        repairSuggestion: 'Add intent annotation describing blueprint purpose',
        autoFixAvailable: true
      });
    }
  }

  private async validateContracts(blueprint: any, filePath: string, issues: BlueprintIssue[]): Promise<void> {
    if (blueprint.ruleContracts) {
      for (const [ruleId, contract] of Object.entries(blueprint.ruleContracts)) {
        if (!contract || typeof contract !== 'object') {
          issues.push({
            id: `invalid-contract-${ruleId}`,
            type: 'contract-inconsistency',
            severity: 'medium',
            description: `Rule contract '${ruleId}' is invalid`,
            location: `${filePath}:ruleContracts.${ruleId}`,
            expected: 'Valid contract object',
            actual: typeof contract,
            repairSuggestion: 'Fix or remove invalid rule contract',
            autoFixAvailable: false
          });
        }
      }
    }
  }

  private async validateVersionConsistency(blueprint: any, filePath: string, issues: BlueprintIssue[]): Promise<void> {
    const currentVersion = this.loadCurrentFrameworkVersion();
    
    if (blueprint.version && blueprint.version !== currentVersion) {
      // Check if it's a valid version format
      const versionPattern = /^\d+\.\d+\.\d+(-\w+)?$/;
      if (!versionPattern.test(blueprint.version)) {
        issues.push({
          id: 'invalid-version-format',
          type: 'version-mismatch',
          severity: 'medium',
          description: 'Blueprint version format is invalid',
          location: `${filePath}:version`,
          expected: 'Semantic version (e.g., 1.2.0-alpha)',
          actual: blueprint.version,
          repairSuggestion: 'Update to valid semantic version format',
          autoFixAvailable: true
        });
      }
    }
  }

  private async generateRepairAction(issue: BlueprintIssue, blueprint: any): Promise<RepairAction | null> {
    if (!issue.autoFixAvailable) return null;

    const changes: BlueprintChange[] = [];
    let action: RepairAction['action'] = 'update-value';
    let riskLevel: RepairAction['riskLevel'] = 'safe';

    switch (issue.id) {
      case 'missing-version':
        changes.push({
          path: 'version',
          operation: 'add',
          newValue: this.loadCurrentFrameworkVersion(),
          rationale: 'Add current framework version'
        });
        action = 'add-field';
        break;

      case 'missing-observability':
        changes.push({
          path: 'observability.events',
          operation: 'add',
          newValue: [
            {
              name: 'blueprint-initialized',
              description: 'Blueprint instance created',
              level: 'info'
            }
          ],
          rationale: 'Add default observability events for telemetry'
        });
        action = 'add-field';
        break;

      case 'missing-error-states':
        changes.push({
          path: 'errorStates',
          operation: 'add',
          newValue: [
            {
              name: 'initialization-failed',
              fallbackUX: 'Show generic error message',
              recovery: 'Retry initialization'
            }
          ],
          rationale: 'Add default error state for fallback UX'
        });
        action = 'add-field';
        break;

      case 'missing-framework-annotation':
        changes.push({
          path: 'metadata-header',
          operation: 'add',
          newValue: `@aegisFrameworkVersion: ${this.loadCurrentFrameworkVersion()}`,
          rationale: 'Add required framework version annotation'
        });
        action = 'fix-annotation';
        break;

      case 'missing-intent-annotation':
        changes.push({
          path: 'metadata-header',
          operation: 'add',
          newValue: `@intent: ${blueprint.description || 'Blueprint implementation'}`,
          rationale: 'Add intent annotation based on blueprint description'
        });
        action = 'fix-annotation';
        riskLevel = 'moderate';
        break;

      case 'invalid-version-format':
        changes.push({
          path: 'version',
          operation: 'update',
          oldValue: blueprint.version,
          newValue: this.normalizeVersion(blueprint.version),
          rationale: 'Fix version format to semantic versioning'
        });
        riskLevel = 'safe';
        break;

      default:
        return null;
    }

    return {
      issueId: issue.id,
      action,
      description: `Auto-repair: ${issue.repairSuggestion}`,
      changes,
      riskLevel,
      requiresUserApproval: riskLevel === 'high'
    };
  }

  async repairBlueprint(health: BlueprintHealth): Promise<boolean> {
    console.log(`  🔧 Auto-repairing ${health.blueprintId}...`);

    try {
      let content = fs.readFileSync(health.filePath, 'utf8');
      let blueprintData = yaml.load(content) as any;
      let modified = false;

      for (const action of health.repairActions) {
        if (action.requiresUserApproval) {
          console.log(`    ⚠️ Skipping ${action.issueId} - requires user approval`);
          continue;
        }

        for (const change of action.changes) {
          if (change.path === 'metadata-header') {
            // Add annotation to file header
            const lines = content.split('\n');
            const yamlStart = lines.findIndex(line => line.trim() && !line.startsWith('#'));
            
            if (yamlStart > 0) {
              lines.splice(yamlStart, 0, `# ${change.newValue}`);
              content = lines.join('\n');
              modified = true;
            }
          } else {
            // Modify YAML data
            const pathParts = change.path.split('.');
            let target = blueprintData;
            
            for (let i = 0; i < pathParts.length - 1; i++) {
              if (!target[pathParts[i]]) {
                target[pathParts[i]] = {};
              }
              target = target[pathParts[i]];
            }
            
            const finalKey = pathParts[pathParts.length - 1];
            
            if (change.operation === 'add' || change.operation === 'update') {
              target[finalKey] = change.newValue;
              modified = true;
            } else if (change.operation === 'remove') {
              delete target[finalKey];
              modified = true;
            }
          }
        }
      }

      if (modified) {
        // Save repaired blueprint
        if (content.includes('# @aegisFrameworkVersion') || content.includes('# @intent')) {
          // Keep existing content with added annotations
          fs.writeFileSync(health.filePath, content);
        } else {
          // Regenerate YAML content
          const newContent = yaml.dump(blueprintData, { indent: 2 });
          fs.writeFileSync(health.filePath, newContent);
        }
        
        console.log(`    ✅ Repaired ${health.repairActions.length} issues in ${health.blueprintId}`);
        
        // Log repair action
        await this.logRepairAction(health, health.repairActions[0]);
        
        return true;
      }
    } catch (error) {
      console.error(`    ❌ Failed to repair ${health.blueprintId}: ${error}`);
    }

    return false;
  }

  // Helper methods
  private async discoverBlueprints(): Promise<string[]> {
    const blueprints: string[] = [];
    
    if (!fs.existsSync(this.blueprintsPath)) {
      return blueprints;
    }

    const entries = fs.readdirSync(this.blueprintsPath, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const blueprintFile = path.join(this.blueprintsPath, entry.name, 'blueprint.yaml');
        if (fs.existsSync(blueprintFile)) {
          blueprints.push(blueprintFile);
        }
      }
    }

    return blueprints;
  }

  private calculateValidationScore(issues: BlueprintIssue[]): number {
    if (issues.length === 0) return 100;

    const severityWeights = { low: 1, medium: 3, high: 7, critical: 15 };
    const totalPenalty = issues.reduce((sum, issue) => sum + severityWeights[issue.severity], 0);
    
    return Math.max(0, 100 - totalPenalty);
  }

  private determineHealthStatus(score: number, issues: BlueprintIssue[]): BlueprintHealth['status'] {
    const hasCritical = issues.some(i => i.severity === 'critical');
    
    if (hasCritical) return 'corrupted';
    if (score >= 90) return 'healthy';
    if (score >= 70) return 'warning';
    return 'critical';
  }

  private loadCurrentFrameworkVersion(): string {
    try {
      const versionPath = path.join(this.frameworkRoot, 'VERSION');
      return fs.readFileSync(versionPath, 'utf8').trim();
    } catch {
      return '1.2.0-alpha';
    }
  }

  private normalizeVersion(version: string): string {
    // Simple version normalization
    if (!version) return '1.0.0';
    
    const parts = version.split('.');
    while (parts.length < 3) parts.push('0');
    
    return parts.slice(0, 3).join('.');
  }

  private generateHealingSummary(healthChecks: BlueprintHealth[], autoFix: boolean): string {
    const total = healthChecks.length;
    const healthy = healthChecks.filter(h => h.status === 'healthy').length;
    const critical = healthChecks.filter(h => h.status === 'critical' || h.status === 'corrupted').length;
    
    let summary = `Scanned ${total} blueprints: ${healthy} healthy, ${critical} critical issues`;
    
    if (autoFix) {
      const repaired = healthChecks.filter(h => h.autoRepairable).length;
      summary += `, ${repaired} auto-repaired`;
    }
    
    return summary;
  }

  private generateHealingRecommendations(healthChecks: BlueprintHealth[]): string[] {
    const recommendations: string[] = [];
    
    const needsAttention = healthChecks.filter(h => h.status !== 'healthy');
    if (needsAttention.length > 0) {
      recommendations.push(`Review ${needsAttention.length} blueprints requiring attention`);
    }
    
    const manualRepairs = healthChecks.filter(h => 
      h.repairActions.some(action => action.requiresUserApproval)
    );
    if (manualRepairs.length > 0) {
      recommendations.push(`${manualRepairs.length} blueprints need manual review for complex repairs`);
    }
    
    recommendations.push('Schedule regular blueprint health checks');
    recommendations.push('Consider implementing blueprint validation in CI/CD pipeline');
    
    return recommendations;
  }

  private async saveHealingReport(report: HealingReport): Promise<void> {
    this.healingHistory.push(report);
    
    const reportsPath = path.join(this.frameworkRoot, 'framework/healing');
    if (!fs.existsSync(reportsPath)) {
      fs.mkdirSync(reportsPath, { recursive: true });
    }
    
    const reportFile = path.join(reportsPath, 'healing-history.json');
    fs.writeFileSync(reportFile, JSON.stringify(this.healingHistory, null, 2));
    
    // Also save individual report
    const timestamp = report.timestamp.replace(/[:.]/g, '-');
    const individualReport = path.join(reportsPath, `healing-report-${timestamp}.json`);
    fs.writeFileSync(individualReport, JSON.stringify(report, null, 2));
  }

  private loadHealingHistory(): void {
    try {
      const historyPath = path.join(this.frameworkRoot, 'framework/healing/healing-history.json');
      if (fs.existsSync(historyPath)) {
        this.healingHistory = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
      }
    } catch (error) {
      console.warn('Could not load healing history');
    }
  }

  private async logRepairAction(health: BlueprintHealth, action: RepairAction): Promise<void> {
    const logPath = path.join(this.frameworkRoot, 'framework/healing/repair-log.json');
    
    let log: any[] = [];
    if (fs.existsSync(logPath)) {
      log = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    }
    
    log.push({
      timestamp: new Date().toISOString(),
      blueprintId: health.blueprintId,
      action: action.description,
      changes: action.changes,
      automated: true
    });
    
    fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
  }

  displayHealingReport(report: HealingReport): void {
    console.log("\n🔧 Blueprint Self-Healing Report");
    console.log("==============================");
    console.log(`Scan Time: ${new Date(report.timestamp).toLocaleString()}`);
    console.log(`Blueprints Scanned: ${report.blueprintsScanned}`);
    console.log(`Healthy: ${report.healthyCount}`);
    console.log(`Auto-Repaired: ${report.repairedCount}`);
    console.log(`Issues Detected: ${report.issuesDetected}`);
    console.log(`Issues Fixed: ${report.issuesFixed}`);
    console.log(`Critical Issues: ${report.criticalIssues}`);
    console.log("");
    console.log(`Summary: ${report.summary}`);
    
    if (report.recommendations.length > 0) {
      console.log("\n💡 Recommendations:");
      report.recommendations.forEach(rec => console.log(`  ${rec}`));
    }
  }
}

// CLI usage
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const autoFix = args.includes('--auto-fix') || args.includes('-f');
  
  const engine = new SelfHealingBlueprintEngine();
  
  switch (command) {
    case 'heal':
      await engine.healAllBlueprints(autoFix);
      break;
      
    case 'scan':
      await engine.healAllBlueprints(false);
      break;
      
    default:
      console.log("🔧 Self-Healing Blueprint Engine");
      console.log("Available commands:");
      console.log("  scan - Analyze blueprint health without repairs");
      console.log("  heal - Analyze and auto-repair blueprints");
      console.log("  heal --auto-fix - Enable automatic repairs");
      break;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { SelfHealingBlueprintEngine };
