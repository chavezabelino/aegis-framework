#!/usr/bin/env node

/**
 * @aegisBlueprint: planning-optimization
 * @version: 2.5.0
 * @mode: lean
 * @intent: Automatic plan detection and generation for frictionless development
 * @context: Enables "vibe coding" by automatically applying planning optimization
 * @model: claude-3-5-sonnet
 * @hash: 8f7a2b1c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1
 */

import fs from 'node:fs';
import path from 'node:path';

interface AutoPlanResult {
  planClass: 'MVP-Fix' | 'Surgical-Refactor' | 'Systemic-Change';
  confidence: number;
  reasoning: string[];
  suggestedPlan: string;
  validationCommand: string;
}

export class AutoPlanDetector {
  private config: any;

  constructor() {
    const configPath = path.join(process.cwd(), '.aegis/config/planning.json');
    this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }

  /**
   * Analyze user prompt and automatically generate appropriate plan
   */
  analyzePrompt(userPrompt: string): AutoPlanResult {
    const promptLower = userPrompt.toLowerCase();

    // Analyze prompt characteristics
    const characteristics = this.analyzePromptCharacteristics(promptLower);

    // Determine plan class based on characteristics
    const planClass = this.determinePlanClass(characteristics);

    // Generate appropriate plan
    const suggestedPlan = this.generatePlan(userPrompt, planClass, characteristics);

    // Determine validation command
    const validationCommand = this.getValidationCommand(planClass);

    return {
      planClass,
      confidence: this.calculateConfidence(characteristics),
      reasoning: this.generateReasoning(characteristics, planClass),
      suggestedPlan,
      validationCommand,
    };
  }

  private analyzePromptCharacteristics(prompt: string) {
    return {
      // Scope indicators
      isEnhancement: /enhance|improve|optimize|better|faster/.test(prompt),
      isNewFeature: /add|create|new|implement/.test(prompt),
      isBugFix: /fix|bug|error|issue|problem/.test(prompt),
      isRefactor: /refactor|restructure|reorganize|clean up/.test(prompt),

      // Complexity indicators
      mentionsMultipleFiles: /files?|components?|pages?|modules?/.test(prompt),
      mentionsInfrastructure: /database|schema|api|infrastructure|deployment/.test(prompt),
      mentionsBreaking: /breaking|migration|upgrade|version/.test(prompt),

      // Effort indicators
      mentionsComplex: /complex|complicated|difficult|challenging/.test(prompt),
      mentionsSimple: /simple|easy|quick|minor/.test(prompt),

      // File count estimation
      estimatedFiles: this.estimateFileCount(prompt),
    };
  }

  private estimateFileCount(prompt: string): number {
    let count = 1; // Base count

    // Count mentioned file types
    if (/component|page|route/.test(prompt)) count += 1;
    if (/api|endpoint|service/.test(prompt)) count += 1;
    if (/test|spec/.test(prompt)) count += 1;
    if (/style|css|styling/.test(prompt)) count += 1;
    if (/config|setup|init/.test(prompt)) count += 1;

    // Multiple features = more files
    if (/and|also|additionally|plus/.test(prompt)) count += 1;

    return Math.min(count, 10); // Cap at reasonable number
  }

  private determinePlanClass(characteristics: any): 'MVP-Fix' | 'Surgical-Refactor' | 'Systemic-Change' {
    // Systemic indicators
    if (
      characteristics.mentionsInfrastructure ||
      characteristics.mentionsBreaking ||
      characteristics.estimatedFiles > 8
    ) {
      return 'Systemic-Change';
    }

    // Surgical indicators
    if (characteristics.isRefactor || characteristics.estimatedFiles > 3 || characteristics.mentionsMultipleFiles) {
      return 'Surgical-Refactor';
    }

    // Default to MVP
    return 'MVP-Fix';
  }

  private generatePlan(userPrompt: string, planClass: string, characteristics: any): string {
    const template = this.loadPlanTemplate(planClass);

    // Extract contracts from prompt
    const contracts = this.extractContracts(userPrompt);

    // Estimate files to touch
    const files = this.estimateFilesToTouch(userPrompt, characteristics);

    // Generate plan content
    return template
      .replace('{{USER_PROMPT}}', userPrompt)
      .replace('{{PLAN_CLASS}}', planClass)
      .replace('{{CONTRACTS}}', contracts)
      .replace('{{FILES}}', files)
      .replace('{{FILE_COUNT}}', characteristics.estimatedFiles.toString());
  }

  private loadPlanTemplate(planClass: string): string {
    const templatePath = path.join(process.cwd(), 'docs/aegis/planning/minimum-viable-plan.md');
    let template = fs.readFileSync(templatePath, 'utf8');

    if (planClass === 'Surgical-Refactor') {
      template = template.replace('≤ 2 files', '≤ 5 files');
    } else if (planClass === 'Systemic-Change') {
      template = template.replace('≤ 2 files', '≤ 20 files');
      template = template.replace(
        '## 4) Risks & Rollback',
        '## 4) Justification\n\n**Why Systemic Change is Required:**\n\n## 5) Risks & Rollback'
      );
    }

    return template;
  }

  private extractContracts(userPrompt: string): string {
    const contracts: string[] = [];

    // Extract observable behaviors
    if (/redirect|navigate|go to/.test(userPrompt)) {
      contracts.push('- [ ] Users are redirected to appropriate pages (observable behavior)');
    }

    if (/form|input|submit/.test(userPrompt)) {
      contracts.push('- [ ] Form validation works correctly (user-facing)');
    }

    if (/display|show|render/.test(userPrompt)) {
      contracts.push('- [ ] Content displays correctly (observable behavior)');
    }

    if (/save|store|persist/.test(userPrompt)) {
      contracts.push('- [ ] Data is saved/loaded correctly (behavioral contract)');
    }

    // Default contract if none detected
    if (contracts.length === 0) {
      contracts.push('- [ ] Feature works as expected (observable behavior)');
    }

    return contracts.join('\n');
  }

  private estimateFilesToTouch(userPrompt: string, characteristics: any): string {
    const files: string[] = [];

    if (/component|page|route/.test(userPrompt)) {
      files.push('- File: `src/components/` — create/update component');
    }

    if (/api|endpoint|service/.test(userPrompt)) {
      files.push('- File: `src/api/` — create/update API endpoint');
    }

    if (/test|spec/.test(userPrompt)) {
      files.push('- File: `tests/` — add/update tests');
    }

    if (/style|css|styling/.test(userPrompt)) {
      files.push('- File: `src/styles/` — update styling');
    }

    // Default file if none detected
    if (files.length === 0) {
      files.push('- File: `src/` — implement feature');
    }

    return files.join('\n');
  }

  private getValidationCommand(planClass: string): string {
    switch (planClass) {
      case 'MVP-Fix':
        return 'npm run plan:gate:mvp';
      case 'Surgical-Refactor':
        return 'npm run plan:gate:surgical';
      case 'Systemic-Change':
        return 'npm run plan:gate:systemic';
      default:
        return 'npm run plan:gate:mvp';
    }
  }

  private calculateConfidence(characteristics: any): number {
    let confidence = 0.5; // Base confidence

    // High confidence indicators
    if (characteristics.isBugFix) confidence += 0.2;
    if (characteristics.isSimple) confidence += 0.15;
    if (characteristics.estimatedFiles <= 2) confidence += 0.1;

    // Low confidence indicators
    if (characteristics.mentionsComplex) confidence -= 0.1;
    if (characteristics.estimatedFiles > 5) confidence -= 0.1;
    if (characteristics.mentionsInfrastructure) confidence -= 0.1;

    return Math.max(0.1, Math.min(0.95, confidence));
  }

  private generateReasoning(characteristics: any, planClass: string): string[] {
    const reasoning: string[] = [];

    reasoning.push(`Detected plan class: ${planClass}`);

    if (characteristics.isBugFix) {
      reasoning.push('Bug fix detected - typically MVP-Fix scope');
    }

    if (characteristics.isRefactor) {
      reasoning.push('Refactoring detected - typically Surgical-Refactor scope');
    }

    if (characteristics.mentionsInfrastructure) {
      reasoning.push('Infrastructure changes detected - typically Systemic-Change scope');
    }

    reasoning.push(`Estimated files to touch: ${characteristics.estimatedFiles}`);

    return reasoning;
  }
}

// CLI interface for testing
if (import.meta.url === `file://${process.argv[1]}`) {
  const detector = new AutoPlanDetector();

  if (process.argv.length < 3) {
    console.error('Usage: node tools/auto-plan-detector.ts "your user prompt here"');
    process.exit(1);
  }

  const userPrompt = process.argv[2];
  const result = detector.analyzePrompt(userPrompt);

  console.log('\n🤖 Auto Plan Detection Results\n');
  console.log(`Plan Class: ${result.planClass}`);
  console.log(`Confidence: ${Math.round(result.confidence * 100)}%`);
  console.log('\nReasoning:');
  result.reasoning.forEach(reason => console.log(`  • ${reason}`));
  console.log(`\nValidation Command: ${result.validationCommand}`);
  console.log('\nSuggested Plan:');
  console.log(result.suggestedPlan);
}
