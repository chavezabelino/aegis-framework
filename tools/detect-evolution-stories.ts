/**
 * @aegisFrameworkVersion 2.3.0
 * @intent Automated detection system for evolution story triggers
 * @context Monitor framework usage patterns and automatically suggest evolution documentation
 * 
 * @aegisNote: See 'docs/manifesto/genai-os-manifesto.md'
 * This system implements the GenAI OS principle:
 * "Systems that observe themselves become self-improving"
 * 
 * @manifestoRef: case-studies.md#automated-evolution-detection
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { TeamConfigLoader } from './team-config-loader.js';

interface EvolutionTrigger {
  type: 'constitutional-violation' | 'user-question' | 'validation-failure' | 'migration-friction' | 'ai-quality-gap';
  severity: 'low' | 'medium' | 'high' | 'critical';
  evidence: string[];
  suggestedStoryTitle: string;
  autoGenerate: boolean;
}

export class EvolutionStoryDetector {
  protected projectRoot: string;
  private triggers: EvolutionTrigger[] = [];
  private configLoader: TeamConfigLoader;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.configLoader = TeamConfigLoader.getInstance(projectRoot);
  }

  /**
   * Scan for evolution story triggers across multiple signals
   * Note: This detection behavior can be configured via team-config.yaml
   * See docs/roadmap/feature-configurability-roadmap.md for configuration details
   */
  async detectTriggers(): Promise<EvolutionTrigger[]> {
    this.triggers = [];

    // Check if evolution story detection is enabled
    if (!this.configLoader.isRequiredFeatureEnabled('evolutionStoryDetection')) {
      console.log('📋 Evolution story detection disabled in team configuration');
      return [];
    }

    // Check for constitutional violations
    await this.detectConstitutionalViolations();
    
    // Check for validation failures
    await this.detectValidationFailures();
    
    // Check for user question patterns
    await this.detectUserQuestionPatterns();
    
    // Check for AI quality gaps
    await this.detectAIQualityGaps();
    
    // Check for migration friction
    await this.detectMigrationFriction();

    // Check for immediate context (staged changes, recent edits)
    await this.detectImmediateContext();

    return this.triggers;
  }

  /**
   * Detect constitutional violations in recent changes
   */
  private async detectConstitutionalViolations(): Promise<void> {
    try {
      // Check git commit messages for constitutional changes without stories
      const recentCommits = execSync('git log --oneline -10', { cwd: this.projectRoot, encoding: 'utf8' });
      
      const constitutionalCommits = recentCommits.split('\n').filter(line => 
        line.toLowerCase().includes('constitutional') || 
        line.toLowerCase().includes('constitution') ||
        line.toLowerCase().includes('breaking change')
      );

      for (const commit of constitutionalCommits) {
        const commitHash = commit.split(' ')[0];
        
        // Check if this commit has an associated evolution story
        const evolutionStories = this.getExistingEvolutionStories();
        const hasStory = evolutionStories.some(story => story.includes(commitHash));
        
        if (!hasStory) {
          this.triggers.push({
            type: 'constitutional-violation',
            severity: 'critical',
            evidence: [`Commit without evolution story: ${commit}`],
            suggestedStoryTitle: `Constitutional Change Documentation - ${commitHash}`,
            autoGenerate: true
          });
        }
      }
    } catch (error) {
      // Git operations might fail in some environments
    }
  }

  /**
   * Detect validation failures that might indicate framework gaps
   */
  private async detectValidationFailures(): Promise<void> {
    // Check for recent validation failures in logs
    const logPatterns = [
      'Constitutional Violation:',
      'Schema validation failed:',
      'Plan validation failed:',
      'Tools manifest validation failed:'
    ];

    // Check if validation logs exist
    const possibleLogFiles = [
      'validation.log',
      'ci.log',
      '.github/workflows/constitutional-compliance.yml'
    ];

    for (const logFile of possibleLogFiles) {
      const logPath = path.join(this.projectRoot, logFile);
      if (fs.existsSync(logPath)) {
        const content = fs.readFileSync(logPath, 'utf8');
        
        for (const pattern of logPatterns) {
          if (content.includes(pattern)) {
            this.triggers.push({
              type: 'validation-failure',
              severity: 'high',
              evidence: [`Validation failure pattern: ${pattern} in ${logFile}`],
              suggestedStoryTitle: `Validation Framework Gap - ${pattern}`,
              autoGenerate: false
            });
          }
        }
      }
    }
  }

  /**
   * Detect user question patterns that reveal framework gaps
   */
  private async detectUserQuestionPatterns(): Promise<void> {
    // Look for common question patterns in documentation or issues
    const questionPatterns = [
      'does this break',
      'will this cause',
      'how do I',
      'why doesn\'t',
      'should I worry about',
      'what happens if',
      'do any of these present changes',
      'runtime failures'
    ];

    // Check recent documentation changes for question-like content
    try {
      const recentDocs = execSync('git log --oneline -5 -- docs/', { cwd: this.projectRoot, encoding: 'utf8' });
      
      for (const pattern of questionPatterns) {
        if (recentDocs.toLowerCase().includes(pattern)) {
          this.triggers.push({
            type: 'user-question',
            severity: 'medium',
            evidence: [`Question pattern detected: "${pattern}" in recent documentation`],
            suggestedStoryTitle: `User Concern Documentation - ${pattern}`,
            autoGenerate: false
          });
        }
      }
    } catch (error) {
      // Git operations might fail
    }

    // Check for README or documentation files with question-like content
    const docFiles = ['README.md', 'CONTRIBUTING.md', 'docs/**/*.md'];
    
    for (const docPattern of docFiles) {
      try {
        const files = execSync(`find . -name "${docPattern}" -type f`, { cwd: this.projectRoot, encoding: 'utf8' })
          .split('\n').filter(f => f.length > 0);
        
        for (const file of files.slice(0, 5)) { // Limit to avoid overwhelming
          if (fs.existsSync(path.join(this.projectRoot, file))) {
            const content = fs.readFileSync(path.join(this.projectRoot, file), 'utf8').toLowerCase();
            
            for (const pattern of questionPatterns) {
              if (content.includes(pattern)) {
                this.triggers.push({
                  type: 'user-question',
                  severity: 'medium',
                  evidence: [`Question pattern in ${file}: "${pattern}"`],
                  suggestedStoryTitle: `Documentation Gap - ${file}`,
                  autoGenerate: false
                });
                break; // One trigger per file
              }
            }
          }
        }
      } catch (error) {
        // File operations might fail
      }
    }
  }

  /**
   * Detect AI quality gaps in generated content
   */
  private async detectAIQualityGaps(): Promise<void> {
    // Check for incomplete AI-generated plans or content
    const aiContentPatterns = [
      'TBD',
      'TODO',
      'FIXME',
      'To be implemented',
      'placeholder',
      'example-only'
    ];

    // Check recent files for AI quality issues
    const aiGeneratedFiles = [
      'docs/implementation/**/*.md',
      'framework/templates/**/*',
      '**/remediation-plan*.yaml',
      '**/remediation-plan*.json'
    ];

    for (const pattern of aiGeneratedFiles) {
      try {
        const files = execSync(`find . -path "${pattern}" -type f 2>/dev/null || true`, 
          { cwd: this.projectRoot, encoding: 'utf8' })
          .split('\n').filter(f => f.length > 0);

        for (const file of files.slice(0, 10)) { // Limit search
          if (fs.existsSync(path.join(this.projectRoot, file))) {
            const content = fs.readFileSync(path.join(this.projectRoot, file), 'utf8');
            
            const foundPatterns = aiContentPatterns.filter(p => content.includes(p));
            if (foundPatterns.length > 0) {
              this.triggers.push({
                type: 'ai-quality-gap',
                severity: 'medium',
                evidence: [`Incomplete AI content in ${file}: ${foundPatterns.join(', ')}`],
                suggestedStoryTitle: `AI Content Quality Gap - ${path.basename(file)}`,
                autoGenerate: false
              });
            }
          }
        }
      } catch (error) {
        // File operations might fail
      }
    }
  }

  /**
   * Detect migration friction from recent changes
   */
  private async detectMigrationFriction(): Promise<void> {
    // Look for breaking changes or migration-related commits
    const migrationKeywords = [
      'migration',
      'breaking',
      'deprecat',
      'legacy',
      'compat',
      'upgrade',
      'rollback'
    ];

    try {
      const recentCommits = execSync('git log --oneline -10', { cwd: this.projectRoot, encoding: 'utf8' });
      
      for (const keyword of migrationKeywords) {
        if (recentCommits.toLowerCase().includes(keyword)) {
          this.triggers.push({
            type: 'migration-friction',
            severity: 'medium',
            evidence: [`Migration-related changes: keyword "${keyword}" in recent commits`],
            suggestedStoryTitle: `Migration Experience Documentation - ${keyword}`,
            autoGenerate: false
          });
        }
      }
    } catch (error) {
      // Git operations might fail
    }
  }

  /**
   * Detect immediate context (staged changes, current work)
   */
  private async detectImmediateContext(): Promise<void> {
    try {
      // Check staged changes for constitutional modifications
      const stagedFiles = execSync('git diff --cached --name-only', { cwd: this.projectRoot, encoding: 'utf8' })
        .split('\n').filter(f => f.length > 0);
      
      const constitutionalFiles = [
        'CONSTITUTION.md',
        'framework/framework-core-v*.md',
        'framework/contracts/**',
        'tools/validate-*.ts'
      ];
      
      for (const stagedFile of stagedFiles) {
        const isConstitutional = constitutionalFiles.some(pattern => {
          if (pattern.includes('*')) {
            const regex = new RegExp(pattern.replace('*', '.*'));
            return regex.test(stagedFile);
          }
          return stagedFile.includes(pattern);
        });
        
        if (isConstitutional) {
          this.triggers.push({
            type: 'constitutional-violation',
            severity: 'critical',
            evidence: [`Staged constitutional file without evolution story: ${stagedFile}`],
            suggestedStoryTitle: `Staged Constitutional Change - ${stagedFile}`,
            autoGenerate: true
          });
        }
      }
      
      // Check for recent file modifications that might need documentation
      const recentlyModified = execSync('find . -name "*.md" -mtime -1 -not -path "./.git/*" -not -path "./node_modules/*"', 
        { cwd: this.projectRoot, encoding: 'utf8' })
        .split('\n').filter(f => f.length > 0);
      
      for (const file of recentlyModified.slice(0, 5)) {
        if (file.includes('implementation') || file.includes('docs')) {
          try {
            const content = fs.readFileSync(path.join(this.projectRoot, file), 'utf8');
            
            // Check for question patterns in recently modified files
            const questionPatterns = [
              'does this break',
              'will this cause',
              'should we',
              'what happens',
              'how do we',
              'why doesn\'t'
            ];
            
            for (const pattern of questionPatterns) {
              if (content.toLowerCase().includes(pattern)) {
                this.triggers.push({
                  type: 'user-question',
                  severity: 'high', // Higher because it's recent/active
                  evidence: [`Recent question pattern in ${file}: "${pattern}"`],
                  suggestedStoryTitle: `Active User Concern - ${path.basename(file)}`,
                  autoGenerate: false
                });
                break;
              }
            }
          } catch (error) {
            // File read might fail
          }
        }
      }
    } catch (error) {
      // Git operations might fail in some environments
    }
  }

  /**
   * Get list of existing evolution stories
   */
  private getExistingEvolutionStories(): string[] {
    const evolutionDir = path.join(this.projectRoot, 'docs', 'evolution');
    if (!fs.existsSync(evolutionDir)) {
      return [];
    }

    try {
      return fs.readdirSync(evolutionDir)
        .filter(file => file.endsWith('.md'))
        .map(file => fs.readFileSync(path.join(evolutionDir, file), 'utf8'));
    } catch (error) {
      return [];
    }
  }

  /**
   * Generate automatic evolution story for high-severity triggers
   * Note: Auto-generation can be configured in team-config.yaml (optional feature)
   */
  async autoGenerateStories(): Promise<string[]> {
    // Check if auto-generation is enabled
    const config = this.configLoader.loadConfig();
    const autoGenerateEnabled = config?.required.evolutionStoryDetection.autoGenerate ?? false;
    
    if (!autoGenerateEnabled) {
      console.log('📋 Auto-generation of evolution stories disabled in team configuration');
      return [];
    }

    const autoTriggers = this.triggers.filter(t => t.autoGenerate && t.severity === 'critical');
    const generatedStories: string[] = [];

    for (const trigger of autoTriggers) {
      const storyId = this.generateStoryId();
      const storyContent = this.generateStoryTemplate(trigger, storyId);
      const fileName = `${storyId.toLowerCase()}-auto-generated.md`;
      const filePath = path.join(this.projectRoot, 'docs', 'evolution', fileName);

      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(filePath, storyContent);
      generatedStories.push(filePath);
    }

    return generatedStories;
  }

  /**
   * Generate unique story ID
   */
  private generateStoryId(): string {
    const today = new Date().toISOString().split('T')[0];
    const existing = this.getExistingEvolutionStories();
    const todayStories = existing.filter(story => story.includes(today));
    const sequence = String(todayStories.length + 1).padStart(3, '0');
    return `EVS-${today}-${sequence}`;
  }

  /**
   * Generate story template for auto-detected triggers
   */
  private generateStoryTemplate(trigger: EvolutionTrigger, storyId: string): string {
    const today = new Date().toISOString().split('T')[0];
    
    return `<!--
@aegisFrameworkVersion: 2.0.0-alpha-dev
@intent: Auto-generated evolution story for detected trigger
@context: Framework automatic detection of evolution documentation needs
-->

# ${storyId}: ${trigger.suggestedStoryTitle}

## 📊 Story Metadata
\`\`\`yaml
evolutionStory:
  id: "${storyId}"
  title: "${trigger.suggestedStoryTitle}"
  date: "${today}"
  frameworkVersion: "2.0.0-alpha-dev"
  triggerType: "${trigger.type}"
  impactLevel: "TBD"
  
  participants:
    fieldUser: "auto-detected"
    frameworkMaintainer: "framework-detector"
    
  artifactsGenerated:
    - "auto-generated-evolution-story"
\`\`\`

## 🔍 Automatic Detection

### **Trigger Type**
${trigger.type}

### **Severity Level**
${trigger.severity}

### **Evidence Found**
${trigger.evidence.map(e => `- ${e}`).join('\n')}

## 🌱 Field Context

### **Detection Pattern**
This evolution story was automatically generated by the framework's evolution detection system. The trigger indicates a potential gap or insight that should be documented.

### **Investigation Required**
**Human review needed** to complete this evolution story with:
- Actual field context and user workflow
- Root cause analysis
- Proposed solutions
- Implementation strategy

## 🚧 Action Required

This is an **automatically generated placeholder** that requires human investigation and completion.

### **Next Steps**
1. Review the detected evidence
2. Investigate the underlying cause
3. Complete the evolution story with field context
4. Implement any necessary framework enhancements
5. Update this story with implementation details

---

**Story Status**: 🚧 Auto-Generated - Requires Investigation  
**Framework Impact**: TBD  
**Evolution Pattern**: Automatic Detection System

*This story was created by the framework's evolution detection system and requires human review and completion.*
`;
  }

  /**
   * Report detected triggers
   */
  reportTriggers(): void {
    console.log('🔍 Evolution Story Detection Results:\n');
    
    if (this.triggers.length === 0) {
      console.log('✅ No evolution story triggers detected');
      return;
    }

    const grouped = this.triggers.reduce((acc, trigger) => {
      if (!acc[trigger.type]) acc[trigger.type] = [];
      acc[trigger.type].push(trigger);
      return acc;
    }, {} as Record<string, EvolutionTrigger[]>);

    for (const [type, triggers] of Object.entries(grouped)) {
      console.log(`📋 ${type.toUpperCase()}:`);
      triggers.forEach(trigger => {
        const icon = trigger.severity === 'critical' ? '🚨' : 
                    trigger.severity === 'high' ? '⚠️' : 
                    trigger.severity === 'medium' ? '💡' : '📝';
        
        console.log(`   ${icon} [${trigger.severity}] ${trigger.suggestedStoryTitle}`);
        console.log(`      Auto-generate: ${trigger.autoGenerate ? 'Yes' : 'No'}`);
        trigger.evidence.forEach(evidence => 
          console.log(`      Evidence: ${evidence}`)
        );
        console.log('');
      });
    }
  }
}

/**
 * CLI interface for evolution story detection
 */
export async function detectEvolutionStories(): Promise<void> {
  const detector = new EvolutionStoryDetector();
  
  console.log('🔍 Scanning for evolution story triggers...\n');
  
  const triggers = await detector.detectTriggers();
  detector.reportTriggers();
  
  if (triggers.some(t => t.autoGenerate)) {
    console.log('🤖 Auto-generating stories for critical triggers...\n');
    const generated = await detector.autoGenerateStories();
    
    if (generated.length > 0) {
      console.log('✅ Auto-generated evolution stories:');
      generated.forEach(file => console.log(`   📄 ${file}`));
    }
  }
  
  const manualTriggers = triggers.filter(t => !t.autoGenerate);
  if (manualTriggers.length > 0) {
    console.log('\n💡 Suggested manual evolution stories:');
    manualTriggers.forEach(trigger => {
      console.log(`   📝 ${trigger.suggestedStoryTitle}`);
      console.log(`      Command: node cli/generate-evolution-story.cjs`);
    });
  }
}

// Run CLI if called directly
if (process.argv[1] && process.argv[1].endsWith('detect-evolution-stories.ts')) {
  detectEvolutionStories();
}

// Export types and classes for extension
export type { EvolutionTrigger };
