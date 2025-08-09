/**
 * Langfuse Adapter for Aegis Framework
 * 
 * Out-of-the-box Langfuse integration for LLM observability UI
 * Provides team dashboards without additional configuration work
 * 
 * @aegisFrameworkVersion 2.4.0
 * @intent Production-ready LLM observability with zero configuration
 * @context Observability infrastructure hardening
 */

import { Langfuse } from 'langfuse';
import fs from 'fs';
import path from 'path';

interface LangfuseConfig {
  apiKey?: string;
  secretKey?: string;
  baseUrl?: string;
  enabled: boolean;
  projectName?: string;
  environment?: string;
}

interface AegisGenerationData {
  blueprintId: string;
  blueprintVersion: string;
  mode: 'lean' | 'strict' | 'generative';
  prompt: string;
  output: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  metadata: {
    frameworkVersion: string;
    sessionId: string;
    commitSha?: string;
    userId?: string;
  };
  performance: {
    generationTime: number;
    tokensUsed: number;
    filesGenerated: number;
    linesGenerated: number;
  };
  quality: {
    validationPassRate: number;
    score: number;
    constitutionalCompliance: boolean;
    errors: string[];
  };
}

interface AegisEvaluationData {
  evalId: string;
  blueprintId: string;
  judges: Array<{
    name: string;
    score: number;
    reasoning: string;
    criticalIssues: string[];
  }>;
  overallScore: number;
  passed: boolean;
  performance: any;
  metadata: {
    frameworkVersion: string;
    sessionId: string;
    timestamp: string;
  };
}

class AegisLangfuseAdapter {
  private langfuse: Langfuse | null = null;
  private config: LangfuseConfig;
  private initialized = false;

  constructor(config?: Partial<LangfuseConfig>) {
    this.config = {
      enabled: false,
      environment: process.env.NODE_ENV || 'development',
      projectName: 'aegis-framework',
      ...this.loadConfig(),
      ...config
    };

    if (this.config.enabled) {
      this.initialize();
    }
  }

  private loadConfig(): Partial<LangfuseConfig> {
    // Try to load from environment variables
    const envConfig: Partial<LangfuseConfig> = {
      apiKey: process.env.LANGFUSE_API_KEY,
      secretKey: process.env.LANGFUSE_SECRET_KEY,
      baseUrl: process.env.LANGFUSE_BASE_URL || 'https://cloud.langfuse.com',
      enabled: !!process.env.LANGFUSE_API_KEY
    };

    // Try to load from config file
    const configPath = path.join(process.cwd(), '.aegis', 'langfuse.json');
    if (fs.existsSync(configPath)) {
      try {
        const fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return { ...fileConfig, ...envConfig }; // Environment takes precedence
      } catch (error) {
        console.warn('⚠️  Failed to parse Langfuse config file:', error);
      }
    }

    return envConfig;
  }

  private initialize(): void {
    if (!this.config.apiKey || !this.config.secretKey) {
      console.log('📊 Langfuse: API credentials not configured, skipping initialization');
      return;
    }

    try {
      this.langfuse = new Langfuse({
        publicKey: this.config.apiKey,
        secretKey: this.config.secretKey,
        baseUrl: this.config.baseUrl,
      });

      this.initialized = true;
      console.log(`📊 Langfuse initialized for project: ${this.config.projectName}`);
    } catch (error) {
      console.warn('⚠️  Failed to initialize Langfuse:', error);
    }
  }

  async recordGeneration(data: AegisGenerationData): Promise<string | null> {
    if (!this.isReady()) return null;

    try {
      const trace = this.langfuse!.trace({
        id: `aegis-gen-${data.metadata.sessionId}`,
        name: `blueprint-generation-${data.blueprintId}`,
        metadata: {
          blueprintId: data.blueprintId,
          blueprintVersion: data.blueprintVersion,
          frameworkVersion: data.metadata.frameworkVersion,
          commitSha: data.metadata.commitSha,
          environment: this.config.environment,
        },
        tags: ['blueprint-generation', data.mode, data.blueprintId],
      });

      const generation = trace.generation({
        name: `generate-${data.blueprintId}`,
        model: data.model || 'unknown',
        modelParameters: {
          temperature: data.temperature,
          maxTokens: data.maxTokens,
        },
        prompt: [
          {
            role: 'system',
            content: `Aegis Framework Blueprint Generation\nBlueprint: ${data.blueprintId}@${data.blueprintVersion}\nMode: ${data.mode}`
          },
          {
            role: 'user', 
            content: data.prompt
          }
        ],
        completion: data.output,
        usage: {
          promptTokens: Math.floor(data.performance.tokensUsed * 0.7), // Estimate
          completionTokens: Math.floor(data.performance.tokensUsed * 0.3),
          totalTokens: data.performance.tokensUsed,
        },
        metadata: {
          mode: data.mode,
          filesGenerated: data.performance.filesGenerated,
          linesGenerated: data.performance.linesGenerated,
          generationTimeMs: data.performance.generationTime,
        },
      });

      // Add quality score
      generation.score({
        name: 'quality-score',
        value: data.quality.score,
        comment: `Validation pass rate: ${data.quality.validationPassRate}, Constitutional compliance: ${data.quality.constitutionalCompliance}`,
      });

      // Add validation score
      generation.score({
        name: 'validation-pass-rate',
        value: data.quality.validationPassRate,
      });

      // Add constitutional compliance score
      generation.score({
        name: 'constitutional-compliance',
        value: data.quality.constitutionalCompliance ? 1 : 0,
      });

      // Record errors as events
      if (data.quality.errors.length > 0) {
        trace.event({
          name: 'generation-errors',
          metadata: {
            errorCount: data.quality.errors.length,
            errors: data.quality.errors.slice(0, 5), // First 5 errors
          },
        });
      }

      await this.langfuse!.flushAsync();
      return trace.id;

    } catch (error) {
      console.warn('⚠️  Failed to record generation in Langfuse:', error);
      return null;
    }
  }

  async recordEvaluation(data: AegisEvaluationData): Promise<string | null> {
    if (!this.isReady()) return null;

    try {
      const trace = this.langfuse!.trace({
        id: `aegis-eval-${data.metadata.sessionId}`,
        name: `evaluation-${data.evalId}`,
        metadata: {
          evalId: data.evalId,
          blueprintId: data.blueprintId,
          frameworkVersion: data.metadata.frameworkVersion,
          environment: this.config.environment,
        },
        tags: ['evaluation', data.evalId, data.blueprintId],
      });

      // Record overall evaluation score
      trace.score({
        name: 'evaluation-score',
        value: data.overallScore,
        comment: `Overall evaluation result: ${data.passed ? 'PASSED' : 'FAILED'}`,
      });

      // Record judge results
      for (const judge of data.judges) {
        trace.score({
          name: `judge-${judge.name}`,
          value: judge.score,
          comment: judge.reasoning,
        });

        // Record critical issues as events
        if (judge.criticalIssues.length > 0) {
          trace.event({
            name: `${judge.name}-critical-issues`,
            metadata: {
              issues: judge.criticalIssues,
              judgeName: judge.name,
            },
          });
        }
      }

      // Record performance metrics
      trace.event({
        name: 'evaluation-performance',
        metadata: {
          ...data.performance,
          timestamp: data.metadata.timestamp,
        },
      });

      await this.langfuse!.flushAsync();
      return trace.id;

    } catch (error) {
      console.warn('⚠️  Failed to record evaluation in Langfuse:', error);
      return null;
    }
  }

  async recordSession(
    sessionId: string,
    operations: Array<{ type: string; data: any; timestamp: string }>
  ): Promise<string | null> {
    if (!this.isReady()) return null;

    try {
      const session = this.langfuse!.trace({
        id: `aegis-session-${sessionId}`,
        name: 'aegis-framework-session',
        metadata: {
          sessionId,
          operationsCount: operations.length,
          frameworkVersion: operations[0]?.data?.metadata?.frameworkVersion,
          environment: this.config.environment,
        },
        tags: ['session', 'aegis-framework'],
      });

      // Record each operation as a span
      for (const [index, operation] of operations.entries()) {
        session.span({
          name: operation.type,
          startTime: new Date(operation.timestamp),
          metadata: operation.data,
        });
      }

      await this.langfuse!.flushAsync();
      return session.id;

    } catch (error) {
      console.warn('⚠️  Failed to record session in Langfuse:', error);
      return null;
    }
  }

  async createDataset(
    name: string,
    description: string,
    items: Array<{
      input: any;
      expectedOutput: any;
      metadata?: any;
    }>
  ): Promise<string | null> {
    if (!this.isReady()) return null;

    try {
      const dataset = await this.langfuse!.createDataset({
        name,
        description,
        metadata: {
          frameworkVersion: '2.4.0',
          createdBy: 'aegis-framework',
          type: 'blueprint-evaluation',
        },
      });

      // Add items to dataset
      for (const item of items) {
        await this.langfuse!.createDatasetItem({
          datasetName: name,
          input: item.input,
          expectedOutput: item.expectedOutput,
          metadata: item.metadata,
        });
      }

      console.log(`📊 Created Langfuse dataset: ${name} with ${items.length} items`);
      return dataset.id;

    } catch (error) {
      console.warn('⚠️  Failed to create dataset in Langfuse:', error);
      return null;
    }
  }

  async shutdown(): Promise<void> {
    if (this.langfuse) {
      await this.langfuse.shutdownAsync();
    }
  }

  isReady(): boolean {
    return this.initialized && this.langfuse !== null;
  }

  getConfig(): LangfuseConfig {
    return { ...this.config };
  }

  // Static factory methods
  static async createWithEnvironmentConfig(): Promise<AegisLangfuseAdapter> {
    const adapter = new AegisLangfuseAdapter();
    return adapter;
  }

  static async createForProject(projectName: string, config: Partial<LangfuseConfig>): Promise<AegisLangfuseAdapter> {
    const adapter = new AegisLangfuseAdapter({
      ...config,
      projectName,
      enabled: true,
    });
    return adapter;
  }

  // Configuration helper
  static generateConfigFile(config: LangfuseConfig): void {
    const configDir = path.join(process.cwd(), '.aegis');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    const configPath = path.join(configDir, 'langfuse.json');
    const sanitizedConfig = { ...config };
    
    // Don't store secrets in file if they're in environment
    if (process.env.LANGFUSE_API_KEY) delete sanitizedConfig.apiKey;
    if (process.env.LANGFUSE_SECRET_KEY) delete sanitizedConfig.secretKey;

    fs.writeFileSync(configPath, JSON.stringify(sanitizedConfig, null, 2));
    console.log(`📊 Langfuse config written to ${configPath}`);
  }
}

export { 
  AegisLangfuseAdapter, 
  type LangfuseConfig, 
  type AegisGenerationData, 
  type AegisEvaluationData 
};
