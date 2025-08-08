#!/usr/bin/env node

/**
 * @aegisFrameworkVersion: 2.4.0
 * @intent: Continuous compliance monitoring that ensures constitutional adherence at all times
 * @context: Always-on constitutional safeguard that monitors and enforces compliance continuously
 * @mode: strict
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface MonitoringEvent {
  id: string;
  timestamp: Date;
  type: 'compliance-check' | 'violation-detected' | 'prevention-triggered' | 'system-health' | 'pattern-detected';
  severity: 'info' | 'warning' | 'error' | 'critical';
  source: string;
  message: string;
  data?: any;
  actionTaken?: string;
  resolved?: boolean;
}

interface ComplianceMetrics {
  timestamp: Date;
  overallCompliance: number; // 0-100
  constitutionalCompliance: number;
  versionConsistency: number;
  preventionEffectiveness: number;
  intelligenceValidation: number;
  systemHealth: number;
  activeViolations: number;
  resolvedViolations: number;
  preventionTriggered: number;
}

interface MonitoringConfig {
  checkInterval: number; // minutes
  enabledMonitors: string[];
  alertThresholds: {
    compliance: number;
    violations: number;
    systemHealth: number;
  };
  autoRemediation: boolean;
  notificationChannels: string[];
}

interface ContinuousMonitoringReport {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number; // hours
  checksPerformed: number;
  violationsDetected: number;
  violationsResolved: number;
  preventionSuccessRate: number;
  currentMetrics: ComplianceMetrics;
  recentEvents: MonitoringEvent[];
  alerts: string[];
  recommendations: string[];
}

export class ContinuousComplianceMonitor {
  private projectRoot: string;
  private config: MonitoringConfig;
  private events: MonitoringEvent[] = [];
  private metrics: ComplianceMetrics[] = [];
  private isRunning: boolean = false;
  private startTime: Date = new Date();
  private intervalId?: NodeJS.Timeout;
  private eventsFile: string;
  private metricsFile: string;
  private configFile: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.eventsFile = path.join(this.projectRoot, '.framework/monitoring-events.json');
    this.metricsFile = path.join(this.projectRoot, '.framework/monitoring-metrics.json');
    this.configFile = path.join(this.projectRoot, '.framework/monitoring-config.json');
    
    this.ensureDirectoryExists();
    this.loadConfiguration();
    this.loadHistoricalData();
  }

  private ensureDirectoryExists(): void {
    const frameworkDir = path.join(this.projectRoot, '.framework');
    if (!fs.existsSync(frameworkDir)) {
      fs.mkdirSync(frameworkDir, { recursive: true });
    }
  }

  private loadConfiguration(): void {
    const defaultConfig: MonitoringConfig = {
      checkInterval: 15, // minutes
      enabledMonitors: [
        'constitutional-compliance',
        'version-consistency',
        'prevention-mechanisms',
        'intelligence-validation',
        'system-health',
        'predictive-analysis'
      ],
      alertThresholds: {
        compliance: 85, // Below 85% compliance triggers alert
        violations: 3,  // More than 3 unresolved violations triggers alert
        systemHealth: 90 // Below 90% system health triggers alert
      },
      autoRemediation: true,
      notificationChannels: ['console', 'file']
    };

    try {
      if (fs.existsSync(this.configFile)) {
        const configData = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
        this.config = { ...defaultConfig, ...configData };
      } else {
        this.config = defaultConfig;
        fs.writeFileSync(this.configFile, JSON.stringify(this.config, null, 2));
      }
    } catch (error) {
      console.log('⚠️ Failed to load monitoring configuration, using defaults');
      this.config = defaultConfig;
    }
  }

  private loadHistoricalData(): void {
    try {
      if (fs.existsSync(this.eventsFile)) {
        const eventsData = JSON.parse(fs.readFileSync(this.eventsFile, 'utf8'));
        this.events = eventsData.map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp)
        }));
      }

      if (fs.existsSync(this.metricsFile)) {
        const metricsData = JSON.parse(fs.readFileSync(this.metricsFile, 'utf8'));
        this.metrics = metricsData.map((metric: any) => ({
          ...metric,
          timestamp: new Date(metric.timestamp)
        }));
      }
    } catch (error) {
      console.log('⚠️ Failed to load historical monitoring data, starting fresh');
    }
  }

  /**
   * Start continuous monitoring
   */
  async startMonitoring(): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️ Monitoring is already running');
      return;
    }

    console.log('🔄 Starting continuous compliance monitoring...');
    console.log(`📊 Check interval: ${this.config.checkInterval} minutes`);
    console.log(`🛡️ Enabled monitors: ${this.config.enabledMonitors.join(', ')}`);
    
    this.isRunning = true;
    this.startTime = new Date();
    
    // Record startup event
    await this.recordEvent({
      type: 'system-health',
      severity: 'info',
      source: 'continuous-monitor',
      message: 'Continuous compliance monitoring started',
      data: { config: this.config }
    });

    // Perform initial check
    await this.performComplianceCheck();

    // Schedule regular checks
    this.intervalId = setInterval(async () => {
      await this.performComplianceCheck();
    }, this.config.checkInterval * 60 * 1000); // Convert minutes to milliseconds

    console.log('✅ Continuous monitoring started successfully');
    console.log('📋 Use Ctrl+C to stop monitoring');
  }

  /**
   * Stop continuous monitoring
   */
  async stopMonitoring(): Promise<void> {
    if (!this.isRunning) {
      console.log('⚠️ Monitoring is not running');
      return;
    }

    console.log('🛑 Stopping continuous compliance monitoring...');
    
    this.isRunning = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Record shutdown event
    await this.recordEvent({
      type: 'system-health',
      severity: 'info',
      source: 'continuous-monitor',
      message: 'Continuous compliance monitoring stopped',
      data: { 
        uptime: this.getUptime(),
        checksPerformed: this.metrics.length 
      }
    });

    await this.saveMonitoringData();
    console.log('✅ Continuous monitoring stopped successfully');
  }

  /**
   * Perform a single compliance check
   */
  private async performComplianceCheck(): Promise<ComplianceMetrics> {
    console.log(`\n🔍 Performing compliance check... (${new Date().toLocaleTimeString()})`);
    
    const metrics: ComplianceMetrics = {
      timestamp: new Date(),
      overallCompliance: 0,
      constitutionalCompliance: 0,
      versionConsistency: 0,
      preventionEffectiveness: 0,
      intelligenceValidation: 0,
      systemHealth: 0,
      activeViolations: 0,
      resolvedViolations: 0,
      preventionTriggered: 0
    };

    let totalChecks = 0;
    let passedChecks = 0;

    // Constitutional compliance check
    if (this.config.enabledMonitors.includes('constitutional-compliance')) {
      try {
        const constitutionalResult = await this.checkConstitutionalCompliance();
        metrics.constitutionalCompliance = constitutionalResult.score;
        totalChecks++;
        if (constitutionalResult.passed) passedChecks++;
        
        if (!constitutionalResult.passed) {
          await this.recordEvent({
            type: 'violation-detected',
            severity: 'error',
            source: 'constitutional-compliance',
            message: `Constitutional compliance check failed: ${constitutionalResult.message}`,
            data: constitutionalResult
          });
          metrics.activeViolations++;
        }
      } catch (error) {
        await this.recordEvent({
          type: 'system-health',
          severity: 'error',
          source: 'constitutional-compliance',
          message: `Constitutional compliance check error: ${error}`
        });
      }
    }

    // Version consistency check
    if (this.config.enabledMonitors.includes('version-consistency')) {
      try {
        const versionResult = await this.checkVersionConsistency();
        metrics.versionConsistency = versionResult.score;
        totalChecks++;
        if (versionResult.passed) passedChecks++;
        
        if (!versionResult.passed) {
          await this.recordEvent({
            type: 'violation-detected',
            severity: 'warning',
            source: 'version-consistency',
            message: `Version consistency issues detected: ${versionResult.message}`,
            data: versionResult
          });
          metrics.activeViolations++;
          
          // Auto-remediation for version issues
          if (this.config.autoRemediation) {
            await this.triggerAutoRemediation('version-consistency', versionResult);
          }
        }
      } catch (error) {
        await this.recordEvent({
          type: 'system-health',
          severity: 'error',
          source: 'version-consistency',
          message: `Version consistency check error: ${error}`
        });
      }
    }

    // Prevention mechanisms check
    if (this.config.enabledMonitors.includes('prevention-mechanisms')) {
      try {
        const preventionResult = await this.checkPreventionMechanisms();
        metrics.preventionEffectiveness = preventionResult.score;
        totalChecks++;
        if (preventionResult.passed) passedChecks++;
        
        if (!preventionResult.passed) {
          await this.recordEvent({
            type: 'violation-detected',
            severity: 'critical',
            source: 'prevention-mechanisms',
            message: `Prevention mechanisms check failed: ${preventionResult.message}`,
            data: preventionResult
          });
          metrics.activeViolations++;
        }
      } catch (error) {
        await this.recordEvent({
          type: 'system-health',
          severity: 'error',
          source: 'prevention-mechanisms',
          message: `Prevention mechanisms check error: ${error}`
        });
      }
    }

    // Intelligence validation check
    if (this.config.enabledMonitors.includes('intelligence-validation')) {
      try {
        const intelligenceResult = await this.checkIntelligenceValidation();
        metrics.intelligenceValidation = intelligenceResult.score;
        totalChecks++;
        if (intelligenceResult.passed) passedChecks++;
        
        if (!intelligenceResult.passed) {
          await this.recordEvent({
            type: 'violation-detected',
            severity: 'critical',
            source: 'intelligence-validation',
            message: `Intelligence validation failed: ${intelligenceResult.message}`,
            data: intelligenceResult
          });
          metrics.activeViolations++;
        }
      } catch (error) {
        await this.recordEvent({
          type: 'system-health',
          severity: 'error',
          source: 'intelligence-validation',
          message: `Intelligence validation check error: ${error}`
        });
      }
    }

    // System health check
    if (this.config.enabledMonitors.includes('system-health')) {
      try {
        const healthResult = await this.checkSystemHealth();
        metrics.systemHealth = healthResult.score;
        totalChecks++;
        if (healthResult.passed) passedChecks++;
      } catch (error) {
        await this.recordEvent({
          type: 'system-health',
          severity: 'error',
          source: 'system-health',
          message: `System health check error: ${error}`
        });
      }
    }

    // Predictive analysis
    if (this.config.enabledMonitors.includes('predictive-analysis')) {
      try {
        const predictiveResult = await this.runPredictiveAnalysis();
        if (predictiveResult.alertsGenerated > 0) {
          await this.recordEvent({
            type: 'pattern-detected',
            severity: 'warning',
            source: 'predictive-analysis',
            message: `Predictive analysis generated ${predictiveResult.alertsGenerated} alerts`,
            data: predictiveResult
          });
        }
      } catch (error) {
        await this.recordEvent({
          type: 'system-health',
          severity: 'error',
          source: 'predictive-analysis',
          message: `Predictive analysis error: ${error}`
        });
      }
    }

    // Calculate overall compliance
    metrics.overallCompliance = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 0;

    // Store metrics
    this.metrics.push(metrics);

    // Check for alerts
    await this.checkAndTriggerAlerts(metrics);

    // Save data periodically
    if (this.metrics.length % 10 === 0) {
      await this.saveMonitoringData();
    }

    console.log(`📊 Compliance: ${metrics.overallCompliance.toFixed(1)}% | Violations: ${metrics.activeViolations}`);

    return metrics;
  }

  // Individual check methods
  private async checkConstitutionalCompliance(): Promise<{ passed: boolean; score: number; message: string }> {
    try {
      // Run constitutional validation
      const result = execSync('node tools/validate-constitution.ts', { 
        cwd: this.projectRoot, 
        stdio: 'pipe',
        encoding: 'utf8'
      });
      
      // Parse results (simplified)
      const compliance = result.includes('Overall Compliance: 100') ? 100 : 
                        result.includes('Overall Compliance: 8') ? 85 : 70;
      
      return {
        passed: compliance >= this.config.alertThresholds.compliance,
        score: compliance,
        message: compliance >= 85 ? 'Constitutional compliance passed' : 'Constitutional violations detected'
      };
    } catch (error) {
      return { passed: false, score: 0, message: `Constitutional check failed: ${error}` };
    }
  }

  private async checkVersionConsistency(): Promise<{ passed: boolean; score: number; message: string }> {
    try {
      const result = execSync('node tools/validate-version-consistency.ts', { 
        cwd: this.projectRoot, 
        stdio: 'pipe',
        encoding: 'utf8'
      });
      
      const hasViolations = result.includes('violations found');
      const score = hasViolations ? 70 : 100;
      
      return {
        passed: !hasViolations,
        score,
        message: hasViolations ? 'Version inconsistencies detected' : 'Version consistency verified'
      };
    } catch (error) {
      return { passed: false, score: 0, message: `Version check failed: ${error}` };
    }
  }

  private async checkPreventionMechanisms(): Promise<{ passed: boolean; score: number; message: string }> {
    try {
      const result = execSync('node tools/systematic-prevention-validator.ts', { 
        cwd: this.projectRoot, 
        stdio: 'pipe',
        encoding: 'utf8'
      });
      
      const hasCriticalFailures = result.includes('Critical Failures: 0');
      const score = hasCriticalFailures ? 100 : 60;
      
      return {
        passed: hasCriticalFailures,
        score,
        message: hasCriticalFailures ? 'Prevention mechanisms operational' : 'Prevention mechanisms have failures'
      };
    } catch (error) {
      return { passed: false, score: 0, message: `Prevention check failed: ${error}` };
    }
  }

  private async checkIntelligenceValidation(): Promise<{ passed: boolean; score: number; message: string }> {
    try {
      const result = execSync('node tools/constitutional-compliance-enforcer.ts', { 
        cwd: this.projectRoot, 
        stdio: 'pipe',
        encoding: 'utf8'
      });
      
      const isCompliant = result.includes('Status: COMPLIANT');
      const score = isCompliant ? 100 : 70;
      
      return {
        passed: isCompliant,
        score,
        message: isCompliant ? 'Intelligence validation passed' : 'Intelligence validation issues detected'
      };
    } catch (error) {
      return { passed: false, score: 0, message: `Intelligence validation failed: ${error}` };
    }
  }

  private async checkSystemHealth(): Promise<{ passed: boolean; score: number; message: string }> {
    // Check system resources, file access, etc.
    let healthScore = 100;
    
    // Check framework directory structure
    const requiredDirs = ['framework', 'tools', 'docs', '.framework'];
    for (const dir of requiredDirs) {
      if (!fs.existsSync(path.join(this.projectRoot, dir))) {
        healthScore -= 20;
      }
    }
    
    return {
      passed: healthScore >= this.config.alertThresholds.systemHealth,
      score: healthScore,
      message: healthScore >= 90 ? 'System health good' : 'System health issues detected'
    };
  }

  private async runPredictiveAnalysis(): Promise<{ alertsGenerated: number; riskLevel: string }> {
    try {
      const result = execSync('node tools/predictive-compliance-monitor.ts', { 
        cwd: this.projectRoot, 
        stdio: 'pipe',
        encoding: 'utf8'
      });
      
      const alertsGenerated = (result.match(/Alerts Generated: (\d+)/)?.[1] || '0');
      const riskLevel = result.includes('CRITICAL') ? 'critical' : 
                       result.includes('DANGER') ? 'danger' : 
                       result.includes('WARNING') ? 'warning' : 'safe';
      
      return {
        alertsGenerated: parseInt(alertsGenerated),
        riskLevel
      };
    } catch (error) {
      return { alertsGenerated: 0, riskLevel: 'unknown' };
    }
  }

  private async checkAndTriggerAlerts(metrics: ComplianceMetrics): Promise<void> {
    const alerts: string[] = [];
    
    if (metrics.overallCompliance < this.config.alertThresholds.compliance) {
      alerts.push(`ALERT: Overall compliance (${metrics.overallCompliance.toFixed(1)}%) below threshold`);
    }
    
    if (metrics.activeViolations > this.config.alertThresholds.violations) {
      alerts.push(`ALERT: Too many active violations (${metrics.activeViolations})`);
    }
    
    if (metrics.systemHealth < this.config.alertThresholds.systemHealth) {
      alerts.push(`ALERT: System health (${metrics.systemHealth}%) below threshold`);
    }
    
    for (const alert of alerts) {
      await this.recordEvent({
        type: 'violation-detected',
        severity: 'critical',
        source: 'alert-system',
        message: alert
      });
      
      console.log(`🚨 ${alert}`);
    }
  }

  private async triggerAutoRemediation(type: string, data: any): Promise<void> {
    console.log(`🔧 Triggering auto-remediation for: ${type}`);
    
    try {
      switch (type) {
        case 'version-consistency':
          execSync('node tools/validate-version-consistency.ts --auto-fix', { 
            cwd: this.projectRoot,
            stdio: 'pipe'
          });
          await this.recordEvent({
            type: 'prevention-triggered',
            severity: 'info',
            source: 'auto-remediation',
            message: 'Auto-fixed version consistency issues',
            actionTaken: 'version-consistency-auto-fix'
          });
          break;
        default:
          console.log(`⚠️ No auto-remediation available for: ${type}`);
      }
    } catch (error) {
      await this.recordEvent({
        type: 'system-health',
        severity: 'error',
        source: 'auto-remediation',
        message: `Auto-remediation failed for ${type}: ${error}`
      });
    }
  }

  private async recordEvent(eventData: Partial<MonitoringEvent>): Promise<void> {
    const event: MonitoringEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...eventData
    } as MonitoringEvent;
    
    this.events.push(event);
    
    // Keep only recent events (last 1000)
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
  }

  private getUptime(): number {
    return (Date.now() - this.startTime.getTime()) / (1000 * 60 * 60); // hours
  }

  /**
   * Generate monitoring report
   */
  async generateReport(): Promise<ContinuousMonitoringReport> {
    const latestMetrics = this.metrics[this.metrics.length - 1] || {
      timestamp: new Date(),
      overallCompliance: 0,
      constitutionalCompliance: 0,
      versionConsistency: 0,
      preventionEffectiveness: 0,
      intelligenceValidation: 0,
      systemHealth: 0,
      activeViolations: 0,
      resolvedViolations: 0,
      preventionTriggered: 0
    };
    
    const recentEvents = this.events.slice(-20); // Last 20 events
    const violationsDetected = this.events.filter(e => e.type === 'violation-detected').length;
    const violationsResolved = this.events.filter(e => e.type === 'violation-detected' && e.resolved).length;
    const preventionTriggered = this.events.filter(e => e.type === 'prevention-triggered').length;
    
    const status = latestMetrics.overallCompliance >= 90 ? 'healthy' :
                  latestMetrics.overallCompliance >= 70 ? 'warning' : 'critical';
    
    const alerts = this.events
      .filter(e => e.severity === 'critical' && !e.resolved)
      .map(e => e.message);
    
    return {
      status,
      uptime: this.getUptime(),
      checksPerformed: this.metrics.length,
      violationsDetected,
      violationsResolved,
      preventionSuccessRate: violationsDetected > 0 ? (violationsResolved / violationsDetected) * 100 : 100,
      currentMetrics: latestMetrics,
      recentEvents,
      alerts,
      recommendations: this.generateRecommendations(latestMetrics, recentEvents)
    };
  }

  private generateRecommendations(metrics: ComplianceMetrics, events: MonitoringEvent[]): string[] {
    const recommendations: string[] = [];
    
    if (metrics.overallCompliance < 90) {
      recommendations.push('Investigate and resolve compliance issues');
    }
    
    if (metrics.activeViolations > 0) {
      recommendations.push(`Address ${metrics.activeViolations} active violations`);
    }
    
    const criticalEvents = events.filter(e => e.severity === 'critical').length;
    if (criticalEvents > 0) {
      recommendations.push(`Review ${criticalEvents} critical events`);
    }
    
    if (metrics.preventionEffectiveness < 80) {
      recommendations.push('Strengthen prevention mechanisms');
    }
    
    recommendations.push('Continue monitoring for patterns and trends');
    
    return recommendations;
  }

  private async saveMonitoringData(): Promise<void> {
    try {
      // Save events (keep last 1000)
      const recentEvents = this.events.slice(-1000);
      fs.writeFileSync(this.eventsFile, JSON.stringify(recentEvents, null, 2));
      
      // Save metrics (keep last 500)
      const recentMetrics = this.metrics.slice(-500);
      fs.writeFileSync(this.metricsFile, JSON.stringify(recentMetrics, null, 2));
    } catch (error) {
      console.log('⚠️ Failed to save monitoring data');
    }
  }
}

/**
 * CLI interface
 */
async function main() {
  const monitor = new ContinuousComplianceMonitor();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n📋 Received shutdown signal...');
    await monitor.stopMonitoring();
    process.exit(0);
  });
  
  // Check command line arguments
  const args = process.argv.slice(2);
  
  if (args.includes('--report')) {
    // Generate and display report
    const report = await monitor.generateReport();
    console.log('\n🔄 Continuous Compliance Monitoring Report');
    console.log('==========================================');
    console.log(`📊 Status: ${report.status.toUpperCase()}`);
    console.log(`⏱️ Uptime: ${report.uptime.toFixed(1)} hours`);
    console.log(`🔍 Checks Performed: ${report.checksPerformed}`);
    console.log(`⚠️ Violations Detected: ${report.violationsDetected}`);
    console.log(`✅ Violations Resolved: ${report.violationsResolved}`);
    console.log(`🛡️ Prevention Success Rate: ${report.preventionSuccessRate.toFixed(1)}%`);
    console.log(`📈 Current Compliance: ${report.currentMetrics.overallCompliance.toFixed(1)}%`);
    
    if (report.alerts.length > 0) {
      console.log('\n🚨 Active Alerts:');
      report.alerts.forEach(alert => console.log(`   • ${alert}`));
    }
    
    if (report.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      report.recommendations.forEach(rec => console.log(`   • ${rec}`));
    }
    
    process.exit(0);
  } else {
    // Start continuous monitoring
    try {
      await monitor.startMonitoring();
      // Keep running until interrupted
      await new Promise(() => {}); // Infinite promise
    } catch (error) {
      console.error('❌ Continuous monitoring failed:', error);
      process.exit(1);
    }
  }
}

// Run if this is the main module
if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}
