/**
 * @aegisFrameworkVersion: 2.4.0-alpha-dev
 * @intent: Cursor-specific real-time evolution detection and conversation capture
 * @context: Optimized for Cursor's interface patterns, real-time editing, and visual feedback
 */

import { RealTimeEvolutionDetector, createConversationContext } from './realtime-evolution-detection';
import * as fs from 'fs';
import * as path from 'path';

interface CursorContext {
  userPrompt: string;
  aiResponse?: string;
  timestamp: Date;
  sessionId?: string;
  workspaceContext?: string[];
  cursorRules?: string;
  activeFile?: string;
  cursorPosition?: { line: number; character: number };
  visualFeedback?: boolean;
}

class CursorEvolutionDetector extends RealTimeEvolutionDetector {
  private cursorSessionLog: CursorContext[] = [];
  
  /**
   * Cursor-specific patterns optimized for real-time interface
   */
  private cursorPatterns = [
    // Real-time editing concerns
    {
      pattern: /does this break|will this cause|runtime failures|build error|compilation error/i,
      triggerType: 'cursor-realtime-error',
      severity: 'high',
      autoGenerate: false,
      description: 'Cursor user expressing real-time editing concerns',
      visualFeedback: true
    },
    // Framework enhancement during development
    {
      pattern: /assess.*pitfall|enhance.*framework.*guard|gaps in|constitutional.*safeguards/i,
      triggerType: 'cursor-constitutional-insight',
      severity: 'critical',
      autoGenerate: true,
      description: 'Cursor user identifying framework gaps during development',
      visualFeedback: true
    },
    // Documentation needs during coding
    {
      pattern: /should.*document.*somehow|systematic.*way|evolution.*stor(y|ies)|meta.*learning/i,
      triggerType: 'cursor-documentation-gap',
      severity: 'medium',
      autoGenerate: false,
      description: 'Cursor user requesting documentation during development',
      visualFeedback: false
    },
    // Field experience during real-time development
    {
      pattern: /field-driven|eating.*dog food|real.*world.*usage|migration.*pitfall/i,
      triggerType: 'cursor-field-experience',
      severity: 'high',
      autoGenerate: false,
      description: 'Cursor user reporting field experience during development',
      visualFeedback: true
    },
    // Cursor-specific interface patterns
    {
      pattern: /cursor.*interface|real.*time.*feedback|visual.*pattern/i,
      triggerType: 'cursor-interface-improvement',
      severity: 'medium',
      autoGenerate: false,
      description: 'Cursor user requesting interface improvements',
      visualFeedback: true
    }
  ];

  /**
   * Analyze Cursor-specific conversation context
   */
  async analyzeCursorContext(context: CursorContext): Promise<any[]> {
    this.cursorSessionLog.push(context);
    const triggers: any[] = [];
    
    // Analyze user prompt with Cursor-specific patterns
    for (const pattern of this.cursorPatterns) {
      if (pattern.pattern.test(context.userPrompt)) {
        const trigger = {
          type: pattern.triggerType,
          severity: pattern.severity,
          evidence: [
            `Cursor real-time prompt: "${context.userPrompt.length > 100 ? context.userPrompt.substring(0, 100) + '...' : context.userPrompt}"`,
            `Pattern matched: ${pattern.description}`,
            `Timestamp: ${context.timestamp.toISOString()}`,
            `Session: ${context.sessionId || 'unknown'}`,
            `Active file: ${context.activeFile || 'unknown'}`,
            `Visual feedback: ${pattern.visualFeedback ? 'enabled' : 'disabled'}`
          ],
          suggestedStoryTitle: this.generateCursorStoryTitle(pattern, context),
          autoGenerate: pattern.autoGenerate,
          visualFeedback: pattern.visualFeedback
        };
        
        triggers.push(trigger);
        
        // Provide immediate visual feedback if enabled
        if (pattern.visualFeedback) {
          await this.provideCursorVisualFeedback(trigger, context);
        }
      }
    }
    
    return triggers;
  }

  /**
   * Generate Cursor-specific evolution story titles
   */
  private generateCursorStoryTitle(pattern: any, context: CursorContext): string {
    const baseTitle = pattern.description.replace('Cursor user ', '').replace(' during development', '');
    const timestamp = context.timestamp.toISOString().split('T')[0];
    const sessionId = context.sessionId?.split('-')[2] || 'unknown';
    
    return `Cursor ${baseTitle} - ${timestamp}-${sessionId}`;
  }

  /**
   * Provide visual feedback for Cursor interface
   */
  private async provideCursorVisualFeedback(trigger: any, context: CursorContext): Promise<void> {
    const feedbackMessage = this.generateCursorFeedbackMessage(trigger);
    
    // Log visual feedback for Cursor interface
    const feedbackLog = {
      timestamp: new Date().toISOString(),
      sessionId: context.sessionId,
      triggerType: trigger.type,
      severity: trigger.severity,
      message: feedbackMessage,
      activeFile: context.activeFile,
      cursorPosition: context.cursorPosition
    };
    
    await this.saveCursorFeedback(feedbackLog);
  }

  /**
   * Generate Cursor-specific feedback messages
   */
  private generateCursorFeedbackMessage(trigger: any): string {
    const messages: Record<string, string> = {
      'cursor-realtime-error': '🔍 Real-time error concern detected - framework protections active',
      'cursor-constitutional-insight': '🚨 Constitutional insight captured - evolution story auto-generated',
      'cursor-documentation-gap': '📝 Documentation gap identified - will be captured for framework evolution',
      'cursor-field-experience': '💡 Field experience insight captured - contributing to framework learning',
      'cursor-interface-improvement': '🎨 Interface improvement request noted - will be considered for Cursor integration'
    };
    
    return messages[trigger.type] || '🔍 Evolution trigger detected - framework learning in progress';
  }

  /**
   * Save Cursor-specific feedback logs
   */
  private async saveCursorFeedback(feedback: any): Promise<void> {
    const logDir = path.join(this.projectRoot, '.aegis', 'cursor-feedback');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    const logFile = path.join(logDir, `${feedback.timestamp.split('T')[0]}.jsonl`);
    const logEntry = JSON.stringify(feedback);
    
    fs.appendFileSync(logFile, logEntry + '\n');
  }

  /**
   * Calculate session duration for Cursor sessions
   */
  private calculateCursorSessionDuration(conversations: CursorContext[]): string {
    if (conversations.length < 2) return 'N/A';
    
    const start = conversations[0].timestamp;
    const end = conversations[conversations.length - 1].timestamp;
    const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    
    return `${durationMinutes} minutes`;
  }

  /**
   * Analyze Cursor session patterns
   */
  async analyzeCursorSession(sessionId: string): Promise<any[]> {
    const sessionConversations = this.cursorSessionLog.filter(c => c.sessionId === sessionId);
    const triggers: any[] = [];
    
    if (sessionConversations.length < 2) return triggers;
    
    // Analyze Cursor-specific session patterns
    const allPrompts = sessionConversations.map(c => c.userPrompt).join(' ');
    const activeFiles = sessionConversations.map(c => c.activeFile).filter(Boolean);
    
    // Check for Cursor-specific patterns
    const cursorKeywords = ['cursor', 'interface', 'real-time', 'visual', 'feedback', 'break', 'error'];
    const cursorCount = cursorKeywords.reduce((count, keyword) => {
      return count + (allPrompts.toLowerCase().match(new RegExp(keyword, 'g')) || []).length;
    }, 0);
    
    if (cursorCount > 3) {
      triggers.push({
        type: 'cursor-session-pattern',
        severity: 'medium',
        evidence: [
          `High Cursor-specific indicators: ${cursorCount} instances`,
          `Session length: ${sessionConversations.length} exchanges`,
          `Active files: ${Array.from(new Set(activeFiles)).join(', ')}`,
          `Session duration: ${this.calculateCursorSessionDuration(sessionConversations)}`
        ],
        suggestedStoryTitle: `Cursor Session Analysis - Interface Patterns`,
        autoGenerate: false,
        visualFeedback: true
      });
    }
    
    return triggers;
  }
}

/**
 * Create Cursor-specific conversation context
 */
export function createCursorContext(
  userPrompt: string,
  aiResponse?: string,
  sessionId?: string,
  workspaceFiles?: string[],
  cursorRules?: string,
  activeFile?: string,
  cursorPosition?: { line: number; character: number }
): CursorContext {
  return {
    userPrompt,
    aiResponse,
    timestamp: new Date(),
    sessionId: sessionId || generateCursorSessionId(),
    workspaceContext: workspaceFiles,
    cursorRules,
    activeFile,
    cursorPosition,
    visualFeedback: true
  };
}

/**
 * Generate Cursor-specific session ID
 */
function generateCursorSessionId(): string {
  return `cursor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Cursor-specific conversation capture hook
 */
export async function captureCursorContext(
  userPrompt: string,
  cursorRules?: string,
  workspaceRoot?: string,
  activeFile?: string,
  cursorPosition?: { line: number; character: number }
): Promise<void> {
  try {
    const detector = new CursorEvolutionDetector(workspaceRoot);
    
    // Get Cursor rules from environment or parameters
    const rules = cursorRules || getCursorRules(workspaceRoot);
    
    // Create Cursor-specific context
    const context = createCursorContext(
      userPrompt,
      undefined, // AI response not available yet
      generateCursorSessionId(),
      getWorkspaceFiles(workspaceRoot),
      rules,
      activeFile,
      cursorPosition
    );
    
    // Analyze for Cursor-specific triggers
    const triggers = await detector.analyzeCursorContext(context);
    
    // Save Cursor conversation context
    await detector.saveConversationContext(context);
    
    // If triggers found, provide Cursor-specific feedback
    if (triggers.length > 0) {
      console.log('🔍 Cursor real-time evolution triggers detected:');
      triggers.forEach(trigger => {
        const icon = trigger.severity === 'critical' ? '🚨' : 
                    trigger.severity === 'high' ? '⚠️' : 
                    trigger.severity === 'medium' ? '💡' : '📝';
        console.log(`   ${icon} ${trigger.suggestedStoryTitle}`);
        if (trigger.visualFeedback) {
          console.log(`   🎨 Visual feedback: ${trigger.evidence.find((e: string) => e.includes('Visual feedback'))}`);
        }
      });
      
      // Auto-generate critical stories
      const criticalTriggers = triggers.filter(t => t.autoGenerate);
      if (criticalTriggers.length > 0) {
        const generated = await detector.autoGenerateStories();
        if (generated.length > 0) {
          console.log('🤖 Auto-generated Cursor evolution stories:');
          generated.forEach(file => console.log(`   📄 ${path.basename(file)}`));
        }
      }
    }
  } catch (error) {
    // Silently fail to avoid disrupting Cursor workflow
    console.debug('Cursor evolution detection error:', error);
  }
}

/**
 * Get Cursor rules from workspace
 */
function getCursorRules(workspaceRoot?: string): string | undefined {
  const root = workspaceRoot || process.cwd();
  
  // Try Cursor-specific rule locations
  const rulePaths = [
    '.cursorrules',
    'cursor-rules.md',
    '.cursor/rules.md'
  ];
  
  for (const rulePath of rulePaths) {
    const fullPath = path.join(root, rulePath);
    if (fs.existsSync(fullPath)) {
      try {
        return fs.readFileSync(fullPath, 'utf8');
      } catch (error) {
        // Continue to next path
      }
    }
  }
  
  return undefined;
}

/**
 * Get relevant workspace files for Cursor context
 */
function getWorkspaceFiles(workspaceRoot?: string): string[] {
  const root = workspaceRoot || process.cwd();
  
  try {
    // Get recently modified files relevant to Cursor
    const recentFiles = fs.readdirSync(root, { withFileTypes: true })
      .filter(dirent => dirent.isFile())
      .filter(dirent => 
        dirent.name.endsWith('.ts') || 
        dirent.name.endsWith('.tsx') || 
        dirent.name.endsWith('.js') || 
        dirent.name.endsWith('.jsx') ||
        dirent.name.endsWith('.css') ||
        dirent.name.endsWith('.md')
      )
      .map(dirent => dirent.name)
      .slice(0, 10); // Limit context for Cursor
    
    return recentFiles;
  } catch (error) {
    return [];
  }
}

/**
 * Enhanced CLI interface for Cursor-specific detection
 */
export async function detectCursorEvolutionStories(
  userPrompt?: string,
  aiResponse?: string,
  cursorRules?: string,
  activeFile?: string,
  cursorPosition?: { line: number; character: number }
): Promise<void> {
  const detector = new CursorEvolutionDetector();
  
  console.log('🔍 Scanning for Cursor evolution story triggers...\n');
  
  // Run standard detection
  const standardTriggers = await detector.detectTriggers();
  
  // Add Cursor-specific analysis if conversation context provided
  let cursorTriggers: any[] = [];
  if (userPrompt) {
    const context = createCursorContext(
      userPrompt, 
      aiResponse, 
      undefined, 
      undefined, 
      cursorRules,
      activeFile,
      cursorPosition
    );
    
    cursorTriggers = await detector.analyzeCursorContext(context);
    await detector.saveConversationContext(context);
  }
  
  // Analyze recent Cursor conversation logs
  const recentTriggers = await detector.analyzeRecentConversations(1);
  
  const allTriggers = [...standardTriggers, ...cursorTriggers, ...recentTriggers];
  
  // Report all triggers with Cursor-specific formatting
  if (allTriggers.length === 0) {
    console.log('✅ No Cursor evolution story triggers detected');
    return;
  }
  
  detector.reportTriggers();
  
  // Report Cursor-specific findings
  if (cursorTriggers.length > 0) {
    console.log('\n🎨 Cursor Real-Time Triggers:');
    cursorTriggers.forEach(trigger => {
      const icon = trigger.severity === 'critical' ? '🚨' : 
                  trigger.severity === 'high' ? '⚠️' : 
                  trigger.severity === 'medium' ? '💡' : '📝';
      
      console.log(`   ${icon} [${trigger.severity}] ${trigger.suggestedStoryTitle}`);
      console.log(`      Auto-generate: ${trigger.autoGenerate ? 'Yes' : 'No'}`);
      console.log(`      Visual feedback: ${trigger.visualFeedback ? 'Enabled' : 'Disabled'}`);
    });
  }
}
