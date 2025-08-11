#!/usr/bin/env node

/**
 * @aegisFrameworkVersion: 2.5.0
 * @intent: Execution trace hooks that log feature invocations and link to blueprints
 * @context: Solves observability debt by providing real-time feature usage tracking
 * @mode: strict
 */

import fs from 'fs';
import path from 'path';

interface ExecutionTrace {
  timestamp: Date;
  feature: string;
  capability: string;
  method?: string;
  parameters?: any;
  result?: any;
  duration?: number;
  blueprint?: string;
  documentation?: string;
  user?: string;
  context?: string;
  sessionId: string;
  traceId: string;
}

interface TraceSession {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  totalTraces: number;
  features: Set<string>;
  capabilities: Set<string>;
  errors: number;
}

interface TraceStatistics {
  totalExecutions: number;
  uniqueFeatures: number;
  uniqueCapabilities: number;
  mostUsedFeatures: Array<{ feature: string; count: number }>;
  recentActivity: ExecutionTrace[];
  sessionsToday: number;
  averageSessionDuration: number;
}

export class ExecutionTraceHooks {
  private static instance: ExecutionTraceHooks;
  private projectRoot: string;
  private tracesFile: string;
  private sessionsFile: string;
  private currentSession: TraceSession;
  private traces: ExecutionTrace[] = [];
  private sessions: TraceSession[] = [];
  private isEnabled: boolean = true;

  private constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    const observabilityDir = path.join(projectRoot, '.framework/observability');

    // Ensure directory exists
    if (!fs.existsSync(observabilityDir)) {
      fs.mkdirSync(observabilityDir, { recursive: true });
    }

    this.tracesFile = path.join(observabilityDir, 'execution-traces.jsonl');
    this.sessionsFile = path.join(observabilityDir, 'trace-sessions.json');

    this.currentSession = this.createNewSession();
    this.loadExistingData();

    // Auto-save on process exit
    process.on('exit', () => this.saveData());
    process.on('SIGINT', () => this.endSession());
    process.on('SIGTERM', () => this.endSession());
  }

  /**
   * Get singleton instance
   */
  static getInstance(projectRoot?: string): ExecutionTraceHooks {
    if (!ExecutionTraceHooks.instance) {
      ExecutionTraceHooks.instance = new ExecutionTraceHooks(projectRoot);
    }
    return ExecutionTraceHooks.instance;
  }

  /**
   * Enable or disable trace collection
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (enabled) {
      console.log('🔍 Execution tracing enabled');
    } else {
      console.log('🔇 Execution tracing disabled');
    }
  }

  /**
   * Trace a feature execution
   */
  trace(
    feature: string,
    capability: string,
    method?: string,
    parameters?: any,
    blueprint?: string,
    documentation?: string,
    context?: string
  ): TraceContext {
    if (!this.isEnabled) {
      return new TraceContext(null);
    }

    const traceId = this.generateTraceId();
    const startTime = Date.now();

    const trace: ExecutionTrace = {
      timestamp: new Date(),
      feature,
      capability,
      method,
      parameters: this.sanitizeParameters(parameters),
      blueprint,
      documentation,
      context,
      sessionId: this.currentSession.sessionId,
      traceId,
    };

    // Update session tracking
    this.currentSession.totalTraces++;
    this.currentSession.features.add(feature);
    this.currentSession.capabilities.add(capability);

    console.log(`🔍 [TRACE] ${feature}.${capability}${method ? `.${method}` : ''} (${traceId})`);

    if (blueprint) {
      console.log(`   📋 Blueprint: ${blueprint}`);
    }

    if (documentation) {
      console.log(`   📖 Docs: ${documentation}`);
    }

    return new TraceContext(trace, startTime, (result, error) => {
      this.completeTrace(trace, result, error, Date.now() - startTime);
    });
  }

  /**
   * Complete a trace with results
   */
  private completeTrace(trace: ExecutionTrace, result?: any, error?: any, duration?: number): void {
    trace.result = error ? { error: error.message } : this.sanitizeParameters(result);
    trace.duration = duration;

    if (error) {
      this.currentSession.errors++;
      console.log(`❌ [TRACE-ERROR] ${trace.feature}.${trace.capability} failed in ${duration}ms: ${error.message}`);
    } else {
      console.log(`✅ [TRACE-COMPLETE] ${trace.feature}.${trace.capability} completed in ${duration}ms`);
    }

    this.traces.push(trace);
    this.appendTraceToFile(trace);
  }

  /**
   * Create a wrapper for automatic tracing
   */
  wrap<T extends (...args: any[]) => any>(
    feature: string,
    capability: string,
    method: string,
    fn: T,
    blueprint?: string,
    documentation?: string
  ): T {
    return ((...args: any[]) => {
      const traceCtx = this.trace(feature, capability, method, args, blueprint, documentation);

      try {
        const result = fn(...args);

        // Handle promises
        if (result && typeof result.then === 'function') {
          return result
            .then((res: any) => {
              traceCtx.complete(res);
              return res;
            })
            .catch((error: any) => {
              traceCtx.error(error);
              throw error;
            });
        } else {
          traceCtx.complete(result);
          return result;
        }
      } catch (error) {
        traceCtx.error(error);
        throw error;
      }
    }) as T;
  }

  /**
   * Get execution statistics
   */
  getStatistics(): TraceStatistics {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysTraces = this.traces.filter(t => t.timestamp >= today);
    const todaysSessions = this.sessions.filter(s => s.startTime >= today);

    const featureCounts = new Map<string, number>();
    for (const trace of this.traces) {
      featureCounts.set(trace.feature, (featureCounts.get(trace.feature) || 0) + 1);
    }

    const mostUsedFeatures = Array.from(featureCounts.entries())
      .map(([feature, count]) => ({ feature, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const completedSessions = this.sessions.filter(s => s.endTime);
    const averageSessionDuration =
      completedSessions.length > 0
        ? completedSessions.reduce((sum, s) => sum + (s.endTime!.getTime() - s.startTime.getTime()), 0) /
          completedSessions.length
        : 0;

    return {
      totalExecutions: this.traces.length,
      uniqueFeatures: new Set(this.traces.map(t => t.feature)).size,
      uniqueCapabilities: new Set(this.traces.map(t => t.capability)).size,
      mostUsedFeatures,
      recentActivity: this.traces.slice(-10),
      sessionsToday: todaysSessions.length,
      averageSessionDuration: averageSessionDuration / 1000, // Convert to seconds
    };
  }

  /**
   * Get traces for a specific feature
   */
  getFeatureTraces(feature: string): ExecutionTrace[] {
    return this.traces.filter(t => t.feature === feature);
  }

  /**
   * Get current session info
   */
  getCurrentSession(): TraceSession {
    return { ...this.currentSession };
  }

  /**
   * Generate execution report
   */
  generateExecutionReport(): string {
    const stats = this.getStatistics();
    const session = this.getCurrentSession();

    let report = '# Framework Execution Report\n\n';
    report += `**Generated**: ${new Date().toISOString()}\n`;
    report += `**Current Session**: ${session.sessionId}\n`;
    report += `**Session Start**: ${session.startTime.toISOString()}\n\n`;

    report += '## Execution Statistics\n\n';
    report += `- **Total Executions**: ${stats.totalExecutions}\n`;
    report += `- **Unique Features**: ${stats.uniqueFeatures}\n`;
    report += `- **Unique Capabilities**: ${stats.uniqueCapabilities}\n`;
    report += `- **Sessions Today**: ${stats.sessionsToday}\n`;
    report += `- **Average Session Duration**: ${stats.averageSessionDuration.toFixed(1)}s\n\n`;

    if (stats.mostUsedFeatures.length > 0) {
      report += '## Most Used Features\n\n';
      for (const { feature, count } of stats.mostUsedFeatures) {
        report += `- **${feature}**: ${count} executions\n`;
      }
      report += '\n';
    }

    report += '## Current Session\n\n';
    report += `- **Session ID**: ${session.sessionId}\n`;
    report += `- **Total Traces**: ${session.totalTraces}\n`;
    report += `- **Features Used**: ${session.features.size}\n`;
    report += `- **Capabilities Used**: ${session.capabilities.size}\n`;
    report += `- **Errors**: ${session.errors}\n\n`;

    if (stats.recentActivity.length > 0) {
      report += '## Recent Activity\n\n';
      for (const trace of stats.recentActivity.reverse()) {
        const time = trace.timestamp.toLocaleTimeString();
        const duration = trace.duration ? ` (${trace.duration}ms)` : '';
        report += `- **${time}**: ${trace.feature}.${trace.capability}${duration}\n`;
      }
    }

    return report;
  }

  /**
   * Save execution report to file
   */
  saveExecutionReport(): string {
    const report = this.generateExecutionReport();
    const reportPath = path.join(path.dirname(this.tracesFile), 'execution-report.md');
    fs.writeFileSync(reportPath, report);
    console.log(`📊 Execution report saved to ${reportPath}`);
    return reportPath;
  }

  /**
   * Clear all traces and sessions
   */
  clearTraces(): void {
    this.traces = [];
    this.sessions = [];
    this.currentSession = this.createNewSession();

    // Clear files
    if (fs.existsSync(this.tracesFile)) {
      fs.unlinkSync(this.tracesFile);
    }
    if (fs.existsSync(this.sessionsFile)) {
      fs.unlinkSync(this.sessionsFile);
    }

    console.log('🗑️ All execution traces cleared');
  }

  /**
   * Private helper methods
   */
  private createNewSession(): TraceSession {
    return {
      sessionId: this.generateSessionId(),
      startTime: new Date(),
      totalTraces: 0,
      features: new Set(),
      capabilities: new Set(),
      errors: 0,
    };
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  private generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  private sanitizeParameters(params: any): any {
    if (params === null || params === undefined) {
      return params;
    }

    // Limit size and remove sensitive data
    const str = JSON.stringify(params);
    if (str.length > 1000) {
      return { _truncated: true, _size: str.length, _preview: str.substring(0, 200) + '...' };
    }

    return params;
  }

  private appendTraceToFile(trace: ExecutionTrace): void {
    try {
      const line = JSON.stringify(trace) + '\n';
      fs.appendFileSync(this.tracesFile, line);
    } catch (error) {
      console.warn('Failed to append trace to file:', error);
    }
  }

  private loadExistingData(): void {
    try {
      // Load sessions
      if (fs.existsSync(this.sessionsFile)) {
        const data = fs.readFileSync(this.sessionsFile, 'utf8');
        this.sessions = JSON.parse(data).map((s: any) => ({
          ...s,
          startTime: new Date(s.startTime),
          endTime: s.endTime ? new Date(s.endTime) : undefined,
          features: new Set(s.features),
          capabilities: new Set(s.capabilities),
        }));
      }

      // Load recent traces (last 1000)
      if (fs.existsSync(this.tracesFile)) {
        const lines = fs.readFileSync(this.tracesFile, 'utf8').trim().split('\n');
        this.traces = lines.slice(-1000).map(line => {
          const trace = JSON.parse(line);
          return { ...trace, timestamp: new Date(trace.timestamp) };
        });
      }
    } catch (error) {
      console.warn('Failed to load existing trace data:', error);
    }
  }

  private saveData(): void {
    try {
      // Save sessions
      const sessionsData = this.sessions.map(s => ({
        ...s,
        features: Array.from(s.features),
        capabilities: Array.from(s.capabilities),
      }));
      fs.writeFileSync(this.sessionsFile, JSON.stringify(sessionsData, null, 2));
    } catch (error) {
      console.warn('Failed to save trace data:', error);
    }
  }

  private endSession(): void {
    this.currentSession.endTime = new Date();
    this.sessions.push(this.currentSession);
    this.saveData();
    console.log(`📊 Session ${this.currentSession.sessionId} ended with ${this.currentSession.totalTraces} traces`);
  }
}

/**
 * Trace context for completing traces
 */
export class TraceContext {
  private trace: ExecutionTrace | null;
  private startTime: number;
  private completeFn?: (result?: any, error?: any) => void;
  private completed: boolean = false;

  constructor(trace: ExecutionTrace | null, startTime?: number, completeFn?: (result?: any, error?: any) => void) {
    this.trace = trace;
    this.startTime = startTime || Date.now();
    this.completeFn = completeFn;
  }

  complete(result?: any): void {
    if (this.completed || !this.completeFn) return;
    this.completed = true;
    this.completeFn(result);
  }

  error(error: any): void {
    if (this.completed || !this.completeFn) return;
    this.completed = true;
    this.completeFn(undefined, error);
  }

  addContext(key: string, value: any): void {
    if (this.trace) {
      if (!this.trace.context) {
        this.trace.context = '';
      }
      this.trace.context += ` ${key}:${value}`;
    }
  }
}

/**
 * Decorator for automatic tracing
 */
export function traced(feature: string, capability: string, blueprint?: string, documentation?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const hooks = ExecutionTraceHooks.getInstance();

    descriptor.value = hooks.wrap(feature, capability, propertyKey, originalMethod, blueprint, documentation);

    return descriptor;
  };
}

/**
 * Simple trace function for standalone usage
 */
export function trace(
  feature: string,
  capability: string,
  method?: string,
  parameters?: any,
  blueprint?: string,
  documentation?: string,
  context?: string
): TraceContext {
  const hooks = ExecutionTraceHooks.getInstance();
  return hooks.trace(feature, capability, method, parameters, blueprint, documentation, context);
}

/**
 * CLI interface for trace management
 */
async function main() {
  const hooks = ExecutionTraceHooks.getInstance();

  const command = process.argv[2];

  switch (command) {
    case 'stats':
      const stats = hooks.getStatistics();
      console.log('📊 Execution Statistics:');
      console.log(`   Total Executions: ${stats.totalExecutions}`);
      console.log(`   Unique Features: ${stats.uniqueFeatures}`);
      console.log(`   Sessions Today: ${stats.sessionsToday}`);
      break;

    case 'report':
      const reportPath = hooks.saveExecutionReport();
      console.log(`📄 Report saved to: ${reportPath}`);
      break;

    case 'clear':
      hooks.clearTraces();
      break;

    case 'session':
      const session = hooks.getCurrentSession();
      console.log('📊 Current Session:');
      console.log(`   ID: ${session.sessionId}`);
      console.log(`   Traces: ${session.totalTraces}`);
      console.log(`   Features: ${session.features.size}`);
      console.log(`   Errors: ${session.errors}`);
      break;

    default:
      console.log('🔍 Execution Trace Hooks');
      console.log('Usage:');
      console.log('  node execution-trace-hooks.ts stats   - Show statistics');
      console.log('  node execution-trace-hooks.ts report  - Generate report');
      console.log('  node execution-trace-hooks.ts session - Show current session');
      console.log('  node execution-trace-hooks.ts clear   - Clear all traces');
  }
}

// Run if this is the main module
if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}
