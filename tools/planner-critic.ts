#!/usr/bin/env node

/**
 * @aegisBlueprint: planning-optimization
 * @version: 2.5.0
 * @mode: strict
 * @intent: Automated plan comparison and selection using constitutional rubric
 * @context: Planner Critic role that enforces lean planning practices
 * @model: claude-3-5-sonnet
 * @hash: 9f8b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a2
 */

import fs from 'node:fs';
import path from 'node:path';

interface PlanAnalysis {
  planClass: 'MVP-Fix' | 'Surgical-Refactor' | 'Systemic-Change';
  estimatedTokens: number;
  filesTouched: number;
  estimatedHours: number;
  hasBehavioralContracts: boolean;
  hasJustification: boolean;
  forbiddenAssertions: string[];
  complexityScore: number;
  recommendation: 'accept' | 'reject' | 'escalate';
  reasoning: string[];
}

interface PlanComparison {
  planA: PlanAnalysis;
  planB: PlanAnalysis;
  winner: 'A' | 'B' | 'tie';
  reasoning: string[];
}

export class PlannerCritic {
  private config: any;

  constructor() {
    const configPath = path.join(process.cwd(), '.aegis/config/planning.json');
    this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }

  /**
   * Analyze a single plan against constitutional constraints
   */
  analyzePlan(planContent: string, planClass: string, filesTouched: number): PlanAnalysis {
    const tokens = Math.ceil(planContent.length / 4);
    const planConfig = this.config.planClasses[planClass];
    
    if (!planConfig) {
      throw new Error(`Unknown plan class: ${planClass}`);
    }

    const hasBehavioralContracts = /contracts?/i.test(planContent) && 
      /observable|behavioral|user-facing/i.test(planContent);
    
    const hasJustification = /justification/i.test(planContent);
    
    const forbiddenAssertions = this.config.contractValidation.forbiddenAssertions
      .filter(pattern => planContent.toLowerCase().includes(pattern.toLowerCase()));

    // Calculate complexity score (lower is better)
    const complexityScore = this.calculateComplexityScore({
      tokens,
      filesTouched,
      planClass,
      hasBehavioralContracts,
      hasJustification,
      forbiddenAssertions: forbiddenAssertions.length
    });

    const recommendation = this.determineRecommendation({
      planClass,
      tokens,
      filesTouched,
      hasBehavioralContracts,
      hasJustification,
      forbiddenAssertions: forbiddenAssertions.length,
      complexityScore
    });

    const reasoning = this.generateReasoning({
      planClass,
      tokens,
      filesTouched,
      hasBehavioralContracts,
      hasJustification,
      forbiddenAssertions: forbiddenAssertions.length,
      complexityScore,
      recommendation
    });

    return {
      planClass: planClass as any,
      estimatedTokens: tokens,
      filesTouched,
      estimatedHours: planConfig.maxEffortHours,
      hasBehavioralContracts,
      hasJustification,
      forbiddenAssertions,
      complexityScore,
      recommendation,
      reasoning
    };
  }

  /**
   * Compare two plans and select the leaner one
   */
  comparePlans(planA: PlanAnalysis, planB: PlanAnalysis): PlanComparison {
    const reasoning: string[] = [];
    let winner: 'A' | 'B' | 'tie' = 'tie';

    // Prefer lower complexity score
    if (planA.complexityScore < planB.complexityScore) {
      winner = 'A';
      reasoning.push(`Plan A has lower complexity score (${planA.complexityScore} vs ${planB.complexityScore})`);
    } else if (planB.complexityScore < planA.complexityScore) {
      winner = 'B';
      reasoning.push(`Plan B has lower complexity score (${planB.complexityScore} vs ${planA.complexityScore})`);
    }

    // Prefer lower plan class (MVP > Surgical > Systemic)
    const classOrder = { 'MVP-Fix': 1, 'Surgical-Refactor': 2, 'Systemic-Change': 3 };
    const classA = classOrder[planA.planClass];
    const classB = classOrder[planB.planClass];

    if (classA < classB) {
      if (winner === 'B') {
        winner = 'tie';
        reasoning.push('Plan A has lower complexity but Plan B has lower plan class - tie');
      } else if (winner === 'tie') {
        winner = 'A';
        reasoning.push(`Plan A has lower plan class (${planA.planClass} vs ${planB.planClass})`);
      }
    } else if (classB < classA) {
      if (winner === 'A') {
        winner = 'tie';
        reasoning.push('Plan B has lower complexity but Plan A has lower plan class - tie');
      } else if (winner === 'tie') {
        winner = 'B';
        reasoning.push(`Plan B has lower plan class (${planB.planClass} vs ${planA.planClass})`);
      }
    }

    // Prefer plans with behavioral contracts
    if (planA.hasBehavioralContracts && !planB.hasBehavioralContracts) {
      if (winner === 'B') {
        winner = 'tie';
        reasoning.push('Plan B has lower complexity/class but Plan A has behavioral contracts - tie');
      } else if (winner === 'tie') {
        winner = 'A';
        reasoning.push('Plan A has behavioral contracts, Plan B does not');
      }
    } else if (planB.hasBehavioralContracts && !planA.hasBehavioralContracts) {
      if (winner === 'A') {
        winner = 'tie';
        reasoning.push('Plan A has lower complexity/class but Plan B has behavioral contracts - tie');
      } else if (winner === 'tie') {
        winner = 'B';
        reasoning.push('Plan B has behavioral contracts, Plan A does not');
      }
    }

    // Prefer plans without forbidden assertions
    if (planA.forbiddenAssertions.length === 0 && planB.forbiddenAssertions.length > 0) {
      if (winner === 'B') {
        winner = 'tie';
        reasoning.push('Plan B has lower complexity/class but Plan A has no forbidden assertions - tie');
      } else if (winner === 'tie') {
        winner = 'A';
        reasoning.push('Plan A has no forbidden assertions, Plan B has violations');
      }
    } else if (planB.forbiddenAssertions.length === 0 && planA.forbiddenAssertions.length > 0) {
      if (winner === 'A') {
        winner = 'tie';
        reasoning.push('Plan A has lower complexity/class but Plan B has no forbidden assertions - tie');
      } else if (winner === 'tie') {
        winner = 'B';
        reasoning.push('Plan B has no forbidden assertions, Plan A has violations');
      }
    }

    return {
      planA,
      planB,
      winner,
      reasoning
    };
  }

  private calculateComplexityScore(params: {
    tokens: number;
    filesTouched: number;
    planClass: string;
    hasBehavioralContracts: boolean;
    hasJustification: boolean;
    forbiddenAssertions: number;
  }): number {
    const { tokens, filesTouched, planClass, hasBehavioralContracts, hasJustification, forbiddenAssertions } = params;
    
    const planConfig = this.config.planClasses[planClass];
    const tokenRatio = tokens / planConfig.maxTokens;
    const fileRatio = filesTouched / planConfig.maxFiles;
    
    let score = (tokenRatio + fileRatio) / 2;
    
    // Penalties
    if (!hasBehavioralContracts) score += 0.5;
    if (planClass === 'Systemic-Change' && !hasJustification) score += 0.3;
    if (forbiddenAssertions > 0) score += 0.2 * forbiddenAssertions;
    
    return Math.round(score * 100) / 100;
  }

  private determineRecommendation(params: {
    planClass: string;
    tokens: number;
    filesTouched: number;
    hasBehavioralContracts: boolean;
    hasJustification: boolean;
    forbiddenAssertions: number;
    complexityScore: number;
  }): 'accept' | 'reject' | 'escalate' {
    const { planClass, tokens, filesTouched, hasBehavioralContracts, hasJustification, forbiddenAssertions, complexityScore } = params;
    const planConfig = this.config.planClasses[planClass];

    // Automatic rejections
    if (tokens > planConfig.maxTokens) return 'reject';
    if (filesTouched > planConfig.maxFiles) return 'reject';
    if (planClass === 'Systemic-Change' && !hasJustification) return 'reject';
    if (forbiddenAssertions > 0) return 'reject';

    // Escalation conditions
    if (planClass === 'Systemic-Change') return 'escalate';
    if (complexityScore > 0.8) return 'escalate';

    return 'accept';
  }

  private generateReasoning(params: any): string[] {
    const reasoning: string[] = [];
    const { planClass, tokens, filesTouched, hasBehavioralContracts, hasJustification, forbiddenAssertions, complexityScore, recommendation } = params;
    const planConfig = this.config.planClasses[planClass];

    reasoning.push(`Plan class: ${planClass}`);
    reasoning.push(`Estimated tokens: ${tokens}/${planConfig.maxTokens}`);
    reasoning.push(`Files touched: ${filesTouched}/${planConfig.maxFiles}`);
    reasoning.push(`Complexity score: ${complexityScore}`);
    reasoning.push(`Behavioral contracts: ${hasBehavioralContracts ? 'Yes' : 'No'}`);
    
    if (planClass === 'Systemic-Change') {
      reasoning.push(`Justification provided: ${hasJustification ? 'Yes' : 'No'}`);
    }
    
    if (forbiddenAssertions > 0) {
      reasoning.push(`Forbidden assertions: ${forbiddenAssertions} violations`);
    }

    reasoning.push(`Recommendation: ${recommendation.toUpperCase()}`);

    return reasoning;
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const critic = new PlannerCritic();
  
  if (process.argv.length < 4) {
    console.error('Usage: node tools/planner-critic.ts <plan1.md> <plan2.md> [plan1Class] [plan2Class] [files1] [files2]');
    process.exit(1);
  }

  const [,, plan1Path, plan2Path, plan1Class = 'MVP', plan2Class = 'MVP', files1 = '2', files2 = '2'] = process.argv;
  
  try {
    const plan1Content = fs.readFileSync(plan1Path, 'utf8');
    const plan2Content = fs.readFileSync(plan2Path, 'utf8');
    
    const analysis1 = critic.analyzePlan(plan1Content, plan1Class, parseInt(files1));
    const analysis2 = critic.analyzePlan(plan2Content, plan2Class, parseInt(files2));
    
    const comparison = critic.comparePlans(analysis1, analysis2);
    
    console.log('\n📊 Plan Comparison Results\n');
    console.log('Plan A Analysis:');
    analysis1.reasoning.forEach(reason => console.log(`  • ${reason}`));
    
    console.log('\nPlan B Analysis:');
    analysis2.reasoning.forEach(reason => console.log(`  • ${reason}`));
    
    console.log('\n🏆 Comparison Result:');
    if (comparison.winner === 'A') {
      console.log('✅ Plan A is leaner and recommended');
    } else if (comparison.winner === 'B') {
      console.log('✅ Plan B is leaner and recommended');
    } else {
      console.log('🤝 Plans are equivalent - manual review recommended');
    }
    
    comparison.reasoning.forEach(reason => console.log(`  • ${reason}`));
    
  } catch (error) {
    console.error('❌ Error analyzing plans:', error.message);
    process.exit(1);
  }
}
