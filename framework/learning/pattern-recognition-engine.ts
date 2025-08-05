#!/usr/bin/env node

/**
 * Enhanced Pattern Recognition Engine
 * 
 * Analyzes drift logs and learns from violations to predict and prevent future issues
 * Part of Phase 2: Intelligent Governance
 * 
 * @aegisFrameworkVersion: 1.1.0-beta
 * @intent: Implement intelligent pattern recognition for constitutional drift prevention
 */

import fs from "fs";
import path from "path";

interface DriftPattern {
  id: string;
  type: string;
  frequency: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  firstOccurrence: string;
  lastOccurrence: string;
  contexts: PatternContext[];
  prediction: PatternPrediction;
  preventionStrategy: PreventionStrategy;
}

interface PatternContext {
  sessionId: string;
  agent: string;
  userInteraction: string;
  triggerConditions: string[];
  resolution: string;
}

interface PatternPrediction {
  likelihood: number; // 0-1
  conditions: string[];
  riskFactors: string[];
  confidence: number; // 0-1
}

interface PreventionStrategy {
  triggers: string[];
  interventions: Intervention[];
  autoCorrectible: boolean;
  userGuidance: string;
}

interface Intervention {
  type: 'warning' | 'suggestion' | 'auto-correction' | 'user-prompt';
  message: string;
  action?: string;
  priority: number;
}

interface LearningInsight {
  pattern: string;
  insight: string;
  confidence: number;
  applicability: string[];
  recommendation: string;
}

class PatternRecognitionEngine {
  private frameworkRoot: string;
  private patterns: Map<string, DriftPattern> = new Map();
  private insights: LearningInsight[] = [];

  constructor(frameworkRoot: string = process.cwd()) {
    this.frameworkRoot = frameworkRoot;
  }

  async analyzeAllDriftLogs(): Promise<{
    patterns: DriftPattern[];
    insights: LearningInsight[];
    predictions: PatternPrediction[];
    recommendations: string[];
  }> {
    console.log("🧠 Analyzing drift patterns for intelligent predictions...");

    // Load all drift logs
    const agentDrift = await this.loadAgentDriftLog();
    const systemDrift = await this.loadSystemDriftLog();
    const userDrift = await this.loadUserDriftLog();

    // Analyze patterns
    await this.extractPatternsFromAgentDrift(agentDrift);
    await this.extractPatternsFromSystemDrift(systemDrift);
    await this.extractPatternsFromUserDrift(userDrift);

    // Generate insights
    await this.generateLearningInsights();

    // Create predictions
    const predictions = await this.generatePredictions();

    // Generate recommendations
    const recommendations = await this.generateRecommendations();

    const patterns = Array.from(this.patterns.values());

    console.log(`📊 Pattern Analysis Complete:`);
    console.log(`  🔍 Patterns identified: ${patterns.length}`);
    console.log(`  💡 Learning insights: ${this.insights.length}`);
    console.log(`  🔮 Predictions generated: ${predictions.length}`);

    return {
      patterns,
      insights: this.insights,
      predictions,
      recommendations
    };
  }

  private async loadAgentDriftLog(): Promise<any> {
    try {
      const logPath = path.join(this.frameworkRoot, 'framework/drift-log/agent-behavior-drift.json');
      if (fs.existsSync(logPath)) {
        return JSON.parse(fs.readFileSync(logPath, 'utf8'));
      }
    } catch (error) {
      console.warn("⚠️ Could not load agent drift log");
    }
    return { agentSessions: [], patterns: {} };
  }

  private async loadSystemDriftLog(): Promise<any> {
    try {
      const logPath = path.join(this.frameworkRoot, 'framework/drift-log/framework-system-drift.json');
      if (fs.existsSync(logPath)) {
        return JSON.parse(fs.readFileSync(logPath, 'utf8'));
      }
    } catch (error) {
      console.warn("⚠️ Could not load system drift log");
    }
    return { driftEvents: [], patterns: {} };
  }

  private async loadUserDriftLog(): Promise<any> {
    try {
      const logPath = path.join(this.frameworkRoot, 'framework/drift-log/user-workflow-drift.json');
      if (fs.existsSync(logPath)) {
        return JSON.parse(fs.readFileSync(logPath, 'utf8'));
      }
    } catch (error) {
      console.warn("⚠️ Could not load user drift log");
    }
    return { userInteractions: [], workflows: {} };
  }

  private async extractPatternsFromAgentDrift(agentDrift: any): Promise<void> {
    console.log("  🤖 Analyzing agent behavior patterns...");

    if (!agentDrift.agentSessions) return;

    for (const session of agentDrift.agentSessions) {
      for (const behavior of session.behaviors || []) {
        if (behavior.driftType || behavior.complianceScore < 0.8) {
          await this.recordPattern({
            id: `agent-${behavior.action}`,
            type: behavior.driftType || 'compliance-deviation',
            frequency: 1,
            severity: this.mapSeverity(behavior.severity || 'medium'),
            firstOccurrence: session.timestamp,
            lastOccurrence: session.timestamp,
            contexts: [{
              sessionId: session.sessionId,
              agent: session.agent,
              userInteraction: behavior.userCorrection || 'none',
              triggerConditions: this.extractTriggerConditions(behavior),
              resolution: behavior.notes
            }],
            prediction: {
              likelihood: this.calculateLikelihood(behavior),
              conditions: this.extractConditions(behavior),
              riskFactors: this.extractRiskFactors(behavior),
              confidence: behavior.complianceScore
            },
            preventionStrategy: {
              triggers: this.generateTriggers(behavior),
              interventions: this.generateInterventions(behavior),
              autoCorrectible: this.isAutoCorrectible(behavior),
              userGuidance: this.generateUserGuidance(behavior)
            }
          });
        }
      }
    }
  }

  private async extractPatternsFromSystemDrift(systemDrift: any): Promise<void> {
    console.log("  🏗️ Analyzing system drift patterns...");

    if (!systemDrift.driftEvents) return;

    for (const event of systemDrift.driftEvents) {
      await this.recordPattern({
        id: `system-${event.type}`,
        type: event.type,
        frequency: 1,
        severity: this.mapSeverity(event.severity),
        firstOccurrence: event.timestamp,
        lastOccurrence: event.timestamp,
        contexts: [{
          sessionId: event.id,
          agent: 'system',
          userInteraction: 'none',
          triggerConditions: [event.detected.component],
          resolution: event.resolution?.action || 'pending'
        }],
        prediction: {
          likelihood: 0.3,
          conditions: [event.detected.rule],
          riskFactors: [event.detected.component],
          confidence: 0.8
        },
        preventionStrategy: {
          triggers: [event.detected.expected],
          interventions: [{
            type: 'auto-correction',
            message: `Ensure ${event.detected.expected} exists`,
            priority: 1
          }],
          autoCorrectible: true,
          userGuidance: `Monitor ${event.detected.component} for compliance`
        }
      });
    }
  }

  private async extractPatternsFromUserDrift(userDrift: any): Promise<void> {
    console.log("  👤 Analyzing user workflow patterns...");
    // Simplified implementation for user patterns
    // Would analyze user interaction patterns in full implementation
  }

  private async recordPattern(pattern: DriftPattern): Promise<void> {
    const existingPattern = this.patterns.get(pattern.id);
    
    if (existingPattern) {
      // Update existing pattern
      existingPattern.frequency += 1;
      existingPattern.lastOccurrence = pattern.lastOccurrence;
      existingPattern.contexts.push(...pattern.contexts);
      
      // Update prediction confidence based on frequency
      existingPattern.prediction.confidence = Math.min(1, existingPattern.prediction.confidence + 0.1);
      existingPattern.prediction.likelihood = Math.min(1, existingPattern.frequency * 0.2);
    } else {
      this.patterns.set(pattern.id, pattern);
    }
  }

  private async generateLearningInsights(): Promise<void> {
    console.log("  💡 Generating learning insights...");

    // Analyze pattern relationships
    const patterns = Array.from(this.patterns.values());
    
    // High-frequency patterns insight
    const highFrequencyPatterns = patterns.filter(p => p.frequency > 1);
    if (highFrequencyPatterns.length > 0) {
      this.insights.push({
        pattern: 'recurring-violations',
        insight: `${highFrequencyPatterns.length} patterns show recurring behavior, indicating systematic issues`,
        confidence: 0.9,
        applicability: ['enforcement', 'training', 'documentation'],
        recommendation: 'Implement proactive checks for recurring patterns'
      });
    }

    // Agent-specific insight from our logged node_modules issue
    const requirementMisinterpretations = patterns.filter(p => p.type === 'requirement-misinterpretation');
    if (requirementMisinterpretations.length > 0) {
      this.insights.push({
        pattern: 'requirement-interpretation',
        insight: 'Agents need clearer guidance on distinguishing between git exclusion and file operations',
        confidence: 0.8,
        applicability: ['agent-training', 'requirement-clarification'],
        recommendation: 'Add context validation step before suggesting file operations'
      });
    }

    // Compliance score insight
    const lowCompliancePatterns = patterns.filter(p => p.prediction.confidence < 0.7);
    if (lowCompliancePatterns.length > 0) {
      this.insights.push({
        pattern: 'compliance-challenges',
        insight: `${lowCompliancePatterns.length} patterns show low compliance confidence`,
        confidence: 0.7,
        applicability: ['validation', 'training'],
        recommendation: 'Enhance validation checks for low-confidence scenarios'
      });
    }
  }

  private async generatePredictions(): Promise<PatternPrediction[]> {
    console.log("  🔮 Generating predictive insights...");

    const predictions: PatternPrediction[] = [];
    const patterns = Array.from(this.patterns.values());

    // Predict high-risk scenarios
    for (const pattern of patterns) {
      if (pattern.frequency > 1 || pattern.severity === 'high') {
        predictions.push({
          likelihood: pattern.prediction.likelihood,
          conditions: [
            ...pattern.prediction.conditions,
            `Pattern frequency: ${pattern.frequency}`,
            `Last seen: ${pattern.lastOccurrence}`
          ],
          riskFactors: [
            ...pattern.prediction.riskFactors,
            pattern.frequency > 1 ? 'recurring-pattern' : 'isolated-incident'
          ],
          confidence: pattern.prediction.confidence
        });
      }
    }

    return predictions;
  }

  private async generateRecommendations(): Promise<string[]> {
    const recommendations: string[] = [];
    const patterns = Array.from(this.patterns.values());

    // General recommendations
    recommendations.push('🔍 Monitor agent behavior for requirement interpretation accuracy');
    recommendations.push('📚 Enhance documentation for common developer workflow scenarios');
    
    // Pattern-specific recommendations
    const autoCorrectibleCount = patterns.filter(p => p.preventionStrategy.autoCorrectible).length;
    if (autoCorrectibleCount > 0) {
      recommendations.push(`✅ ${autoCorrectibleCount} patterns can be auto-corrected proactively`);
    }

    const highRiskCount = patterns.filter(p => p.severity === 'high').length;
    if (highRiskCount > 0) {
      recommendations.push(`⚠️ ${highRiskCount} high-risk patterns require immediate attention`);
    }

    // Specific recommendation from our node_modules learning
    const reqMisinterpretations = patterns.filter(p => p.type === 'requirement-misinterpretation');
    if (reqMisinterpretations.length > 0) {
      recommendations.push('🎯 Implement requirement clarification step before file operation suggestions');
    }

    return recommendations;
  }

  // Helper methods
  private mapSeverity(severity: string): 'low' | 'medium' | 'high' | 'critical' {
    switch (severity.toLowerCase()) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'low': return 'low';
      default: return 'medium';
    }
  }

  private calculateLikelihood(behavior: any): number {
    // Base likelihood calculation
    let likelihood = 0.3;
    
    if (behavior.driftType === 'requirement-misinterpretation') likelihood += 0.4;
    if (behavior.complianceScore < 0.7) likelihood += 0.2;
    if (behavior.userCorrection) likelihood += 0.1;
    
    return Math.min(1, likelihood);
  }

  private extractTriggerConditions(behavior: any): string[] {
    const conditions = [];
    
    if (behavior.action) conditions.push(`action-type:${behavior.action}`);
    if (behavior.driftType) conditions.push(`drift-type:${behavior.driftType}`);
    if (behavior.complianceScore < 0.8) conditions.push('low-compliance');
    
    return conditions;
  }

  private extractConditions(behavior: any): string[] {
    return this.extractTriggerConditions(behavior);
  }

  private extractRiskFactors(behavior: any): string[] {
    const factors = [];
    
    if (behavior.userCorrection) factors.push('user-correction-required');
    if (behavior.complianceScore < 0.7) factors.push('low-confidence');
    if (behavior.driftType) factors.push('behavioral-drift');
    
    return factors;
  }

  private generateTriggers(behavior: any): string[] {
    const triggers = [];
    
    if (behavior.action === 'node-modules-misconception') {
      triggers.push('file-operation-suggestion');
      triggers.push('gitignore-setup-request');
    }
    
    return triggers;
  }

  private generateInterventions(behavior: any): Intervention[] {
    const interventions: Intervention[] = [];
    
    if (behavior.driftType === 'requirement-misinterpretation') {
      interventions.push({
        type: 'user-prompt',
        message: 'Clarify: Do you want to exclude files from git or remove them from filesystem?',
        priority: 1
      });
      
      interventions.push({
        type: 'suggestion',
        message: 'Consider creating .gitignore entry instead of file deletion',
        priority: 2
      });
    }
    
    return interventions;
  }

  private isAutoCorrectible(behavior: any): boolean {
    // Most behavioral patterns require human judgment
    return behavior.driftType !== 'requirement-misinterpretation';
  }

  private generateUserGuidance(behavior: any): string {
    if (behavior.driftType === 'requirement-misinterpretation') {
      return 'Always clarify user intent before suggesting file operations. Distinguish between git exclusion and file deletion.';
    }
    
    return 'Monitor for recurring patterns and apply learned interventions.';
  }

  async savePatternAnalysis(results: any): Promise<void> {
    const analysisPath = path.join(this.frameworkRoot, 'framework/learning/pattern-analysis.json');
    
    const analysis = {
      metadata: {
        generated: new Date().toISOString(),
        version: "1.1.0-beta",
        engine: "enhanced-pattern-recognition"
      },
      summary: {
        totalPatterns: results.patterns.length,
        insights: results.insights.length,
        predictions: results.predictions.length,
        recommendations: results.recommendations.length
      },
      patterns: results.patterns,
      insights: results.insights,
      predictions: results.predictions,
      recommendations: results.recommendations
    };

    fs.writeFileSync(analysisPath, JSON.stringify(analysis, null, 2));
    console.log(`📊 Pattern analysis saved to ${analysisPath}`);
  }

  displayResults(results: any): void {
    console.log("\n🧠 Enhanced Pattern Recognition Report");
    console.log("=====================================");
    console.log(`Patterns Identified: ${results.patterns.length}`);
    console.log(`Learning Insights: ${results.insights.length}`);
    console.log(`Predictions: ${results.predictions.length}`);
    console.log("");

    console.log("🔍 Key Patterns:");
    results.patterns.forEach((pattern: DriftPattern) => {
      console.log(`  ${pattern.id}: ${pattern.type} (frequency: ${pattern.frequency}, severity: ${pattern.severity})`);
    });

    console.log("\n💡 Learning Insights:");
    results.insights.forEach((insight: LearningInsight) => {
      console.log(`  ${insight.pattern}: ${insight.insight}`);
      console.log(`    Confidence: ${(insight.confidence * 100).toFixed(1)}%`);
      console.log(`    Recommendation: ${insight.recommendation}`);
    });

    console.log("\n🎯 Recommendations:");
    results.recommendations.forEach((rec: string) => {
      console.log(`  ${rec}`);
    });
  }
}

// CLI usage
async function main() {
  const engine = new PatternRecognitionEngine();
  const results = await engine.analyzeAllDriftLogs();
  
  engine.displayResults(results);
  await engine.savePatternAnalysis(results);
  
  console.log("\n✨ Pattern recognition analysis complete!");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { PatternRecognitionEngine };
