/**
 * @aegisFrameworkVersion 2.4.0-alpha-dev
 * @intent Integration hook for capturing copilot conversation context
 * @context Enable real-time evolution detection from GitHub Copilot interactions
 */

import { RealTimeEvolutionDetector, createConversationContext } from './realtime-evolution-detection';
import fs from 'fs';
import path from 'path';

/**
 * Copilot Instructions Integration
 * This function should be called by copilot instruction systems to capture evolution triggers
 */
export async function captureConversationContext(
  userPrompt: string,
  copilotInstructions?: string,
  workspaceRoot?: string
): Promise<void> {
  try {
    const detector = new RealTimeEvolutionDetector(workspaceRoot);
    
    // Extract copilot instructions from environment or parameters
    const instructions = copilotInstructions || getCopilotInstructions(workspaceRoot);
    
    // Create conversation context
    const context = createConversationContext(
      userPrompt,
      undefined, // AI response not available yet
      generateCopilotSessionId(),
      getWorkspaceFiles(workspaceRoot),
      instructions
    );
    
    // Analyze for triggers
    const triggers = await detector.analyzeConversationContext(context);
    
    // Save conversation context
    await detector.saveConversationContext(context);
    
    // If triggers found, log them
    if (triggers.length > 0) {
      console.log('🔍 Real-time evolution triggers detected:');
      triggers.forEach(trigger => {
        const icon = trigger.severity === 'critical' ? '🚨' : 
                    trigger.severity === 'high' ? '⚠️' : 
                    trigger.severity === 'medium' ? '💡' : '📝';
        console.log(`   ${icon} ${trigger.suggestedStoryTitle}`);
      });
      
      // Auto-generate critical stories
      const criticalTriggers = triggers.filter(t => t.autoGenerate);
      if (criticalTriggers.length > 0) {
        const generated = await detector.autoGenerateStories();
        if (generated.length > 0) {
          console.log('🤖 Auto-generated evolution stories:');
          generated.forEach(file => console.log(`   📄 ${path.basename(file)}`));
        }
      }
    }
  } catch (error) {
    // Silently fail to avoid disrupting copilot workflow
    console.debug('Evolution detection error:', error);
  }
}

/**
 * Get copilot instructions from workspace
 */
function getCopilotInstructions(workspaceRoot?: string): string | undefined {
  const root = workspaceRoot || process.cwd();
  
  // Try common copilot instruction locations
  const instructionPaths = [
    '.github/copilot-instructions.md',
    'copilot-instructions.md',
    '.copilot/instructions.md',
    'docs/copilot-instructions.md'
  ];
  
  for (const instructionPath of instructionPaths) {
    const fullPath = path.join(root, instructionPath);
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
 * Get relevant workspace files for context
 */
function getWorkspaceFiles(workspaceRoot?: string): string[] {
  const root = workspaceRoot || process.cwd();
  
  try {
    // Get recently modified files
    const recentFiles = fs.readdirSync(root, { withFileTypes: true })
      .filter(dirent => dirent.isFile())
      .filter(dirent => dirent.name.endsWith('.md') || dirent.name.endsWith('.ts') || dirent.name.endsWith('.js'))
      .map(dirent => dirent.name)
      .slice(0, 10); // Limit context
    
    return recentFiles;
  } catch (error) {
    return [];
  }
}

/**
 * Generate session ID for copilot interactions
 */
function generateCopilotSessionId(): string {
  return `copilot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Hook for GitHub Copilot Chat integration
 */
export async function copilotChatHook(
  userMessage: string,
  chatContext?: any
): Promise<void> {
  // Extract workspace from chat context if available
  const workspaceRoot = chatContext?.workspaceFolder?.uri?.fsPath;
  
  await captureConversationContext(
    userMessage,
    undefined,
    workspaceRoot
  );
}

/**
 * Hook for GitHub Copilot completion integration
 */
export async function copilotCompletionHook(
  documentContext: string,
  triggerText: string
): Promise<void> {
  // Only analyze if trigger looks like a question or concern
  const questionPattern = /(?:how|why|what|does|will|should|can).*\?|concern|issue|problem|break|fail/i;
  
  if (questionPattern.test(triggerText)) {
    await captureConversationContext(
      `Code completion context: ${triggerText}`,
      `Document context: ${documentContext.slice(-500)}` // Last 500 chars
    );
  }
}

/**
 * Environment variable integration for external tools
 */
export function setupEnvironmentHooks(): void {
  // Set environment variable that can be checked by external tools
  process.env.AEGIS_EVOLUTION_DETECTION_ENABLED = 'true';
  process.env.AEGIS_CONVERSATION_LOG_DIR = path.join(process.cwd(), '.aegis', 'conversation-logs');
  
  // Create log directory
  const logDir = process.env.AEGIS_CONVERSATION_LOG_DIR;
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  console.log('🔍 Aegis real-time evolution detection enabled');
}

/**
 * CLI command to analyze recent copilot interactions
 */
export async function analyzeCopilotInteractions(days: number = 1): Promise<void> {
  const detector = new RealTimeEvolutionDetector();
  
  console.log(`🔍 Analyzing copilot interactions from last ${days} day(s)...\n`);
  
  const triggers = await detector.analyzeRecentConversations(days);
  
  if (triggers.length === 0) {
    console.log('✅ No evolution triggers found in recent copilot interactions');
    return;
  }
  
  console.log('🔥 Evolution triggers from copilot interactions:');
  
  const grouped = triggers.reduce((acc, trigger) => {
    if (!acc[trigger.type]) acc[trigger.type] = [];
    acc[trigger.type].push(trigger);
    return acc;
  }, {} as Record<string, any[]>);
  
  for (const [type, typeTriggers] of Object.entries(grouped)) {
    console.log(`\n📋 ${type.toUpperCase()}:`);
    typeTriggers.forEach(trigger => {
      const icon = trigger.severity === 'critical' ? '🚨' : 
                  trigger.severity === 'high' ? '⚠️' : 
                  trigger.severity === 'medium' ? '💡' : '📝';
      
      console.log(`   ${icon} [${trigger.severity}] ${trigger.suggestedStoryTitle}`);
      console.log(`      Evidence: ${trigger.evidence[0]}`);
    });
  }
  
  // Auto-generate critical stories
  const criticalTriggers = triggers.filter(t => t.autoGenerate);
  if (criticalTriggers.length > 0) {
    console.log('\n🤖 Auto-generating stories for critical triggers...');
    const generated = await detector.autoGenerateStories();
    
    if (generated.length > 0) {
      console.log('✅ Auto-generated evolution stories:');
      generated.forEach(file => console.log(`   📄 ${path.basename(file)}`));
    }
  }
  
  const manualTriggers = triggers.filter(t => !t.autoGenerate);
  if (manualTriggers.length > 0) {
    console.log('\n💡 Suggested manual evolution stories:');
    manualTriggers.forEach(trigger => {
      console.log(`   📝 ${trigger.suggestedStoryTitle}`);
    });
    console.log('   Command: npm run evolution-story');
  }
}
