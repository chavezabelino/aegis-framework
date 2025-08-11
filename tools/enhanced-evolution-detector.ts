#!/usr/bin/env node

/**
 * @aegisFrameworkVersion: 2.4.0
 * @intent: Enhanced evolution story detection with intelligence gap analysis
 * @context: Framework learning from systematic thinking failures and intelligence gaps
 * @mode: strict
 */

import * as fs from 'fs';
import * as path from 'path';

interface IntelligenceGapAnalysis {
  type: 'pattern-recognition' | 'systematic-thinking' | 'process-weakness' | 'learning-opportunity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: string[];
  suggestedActions: string[];
  frameworkImpact: string;
}

interface SystematicAnalysis {
  isIsolated: boolean;
  systematicPattern: string[];
  affectedFiles: string[];
  cascadingEffects: string[];
  preventionStrategies: string[];
}

interface EnhancedEvolutionTrigger {
  id: string;
  type: 'constitutional-violation' | 'intelligence-gap' | 'systematic-failure' | 'learning-opportunity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  analysis: IntelligenceGapAnalysis | SystematicAnalysis;
  frameworkEnhancement: string;
  constitutionalAmendment?: string;
}

class EnhancedEvolutionDetector {
  private frameworkRoot: string;
  private conversationContext: string[];
  private detectedGaps: IntelligenceGapAnalysis[] = [];
  private systematicIssues: SystematicAnalysis[] = [];

  constructor(frameworkRoot: string = process.cwd()) {
    this.frameworkRoot = frameworkRoot;
    this.conversationContext = [];
  }

  /**
   * Enhanced evolution story detection with intelligence gap analysis
   */
  async detectEnhancedEvolutionStories(context: string[]): Promise<EnhancedEvolutionTrigger[]> {
    this.conversationContext = context;
    const triggers: EnhancedEvolutionTrigger[] = [];

    // 1. Detect intelligence gaps
    const intelligenceGaps = await this.detectIntelligenceGaps();
    triggers.push(...intelligenceGaps);

    // 2. Detect systematic thinking failures
    const systematicFailures = await this.detectSystematicFailures();
    triggers.push(...systematicFailures);

    // 3. Detect learning opportunities
    const learningOpportunities = await this.detectLearningOpportunities();
    triggers.push(...learningOpportunities);

    // 4. Detect process weaknesses
    const processWeaknesses = await this.detectProcessWeaknesses();
    triggers.push(...processWeaknesses);

    return triggers;
  }

  /**
   * Detect when framework should have caught something but didn't
   */
  private async detectIntelligenceGaps(): Promise<EnhancedEvolutionTrigger[]> {
    const triggers: EnhancedEvolutionTrigger[] = [];
    const context = this.conversationContext.join(' ').toLowerCase();

    // Pattern: User had to point out systematic issues
    if (context.includes("shouldn't you have asked") || context.includes('should you have caught')) {
      triggers.push({
        id: `INTELLIGENCE-GAP-${Date.now()}`,
        type: 'intelligence-gap',
        severity: 'high',
        title: 'Framework Intelligence Gap - Should Have Self-Detected',
        description: 'Framework failed to automatically detect systematic issues that required user intervention',
        analysis: {
          type: 'pattern-recognition',
          severity: 'high',
          description: 'Framework should have automatically detected that single violations suggest systematic issues',
          evidence: [
            'User had to ask if single violation was symptom of larger issue',
            'Framework treated isolated incident without systematic analysis',
            'Failed to apply pattern recognition across similar files',
          ],
          suggestedActions: [
            'Implement automated systematic pattern detection',
            'Add intelligent questioning capabilities',
            'Create cross-file analysis automation',
            'Build predictive validation systems',
          ],
          frameworkImpact: 'Reduces framework intelligence and user trust',
        },
        frameworkEnhancement: 'Intelligent Pattern Recognition System',
        constitutionalAmendment: 'Article XII: Framework Intelligence Standards',
      });
    }

    // Pattern: Manual intervention required for systematic issues
    if (context.includes('systematic gap') || context.includes('larger issue')) {
      triggers.push({
        id: `SYSTEMATIC-INTELLIGENCE-${Date.now()}`,
        type: 'intelligence-gap',
        severity: 'critical',
        title: 'Systematic Intelligence Failure - Manual Detection Required',
        description: 'Framework failed to automatically detect systematic patterns requiring comprehensive fixes',
        analysis: {
          type: 'systematic-thinking',
          severity: 'critical',
          description: 'Framework should have automatically questioned if single violation indicates systematic issue',
          evidence: [
            '45 files found with version inconsistencies',
            'Manual comprehensive scanning required',
            "Framework didn't suggest systematic analysis",
            'User had to identify pattern gap',
          ],
          suggestedActions: [
            'Implement automated systematic questioning',
            'Add cross-file pattern analysis',
            'Create intelligent validation systems',
            'Build predictive issue detection',
          ],
          frameworkImpact: 'Undermines framework reliability and automation',
        },
        frameworkEnhancement: 'Automated Systematic Questioning System',
        constitutionalAmendment: 'Article XIII: Systematic Pattern Detection',
      });
    }

    return triggers;
  }

  /**
   * Detect systematic thinking failures
   */
  private async detectSystematicFailures(): Promise<EnhancedEvolutionTrigger[]> {
    const triggers: EnhancedEvolutionTrigger[] = [];
    const context = this.conversationContext.join(' ').toLowerCase();

    // Pattern: Isolated thinking instead of systematic analysis
    if (context.includes('isolated') || context.includes('larger issue') || context.includes('systematic')) {
      triggers.push({
        id: `SYSTEMATIC-FAILURE-${Date.now()}`,
        type: 'systematic-failure',
        severity: 'high',
        title: 'Systematic Thinking Failure - Isolated Analysis',
        description: 'Framework treated issues in isolation instead of applying systematic thinking',
        analysis: {
          type: 'systematic-thinking',
          severity: 'high',
          description: 'Framework should have automatically applied systematic thinking to detect broader patterns',
          evidence: [
            'Treated single file violation as isolated incident',
            'Failed to question if issue was systematic',
            "Didn't automatically scan for related problems",
            'Manual intervention required for comprehensive fix',
          ],
          suggestedActions: [
            'Implement systematic thinking algorithms',
            'Add automated pattern recognition',
            'Create intelligent questioning systems',
            'Build systematic analysis automation',
          ],
          frameworkImpact: 'Reduces framework effectiveness and user confidence',
        },
        frameworkEnhancement: 'Systematic Thinking Engine',
        constitutionalAmendment: 'Article XIV: Intelligent Questioning Requirements',
      });
    }

    return triggers;
  }

  /**
   * Detect learning opportunities from failures
   */
  private async detectLearningOpportunities(): Promise<EnhancedEvolutionTrigger[]> {
    const triggers: EnhancedEvolutionTrigger[] = [];
    const context = this.conversationContext.join(' ').toLowerCase();

    // Pattern: Framework learning from failures
    if (context.includes('framework enhancement') || context.includes('intelligence gap')) {
      triggers.push({
        id: `LEARNING-OPPORTUNITY-${Date.now()}`,
        type: 'learning-opportunity',
        severity: 'medium',
        title: 'Framework Learning Opportunity - Intelligence Enhancement',
        description: 'Framework can learn from intelligence gaps to improve future detection',
        analysis: {
          type: 'learning-opportunity',
          severity: 'medium',
          description: 'Framework should learn from intelligence failures to prevent future gaps',
          evidence: [
            'Intelligence gaps identified through user feedback',
            'Systematic thinking failures revealed',
            'Pattern recognition weaknesses exposed',
            'Opportunity for framework enhancement identified',
          ],
          suggestedActions: [
            'Implement learning from intelligence failures',
            'Add pattern recognition improvement',
            'Create systematic thinking enhancement',
            'Build automated learning systems',
          ],
          frameworkImpact: 'Improves framework intelligence and reliability',
        },
        frameworkEnhancement: 'Framework Learning System',
        constitutionalAmendment: 'Article XV: Framework Learning Standards',
      });
    }

    return triggers;
  }

  /**
   * Detect process weaknesses
   */
  private async detectProcessWeaknesses(): Promise<EnhancedEvolutionTrigger[]> {
    const triggers: EnhancedEvolutionTrigger[] = [];
    const context = this.conversationContext.join(' ').toLowerCase();

    // Pattern: Process gaps requiring enhancement
    if (context.includes('process') || context.includes('enhancement') || context.includes('improvement')) {
      triggers.push({
        id: `PROCESS-WEAKNESS-${Date.now()}`,
        type: 'learning-opportunity',
        severity: 'high',
        title: 'Process Weakness Detection - Framework Enhancement Needed',
        description: 'Framework processes have gaps requiring systematic enhancement',
        analysis: {
          type: 'process-weakness',
          severity: 'high',
          description: 'Framework processes are incomplete and require systematic enhancement',
          evidence: [
            'Version update process missed 45 files',
            'Manual intervention required for systematic issues',
            'Intelligence gaps in pattern detection',
            'Process automation insufficient',
          ],
          suggestedActions: [
            'Implement comprehensive process automation',
            'Add intelligent process validation',
            'Create automated process enhancement',
            'Build systematic process improvement',
          ],
          frameworkImpact: 'Improves framework reliability and automation',
        },
        frameworkEnhancement: 'Process Enhancement System',
        constitutionalAmendment: 'Article XVI: Process Automation Standards',
      });
    }

    return triggers;
  }

  /**
   * Generate intelligent questions for systematic analysis
   */
  async generateIntelligentQuestions(violation: any): Promise<string[]> {
    return [
      'Is this isolated or systematic?',
      'What else might be affected?',
      'Should I have caught this earlier?',
      'What patterns am I missing?',
      'How can we prevent this in the future?',
      'Are there similar files that might have the same issue?',
      'What systematic thinking should I apply here?',
      'What learning opportunity does this represent?',
      'How can I enhance the framework to prevent this?',
      'What constitutional amendments might be needed?',
    ];
  }

  /**
   * Analyze if single violation suggests systematic issue
   */
  async analyzeSingleViolation(violation: any): Promise<SystematicAnalysis> {
    const analysis: SystematicAnalysis = {
      isIsolated: false,
      systematicPattern: [],
      affectedFiles: [],
      cascadingEffects: [],
      preventionStrategies: [],
    };

    // Apply systematic thinking to determine if isolated
    if (violation.type === 'version-consistency') {
      analysis.isIsolated = false;
      analysis.systematicPattern = ['version references across multiple files'];
      analysis.affectedFiles = await this.findSimilarFiles(violation.file);
      analysis.cascadingEffects = ['build failures', 'documentation drift', 'constitutional violations'];
      analysis.preventionStrategies = ['automated version scanning', 'comprehensive update scripts'];
    }

    return analysis;
  }

  /**
   * Find similar files that might have the same issue
   */
  private async findSimilarFiles(filePath: string): Promise<string[]> {
    const similarFiles: string[] = [];

    // Look for files with similar patterns
    if (filePath.includes('docs/')) {
      similarFiles.push(...(await this.findFilesInDirectory('docs/')));
    }

    if (filePath.includes('tools/')) {
      similarFiles.push(...(await this.findFilesInDirectory('tools/')));
    }

    return similarFiles;
  }

  /**
   * Find all files in a directory
   */
  private async findFilesInDirectory(dirPath: string): Promise<string[]> {
    try {
      const fullPath = path.join(this.frameworkRoot, dirPath);
      if (!fs.existsSync(fullPath)) return [];

      const files: string[] = [];
      const items = fs.readdirSync(fullPath, { withFileTypes: true });

      for (const item of items) {
        if (item.isFile()) {
          files.push(path.join(dirPath, item.name));
        } else if (item.isDirectory()) {
          files.push(...(await this.findFilesInDirectory(path.join(dirPath, item.name))));
        }
      }

      return files;
    } catch (error) {
      return [];
    }
  }
}

// Export for use in other tools
export { EnhancedEvolutionDetector };
export type { EnhancedEvolutionTrigger, IntelligenceGapAnalysis, SystematicAnalysis };

// CLI interface
async function main() {
  const detector = new EnhancedEvolutionDetector();

  if (process.argv.length < 3) {
    console.log('Usage: node enhanced-evolution-detector.ts <context-file>');
    console.log('Example: node enhanced-evolution-detector.ts conversation-context.txt');
    process.exit(1);
  }

  const contextFile = process.argv[2];
  let context: string[] = [];

  try {
    const content = fs.readFileSync(contextFile, 'utf8');
    context = content.split('\n').filter(line => line.trim());
  } catch (error) {
    console.error('Error reading context file:', error);
    process.exit(1);
  }

  const triggers = await detector.detectEnhancedEvolutionStories(context);

  console.log('🔍 Enhanced Evolution Story Detection Results');
  console.log('============================================');
  console.log(`Found ${triggers.length} evolution triggers`);
  console.log('');

  triggers.forEach(trigger => {
    console.log(`🚨 ${trigger.title}`);
    console.log(`   Type: ${trigger.type}`);
    console.log(`   Severity: ${trigger.severity}`);
    console.log(`   Description: ${trigger.description}`);
    console.log(`   Framework Enhancement: ${trigger.frameworkEnhancement}`);
    if (trigger.constitutionalAmendment) {
      console.log(`   Constitutional Amendment: ${trigger.constitutionalAmendment}`);
    }
    console.log('');
  });

  if (triggers.length > 0) {
    console.log('📝 Recommended Actions:');
    triggers.forEach(trigger => {
      if ('suggestedActions' in trigger.analysis) {
        const analysis = trigger.analysis as IntelligenceGapAnalysis;
        analysis.suggestedActions.forEach(action => {
          console.log(`   - ${action}`);
        });
      }
    });
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
