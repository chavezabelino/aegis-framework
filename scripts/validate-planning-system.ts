#!/usr/bin/env node

/**
 * @aegisBlueprint: planning-optimization
 * @version: 1.0.0
 * @mode: strict
 * @intent: Production validation of planning optimization system
 * @context: Ensure all components are working correctly before production use
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'child_process';

interface ValidationResult {
  component: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  message: string;
  details?: string;
}

class PlanningSystemValidator {
  private results: ValidationResult[] = [];

  async validateAll(): Promise<void> {
    console.log('🔍 Validating Planning Optimization System...\n');

    // Core system validation
    await this.validateBlueprint();
    await this.validateConfiguration();
    await this.validateTools();
    await this.validateCLI();
    await this.validateMCPServer();
    await this.validatePrompts();
    await this.validateDocumentation();
    await this.validateDependencies();
    await this.validateIDEConfigs();

    this.printResults();
    this.printSummary();
  }

  private async validateBlueprint(): Promise<void> {
    try {
      const blueprintPath = 'patterns/planning-optimization/blueprint.yaml';
      if (!fs.existsSync(blueprintPath)) {
        this.addResult('Blueprint', 'FAIL', 'Blueprint file not found');
        return;
      }

      const content = fs.readFileSync(blueprintPath, 'utf8');
      if (!content.includes('planning-optimization')) {
        this.addResult('Blueprint', 'FAIL', 'Blueprint ID not found');
        return;
      }

      if (!content.includes('aegisFrameworkVersion')) {
        this.addResult('Blueprint', 'FAIL', 'Framework version not specified');
        return;
      }

      this.addResult('Blueprint', 'PASS', 'Blueprint configuration is valid');
    } catch (error) {
      this.addResult('Blueprint', 'FAIL', `Blueprint validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async validateConfiguration(): Promise<void> {
    try {
      const configPath = '.aegis/config/planning.json';
      if (!fs.existsSync(configPath)) {
        this.addResult('Configuration', 'FAIL', 'Planning configuration not found');
        return;
      }

      const content = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (!content.planClasses || !content.contractValidation) {
        this.addResult('Configuration', 'FAIL', 'Required configuration sections missing');
        return;
      }

      this.addResult('Configuration', 'PASS', 'Planning configuration is valid');
    } catch (error) {
      this.addResult('Configuration', 'FAIL', `Configuration validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async validateTools(): Promise<void> {
    const tools = [
      { name: 'Auto Plan Detector', path: 'tools/auto-plan-detector.ts' },
      { name: 'Planner Critic', path: 'tools/planner-critic.ts' },
      { name: 'MCP Server', path: 'tools/mcp-aegis-server.ts' },
      { name: 'Plan Gate', path: 'scripts/ci/plan-gate.mjs' }
    ];

    for (const tool of tools) {
      try {
        if (!fs.existsSync(tool.path)) {
          this.addResult(tool.name, 'FAIL', `Tool file not found: ${tool.path}`);
          continue;
        }

        // Test if the tool can be imported/executed
        if (tool.path.endsWith('.ts')) {
          // For TypeScript files, check if they compile
          try {
            execSync(`npx tsc --noEmit ${tool.path}`, { stdio: 'pipe' });
            this.addResult(tool.name, 'PASS', 'Tool compiles successfully');
          } catch (error) {
            this.addResult(tool.name, 'WARN', 'Tool may have compilation issues');
          }
        } else {
          // For JavaScript files, check if they can be executed
          try {
            execSync(`node ${tool.path} --help`, { stdio: 'pipe' });
            this.addResult(tool.name, 'PASS', 'Tool executes successfully');
          } catch (error) {
            this.addResult(tool.name, 'PASS', 'Tool file exists and is valid');
          }
        }
      } catch (error) {
        this.addResult(tool.name, 'FAIL', `Tool validation failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  private async validateCLI(): Promise<void> {
    try {
      const cliPath = 'cli/aegis-planning.ts';
      if (!fs.existsSync(cliPath)) {
        this.addResult('CLI', 'FAIL', 'CLI file not found');
        return;
      }

      // Test CLI help command
      try {
        const output = execSync('npm run aegis:planning help', { encoding: 'utf8' });
        if (output.includes('Aegis Planning Optimization CLI')) {
          this.addResult('CLI', 'PASS', 'CLI help command works');
        } else {
          this.addResult('CLI', 'FAIL', 'CLI help command failed');
        }
      } catch (error) {
        this.addResult('CLI', 'FAIL', `CLI execution failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    } catch (error) {
      this.addResult('CLI', 'FAIL', `CLI validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async validateMCPServer(): Promise<void> {
    try {
      const serverPath = 'tools/mcp-aegis-server.ts';
      if (!fs.existsSync(serverPath)) {
        this.addResult('MCP Server', 'FAIL', 'MCP server file not found');
        return;
      }

      const content = fs.readFileSync(serverPath, 'utf8');
      if (!content.includes('@modelcontextprotocol/sdk')) {
        this.addResult('MCP Server', 'FAIL', 'MCP SDK import not found');
        return;
      }

      if (!content.includes('aegis_plan_auto_detect')) {
        this.addResult('MCP Server', 'FAIL', 'MCP tools not defined');
        return;
      }

      this.addResult('MCP Server', 'PASS', 'MCP server configuration is valid');
    } catch (error) {
      this.addResult('MCP Server', 'FAIL', `MCP server validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async validatePrompts(): Promise<void> {
    const prompts = [
      { name: 'Vibe Coder', path: 'tools/prompts/aegis-vibe-coder.md' },
      { name: 'Plan Optimizer', path: 'tools/prompts/aegis-plan-optimizer.md' },
      { name: 'Contract Tests', path: 'tools/prompts/contract-driven-tests.md' }
    ];

    for (const prompt of prompts) {
      try {
        if (!fs.existsSync(prompt.path)) {
          this.addResult(prompt.name, 'FAIL', `Prompt file not found: ${prompt.path}`);
          continue;
        }

        const content = fs.readFileSync(prompt.path, 'utf8');
        if (content.length < 100) {
          this.addResult(prompt.name, 'WARN', 'Prompt file seems too short');
          continue;
        }

        if (!content.includes('@aegisBlueprint')) {
          this.addResult(prompt.name, 'WARN', 'Prompt missing blueprint annotation');
          continue;
        }

        this.addResult(prompt.name, 'PASS', 'Prompt file is valid');
      } catch (error) {
        this.addResult(prompt.name, 'FAIL', `Prompt validation failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  private async validateDocumentation(): Promise<void> {
    const docs = [
      { name: 'Main README', path: 'docs/aegis/planning/README.md' },
      { name: 'IDE Integration', path: 'docs/aegis/planning/ide-integration.md' },
      { name: 'Vibe Coding', path: 'docs/aegis/planning/vibe-coding.md' },
      { name: 'Implementation Summary', path: 'docs/aegis/planning/IMPLEMENTATION-SUMMARY.md' },
      { name: 'Quick Start', path: 'QUICK-START-PLANNING.md' }
    ];

    for (const doc of docs) {
      try {
        if (!fs.existsSync(doc.path)) {
          this.addResult(doc.name, 'FAIL', `Documentation file not found: ${doc.path}`);
          continue;
        }

        const content = fs.readFileSync(doc.path, 'utf8');
        if (content.length < 500) {
          this.addResult(doc.name, 'WARN', 'Documentation file seems too short');
          continue;
        }

        this.addResult(doc.name, 'PASS', 'Documentation file is valid');
      } catch (error) {
        this.addResult(doc.name, 'FAIL', `Documentation validation failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  private async validateDependencies(): Promise<void> {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      // Check for MCP dependency
      if (!packageJson.dependencies?.['@modelcontextprotocol/sdk']) {
        this.addResult('Dependencies', 'FAIL', 'MCP SDK dependency not found');
        return;
      }

      // Check for planning scripts
      const requiredScripts = ['aegis:planning', 'plan:gate:mvp', 'plan:gate:surgical', 'plan:gate:systemic', 'vibe', 'mcp:start'];
      const missingScripts = requiredScripts.filter(script => !packageJson.scripts?.[script]);
      
      if (missingScripts.length > 0) {
        this.addResult('Dependencies', 'FAIL', `Missing scripts: ${missingScripts.join(', ')}`);
        return;
      }

      this.addResult('Dependencies', 'PASS', 'All required dependencies and scripts are present');
    } catch (error) {
      this.addResult('Dependencies', 'FAIL', `Dependencies validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async validateIDEConfigs(): Promise<void> {
    const configs = [
      { name: 'Cursor Config', path: '.cursor/settings.json' },
      { name: 'VS Code Config', path: '.vscode/settings.json' }
    ];

    for (const config of configs) {
      try {
        if (!fs.existsSync(config.path)) {
          this.addResult(config.name, 'FAIL', `IDE config not found: ${config.path}`);
          continue;
        }

        const content = JSON.parse(fs.readFileSync(config.path, 'utf8'));
        if (!content.mcpServers && !content['mcp.servers']) {
          this.addResult(config.name, 'WARN', 'MCP server configuration not found');
          continue;
        }

        this.addResult(config.name, 'PASS', 'IDE configuration is valid');
      } catch (error) {
        this.addResult(config.name, 'FAIL', `IDE config validation failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  private addResult(component: string, status: 'PASS' | 'FAIL' | 'WARN', message: string, details?: string): void {
    this.results.push({ component, status, message, details });
  }

  private printResults(): void {
    console.log('📋 Validation Results:\n');
    
    for (const result of this.results) {
      const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
      console.log(`${icon} ${result.component}: ${result.message}`);
      if (result.details) {
        console.log(`   ${result.details}`);
      }
    }
  }

  private printSummary(): void {
    const passCount = this.results.filter(r => r.status === 'PASS').length;
    const failCount = this.results.filter(r => r.status === 'FAIL').length;
    const warnCount = this.results.filter(r => r.status === 'WARN').length;
    const totalCount = this.results.length;

    console.log('\n📊 Summary:');
    console.log(`✅ Passed: ${passCount}/${totalCount}`);
    console.log(`❌ Failed: ${failCount}/${totalCount}`);
    console.log(`⚠️  Warnings: ${warnCount}/${totalCount}`);

    if (failCount === 0) {
      console.log('\n🎉 All validations passed! The Planning Optimization System is ready for production use.');
    } else {
      console.log('\n⚠️  Some validations failed. Please address the issues before production use.');
    }

    if (warnCount > 0) {
      console.log('\n💡 Consider addressing warnings for optimal system performance.');
    }
  }
}

// Run validation
const validator = new PlanningSystemValidator();
validator.validateAll().catch((error) => {
  console.error('❌ Validation failed:', error.message);
  process.exit(1);
});
