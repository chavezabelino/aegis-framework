#!/usr/bin/env node

/**
 * @aegisBlueprint: governance-enforcement
 * @version: 2.5.0
 * @mode: strict
 * @intent: Validate file organization and directory boundaries
 * @context: Enforce constitutional governance through file structure
 * @model: claude-3-5-sonnet
 * @hash: 2f1a7b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8b1
 */

import fs from 'node:fs';
import path from 'node:path';

// Allowed directories and their purposes (reflect actual repo layout)
const ALLOWED_DIRECTORIES = {
  'framework/': 'Core framework code and governance',
  'blueprints/': 'Blueprint definitions and schemas',
  'adapters/': 'Framework adapters for different environments',
  'tools/': 'Development and governance tools',
  'cli/': 'Command-line interface tools',
  'patterns/': 'Pattern definitions and implementations',
  '.aegis/': 'Framework metadata and outputs',
  'docs/': 'Documentation',
  'tests/': 'Test files',
  'examples/': 'Example implementations',
  'demo/': 'Demo scripts and examples',
  // Common infrastructure/editor dirs allowed in repo
  '.github/': 'GitHub workflows and templates',
  '.cursor/': 'Cursor IDE configuration',
  '.vscode/': 'VS Code workspace settings',
  'scripts/': 'Project scripts',
  'packages/': 'Published packages/workspaces',
  'website/': 'Documentation website',
  'evals/': 'Evaluation configs and prompts',
  'bin/': 'Executable scripts',
  'dist/': 'Build outputs (ignored in VCS)',
  'logs/': 'Log outputs (ignored in VCS)',
  'scaffolds/': 'Scaffold templates',
  'templates/': 'General templates',
};

// Files that are allowed in root
const ALLOWED_ROOT_FILES = [
  'package.json',
  'package-lock.json',
  'bun.lock',
  'tsconfig.json',
  'tsconfig.dev.json',
  'vite.config.ts',
  'vite.cli.config.ts',
  'jest.config.cjs',
  'VERSION',
  'README.md',
  'CHANGELOG.md',
  'LICENSE',
  'CONTRIBUTING.md',
  'CONSTITUTION.md',
  '.cursorrules',
  '.gitignore',
  '.eslintrc.js',
  '.prettierrc',
  '.prettierignore',
  'CODEOWNERS',
];

const IGNORED_ROOT_DIRS = new Set(['node_modules', '.git', '.framework']);
const IGNORED_ROOT_FILES = new Set(['.DS_Store']);

class PathChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  checkDirectory(dirPath) {
    try {
      if (!fs.existsSync(dirPath)) {
        return;
      }

      const items = fs.readdirSync(dirPath);

      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          const relativePath = path.relative('.', fullPath) + '/';
          if (!this.isAllowedDirectory(relativePath)) {
            this.errors.push({ type: 'dir', path: relativePath });
          } else {
            this.checkDirectory(fullPath);
          }
        } else if (stat.isFile()) {
          const relativePath = path.relative('.', fullPath);
          if (!this.isAllowedFile(relativePath)) {
            this.errors.push({ type: 'file', path: relativePath });
          }
        }
      }
    } catch (error) {
      this.errors.push({ type: 'internal', path: dirPath, message: `Error checking directory: ${error.message}` });
    }
  }

  isAllowedDirectory(dirPath) {
    for (const allowedDir of Object.keys(ALLOWED_DIRECTORIES)) {
      if (dirPath.startsWith(allowedDir)) {
        return true;
      }
    }
    const top = dirPath.split('/')[0] + '/';
    if (IGNORED_ROOT_DIRS.has(top.replace('/', ''))) {
      return true; // ignore errors for ignored dirs
    }
    return false;
  }

  isAllowedFile(filePath) {
    if (IGNORED_ROOT_FILES.has(filePath)) return true;
    if (ALLOWED_ROOT_FILES.includes(filePath)) return true;
    const dirPath = path.dirname(filePath) + '/';
    return this.isAllowedDirectory(dirPath);
  }

  checkRootDirectory() {
    try {
      const items = fs.readdirSync('.');

      for (const item of items) {
        const stat = fs.statSync(item);
        if (stat.isDirectory()) {
          if (IGNORED_ROOT_DIRS.has(item)) continue;
          const dirPath = item + '/';
          if (!this.isAllowedDirectory(dirPath)) {
            this.errors.push({ type: 'dir', path: dirPath });
          }
        } else if (stat.isFile()) {
          if (IGNORED_ROOT_FILES.has(item)) continue;
          if (!this.isAllowedFile(item)) {
            this.errors.push({ type: 'file', path: item });
          }
        }
      }
    } catch (error) {
      this.errors.push({ type: 'internal', path: '.', message: `Error checking root: ${error.message}` });
    }
  }

  printHuman() {
    console.log('🔍 Path Check Results\n');
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All files and directories are in allowed locations');
      return;
    }
    if (this.errors.length > 0) {
      console.log('❌ Errors:');
      for (const e of this.errors) {
        const label =
          e.type === 'dir' ? 'Unauthorized directory' : e.type === 'file' ? 'Unauthorized file' : 'Internal error';
        console.log(`  • ${label}: ${e.path}${e.message ? ` (${e.message})` : ''}`);
      }
    }
    if (this.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      this.warnings.forEach(warning => console.log(`  • ${warning}`));
    }
    console.log('\n📋 Allowed Directories:');
    Object.entries(ALLOWED_DIRECTORIES).forEach(([dir, purpose]) => {
      console.log(`  • ${dir} - ${purpose}`);
    });
  }

  toJsonSummary() {
    const errors = this.errors.map(e => ({ type: e.type, path: e.path }));
    const summary = {
      ok: this.errors.length === 0,
      counts: {
        totalErrors: this.errors.length,
        dirErrors: this.errors.filter(e => e.type === 'dir').length,
        fileErrors: this.errors.filter(e => e.type === 'file').length,
      },
      errors,
      allowedDirectories: Object.keys(ALLOWED_DIRECTORIES),
    };
    return JSON.stringify(summary, null, 2);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const asJson = args.includes('--json');

  const checker = new PathChecker();
  checker.checkRootDirectory();
  Object.keys(ALLOWED_DIRECTORIES).forEach(dir => {
    if (fs.existsSync(dir)) {
      checker.checkDirectory(dir);
    }
  });

  if (asJson) {
    console.log(checker.toJsonSummary());
  } else {
    checker.printHuman();
  }

  // Fatal on any violation (non-zero exit), regardless of CI flag
  if (checker.errors.length > 0) {
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Path check failed:', error.message);
    process.exit(1);
  });
}

export { PathChecker };
