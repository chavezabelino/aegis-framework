#!/usr/bin/env node

/**
 * @aegisFrameworkVersion: 2.4.0
 * @intent: Intelligent pattern recognition system for systematic issue detection
 * @context: Automatically detect systematic patterns from single violations
 * @mode: strict
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface PatternAnalysis {
  pattern: string;
  confidence: number;
  affectedFiles: string[];
  cascadingEffects: string[];
  preventionStrategies: string[];
  systematicIssue: boolean;
}

interface IntelligentQuestion {
  question: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  reasoning: string;
  actionRequired: boolean;
}

interface SystematicAnalysis {
  isIsolated: boolean;
  systematicPattern: string[];
  affectedFiles: string[];
  cascadingEffects: string[];
  preventionStrategies: string[];
  intelligentQuestions: IntelligentQuestion[];
  recommendedActions: string[];
}

class IntelligentPatternDetector {
  private frameworkRoot: string;
  private knownPatterns: Map<string, PatternAnalysis> = new Map();

  constructor(frameworkRoot: string = process.cwd()) {
    this.frameworkRoot = frameworkRoot;
    this.initializeKnownPatterns();
  }

  /**
   * Initialize known systematic patterns
   */
  private initializeKnownPatterns(): void {
    // Version consistency patterns
    this.knownPatterns.set('version-consistency', {
      pattern: 'version references across multiple files',
      confidence: 0.95,
      affectedFiles: [],
      cascadingEffects: ['build failures', 'documentation drift', 'constitutional violations'],
      preventionStrategies: ['automated version scanning', 'comprehensive update scripts'],
      systematicIssue: true,
    });

    // Documentation drift patterns
    this.knownPatterns.set('documentation-drift', {
      pattern: 'documentation inconsistencies across similar files',
      confidence: 0.9,
      affectedFiles: [],
      cascadingEffects: ['user confusion', 'maintenance issues', 'constitutional violations'],
      preventionStrategies: ['automated documentation validation', 'cross-file consistency checks'],
      systematicIssue: true,
    });

    // Build configuration patterns
    this.knownPatterns.set('build-config', {
      pattern: 'build configuration inconsistencies',
      confidence: 0.85,
      affectedFiles: [],
      cascadingEffects: ['build failures', 'deployment issues', 'development friction'],
      preventionStrategies: ['automated build validation', 'configuration templates'],
      systematicIssue: true,
    });

    // Tool script patterns
    this.knownPatterns.set('tool-scripts', {
      pattern: 'tool script inconsistencies',
      confidence: 0.8,
      affectedFiles: [],
      cascadingEffects: ['tool failures', 'automation breakdowns', 'user frustration'],
      preventionStrategies: ['automated tool validation', 'script templates'],
      systematicIssue: true,
    });
  }

  /**
   * Analyze single violation for systematic patterns
   */
  async analyzeSingleViolation(violation: any): Promise<SystematicAnalysis> {
    const analysis: SystematicAnalysis = {
      isIsolated: false,
      systematicPattern: [],
      affectedFiles: [],
      cascadingEffects: [],
      preventionStrategies: [],
      intelligentQuestions: [],
      recommendedActions: [],
    };

    // Determine violation type and apply systematic thinking
    const violationType = this.determineViolationType(violation);
    const patternAnalysis = this.knownPatterns.get(violationType);

    if (patternAnalysis) {
      analysis.isIsolated = false;
      analysis.systematicPattern = [patternAnalysis.pattern];
      analysis.affectedFiles = await this.findSimilarFiles(violation.file, violationType);
      analysis.cascadingEffects = patternAnalysis.cascadingEffects;
      analysis.preventionStrategies = patternAnalysis.preventionStrategies;
    }

    // Generate intelligent questions
    analysis.intelligentQuestions = await this.generateIntelligentQuestions(violation, analysis);

    // Generate recommended actions
    analysis.recommendedActions = this.generateRecommendedActions(analysis);

    return analysis;
  }

  /**
   * Determine violation type for pattern matching
   */
  private determineViolationType(violation: any): string {
    if (violation.type === 'version-consistency') return 'version-consistency';
    if (violation.file?.includes('docs/')) return 'documentation-drift';
    if (violation.file?.includes('vite.config') || violation.file?.includes('tsconfig')) return 'build-config';
    if (violation.file?.includes('tools/') || violation.file?.includes('scripts/')) return 'tool-scripts';

    return 'unknown';
  }

  /**
   * Find similar files that might have the same issue
   */
  private async findSimilarFiles(filePath: string, violationType: string): Promise<string[]> {
    const similarFiles: string[] = [];

    switch (violationType) {
      case 'version-consistency':
        similarFiles.push(...(await this.findVersionConsistencyFiles()));
        break;
      case 'documentation-drift':
        similarFiles.push(...(await this.findDocumentationFiles()));
        break;
      case 'build-config':
        similarFiles.push(...(await this.findBuildConfigFiles()));
        break;
      case 'tool-scripts':
        similarFiles.push(...(await this.findToolScriptFiles()));
        break;
    }

    return similarFiles;
  }

  /**
   * Find files that might have version consistency issues
   */
  private async findVersionConsistencyFiles(): Promise<string[]> {
    const patterns = ['**/*.ts', '**/*.js', '**/*.md', '**/*.yaml', '**/*.yml', '**/*.json', '**/*.sh', '**/*.cjs'];

    const files: string[] = [];
    for (const pattern of patterns) {
      const matches = await glob(pattern, {
        cwd: this.frameworkRoot,
        ignore: ['node_modules/**', 'dist/**', '.git/**', '**/*.map', '**/*.d.ts'],
      });
      files.push(...matches);
    }

    return files;
  }

  /**
   * Find documentation files
   */
  private async findDocumentationFiles(): Promise<string[]> {
    const patterns = ['docs/**/*.md', 'README.md', 'CHANGELOG.md', 'CONTRIBUTING.md', 'LICENSE'];

    const files: string[] = [];
    for (const pattern of patterns) {
      const matches = await glob(pattern, {
        cwd: this.frameworkRoot,
      });
      files.push(...matches);
    }

    return files;
  }

  /**
   * Find build configuration files
   */
  private async findBuildConfigFiles(): Promise<string[]> {
    const patterns = [
      'vite.config.ts',
      'vite.cli.config.ts',
      'tsconfig.json',
      'tsconfig.dev.json',
      'package.json',
      'webpack.config.js',
      'rollup.config.js',
    ];

    const files: string[] = [];
    for (const pattern of patterns) {
      const matches = await glob(pattern, {
        cwd: this.frameworkRoot,
      });
      files.push(...matches);
    }

    return files;
  }

  /**
   * Find tool script files
   */
  private async findToolScriptFiles(): Promise<string[]> {
    const patterns = [
      'tools/**/*.ts',
      'tools/**/*.js',
      'tools/**/*.sh',
      'tools/**/*.cjs',
      'scripts/**/*.ts',
      'scripts/**/*.js',
      'scripts/**/*.sh',
      'scripts/**/*.cjs',
      'cli/**/*.ts',
      'cli/**/*.js',
    ];

    const files: string[] = [];
    for (const pattern of patterns) {
      const matches = await glob(pattern, {
        cwd: this.frameworkRoot,
      });
      files.push(...matches);
    }

    return files;
  }

  /**
   * Generate intelligent questions for systematic analysis
   */
  private async generateIntelligentQuestions(
    violation: any,
    analysis: SystematicAnalysis
  ): Promise<IntelligentQuestion[]> {
    const questions: IntelligentQuestion[] = [];

    // Always ask systematic thinking questions
    questions.push({
      question: 'Is this isolated or systematic?',
      priority: 'critical',
      reasoning: 'Single violations often indicate systematic patterns',
      actionRequired: true,
    });

    questions.push({
      question: 'What else might be affected?',
      priority: 'high',
      reasoning: 'Similar files likely have the same issue',
      actionRequired: true,
    });

    questions.push({
      question: 'Should I have caught this earlier?',
      priority: 'high',
      reasoning: 'Framework should automatically detect systematic issues',
      actionRequired: true,
    });

    questions.push({
      question: 'What patterns am I missing?',
      priority: 'medium',
      reasoning: 'Pattern recognition is key to systematic thinking',
      actionRequired: false,
    });

    questions.push({
      question: 'How can we prevent this in the future?',
      priority: 'high',
      reasoning: 'Prevention is better than reactive fixes',
      actionRequired: true,
    });

    // Add specific questions based on violation type
    if (analysis.systematicPattern.includes('version references across multiple files')) {
      questions.push({
        question: 'Are there other files with version references that need updating?',
        priority: 'critical',
        reasoning: 'Version updates are rarely isolated to single files',
        actionRequired: true,
      });
    }

    if (analysis.systematicPattern.includes('documentation inconsistencies')) {
      questions.push({
        question: 'Are there similar documentation files that might have the same issue?',
        priority: 'high',
        reasoning: 'Documentation patterns are usually consistent across files',
        actionRequired: true,
      });
    }

    return questions;
  }

  /**
   * Generate recommended actions based on analysis
   */
  private generateRecommendedActions(analysis: SystematicAnalysis): string[] {
    const actions: string[] = [];

    if (!analysis.isIsolated) {
      actions.push('Run comprehensive scanning for similar issues');
      actions.push('Implement automated pattern detection');
      actions.push('Create systematic fix scripts');
    }

    if (analysis.cascadingEffects.length > 0) {
      actions.push('Assess impact of cascading effects');
      actions.push('Implement preventive measures');
    }

    if (analysis.preventionStrategies.length > 0) {
      actions.push('Implement prevention strategies');
      actions.push('Add automated validation');
    }

    actions.push('Document the systematic pattern for future reference');
    actions.push('Update framework intelligence to prevent similar issues');

    return actions;
  }

  /**
   * Automatically suggest systematic analysis
   */
  async suggestSystematicAnalysis(violation: any): Promise<string[]> {
    const suggestions: string[] = [];

    // Always suggest systematic thinking
    suggestions.push('🔍 This appears to be a systematic issue rather than isolated');
    suggestions.push('📁 Similar files likely have the same problem');
    suggestions.push('🛠️ Comprehensive scanning recommended');
    suggestions.push('🤖 Framework should automatically detect such patterns');

    // Add specific suggestions based on violation type
    if (violation.type === 'version-consistency') {
      suggestions.push('📋 Version updates typically affect multiple files');
      suggestions.push('🔧 Automated version update scripts needed');
    }

    if (violation.file?.includes('docs/')) {
      suggestions.push('📚 Documentation patterns are usually consistent');
      suggestions.push('📖 Cross-file documentation validation recommended');
    }

    return suggestions;
  }
}

// Export for use in other tools
export { IntelligentPatternDetector };
export type { PatternAnalysis, IntelligentQuestion, SystematicAnalysis };

// CLI interface
async function main() {
  const detector = new IntelligentPatternDetector();

  if (process.argv.length < 3) {
    console.log('Usage: node intelligent-pattern-detector.ts <violation-file>');
    console.log('Example: node intelligent-pattern-detector.ts violation.json');
    process.exit(1);
  }

  const violationFile = process.argv[2];
  let violation: any = {};

  try {
    const content = fs.readFileSync(violationFile, 'utf8');
    violation = JSON.parse(content);
  } catch (error) {
    console.error('Error reading violation file:', error);
    process.exit(1);
  }

  const analysis = await detector.analyzeSingleViolation(violation);
  const suggestions = await detector.suggestSystematicAnalysis(violation);

  console.log('🧠 Intelligent Pattern Analysis Results');
  console.log('=====================================');
  console.log(`Isolated Issue: ${analysis.isIsolated ? 'No' : 'Yes'}`);
  console.log(`Systematic Pattern: ${analysis.systematicPattern.join(', ')}`);
  console.log(`Affected Files: ${analysis.affectedFiles.length} potential files`);
  console.log('');

  console.log('🚨 Cascading Effects:');
  analysis.cascadingEffects.forEach(effect => {
    console.log(`  - ${effect}`);
  });
  console.log('');

  console.log('🛠️ Prevention Strategies:');
  analysis.preventionStrategies.forEach(strategy => {
    console.log(`  - ${strategy}`);
  });
  console.log('');

  console.log('❓ Intelligent Questions:');
  analysis.intelligentQuestions.forEach(question => {
    console.log(`  [${question.priority.toUpperCase()}] ${question.question}`);
    console.log(`     Reasoning: ${question.reasoning}`);
  });
  console.log('');

  console.log('📋 Recommended Actions:');
  analysis.recommendedActions.forEach(action => {
    console.log(`  - ${action}`);
  });
  console.log('');

  console.log('💡 Systematic Analysis Suggestions:');
  suggestions.forEach(suggestion => {
    console.log(`  ${suggestion}`);
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
