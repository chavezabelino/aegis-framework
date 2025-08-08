#!/usr/bin/env node

/**
 * @aegisFrameworkVersion: 2.4.0
 * @intent: Semantic interrupt detection for agent drift prevention and intent realignment
 * @context: Constitutional safeguard that detects when users express doubt about agent intent alignment
 * @mode: strict
 */

import fs from 'fs';
import path from 'path';

interface SemanticInterrupt {
  pattern: string;
  confidence: number;
  type: 'intent-doubt' | 'goal-confusion' | 'drift-detection' | 'alignment-check';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

interface DriftDiagnostic {
  timestamp: Date;
  triggeredBy: string;
  currentObjective: string;
  originalBlueprint: string;
  driftPercentage: number;
  confidence: number;
  recommendations: string[];
  recoveryOptions: RecoveryOption[];
}

interface RecoveryOption {
  id: string;
  type: 'rollback' | 'realign' | 'confirm' | 'review' | 'restart';
  description: string;
  impact: 'low' | 'medium' | 'high';
  confidence: number;
}

interface IntentCheckpoint {
  timestamp: Date;
  objective: string;
  blueprint: string;
  context: string;
  confidence: number;
  userConfirmed: boolean;
}

export class SemanticInterruptDetector {
  private projectRoot: string;
  private interruptPatterns: SemanticInterrupt[];
  private checkpoints: IntentCheckpoint[] = [];
  private diagnosticHistory: DriftDiagnostic[] = [];
  private checkpointsFile: string;
  private diagnosticsFile: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.checkpointsFile = path.join(projectRoot, '.framework/intent-checkpoints.json');
    this.diagnosticsFile = path.join(projectRoot, '.framework/drift-diagnostics.json');
    this.initializeInterruptPatterns();
    this.loadPersistedData();
  }

  private initializeInterruptPatterns(): void {
    this.interruptPatterns = [
      // Direct intent questioning
      {
        pattern: "what are you trying to do",
        confidence: 0.95,
        type: 'intent-doubt',
        urgency: 'high',
        description: 'User directly questions agent intent - strong signal of perceived drift'
      },
      {
        pattern: "why are you doing that",
        confidence: 0.90,
        type: 'goal-confusion',
        urgency: 'high',
        description: 'User questions current actions - potential goal misalignment'
      },
      {
        pattern: "what's your goal here",
        confidence: 0.88,
        type: 'intent-doubt',
        urgency: 'medium',
        description: 'User seeks clarification on objectives - moderate drift signal'
      },
      
      // Confusion signals
      {
        pattern: "I don't understand what you're doing",
        confidence: 0.85,
        type: 'drift-detection',
        urgency: 'high',
        description: 'User expresses confusion about agent behavior'
      },
      {
        pattern: "this doesn't make sense",
        confidence: 0.80,
        type: 'alignment-check',
        urgency: 'medium',
        description: 'User indicates logical disconnect in agent actions'
      },
      {
        pattern: "that's not what I asked for",
        confidence: 0.92,
        type: 'goal-confusion',
        urgency: 'critical',
        description: 'Direct statement of misalignment with user request'
      },

      // Redirection signals
      {
        pattern: "stop doing that",
        confidence: 0.95,
        type: 'drift-detection',
        urgency: 'critical',
        description: 'User explicitly requests cessation - critical drift'
      },
      {
        pattern: "go back to",
        confidence: 0.75,
        type: 'alignment-check',
        urgency: 'medium',
        description: 'User requests return to previous state - possible drift'
      },
      {
        pattern: "that's not the priority",
        confidence: 0.85,
        type: 'goal-confusion',
        urgency: 'high',
        description: 'User indicates priority misalignment'
      },

      // Meta-cognitive signals
      {
        pattern: "you're overthinking this",
        confidence: 0.70,
        type: 'drift-detection',
        urgency: 'medium',
        description: 'User indicates unnecessary complexity - possible scope drift'
      },
      {
        pattern: "focus on",
        confidence: 0.65,
        type: 'alignment-check',
        urgency: 'low',
        description: 'User provides focus direction - mild realignment needed'
      },
      {
        pattern: "let's step back",
        confidence: 0.80,
        type: 'intent-doubt',
        urgency: 'medium',
        description: 'User requests perspective reset - moderate drift signal'
      }
    ];
  }

  /**
   * Detect semantic interrupts in user input
   */
  detectInterrupt(userInput: string): SemanticInterrupt | null {
    const normalizedInput = userInput.toLowerCase().trim();
    
    for (const pattern of this.interruptPatterns) {
      if (normalizedInput.includes(pattern.pattern)) {
        console.log(`🚨 Semantic interrupt detected: ${pattern.description}`);
        console.log(`📊 Pattern: "${pattern.pattern}" | Confidence: ${(pattern.confidence * 100).toFixed(1)}% | Urgency: ${pattern.urgency}`);
        return pattern;
      }
    }
    
    return null;
  }

  /**
   * Run comprehensive drift diagnostic when interrupt detected
   */
  async runDriftDiagnostic(userInput: string, currentContext: string): Promise<DriftDiagnostic> {
    const interrupt = this.detectInterrupt(userInput);
    if (!interrupt) {
      throw new Error('No semantic interrupt detected');
    }

    console.log('\n🔍 Running Drift Diagnostic Reflex...\n');
    
    // Get the most recent checkpoint
    const lastCheckpoint = this.getLastCheckpoint();
    const currentObjective = this.extractCurrentObjective(currentContext);
    const originalBlueprint = lastCheckpoint?.blueprint || 'No blueprint recorded';
    
    // Calculate drift percentage
    const driftPercentage = this.calculateDriftPercentage(currentObjective, originalBlueprint);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(interrupt, driftPercentage);
    
    // Generate recovery options
    const recoveryOptions = this.generateRecoveryOptions(interrupt, driftPercentage);
    
    const diagnostic: DriftDiagnostic = {
      timestamp: new Date(),
      triggeredBy: userInput,
      currentObjective,
      originalBlueprint,
      driftPercentage,
      confidence: interrupt.confidence,
      recommendations,
      recoveryOptions
    };
    
    this.diagnosticHistory.push(diagnostic);
    await this.persistDiagnostics();
    
    console.log('🧭 **CURRENT OBJECTIVE**:');
    console.log(`   ${currentObjective}\n`);
    
    console.log('📘 **ORIGINAL BLUEPRINT**:');
    console.log(`   ${originalBlueprint}\n`);
    
    console.log('📊 **DRIFT ANALYSIS**:');
    console.log(`   Drift Percentage: ${driftPercentage.toFixed(1)}%`);
    console.log(`   Confidence: ${(interrupt.confidence * 100).toFixed(1)}%`);
    console.log(`   Urgency: ${interrupt.urgency.toUpperCase()}\n`);
    
    if (driftPercentage > 30) {
      console.log('⚠️ **SIGNIFICANT DRIFT DETECTED** - Realignment recommended\n');
    } else if (driftPercentage > 15) {
      console.log('⚡ **MODERATE DRIFT DETECTED** - Course correction advised\n');
    } else {
      console.log('✅ **MINIMAL DRIFT** - Intent generally aligned\n');
    }
    
    console.log('💡 **RECOMMENDATIONS**:');
    recommendations.forEach(rec => console.log(`   • ${rec}`));
    console.log('');
    
    console.log('🔧 **RECOVERY OPTIONS**:');
    recoveryOptions.forEach((option, index) => {
      console.log(`   ${index + 1}. ${option.description} (${option.type}, ${option.impact} impact)`);
    });
    console.log('');
    
    return diagnostic;
  }

  /**
   * Create intent checkpoint for future drift detection
   */
  createCheckpoint(objective: string, blueprint: string, context: string, userConfirmed: boolean = false): IntentCheckpoint {
    const checkpoint: IntentCheckpoint = {
      timestamp: new Date(),
      objective,
      blueprint,
      context,
      confidence: userConfirmed ? 1.0 : 0.8,
      userConfirmed
    };
    
    this.checkpoints.push(checkpoint);
    this.persistCheckpoints();
    
    console.log(`📍 Intent checkpoint created: ${objective.substring(0, 60)}...`);
    
    return checkpoint;
  }

  /**
   * Get the most recent intent checkpoint
   */
  private getLastCheckpoint(): IntentCheckpoint | null {
    return this.checkpoints.length > 0 ? this.checkpoints[this.checkpoints.length - 1] : null;
  }

  /**
   * Extract current objective from context
   */
  private extractCurrentObjective(context: string): string {
    // Simple extraction - could be enhanced with NLP
    const lines = context.split('\n');
    const objectiveLine = lines.find(line => 
      line.toLowerCase().includes('objective') || 
      line.toLowerCase().includes('goal') || 
      line.toLowerCase().includes('intent')
    );
    
    return objectiveLine || 'Current objective unclear from context';
  }

  /**
   * Calculate drift percentage between current and original objectives
   */
  private calculateDriftPercentage(current: string, original: string): number {
    if (!current || !original) return 100;
    
    // Simple word overlap calculation - could be enhanced with semantic similarity
    const currentWords = new Set(current.toLowerCase().split(/\s+/));
    const originalWords = new Set(original.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...currentWords].filter(word => originalWords.has(word)));
    const union = new Set([...currentWords, ...originalWords]);
    
    const similarity = intersection.size / union.size;
    return (1 - similarity) * 100;
  }

  /**
   * Generate context-specific recommendations
   */
  private generateRecommendations(interrupt: SemanticInterrupt, driftPercentage: number): string[] {
    const recommendations: string[] = [];
    
    if (interrupt.urgency === 'critical') {
      recommendations.push('IMMEDIATE HALT: Stop current action and await user clarification');
      recommendations.push('Request explicit confirmation of intended objective');
    }
    
    if (driftPercentage > 50) {
      recommendations.push('Complete intent realignment required');
      recommendations.push('Return to last confirmed checkpoint');
    } else if (driftPercentage > 30) {
      recommendations.push('Significant course correction needed');
      recommendations.push('Clarify specific aspects causing confusion');
    } else if (driftPercentage > 15) {
      recommendations.push('Minor adjustment to current approach');
      recommendations.push('Confirm understanding of current priorities');
    }
    
    if (interrupt.type === 'intent-doubt') {
      recommendations.push('Provide clear explanation of current reasoning');
      recommendations.push('Offer alternative approaches for consideration');
    }
    
    recommendations.push('Create new checkpoint with clarified intent');
    
    return recommendations;
  }

  /**
   * Generate recovery options based on context
   */
  private generateRecoveryOptions(interrupt: SemanticInterrupt, driftPercentage: number): RecoveryOption[] {
    const options: RecoveryOption[] = [];
    
    // Always offer explanation
    options.push({
      id: 'explain-current',
      type: 'review',
      description: 'Explain current reasoning and approach',
      impact: 'low',
      confidence: 0.9
    });
    
    // Rollback options based on drift severity
    if (driftPercentage > 30) {
      options.push({
        id: 'rollback-checkpoint',
        type: 'rollback',
        description: 'Return to last confirmed checkpoint',
        impact: 'medium',
        confidence: 0.8
      });
    }
    
    // Realignment options
    options.push({
      id: 'confirm-intent',
      type: 'confirm',
      description: 'Request user to confirm or update intended objective',
      impact: 'low',
      confidence: 0.95
    });
    
    if (interrupt.urgency === 'critical') {
      options.push({
        id: 'full-restart',
        type: 'restart',
        description: 'Restart from beginning with clear objective definition',
        impact: 'high',
        confidence: 0.7
      });
    }
    
    options.push({
      id: 'gradual-realign',
      type: 'realign',
      description: 'Gradually adjust approach based on user feedback',
      impact: 'medium',
      confidence: 0.85
    });
    
    return options;
  }

  /**
   * Load persisted checkpoints and diagnostics
   */
  private loadPersistedData(): void {
    try {
      if (fs.existsSync(this.checkpointsFile)) {
        const data = fs.readFileSync(this.checkpointsFile, 'utf8');
        this.checkpoints = JSON.parse(data);
      }
      
      if (fs.existsSync(this.diagnosticsFile)) {
        const data = fs.readFileSync(this.diagnosticsFile, 'utf8');
        this.diagnosticHistory = JSON.parse(data);
      }
    } catch (error) {
      console.warn('Warning: Could not load persisted semantic interrupt data');
    }
  }

  /**
   * Persist checkpoints to disk
   */
  private async persistCheckpoints(): Promise<void> {
    try {
      const dir = path.dirname(this.checkpointsFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.checkpointsFile, JSON.stringify(this.checkpoints, null, 2));
    } catch (error) {
      console.warn('Warning: Could not persist intent checkpoints');
    }
  }

  /**
   * Persist diagnostics to disk
   */
  private async persistDiagnostics(): Promise<void> {
    try {
      const dir = path.dirname(this.diagnosticsFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.diagnosticsFile, JSON.stringify(this.diagnosticHistory, null, 2));
    } catch (error) {
      console.warn('Warning: Could not persist drift diagnostics');
    }
  }

  /**
   * Get diagnostic history for analysis
   */
  getDiagnosticHistory(): DriftDiagnostic[] {
    return this.diagnosticHistory;
  }

  /**
   * Get checkpoint history
   */
  getCheckpointHistory(): IntentCheckpoint[] {
    return this.checkpoints;
  }
}

/**
 * CLI interface for testing
 */
async function main() {
  if (process.argv.length < 3) {
    console.log('Usage: node semantic-interrupt-detector.ts "<user input>"');
    console.log('Example: node semantic-interrupt-detector.ts "what are you trying to do?"');
    return;
  }
  
  const userInput = process.argv[2];
  const detector = new SemanticInterruptDetector();
  
  // Create a test checkpoint
  detector.createCheckpoint(
    'Test implementation of semantic interrupt detection system',
    'Implement semantic interrupt detection as a constitutional safeguard',
    'Framework development context',
    true
  );
  
  const interrupt = detector.detectInterrupt(userInput);
  if (interrupt) {
    await detector.runDriftDiagnostic(userInput, 'Test context: implementing semantic interrupt detection');
  } else {
    console.log('No semantic interrupt detected in input.');
  }
}

// Run if this is the main module
if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}
