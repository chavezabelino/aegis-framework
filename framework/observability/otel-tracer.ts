/**
 * OpenTelemetry Tracer for Aegis Framework
 *
 * Emit OpenTelemetry traces from CLI: plan → generate → test → repair → PR
 * Correlate to commit SHA and blueprint ID for complete provenance
 *
 * @aegisFrameworkVersion 2.4.0
 * @intent Production-grade observability with OpenTelemetry standard
 * @context Hardening Aegis observability infrastructure
 */

import { NodeSDK } from '@opentelemetry/sdk-node';

import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { trace, SpanStatusCode, SpanKind } from '@opentelemetry/api';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

interface AegisTraceContext {
  sessionId: string;
  frameworkVersion: string;
  blueprintId?: string;
  commitSha?: string;
  operation: 'hydrate' | 'generate' | 'validate' | 'repair' | 'eval';
  mode?: 'lean' | 'strict' | 'generative';
  userId?: string;
  environment: string;
}

interface AegisSpanAttributes {
  // Framework specific
  'aegis.version': string;
  'aegis.blueprint.id'?: string;
  'aegis.blueprint.version'?: string;
  'aegis.operation': string;
  'aegis.mode'?: string;
  'aegis.session.id': string;

  // Git context
  'git.commit.sha'?: string;
  'git.branch'?: string;
  'git.repository'?: string;

  // User context
  'user.id'?: string;
  'user.environment': string;

  // Performance
  'performance.generation_time_ms'?: number;
  'performance.tokens_used'?: number;
  'performance.files_generated'?: number;
  'performance.lines_generated'?: number;

  // Quality
  'quality.validation.pass_rate'?: number;
  'quality.score'?: number;
  'quality.compliance.constitutional'?: boolean;
}

class AegisOTelTracer {
  private sdk!: NodeSDK;
  private tracer: any;
  private context: AegisTraceContext;
  private initialized = false;

  constructor(context: Partial<AegisTraceContext> = {}) {
    this.context = {
      sessionId: this.generateSessionId(),
      frameworkVersion: this.getFrameworkVersion(),
      commitSha: this.getGitCommitSha(),
      environment: process.env.NODE_ENV || 'development',
      operation: 'generate',
      ...context,
    };

    this.initializeSDK();
  }

  private initializeSDK(): void {
    const serviceName = 'aegis-framework';
    const serviceVersion = this.context.frameworkVersion;

    // Configure exporters based on environment
    const exporters = this.configureExporters();

    // Initialize SDK
    this.sdk = new NodeSDK({
      spanProcessor: new BatchSpanProcessor(exporters.primary),
      instrumentations: [
        getNodeAutoInstrumentations({
          '@opentelemetry/instrumentation-fs': {
            enabled: false, // Too noisy for our use case
          },
        }),
      ],
    });

    // Note: Secondary exporters would need to be configured differently
    // as NodeSDK doesn't have addSpanProcessor method
    // For now, we'll use only the primary exporter
  }

  private configureExporters(): { primary: any; secondary?: any } {
    const config = this.loadObservabilityConfig();

    // Primary exporter (console in dev, OTLP in prod)
    let primary;
    if (config.jaeger?.enabled) {
      primary = new JaegerExporter({
        endpoint: config.jaeger.endpoint || 'http://localhost:14268/api/traces',
      });
    } else if (config.otlp?.enabled) {
      primary = new OTLPTraceExporter({
        url: config.otlp.endpoint || 'http://localhost:4318/v1/traces',
        headers: config.otlp.headers || {},
      });
    } else {
      // Fallback to console
      primary = new ConsoleSpanExporter();
    }

    // Secondary exporter for Langfuse if configured
    let secondary;
    if (config.langfuse?.enabled) {
      secondary = this.createLangfuseExporter(config.langfuse);
    }

    return { primary, secondary };
  }

  private createLangfuseExporter(config: any): any {
    // Custom Langfuse exporter implementation
    return new OTLPTraceExporter({
      url: config.endpoint || 'https://cloud.langfuse.com/api/public/ingestion',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });
  }

  private loadObservabilityConfig(): any {
    const configPath = path.join(process.cwd(), '.aegis', 'observability.json');
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }

    // Default configuration
    return {
      jaeger: { enabled: false },
      otlp: { enabled: false },
      langfuse: { enabled: false },
      console: { enabled: this.context.environment === 'development' },
    };
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      this.sdk.start();
      this.tracer = trace.getTracer('aegis-framework', this.context.frameworkVersion);
      this.initialized = true;

      console.log(`🔍 OpenTelemetry initialized for session: ${this.context.sessionId.substring(0, 8)}...`);
    } catch (error) {
      console.warn(`⚠️  Failed to initialize OpenTelemetry:`, error);
    }
  }

  async shutdown(): Promise<void> {
    if (this.initialized) {
      await this.sdk.shutdown();
      this.initialized = false;
    }
  }

  startOperation(operationName: string, attributes: Partial<AegisSpanAttributes> = {}): any {
    if (!this.initialized) {
      console.warn('OTel tracer not initialized, creating noop span');
      return trace.getActiveSpan() || trace.getTracer('noop').startSpan('noop');
    }

    const span = this.tracer.startSpan(operationName, {
      kind: SpanKind.INTERNAL,
      attributes: {
        'aegis.version': this.context.frameworkVersion,
        'aegis.session.id': this.context.sessionId,
        'aegis.operation': this.context.operation,
        'user.environment': this.context.environment,
        ...this.getGitAttributes(),
        ...attributes,
      },
    });

    return span;
  }

  async traceOperation<T>(
    operationName: string,
    operation: () => Promise<T>,
    attributes: Partial<AegisSpanAttributes> = {}
  ): Promise<T> {
    const span = this.startOperation(operationName, attributes);

    try {
      const result = await operation();
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : String(error),
      });
      span.recordException(error as Error);
      throw error;
    } finally {
      span.end();
    }
  }

  recordBlueprintGeneration(
    blueprintId: string,
    blueprintVersion: string,
    performance: {
      generationTime: number;
      tokensUsed: number;
      filesGenerated: number;
      linesGenerated: number;
    },
    quality: {
      validationPassRate: number;
      score: number;
      constitutionalCompliance: boolean;
    }
  ): void {
    const span = this.startOperation('blueprint.generation', {
      'aegis.blueprint.id': blueprintId,
      'aegis.blueprint.version': blueprintVersion,
      'performance.generation_time_ms': performance.generationTime,
      'performance.tokens_used': performance.tokensUsed,
      'performance.files_generated': performance.filesGenerated,
      'performance.lines_generated': performance.linesGenerated,
      'quality.validation.pass_rate': quality.validationPassRate,
      'quality.score': quality.score,
      'quality.compliance.constitutional': quality.constitutionalCompliance,
    });

    // Add events for key milestones
    span.addEvent('generation.started', {
      'blueprint.id': blueprintId,
      mode: this.context.mode || 'strict',
    });

    span.addEvent('generation.completed', {
      'files.count': performance.filesGenerated,
      'lines.count': performance.linesGenerated,
      'duration.ms': performance.generationTime,
    });

    span.addEvent('validation.completed', {
      pass_rate: quality.validationPassRate,
      constitutional_compliance: quality.constitutionalCompliance,
    });

    span.setStatus({ code: SpanStatusCode.OK });
    span.end();
  }

  recordEvaluation(
    evalId: string,
    results: {
      passed: boolean;
      score: number;
      validationPassRate: number;
      performance: any;
      errors: string[];
    }
  ): void {
    const span = this.startOperation('aegis.evaluation', {
      'aegis.session.id': evalId, // Use existing attribute
      'quality.validation.pass_rate': results.validationPassRate,
      'quality.score': results.score,
    });

    span.addEvent('evaluation.started', { 'eval.id': evalId });

    if (results.errors.length > 0) {
      span.addEvent('evaluation.errors', {
        'error.count': results.errors.length,
        errors: results.errors.slice(0, 3).join(', '), // First 3 errors
      });
    }

    span.addEvent('evaluation.completed', {
      result: results.passed ? 'passed' : 'failed',
      score: results.score,
    });

    span.setStatus({
      code: results.passed ? SpanStatusCode.OK : SpanStatusCode.ERROR,
      message: results.passed ? undefined : `Evaluation failed: ${results.errors[0] || 'Unknown error'}`,
    });

    span.end();
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
    return '2.4.0'; // fallback
  }

  private getGitCommitSha(): string | undefined {
    try {
      return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    } catch {
      return undefined;
    }
  }

  private getGitAttributes(): Partial<AegisSpanAttributes> {
    const attributes: Partial<AegisSpanAttributes> = {};

    try {
      attributes['git.commit.sha'] = this.context.commitSha;

      const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      if (branch) attributes['git.branch'] = branch;

      const remote = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
      if (remote) attributes['git.repository'] = remote;
    } catch {
      // Git commands failed, skip git attributes
    }

    return attributes;
  }

  // Static factory methods for common operations
  static async forHydration(projectPath: string): Promise<AegisOTelTracer> {
    const tracer = new AegisOTelTracer({
      operation: 'hydrate',
      userId: os.userInfo().username,
    });
    await tracer.initialize();
    return tracer;
  }

  static async forGeneration(
    blueprintId: string,
    mode: 'lean' | 'strict' | 'generative' = 'strict'
  ): Promise<AegisOTelTracer> {
    const tracer = new AegisOTelTracer({
      operation: 'generate',
      blueprintId,
      mode,
      userId: os.userInfo().username,
    });
    await tracer.initialize();
    return tracer;
  }

  static async forEvaluation(): Promise<AegisOTelTracer> {
    const tracer = new AegisOTelTracer({
      operation: 'eval',
      userId: os.userInfo().username,
    });
    await tracer.initialize();
    return tracer;
  }
}

export { AegisOTelTracer, type AegisTraceContext, type AegisSpanAttributes };
