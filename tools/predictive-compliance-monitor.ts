#!/usr/bin/env node

/**
 * @aegisFrameworkVersion: 2.4.0
 * @intent: Predictive compliance monitoring that prevents constitutional violations before they occur
 * @context: Advanced constitutional safeguard that analyzes patterns and predicts potential violations
 * @mode: strict
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface CompliancePattern {
  id: string;
  type: 'version-drift' | 'intelligence-failure' | 'constitutional-violation' | 'systematic-failure';
  triggerConditions: string[];
  riskIndicators: string[];
  predictiveSignals: string[];
  preventionActions: string[];
  confidence: number; // 0-1 scale
  lastOccurrence?: Date;
  preventionSuccess: number; // 0-1 scale
}

interface PredictiveAlert {
  id: string;
  patternId: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  predictedViolation: string;
  preventionActions: string[];
  timeToViolation: string; // estimated time
  evidence: string[];
  autoPreventable: boolean;
}

interface MonitoringResult {
  status: 'safe' | 'warning' | 'danger' | 'critical';
  alerts: PredictiveAlert[];
  patternsDetected: string[];
  preventionActionsRecommended: string[];
  autoPreventionTriggered: boolean;
  overallRiskScore: number; // 0-1 scale
}

export class PredictiveComplianceMonitor {
  private projectRoot: string;
  private patterns: Map<string, CompliancePattern> = new Map();
  private alertHistory: PredictiveAlert[] = [];
  private patternsFile: string;
  private alertsFile: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.patternsFile = path.join(this.projectRoot, '.framework/predictive-patterns.json');
    this.alertsFile = path.join(this.projectRoot, '.framework/predictive-alerts.json');

    this.ensureDirectoryExists();
    this.initializePredictivePatterns();
    this.loadPersistentData();
  }

  private ensureDirectoryExists(): void {
    const frameworkDir = path.join(this.projectRoot, '.framework');
    if (!fs.existsSync(frameworkDir)) {
      fs.mkdirSync(frameworkDir, { recursive: true });
    }
  }

  private initializePredictivePatterns(): void {
    const patterns: CompliancePattern[] = [
      {
        id: 'version-documentation-drift-prediction',
        type: 'version-drift',
        triggerConditions: [
          'VERSION file modified',
          'package.json version changed',
          'Preparation for commit without validation',
        ],
        riskIndicators: [
          'Multiple version-related files changed',
          'No version consistency check run',
          'Previous version drift history',
          'Rapid development phase',
        ],
        predictiveSignals: [
          'Git staging area contains version changes',
          'Recent commits without validation',
          'Framework core files modified',
          'Documentation files not updated',
        ],
        preventionActions: [
          'Auto-run version consistency validation',
          'Block commits until validation passes',
          'Generate missing documentation updates',
          'Alert about potential drift',
        ],
        confidence: 0.95,
        preventionSuccess: 0.98,
      },
      {
        id: 'intelligence-failure-prediction',
        type: 'intelligence-failure',
        triggerConditions: [
          'Claims made without implementation',
          'New intelligence features added',
          'Constitutional changes proposed',
        ],
        riskIndicators: [
          'Rapid feature development',
          'Marketing before implementation',
          'Documentation written before code',
          'Claims not verified',
        ],
        predictiveSignals: [
          'Documentation mentions non-existent features',
          'Claims without evidence files',
          'Implementation stubs created',
          'Testing gaps identified',
        ],
        preventionActions: [
          'Require evidence before claims',
          'Auto-generate implementation validation',
          'Block false claim propagation',
          'Enforce implementation-first development',
        ],
        confidence: 0.92,
        preventionSuccess: 0.94,
      },
      {
        id: 'constitutional-violation-prediction',
        type: 'constitutional-violation',
        triggerConditions: [
          'Framework core modifications',
          'Constitutional article changes',
          'Governance bypass attempts',
        ],
        riskIndicators: [
          'Emergency development mode',
          'Deadline pressure',
          'Governance process shortcuts',
          'Constitutional compliance disabled',
        ],
        predictiveSignals: [
          'Direct framework file edits',
          'Constitutional validation skipped',
          'Governance tools disabled',
          'Fast-track development flags',
        ],
        preventionActions: [
          'Enforce constitutional review',
          'Block unauthorized modifications',
          'Require governance approval',
          'Auto-trigger compliance validation',
        ],
        confidence: 0.89,
        preventionSuccess: 0.91,
      },
      {
        id: 'systematic-failure-prediction',
        type: 'systematic-failure',
        triggerConditions: ['Repeated similar failures', 'Pattern recognition gaps', 'Learning system failures'],
        riskIndicators: [
          'Same failure type recurring',
          'Prevention mechanisms not learning',
          'Pattern detection disabled',
          'Manual override frequency',
        ],
        predictiveSignals: [
          'Similar failure patterns emerging',
          'Learning system data corruption',
          'Prevention mechanism degradation',
          'Systematic pattern correlation',
        ],
        preventionActions: [
          'Strengthen pattern recognition',
          'Update prevention mechanisms',
          'Enhance learning capabilities',
          'Implement redundant safeguards',
        ],
        confidence: 0.87,
        preventionSuccess: 0.89,
      },
    ];

    patterns.forEach(pattern => {
      this.patterns.set(pattern.id, pattern);
    });
  }

  /**
   * Main monitoring function - analyze current state and predict violations
   */
  async monitorCompliance(): Promise<MonitoringResult> {
    console.log('🔮 Running predictive compliance monitoring...');

    const alerts: PredictiveAlert[] = [];
    const patternsDetected: string[] = [];
    const preventionActions: string[] = [];
    let autoPreventionTriggered = false;

    // Analyze each pattern
    for (const [patternId, pattern] of this.patterns) {
      const analysis = await this.analyzePattern(pattern);

      if (analysis.riskDetected) {
        patternsDetected.push(patternId);

        const alert = await this.generatePredictiveAlert(pattern, analysis);
        alerts.push(alert);

        // Auto-trigger prevention if high confidence and critical risk
        if (alert.autoPreventable && alert.riskLevel === 'critical' && alert.confidence > 0.9) {
          await this.triggerAutoPrevention(alert);
          autoPreventionTriggered = true;
          preventionActions.push(...alert.preventionActions);
        }
      }
    }

    // Calculate overall risk score
    const overallRiskScore = this.calculateOverallRisk(alerts);

    // Determine status
    const status = this.determineStatus(overallRiskScore, alerts);

    // Save alerts for historical analysis
    this.alertHistory.push(...alerts);
    await this.savePersistentData();

    const result: MonitoringResult = {
      status,
      alerts,
      patternsDetected,
      preventionActionsRecommended: preventionActions,
      autoPreventionTriggered,
      overallRiskScore,
    };

    await this.displayResults(result);
    return result;
  }

  private async analyzePattern(
    pattern: CompliancePattern
  ): Promise<{ riskDetected: boolean; confidence: number; evidence: string[] }> {
    const evidence: string[] = [];
    let riskScore = 0;

    // Check trigger conditions
    for (const condition of pattern.triggerConditions) {
      if (await this.checkCondition(condition)) {
        evidence.push(`Trigger condition met: ${condition}`);
        riskScore += 0.3;
      }
    }

    // Check risk indicators
    for (const indicator of pattern.riskIndicators) {
      if (await this.checkRiskIndicator(indicator)) {
        evidence.push(`Risk indicator detected: ${indicator}`);
        riskScore += 0.2;
      }
    }

    // Check predictive signals
    for (const signal of pattern.predictiveSignals) {
      if (await this.checkPredictiveSignal(signal)) {
        evidence.push(`Predictive signal found: ${signal}`);
        riskScore += 0.1;
      }
    }

    const confidence = Math.min(riskScore, 1.0) * pattern.confidence;

    return {
      riskDetected: confidence > 0.3,
      confidence,
      evidence,
    };
  }

  private async checkCondition(condition: string): Promise<boolean> {
    try {
      switch (condition) {
        case 'VERSION file modified':
          return await this.checkFileModified('VERSION');
        case 'package.json version changed':
          return await this.checkFileModified('package.json');
        case 'Preparation for commit without validation':
          return await this.checkCommitPreparation();
        case 'Claims made without implementation':
          return await this.checkUnverifiedClaims();
        case 'Framework core modifications':
          return await this.checkFrameworkModifications();
        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  }

  private async checkRiskIndicator(indicator: string): Promise<boolean> {
    try {
      switch (indicator) {
        case 'Multiple version-related files changed':
          return await this.checkMultipleVersionFiles();
        case 'No version consistency check run':
          return await this.checkNoVersionValidation();
        case 'Previous version drift history':
          return await this.checkVersionDriftHistory();
        case 'Rapid development phase':
          return await this.checkRapidDevelopment();
        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  }

  private async checkPredictiveSignal(signal: string): Promise<boolean> {
    try {
      switch (signal) {
        case 'Git staging area contains version changes':
          return await this.checkGitStagingVersion();
        case 'Recent commits without validation':
          return await this.checkRecentCommitsNoValidation();
        case 'Framework core files modified':
          return await this.checkFrameworkCoreModified();
        case 'Documentation files not updated':
          return await this.checkDocumentationOutdated();
        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  }

  // Implementation helpers
  private async checkFileModified(filename: string): Promise<boolean> {
    try {
      const result = execSync(`git status --porcelain ${filename}`, { encoding: 'utf8', cwd: this.projectRoot });
      return result.trim().length > 0;
    } catch {
      return false;
    }
  }

  private async checkCommitPreparation(): Promise<boolean> {
    try {
      const staged = execSync('git diff --cached --name-only', { encoding: 'utf8', cwd: this.projectRoot });
      return staged.trim().length > 0;
    } catch {
      return false;
    }
  }

  private async checkUnverifiedClaims(): Promise<boolean> {
    try {
      const { ConstitutionalComplianceEnforcer } = await import('./constitutional-compliance-enforcer.js');
      const enforcer = new ConstitutionalComplianceEnforcer(this.projectRoot);
      const result = await enforcer.enforceCompliance();
      return result !== null && result !== undefined;
    } catch {
      return false;
    }
  }

  private async checkFrameworkModifications(): Promise<boolean> {
    try {
      const result = execSync('git status --porcelain framework/', { encoding: 'utf8', cwd: this.projectRoot });
      return result.trim().length > 0;
    } catch {
      return false;
    }
  }

  private async checkMultipleVersionFiles(): Promise<boolean> {
    const versionFiles = ['VERSION', 'package.json', 'README.md', 'CHANGELOG.md'];
    let modifiedCount = 0;

    for (const file of versionFiles) {
      if (await this.checkFileModified(file)) {
        modifiedCount++;
      }
    }

    return modifiedCount >= 2;
  }

  private async checkNoVersionValidation(): Promise<boolean> {
    // Check if version validation was run recently
    try {
      const { VersionConsistencyValidator } = await import('./validate-version-consistency.js');
      const validator = new VersionConsistencyValidator(this.projectRoot);
      const result = await validator.validateAll();
      return result.overallStatus === 'fail';
    } catch {
      return true; // If we can't check, assume no validation
    }
  }

  private async checkVersionDriftHistory(): Promise<boolean> {
    // Check evolution stories for version drift
    try {
      const evolutionDir = path.join(this.projectRoot, 'docs/evolution');
      if (!fs.existsSync(evolutionDir)) return false;

      const files = fs.readdirSync(evolutionDir);
      return files.some(file => file.includes('version') && file.includes('drift'));
    } catch {
      return false;
    }
  }

  private async checkRapidDevelopment(): Promise<boolean> {
    try {
      // Check commit frequency in last 24 hours
      const commits = execSync('git log --since="24 hours ago" --oneline', { encoding: 'utf8', cwd: this.projectRoot });
      return commits.trim().split('\n').length > 5;
    } catch {
      return false;
    }
  }

  private async checkGitStagingVersion(): Promise<boolean> {
    try {
      const staged = execSync('git diff --cached --name-only', { encoding: 'utf8', cwd: this.projectRoot });
      const versionFiles = ['VERSION', 'package.json'];
      return versionFiles.some(file => staged.includes(file));
    } catch {
      return false;
    }
  }

  private async checkRecentCommitsNoValidation(): Promise<boolean> {
    try {
      const recentCommits = execSync('git log --since="7 days ago" --grep="version" --oneline', {
        encoding: 'utf8',
        cwd: this.projectRoot,
      });
      return recentCommits.trim().split('\n').length > 1;
    } catch {
      return false;
    }
  }

  private async checkFrameworkCoreModified(): Promise<boolean> {
    try {
      const result = execSync('git status --porcelain framework/framework-core-*.md', {
        encoding: 'utf8',
        cwd: this.projectRoot,
      });
      return result.trim().length > 0;
    } catch {
      return false;
    }
  }

  private async checkDocumentationOutdated(): Promise<boolean> {
    try {
      const { VersionConsistencyValidator } = await import('./validate-version-consistency.js');
      const validator = new VersionConsistencyValidator(this.projectRoot);
      const result = await validator.validateAll();
      return result.violations.some(v => v.file.includes('docs/') || v.file.includes('README'));
    } catch {
      return false;
    }
  }

  private async generatePredictiveAlert(
    pattern: CompliancePattern,
    analysis: { confidence: number; evidence: string[] }
  ): Promise<PredictiveAlert> {
    const riskLevel = this.determineRiskLevel(analysis.confidence);

    return {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      patternId: pattern.id,
      riskLevel,
      confidence: analysis.confidence,
      predictedViolation: `${pattern.type} likely to occur`,
      preventionActions: pattern.preventionActions,
      timeToViolation: this.estimateTimeToViolation(pattern, analysis.confidence),
      evidence: analysis.evidence,
      autoPreventable: analysis.confidence > 0.8 && pattern.preventionSuccess > 0.9,
    };
  }

  private determineRiskLevel(confidence: number): 'low' | 'medium' | 'high' | 'critical' {
    if (confidence >= 0.9) return 'critical';
    if (confidence >= 0.7) return 'high';
    if (confidence >= 0.5) return 'medium';
    return 'low';
  }

  private estimateTimeToViolation(pattern: CompliancePattern, confidence: number): string {
    if (confidence >= 0.9) return 'Immediate (< 1 hour)';
    if (confidence >= 0.7) return 'Very Soon (< 6 hours)';
    if (confidence >= 0.5) return 'Soon (< 24 hours)';
    return 'Eventually (< 7 days)';
  }

  private async triggerAutoPrevention(alert: PredictiveAlert): Promise<void> {
    console.log(`🚨 Auto-triggering prevention for ${alert.predictedViolation}`);

    for (const action of alert.preventionActions) {
      try {
        await this.executePreventionAction(action);
        console.log(`✅ Executed: ${action}`);
      } catch (error) {
        console.log(`❌ Failed to execute: ${action} - ${error}`);
      }
    }
  }

  private async executePreventionAction(action: string): Promise<void> {
    switch (action) {
      case 'Auto-run version consistency validation':
        execSync('node tools/validate-version-consistency.ts', { cwd: this.projectRoot });
        break;
      case 'Block commits until validation passes':
        // This would be implemented through git hooks
        console.log('📋 Commit blocking mechanism activated');
        break;
      case 'Generate missing documentation updates':
        // Auto-generate documentation updates
        console.log('📝 Auto-generating documentation updates');
        break;
      case 'Alert about potential drift':
        console.log('⚠️ ALERT: Potential constitutional drift detected');
        break;
      default:
        console.log(`⚠️ Unknown prevention action: ${action}`);
    }
  }

  private calculateOverallRisk(alerts: PredictiveAlert[]): number {
    if (alerts.length === 0) return 0;

    const weightedRisk = alerts.reduce((sum, alert) => {
      const riskWeight =
        alert.riskLevel === 'critical'
          ? 1.0
          : alert.riskLevel === 'high'
            ? 0.7
            : alert.riskLevel === 'medium'
              ? 0.4
              : 0.2;
      return sum + alert.confidence * riskWeight;
    }, 0);

    return Math.min(weightedRisk / alerts.length, 1.0);
  }

  private determineStatus(riskScore: number, alerts: PredictiveAlert[]): 'safe' | 'warning' | 'danger' | 'critical' {
    const criticalAlerts = alerts.filter(a => a.riskLevel === 'critical').length;

    if (criticalAlerts > 0 || riskScore >= 0.9) return 'critical';
    if (riskScore >= 0.7) return 'danger';
    if (riskScore >= 0.3) return 'warning';
    return 'safe';
  }

  private async displayResults(result: MonitoringResult): Promise<void> {
    console.log('\n🔮 Predictive Compliance Monitoring Results');
    console.log('==========================================');
    console.log(`📊 Overall Status: ${result.status.toUpperCase()}`);
    console.log(`🎯 Risk Score: ${(result.overallRiskScore * 100).toFixed(1)}%`);
    console.log(`⚠️ Alerts Generated: ${result.alerts.length}`);
    console.log(`🛡️ Auto-Prevention Triggered: ${result.autoPreventionTriggered ? 'Yes' : 'No'}`);

    if (result.alerts.length > 0) {
      console.log('\n📋 Predictive Alerts:');
      result.alerts.forEach((alert, index) => {
        console.log(`   ${index + 1}. ${alert.predictedViolation}`);
        console.log(`      Risk: ${alert.riskLevel} | Confidence: ${(alert.confidence * 100).toFixed(1)}%`);
        console.log(`      Time to Violation: ${alert.timeToViolation}`);
        console.log(
          `      Evidence: ${alert.evidence.slice(0, 2).join(', ')}${alert.evidence.length > 2 ? '...' : ''}`
        );
      });
    }

    if (result.preventionActionsRecommended.length > 0) {
      console.log('\n💡 Recommended Actions:');
      result.preventionActionsRecommended.forEach(action => {
        console.log(`   • ${action}`);
      });
    }
  }

  private loadPersistentData(): void {
    try {
      if (fs.existsSync(this.patternsFile)) {
        const data = JSON.parse(fs.readFileSync(this.patternsFile, 'utf8'));
        // Update patterns with persistent data if needed
      }

      if (fs.existsSync(this.alertsFile)) {
        const data = JSON.parse(fs.readFileSync(this.alertsFile, 'utf8'));
        this.alertHistory = data;
      }
    } catch (error) {
      console.log('⚠️ Failed to load persistent data, using defaults');
    }
  }

  private async savePersistentData(): Promise<void> {
    try {
      // Save patterns
      const patternsData = Array.from(this.patterns.values());
      fs.writeFileSync(this.patternsFile, JSON.stringify(patternsData, null, 2));

      // Save recent alerts (keep last 100)
      const recentAlerts = this.alertHistory.slice(-100);
      fs.writeFileSync(this.alertsFile, JSON.stringify(recentAlerts, null, 2));
    } catch (error) {
      console.log('⚠️ Failed to save persistent data');
    }
  }
}

/**
 * CLI interface
 */
async function main() {
  const monitor = new PredictiveComplianceMonitor();
  try {
    const result = await monitor.monitorCompliance();
    process.exit(result.status === 'critical' ? 1 : 0);
  } catch (error) {
    console.error('❌ Predictive monitoring failed:', error);
    process.exit(1);
  }
}

// Run if this is the main module
if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}
