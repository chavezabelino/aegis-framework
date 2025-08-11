#!/usr/bin/env node

/**
 * Predictive Constitutional Enforcement
 *
 * Uses pattern recognition to predict and prevent constitutional violations before they occur
 * Part of Phase 2: Intelligent Governance
 *
 * @aegisFrameworkVersion: 2.4.0-beta
 * @intent: Implement predictive enforcement based on learned patterns
 */

import fs from 'fs';
import path from 'path';

interface PreventionRule {
  id: string;
  name: string;
  description: string;
  triggers: PreventionTrigger[];
  interventions: PreventionIntervention[];
  confidence: number;
  enabled: boolean;
}

interface PreventionTrigger {
  type: 'keyword' | 'pattern' | 'context' | 'user-input';
  condition: string;
  weight: number;
}

interface PreventionIntervention {
  type: 'warning' | 'suggestion' | 'clarification' | 'guidance';
  message: string;
  action?: string;
  priority: number;
}

interface PreventionContext {
  userInput: string;
  agentAction: string;
  currentContext: string[];
  riskFactors: string[];
}

class PredictiveEnforcement {
  private frameworkRoot: string;
  private preventionRules: Map<string, PreventionRule> = new Map();

  constructor(frameworkRoot: string = process.cwd()) {
    this.frameworkRoot = frameworkRoot;
    this.loadPreventionRules();
  }

  private loadPreventionRules(): void {
    // Load prevention rules from pattern analysis
    this.initializeDefaultRules();
    this.loadLearnedRules();
  }

  private initializeDefaultRules(): void {
    // Rule based on our node_modules learning
    this.preventionRules.set('file-operation-clarification', {
      id: 'file-operation-clarification',
      name: 'File Operation Intent Clarification',
      description: 'Prevents confusion between git exclusion and file deletion',
      triggers: [
        { type: 'keyword', condition: 'remove', weight: 0.6 },
        { type: 'keyword', condition: 'delete', weight: 0.6 },
        { type: 'keyword', condition: 'node_modules', weight: 0.8 },
        { type: 'keyword', condition: 'gitignore', weight: 0.7 },
        { type: 'keyword', condition: 'commit', weight: 0.5 },
        { type: 'pattern', condition: 'file-operation-suggestion', weight: 0.9 },
      ],
      interventions: [
        {
          type: 'clarification',
          message:
            '🤔 Clarification needed: Do you want to exclude files from git tracking (.gitignore) or remove them from the filesystem?',
          priority: 1,
        },
        {
          type: 'suggestion',
          message:
            '💡 For development dependencies, typically you want to ignore them in git but keep them locally for development.',
          priority: 2,
        },
        {
          type: 'guidance',
          message:
            '📚 Git exclusion (.gitignore) vs File deletion are different operations. Most Node.js projects ignore node_modules/ but keep it locally.',
          priority: 3,
        },
      ],
      confidence: 0.8,
      enabled: true,
    });

    // Rule for version consistency
    this.preventionRules.set('version-consistency-check', {
      id: 'version-consistency-check',
      name: 'Version Consistency Prevention',
      description: 'Prevents version inconsistencies across framework files',
      triggers: [
        { type: 'keyword', condition: 'version', weight: 0.7 },
        { type: 'keyword', condition: 'VERSION', weight: 0.8 },
        { type: 'pattern', condition: 'version-change', weight: 0.9 },
      ],
      interventions: [
        {
          type: 'warning',
          message: '⚠️ Version change detected. Ensure all references are updated consistently.',
          priority: 1,
        },
        {
          type: 'suggestion',
          message: '🔧 Run constitutional validation to check version consistency: npm run validate',
          priority: 2,
        },
      ],
      confidence: 0.9,
      enabled: true,
    });

    // Rule for annotation compliance
    this.preventionRules.set('annotation-enforcement', {
      id: 'annotation-enforcement',
      name: 'Constitutional Annotation Enforcement',
      description: 'Ensures all framework files include proper constitutional annotations',
      triggers: [
        { type: 'pattern', condition: 'new-framework-file', weight: 1.0 },
        { type: 'pattern', condition: 'blueprint-creation', weight: 0.9 },
      ],
      interventions: [
        {
          type: 'guidance',
          message: '📝 Remember to include constitutional annotations: @aegisFrameworkVersion and @intent',
          priority: 1,
        },
        {
          type: 'suggestion',
          message:
            '✅ Use this template:\n<!--\n@aegisFrameworkVersion: 1.1.0-beta\n@intent: Description of purpose\n-->',
          priority: 2,
        },
      ],
      confidence: 0.95,
      enabled: true,
    });
  }

  private loadLearnedRules(): void {
    try {
      const analysisPath = path.join(this.frameworkRoot, 'framework/learning/pattern-analysis.json');
      if (fs.existsSync(analysisPath)) {
        const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));

        // Convert learned patterns into prevention rules
        for (const pattern of analysis.patterns) {
          this.convertPatternToRule(pattern);
        }
      }
    } catch (error) {
      console.warn('⚠️ Could not load learned prevention rules');
    }
  }

  private convertPatternToRule(pattern: any): void {
    const ruleId = `learned-${pattern.id}`;

    const rule: PreventionRule = {
      id: ruleId,
      name: `Learned: ${pattern.type}`,
      description: `Prevention rule learned from pattern: ${pattern.id}`,
      triggers: pattern.preventionStrategy.triggers.map((trigger: string) => ({
        type: 'pattern' as const,
        condition: trigger,
        weight: 0.8,
      })),
      interventions: pattern.preventionStrategy.interventions.map((intervention: any, index: number) => ({
        type: intervention.type,
        message: intervention.message,
        action: intervention.action,
        priority: intervention.priority || index + 1,
      })),
      confidence: pattern.prediction.confidence,
      enabled: true,
    };

    this.preventionRules.set(ruleId, rule);
  }

  async evaluatePreventionNeeds(context: PreventionContext): Promise<{
    shouldIntervene: boolean;
    triggeredRules: PreventionRule[];
    recommendedInterventions: PreventionIntervention[];
    confidence: number;
  }> {
    const triggeredRules: PreventionRule[] = [];
    const allInterventions: PreventionIntervention[] = [];
    let totalConfidence = 0;

    for (const rule of this.preventionRules.values()) {
      if (!rule.enabled) continue;

      const ruleScore = this.evaluateRule(rule, context);

      if (ruleScore > 0.5) {
        // Threshold for intervention
        triggeredRules.push(rule);
        allInterventions.push(...rule.interventions);
        totalConfidence += rule.confidence * ruleScore;
      }
    }

    const avgConfidence = triggeredRules.length > 0 ? totalConfidence / triggeredRules.length : 0;

    // Sort interventions by priority
    const recommendedInterventions = allInterventions.sort((a, b) => a.priority - b.priority).slice(0, 3); // Top 3 interventions

    return {
      shouldIntervene: triggeredRules.length > 0,
      triggeredRules,
      recommendedInterventions,
      confidence: avgConfidence,
    };
  }

  private evaluateRule(rule: PreventionRule, context: PreventionContext): number {
    let score = 0;
    let totalWeight = 0;

    for (const trigger of rule.triggers) {
      totalWeight += trigger.weight;

      switch (trigger.type) {
        case 'keyword':
          if (this.containsKeyword(context, trigger.condition)) {
            score += trigger.weight;
          }
          break;
        case 'pattern':
          if (this.matchesPattern(context, trigger.condition)) {
            score += trigger.weight;
          }
          break;
        case 'context':
          if (context.currentContext.includes(trigger.condition)) {
            score += trigger.weight;
          }
          break;
        case 'user-input':
          if (context.userInput.toLowerCase().includes(trigger.condition.toLowerCase())) {
            score += trigger.weight;
          }
          break;
      }
    }

    return totalWeight > 0 ? score / totalWeight : 0;
  }

  private containsKeyword(context: PreventionContext, keyword: string): boolean {
    const searchText = `${context.userInput} ${context.agentAction}`.toLowerCase();
    return searchText.includes(keyword.toLowerCase());
  }

  private matchesPattern(context: PreventionContext, pattern: string): boolean {
    // Pattern matching logic
    switch (pattern) {
      case 'file-operation-suggestion':
        return (
          context.agentAction.includes('remove') ||
          context.agentAction.includes('delete') ||
          context.riskFactors.includes('file-operation')
        );
      case 'version-change':
        return context.userInput.includes('version') || context.currentContext.includes('version');
      case 'new-framework-file':
        return context.currentContext.includes('framework') && context.agentAction.includes('create');
      default:
        return false;
    }
  }

  async generatePreventiveGuidance(context: PreventionContext): Promise<string[]> {
    const evaluation = await this.evaluatePreventionNeeds(context);
    const guidance: string[] = [];

    if (evaluation.shouldIntervene) {
      guidance.push(`🛡️ Preventive Constitutional Guidance (${(evaluation.confidence * 100).toFixed(1)}% confidence):`);
      guidance.push('');

      evaluation.recommendedInterventions.forEach((intervention, index) => {
        const icon = this.getInterventionIcon(intervention.type);
        guidance.push(`${icon} ${intervention.message}`);
        if (intervention.action) {
          guidance.push(`   Action: ${intervention.action}`);
        }
      });

      guidance.push('');
      guidance.push('📚 This guidance is based on learned patterns from previous interactions.');
    }

    return guidance;
  }

  private getInterventionIcon(type: string): string {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'suggestion':
        return '💡';
      case 'clarification':
        return '🤔';
      case 'guidance':
        return '📋';
      default:
        return '🔧';
    }
  }

  async logPreventionEvent(context: PreventionContext, evaluation: any): Promise<void> {
    const logPath = path.join(this.frameworkRoot, 'framework/learning/prevention-log.json');

    let log: { events: any[] } = { events: [] };
    if (fs.existsSync(logPath)) {
      try {
        log = JSON.parse(fs.readFileSync(logPath, 'utf8'));
      } catch (error) {
        console.warn('Could not parse existing prevention log');
      }
    }

    const event = {
      timestamp: new Date().toISOString(),
      context,
      evaluation: {
        shouldIntervene: evaluation.shouldIntervene,
        confidence: evaluation.confidence,
        triggeredRules: evaluation.triggeredRules.map((r: PreventionRule) => r.id),
      },
    };

    log.events.push(event);

    // Keep only last 100 events
    if (log.events.length > 100) {
      log.events = log.events.slice(-100);
    }

    fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
  }

  displayPreventionRules(): void {
    console.log('\n🛡️ Active Prevention Rules:');
    console.log('==========================');

    for (const rule of this.preventionRules.values()) {
      if (rule.enabled) {
        console.log(`${rule.name} (${(rule.confidence * 100).toFixed(1)}% confidence)`);
        console.log(`  ${rule.description}`);
        console.log(`  Triggers: ${rule.triggers.length}, Interventions: ${rule.interventions.length}`);
        console.log('');
      }
    }
  }
}

// CLI usage for testing
async function main() {
  const enforcement = new PredictiveEnforcement();

  enforcement.displayPreventionRules();

  // Test with the node_modules scenario
  const testContext: PreventionContext = {
    userInput: "don't we need to commit node modules? i would think this folder should be ignored",
    agentAction: 'suggested removing node_modules directory',
    currentContext: ['development-setup', 'gitignore'],
    riskFactors: ['file-operation', 'user-correction-needed'],
  };

  console.log('\n🧪 Testing Prevention System with Node.js Scenario:');
  console.log('==================================================');

  const guidance = await enforcement.generatePreventiveGuidance(testContext);
  guidance.forEach(line => console.log(line));

  console.log('\n✨ Predictive enforcement system ready!');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { PredictiveEnforcement };
