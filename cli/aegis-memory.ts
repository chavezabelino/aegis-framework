#!/usr/bin/env node
/**
 * @aegisBlueprint: memory-governance-cli
 * @version: 1.0.0
 * @mode: strict
 * @intent: CLI tool for constitutional memory governance operations
 * @context: Memory subsystem management with constitutional compliance
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';

// ============================================================================
// CONSTITUTIONAL MEMORY CLI
// ============================================================================

const program = new Command();

program.name('aegis-memory').description('Constitutional memory governance for Aegis Framework').version('1.0.0');

// ============================================================================
// INITIALIZATION COMMANDS
// ============================================================================

program
  .command('init')
  .description('Initialize memory subsystem with constitutional compliance')
  .option('-p, --path <path>', 'Project path to initialize memory in', process.cwd())
  .option('-f, --force', 'Force initialization even if memory already exists')
  .action(async options => {
    const spinner = ora('Initializing constitutional memory subsystem...').start();

    try {
      const projectPath = path.resolve(options.path);

      // Check if memory already exists
      const memoryPath = path.join(projectPath, '.framework', 'memory');
      if (fs.existsSync(memoryPath) && !options.force) {
        spinner.fail('Memory subsystem already exists. Use --force to reinitialize.');
        return;
      }

      // Create memory directory structure
      const directories = [
        '.framework/memory',
        '.framework/memory/schemas',
        '.framework/memory/snapshots',
        '.framework/memory/commits',
        '.framework/memory/observability',
      ];

      for (const dir of directories) {
        const fullPath = path.join(projectPath, dir);
        if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath, { recursive: true });
        }
      }

      // Initialize constitutional memory state
      const memoryState = {
        version: '2.4.0',
        initialized: new Date().toISOString(),
        blueprintId: 'memory-governance',
        schemaVersion: '1.0.0',
        liteMemory: {
          tokenLimit: 2000,
          messageCount: 0,
          lastActivity: new Date().toISOString(),
        },
        heavyMemory: {
          snapshotCount: 0,
          commitCount: 0,
          lastCommit: null,
          storageQuota: {
            used: 0,
            limit: 1000000, // 1MB default
          },
        },
        constitutionalCompliance: {
          lastAudit: new Date().toISOString(),
          complianceScore: 100,
          violations: [],
        },
      };

      fs.writeFileSync(
        path.join(projectPath, '.framework', 'memory', 'memory-state.json'),
        JSON.stringify(memoryState, null, 2)
      );

      // Create default memory schemas
      const defaultSchemas = [
        {
          id: 'memory-privacy',
          version: '1.0.0',
          description: 'Constitutional memory privacy controls',
          schema: {
            type: 'object',
            properties: {
              accessLevel: { type: 'string', enum: ['public', 'private', 'restricted'] },
              retentionPeriod: { type: 'number', minimum: 0 },
              encryptionRequired: { type: 'boolean' },
            },
            required: ['accessLevel', 'retentionPeriod'],
          },
        },
        {
          id: 'memory-traceability',
          version: '1.0.0',
          description: 'Memory operation traceability requirements',
          schema: {
            type: 'object',
            properties: {
              operationId: { type: 'string' },
              timestamp: { type: 'string', format: 'date-time' },
              blueprintId: { type: 'string' },
              userId: { type: 'string' },
            },
            required: ['operationId', 'timestamp', 'blueprintId'],
          },
        },
      ];

      for (const schema of defaultSchemas) {
        fs.writeFileSync(
          path.join(projectPath, '.framework', 'memory', 'schemas', `${schema.id}.json`),
          JSON.stringify(schema, null, 2)
        );
      }

      spinner.succeed('Constitutional memory subsystem initialized successfully');
      console.log(chalk.green('✓ Memory governance ready for use'));
      console.log(chalk.blue('📁 Memory directory: .framework/memory/'));
      console.log(chalk.blue('📋 Default schemas: .framework/memory/schemas/'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      spinner.fail(`Failed to initialize memory subsystem: ${errorMessage}`);
      process.exit(1);
    }
  });

// ============================================================================
// LITE MEMORY COMMANDS
// ============================================================================

program
  .command('lite')
  .description('Lite memory operations (transient contextual layer)')
  .addCommand(
    new Command('append')
      .description('Append message to lite memory')
      .argument('<content>', 'Message content')
      .option('-r, --role <role>', 'Message role', 'user')
      .option('-t, --tags <tags>', 'Comma-separated tags')
      .option('-p, --path <path>', 'Project path', process.cwd())
      .action(async (content, options) => {
        const spinner = ora('Appending message to lite memory...').start();

        try {
          const projectPath = path.resolve(options.path);
          const memoryStatePath = path.join(projectPath, '.framework', 'memory', 'memory-state.json');

          if (!fs.existsSync(memoryStatePath)) {
            spinner.fail('Memory subsystem not initialized. Run "aegis-memory init" first.');
            return;
          }

          const memoryState = JSON.parse(fs.readFileSync(memoryStatePath, 'utf8'));

          const message = {
            id: crypto.randomUUID(),
            role: options.role,
            content,
            timestamp: new Date().toISOString(),
            tags: options.tags ? options.tags.split(',') : [],
            blueprintId: 'memory-governance',
            schemaVersion: '1.0.0',
          };

          // Update memory state
          memoryState.liteMemory.messageCount++;
          memoryState.liteMemory.lastActivity = new Date().toISOString();

          fs.writeFileSync(memoryStatePath, JSON.stringify(memoryState, null, 2));

          // Log message
          const messageLog = path.join(projectPath, '.framework', 'memory', 'lite-messages.jsonl');
          fs.appendFileSync(messageLog, JSON.stringify(message) + '\n');

          spinner.succeed(`Message appended to lite memory (ID: ${message.id})`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          spinner.fail(`Failed to append message: ${errorMessage}`);
        }
      })
  )
  .addCommand(
    new Command('context')
      .description('Generate context from lite memory')
      .option('-p, --path <path>', 'Project path', process.cwd())
      .option('-l, --limit <limit>', 'Maximum messages to include', '10')
      .action(async options => {
        const spinner = ora('Generating context from lite memory...').start();

        try {
          const projectPath = path.resolve(options.path);
          const messageLog = path.join(projectPath, '.framework', 'memory', 'lite-messages.jsonl');

          if (!fs.existsSync(messageLog)) {
            spinner.fail('No lite memory messages found.');
            return;
          }

          const messages = fs
            .readFileSync(messageLog, 'utf8')
            .trim()
            .split('\n')
            .map(line => JSON.parse(line))
            .slice(-parseInt(options.limit));

          const context = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');

          spinner.succeed('Context generated successfully');
          console.log(chalk.blue('\n📝 Generated Context:'));
          console.log(chalk.gray('─'.repeat(50)));
          console.log(context);
          console.log(chalk.gray('─'.repeat(50)));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          spinner.fail(`Failed to generate context: ${errorMessage}`);
        }
      })
  )
  .addCommand(
    new Command('summarize')
      .description('Summarize lite memory to snapshot')
      .option('-p, --path <path>', 'Project path', process.cwd())
      .action(async options => {
        const spinner = ora('Summarizing lite memory...').start();

        try {
          const projectPath = path.resolve(options.path);
          const messageLog = path.join(projectPath, '.framework', 'memory', 'lite-messages.jsonl');

          if (!fs.existsSync(messageLog)) {
            spinner.fail('No lite memory messages to summarize.');
            return;
          }

          const messages = fs
            .readFileSync(messageLog, 'utf8')
            .trim()
            .split('\n')
            .map(line => JSON.parse(line));

          const snapshot = {
            id: crypto.randomUUID(),
            type: 'lite_summary',
            created: new Date().toISOString(),
            createdBy: 'system',
            schema: 'memory-summary@v1.0.0',
            content: {
              messageCount: messages.length,
              summary: `Summarized ${messages.length} lite memory messages`,
              lastMessage: messages[messages.length - 1]?.timestamp,
            },
            blueprintId: 'memory-governance',
            schemaVersion: '1.0.0',
          };

          // Save snapshot
          const snapshotPath = path.join(projectPath, '.framework', 'memory', 'snapshots', `${snapshot.id}.json`);
          fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2));

          // Update memory state
          const memoryStatePath = path.join(projectPath, '.framework', 'memory', 'memory-state.json');
          const memoryState = JSON.parse(fs.readFileSync(memoryStatePath, 'utf8'));
          memoryState.heavyMemory.snapshotCount++;
          fs.writeFileSync(memoryStatePath, JSON.stringify(memoryState, null, 2));

          spinner.succeed(`Lite memory summarized to snapshot (ID: ${snapshot.id})`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          spinner.fail(`Failed to summarize lite memory: ${errorMessage}`);
        }
      })
  );

// ============================================================================
// HEAVY MEMORY COMMANDS
// ============================================================================

program
  .command('heavy')
  .description('Heavy memory operations (persistent reflective layer)')
  .addCommand(
    new Command('commit')
      .description('Commit memory snapshot to heavy storage')
      .argument('<snapshot-id>', 'Snapshot ID to commit')
      .option('-p, --path <path>', 'Project path', process.cwd())
      .option('-m, --message <message>', 'Commit message')
      .action(async (snapshotId, options) => {
        const spinner = ora('Committing memory snapshot...').start();

        try {
          const projectPath = path.resolve(options.path);
          const snapshotPath = path.join(projectPath, '.framework', 'memory', 'snapshots', `${snapshotId}.json`);

          if (!fs.existsSync(snapshotPath)) {
            spinner.fail(`Snapshot not found: ${snapshotId}`);
            return;
          }

          const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));

          const commit = {
            id: crypto.randomUUID(),
            snapshotId,
            timestamp: new Date().toISOString(),
            author: process.env.USER || 'system',
            message: options.message || `Commit snapshot ${snapshotId}`,
            blueprintId: 'memory-governance',
            schemaVersion: '1.0.0',
          };

          // Save commit
          const commitPath = path.join(projectPath, '.framework', 'memory', 'commits', `${commit.id}.json`);
          fs.writeFileSync(commitPath, JSON.stringify(commit, null, 2));

          // Update memory state
          const memoryStatePath = path.join(projectPath, '.framework', 'memory', 'memory-state.json');
          const memoryState = JSON.parse(fs.readFileSync(memoryStatePath, 'utf8'));
          memoryState.heavyMemory.commitCount++;
          memoryState.heavyMemory.lastCommit = commit.id;
          fs.writeFileSync(memoryStatePath, JSON.stringify(memoryState, null, 2));

          spinner.succeed(`Memory snapshot committed (Commit ID: ${commit.id})`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          spinner.fail(`Failed to commit snapshot: ${errorMessage}`);
        }
      })
  )
  .addCommand(
    new Command('list')
      .description('List memory snapshots and commits')
      .option('-p, --path <path>', 'Project path', process.cwd())
      .option('-t, --type <type>', 'Filter by type (snapshots|commits)', 'all')
      .action(async options => {
        const spinner = ora('Listing memory items...').start();

        try {
          const projectPath = path.resolve(options.path);

          if (options.type === 'snapshots' || options.type === 'all') {
            const snapshotsDir = path.join(projectPath, '.framework', 'memory', 'snapshots');
            if (fs.existsSync(snapshotsDir)) {
              const snapshots = fs
                .readdirSync(snapshotsDir)
                .filter(file => file.endsWith('.json'))
                .map(file => {
                  const content = JSON.parse(fs.readFileSync(path.join(snapshotsDir, file), 'utf8'));
                  return {
                    id: content.id,
                    type: content.type,
                    created: content.created,
                    createdBy: content.createdBy,
                  };
                });

              console.log(chalk.blue('\n📸 Snapshots:'));
              snapshots.forEach(s => {
                console.log(chalk.gray(`  ${s.id} (${s.type}) - ${s.created} by ${s.createdBy}`));
              });
            }
          }

          if (options.type === 'commits' || options.type === 'all') {
            const commitsDir = path.join(projectPath, '.framework', 'memory', 'commits');
            if (fs.existsSync(commitsDir)) {
              const commits = fs
                .readdirSync(commitsDir)
                .filter(file => file.endsWith('.json'))
                .map(file => {
                  const content = JSON.parse(fs.readFileSync(path.join(commitsDir, file), 'utf8'));
                  return {
                    id: content.id,
                    snapshotId: content.snapshotId,
                    timestamp: content.timestamp,
                    author: content.author,
                    message: content.message,
                  };
                });

              console.log(chalk.blue('\n💾 Commits:'));
              commits.forEach(c => {
                console.log(chalk.gray(`  ${c.id} -> ${c.snapshotId} - ${c.message} (${c.author})`));
              });
            }
          }

          spinner.succeed('Memory items listed successfully');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          spinner.fail(`Failed to list memory items: ${errorMessage}`);
        }
      })
  );

// ============================================================================
// AUDIT COMMANDS
// ============================================================================

program
  .command('audit')
  .description('Constitutional memory compliance audit')
  .option('-p, --path <path>', 'Project path', process.cwd())
  .option('-f, --fix', 'Automatically fix compliance issues')
  .action(async options => {
    const spinner = ora('Auditing constitutional memory compliance...').start();

    try {
      const projectPath = path.resolve(options.path);
      const memoryStatePath = path.join(projectPath, '.framework', 'memory', 'memory-state.json');

      if (!fs.existsSync(memoryStatePath)) {
        spinner.fail('Memory subsystem not initialized. Run "aegis-memory init" first.');
        return;
      }

      const memoryState = JSON.parse(fs.readFileSync(memoryStatePath, 'utf8'));
      const issues = [];
      let complianceScore = 100;

      // Check constitutional compliance
      if (!memoryState.blueprintId) {
        issues.push('Missing blueprint ID');
        complianceScore -= 20;
      }

      if (!memoryState.schemaVersion) {
        issues.push('Missing schema version');
        complianceScore -= 20;
      }

      if (!memoryState.constitutionalCompliance) {
        issues.push('Missing constitutional compliance tracking');
        complianceScore -= 30;
      }

      // Check memory state integrity
      if (!memoryState.liteMemory) {
        issues.push('Missing lite memory configuration');
        complianceScore -= 15;
      }

      if (!memoryState.heavyMemory) {
        issues.push('Missing heavy memory configuration');
        complianceScore -= 15;
      }

      // Update compliance score
      memoryState.constitutionalCompliance.complianceScore = Math.max(0, complianceScore);
      memoryState.constitutionalCompliance.lastAudit = new Date().toISOString();
      memoryState.constitutionalCompliance.violations = issues;

      fs.writeFileSync(memoryStatePath, JSON.stringify(memoryState, null, 2));

      if (issues.length === 0) {
        spinner.succeed('Constitutional memory compliance audit passed');
        console.log(chalk.green(`✓ Compliance Score: ${complianceScore}/100`));
      } else {
        spinner.warn('Constitutional memory compliance audit found issues');
        console.log(chalk.yellow(`⚠ Compliance Score: ${complianceScore}/100`));
        console.log(chalk.red('\nIssues found:'));
        issues.forEach(issue => console.log(chalk.red(`  • ${issue}`)));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      spinner.fail(`Audit failed: ${errorMessage}`);
    }
  });

// ============================================================================
// STATUS COMMAND
// ============================================================================

program
  .command('status')
  .description('Show memory subsystem status')
  .option('-p, --path <path>', 'Project path', process.cwd())
  .action(async options => {
    const projectPath = path.resolve(options.path);
    const memoryStatePath = path.join(projectPath, '.framework', 'memory', 'memory-state.json');

    if (!fs.existsSync(memoryStatePath)) {
      console.log(chalk.red('❌ Memory subsystem not initialized'));
      console.log(chalk.blue('Run "aegis-memory init" to initialize'));
      return;
    }

    const memoryState = JSON.parse(fs.readFileSync(memoryStatePath, 'utf8'));

    console.log(chalk.blue('\n🧠 Aegis Memory Subsystem Status'));
    console.log(chalk.gray('─'.repeat(50)));

    console.log(chalk.white(`Version: ${memoryState.version}`));
    console.log(chalk.white(`Blueprint: ${memoryState.blueprintId}`));
    console.log(chalk.white(`Schema: ${memoryState.schemaVersion}`));
    console.log(chalk.white(`Initialized: ${memoryState.initialized}`));

    console.log(chalk.blue('\n📝 Lite Memory:'));
    console.log(chalk.gray(`  Messages: ${memoryState.liteMemory.messageCount}`));
    console.log(chalk.gray(`  Token Limit: ${memoryState.liteMemory.tokenLimit}`));
    console.log(chalk.gray(`  Last Activity: ${memoryState.liteMemory.lastActivity}`));

    console.log(chalk.blue('\n💾 Heavy Memory:'));
    console.log(chalk.gray(`  Snapshots: ${memoryState.heavyMemory.snapshotCount}`));
    console.log(chalk.gray(`  Commits: ${memoryState.heavyMemory.commitCount}`));
    console.log(chalk.gray(`  Last Commit: ${memoryState.heavyMemory.lastCommit || 'None'}`));
    console.log(
      chalk.gray(
        `  Storage: ${memoryState.heavyMemory.storageQuota.used}/${memoryState.heavyMemory.storageQuota.limit} bytes`
      )
    );

    console.log(chalk.blue('\n🏛️ Constitutional Compliance:'));
    console.log(chalk.gray(`  Score: ${memoryState.constitutionalCompliance.complianceScore}/100`));
    console.log(chalk.gray(`  Last Audit: ${memoryState.constitutionalCompliance.lastAudit}`));
    console.log(chalk.gray(`  Violations: ${memoryState.constitutionalCompliance.violations.length}`));

    console.log(chalk.gray('─'.repeat(50)));
  });

// ============================================================================
// HELP COMMAND
// ============================================================================

program
  .command('help')
  .description('Show detailed help for memory governance')
  .action(() => {
    console.log(chalk.blue('\n🧠 Aegis Memory Governance Help'));
    console.log(chalk.gray('─'.repeat(50)));

    console.log(chalk.white('\n📋 Available Commands:'));
    console.log(chalk.gray('  init          - Initialize memory subsystem'));
    console.log(chalk.gray('  lite append   - Add message to lite memory'));
    console.log(chalk.gray('  lite context  - Generate context from lite memory'));
    console.log(chalk.gray('  lite summarize - Summarize lite memory to snapshot'));
    console.log(chalk.gray('  heavy commit  - Commit snapshot to heavy storage'));
    console.log(chalk.gray('  heavy list    - List snapshots and commits'));
    console.log(chalk.gray('  audit         - Constitutional compliance audit'));
    console.log(chalk.gray('  status        - Show memory subsystem status'));

    console.log(chalk.white('\n🏛️ Constitutional Principles:'));
    console.log(chalk.gray('  • All memory operations are traceable'));
    console.log(chalk.gray('  • Memory telemetry is automatically emitted'));
    console.log(chalk.gray('  • Schema validation ensures data integrity'));
    console.log(chalk.gray('  • Constitutional compliance is enforced'));

    console.log(chalk.white('\n📁 Directory Structure:'));
    console.log(chalk.gray('  .framework/memory/'));
    console.log(chalk.gray('  ├── memory-state.json     - System state'));
    console.log(chalk.gray('  ├── schemas/              - Memory schemas'));
    console.log(chalk.gray('  ├── snapshots/            - Memory snapshots'));
    console.log(chalk.gray('  ├── commits/              - Memory commits'));
    console.log(chalk.gray('  ├── lite-messages.jsonl   - Lite memory log'));
    console.log(chalk.gray('  └── observability/        - Telemetry data'));

    console.log(chalk.gray('─'.repeat(50)));
  });

// ============================================================================
// MAIN EXECUTION
// ============================================================================

if (require.main === module) {
  program.parse();
}
