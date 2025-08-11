/**
 * Aegis Framework Telemetry System
 *
 * Lightweight, purpose-built observability for AI operations
 * Focused on constitutional governance and evaluation metrics
 *
 * @aegisFrameworkVersion 2.4.0
 * @intent Constitutional observability without vendor lock-in
 * @context ES module native, framework-specific telemetry
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface AegisEvent {
  id: string;
  timestamp: string;
  sessionId: string;
  operation: 'hydrate' | 'generate' | 'evaluate' | 'validate' | 'repair';
  type: 'start' | 'complete' | 'error' | 'metric';
  blueprintId?: string;
  frameworkVersion: string;
  commitSha?: string;
  duration?: number;
  success: boolean;
  metadata: Record<string, any>;
}

interface AegisMetrics {
  // Performance
  generationTime?: number;
  tokensUsed?: number;
  filesGenerated?: number;
  linesGenerated?: number;

  // Quality
  validationPassRate?: number;
  overallScore?: number;
  securityScore?: number;
  qualityScore?: number;
  complianceScore?: number;

  // Constitutional
  constitutionalCompliance?: boolean;
  driftDetected?: boolean;
  traceabilityVerified?: boolean;

  // System
  memoryUsage?: number;
  cpuUsage?: number;
  errorCount?: number;
}

interface AegisSession {
  id: string;
  startTime: string;
  endTime?: string;
  operation: string;
  events: AegisEvent[];
  totalDuration?: number;
  success: boolean;
  summary: AegisMetrics;
}

export class AegisTelemetry {
  private sessionId: string;
  private operation: string;
  private events: AegisEvent[] = [];
  private startTime: number;
  private telemetryPath: string;
  private sessionPath: string;
  private frameworkVersion: string;
  private commitSha?: string;
  private metrics: AegisMetrics = {};

  constructor(
    operation: 'hydrate' | 'generate' | 'evaluate' | 'validate' | 'repair',
    context: {
      blueprintId?: string;
      projectPath?: string;
    } = {}
  ) {
    this.sessionId = this.generateSessionId();
    this.operation = operation;
    this.startTime = Date.now();
    this.frameworkVersion = this.getFrameworkVersion();
    this.commitSha = this.getGitCommitSha();

    // Setup telemetry paths
    const workspaceRoot = context.projectPath || process.cwd();
    this.telemetryPath = path.join(workspaceRoot, '.aegis', 'telemetry');
    this.sessionPath = path.join(this.telemetryPath, 'sessions');

    this.ensureDirectories();
    this.emitSessionStart(context.blueprintId);
  }

  private ensureDirectories(): void {
    [this.telemetryPath, this.sessionPath].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  private generateSessionId(): string {
    return `aegis-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
  }

  private getFrameworkVersion(): string {
    try {
      const versionPath = path.join(process.cwd(), 'VERSION');
      if (fs.existsSync(versionPath)) {
        return fs.readFileSync(versionPath, 'utf8').trim();
      }
    } catch {}
    return '2.4.0';
  }

  private getGitCommitSha(): string | undefined {
    try {
      return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    } catch {
      return undefined;
    }
  }

  private emitSessionStart(blueprintId?: string): void {
    this.emit('start', {
      blueprintId,
      userAgent: process.env.USER || 'unknown',
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
    });
  }

  /**
   * Emit a telemetry event
   */
  emit(type: 'start' | 'complete' | 'error' | 'metric', metadata: Record<string, any> = {}): void {
    const event: AegisEvent = {
      id: `${this.sessionId}-${this.events.length + 1}`,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      operation: this.operation as 'hydrate' | 'generate' | 'evaluate' | 'validate' | 'repair',
      type,
      frameworkVersion: this.frameworkVersion,
      commitSha: this.commitSha,
      duration: type !== 'start' ? Date.now() - this.startTime : undefined,
      success: type !== 'error',
      metadata,
    };

    this.events.push(event);
    this.appendEventToLog(event);

    // Console output for development
    const consoleConfig = this.getConsoleConfig();
    if (consoleConfig.enabled) {
      this.logToConsole(event);
    }
  }

  /**
   * Record performance metrics
   */
  recordMetrics(metrics: Partial<AegisMetrics>): void {
    this.metrics = { ...this.metrics, ...metrics };
    this.emit('metric', { metrics });
  }

  /**
   * Record blueprint generation with full context
   */
  recordGeneration(
    blueprintId: string,
    results: {
      success: boolean;
      performance: {
        generationTime: number;
        tokensUsed: number;
        filesGenerated: number;
        linesGenerated: number;
      };
      quality: {
        validationPassRate: number;
        overallScore: number;
        constitutionalCompliance: boolean;
      };
      errors?: string[];
    }
  ): void {
    this.recordMetrics({
      generationTime: results.performance.generationTime,
      tokensUsed: results.performance.tokensUsed,
      filesGenerated: results.performance.filesGenerated,
      linesGenerated: results.performance.linesGenerated,
      validationPassRate: results.quality.validationPassRate,
      overallScore: results.quality.overallScore,
      constitutionalCompliance: results.quality.constitutionalCompliance,
    });

    this.emit(results.success ? 'complete' : 'error', {
      blueprintId,
      ...results.performance,
      ...results.quality,
      errors: results.errors,
    });
  }

  /**
   * Record evaluation results
   */
  recordEvaluation(
    evalId: string,
    results: {
      passed: boolean;
      score: number;
      validationPassRate: number;
      judgeResults: Array<{
        name: string;
        score: number;
        weight: number;
      }>;
      errors: string[];
    }
  ): void {
    const judgeBreakdown: Record<string, number> = results.judgeResults.reduce(
      (acc, judge) => ({
        ...acc,
        [`${judge.name}Score`]: judge.score,
      }),
      {}
    );

    this.recordMetrics({
      overallScore: results.score,
      validationPassRate: results.validationPassRate,
      securityScore: judgeBreakdown['security-reviewScore'],
      qualityScore: judgeBreakdown['code-qualityScore'],
      complianceScore: judgeBreakdown['framework-complianceScore'],
      errorCount: results.errors.length,
    });

    this.emit(results.passed ? 'complete' : 'error', {
      evalId,
      ...judgeBreakdown,
      totalScore: results.score,
      validationRate: results.validationPassRate,
      errors: results.errors,
    });
  }

  /**
   * Start operation timing
   */
  startOperation(operationName: string, metadata: Record<string, any> = {}): (success?: boolean, additionalMetadata?: Record<string, any>) => void {
    const startTime = Date.now();
    this.emit('start', { operation: operationName, ...metadata });

    // Return a completion function
    return (success: boolean = true, additionalMetadata: Record<string, any> = {}) => {
      const duration = Date.now() - startTime;
      this.emit(success ? 'complete' : 'error', {
        operation: operationName,
        duration,
        ...additionalMetadata,
      });
    };
  }

  /**
   * Async operation wrapper
   */
  async traceOperation<T>(
    operationName: string,
    operation: () => Promise<T>,
    metadata: Record<string, any> = {}
  ): Promise<T> {
    const complete = this.startOperation(operationName, metadata);

    try {
      const result = await operation();
      complete(true, { success: true });
      return result;
    } catch (error) {
      complete(false, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  /**
   * Complete the session and save summary
   */
  async finalize(): Promise<AegisSession> {
    const session: AegisSession = {
      id: this.sessionId,
      startTime: new Date(this.startTime).toISOString(),
      endTime: new Date().toISOString(),
      operation: this.operation,
      events: this.events,
      totalDuration: Date.now() - this.startTime,
      success: !this.events.some(e => e.type === 'error'),
      summary: this.metrics,
    };

    // Save session summary
    const sessionFile = path.join(this.sessionPath, `${this.sessionId}.json`);
    fs.writeFileSync(sessionFile, JSON.stringify(session, null, 2));

    // Export to external systems if configured
    await this.exportToExternalSystems(session);

    return session;
  }

  private appendEventToLog(event: AegisEvent): void {
    const logFile = path.join(this.telemetryPath, 'events.jsonl');
    fs.appendFileSync(logFile, JSON.stringify(event) + '\n');
  }

  private logToConsole(event: AegisEvent): void {
    const emoji = {
      start: '🚀',
      complete: '✅',
      error: '❌',
      metric: '📊',
    }[event.type];

    const duration = event.duration ? ` (${event.duration}ms)` : '';
    console.log(`${emoji} ${event.operation}.${event.type}${duration}`);

    if (event.metadata.operation) {
      console.log(`   └─ ${event.metadata.operation}`);
    }
  }

  private getConsoleConfig(): { enabled: boolean } {
    try {
      const configPath = path.join(process.cwd(), '.aegis', 'observability.json');
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return config.console || { enabled: true };
      }
    } catch {}
    return { enabled: process.env.NODE_ENV === 'development' };
  }

  private async exportToExternalSystems(session: AegisSession): Promise<void> {
    try {
      const configPath = path.join(process.cwd(), '.aegis', 'observability.json');
      if (!fs.existsSync(configPath)) return;

      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

      // Export to webhook if configured
      if (config.webhook?.enabled) {
        await this.exportToWebhook(session, config.webhook);
      }

      // Export to file system if configured
      if (config.export?.enabled) {
        await this.exportToFiles(session, config.export);
      }
    } catch (error) {
      console.warn('⚠️  Failed to export telemetry:', error);
    }
  }

  private async exportToWebhook(session: AegisSession, config: any): Promise<void> {
    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
        body: JSON.stringify({
          session,
          framework: 'aegis',
          version: this.frameworkVersion,
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
      }
    } catch (error) {
      console.warn('⚠️  Webhook export failed:', error);
    }
  }

  private async exportToFiles(session: AegisSession, config: any): Promise<void> {
    const exportPath = config.path || path.join(this.telemetryPath, 'exports');
    if (!fs.existsSync(exportPath)) {
      fs.mkdirSync(exportPath, { recursive: true });
    }

    // Export as CSV for analysis
    if (config.formats?.includes('csv')) {
      this.exportToCSV(session, exportPath);
    }

    // Export as Prometheus metrics
    if (config.formats?.includes('prometheus')) {
      this.exportToPrometheus(session, exportPath);
    }
  }

  private exportToCSV(session: AegisSession, exportPath: string): void {
    const csvLines = ['timestamp,operation,type,duration,success,blueprintId,score,validationRate'];

    session.events.forEach(event => {
      csvLines.push(
        [
          event.timestamp,
          event.operation,
          event.type,
          event.duration || '',
          event.success,
          event.metadata.blueprintId || '',
          event.metadata.totalScore || '',
          event.metadata.validationRate || '',
        ].join(',')
      );
    });

    const csvFile = path.join(exportPath, `${session.id}.csv`);
    fs.writeFileSync(csvFile, csvLines.join('\n'));
  }

  private exportToPrometheus(session: AegisSession, exportPath: string): void {
    const metrics = [
      `# HELP aegis_operation_duration_seconds Time spent on operations`,
      `# TYPE aegis_operation_duration_seconds histogram`,
      `aegis_operation_duration_seconds{operation="${session.operation}",success="${session.success}"} ${(session.totalDuration || 0) / 1000}`,
      '',
      `# HELP aegis_evaluation_score Current evaluation score`,
      `# TYPE aegis_evaluation_score gauge`,
      `aegis_evaluation_score{operation="${session.operation}"} ${session.summary.overallScore || 0}`,
      '',
    ];

    const metricsFile = path.join(exportPath, `${session.id}.prom`);
    fs.writeFileSync(metricsFile, metrics.join('\n'));
  }

  // Static factory methods
  static forHydration(projectPath: string): AegisTelemetry {
    return new AegisTelemetry('hydrate', { projectPath });
  }

  static forGeneration(blueprintId: string): AegisTelemetry {
    return new AegisTelemetry('generate', { blueprintId });
  }

  static forEvaluation(): AegisTelemetry {
    return new AegisTelemetry('evaluate');
  }

  static forValidation(): AegisTelemetry {
    return new AegisTelemetry('validate');
  }
}

export type { AegisEvent, AegisMetrics, AegisSession };
