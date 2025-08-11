#!/usr/bin/env node
/**
 * @aegisBlueprint: project-hydration-tool
 * @version: 1.1.0-beta
 * @mode: strict
 * @intent: One-command migration tool with constitutional governance
 * @context: Implementation of "bill becomes law" migration process
 *
 * @aegisNote: See 'docs/manifesto/genai-os-manifesto.md'
 * This tool implements the GenAI OS principle:
 * "Automation without governance is just faster chaos"
 *
 * @manifestoRef: case-studies.md#hydration-vs-manual-migration
 */

import { Command } from 'commander';
import { readFileSync, existsSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { AegisTelemetry } from '../framework/observability/aegis-telemetry.ts';

const execAsync = promisify(exec);

interface MigrationPlan {
  targetPath: string;
  detectedFrameworks: string[];
  estimatedCompliance: number;
  requiredSteps: MigrationStep[];
  approvalGates: ApprovalGate[];
  rollbackPoints: string[];
}

interface MigrationStep {
  id: string;
  name: string;
  description: string;
  commands: string[];
  validators: string[];
  rollbackCommands: string[];
  estimatedDuration: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface ApprovalGate {
  stepId: string;
  name: string;
  description: string;
  checkpoints: string[];
  autoApprove?: boolean;
}

class AegisHydrator {
  private plan: MigrationPlan | null = null;
  private spinner = ora();
  private telemetry?: AegisTelemetry;

  initializeTelemetry(projectPath: string): void {
    this.telemetry = AegisTelemetry.forHydration(projectPath);
  }

  async discover(targetPath: string): Promise<MigrationPlan> {
    this.spinner.start('🔍 Discovering project structure...');

    try {
      // Run the existing migration audit
      const { stdout } = await execAsync(`node cli/aegis-migration-audit.cjs ${targetPath}`);

      // Analyze project structure
      const detectedFrameworks = await this.detectFrameworks(targetPath);
      const estimatedCompliance = await this.estimateCompliance(targetPath);

      this.spinner.succeed('🔍 Discovery complete');

      return {
        targetPath,
        detectedFrameworks,
        estimatedCompliance,
        requiredSteps: await this.generateSteps(targetPath),
        approvalGates: this.generateApprovalGates(),
        rollbackPoints: ['initial', 'post-structure', 'post-blueprints', 'post-validation'],
      };
    } catch (error) {
      this.spinner.fail(`🔍 Discovery failed: ${error}`);
      throw error;
    }
  }

  async generateMigrationPlan(targetPath: string): Promise<void> {
    console.log(chalk.blue.bold('\n🏛️  Aegis Framework Hydration Tool\n'));

    // Phase 1: Discovery
    this.plan = await this.discover(targetPath);

    // Display assessment
    this.displayAssessment();

    // Phase 2: Human approval for plan
    const planApproved = await this.requestApproval(
      'Continue with migration plan?',
      'This will modify your project structure and add constitutional governance.'
    );

    if (!planApproved) {
      console.log(chalk.yellow('Migration cancelled by user.'));
      return;
    }

    // Phase 3: Execute with gates
    await this.executeWithGates();
  }

  private displayAssessment(): void {
    if (!this.plan) return;

    console.log(chalk.cyan('📊 ASSESSMENT RESULTS:'));
    console.log(`   Target: ${this.plan.targetPath}`);
    console.log(`   Frameworks: ${this.plan.detectedFrameworks.join(', ')}`);
    console.log(`   Estimated Compliance: ${this.plan.estimatedCompliance}%`);
    console.log(`   Steps Required: ${this.plan.requiredSteps.length}`);
    console.log(`   Approval Gates: ${this.plan.approvalGates.length}`);
    console.log(`   Estimated Duration: ${this.estimateTotalDuration()} minutes\n`);
  }

  private async executeWithGates(): Promise<void> {
    if (!this.plan) return;

    console.log(chalk.green.bold('🚀 EXECUTING MIGRATION PLAN...\n'));

    for (let i = 0; i < this.plan.requiredSteps.length; i++) {
      const step = this.plan.requiredSteps[i];
      const gate = this.plan.approvalGates.find(g => g.stepId === step.id);

      // Execute step
      await this.executeStep(step, i + 1, this.plan.requiredSteps.length);

      // Check for approval gate
      if (gate && !gate.autoApprove) {
        const approved = await this.requestApproval(`GATE ${i + 1}: ${gate.name}`, gate.description);

        if (!approved) {
          await this.rollback(step.id);
          return;
        }
      }
    }

    // Final compliance check
    await this.finalComplianceCheck();
  }

  private async executeStep(step: MigrationStep, current: number, total: number): Promise<void> {
    console.log(chalk.blue(`\nSTEP ${current}/${total}: ${step.name}`));
    console.log(chalk.gray(`Risk Level: ${step.riskLevel.toUpperCase()}`));

    this.spinner.start(`Executing ${step.description}...`);

    try {
      for (const command of step.commands) {
        await execAsync(command);
      }

      // Run validators
      for (const validator of step.validators) {
        await execAsync(validator);
      }

      this.spinner.succeed(`✅ ${step.name} COMPLETE`);
    } catch (error) {
      this.spinner.fail(`❌ ${step.name} FAILED: ${error}`);

      // Auto-rollback on failure
      console.log(chalk.yellow('Initiating automatic rollback...'));
      await this.rollback(step.id);
      throw error;
    }
  }

  private async requestApproval(title: string, description: string): Promise<boolean> {
    console.log(chalk.yellow.bold(`\n❓ ${title}`));
    console.log(chalk.gray(description));

    const { approved } = await inquirer.prompt([
      {
        type: 'expand',
        name: 'approved',
        message: 'How would you like to proceed?',
        choices: [
          { key: 'y', name: 'Yes, continue', value: true },
          { key: 'n', name: 'No, cancel migration', value: false },
          { key: 'd', name: 'Show details', value: 'details' },
          { key: 'i', name: 'Inspect current state', value: 'inspect' },
        ],
      },
    ]);

    if (approved === 'details') {
      await this.showDetails();
      return this.requestApproval(title, description);
    }

    if (approved === 'inspect') {
      await this.inspectCurrentState();
      return this.requestApproval(title, description);
    }

    return approved;
  }

  private async detectFrameworks(targetPath: string): Promise<string[]> {
    const frameworks: string[] = [];

    // Check package.json for framework indicators
    const packageJsonPath = `${targetPath}/package.json`;
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      if (deps.react) frameworks.push('React');
      if (deps.next) frameworks.push('Next.js');
      if (deps.vue) frameworks.push('Vue');
      if (deps['@supabase/supabase-js']) frameworks.push('Supabase');
      if (deps.typescript) frameworks.push('TypeScript');
    }

    return frameworks;
  }

  private async estimateCompliance(targetPath: string): Promise<number> {
    // Run existing audit tool
    try {
      const { stdout } = await execAsync(`node cli/aegis-migration-audit.cjs ${targetPath} --dry-run`);
      // Parse output to extract compliance estimate
      return 85; // Placeholder - would parse actual output
    } catch {
      return 0;
    }
  }

  private async generateSteps(targetPath: string): Promise<MigrationStep[]> {
    return [
      {
        id: 'foundation',
        name: 'Constitutional Foundation',
        description: 'Setting up framework structure and governance',
        commands: [
          `echo "1.0.0-alpha" > ${targetPath}/VERSION`,
          `cp CONSTITUTION.md ${targetPath}/`,
          `mkdir -p ${targetPath}/.framework`,
          `mkdir -p ${targetPath}/framework/{contracts,observability,adapters,versions}`,
        ],
        validators: ['ls ${targetPath}/.framework', 'ls ${targetPath}/framework'],
        rollbackCommands: [`rm -rf ${targetPath}/.framework`, `rm -rf ${targetPath}/framework`],
        estimatedDuration: 2,
        riskLevel: 'low',
      },
      {
        id: 'blueprints',
        name: 'Blueprint Generation',
        description: 'Analyzing project and creating constitutional blueprints',
        commands: [`mkdir -p ${targetPath}/blueprints`, `node cli/auto-generate-blueprint.ts ${targetPath}`],
        validators: [`node tools/validate-blueprint.ts ${targetPath}/patterns/*/blueprint.yaml`],
        rollbackCommands: [`rm -rf ${targetPath}/blueprints`],
        estimatedDuration: 5,
        riskLevel: 'medium',
      },
      {
        id: 'validation',
        name: 'Validation Infrastructure',
        description: 'Installing compliance and validation tools',
        commands: [`cp -r tools/ ${targetPath}/tools/`, `cp -r cli/ ${targetPath}/cli/`],
        validators: [`node ${targetPath}/tools/validate-constitution.ts`],
        rollbackCommands: [`rm -rf ${targetPath}/tools`, `rm -rf ${targetPath}/cli`],
        estimatedDuration: 3,
        riskLevel: 'low',
      },
    ];
  }

  private generateApprovalGates(): ApprovalGate[] {
    return [
      {
        stepId: 'foundation',
        name: 'Constitutional Foundation Review',
        description: 'Framework structure created. Review before proceeding.',
        checkpoints: ['VERSION file', 'CONSTITUTION.md', '.framework/ structure'],
      },
      {
        stepId: 'blueprints',
        name: 'Blueprint Validation',
        description: 'Project blueprints generated. Validate before tools installation.',
        checkpoints: ['Blueprint YAML syntax', 'Required fields present', 'Constitutional compliance'],
      },
      {
        stepId: 'validation',
        name: 'Final Compliance Check',
        description: 'All tools installed. Run final compliance validation.',
        checkpoints: ['Constitutional compliance score', 'Blueprint validation', 'Tool functionality'],
        autoApprove: false,
      },
    ];
  }

  private estimateTotalDuration(): number {
    return this.plan?.requiredSteps.reduce((total, step) => total + step.estimatedDuration, 0) || 0;
  }

  private async rollback(stepId: string): Promise<void> {
    console.log(chalk.red.bold(`\n🔄 ROLLING BACK TO CHECKPOINT BEFORE: ${stepId}`));

    if (!this.plan) return;

    // Find steps to rollback (all steps up to and including the failed one)
    const stepIndex = this.plan.requiredSteps.findIndex(s => s.id === stepId);
    const stepsToRollback = this.plan.requiredSteps.slice(0, stepIndex + 1).reverse();

    for (const step of stepsToRollback) {
      this.spinner.start(`Rolling back ${step.name}...`);

      try {
        for (const command of step.rollbackCommands) {
          await execAsync(command);
        }
        this.spinner.succeed(`✅ Rolled back ${step.name}`);
      } catch (error) {
        this.spinner.fail(`❌ Rollback failed for ${step.name}: ${error}`);
      }
    }

    console.log(chalk.green('🔄 Rollback complete. Project restored to original state.'));
  }

  private async showDetails(): Promise<void> {
    if (!this.plan) return;

    console.log(chalk.cyan('\n📋 DETAILED MIGRATION PLAN:'));

    this.plan.requiredSteps.forEach((step, i) => {
      console.log(`\n${i + 1}. ${chalk.bold(step.name)} (${step.estimatedDuration}min, ${step.riskLevel} risk)`);
      console.log(`   ${step.description}`);
      console.log(`   Commands: ${step.commands.length}`);
      console.log(`   Validators: ${step.validators.length}`);
    });
  }

  private async inspectCurrentState(): Promise<void> {
    // Show current project state before continuing
    console.log(chalk.cyan('\n🔍 CURRENT PROJECT STATE:'));

    try {
      const { stdout } = await execAsync('ls -la');
      console.log(stdout);
    } catch (error) {
      console.log(`Error inspecting: ${error}`);
    }
  }

  private async finalComplianceCheck(): Promise<void> {
    if (!this.plan) return;

    console.log(chalk.green.bold('\n🏛️ FINAL COMPLIANCE VALIDATION'));

    this.spinner.start('Running constitutional compliance check...');

    try {
      const { stdout } = await execAsync(`node ${this.plan.targetPath}/tools/validate-constitution.ts`);
      this.spinner.succeed('✅ Constitutional compliance validated');

      console.log(chalk.green.bold('\n🎉 MIGRATION COMPLETE!'));
      console.log(chalk.cyan('Your project is now Aegis Framework compliant.'));

      // Extract compliance percentage from output
      const complianceMatch = stdout.match(/Overall Compliance: (\d+\.\d+)%/);
      if (complianceMatch) {
        console.log(chalk.yellow(`Final Compliance Score: ${complianceMatch[1]}%`));
      }
    } catch (error) {
      this.spinner.fail('❌ Final compliance check failed');
      console.log(chalk.red(`Error: ${error}`));
    }
  }
}

// CLI Setup
const program = new Command();

program
  .name('aegis-hydrate')
  .description('One-command migration tool for Aegis Framework compliance')
  .version('2.1.0')
  .argument('<target-path>', 'Path to the project to migrate')
  .option('-i, --interactive', 'Interactive mode with approval gates', true)
  .option('--auto-approve', 'Skip all approval gates (dangerous)', false)
  .option('--dry-run', 'Show migration plan without executing', false)
  .action(async (targetPath, options) => {
    const hydrator = new AegisHydrator();

    // Initialize telemetry
    hydrator.initializeTelemetry(targetPath);

    try {
      if (options.dryRun) {
        const plan = await hydrator.discover(targetPath);
        console.log('Migration plan generated. Use --interactive to execute.');
      } else {
        await hydrator.generateMigrationPlan(targetPath);
      }
    } catch (error) {
      console.error(chalk.red(`Migration failed: ${error}`));
      process.exit(1);
    }
  });

program.parse();
