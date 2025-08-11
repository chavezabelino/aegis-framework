#!/usr/bin/env node

/**
 * @aegisBlueprint: governance-enforcement
 * @version: 1.0.0
 * @mode: strict
 * @intent: Validate file provenance and annotations
 * @context: Enforce constitutional governance through file annotations
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'child_process';

const PROVENANCE_REGEX =
  /^\/\*\*\s*\n\s*@aegisBlueprint:\s*(.+)\s*\n\s*@version:\s*(.+)\s*\n\s*@mode:\s*(lean|strict|generative)\s*\n\s*@intent:\s*(.+)\s*\n\s*@context:\s*(.+)\s*\n\s*@model:\s*(.+)\s*\n\s*@hash:\s*([a-f0-9]{64})\s*\n\s*\*\//m;

class ProvenanceChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.isCI = process.argv.includes('--ci');
  }

  async checkFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const match = content.match(PROVENANCE_REGEX);

      if (!match) {
        this.errors.push(`Missing or invalid provenance header: ${filePath}`);
        return false;
      }

      const [, blueprint, version, mode, intent, context, model, hash] = match;

      // Validate blueprint ID
      if (!blueprint || blueprint.trim() === '') {
        this.errors.push(`Invalid blueprint ID in ${filePath}`);
        return false;
      }

      // Validate version
      if (!version || !/^\d+\.\d+\.\d+/.test(version.trim())) {
        this.errors.push(`Invalid version format in ${filePath}`);
        return false;
      }

      // Validate mode
      if (!['lean', 'strict', 'generative'].includes(mode)) {
        this.errors.push(`Invalid mode in ${filePath}: ${mode}`);
        return false;
      }

      // Validate hash
      const expectedHash = this.generateHash(content);
      if (hash !== expectedHash) {
        this.errors.push(`Hash mismatch in ${filePath}. Expected: ${expectedHash}, Got: ${hash}`);
        return false;
      }

      // Check if blueprint exists
      const blueprintPath = path.join('blueprints', blueprint.trim(), 'blueprint.yaml');
      if (!fs.existsSync(blueprintPath)) {
        this.warnings.push(`Referenced blueprint not found: ${blueprintPath}`);
      }

      return true;
    } catch (error) {
      this.errors.push(`Error checking ${filePath}: ${error.message}`);
      return false;
    }
  }

  generateHash(content) {
    // Remove the hash line itself before generating hash
    const contentWithoutHash = content.replace(/@hash:\s*[a-f0-9]{64}/, '@hash: <placeholder>');
    return crypto.createHash('sha256').update(contentWithoutHash).digest('hex');
  }

  async checkDirectory(dirPath, extensions = ['.ts', '.js', '.tsx', '.jsx', '.md']) {
    const files = this.getFilesRecursively(dirPath, extensions);
    let validCount = 0;
    let totalCount = 0;

    for (const file of files) {
      totalCount++;
      if (await this.checkFile(file)) {
        validCount++;
      }
    }

    return { validCount, totalCount };
  }

  getFilesRecursively(dirPath, extensions) {
    const files = [];

    if (!fs.existsSync(dirPath)) {
      return files;
    }

    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules and .git
        if (item !== 'node_modules' && item !== '.git') {
          files.push(...this.getFilesRecursively(fullPath, extensions));
        }
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }

    return files;
  }

  printResults() {
    console.log('🔍 Provenance Check Results\n');

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All files have valid provenance headers');
      return true;
    }

    if (this.errors.length > 0) {
      console.log('❌ Errors:');
      this.errors.forEach(error => console.log(`  • ${error}`));
    }

    if (this.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      this.warnings.forEach(warning => console.log(`  • ${warning}`));
    }

    return this.errors.length === 0;
  }

  generateProvenanceHeader(blueprint, version, mode, intent, context, model) {
    const content = `/**
 * @aegisBlueprint: ${blueprint}
 * @version: ${version}
 * @mode: ${mode}
 * @intent: ${intent}
 * @context: ${context}
 * @model: ${model}
 * @hash: <placeholder>
 */`;

    const hash = this.generateHash(content);
    return content.replace('<placeholder>', hash);
  }
}

async function main() {
  const checker = new ProvenanceChecker();

  // Check specific directories
  const directories = ['framework', 'blueprints', 'adapters', 'tools', 'cli', 'patterns'];
  let totalValid = 0;
  let totalFiles = 0;

  for (const dir of directories) {
    if (fs.existsSync(dir)) {
      const result = await checker.checkDirectory(dir);
      totalValid += result.validCount;
      totalFiles += result.totalCount;

      if (result.totalCount > 0) {
        console.log(`${dir}: ${result.validCount}/${result.totalCount} files valid`);
      }
    }
  }

  console.log(`\n📊 Summary: ${totalValid}/${totalFiles} files have valid provenance`);

  const success = checker.printResults();

  if (!success && checker.isCI) {
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Provenance check failed:', error.message);
    process.exit(1);
  });
}

export { ProvenanceChecker };
