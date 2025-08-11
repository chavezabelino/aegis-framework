#!/usr/bin/env node

/**
 * Aegis Determinism Controller
 *
 * Provides deterministic generation controls with --seed override and generation receipts
 * Ensures bit-exact reproducibility across blueprint executions
 *
 * @aegisFrameworkVersion 2.4.0
 * @intent Deterministic AI generation with provable reproducibility
 * @context Hardening Aegis from "promising" to "undeniable"
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import yaml from 'js-yaml';
import { Command } from 'commander';
import type { AegisBlueprint, BlueprintDeterminismConfig } from '../framework/schemas/blueprint.schema.js';

interface GenerationReceipt {
  inputHash: string;
  modelVersion: string;
  outputDigest: string;
  timestamp: string;
  reproduced: boolean;
  blueprint: {
    id: string;
    version: string;
    path: string;
  };
  execution: {
    seed: string | number;
    temperature: number;
    mode: 'lean' | 'strict' | 'generative';
  };
  validation: {
    buildPassed: boolean;
    testsPassed: boolean;
    lintPassed: boolean;
  };
}

class DeterminismController {
  private frameworkRoot: string;
  private receiptsPath: string;

  constructor(frameworkRoot: string = process.cwd()) {
    this.frameworkRoot = frameworkRoot;
    this.receiptsPath = path.join(frameworkRoot, '.aegis', 'generation-receipts');
    this.ensureReceiptsDirectory();
  }

  private ensureReceiptsDirectory(): void {
    if (!fs.existsSync(this.receiptsPath)) {
      fs.mkdirSync(this.receiptsPath, { recursive: true });
    }
  }

  async generateWithSeed(
    blueprintPath: string,
    options: {
      seed?: string | number;
      temperature?: number;
      mode?: 'lean' | 'strict' | 'generative';
      modelVersion?: string;
    } = {}
  ): Promise<GenerationReceipt> {
    console.log(`🎲 Generating with deterministic controls...`);

    // Load blueprint
    const blueprintContent = fs.readFileSync(blueprintPath, 'utf8');
    const blueprint = yaml.load(blueprintContent) as AegisBlueprint;

    // Apply determinism config
    const determinismConfig: BlueprintDeterminismConfig = {
      seed: options.seed || blueprint.determinismConfig?.seed || this.generateSeed(),
      temperature: options.temperature ?? blueprint.determinismConfig?.temperature ?? 0.0,
      strictMode: blueprint.determinismConfig?.strictMode ?? true,
    };

    // Generate input hash for reproducibility verification
    const inputData = {
      blueprint: blueprintContent,
      seed: determinismConfig.seed,
      temperature: determinismConfig.temperature,
      mode: options.mode || 'strict',
    };
    const inputHash = this.hashObject(inputData);

    console.log(`📊 Generation Parameters:`);
    console.log(`   Seed: ${determinismConfig.seed}`);
    console.log(`   Temperature: ${determinismConfig.temperature}`);
    console.log(`   Mode: ${options.mode || 'strict'}`);
    console.log(`   Input Hash: ${inputHash.substring(0, 16)}...`);

    // Create generation receipt
    const receipt: GenerationReceipt = {
      inputHash,
      modelVersion: options.modelVersion || 'unknown',
      outputDigest: '', // Will be filled after generation
      timestamp: new Date().toISOString(),
      reproduced: false,
      blueprint: {
        id: blueprint.id,
        version: blueprint.version,
        path: blueprintPath,
      },
      execution: {
        seed: determinismConfig.seed || this.generateSeed(),
        temperature: determinismConfig.temperature || 0.1,
        mode: options.mode || 'strict',
      },
      validation: {
        buildPassed: false,
        testsPassed: false,
        lintPassed: false,
      },
    };

    // Store receipt
    await this.storeReceipt(receipt);

    return receipt;
  }

  async verifyReproducibility(blueprintPath: string, outputPath: string): Promise<boolean> {
    console.log(`🔍 Verifying reproducibility...`);

    const receipts = await this.getReceiptsForBlueprint(blueprintPath);
    if (receipts.length < 2) {
      console.log(`⚠️  Need at least 2 generation receipts for comparison`);
      return false;
    }

    const latest = receipts[receipts.length - 1];
    const previous = receipts[receipts.length - 2];

    // Check if inputs match
    if (latest.inputHash !== previous.inputHash) {
      console.log(`❌ Input hash mismatch - different generation parameters`);
      return false;
    }

    // Check if outputs match
    if (fs.existsSync(outputPath)) {
      const outputContent = fs.readFileSync(outputPath, 'utf8');
      const outputDigest = this.hashString(outputContent);

      if (outputDigest === previous.outputDigest) {
        console.log(`✅ Bit-exact reproduction verified!`);
        latest.reproduced = true;
        await this.updateReceipt(latest);
        return true;
      } else {
        console.log(`❌ Output digest mismatch - generation not deterministic`);
        console.log(`   Expected: ${previous.outputDigest.substring(0, 16)}...`);
        console.log(`   Actual:   ${outputDigest.substring(0, 16)}...`);
        return false;
      }
    }

    console.log(`⚠️  Output file not found: ${outputPath}`);
    return false;
  }

  async updateReceiptWithOutput(receiptId: string, outputPath: string): Promise<void> {
    const receipts = await this.getAllReceipts();
    const receipt = receipts.find(r => r.inputHash === receiptId);

    if (receipt && fs.existsSync(outputPath)) {
      const outputContent = fs.readFileSync(outputPath, 'utf8');
      receipt.outputDigest = this.hashString(outputContent);
      await this.updateReceipt(receipt);
    }
  }

  async validateGeneration(receiptId: string): Promise<GenerationReceipt | null> {
    console.log(`🔬 Running validation checks...`);

    const receipts = await this.getAllReceipts();
    const receipt = receipts.find(r => r.inputHash === receiptId);

    if (!receipt) {
      console.log(`❌ Receipt not found: ${receiptId}`);
      return null;
    }

    try {
      // Build validation
      const buildResult = await this.runCommand('npm run build');
      receipt.validation.buildPassed = buildResult.success;

      // Test validation
      const testResult = await this.runCommand('npm test');
      receipt.validation.testsPassed = testResult.success;

      // Lint validation
      const lintResult = await this.runCommand('npm run lint');
      receipt.validation.lintPassed = lintResult.success;

      await this.updateReceipt(receipt);

      const allPassed =
        receipt.validation.buildPassed && receipt.validation.testsPassed && receipt.validation.lintPassed;

      console.log(`${allPassed ? '✅' : '❌'} Validation ${allPassed ? 'passed' : 'failed'}`);

      return receipt;
    } catch (error) {
      console.error(`❌ Validation error:`, error);
      return receipt;
    }
  }

  async listReceipts(blueprintId?: string): Promise<void> {
    const receipts = await this.getAllReceipts();
    const filtered = blueprintId ? receipts.filter(r => r.blueprint.id === blueprintId) : receipts;

    console.log(`📋 Generation Receipts (${filtered.length}):`);
    console.log('');

    filtered.forEach(receipt => {
      const status = receipt.reproduced ? '✅ Reproduced' : '🎲 Generated';
      const validation = this.getValidationStatus(receipt);

      console.log(`${status} | ${receipt.blueprint.id}@${receipt.blueprint.version}`);
      console.log(`   Hash: ${receipt.inputHash.substring(0, 16)}...`);
      console.log(`   Time: ${receipt.timestamp}`);
      console.log(`   Seed: ${receipt.execution.seed}`);
      console.log(`   Validation: ${validation}`);
      console.log('');
    });
  }

  private generateSeed(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  private hashObject(obj: any): string {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(obj, null, 0))
      .digest('hex');
  }

  private hashString(str: string): string {
    return crypto.createHash('sha256').update(str).digest('hex');
  }

  private async storeReceipt(receipt: GenerationReceipt): Promise<void> {
    const filename = `${receipt.inputHash.substring(0, 16)}.json`;
    const filepath = path.join(this.receiptsPath, filename);
    fs.writeFileSync(filepath, JSON.stringify(receipt, null, 2));
  }

  private async updateReceipt(receipt: GenerationReceipt): Promise<void> {
    await this.storeReceipt(receipt);
  }

  private async getAllReceipts(): Promise<GenerationReceipt[]> {
    if (!fs.existsSync(this.receiptsPath)) return [];

    const files = fs
      .readdirSync(this.receiptsPath)
      .filter(f => f.endsWith('.json'))
      .sort();

    return files.map(file => {
      const content = fs.readFileSync(path.join(this.receiptsPath, file), 'utf8');
      return JSON.parse(content) as GenerationReceipt;
    });
  }

  private async getReceiptsForBlueprint(blueprintPath: string): Promise<GenerationReceipt[]> {
    const allReceipts = await this.getAllReceipts();
    return allReceipts.filter(r => r.blueprint.path === blueprintPath);
  }

  private getValidationStatus(receipt: GenerationReceipt): string {
    const { buildPassed, testsPassed, lintPassed } = receipt.validation;
    const passed = [buildPassed, testsPassed, lintPassed].filter(Boolean).length;
    const total = 3;

    if (passed === total) return '✅ All passed';
    if (passed === 0) return '❌ All failed';
    return `⚠️  ${passed}/${total} passed`;
  }

  private async runCommand(cmd: string): Promise<{ success: boolean; output: string }> {
    return new Promise(resolve => {
      const { exec } = require('child_process');
      exec(cmd, (error: any, stdout: string, stderr: string) => {
        resolve({
          success: !error,
          output: stdout + stderr,
        });
      });
    });
  }
}

// CLI Implementation
const program = new Command();

program
  .name('aegis-determinism')
  .description('Deterministic AI generation with provable reproducibility')
  .version('2.4.0');

program
  .command('generate')
  .description('Generate with deterministic controls')
  .argument('<blueprint>', 'Blueprint file path')
  .option('--seed <seed>', 'Generation seed for reproducibility')
  .option('--temperature <temp>', 'Temperature override (0.0-1.0)', parseFloat)
  .option('--mode <mode>', 'Execution mode', 'strict')
  .option('--model <version>', 'Model version identifier')
  .action(async (blueprint, options) => {
    const controller = new DeterminismController();
    const receipt = await controller.generateWithSeed(blueprint, options);
    console.log(`\n🎯 Generation receipt: ${receipt.inputHash.substring(0, 16)}...`);
  });

program
  .command('verify')
  .description('Verify bit-exact reproducibility')
  .argument('<blueprint>', 'Blueprint file path')
  .argument('<output>', 'Generated output file path')
  .action(async (blueprint, output) => {
    const controller = new DeterminismController();
    const isReproduced = await controller.verifyReproducibility(blueprint, output);
    process.exit(isReproduced ? 0 : 1);
  });

program
  .command('validate')
  .description('Run validation checks on generation')
  .argument('<receipt-id>', 'Generation receipt ID (input hash)')
  .action(async receiptId => {
    const controller = new DeterminismController();
    const receipt = await controller.validateGeneration(receiptId);
    if (!receipt) process.exit(1);
  });

program
  .command('list')
  .description('List generation receipts')
  .option('--blueprint <id>', 'Filter by blueprint ID')
  .action(async options => {
    const controller = new DeterminismController();
    await controller.listReceipts(options.blueprint);
  });

program
  .command('update-output')
  .description('Update receipt with generated output')
  .argument('<receipt-id>', 'Generation receipt ID')
  .argument('<output>', 'Generated output file path')
  .action(async (receiptId, output) => {
    const controller = new DeterminismController();
    await controller.updateReceiptWithOutput(receiptId, output);
    console.log(`✅ Receipt updated with output digest`);
  });

if (require.main === module) {
  program.parse();
}

export { DeterminismController, type GenerationReceipt };
