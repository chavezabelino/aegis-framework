#!/usr/bin/env node

/**
 * Aegis Setup - Zero to Value Project Setup
 *
 * Drop everything needed for immediate Aegis value:
 * - CI workflows, eval pack, policy pack, tracing config, PR template
 * - Status badge, npm package setup, governance structure
 *
 * @aegisFrameworkVersion: 2.5.0
 * @intent: Perfect zero-to-value developer experience
 * @context: One command to production-ready Aegis integration
 */

import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import yaml from 'js-yaml';
import { execSync } from 'child_process';

interface ProjectSetupConfig {
  projectName: string;
  projectType: 'frontend' | 'backend' | 'fullstack' | 'library';
  techStack: string[];
  observability: {
    jaeger: boolean;
    langfuse: boolean;
    console: boolean;
  };
  ci: {
    github: boolean;
    gitlab: boolean;
    other?: string;
  };
  features: {
    evaluations: boolean;
    determinism: boolean;
    policyEngine: boolean;
    statusBadge: boolean;
  };
}

class AegisProjectSetup {
  private projectRoot: string;
  private config: ProjectSetupConfig;
  private spinner: any;

  constructor(projectRoot: string, config: ProjectSetupConfig) {
    this.projectRoot = projectRoot;
    this.config = config;
    this.spinner = ora();
  }

  async setup(): Promise<void> {
    console.log(`🚀 Setting up Aegis Framework for ${this.config.projectName}...`);
    console.log(`📁 Project: ${this.projectRoot}`);
    console.log(`🛠️  Type: ${this.config.projectType}`);
    console.log(`⚡ Stack: ${this.config.techStack.join(', ')}`);
    console.log('');

    await this.createDirectoryStructure();
    await this.setupConfigFiles();
    await this.setupCIWorkflows();
    await this.setupEvaluations();
    await this.setupObservability();
    await this.setupPolicyEngine();
    await this.createStatusBadge();
    await this.updatePackageJson();
    await this.createReadmeUpdates();
    await this.finalizeSetup();

    console.log('\n✅ Aegis Framework setup complete!');
    this.printNextSteps();
  }

  private async createDirectoryStructure(): Promise<void> {
    this.spinner.start('📁 Creating directory structure...');

    const directories = [
      '.aegis',
      '.aegis/eval-results',
      '.aegis/baselines',
      '.aegis/generation-receipts',
      '.aegis/policies',
      'blueprints',
      'evals/golden-prompts',
      'evals/expected-artifacts',
      'evals/judges',
      'evals/baselines',
      'evals/configs',
    ];

    directories.forEach(dir => {
      const fullPath = path.join(this.projectRoot, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    });

    this.spinner.succeed('📁 Directory structure created');
  }

  private async setupConfigFiles(): Promise<void> {
    this.spinner.start('⚙️  Setting up configuration files...');

    // Aegis configuration
    const aegisConfig = {
      projectName: this.config.projectName,
      projectType: this.config.projectType,
      frameworkVersion: '2.4.0',
      setupDate: new Date().toISOString(),
      features: this.config.features,
      techStack: this.config.techStack,
    };

    fs.writeFileSync(path.join(this.projectRoot, '.aegis', 'config.json'), JSON.stringify(aegisConfig, null, 2));

    // Observability configuration
    const obsConfig = {
      jaeger: {
        enabled: this.config.observability.jaeger,
        endpoint: 'http://localhost:14268/api/traces',
      },
      langfuse: {
        enabled: this.config.observability.langfuse,
        endpoint: 'https://cloud.langfuse.com/api/public/ingestion',
      },
      console: {
        enabled: this.config.observability.console,
      },
    };

    fs.writeFileSync(path.join(this.projectRoot, '.aegis', 'observability.json'), JSON.stringify(obsConfig, null, 2));

    // Team configuration
    const teamConfig = {
      profile: 'balanced',
      enforcement: {
        blueprintValidation: true,
        constitutionalCompliance: true,
        evolutionStoryDetection: true,
      },
      features: {
        precommitHooks: true,
        annotations: {
          required: true,
          coverage: 0.8,
          enforcement: 'warning',
        },
      },
    };

    fs.writeFileSync(path.join(this.projectRoot, '.aegis', 'team-config.yaml'), yaml.dump(teamConfig));

    this.spinner.succeed('⚙️  Configuration files created');
  }

  private async setupCIWorkflows(): Promise<void> {
    if (!this.config.ci.github) {
      return;
    }

    this.spinner.start('🔄 Setting up CI workflows...');

    const workflowsDir = path.join(this.projectRoot, '.github', 'workflows');
    if (!fs.existsSync(workflowsDir)) {
      fs.mkdirSync(workflowsDir, { recursive: true });
    }

    // Copy Aegis evaluation workflow
    const evalWorkflow = `name: Aegis Framework Quality Check

on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]

jobs:
  aegis-quality:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
      
    - name: Build project
      run: npm run build
      
    - name: Run tests
      run: npm test
      
    - name: Run Aegis evaluations
      run: npx aegis-eval --ci --baseline main
      
    - name: Constitutional compliance check
      run: npx aegis-conductor check
      
    - name: Upload results
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: aegis-results
        path: .aegis/
`;

    fs.writeFileSync(path.join(workflowsDir, 'aegis-quality.yml'), evalWorkflow);

    // PR template
    const prTemplateDir = path.join(this.projectRoot, '.github');
    const prTemplate = `# 🏛️ Aegis Framework Compliance

## Change Summary
**What does this change do?**
<!-- Brief description -->

## Constitutional Compliance
- [ ] Follows blueprint-driven development
- [ ] Includes proper annotations
- [ ] Passes constitutional validation
- [ ] Maintains framework standards

## Quality Gates
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Aegis evaluations pass
- [ ] No constitutional violations

## Observability
- [ ] Emits appropriate telemetry
- [ ] Includes error states
- [ ] Has fallback mechanisms

*Auto-validated by Aegis Framework CI*
`;

    fs.writeFileSync(path.join(prTemplateDir, 'pull_request_template.md'), prTemplate);

    this.spinner.succeed('🔄 CI workflows configured');
  }

  private async setupEvaluations(): Promise<void> {
    if (!this.config.features.evaluations) return;

    this.spinner.start('🧪 Setting up evaluation framework...');

    // Create sample evaluation
    const sampleEval = {
      id: `eval-${this.config.projectName}-sample`,
      name: `${this.config.projectName} Sample Evaluation`,
      version: '1.0.0',
      aegisFrameworkVersion: '2.4.0',
      description: 'Sample evaluation for project setup validation',
      prompt: 'Generate a simple component following project patterns',
      expectedOutputs: [
        {
          type: 'component',
          files: ['components/Sample.tsx'],
          validationRules: [
            'contains proper TypeScript types',
            'includes Aegis annotations',
            'follows project structure',
          ],
        },
      ],
      qualityChecks: {
        codeQuality: ['proper TypeScript usage', 'consistent naming conventions', 'appropriate comments'],
        frameworkCompliance: ['includes @aegisBlueprint annotation', 'follows constitutional requirements'],
      },
      performance: {
        maxGenerationTime: 15000,
        maxTokens: 2048,
        expectedFiles: 1,
        expectedLines: 50,
      },
      judges: [
        {
          name: 'code-quality',
          prompt: 'judges/code-quality.md',
          weight: 0.6,
        },
        {
          name: 'framework-compliance',
          prompt: 'judges/framework-compliance.md',
          weight: 0.4,
        },
      ],
    };

    fs.writeFileSync(path.join(this.projectRoot, 'evals', 'golden-prompts', 'sample-eval.yaml'), yaml.dump(sampleEval));

    // Create judge prompts
    const codeQualityJudge = `# Code Quality Judge

Evaluate the generated code for quality and best practices.

## Criteria (1-10 scale)

### Code Structure (40%)
- Clear, logical organization
- Appropriate separation of concerns
- Consistent naming conventions

### TypeScript Usage (30%)
- Proper type annotations
- Effective use of interfaces/types
- Type safety

### Documentation (30%)
- Clear comments where needed
- Self-documenting code
- Proper annotations

Output JSON with scores and reasoning.
`;

    fs.writeFileSync(path.join(this.projectRoot, 'evals', 'judges', 'code-quality.md'), codeQualityJudge);

    this.spinner.succeed('🧪 Evaluation framework configured');
  }

  private async setupObservability(): Promise<void> {
    this.spinner.start('📊 Setting up observability...');

    // Create observability dashboard config
    const dashboardConfig = {
      name: `${this.config.projectName} Aegis Dashboard`,
      metrics: [
        'generation_success_rate',
        'validation_pass_rate',
        'constitutional_compliance_rate',
        'evaluation_scores',
      ],
      alerts: [
        {
          name: 'quality_degradation',
          condition: 'evaluation_score < 0.8',
          action: 'notify_team',
        },
      ],
    };

    fs.writeFileSync(path.join(this.projectRoot, '.aegis', 'dashboard.json'), JSON.stringify(dashboardConfig, null, 2));

    this.spinner.succeed('📊 Observability configured');
  }

  private async setupPolicyEngine(): Promise<void> {
    if (!this.config.features.policyEngine) return;

    this.spinner.start('🛡️  Setting up policy engine...');

    const policies = {
      codeQuality: {
        rules: [
          {
            id: 'no-console-log',
            description: 'Prevent console.log in production code',
            pattern: 'console\\.log\\(',
            enforcement: 'warning',
            excludePaths: ['**/test/**', '**/spec/**'],
          },
          {
            id: 'require-typescript',
            description: 'All new files must use TypeScript',
            pattern: '\\.js$',
            enforcement: 'error',
            excludePaths: ['**/legacy/**'],
          },
        ],
      },
      security: {
        rules: [
          {
            id: 'no-hardcoded-secrets',
            description: 'Prevent hardcoded API keys or secrets',
            pattern: '(api_key|secret_key|password)\\s*=\\s*["\']\\w+["\']',
            enforcement: 'error',
          },
        ],
      },
      framework: {
        rules: [
          {
            id: 'require-aegis-annotations',
            description: 'All AI-generated files must have Aegis annotations',
            pattern: '@aegisBlueprint',
            enforcement: 'warning',
            fileTypes: ['.ts', '.tsx', '.js', '.jsx'],
          },
        ],
      },
    };

    fs.writeFileSync(
      path.join(this.projectRoot, '.aegis', 'policies', 'policies.json'),
      JSON.stringify(policies, null, 2)
    );

    this.spinner.succeed('🛡️  Policy engine configured');
  }

  private async createStatusBadge(): Promise<void> {
    if (!this.config.features.statusBadge) return;

    this.spinner.start('🏷️  Creating status badge...');

    const badgeConfig = {
      enabled: true,
      endpoint: `https://aegis-status.dev/${this.config.projectName}`,
      style: 'flat-square',
      labels: {
        compliant: 'Aegis: Compliant',
        drift: 'Aegis: Drift Detected',
        error: 'Aegis: Error',
      },
    };

    fs.writeFileSync(path.join(this.projectRoot, '.aegis', 'badge-config.json'), JSON.stringify(badgeConfig, null, 2));

    this.spinner.succeed('🏷️  Status badge configured');
  }

  private async updatePackageJson(): Promise<void> {
    this.spinner.start('📦 Updating package.json...');

    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    let packageJson: any = {};

    if (fs.existsSync(packageJsonPath)) {
      packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    }

    // Add Aegis scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      'aegis:eval': 'aegis-eval',
      'aegis:check': 'aegis-conductor check',
      'aegis:determinism': 'aegis-determinism list',
      'aegis:setup': 'aegis-setup',
      'quality:check': 'npm run aegis:eval && npm run aegis:check',
    };

    // Add dependencies
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      '@aegis-framework/cli': '^2.4.0',
    };

    // Add Aegis configuration section
    packageJson.aegis = {
      version: '2.4.0',
      projectType: this.config.projectType,
      features: this.config.features,
      setupDate: new Date().toISOString(),
    };

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    this.spinner.succeed('📦 Package.json updated');
  }

  private async createReadmeUpdates(): Promise<void> {
    this.spinner.start('📝 Creating README updates...');

    const readmeAddition = `
## 🏛️ Aegis Framework Integration

This project uses the [Aegis Framework](https://github.com/chavezabelino/aegis-framework) for AI-governed development.

### Quality Status
![Aegis Status](https://aegis-status.dev/${this.config.projectName}/badge)

### Quick Commands
\`\`\`bash
# Run quality evaluations
npm run aegis:eval

# Check constitutional compliance
npm run aegis:check

# View generation history
npm run aegis:determinism

# Full quality check
npm run quality:check
\`\`\`

### Framework Features
- ✅ Blueprint-driven AI development
- ✅ Constitutional governance
- ✅ Deterministic generation
- ✅ Quality evaluations
- ✅ Observability & tracing
- ✅ Policy enforcement

### CI Integration
Every PR is automatically validated for:
- Code quality and security
- Constitutional compliance
- Framework standards adherence
- Regression prevention

*Powered by Aegis Framework v2.5.0*
`;

    fs.writeFileSync(path.join(this.projectRoot, '.aegis', 'README-addition.md'), readmeAddition);

    this.spinner.succeed('📝 README updates prepared');
  }

  private async finalizeSetup(): Promise<void> {
    this.spinner.start('✨ Finalizing setup...');

    // Create setup completion marker
    const setupInfo = {
      completed: true,
      timestamp: new Date().toISOString(),
      version: '2.4.0',
      config: this.config,
      nextSteps: [
        'Review .aegis/config.json',
        'Add Aegis section to README',
        'Configure observability endpoints',
        'Create first blueprint',
        'Run initial evaluation',
      ],
    };

    fs.writeFileSync(path.join(this.projectRoot, '.aegis', 'setup-complete.json'), JSON.stringify(setupInfo, null, 2));

    this.spinner.succeed('✨ Setup finalized');
  }

  private printNextSteps(): void {
    console.log('\n🎯 Next Steps:');
    console.log('');
    console.log('1. 📖 Add Aegis section to your README:');
    console.log('   cat .aegis/README-addition.md >> README.md');
    console.log('');
    console.log('2. 🔧 Install Aegis CLI:');
    console.log('   npm install -g @aegis-framework/cli');
    console.log('');
    console.log('3. 📊 Configure observability (optional):');
    console.log('   - Set LANGFUSE_API_KEY environment variable');
    console.log('   - Update .aegis/observability.json endpoints');
    console.log('');
    console.log('4. 🏗️  Create your first blueprint:');
    console.log('   aegis-blueprint create my-feature');
    console.log('');
    console.log('5. 🧪 Run initial evaluation:');
    console.log('   npm run aegis:eval');
    console.log('');
    console.log('6. 🚀 Commit and push to trigger CI:');
    console.log('   git add . && git commit -m "feat: Add Aegis Framework"');
    console.log('');
    console.log('📋 Documentation: https://aegis-framework.dev/docs');
    console.log('🏛️  Constitution: .aegis/config.json');
    console.log('📊 Dashboard: .aegis/dashboard.json');
  }
}

// CLI Implementation
const program = new Command();

program.name('aegis-setup').description('Zero-to-value Aegis Framework setup').version('2.4.0');

program
  .argument('<project-path>', 'Path to project directory')
  .option('--name <name>', 'Project name')
  .option('--type <type>', 'Project type', 'fullstack')
  .option('--interactive', 'Interactive setup', true)
  .option('--minimal', 'Minimal setup without optional features')
  .action(async (projectPath, options) => {
    const fullPath = path.resolve(projectPath);

    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Project path does not exist: ${fullPath}`);
      process.exit(1);
    }

    let config: ProjectSetupConfig;

    if (options.interactive) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'Project name:',
          default: options.name || path.basename(fullPath),
        },
        {
          type: 'list',
          name: 'projectType',
          message: 'Project type:',
          choices: ['frontend', 'backend', 'fullstack', 'library'],
          default: options.type,
        },
        {
          type: 'checkbox',
          name: 'techStack',
          message: 'Tech stack (select all that apply):',
          choices: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Express', 'FastAPI', 'Deno', 'Other'],
        },
        {
          type: 'confirm',
          name: 'evaluations',
          message: 'Enable evaluation framework?',
          default: true,
        },
        {
          type: 'confirm',
          name: 'observability',
          message: 'Enable observability (OpenTelemetry)?',
          default: true,
        },
        {
          type: 'confirm',
          name: 'langfuse',
          message: 'Enable Langfuse integration?',
          default: false,
        },
        {
          type: 'confirm',
          name: 'policyEngine',
          message: 'Enable policy engine?',
          default: !options.minimal,
        },
        {
          type: 'confirm',
          name: 'statusBadge',
          message: 'Create status badge?',
          default: !options.minimal,
        },
      ]);

      config = {
        projectName: answers.projectName,
        projectType: answers.projectType,
        techStack: answers.techStack,
        observability: {
          jaeger: answers.observability,
          langfuse: answers.langfuse,
          console: true,
        },
        ci: {
          github: true,
          gitlab: false,
        },
        features: {
          evaluations: answers.evaluations,
          determinism: true,
          policyEngine: answers.policyEngine,
          statusBadge: answers.statusBadge,
        },
      };
    } else {
      config = {
        projectName: options.name || path.basename(fullPath),
        projectType: options.type,
        techStack: ['TypeScript'],
        observability: {
          jaeger: false,
          langfuse: false,
          console: true,
        },
        ci: {
          github: true,
          gitlab: false,
        },
        features: {
          evaluations: !options.minimal,
          determinism: true,
          policyEngine: !options.minimal,
          statusBadge: !options.minimal,
        },
      };
    }

    const setup = new AegisProjectSetup(fullPath, config);
    await setup.setup();
  });

if (require.main === module) {
  program.parse();
}

export { AegisProjectSetup, type ProjectSetupConfig };
