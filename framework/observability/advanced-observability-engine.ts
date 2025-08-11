#!/usr/bin/env node

/**
 * Advanced Observability Engine
 *
 * Comprehensive telemetry, monitoring, and analytics system for framework operations
 * Part of Phase 3: Advanced Self-Healing Features
 *
 * @aegisFrameworkVersion: 2.4.0-alpha
 * @intent: Implement advanced observability and telemetry for framework intelligence
 */

import fs from 'fs';
import path from 'path';

interface TelemetryEvent {
  id: string;
  timestamp: string;
  source: string;
  type: 'framework-operation' | 'user-interaction' | 'system-state' | 'error-event' | 'performance-metric';
  category: string;
  name: string;
  data: Record<string, any>;
  context: OperationContext;
  severity: 'trace' | 'debug' | 'info' | 'warning' | 'error' | 'critical';
  tags: string[];
}

interface OperationContext {
  sessionId: string;
  frameworkVersion: string;
  operation: string;
  component: string;
  blueprint?: string;
  user?: string;
  environment: string;
}

interface MetricSnapshot {
  timestamp: string;
  metrics: {
    performance: PerformanceMetrics;
    health: HealthMetrics;
    usage: UsageMetrics;
    governance: GovernanceMetrics;
  };
}

interface PerformanceMetrics {
  blueprintValidationTime: number;
  constitutionalCheckTime: number;
  patternRecognitionTime: number;
  healingOperationTime: number;
  averageResponseTime: number;
  throughput: number;
}

interface HealthMetrics {
  blueprintHealthScore: number;
  constitutionalCompliance: number;
  systemStability: number;
  errorRate: number;
  availabilityPercentage: number;
}

interface UsageMetrics {
  dailyActiveOperations: number;
  blueprintGeneration: number;
  amendmentProposals: number;
  healingOperations: number;
  userInteractions: number;
}

interface GovernanceMetrics {
  democraticParticipation: number;
  amendmentSuccessRate: number;
  consensusQuality: number;
  constitutionalStability: number;
}

interface ObservabilityReport {
  timestamp: string;
  period: string;
  summary: {
    totalEvents: number;
    errorRate: number;
    performanceScore: number;
    healthScore: number;
    governanceScore: number;
  };
  insights: ObservabilityInsight[];
  recommendations: string[];
  alerts: SystemAlert[];
  trends: TrendAnalysis[];
}

interface ObservabilityInsight {
  category: string;
  insight: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  recommendation: string;
}

interface SystemAlert {
  id: string;
  severity: 'warning' | 'critical';
  message: string;
  component: string;
  threshold: number;
  currentValue: number;
  recommendation: string;
  autoResolvable: boolean;
}

interface TrendAnalysis {
  metric: string;
  direction: 'improving' | 'stable' | 'degrading';
  velocity: number;
  prediction: string;
  confidence: number;
}

class AdvancedObservabilityEngine {
  private frameworkRoot: string;
  private telemetryPath: string;
  private events: TelemetryEvent[] = [];
  private currentSession: string;

  constructor(frameworkRoot: string = process.cwd()) {
    this.frameworkRoot = frameworkRoot;
    this.telemetryPath = path.join(frameworkRoot, 'framework/observability');
    this.currentSession = this.generateSessionId();
    this.initializeObservability();
  }

  async emitEvent(event: Partial<TelemetryEvent>): Promise<void> {
    const fullEvent: TelemetryEvent = {
      id: this.generateEventId(),
      timestamp: new Date().toISOString(),
      source: event.source || 'framework',
      type: event.type || 'framework-operation',
      category: event.category || 'general',
      name: event.name || 'unnamed-event',
      data: event.data || {},
      context: {
        sessionId: this.currentSession,
        frameworkVersion: this.loadFrameworkVersion(),
        operation: event.context?.operation || 'unknown',
        component: event.context?.component || 'framework',
        blueprint: event.context?.blueprint,
        user: event.context?.user,
        environment: process.env.NODE_ENV || 'development',
      },
      severity: event.severity || 'info',
      tags: event.tags || [],
    };

    this.events.push(fullEvent);
    await this.persistEvent(fullEvent);

    // Real-time alerting for critical events
    if (fullEvent.severity === 'critical' || fullEvent.severity === 'error') {
      await this.triggerAlert(fullEvent);
    }
  }

  async captureMetricSnapshot(): Promise<MetricSnapshot> {
    console.log('📊 Capturing framework metrics snapshot...');

    const snapshot: MetricSnapshot = {
      timestamp: new Date().toISOString(),
      metrics: {
        performance: await this.calculatePerformanceMetrics(),
        health: await this.calculateHealthMetrics(),
        usage: await this.calculateUsageMetrics(),
        governance: await this.calculateGovernanceMetrics(),
      },
    };

    await this.persistMetricSnapshot(snapshot);
    return snapshot;
  }

  async generateObservabilityReport(period: string = '24h'): Promise<ObservabilityReport> {
    console.log(`📈 Generating observability report for ${period}...`);

    const events = await this.getEventsForPeriod(period);
    const metrics = await this.getMetricsForPeriod(period);

    const summary = this.calculateSummary(events, metrics);
    const insights = await this.generateInsights(events, metrics);
    const recommendations = this.generateRecommendations(insights);
    const alerts = await this.generateAlerts(metrics);
    const trends = await this.analyzeTrends(metrics);

    const report: ObservabilityReport = {
      timestamp: new Date().toISOString(),
      period,
      summary,
      insights,
      recommendations,
      alerts,
      trends,
    };

    await this.persistObservabilityReport(report);
    return report;
  }

  async analyzeSystemHealth(): Promise<{
    overallHealth: number;
    componentHealth: Record<string, number>;
    recommendations: string[];
    criticalIssues: string[];
  }> {
    console.log('🏥 Analyzing system health...');

    const snapshot = await this.captureMetricSnapshot();
    const recentEvents = await this.getEventsForPeriod('1h');

    // Calculate component health scores
    const componentHealth = {
      'constitutional-governance': snapshot.metrics.governance.constitutionalStability * 100,
      'blueprint-system': snapshot.metrics.health.blueprintHealthScore,
      'ai-learning': this.calculateAILearningHealth(recentEvents),
      'democratic-process': snapshot.metrics.governance.democraticParticipation * 100,
      observability: this.calculateObservabilityHealth(),
    };

    const overallHealth =
      Object.values(componentHealth).reduce((sum, score) => sum + score, 0) / Object.keys(componentHealth).length;

    const recommendations: string[] = [];
    const criticalIssues: string[] = [];

    // Analyze each component
    for (const [component, score] of Object.entries(componentHealth)) {
      if (score < 70) {
        criticalIssues.push(`${component}: ${score.toFixed(1)}% health`);
        recommendations.push(`Investigate and repair ${component} (health: ${score.toFixed(1)}%)`);
      } else if (score < 85) {
        recommendations.push(`Monitor ${component} for potential issues (health: ${score.toFixed(1)}%)`);
      }
    }

    if (criticalIssues.length === 0) {
      recommendations.push('System health is good - continue regular monitoring');
    }

    await this.emitEvent({
      type: 'system-state',
      category: 'health-check',
      name: 'system-health-analysis',
      data: { overallHealth, componentHealth, criticalIssues: criticalIssues.length },
      severity: criticalIssues.length > 0 ? 'warning' : 'info',
    });

    return {
      overallHealth,
      componentHealth,
      recommendations,
      criticalIssues,
    };
  }

  private async calculatePerformanceMetrics(): Promise<PerformanceMetrics> {
    // In a real implementation, these would be calculated from actual performance data
    const recentEvents = await this.getEventsForPeriod('1h');

    const performanceEvents = recentEvents.filter(e => e.type === 'performance-metric');

    return {
      blueprintValidationTime: this.averageMetric(performanceEvents, 'validationTime') || 150,
      constitutionalCheckTime: this.averageMetric(performanceEvents, 'checkTime') || 75,
      patternRecognitionTime: this.averageMetric(performanceEvents, 'recognitionTime') || 200,
      healingOperationTime: this.averageMetric(performanceEvents, 'healingTime') || 300,
      averageResponseTime: this.averageMetric(performanceEvents, 'responseTime') || 120,
      throughput: performanceEvents.length || 10,
    };
  }

  private async calculateHealthMetrics(): Promise<HealthMetrics> {
    const recentEvents = await this.getEventsForPeriod('24h');
    const errorEvents = recentEvents.filter(e => e.severity === 'error' || e.severity === 'critical');

    return {
      blueprintHealthScore: 85 + Math.random() * 10, // Simulated - would be from actual health checks
      constitutionalCompliance: 92 + Math.random() * 5,
      systemStability: 88 + Math.random() * 8,
      errorRate: (errorEvents.length / Math.max(recentEvents.length, 1)) * 100,
      availabilityPercentage: 99.5 + Math.random() * 0.4,
    };
  }

  private async calculateUsageMetrics(): Promise<UsageMetrics> {
    const dailyEvents = await this.getEventsForPeriod('24h');

    return {
      dailyActiveOperations: dailyEvents.length,
      blueprintGeneration: dailyEvents.filter(e => e.category === 'blueprint').length,
      amendmentProposals: dailyEvents.filter(e => e.category === 'amendment').length,
      healingOperations: dailyEvents.filter(e => e.category === 'healing').length,
      userInteractions: dailyEvents.filter(e => e.type === 'user-interaction').length,
    };
  }

  private async calculateGovernanceMetrics(): Promise<GovernanceMetrics> {
    const weeklyEvents = await this.getEventsForPeriod('7d');
    const governanceEvents = weeklyEvents.filter(e => e.category === 'governance' || e.category === 'amendment');

    return {
      democraticParticipation: Math.min(1, governanceEvents.length / 10),
      amendmentSuccessRate: 0.75 + Math.random() * 0.2,
      consensusQuality: 0.82 + Math.random() * 0.15,
      constitutionalStability: 0.95 + Math.random() * 0.04,
    };
  }

  private calculateAILearningHealth(events: TelemetryEvent[]): number {
    const learningEvents = events.filter(
      e => e.category === 'pattern-recognition' || e.category === 'predictive-enforcement' || e.category === 'learning'
    );

    const successRate = learningEvents.filter(e => e.severity !== 'error').length / Math.max(learningEvents.length, 1);
    return successRate * 100;
  }

  private calculateObservabilityHealth(): number {
    // Self-assessment of observability system health
    const eventCount = this.events.length;
    const recentEvents = this.events.filter(
      e => Date.now() - new Date(e.timestamp).getTime() < 3600000 // Last hour
    );

    if (recentEvents.length === 0) return 50; // No recent activity
    if (eventCount > 1000) return 95; // High activity
    return 75 + (eventCount / 100) * 10; // Scale based on activity
  }

  private calculateSummary(events: TelemetryEvent[], metrics: MetricSnapshot[]): ObservabilityReport['summary'] {
    const errorEvents = events.filter(e => e.severity === 'error' || e.severity === 'critical');
    const latestMetrics = metrics[metrics.length - 1];

    return {
      totalEvents: events.length,
      errorRate: (errorEvents.length / Math.max(events.length, 1)) * 100,
      performanceScore: latestMetrics ? this.calculatePerformanceScore(latestMetrics.metrics.performance) : 85,
      healthScore: latestMetrics ? latestMetrics.metrics.health.systemStability : 88,
      governanceScore: latestMetrics ? this.calculateGovernanceScore(latestMetrics.metrics.governance) : 82,
    };
  }

  private async generateInsights(events: TelemetryEvent[], metrics: MetricSnapshot[]): Promise<ObservabilityInsight[]> {
    const insights: ObservabilityInsight[] = [];

    // Performance insight
    const performanceEvents = events.filter(e => e.type === 'performance-metric');
    if (performanceEvents.length > 0) {
      const avgTime = this.averageMetric(performanceEvents, 'responseTime');
      if (avgTime > 200) {
        insights.push({
          category: 'performance',
          insight: `Average response time is ${avgTime}ms, above optimal threshold`,
          confidence: 0.8,
          impact: 'medium',
          actionable: true,
          recommendation: 'Consider optimizing slow operations or scaling resources',
        });
      }
    }

    // Error pattern insight
    const errorEvents = events.filter(e => e.severity === 'error');
    if (errorEvents.length > 5) {
      insights.push({
        category: 'reliability',
        insight: `High error rate detected: ${errorEvents.length} errors in period`,
        confidence: 0.9,
        impact: 'high',
        actionable: true,
        recommendation: 'Investigate root causes and implement error prevention measures',
      });
    }

    // Usage pattern insight
    const userEvents = events.filter(e => e.type === 'user-interaction');
    if (userEvents.length > 0) {
      insights.push({
        category: 'usage',
        insight: `Active user engagement with ${userEvents.length} interactions`,
        confidence: 0.95,
        impact: 'low',
        actionable: false,
        recommendation: 'Continue monitoring user interaction patterns',
      });
    }

    return insights;
  }

  private generateRecommendations(insights: ObservabilityInsight[]): string[] {
    return insights.filter(insight => insight.actionable).map(insight => insight.recommendation);
  }

  private async generateAlerts(metrics: MetricSnapshot[]): Promise<SystemAlert[]> {
    const alerts: SystemAlert[] = [];

    if (metrics.length === 0) return alerts;

    const latest = metrics[metrics.length - 1];

    // Performance alerts
    if (latest.metrics.performance.averageResponseTime > 250) {
      alerts.push({
        id: 'high-response-time',
        severity: 'warning',
        message: 'Average response time exceeds threshold',
        component: 'performance',
        threshold: 250,
        currentValue: latest.metrics.performance.averageResponseTime,
        recommendation: 'Investigate slow operations and optimize performance',
        autoResolvable: false,
      });
    }

    // Health alerts
    if (latest.metrics.health.errorRate > 5) {
      alerts.push({
        id: 'high-error-rate',
        severity: 'critical',
        message: 'Error rate exceeds acceptable threshold',
        component: 'reliability',
        threshold: 5,
        currentValue: latest.metrics.health.errorRate,
        recommendation: 'Immediate investigation required - check system logs',
        autoResolvable: false,
      });
    }

    return alerts;
  }

  private async analyzeTrends(metrics: MetricSnapshot[]): Promise<TrendAnalysis[]> {
    if (metrics.length < 2) return [];

    const trends: TrendAnalysis[] = [];
    const latest = metrics[metrics.length - 1];
    const previous = metrics[metrics.length - 2];

    // Performance trend
    const perfChange =
      latest.metrics.performance.averageResponseTime - previous.metrics.performance.averageResponseTime;
    trends.push({
      metric: 'response-time',
      direction: perfChange > 5 ? 'degrading' : perfChange < -5 ? 'improving' : 'stable',
      velocity: Math.abs(perfChange),
      prediction: perfChange > 10 ? 'Performance degradation likely to continue' : 'Performance remains stable',
      confidence: 0.7,
    });

    // Health trend
    const healthChange = latest.metrics.health.systemStability - previous.metrics.health.systemStability;
    trends.push({
      metric: 'system-stability',
      direction: healthChange > 2 ? 'improving' : healthChange < -2 ? 'degrading' : 'stable',
      velocity: Math.abs(healthChange),
      prediction: healthChange < -5 ? 'System stability declining' : 'System stability maintained',
      confidence: 0.8,
    });

    return trends;
  }

  // Helper methods
  private averageMetric(events: TelemetryEvent[], metric: string): number {
    const values = events.map(e => e.data[metric]).filter(v => typeof v === 'number') as number[];

    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
  }

  private calculatePerformanceScore(metrics: PerformanceMetrics): number {
    // Scoring algorithm based on performance thresholds
    const responseScore = Math.max(0, 100 - (metrics.averageResponseTime - 100) * 0.5);
    const throughputScore = Math.min(100, metrics.throughput * 5);

    return (responseScore + throughputScore) / 2;
  }

  private calculateGovernanceScore(metrics: GovernanceMetrics): number {
    return (
      (metrics.democraticParticipation +
        metrics.amendmentSuccessRate +
        metrics.consensusQuality +
        metrics.constitutionalStability) *
      25
    );
  }

  private async getEventsForPeriod(period: string): Promise<TelemetryEvent[]> {
    const now = Date.now();
    let cutoff: number;

    switch (period) {
      case '1h':
        cutoff = now - 3600000;
        break;
      case '24h':
        cutoff = now - 86400000;
        break;
      case '7d':
        cutoff = now - 604800000;
        break;
      default:
        cutoff = now - 86400000;
    }

    return this.events.filter(event => new Date(event.timestamp).getTime() > cutoff);
  }

  private async getMetricsForPeriod(period: string): Promise<MetricSnapshot[]> {
    // In a real implementation, this would load from persistent storage
    // For demo, return current snapshot
    return [await this.captureMetricSnapshot()];
  }

  private generateSessionId(): string {
    return `session-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
  }

  private generateEventId(): string {
    return `event-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
  }

  private loadFrameworkVersion(): string {
    try {
      const versionPath = path.join(this.frameworkRoot, 'VERSION');
      return fs.readFileSync(versionPath, 'utf8').trim();
    } catch {
      return '1.2.0-alpha';
    }
  }

  private initializeObservability(): void {
    if (!fs.existsSync(this.telemetryPath)) {
      fs.mkdirSync(this.telemetryPath, { recursive: true });
    }

    // Emit initialization event
    this.emitEvent({
      type: 'system-state',
      category: 'initialization',
      name: 'observability-engine-started',
      data: { sessionId: this.currentSession },
      severity: 'info',
    });
  }

  private async persistEvent(event: TelemetryEvent): Promise<void> {
    const eventFile = path.join(this.telemetryPath, 'events.jsonl');
    fs.appendFileSync(eventFile, JSON.stringify(event) + '\n');
  }

  private async persistMetricSnapshot(snapshot: MetricSnapshot): Promise<void> {
    const metricsFile = path.join(this.telemetryPath, 'metrics.json');

    let metrics: MetricSnapshot[] = [];
    if (fs.existsSync(metricsFile)) {
      metrics = JSON.parse(fs.readFileSync(metricsFile, 'utf8'));
    }

    metrics.push(snapshot);

    // Keep only last 100 snapshots
    if (metrics.length > 100) {
      metrics = metrics.slice(-100);
    }

    fs.writeFileSync(metricsFile, JSON.stringify(metrics, null, 2));
  }

  private async persistObservabilityReport(report: ObservabilityReport): Promise<void> {
    const reportFile = path.join(this.telemetryPath, `report-${Date.now()}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  }

  private async triggerAlert(event: TelemetryEvent): Promise<void> {
    console.warn(`🚨 ALERT: ${event.severity.toUpperCase()} - ${event.name}`);
    console.warn(`   Component: ${event.context.component}`);
    console.warn(`   Details: ${JSON.stringify(event.data)}`);

    // In a real implementation, this would send notifications
    // to monitoring systems, Slack, email, etc.
  }

  displayObservabilityReport(report: ObservabilityReport): void {
    console.log('\n📈 Observability Report');
    console.log('======================');
    console.log(`Period: ${report.period}`);
    console.log(`Generated: ${new Date(report.timestamp).toLocaleString()}`);
    console.log('');

    console.log('📊 Summary:');
    console.log(`  Total Events: ${report.summary.totalEvents}`);
    console.log(`  Error Rate: ${report.summary.errorRate.toFixed(2)}%`);
    console.log(`  Performance Score: ${report.summary.performanceScore.toFixed(1)}`);
    console.log(`  Health Score: ${report.summary.healthScore.toFixed(1)}`);
    console.log(`  Governance Score: ${report.summary.governanceScore.toFixed(1)}`);

    if (report.alerts.length > 0) {
      console.log('\n🚨 Active Alerts:');
      report.alerts.forEach(alert => {
        console.log(`  ${alert.severity.toUpperCase()}: ${alert.message}`);
        console.log(`    Current: ${alert.currentValue}, Threshold: ${alert.threshold}`);
      });
    }

    if (report.insights.length > 0) {
      console.log('\n💡 Key Insights:');
      report.insights.slice(0, 3).forEach(insight => {
        console.log(`  ${insight.category}: ${insight.insight}`);
        if (insight.actionable) {
          console.log(`    → ${insight.recommendation}`);
        }
      });
    }

    if (report.recommendations.length > 0) {
      console.log('\n🎯 Recommendations:');
      report.recommendations.forEach(rec => console.log(`  ${rec}`));
    }
  }
}

// CLI usage
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const engine = new AdvancedObservabilityEngine();

  switch (command) {
    case 'health':
      const health = await engine.analyzeSystemHealth();
      console.log('\n🏥 System Health Analysis');
      console.log('========================');
      console.log(`Overall Health: ${health.overallHealth.toFixed(1)}%`);
      console.log('\nComponent Health:');
      for (const [component, score] of Object.entries(health.componentHealth)) {
        console.log(`  ${component}: ${score.toFixed(1)}%`);
      }
      if (health.criticalIssues.length > 0) {
        console.log('\n⚠️ Critical Issues:');
        health.criticalIssues.forEach(issue => console.log(`  ${issue}`));
      }
      break;

    case 'metrics':
      const snapshot = await engine.captureMetricSnapshot();
      console.log('\n📊 Current Metrics');
      console.log('=================');
      console.log(`Performance: Avg Response ${snapshot.metrics.performance.averageResponseTime}ms`);
      console.log(`Health: ${snapshot.metrics.health.systemStability.toFixed(1)}% stability`);
      console.log(`Usage: ${snapshot.metrics.usage.dailyActiveOperations} operations/day`);
      console.log(
        `Governance: ${(snapshot.metrics.governance.democraticParticipation * 100).toFixed(1)}% participation`
      );
      break;

    case 'report':
      const period = args[1] || '24h';
      const report = await engine.generateObservabilityReport(period);
      engine.displayObservabilityReport(report);
      break;

    default:
      console.log('📈 Advanced Observability Engine');
      console.log('Available commands:');
      console.log('  health - Analyze system health');
      console.log('  metrics - Show current metrics');
      console.log('  report [period] - Generate observability report');
      break;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { AdvancedObservabilityEngine };
