/**
 * @aegisFrameworkVersion: 2.1.0
 * @intent: Real-time evolution trigger detection from AI conversation context
 * @context: Capture field insights directly from user prompts and AI interactions
 * @mode: strict
 */

import * as fs from 'fs';
import * as path from 'path';
import { EvolutionStoryDetector, type EvolutionTrigger } from './detect-evolution-stories.js';
import { TeamConfigLoader } from './team-config-loader.js';

interface ConversationContext {
  userPrompt: string;
  aiResponse?: string;
  timestamp: Date;
  sessionId?: string;
  workspaceContext?: string[];
  copilotInstructions?: string;
}

interface RealTimePattern {
  pattern: RegExp;
  triggerType: EvolutionTrigger['type'];
  severity: EvolutionTrigger['severity'];
  autoGenerate: boolean;
  description: string;
}

class RealTimeEvolutionDetector extends EvolutionStoryDetector {
  private conversationLog: ConversationContext[] = [];
  private configLoader: TeamConfigLoader;
  
  constructor(projectRoot: string = process.cwd()) {
    super(projectRoot);
    this.configLoader = TeamConfigLoader.getInstance(projectRoot);
  }
  
  /**
   * Real-time patterns that indicate evolution story needs
   */
  private realTimePatterns: RealTimePattern[] = [
    // Constitutional question patterns
    {
      pattern: /does this break|will this cause|should I worry about|what happens if.*break|runtime failures?/i,
      triggerType: 'user-question',
      severity: 'high',
      autoGenerate: false,
      description: 'User expressing concern about potential breaking changes'
    },
    {
      pattern: /assess.*pitfall|enhance.*framework.*guard|gaps in|constitutional.*safeguards/i,
      triggerType: 'constitutional-violation',
      severity: 'critical',
      autoGenerate: true,
      description: 'User identifying constitutional framework gaps'
    },
    {
      pattern: /field-driven|eating.*dog food|real.*world.*usage|migration.*pitfall/i,
      triggerType: 'migration-friction',
      severity: 'high',
      autoGenerate: false,
      description: 'User reporting field experience friction'
    },
    {
      pattern: /should.*document.*somehow|systematic.*way|evolution.*stor(y|ies)|meta.*learning/i,
      triggerType: 'user-question',
      severity: 'medium',
      autoGenerate: false,
      description: 'User questioning documentation patterns'
    },
    {
      pattern: /automatically.*detect|framework.*remember|proactive.*detection/i,
      triggerType: 'ai-quality-gap',
      severity: 'medium',
      autoGenerate: false,
      description: 'User requesting automation improvements'
    },
    // Copilot instruction patterns
    {
      pattern: /follow.*coding.*instructions|constitutional.*authority|blueprint.*driven/i,
      triggerType: 'constitutional-violation',
      severity: 'medium',
      autoGenerate: false,
      description: 'Copilot instructions indicating constitutional framework usage'
    },
    // AI assistant confusion patterns
    {
      pattern: /I don't understand|not clear|confused about|how do I.*framework|what does.*mean in aegis/i,
      triggerType: 'user-question',
      severity: 'medium',
      autoGenerate: false,
      description: 'User confusion indicating documentation gaps'
    },
    // Implementation difficulty patterns
    {
      pattern: /this is hard|difficult to implement|complex to understand|missing documentation/i,
      triggerType: 'ai-quality-gap',
      severity: 'medium',
      autoGenerate: false,
      description: 'User experiencing implementation friction'
    }
  ];

  /**
   * Analyze conversation context for evolution triggers
   */
  async analyzeConversationContext(context: ConversationContext): Promise<EvolutionTrigger[]> {
    // Check if real-time pattern detection is enabled
    if (!this.configLoader.isOptionalFeatureEnabled('realtimePatternDetection')) {
      console.log('📋 Real-time pattern detection disabled in team configuration');
      return [];
    }

    const config = this.configLoader.loadConfig();
    const sensitivity = config?.optional.realtimePatternDetection.sensitivity ?? 'medium';
    this.conversationLog.push(context);
    const triggers: EvolutionTrigger[] = [];
    
    // Analyze user prompt
    for (const pattern of this.realTimePatterns) {
      if (pattern.pattern.test(context.userPrompt)) {
        triggers.push({
          type: pattern.triggerType,
          severity: pattern.severity,
          evidence: [
            `Real-time user prompt: "${this.truncateText(context.userPrompt, 100)}"`,
            `Pattern matched: ${pattern.description}`,
            `Timestamp: ${context.timestamp.toISOString()}`,
            `Session: ${context.sessionId || 'unknown'}`
          ],
          suggestedStoryTitle: this.generateRealTimeStoryTitle(pattern, context),
          autoGenerate: pattern.autoGenerate
        });
      }
    }
    
    // Analyze AI response for quality gaps
    if (context.aiResponse) {
      const aiQualityTriggers = this.analyzeAIResponseQuality(context);
      triggers.push(...aiQualityTriggers);
    }
    
    // Analyze copilot instructions for constitutional patterns
    if (context.copilotInstructions) {
      const instructionTriggers = this.analyzeCopilotInstructions(context);
      triggers.push(...instructionTriggers);
    }
    
    return triggers;
  }

  /**
   * Analyze AI response quality for potential improvements
   */
  private analyzeAIResponseQuality(context: ConversationContext): EvolutionTrigger[] {
    const triggers: EvolutionTrigger[] = [];
    const response = context.aiResponse!;
    
    // Check for AI uncertainty indicators
    const uncertaintyPatterns = [
      /I'm not sure|unclear|might need to|perhaps|possibly|it depends/gi,
      /let me check|need more context|not certain|could be/gi,
      /this is complex|difficult to determine|varies depending/gi
    ];
    
    for (const pattern of uncertaintyPatterns) {
      const matches = response.match(pattern);
      if (matches && matches.length > 2) { // Multiple uncertainty indicators
        triggers.push({
          type: 'ai-quality-gap',
          severity: 'medium',
          evidence: [
            `AI response showing uncertainty: ${matches.length} indicators`,
            `Original prompt: "${this.truncateText(context.userPrompt, 80)}"`,
            `Response excerpt: "${this.truncateText(response, 100)}"`,
            `Uncertainty patterns: ${matches.slice(0, 3).join(', ')}`
          ],
          suggestedStoryTitle: `AI Response Quality Gap - ${this.extractTopicFromPrompt(context.userPrompt)}`,
          autoGenerate: false
        });
        break; // One trigger per response
      }
    }
    
    return triggers;
  }

  /**
   * Analyze copilot instructions for constitutional framework patterns
   */
  private analyzeCopilotInstructions(context: ConversationContext): EvolutionTrigger[] {
    const triggers: EvolutionTrigger[] = [];
    const instructions = context.copilotInstructions!;
    
    // Check for constitutional framework references
    const constitutionalPatterns = [
      /aegis.*framework/gi,
      /constitutional.*authority|blueprint.*driven|framework.*core/gi,
      /evolution.*stor(y|ies)|field.*driven|meta.*learning/gi
    ];
    
    let constitutionalMatches = 0;
    for (const pattern of constitutionalPatterns) {
      const matches = instructions.match(pattern);
      if (matches) {
        constitutionalMatches += matches.length;
      }
    }
    
    if (constitutionalMatches > 3) { // Heavy constitutional framework usage
      triggers.push({
        type: 'constitutional-violation',
        severity: 'medium',
        evidence: [
          `Heavy constitutional framework usage in copilot instructions`,
          `Constitutional references: ${constitutionalMatches}`,
          `User prompt: "${this.truncateText(context.userPrompt, 80)}"`,
          `Instructions indicate active framework development`
        ],
        suggestedStoryTitle: `Active Constitutional Framework Development - ${this.extractTopicFromPrompt(context.userPrompt)}`,
        autoGenerate: false
      });
    }
    
    return triggers;
  }

  /**
   * Generate story title based on real-time pattern and context
   */
  private generateRealTimeStoryTitle(pattern: RealTimePattern, context: ConversationContext): string {
    const topic = this.extractTopicFromPrompt(context.userPrompt);
    const timestamp = context.timestamp.toISOString().split('T')[0];
    
    switch (pattern.triggerType) {
      case 'constitutional-violation':
        return `Real-Time Constitutional Insight - ${topic}`;
      case 'user-question':
        return `Field User Question - ${topic}`;
      case 'migration-friction':
        return `Real-World Migration Friction - ${topic}`;
      case 'ai-quality-gap':
        return `AI Assistant Quality Gap - ${topic}`;
      default:
        return `Real-Time Evolution Trigger - ${topic}`;
    }
  }

  /**
   * Extract topic/subject from user prompt
   */
  private extractTopicFromPrompt(prompt: string): string {
    // Simple keyword extraction
    const keywords = prompt.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(' ')
      .filter(word => word.length > 3)
      .filter(word => !['this', 'that', 'with', 'from', 'they', 'were', 'been', 'have', 'does', 'will', 'what', 'when', 'where', 'how'].includes(word))
      .slice(0, 3);
    
    return keywords.join(' ') || 'conversation';
  }

  /**
   * Truncate text for evidence logging
   */
  private truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  /**
   * Analyze conversation session for patterns
   */
  async analyzeConversationSession(sessionId: string): Promise<EvolutionTrigger[]> {
    const sessionConversations = this.conversationLog.filter(c => c.sessionId === sessionId);
    const triggers: EvolutionTrigger[] = [];
    
    if (sessionConversations.length < 2) return triggers;
    
    // Analyze session patterns
    const allPrompts = sessionConversations.map(c => c.userPrompt).join(' ');
    
    // Check for recurring confusion
    const confusionKeywords = ['how', 'why', 'what', 'confused', 'unclear', 'understand'];
    const confusionCount = confusionKeywords.reduce((count, keyword) => {
      return count + (allPrompts.toLowerCase().match(new RegExp(keyword, 'g')) || []).length;
    }, 0);
    
    if (confusionCount > 5) {
      triggers.push({
        type: 'user-question',
        severity: 'high',
        evidence: [
          `High confusion indicators in session: ${confusionCount} instances`,
          `Session length: ${sessionConversations.length} exchanges`,
          `Session duration: ${this.calculateSessionDuration(sessionConversations)}`,
          `Common topics: ${this.extractSessionTopics(sessionConversations)}`
        ],
        suggestedStoryTitle: `Session Analysis - High User Confusion`,
        autoGenerate: false
      });
    }
    
    return triggers;
  }

  /**
   * Calculate session duration
   */
  private calculateSessionDuration(conversations: ConversationContext[]): string {
    if (conversations.length < 2) return 'N/A';
    
    const start = conversations[0].timestamp;
    const end = conversations[conversations.length - 1].timestamp;
    const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    
    return `${durationMinutes} minutes`;
  }

  /**
   * Extract common topics from session
   */
  private extractSessionTopics(conversations: ConversationContext[]): string {
    const allText = conversations.map(c => c.userPrompt).join(' ').toLowerCase();
    
    // Framework-specific keywords
    const frameworkKeywords = [
      'blueprint', 'constitutional', 'evolution', 'framework', 'validation',
      'remediation', 'detection', 'story', 'aegis', 'meta', 'learning'
    ];
    
    const foundKeywords = frameworkKeywords.filter(keyword => allText.includes(keyword));
    return foundKeywords.slice(0, 5).join(', ') || 'general development';
  }

  /**
   * Save conversation context to file for analysis
   */
  async saveConversationContext(context: ConversationContext): Promise<void> {
    const logDir = path.join(this.projectRoot, '.aegis', 'conversation-logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    const logFile = path.join(logDir, `${context.timestamp.toISOString().split('T')[0]}.jsonl`);
    const logEntry = JSON.stringify({
      ...context,
      timestamp: context.timestamp.toISOString()
    });
    
    fs.appendFileSync(logFile, logEntry + '\n');
  }

  /**
   * Analyze recent conversation logs
   */
  async analyzeRecentConversations(days: number = 1): Promise<EvolutionTrigger[]> {
    const triggers: EvolutionTrigger[] = [];
    const logDir = path.join(this.projectRoot, '.aegis', 'conversation-logs');
    
    if (!fs.existsSync(logDir)) return triggers;
    
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    
    try {
      const logFiles = fs.readdirSync(logDir)
        .filter(file => file.endsWith('.jsonl'))
        .filter(file => {
          const fileDate = new Date(file.replace('.jsonl', ''));
          return fileDate >= cutoffDate;
        });
      
      for (const logFile of logFiles) {
        const content = fs.readFileSync(path.join(logDir, logFile), 'utf8');
        const lines = content.trim().split('\n').filter(line => line.length > 0);
        
        for (const line of lines) {
          try {
            const context: ConversationContext = JSON.parse(line);
            context.timestamp = new Date(context.timestamp);
            
            const contextTriggers = await this.analyzeConversationContext(context);
            triggers.push(...contextTriggers);
          } catch (error) {
            // Skip malformed log entries
          }
        }
      }
    } catch (error) {
      // Log directory issues
    }
    
    return triggers;
  }
}

/**
 * Factory function to create conversation context from current session
 */
export function createConversationContext(
  userPrompt: string,
  aiResponse?: string,
  sessionId?: string,
  workspaceFiles?: string[],
  copilotInstructions?: string
): ConversationContext {
  return {
    userPrompt,
    aiResponse,
    timestamp: new Date(),
    sessionId: sessionId || generateSessionId(),
    workspaceContext: workspaceFiles,
    copilotInstructions
  };
}

/**
 * Generate a session ID for conversation tracking
 */
function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Enhanced CLI interface with real-time detection
 */
export async function detectEvolutionStoriesRealTime(
  userPrompt?: string,
  aiResponse?: string,
  copilotInstructions?: string
): Promise<void> {
  const detector = new RealTimeEvolutionDetector();
  
  console.log('🔍 Scanning for evolution story triggers (including real-time)...\n');
  
  // Run standard detection
  const standardTriggers = await detector.detectTriggers();
  
  // Add real-time analysis if conversation context provided
  let realTimeTriggers: EvolutionTrigger[] = [];
  if (userPrompt) {
    const context = createConversationContext(
      userPrompt, 
      aiResponse, 
      undefined, 
      undefined, 
      copilotInstructions
    );
    
    realTimeTriggers = await detector.analyzeConversationContext(context);
    await detector.saveConversationContext(context);
  }
  
  // Analyze recent conversation logs
  const recentTriggers = await detector.analyzeRecentConversations(1);
  
  const allTriggers = [...standardTriggers, ...realTimeTriggers, ...recentTriggers];
  
  // Report all triggers
  if (allTriggers.length === 0) {
    console.log('✅ No evolution story triggers detected');
    return;
  }
  
  detector.reportTriggers();
  
  // Report real-time specific findings
  if (realTimeTriggers.length > 0) {
    console.log('\n🔥 Real-Time Conversation Triggers:');
    realTimeTriggers.forEach(trigger => {
      const icon = trigger.severity === 'critical' ? '🚨' : 
                  trigger.severity === 'high' ? '⚠️' : 
                  trigger.severity === 'medium' ? '💡' : '📝';
      
      console.log(`   ${icon} [${trigger.severity}] ${trigger.suggestedStoryTitle}`);
      console.log(`      Auto-generate: ${trigger.autoGenerate ? 'Yes' : 'No'}`);
    });
  }
  
  // Auto-generate for critical triggers
  if (allTriggers.some(t => t.autoGenerate)) {
    console.log('\n🤖 Auto-generating stories for critical triggers...\n');
    const generated = await detector.autoGenerateStories();
    
    if (generated.length > 0) {
      console.log('✅ Auto-generated evolution stories:');
      generated.forEach(file => console.log(`   📄 ${file}`));
    }
  }
}

// Export the enhanced detector for integration
export { RealTimeEvolutionDetector, type ConversationContext, type RealTimePattern };
