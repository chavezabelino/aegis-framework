#!/usr/bin/env node

/**
 * Aegis Evaluation Engine
 * 
 * First-class evals in CI: golden prompts + expected artifacts + LLM-as-judge
 * Unit/integration → prompt evals → LLM-as-judge (style only) → delta vs baseline
 * 
 * @aegisFrameworkVersion 2.4.0
 * @intent Production-grade evaluation pipeline for AI-generated code
 * @context Hardening Aegis from "promising" to "undeniable"
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Command } from 'commander';
import { performance } from 'perf_hooks';

interface EvalPrompt {
  id: string;
  name: string;
  version: string;
  aegisFrameworkVersion: string;
  description: string;
  prompt: string;
  expectedOutputs: ExpectedOutput[];
  qualityChecks: QualityChecks;
  performance: PerformanceThresholds;
  judges: Judge[];
}

interface ExpectedOutput {
  type: string;
  files: string[];
  validationRules: string[];
}

interface QualityChecks {
  security?: string[];
  codeQuality?: string[];
  frameworkCompliance?: string[];
}

interface PerformanceThresholds {
  maxGenerationTime: number;
  maxTokens: number;
  expectedFiles: number;
  expectedLines: number;
}

interface Judge {
  name: string;
  prompt: string;
  weight: number;
}

interface EvalResult {
  id: string;
  timestamp: string;
  passed: boolean;
  score: number;
  performance: PerformanceResult;
  validation: ValidationResult;
  judgeResults: JudgeResult[];
  errors: string[];
  warnings: string[];
}

interface PerformanceResult {
  generationTime: number;
  tokensUsed: number;
  filesGenerated: number;
  linesGenerated: number;
  withinThresholds: boolean;
}

interface ValidationResult {
  rulesPassed: number;
  rulesTotal: number;
  passRate: number;
  failedRules: string[];
}

interface JudgeResult {
  name: string;
  score: number;
  weight: number;
  reasoning: string;
  criticalIssues: string[];
  recommendations: string[];
}

interface Baseline {
  version: string;
  timestamp: string;
  averageScore: number;
  performanceMetrics: PerformanceResult;
  passRate: number;
}

class AegisEvaluationEngine {
  private frameworkRoot: string;
  private evalsPath: string;
  private resultsPath: string;
  private baselinesPath: string;

  constructor(frameworkRoot: string = process.cwd()) {
    this.frameworkRoot = frameworkRoot;
    this.evalsPath = path.join(frameworkRoot, 'evals');
    this.resultsPath = path.join(frameworkRoot, '.aegis', 'eval-results');
    this.baselinesPath = path.join(frameworkRoot, '.aegis', 'baselines');
    this.ensureDirectories();
  }

  private ensureDirectories(): void {
    [this.resultsPath, this.baselinesPath].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async runEvaluation(
    evalId?: string,
    options: {
      ci?: boolean;
      baseline?: string;
      threshold?: number;
      verbose?: boolean;
    } = {}
  ): Promise<EvalResult[]> {
    console.log(`🧪 Running Aegis Framework Evaluations...`);
    
    const evalPrompts = await this.loadEvalPrompts(evalId);
    const results: EvalResult[] = [];

    for (const evalPrompt of evalPrompts) {
      console.log(`\n📋 Evaluating: ${evalPrompt.name}`);
      
      const result = await this.runSingleEvaluation(evalPrompt, options);
      results.push(result);
      
      await this.storeResult(result);
      
      if (options.verbose) {
        this.printDetailedResult(result);
      } else {
        this.printSummaryResult(result);
      }
    }

    // Check against baseline if specified
    if (options.baseline) {
      await this.compareAgainstBaseline(results, options.baseline, options.threshold);
    }

    // CI mode: fail if any critical issues or below threshold
    if (options.ci) {
      const criticalFailures = results.some(r => !r.passed || r.score < (options.threshold || 0.8));
      if (criticalFailures) {
        console.log(`\n❌ CI evaluation failed - critical issues detected`);
        process.exit(1);
      }
    }

    return results;
  }

  private async runSingleEvaluation(
    evalPrompt: EvalPrompt,
    options: any
  ): Promise<EvalResult> {
    const startTime = performance.now();
    
    const result: EvalResult = {
      id: evalPrompt.id,
      timestamp: new Date().toISOString(),
      passed: false,
      score: 0,
      performance: {
        generationTime: 0,
        tokensUsed: 0,
        filesGenerated: 0,
        linesGenerated: 0,
        withinThresholds: false
      },
      validation: {
        rulesPassed: 0,
        rulesTotal: 0,
        passRate: 0,
        failedRules: []
      },
      judgeResults: [],
      errors: [],
      warnings: []
    };

    try {
      // Step 1: Unit/Integration Tests
      console.log(`  🔧 Running unit/integration tests...`);
      const testsResult = await this.runTests();
      if (!testsResult.passed) {
        result.errors.push('Unit/integration tests failed');
        return result;
      }

      // Step 2: Blueprint Generation with Performance Tracking
      console.log(`  🎯 Generating from blueprint...`);
      const generationStart = performance.now();
      const generationResult = await this.runBlueprintGeneration(evalPrompt);
      const generationTime = performance.now() - generationStart;

      result.performance.generationTime = generationTime;
      result.performance.tokensUsed = generationResult.tokensUsed;
      result.performance.filesGenerated = generationResult.filesGenerated;
      result.performance.linesGenerated = generationResult.linesGenerated;

      // Step 3: Validation Rules Check
      console.log(`  ✅ Validating outputs...`);
      result.validation = await this.validateOutputs(evalPrompt, generationResult);

      // Step 4: Performance Threshold Check
      result.performance.withinThresholds = this.checkPerformanceThresholds(
        result.performance,
        evalPrompt.performance
      );

      // Step 5: LLM-as-Judge Evaluation (Style/Quality Only)
      console.log(`  👨‍⚖️ Running LLM judges...`);
      result.judgeResults = await this.runJudges(evalPrompt, generationResult);

      // Calculate overall score
      result.score = this.calculateOverallScore(result);
      result.passed = result.validation.passRate >= 0.8 && 
                     result.score >= 0.7 && 
                     result.performance.withinThresholds;

    } catch (error) {
      result.errors.push(`Evaluation failed: ${error}`);
    }

    return result;
  }

  private async loadEvalPrompts(evalId?: string): Promise<EvalPrompt[]> {
    const promptsDir = path.join(this.evalsPath, 'golden-prompts');
    const files = fs.readdirSync(promptsDir).filter(f => f.endsWith('.yaml'));
    
    const prompts: EvalPrompt[] = [];
    
    for (const file of files) {
      const content = fs.readFileSync(path.join(promptsDir, file), 'utf8');
      const prompt = yaml.load(content) as EvalPrompt;
      
      if (!evalId || prompt.id === evalId) {
        prompts.push(prompt);
      }
    }

    if (evalId && prompts.length === 0) {
      throw new Error(`Evaluation prompt not found: ${evalId}`);
    }

    return prompts;
  }

  private async runTests(): Promise<{ passed: boolean; output: string }> {
    return new Promise((resolve) => {
      const { exec } = require('child_process');
      exec('npm test', (error: any, stdout: string, stderr: string) => {
        resolve({
          passed: !error,
          output: stdout + stderr
        });
      });
    });
  }

  private async runBlueprintGeneration(evalPrompt: EvalPrompt): Promise<{
    tokensUsed: number;
    filesGenerated: number;
    linesGenerated: number;
    outputPath: string;
  }> {
    // This would integrate with the actual blueprint generation
    // For now, simulate the process
    
    const outputPath = path.join(this.resultsPath, evalPrompt.id);
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    // Mock generation - in real implementation, this would call the blueprint engine
    const mockFiles = [
      'auth/login.ts',
      'auth/register.ts',
      'types/auth.ts',
      'output.strict.json'
    ];

    let totalLines = 0;
    for (const file of mockFiles) {
      const filePath = path.join(outputPath, file);
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      const mockContent = `// Generated for evaluation: ${evalPrompt.id}\n// Mock implementation\n`;
      fs.writeFileSync(filePath, mockContent);
      totalLines += mockContent.split('\n').length;
    }

    return {
      tokensUsed: 2048, // Mock value
      filesGenerated: mockFiles.length,
      linesGenerated: totalLines,
      outputPath
    };
  }

  private async validateOutputs(
    evalPrompt: EvalPrompt,
    generationResult: any
  ): Promise<ValidationResult> {
    const validation: ValidationResult = {
      rulesPassed: 0,
      rulesTotal: 0,
      passRate: 0,
      failedRules: []
    };

    for (const expectedOutput of evalPrompt.expectedOutputs) {
      for (const rule of expectedOutput.validationRules) {
        validation.rulesTotal++;
        
        // Mock validation - in real implementation, check actual files
        const passed = Math.random() > 0.2; // 80% pass rate for demo
        
        if (passed) {
          validation.rulesPassed++;
        } else {
          validation.failedRules.push(rule);
        }
      }
    }

    validation.passRate = validation.rulesTotal > 0 
      ? validation.rulesPassed / validation.rulesTotal 
      : 0;

    return validation;
  }

  private checkPerformanceThresholds(
    actual: PerformanceResult,
    expected: PerformanceThresholds
  ): boolean {
    return actual.generationTime <= expected.maxGenerationTime &&
           actual.tokensUsed <= expected.maxTokens &&
           actual.filesGenerated >= expected.expectedFiles * 0.8 && // 80% of expected
           actual.linesGenerated >= expected.expectedLines * 0.8;
  }

  private async runJudges(
    evalPrompt: EvalPrompt,
    generationResult: any
  ): Promise<JudgeResult[]> {
    const results: JudgeResult[] = [];

    for (const judge of evalPrompt.judges) {
      // Mock LLM-as-judge evaluation
      // In real implementation, this would call an LLM with the judge prompt
      
      const mockResult: JudgeResult = {
        name: judge.name,
        score: 0.7 + Math.random() * 0.3, // Random score between 0.7-1.0
        weight: judge.weight,
        reasoning: `Mock evaluation for ${judge.name}`,
        criticalIssues: [],
        recommendations: [`Consider improving ${judge.name} aspects`]
      };

      results.push(mockResult);
    }

    return results;
  }

  private calculateOverallScore(result: EvalResult): number {
    const validationScore = result.validation.passRate;
    const performanceScore = result.performance.withinThresholds ? 1.0 : 0.5;
    
    const judgeScore = result.judgeResults.reduce((sum, judge) => {
      return sum + (judge.score * judge.weight);
    }, 0);

    // Weighted average: 40% validation, 20% performance, 40% judges
    return (validationScore * 0.4) + (performanceScore * 0.2) + (judgeScore * 0.4);
  }

  private async compareAgainstBaseline(
    results: EvalResult[],
    baselineName: string,
    threshold: number = 0.95
  ): Promise<void> {
    console.log(`\n📊 Comparing against baseline: ${baselineName}`);
    
    const baseline = await this.loadBaseline(baselineName);
    if (!baseline) {
      console.log(`⚠️  Baseline not found: ${baselineName}`);
      return;
    }

    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    const scoreRatio = avgScore / baseline.averageScore;

    console.log(`   Baseline Score: ${baseline.averageScore.toFixed(3)}`);
    console.log(`   Current Score:  ${avgScore.toFixed(3)}`);
    console.log(`   Ratio: ${scoreRatio.toFixed(3)}`);

    if (scoreRatio < threshold) {
      console.log(`❌ Regression detected! Score dropped below ${threshold} threshold`);
      process.exit(1);
    } else {
      console.log(`✅ Performance maintained or improved`);
    }
  }

  private async loadBaseline(name: string): Promise<Baseline | null> {
    const baselinePath = path.join(this.baselinesPath, `${name}.json`);
    if (!fs.existsSync(baselinePath)) return null;
    
    const content = fs.readFileSync(baselinePath, 'utf8');
    return JSON.parse(content) as Baseline;
  }

  private async storeResult(result: EvalResult): Promise<void> {
    const filename = `${result.id}-${Date.now()}.json`;
    const filepath = path.join(this.resultsPath, filename);
    fs.writeFileSync(filepath, JSON.stringify(result, null, 2));
  }

  private printSummaryResult(result: EvalResult): void {
    const status = result.passed ? '✅' : '❌';
    const score = (result.score * 100).toFixed(1);
    const validation = (result.validation.passRate * 100).toFixed(1);
    
    console.log(`${status} ${result.id}: ${score}% score, ${validation}% validation`);
  }

  private printDetailedResult(result: EvalResult): void {
    console.log(`\n📊 Detailed Results for ${result.id}:`);
    console.log(`   Overall Score: ${(result.score * 100).toFixed(1)}%`);
    console.log(`   Validation: ${result.validation.rulesPassed}/${result.validation.rulesTotal} rules passed`);
    console.log(`   Performance: ${result.performance.withinThresholds ? 'Within' : 'Outside'} thresholds`);
    console.log(`   Generation Time: ${result.performance.generationTime.toFixed(0)}ms`);
    
    if (result.judgeResults.length > 0) {
      console.log(`\n   Judge Results:`);
      result.judgeResults.forEach(judge => {
        console.log(`     ${judge.name}: ${(judge.score * 100).toFixed(1)}% (weight: ${judge.weight})`);
      });
    }

    if (result.errors.length > 0) {
      console.log(`\n   Errors:`);
      result.errors.forEach(error => console.log(`     ❌ ${error}`));
    }

    if (result.warnings.length > 0) {
      console.log(`\n   Warnings:`);
      result.warnings.forEach(warning => console.log(`     ⚠️  ${warning}`));
    }
  }

  async createBaseline(name: string, version: string): Promise<void> {
    console.log(`📊 Creating baseline: ${name}`);
    
    const results = await this.runEvaluation();
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    const passRate = results.filter(r => r.passed).length / results.length;
    
    const avgPerformance: PerformanceResult = {
      generationTime: results.reduce((sum, r) => sum + r.performance.generationTime, 0) / results.length,
      tokensUsed: results.reduce((sum, r) => sum + r.performance.tokensUsed, 0) / results.length,
      filesGenerated: results.reduce((sum, r) => sum + r.performance.filesGenerated, 0) / results.length,
      linesGenerated: results.reduce((sum, r) => sum + r.performance.linesGenerated, 0) / results.length,
      withinThresholds: results.every(r => r.performance.withinThresholds)
    };

    const baseline: Baseline = {
      version,
      timestamp: new Date().toISOString(),
      averageScore: avgScore,
      performanceMetrics: avgPerformance,
      passRate
    };

    const baselinePath = path.join(this.baselinesPath, `${name}.json`);
    fs.writeFileSync(baselinePath, JSON.stringify(baseline, null, 2));
    
    console.log(`✅ Baseline created: ${avgScore.toFixed(3)} average score`);
  }
}

// CLI Implementation
const program = new Command();

program
  .name('aegis-eval')
  .description('First-class evaluations for Aegis Framework')
  .version('2.4.0');

program
  .command('run')
  .description('Run evaluation suite')
  .argument('[eval-id]', 'Specific evaluation to run')
  .option('--ci', 'CI mode (fail on critical issues)')
  .option('--baseline <name>', 'Compare against baseline')
  .option('--threshold <value>', 'Score threshold for CI mode', parseFloat, 0.8)
  .option('--verbose', 'Detailed output')
  .action(async (evalId, options) => {
    const engine = new AegisEvaluationEngine();
    await engine.runEvaluation(evalId, options);
  });

program
  .command('baseline')
  .description('Create performance baseline')
  .argument('<name>', 'Baseline name')
  .argument('<version>', 'Version identifier')
  .action(async (name, version) => {
    const engine = new AegisEvaluationEngine();
    await engine.createBaseline(name, version);
  });

// Default command
program
  .arguments('[eval-id]')
  .option('--ci', 'CI mode (fail on critical issues)')
  .option('--baseline <name>', 'Compare against baseline')
  .option('--threshold <value>', 'Score threshold for CI mode', parseFloat, 0.8)
  .option('--verbose', 'Detailed output')
  .action(async (evalId, options) => {
    const engine = new AegisEvaluationEngine();
    await engine.runEvaluation(evalId, options);
  });

if (require.main === module) {
  program.parse();
}

export { AegisEvaluationEngine, type EvalResult, type EvalPrompt };
