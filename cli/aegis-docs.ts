#!/usr/bin/env node
/**
 * @aegisBlueprint: manifesto-cli-tool
 * @version: 1.0.0
 * @mode: lean
 * @intent: Quick access to manifesto documentation and principles
 * @context: CLI tool for manifesto exploration and search
 *
 * @aegisNote: See 'docs/manifesto/genai-os-manifesto.md'
 * This tool implements quick access to GenAI OS principles
 *
 * @manifestoRef: integration-notes.md#cli-workflow-integration
 */

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const program = new Command();

interface ManifestoCommand {
  name: string;
  description: string;
  path: string;
  section?: string;
}

const commands: ManifestoCommand[] = [
  {
    name: 'manifesto',
    description: 'View the core GenAI OS manifesto',
    path: 'docs/manifesto/genai-os-manifesto.md',
  },
  {
    name: 'principles',
    description: 'View engineering principles',
    path: 'docs/manifesto/principles.md',
  },
  {
    name: 'cases',
    description: 'View case studies with real-world evidence',
    path: 'docs/manifesto/case-studies.md',
  },
  {
    name: 'author',
    description: 'View author notes and personal journey',
    path: 'docs/manifesto/author-notes.md',
  },
  {
    name: 'evs',
    description: 'View evolution stories index',
    path: 'docs/manifesto/evs-index.md',
  },
  {
    name: 'integration',
    description: 'View integration notes for practical implementation',
    path: 'docs/manifesto/integration-notes.md',
  },
];

function findProjectRoot(startPath: string = process.cwd()): string {
  let currentPath = startPath;

  while (currentPath !== path.dirname(currentPath)) {
    const constitutionPath = path.join(currentPath, 'CONSTITUTION.md');
    const manifestoPath = path.join(currentPath, 'docs', 'manifesto');

    if (fs.existsSync(constitutionPath) && fs.existsSync(manifestoPath)) {
      return currentPath;
    }

    currentPath = path.dirname(currentPath);
  }

  throw new Error('Aegis Framework project not found. Run from within an Aegis project directory.');
}

function displayFile(filePath: string): void {
  try {
    const projectRoot = findProjectRoot();
    const fullPath = path.join(projectRoot, filePath);

    if (!fs.existsSync(fullPath)) {
      console.error(chalk.red(`❌ File not found: ${filePath}`));
      console.log(chalk.yellow('💡 Available commands:'));
      commands.forEach(cmd => {
        console.log(chalk.cyan(`   aegis-docs ${cmd.name}`) + ` - ${cmd.description}`);
      });
      return;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    console.log(chalk.blue(`📖 ${path.basename(filePath)}`));
    console.log(chalk.gray('─'.repeat(60)));
    console.log(content);
  } catch (error) {
    console.error(chalk.red(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
}

function searchManifesto(query: string): void {
  try {
    const projectRoot = findProjectRoot();
    const manifestoDir = path.join(projectRoot, 'docs', 'manifesto');

    console.log(chalk.blue(`🔍 Searching manifesto for: "${query}"`));
    console.log(chalk.gray('─'.repeat(60)));

    const files = fs.readdirSync(manifestoDir).filter(f => f.endsWith('.md'));
    let found = false;

    for (const file of files) {
      const filePath = path.join(manifestoDir, file);
      const content = fs.readFileSync(filePath, 'utf8').toLowerCase();
      const lines = fs.readFileSync(filePath, 'utf8').split('\n');

      if (content.includes(query.toLowerCase())) {
        found = true;
        console.log(chalk.green(`📄 ${file}:`));

        lines.forEach((line, index) => {
          if (line.toLowerCase().includes(query.toLowerCase())) {
            console.log(chalk.gray(`   ${index + 1}:`), line.trim());
          }
        });
        console.log();
      }
    }

    if (!found) {
      console.log(chalk.yellow(`No results found for "${query}"`));
      console.log(chalk.gray('Try searching for: constitutional, governance, evolution, drift, etc.'));
    }
  } catch (error) {
    console.error(chalk.red(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
}

function listPrinciples(): void {
  console.log(chalk.blue('🎯 GenAI OS Core Principles'));
  console.log(chalk.gray('─'.repeat(60)));

  const principles = [
    'Intelligence Requires Infrastructure',
    'Prompting ≠ Governance',
    'Drift Is Inevitable, Detection Is Optional',
    'Execution Modes Are Constitutional Rights',
    'Traceability Over Speed',
    'Contracts Over Conversations',
    'Observability Over Autonomy',
    'Constitution Over Configuration',
    'Evolution Over Perfection',
  ];

  principles.forEach((principle, index) => {
    console.log(chalk.cyan(`${index + 1}.`), chalk.white(principle));
  });

  console.log();
  console.log(chalk.gray('💡 For details: aegis-docs principles'));
}

// Command setup
program.name('aegis-docs').description('Quick access to Aegis Framework manifesto and documentation').version('1.0.0');

// Add specific document commands
commands.forEach(cmd => {
  program
    .command(cmd.name)
    .description(cmd.description)
    .action(() => displayFile(cmd.path));
});

// Search command
program
  .command('search <query>')
  .description('Search manifesto documentation for specific terms')
  .action(searchManifesto);

// List principles command
program
  .command('list-principles')
  .alias('lp')
  .description('Quick list of core GenAI OS principles')
  .action(listPrinciples);

// Help enhancement
program
  .command('help-manifesto')
  .description('Show manifesto navigation guide')
  .action(() => {
    console.log(chalk.blue('📚 GenAI OS Manifesto Navigation'));
    console.log(chalk.gray('─'.repeat(60)));
    console.log();

    console.log(chalk.yellow('📖 For First-Time Readers:'));
    console.log('  1. aegis-docs manifesto    (core vision)');
    console.log('  2. aegis-docs cases        (real examples)');
    console.log();

    console.log(chalk.yellow('🔧 For Technical Implementation:'));
    console.log('  1. aegis-docs principles   (technical patterns)');
    console.log('  2. aegis-docs integration  (practical guidance)');
    console.log();

    console.log(chalk.yellow('🧭 For Framework Learning:'));
    console.log('  1. aegis-docs evs          (evolution stories)');
    console.log('  2. aegis-docs author       (journey & context)');
    console.log();

    console.log(chalk.gray('💡 Use "aegis-docs search <term>" to find specific topics'));
  });

// Default help
program.on('--help', () => {
  console.log();
  console.log(chalk.blue('🎯 Quick Examples:'));
  console.log('  aegis-docs manifesto       # View core manifesto');
  console.log('  aegis-docs list-principles # Core principles');
  console.log('  aegis-docs search drift    # Search for "drift"');
  console.log('  aegis-docs help-manifesto  # Navigation guide');
});

program.parse();
