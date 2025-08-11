#!/usr/bin/env node

/**
 * @aegisFrameworkVersion: 2.4.0
 * @intent: Constitutional reflex engine for real-time semantic interrupt processing
 * @context: Integrates semantic interrupt detection into constitutional enforcement framework
 * @mode: strict
 */

import { SemanticInterruptDetector } from './semantic-interrupt-detector.ts';

interface ConstitutionalReflex {
  trigger: string;
  confidence: number;
  reflexAction: 'interrupt' | 'validate' | 'realign' | 'checkpoint' | 'halt';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

interface ReflexResponse {
  triggered: boolean;
  reflexType: string;
  diagnostic?: any;
  recommendations: string[];
  nextActions: string[];
  userPrompt?: string;
}

export class ConstitutionalReflexEngine {
  private semanticDetector: SemanticInterruptDetector;
  private projectRoot: string;
  private reflexPatterns!: ConstitutionalReflex[];
  private isActive: boolean = true;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.semanticDetector = new SemanticInterruptDetector(projectRoot);
    this.initializeReflexPatterns();
  }

  private initializeReflexPatterns(): void {
    this.reflexPatterns = [
      {
        trigger: 'semantic_interrupt',
        confidence: 0.8,
        reflexAction: 'interrupt',
        priority: 'high',
        description: 'User expressed doubt about agent intent alignment',
      },
      {
        trigger: 'goal_confusion',
        confidence: 0.85,
        reflexAction: 'realign',
        priority: 'critical',
        description: 'User indicates fundamental misunderstanding of objectives',
      },
      {
        trigger: 'drift_detection',
        confidence: 0.75,
        reflexAction: 'validate',
        priority: 'medium',
        description: 'Potential drift from original blueprint detected',
      },
      {
        trigger: 'explicit_halt',
        confidence: 0.95,
        reflexAction: 'halt',
        priority: 'critical',
        description: 'User explicitly requested cessation of current activity',
      },
    ];
  }

  /**
   * Process user input through constitutional reflex system
   */
  async processInput(userInput: string, currentContext: string): Promise<ReflexResponse> {
    if (!this.isActive) {
      return {
        triggered: false,
        reflexType: 'none',
        recommendations: [],
        nextActions: ['Continue normal operation'],
      };
    }

    // Check for semantic interrupts
    const interrupt = this.semanticDetector.detectInterrupt(userInput);

    if (interrupt) {
      console.log('🚨 CONSTITUTIONAL REFLEX TRIGGERED');
      console.log('═══════════════════════════════════\n');

      // Run drift diagnostic
      const diagnostic = await this.semanticDetector.runDriftDiagnostic(userInput, currentContext);

      // Determine reflex action
      const reflexAction = this.determineReflexAction(interrupt, diagnostic);

      // Generate response
      const response = this.generateReflexResponse(interrupt, diagnostic, reflexAction);

      console.log('🔧 CONSTITUTIONAL REFLEX COMPLETE\n');

      return response;
    }

    // No reflex triggered
    return {
      triggered: false,
      reflexType: 'none',
      recommendations: [],
      nextActions: ['Continue normal operation'],
    };
  }

  /**
   * Determine appropriate reflex action based on interrupt and diagnostic
   */
  private determineReflexAction(interrupt: any, diagnostic: any): ConstitutionalReflex {
    const urgency = interrupt.urgency;
    const driftPercentage = diagnostic.driftPercentage;

    if (urgency === 'critical' || driftPercentage > 60) {
      return this.reflexPatterns.find(r => r.reflexAction === 'halt') || this.reflexPatterns[0];
    } else if (interrupt.type === 'goal-confusion' || driftPercentage > 30) {
      return this.reflexPatterns.find(r => r.reflexAction === 'realign') || this.reflexPatterns[0];
    } else if (interrupt.type === 'intent-doubt') {
      return this.reflexPatterns.find(r => r.reflexAction === 'interrupt') || this.reflexPatterns[0];
    } else {
      return this.reflexPatterns.find(r => r.reflexAction === 'validate') || this.reflexPatterns[0];
    }
  }

  /**
   * Generate comprehensive reflex response
   */
  private generateReflexResponse(interrupt: any, diagnostic: any, reflex: ConstitutionalReflex): ReflexResponse {
    const response: ReflexResponse = {
      triggered: true,
      reflexType: reflex.reflexAction,
      diagnostic,
      recommendations: [],
      nextActions: [],
      userPrompt: undefined,
    };

    // Generate specific recommendations based on reflex action
    switch (reflex.reflexAction) {
      case 'halt':
        response.recommendations = [
          '🛑 IMMEDIATE HALT: All current operations suspended',
          '🔍 CRITICAL REVIEW: Fundamental realignment required',
          '💬 USER CLARIFICATION: Explicit confirmation needed before proceeding',
        ];
        response.nextActions = [
          'Stop all current activities',
          'Request explicit user confirmation of intent',
          'Create new checkpoint with confirmed objective',
        ];
        response.userPrompt =
          "🚨 **CRITICAL ALIGNMENT CHECK**: I've detected significant confusion about my current objective. Please clarify what you want me to focus on, and I'll create a new checkpoint to ensure we're aligned.";
        break;

      case 'realign':
        response.recommendations = [
          '⚡ COURSE CORRECTION: Significant realignment needed',
          '🎯 OBJECTIVE CLARIFICATION: Verify current goals with user',
          '📍 NEW CHECKPOINT: Establish confirmed direction',
        ];
        response.nextActions = [
          'Pause current approach',
          'Clarify specific objectives causing confusion',
          'Propose alternative approaches for consideration',
        ];
        response.userPrompt =
          "🔄 **REALIGNMENT NEEDED**: I sense confusion about my current direction. Let me clarify: my understanding is that I'm working on **" +
          diagnostic.currentObjective +
          '**. Is this correct, or should I adjust my approach?';
        break;

      case 'interrupt':
        response.recommendations = [
          '🔍 INTENT CLARIFICATION: Explain current reasoning',
          '📋 TRANSPARENCY MODE: Show decision process',
          '🎯 FOCUS CHECK: Confirm current priorities',
        ];
        response.nextActions = [
          'Explain current reasoning and approach',
          'Provide transparent view of decision process',
          'Confirm understanding of priorities',
        ];
        response.userPrompt =
          "🧭 **INTENT CHECK**: I'm currently focused on **" +
          diagnostic.currentObjective +
          '**. My reasoning is to systematically address this objective, but I sense this might not align with your expectations. Would you like me to explain my approach or adjust my focus?';
        break;

      case 'validate':
        response.recommendations = [
          '✅ VALIDATION CHECK: Confirm current direction',
          '📊 PROGRESS REVIEW: Show current status',
          '🎯 ALIGNMENT VERIFICATION: Ensure objectives match',
        ];
        response.nextActions = [
          'Provide status update on current progress',
          'Confirm alignment with expected direction',
          'Offer course correction if needed',
        ];
        response.userPrompt =
          "📊 **STATUS CHECK**: I'm working on **" +
          diagnostic.currentObjective +
          '** and making progress. Does this align with your current priorities, or would you prefer I adjust my focus?';
        break;

      case 'checkpoint':
        response.recommendations = [
          '📍 CHECKPOINT CREATION: Document current state',
          '🎯 OBJECTIVE CONFIRMATION: Verify current goals',
          '📝 PROGRESS DOCUMENTATION: Record current status',
        ];
        response.nextActions = [
          'Create checkpoint with current state',
          'Document current objectives clearly',
          'Confirm direction with user',
        ];
        response.userPrompt =
          "📍 **CHECKPOINT**: Let me confirm our current direction. I understand I'm working on **" +
          diagnostic.currentObjective +
          '**. Should I continue with this approach, or would you like to establish a new direction?';
        break;
    }

    // Add diagnostic-specific recommendations
    response.recommendations.push(...diagnostic.recommendations);

    return response;
  }

  /**
   * Create intent checkpoint
   */
  createCheckpoint(objective: string, blueprint: string, context: string, userConfirmed: boolean = false): void {
    this.semanticDetector.createCheckpoint(objective, blueprint, context, userConfirmed);
    console.log('📍 Constitutional checkpoint created with reflex engine integration');
  }

  /**
   * Enable/disable reflex engine
   */
  setActive(active: boolean): void {
    this.isActive = active;
    console.log(`🔧 Constitutional reflex engine ${active ? 'activated' : 'deactivated'}`);
  }

  /**
   * Get diagnostic history
   */
  getHistory(): any {
    return {
      checkpoints: this.semanticDetector.getCheckpointHistory(),
      diagnostics: this.semanticDetector.getDiagnosticHistory(),
    };
  }
}

/**
 * CLI interface for testing reflex engine
 */
async function main() {
  const engine = new ConstitutionalReflexEngine();

  // Create initial checkpoint
  engine.createCheckpoint(
    'Implement semantic interrupt detection as constitutional safeguard',
    'Build reflex system to detect when users express doubt about agent intent',
    'Constitutional framework enhancement',
    true
  );

  if (process.argv.length < 3) {
    console.log('🧠 Constitutional Reflex Engine Test');
    console.log('Usage: node constitutional-reflex-engine.ts "<user input>"');
    console.log('\nExample inputs to try:');
    console.log('  "what are you trying to do?"');
    console.log('  "that\'s not what I asked for"');
    console.log('  "stop doing that"');
    console.log('  "I don\'t understand what you\'re doing"');
    return;
  }

  const userInput = process.argv[2];
  const currentContext = 'Testing constitutional reflex engine with semantic interrupt detection implementation';

  console.log(`🔬 Testing reflex response to: "${userInput}"\n`);

  const response = await engine.processInput(userInput, currentContext);

  if (response.triggered) {
    console.log(`🎯 REFLEX RESPONSE (${response.reflexType}):`);
    console.log('═══════════════════════════════════');

    if (response.userPrompt) {
      console.log('\n💬 **USER PROMPT**:');
      console.log(response.userPrompt);
    }

    console.log('\n📋 **RECOMMENDATIONS**:');
    response.recommendations.forEach(rec => console.log(`   • ${rec}`));

    console.log('\n🔧 **NEXT ACTIONS**:');
    response.nextActions.forEach(action => console.log(`   • ${action}`));
  } else {
    console.log('✅ No constitutional reflex triggered - normal operation continues');
  }
}

// Run if this is the main module
if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}
