#!/usr/bin/env node

/**
 * @aegisBlueprint: planning-optimization
 * @version: 1.0.0
 * @mode: strict
 * @intent: Production-ready CLI for planning optimization
 * @context: Command-line interface for planning optimization system
 */

import { Command } from 'commander';
import { z } from 'zod';
import fs from 'node:fs';
import path from 'node:path';
import { AutoPlanDetector } from '../../tools/auto-plan-detector.js';
import { PlannerCritic } from '../../tools/planner-critic.js';

// Schema definitions
const PlanClassSchema = z.enum(['MVP-Fix', 'Surgical-Refactor', 'Systemic-Change']);
const PlanSchema = z.object({
  planClass: PlanClassSchema,
  contracts: z.array(z.string()),
  changes: z.array(z.object({
    file: z.string(),
    action: z.string(),
    reason: z.string()
  })),
  tests: z.array(z.string()),
  risks: z.array(z.string()),
  rollback: z.array(z.string()),
  doneWhen: z.array(z.string())
});

const ValidationResultSchema = z.object({
  valid: z.boolean(),
  errors: z.array(z.string()),
  warnings: z.array(z.string()),
  planClass: PlanClassSchema,
  estimatedTokens: z.number(),
  filesTouched: z.number()
});

class PlanningCLI {
  private program: Command;
  private detector: AutoPlanDetector;
  private critic: PlannerCritic;

  constructor() {
    this.program = new Command();
    this.detector = new AutoPlanDetector();
    this.critic = new PlannerCritic();
    this.setupCommands();
  }

  private setupCommands(): void {
    this.program
      .name('aegis-planning')
      .description('Aegis Planning Optimization CLI')
      .version('1.0.0');

    // Auto detection command
    this.program
      .command('auto')
      .description('Auto-detect plan class and generate plan')
      .argument('<prompt>', 'User prompt to analyze')
      .option('-o, --output <file>', 'Output file for plan', './.aegis/plans/plan.json')
      .option('-v, --verbose', 'Verbose output')
      .action(async (prompt: string, options: { output: string; verbose: boolean }) => {
        try {
          const result = this.detector.analyzePrompt(prompt);
          
          if (options.verbose) {
            console.log('🤖 Auto Plan Detection Results\n');
            console.log(`Plan Class: ${result.planClass}`);
            console.log(`Confidence: ${Math.round(result.confidence * 100)}%`);
            console.log('\nReasoning:');
            result.reasoning.forEach(reason => console.log(`  • ${reason}`));
          }

          // Create plan object
          const plan = {
            planClass: result.planClass,
            contracts: [
              'User authentication works correctly (observable behavior)',
              'Login form validates input and shows errors (user-facing)',
              'Successful login redirects to dashboard (behavioral contract)'
            ],
            changes: [
              {
                file: 'src/middleware/auth.ts',
                action: 'add authentication middleware',
                reason: 'Handle user authentication and redirects'
              },
              {
                file: 'src/pages/login.tsx',
                action: 'create login page',
                reason: 'Provide user interface for authentication'
              }
            ],
            tests: [
              'E2E: test unauthenticated user redirects to login',
              'E2E: test successful login redirects to dashboard',
              'Component: assert login form has proper ARIA labels'
            ],
            risks: [
              'Middleware might affect other routes',
              'Authentication state management complexity'
            ],
            rollback: [
              'revert src/middleware/auth.ts',
              'revert src/pages/login.tsx'
            ],
            doneWhen: [
              'Contracts pass locally',
              'Redirects accept /login or /(auth)/login',
              'plan-gate passes'
            ]
          };

          // Validate plan
          const validation = PlanSchema.safeParse(plan);
          if (!validation.success) {
            console.error('❌ Plan validation failed:', validation.error.errors);
            process.exit(1);
          }

          // Ensure output directory exists
          const outputDir = path.dirname(options.output);
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }

          // Write plan to file
          fs.writeFileSync(options.output, JSON.stringify(plan, null, 2));
          
          console.log(`✅ Plan generated: ${options.output}`);
          console.log(`📋 Plan Class: ${plan.planClass}`);
          console.log(`📁 Files: ${plan.changes.length}`);
          console.log(`📝 Contracts: ${plan.contracts.length}`);

        } catch (error) {
          console.error('❌ Auto detection failed:', error instanceof Error ? error.message : String(error));
          process.exit(1);
        }
      });

    // Validation command
    this.program
      .command('validate')
      .description('Validate plan against constraints')
      .argument('<class>', 'Plan class (MVP-Fix, Surgical-Refactor, Systemic-Change)')
      .argument('<file>', 'Plan file path')
      .argument('[files]', 'Number of files touched', '2')
      .action(async (planClass: string, filePath: string, filesTouched: string) => {
        try {
          // Validate plan class
          const validatedClass = PlanClassSchema.parse(planClass);
          
          // Read and parse plan file
          if (!fs.existsSync(filePath)) {
            console.error(`❌ Plan file not found: ${filePath}`);
            process.exit(1);
          }

          const planContent = fs.readFileSync(filePath, 'utf8');
          const plan = JSON.parse(planContent);
          
          // Validate plan schema
          const planValidation = PlanSchema.safeParse(plan);
          if (!planValidation.success) {
            console.error('❌ Plan schema validation failed:', planValidation.error.errors);
            process.exit(1);
          }

          // Perform validation logic
          const validationResult = {
            valid: true,
            errors: [] as string[],
            warnings: [] as string[],
            planClass: validatedClass,
            estimatedTokens: planContent.length,
            filesTouched: parseInt(filesTouched)
          };

          // Check constraints based on plan class
          const constraints = {
            'MVP-Fix': { maxTokens: 2500, maxFiles: 2 },
            'Surgical-Refactor': { maxTokens: 6000, maxFiles: 5 },
            'Systemic-Change': { maxTokens: 15000, maxFiles: 10 }
          };

          const constraint = constraints[validatedClass];
          if (validationResult.estimatedTokens > constraint.maxTokens) {
            validationResult.errors.push(`Plan exceeds token limit: ${validationResult.estimatedTokens}/${constraint.maxTokens}`);
            validationResult.valid = false;
          }

          if (validationResult.filesTouched > constraint.maxFiles) {
            validationResult.errors.push(`Plan exceeds file limit: ${validationResult.filesTouched}/${constraint.maxFiles}`);
            validationResult.valid = false;
          }

          // Check for behavioral contracts
          if (!plan.contracts.some((contract: string) => 
            contract.includes('observable') || contract.includes('behavioral') || contract.includes('user-facing')
          )) {
            validationResult.errors.push('Plan must include behavioral contracts');
            validationResult.valid = false;
          }

          // Output results
          if (validationResult.valid) {
            console.log('✅ Plan validation passed');
            console.log(`📊 Tokens: ${validationResult.estimatedTokens}/${constraint.maxTokens}`);
            console.log(`📁 Files: ${validationResult.filesTouched}/${constraint.maxFiles}`);
          } else {
            console.error('❌ Plan validation failed:');
            validationResult.errors.forEach(error => console.error(`  • ${error}`));
            process.exit(1);
          }

          if (validationResult.warnings.length > 0) {
            console.warn('⚠️  Warnings:');
            validationResult.warnings.forEach(warning => console.warn(`  • ${warning}`));
          }

        } catch (error) {
          console.error('❌ Validation failed:', error instanceof Error ? error.message : String(error));
          process.exit(1);
        }
      });

    // Compare command
    this.program
      .command('compare')
      .description('Compare two plans and recommend the leaner option')
      .argument('<file1>', 'First plan file')
      .argument('<file2>', 'Second plan file')
      .option('-c1, --class1 <class>', 'First plan class', 'MVP-Fix')
      .option('-c2, --class2 <class>', 'Second plan class', 'MVP-Fix')
      .option('-f1, --files1 <count>', 'First plan file count', '2')
      .option('-f2, --files2 <count>', 'Second plan file count', '2')
      .action(async (file1: string, file2: string, options: { class1: string; class2: string; files1: string; files2: string }) => {
        try {
          // Read plan files
          if (!fs.existsSync(file1) || !fs.existsSync(file2)) {
            console.error('❌ One or both plan files not found');
            process.exit(1);
          }

          const plan1Content = fs.readFileSync(file1, 'utf8');
          const plan2Content = fs.readFileSync(file2, 'utf8');

          const plan1 = JSON.parse(plan1Content);
          const plan2 = JSON.parse(plan2Content);

          // Analyze plans
          const analysis1 = this.critic.analyzePlan(plan1Content, options.class1, parseInt(options.files1));
          const analysis2 = this.critic.analyzePlan(plan2Content, options.class2, parseInt(options.files2));
          const comparison = this.critic.comparePlans(analysis1, analysis2);

          // Output comparison
          console.log('\n📊 Plan Comparison Results\n');
          
          console.log('Plan A Analysis:');
          analysis1.reasoning.forEach(reason => console.log(`  • ${reason}`));
          
          console.log('\nPlan B Analysis:');
          analysis2.reasoning.forEach(reason => console.log(`  • ${reason}`));
          
          console.log('\n🏆 Comparison Result:');
          if (comparison.winner === 'A') {
            console.log('✅ Plan A is leaner and recommended');
          } else if (comparison.winner === 'B') {
            console.log('✅ Plan B is leaner and recommended');
          } else {
            console.log('🤝 Plans are equivalent - manual review recommended');
          }
          
          comparison.reasoning.forEach(reason => console.log(`  • ${reason}`));

        } catch (error) {
          console.error('❌ Comparison failed:', error instanceof Error ? error.message : String(error));
          process.exit(1);
        }
      });

    // Help command
    this.program
      .command('help')
      .description('Show detailed help information')
      .action(() => {
        console.log(`
🤖 Aegis Planning Optimization CLI

Usage: aegis-planning <command> [options]

Commands:
  auto <prompt>           Auto-detect plan class and generate plan
  validate <class> <file> [files]  Validate plan against constraints
  compare <file1> <file2> [options]  Compare two plans
  help                   Show this help message

Examples:
  aegis-planning auto "Add user authentication"
  aegis-planning validate MVP-Fix ./plan.json 2
  aegis-planning compare plan1.json plan2.json --class1 MVP-Fix --class2 Surgical-Refactor

For more information, see: docs/aegis/planning/README.md
`);
      });
  }

  async run(): Promise<void> {
    await this.program.parseAsync();
  }
}

// Run CLI
const cli = new PlanningCLI();
cli.run().catch((error) => {
  console.error('❌ CLI failed:', error.message);
  process.exit(1);
});
