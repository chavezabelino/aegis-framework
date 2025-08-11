#!/usr/bin/env node

/**
 * @aegisFrameworkVersion 2.4.0-alpha-dev
 * @intent Interactive CLI for team configuration management
 * @context Support team-specific feature configuration with constitutional compliance
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import inquirer from 'inquirer';
import {
  AegisFrameworkConfigSchema,
  ConfigurationProfiles,
  validateConstitutionalCompliance,
  getProfileTemplate,
  type AegisFrameworkConfig,
  type ConfigurationProfileType,
} from '../framework/contracts/team-configuration.schema.js';

class TeamConfigurationManager {
  private configPath: string;
  private workspaceRoot: string;

  constructor(workspaceRoot: string = process.cwd()) {
    this.workspaceRoot = workspaceRoot;
    this.configPath = path.join(workspaceRoot, '.framework', 'team-config.yaml');
  }

  /**
   * Interactive configuration setup
   */
  async setup(): Promise<void> {
    console.log('🎛️ Aegis Framework Team Configuration Setup\n');

    // Check if configuration already exists
    if (fs.existsSync(this.configPath)) {
      const proceed = await inquirer.prompt({
        type: 'confirm',
        name: 'overwrite',
        message: 'Configuration already exists. Overwrite?',
        default: false,
      });

      if (!proceed.overwrite) {
        console.log('Configuration setup cancelled.');
        return;
      }
    }

    // Gather team information
    const teamInfo = await this.gatherTeamInfo();

    // Choose configuration profile
    const profile = await this.chooseProfile();

    // Configure overrides if needed
    const overrides = await this.configureOverrides(profile, teamInfo);

    // Generate configuration
    const config = await this.generateConfiguration(teamInfo, profile, overrides);

    // Validate constitutional compliance
    const compliance = validateConstitutionalCompliance(config);

    if (!compliance.valid) {
      console.log('\n❌ Constitutional Compliance Issues:');
      compliance.violations.forEach(v => console.log(`   - ${v}`));

      const proceed = await inquirer.prompt({
        type: 'confirm',
        name: 'proceed',
        message: 'Proceed with constitutional violations?',
        default: false,
      });

      if (!proceed.proceed) {
        console.log('Configuration setup cancelled due to constitutional violations.');
        return;
      }
    }

    if (compliance.warnings.length > 0) {
      console.log('\n⚠️ Configuration Warnings:');
      compliance.warnings.forEach(w => console.log(`   - ${w}`));
    }

    // Save configuration
    await this.saveConfiguration(config);

    console.log('\n✅ Team configuration saved successfully!');
    console.log(`📄 Configuration: ${this.configPath}`);

    // Show next steps
    this.showNextSteps(config);
  }

  /**
   * Gather team identification information
   */
  private async gatherTeamInfo() {
    return await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Team name:',
        validate: (input: string) => input.length > 0 || 'Team name is required',
      },
      {
        type: 'input',
        name: 'email',
        message: 'Tech lead email:',
        validate: (input: string) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(input) || 'Valid email is required';
        },
      },
    ]);
  }

  /**
   * Choose configuration profile
   */
  private async chooseProfile(): Promise<ConfigurationProfileType> {
    console.log('\n📋 Configuration Profiles:');
    console.log('• Strict: Maximum constitutional compliance and feature enablement');
    console.log('• Balanced: Recommended default with core features enabled');
    console.log('• Minimal: Maximum flexibility with constitutional overrides\n');

    const { profile } = await inquirer.prompt({
      type: 'list',
      name: 'profile',
      message: 'Choose configuration profile:',
      choices: [
        { name: 'Balanced (Recommended)', value: 'balanced' },
        { name: 'Strict (Maximum Compliance)', value: 'strict' },
        { name: 'Minimal (Maximum Flexibility)', value: 'minimal' },
      ],
    });

    return profile as ConfigurationProfileType;
  }

  /**
   * Configure overrides based on profile choice
   */
  private async configureOverrides(profile: ConfigurationProfileType, teamInfo: any) {
    if (profile === 'minimal') {
      console.log('\n🏛️ Constitutional Override Required');
      console.log('Minimal profile disables required features. Constitutional acknowledgment needed.\n');

      const acknowledgment = await inquirer.prompt([
        {
          type: 'input',
          name: 'reason',
          message: 'Reason for constitutional override:',
          validate: (input: string) => input.length >= 10 || 'Reason must be at least 10 characters',
        },
        {
          type: 'confirm',
          name: 'acknowledge',
          message: 'I acknowledge this disables constitutional protections:',
          default: false,
        },
      ]);

      if (!acknowledgment.acknowledge) {
        throw new Error('Constitutional acknowledgment required for minimal profile');
      }

      // Calculate expiry (4 months from now)
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + 4);

      return {
        constitutionalAcknowledgment: new Date().toISOString().split('T')[0],
        reason: acknowledgment.reason,
        approvedBy: teamInfo.email,
        overrideExpiry: expiry.toISOString().split('T')[0],
      };
    }

    return undefined;
  }

  /**
   * Generate complete configuration
   */
  private async generateConfiguration(
    teamInfo: any,
    profile: ConfigurationProfileType,
    overrides?: any
  ): Promise<AegisFrameworkConfig> {
    const profileTemplate = getProfileTemplate(profile);

    const config: AegisFrameworkConfig = {
      team: {
        name: teamInfo.name,
        profile,
        constitutionalAcknowledgment: overrides?.constitutionalAcknowledgment,
      },
      core: {
        blueprintValidation: true,
        agentDriftPrevention: true,
        intentEnforcement: true,
        versionConsistency: true,
      },
      required: {
        evolutionStoryDetection: {
          enabled: profileTemplate.required.evolutionStoryDetection?.enabled ?? true,
          autoGenerate: (profileTemplate.required.evolutionStoryDetection as any)?.autoGenerate ?? false,
          triggerThreshold: 'medium',
        },
        constitutionalEnforcement: {
          mode: profileTemplate.required.constitutionalEnforcement?.mode ?? 'guided',
          blocking: profileTemplate.required.constitutionalEnforcement?.blocking ?? true,
          autoCorrection: true,
        },
        precommitHooks: {
          enabled: profileTemplate.required.precommitHooks?.enabled ?? true,
          evolutionDetection: true,
          constitutionalValidation: true,
        },
        annotations: {
          required: profileTemplate.required.annotations?.required ?? true,
          coverage: 0.8,
          enforcement: (profileTemplate.required.annotations as any)?.enforcement ?? 'warning',
        },
        templateQuality: {
          validation: true,
          encodingChecks: true,
        },
      },
      optional: {
        realtimePatternDetection: {
          enabled: profileTemplate.optional.realtimePatternDetection?.enabled ?? false,
          sensitivity: 'medium',
        },
        autoGeneratedEvolutionStories: {
          enabled: profileTemplate.optional.autoGeneratedEvolutionStories?.enabled ?? false,
          severity: 'critical',
        },
        driftMonitoringDashboard: {
          enabled: profileTemplate.optional.driftMonitoringDashboard?.enabled ?? false,
          updateInterval: 'daily',
        },
        automatedChangelog: {
          enabled: false,
          format: 'constitutional',
        },
        predictiveEnforcement: {
          enabled: false,
          confidence: 0.8,
          learning: true,
        },
      },
      overrides,
    };

    return config;
  }

  /**
   * Save configuration to file
   */
  private async saveConfiguration(config: AegisFrameworkConfig): Promise<void> {
    // Ensure .framework directory exists
    const frameworkDir = path.dirname(this.configPath);
    if (!fs.existsSync(frameworkDir)) {
      fs.mkdirSync(frameworkDir, { recursive: true });
    }

    // Convert to YAML and save
    const yamlContent = yaml.dump(config, {
      indent: 2,
      quotingType: '"',
      forceQuotes: false,
    });

    const header = `# Aegis Framework Team Configuration
# Generated: ${new Date().toISOString()}
# Framework Version: 2.0.0-alpha-dev

`;

    fs.writeFileSync(this.configPath, header + yamlContent);
  }

  /**
   * Show next steps after configuration
   */
  private showNextSteps(config: AegisFrameworkConfig): void {
    console.log('\n📋 Next Steps:');

    if (config.team.profile === 'minimal') {
      console.log('1. ⚠️  Review constitutional override expiry date');
      console.log('2. 📅 Schedule review before override expires');
      console.log('3. 🔍 Monitor for constitutional violations');
    }

    console.log('4. 🚀 Run framework tools with new configuration');
    console.log('5. 📊 Monitor team workflow with new settings');
    console.log('6. 🔄 Adjust configuration as needed\n');

    console.log('📖 Commands:');
    console.log('• View config: cat .framework/team-config.yaml');
    console.log('• Validate: node cli/validate-team-config.ts');
    console.log('• Update: node cli/team-config.ts');
  }

  /**
   * Load existing configuration
   */
  loadConfiguration(): AegisFrameworkConfig | null {
    if (!fs.existsSync(this.configPath)) {
      return null;
    }

    try {
      const content = fs.readFileSync(this.configPath, 'utf8');
      const data = yaml.load(content);
      return AegisFrameworkConfigSchema.parse(data);
    } catch (error) {
      console.error('Error loading configuration:', error);
      return null;
    }
  }

  /**
   * Validate existing configuration
   */
  async validate(): Promise<void> {
    const config = this.loadConfiguration();

    if (!config) {
      console.log('❌ No configuration found. Run setup first.');
      return;
    }

    const compliance = validateConstitutionalCompliance(config);

    console.log('🔍 Configuration Validation Results\n');

    if (compliance.valid) {
      console.log('✅ Configuration is constitutionally compliant');
    } else {
      console.log('❌ Constitutional compliance violations:');
      compliance.violations.forEach(v => console.log(`   - ${v}`));
    }

    if (compliance.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      compliance.warnings.forEach(w => console.log(`   - ${w}`));
    }

    // Check override expiry
    if (config.overrides?.overrideExpiry) {
      const expiry = new Date(config.overrides.overrideExpiry);
      const now = new Date();
      const daysRemaining = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (daysRemaining <= 30) {
        console.log(`\n⏰ Override expires in ${daysRemaining} days. Consider renewal.`);
      }
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'setup';

  const manager = new TeamConfigurationManager();

  try {
    switch (command) {
      case 'setup':
        await manager.setup();
        break;
      case 'validate':
        await manager.validate();
        break;
      case 'view':
        const config = manager.loadConfiguration();
        if (config) {
          console.log(yaml.dump(config, { indent: 2 }));
        } else {
          console.log('No configuration found.');
        }
        break;
      default:
        console.log('Usage: node team-config.ts [setup|validate|view]');
        console.log('  setup    - Interactive configuration setup');
        console.log('  validate - Validate existing configuration');
        console.log('  view     - Display current configuration');
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run CLI if called directly
if (process.argv[1] && process.argv[1].endsWith('team-config.ts')) {
  main();
}

export { TeamConfigurationManager };
