/**
 * @aegisFrameworkVersion: 2.0.1
 * @intent: Real-time Cursor integration for live workflow detection
 * @context: Connects Cursor detection to live IDE workflows with immediate feedback
 */

import { captureCursorContext, detectCursorEvolutionStories } from './cursor-integration.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { EventEmitter } from 'events';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CursorWorkflowEvent {
  type: 'file-change' | 'cursor-move' | 'user-input' | 'pattern-detected' | 'evolution-trigger';
  timestamp: string;
  data: any;
  sessionId: string;
}

interface LiveCursorContext {
  activeFile: string;
  cursorPosition: { line: number; character: number };
  userPrompt: string;
  workspaceRoot: string;
  sessionId: string;
  eventType: string;
  metadata: Record<string, any>;
}

class CursorRealtimeIntegration extends EventEmitter {
  private isActive: boolean = false;
  private sessionId: string;
  private workflowEvents: CursorWorkflowEvent[] = [];
  private patternBuffer: string[] = [];
  private lastEvolutionCheck: number = 0;
  private evolutionCheckInterval: number = 5000; // 5 seconds
  private feedbackDir: string;

  constructor() {
    super();
    this.sessionId = this.generateSessionId();
    this.feedbackDir = path.resolve(__dirname, '..', '.aegis', 'cursor-feedback');
    this.ensureFeedbackDir();
  }

  /**
   * Start real-time integration with Cursor
   */
  async start(): Promise<void> {
    console.log('🎯 Starting Cursor Real-time Integration...');
    this.isActive = true;
    
    // Initialize file watchers
    await this.initializeFileWatchers();
    
    // Start pattern monitoring
    this.startPatternMonitoring();
    
    // Start evolution story detection
    this.startEvolutionDetection();
    
    console.log('✅ Cursor Real-time Integration active');
    this.emit('started', { sessionId: this.sessionId });
  }

  /**
   * Stop real-time integration
   */
  async stop(): Promise<void> {
    console.log('🛑 Stopping Cursor Real-time Integration...');
    this.isActive = false;
    
    // Save final session data
    await this.saveSessionData();
    
    console.log('✅ Cursor Real-time Integration stopped');
    this.emit('stopped', { sessionId: this.sessionId });
  }

  /**
   * Process real-time Cursor event
   */
  async processCursorEvent(event: CursorWorkflowEvent): Promise<void> {
    if (!this.isActive) return;

    this.workflowEvents.push(event);
    
    // Create context for pattern detection
    const context: LiveCursorContext = {
      activeFile: event.data.activeFile || '',
      cursorPosition: event.data.cursorPosition || { line: 1, character: 1 },
      userPrompt: event.data.userPrompt || '',
      workspaceRoot: process.cwd(),
      sessionId: this.sessionId,
      eventType: event.type,
      metadata: event.data.metadata || {}
    };

    // Capture context for evolution detection
    await captureCursorContext(context.userPrompt);

    // Check for immediate patterns
    await this.checkImmediatePatterns(context);

    // Emit event for external listeners
    this.emit('cursor-event', { event, context });
  }

  /**
   * Handle file change events
   */
  async handleFileChange(filePath: string, changeType: 'created' | 'modified' | 'deleted'): Promise<void> {
    const event: CursorWorkflowEvent = {
      type: 'file-change',
      timestamp: new Date().toISOString(),
      data: {
        filePath,
        changeType,
        activeFile: filePath,
        cursorPosition: { line: 1, character: 1 }
      },
      sessionId: this.sessionId
    };

    await this.processCursorEvent(event);
  }

  /**
   * Handle cursor movement events
   */
  async handleCursorMove(filePath: string, position: { line: number; character: number }): Promise<void> {
    const event: CursorWorkflowEvent = {
      type: 'cursor-move',
      timestamp: new Date().toISOString(),
      data: {
        filePath,
        position,
        activeFile: filePath,
        cursorPosition: position
      },
      sessionId: this.sessionId
    };

    await this.processCursorEvent(event);
  }

  /**
   * Handle user input events
   */
  async handleUserInput(prompt: string, filePath: string, position: { line: number; character: number }): Promise<void> {
    const event: CursorWorkflowEvent = {
      type: 'user-input',
      timestamp: new Date().toISOString(),
      data: {
        prompt,
        filePath,
        position,
        activeFile: filePath,
        cursorPosition: position,
        userPrompt: prompt
      },
      sessionId: this.sessionId
    };

    await this.processCursorEvent(event);
  }

  /**
   * Initialize file watchers for real-time monitoring
   */
  private async initializeFileWatchers(): Promise<void> {
    // Watch for changes in key directories
    const watchDirs = [
      'src',
      'components',
      'utils',
      'tools',
      'cli'
    ];

    for (const dir of watchDirs) {
      const dirPath = path.resolve(process.cwd(), dir);
      if (fs.existsSync(dirPath)) {
        this.watchDirectory(dirPath);
      }
    }

    // Watch for Cursor-specific files
    const cursorFiles = [
      '.cursorrules',
      'cursor-ready.md',
      'framework/generated/instructions/current/cursor-ready.md'
    ];

    for (const file of cursorFiles) {
      const filePath = path.resolve(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        this.watchFile(filePath);
      }
    }
  }

  /**
   * Watch a directory for changes
   */
  private watchDirectory(dirPath: string): void {
    fs.watch(dirPath, { recursive: true }, async (eventType, filename) => {
      if (!filename) return;

      const filePath = path.join(dirPath, filename);
      const changeType = eventType === 'rename' ? 'deleted' : 'modified';
      
      await this.handleFileChange(filePath, changeType);
    });
  }

  /**
   * Watch a specific file for changes
   */
  private watchFile(filePath: string): void {
    fs.watch(filePath, async (eventType) => {
      const changeType = eventType === 'rename' ? 'deleted' : 'modified';
      await this.handleFileChange(filePath, changeType);
    });
  }

  /**
   * Start pattern monitoring for real-time detection
   */
  private startPatternMonitoring(): void {
    setInterval(async () => {
      if (!this.isActive) return;

      // Check for patterns in recent events
      const recentEvents = this.workflowEvents.slice(-10);
      const patterns = this.extractPatterns(recentEvents);

      if (patterns.length > 0) {
        for (const pattern of patterns) {
          const event: CursorWorkflowEvent = {
            type: 'pattern-detected',
            timestamp: new Date().toISOString(),
            data: {
              pattern,
              activeFile: pattern.filePath || '',
              cursorPosition: { line: 1, character: 1 }
            },
            sessionId: this.sessionId
          };

          await this.processCursorEvent(event);
        }
      }
    }, 1000); // Check every second
  }

  /**
   * Start evolution story detection
   */
  private startEvolutionDetection(): void {
    setInterval(async () => {
      if (!this.isActive) return;

      const now = Date.now();
      if (now - this.lastEvolutionCheck < this.evolutionCheckInterval) return;

      this.lastEvolutionCheck = now;

      // Check for evolution stories
      try {
        const stories = await detectCursorEvolutionStories();
        
        if (stories && Array.isArray(stories) && stories.length > 0) {
          for (const story of stories) {
          const event: CursorWorkflowEvent = {
            type: 'evolution-trigger',
            timestamp: new Date().toISOString(),
            data: {
              story,
              activeFile: story.context?.activeFile || '',
              cursorPosition: { line: 1, character: 1 }
            },
            sessionId: this.sessionId
          };

                      await this.processCursorEvent(event);
          }
        }
      } catch (error) {
        // Silently handle evolution story detection errors
        console.debug('Evolution story detection error:', error instanceof Error ? error.message : String(error));
      }
    }, this.evolutionCheckInterval);
  }

  /**
   * Check for immediate patterns in context
   */
  private async checkImmediatePatterns(context: LiveCursorContext): Promise<void> {
    const patterns = [
      'does this break',
      'will this cause',
      'runtime failures',
      'assess the pitfall',
      'enhance the framework',
      'guard against',
      'should we document somehow',
      'systematic way',
      'field-driven',
      'eating dog food',
      'real-world usage'
    ];

    const userPrompt = context.userPrompt.toLowerCase();
    
    for (const pattern of patterns) {
      if (userPrompt.includes(pattern)) {
        // Immediate pattern detected
        this.emit('immediate-pattern', {
          pattern,
          context,
          timestamp: new Date().toISOString()
        });

        // Provide immediate visual feedback
        await this.provideImmediateFeedback(pattern, context);
      }
    }
  }

  /**
   * Extract patterns from recent events
   */
  private extractPatterns(events: CursorWorkflowEvent[]): any[] {
    const patterns: any[] = [];
    
    // Analyze file changes
    const fileChanges = events.filter(e => e.type === 'file-change');
    if (fileChanges.length > 3) {
      patterns.push({
        type: 'rapid-file-changes',
        count: fileChanges.length,
        files: fileChanges.map(e => e.data.filePath)
      });
    }

    // Analyze user input patterns
    const userInputs = events.filter(e => e.type === 'user-input');
    const prompts = userInputs.map(e => e.data.prompt).join(' ').toLowerCase();
    
    if (prompts.includes('error') || prompts.includes('fail')) {
      patterns.push({
        type: 'error-concern',
        prompts: userInputs.map(e => e.data.prompt)
      });
    }

    if (prompts.includes('document') || prompts.includes('explain')) {
      patterns.push({
        type: 'documentation-need',
        prompts: userInputs.map(e => e.data.prompt)
      });
    }

    return patterns;
  }

  /**
   * Provide immediate visual feedback
   */
  private async provideImmediateFeedback(pattern: string, context: LiveCursorContext): Promise<void> {
    const feedback = {
      type: 'immediate-feedback',
      pattern,
      context,
      timestamp: new Date().toISOString(),
      message: this.generateFeedbackMessage(pattern),
      visual: this.generateVisualFeedback(pattern)
    };

    // Save feedback
    await this.saveFeedback(feedback);

    // Emit for external consumption
    this.emit('immediate-feedback', feedback);
  }

  /**
   * Generate feedback message based on pattern
   */
  private generateFeedbackMessage(pattern: string): string {
    const messages: Record<string, string> = {
      'does this break': '🔍 Framework protections active - checking for breaking changes',
      'will this cause': '⚠️ Risk assessment triggered - analyzing potential issues',
      'runtime failures': '🚨 Runtime failure concern detected - framework safeguards engaged',
      'assess the pitfall': '🎯 Pitfall assessment initiated - constitutional analysis running',
      'enhance the framework': '⚡ Framework enhancement request captured - evolution story generated',
      'guard against': '🛡️ Guard mechanism activated - protective measures in place',
      'should we document somehow': '📚 Documentation need identified - auto-generating evolution story',
      'systematic way': '🔧 Systematic approach requested - framework methodology applied',
      'field-driven': '🌱 Field-driven insight captured - contributing to framework learning',
      'eating dog food': '🐕 Dogfooding pattern detected - real-world validation active',
      'real-world usage': '🌍 Real-world usage pattern - framework adaptation in progress'
    };

    return messages[pattern] || '🎨 Pattern detected - framework intelligence active';
  }

  /**
   * Generate visual feedback for Cursor interface
   */
  private generateVisualFeedback(pattern: string): any {
    return {
      icon: '🎯',
      color: 'blue',
      animation: 'pulse',
      position: 'top-right',
      duration: 3000,
      message: this.generateFeedbackMessage(pattern)
    };
  }

  /**
   * Save feedback to file
   */
  private async saveFeedback(feedback: any): Promise<void> {
    const feedbackFile = path.join(this.feedbackDir, `${new Date().toISOString().split('T')[0]}.jsonl`);
    const feedbackLine = JSON.stringify(feedback) + '\n';
    
    fs.appendFileSync(feedbackFile, feedbackLine);
  }

  /**
   * Save session data
   */
  private async saveSessionData(): Promise<void> {
    const sessionFile = path.join(this.feedbackDir, `session-${this.sessionId}.json`);
    const sessionData = {
      sessionId: this.sessionId,
      startTime: this.workflowEvents[0]?.timestamp,
      endTime: new Date().toISOString(),
      totalEvents: this.workflowEvents.length,
      patterns: this.extractPatterns(this.workflowEvents),
      summary: this.generateSessionSummary()
    };

    fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2));
  }

  /**
   * Generate session summary
   */
  private generateSessionSummary(): any {
    const eventTypes = this.workflowEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      eventTypes,
      duration: this.workflowEvents.length > 0 
        ? new Date(this.workflowEvents[this.workflowEvents.length - 1].timestamp).getTime() - 
          new Date(this.workflowEvents[0].timestamp).getTime()
        : 0,
      activeFiles: [...new Set(this.workflowEvents.map(e => e.data.activeFile).filter(Boolean))]
    };
  }

  /**
   * Ensure feedback directory exists
   */
  private ensureFeedbackDir(): void {
    if (!fs.existsSync(this.feedbackDir)) {
      fs.mkdirSync(this.feedbackDir, { recursive: true });
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `cursor-realtime-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current session statistics
   */
  getSessionStats(): any {
    return {
      sessionId: this.sessionId,
      isActive: this.isActive,
      totalEvents: this.workflowEvents.length,
      patterns: this.extractPatterns(this.workflowEvents),
      lastEvent: this.workflowEvents[this.workflowEvents.length - 1]
    };
  }
}

// Export for use in other modules
export { CursorRealtimeIntegration, type CursorWorkflowEvent, type LiveCursorContext };

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const integration = new CursorRealtimeIntegration();
  
  // Set up event listeners
  integration.on('started', (data) => {
    console.log('🎯 Real-time integration started:', data.sessionId);
  });

  integration.on('cursor-event', (data) => {
    console.log('📡 Cursor event:', data.event.type);
  });

  integration.on('immediate-pattern', (data) => {
    console.log('🎯 Immediate pattern detected:', data.pattern);
  });

  integration.on('immediate-feedback', (data) => {
    console.log('🎨 Immediate feedback:', data.message);
  });

  integration.on('stopped', (data) => {
    console.log('🛑 Real-time integration stopped:', data.sessionId);
  });

  // Start integration
  integration.start().then(() => {
    console.log('✅ Cursor Real-time Integration running');
    
    // Simulate some events for testing
    setTimeout(async () => {
      await integration.handleUserInput(
        'does this break the framework?',
        'src/components/TestComponent.tsx',
        { line: 10, character: 5 }
      );
    }, 2000);

    setTimeout(async () => {
      await integration.stop();
    }, 10000);
  });
}
