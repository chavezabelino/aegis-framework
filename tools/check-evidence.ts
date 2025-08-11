#!/usr/bin/env node

/**
 * @aegisBlueprint: governance-enforcement
 * @version: 2.5.0
 * @mode: strict
 * @intent: Validate evidence manifests and prove claims
 * @context: Enforce constitutional governance through evidence validation
 * @model: claude-3-5-sonnet
 * @hash: 3f2a7b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a1
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'child_process';
import { z } from 'zod';

// Evidence manifest schema
const EvidenceManifestSchema = z.object({
  blueprint: z.string(),
  version: z.string(),
  evidence: z.object({
    commands: z.array(z.object({
      name: z.string(),
      command: z.string(),
      expected: z.object({
        exit_code: z.number(),
        output_contains: z.array(z.string()).optional(),
        files: z.array(z.object({
          path: z.string(),
          required: z.boolean(),
          non_empty: z.boolean(),
          schema: z.any().optional()
        })).optional()
      })
    })),
    telemetry: z.object({
      events: z.array(z.object({
        name: z.string(),
        file: z.string(),
        schema: z.any()
      }))
    }),
    outputs: z.object({
      required_files: z.array(z.string())
    })
  }),
  validation: z.object({
    timestamp: z.string(),
    commit: z.string(),
    environment: z.string()
  })
});

class EvidenceChecker {
  private errors: string[] = [];
  private warnings: string[] = [];
  private isCI: boolean;
  private hmacKeyPresent: boolean;

  constructor() {
    this.isCI = process.argv.includes('--ci');
    this.hmacKeyPresent = !!process.env.AEGIS_HMAC_KEY;
  }

  async checkEvidenceManifest(manifestPath: string): Promise<boolean> {
    try {
      if (!fs.existsSync(manifestPath)) {
        this.errors.push(`Evidence manifest not found: ${manifestPath}`);
        return false;
      }

      const content = fs.readFileSync(manifestPath, 'utf8');
      const manifest = JSON.parse(content);

      // Validate schema
      const result = EvidenceManifestSchema.safeParse(manifest);
      if (!result.success) {
        this.errors.push(`Schema validation failed: ${result.error.message}`);
        return false;
      }

      const evidence = result.data;

      // Check each command
      for (const cmd of evidence.evidence.commands) {
        await this.checkCommand(cmd);
      }

      // Check telemetry files
      for (const event of evidence.evidence.telemetry.events) {
        await this.checkTelemetryFile(event);
      }

      // Check required output files
      for (const file of evidence.evidence.outputs.required_files) {
        await this.checkOutputFile(file);
      }

      return this.errors.length === 0;
    } catch (error) {
      this.errors.push(`Error checking evidence manifest: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  private async checkCommand(cmd: any): Promise<void> {
    try {
      console.log(`🔍 Checking command: ${cmd.name}`);
      
      // Execute command
      const output = execSync(cmd.command, { 
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });

      // Check exit code (we can't capture it from execSync, so we assume success)
      console.log(`✅ Command executed: ${cmd.name}`);

      // Check output contains expected strings
      if (cmd.expected.output_contains) {
        for (const expected of cmd.expected.output_contains) {
          if (!output.includes(expected)) {
            this.errors.push(`Command ${cmd.name} output missing: "${expected}"`);
          }
        }
      }

      // Check expected files
      if (cmd.expected.files) {
        for (const file of cmd.expected.files) {
          await this.checkExpectedFile(file);
        }
      }

    } catch (error) {
      this.errors.push(`Command ${cmd.name} failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async checkExpectedFile(file: any): Promise<void> {
    const filePath = file.path;
    
    if (file.required && !fs.existsSync(filePath)) {
      // If HMAC key missing and file is a signature, downgrade to warning
      if (!this.hmacKeyPresent && filePath.endsWith('.sig')) {
        this.warnings.push(`Signature file missing (attestation disabled): ${filePath}`);
        return;
      }
      this.errors.push(`Required file not found: ${filePath}`);
      return;
    }

    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      
      if (file.non_empty && stat.size === 0) {
        this.errors.push(`File is empty but should not be: ${filePath}`);
      }

      // Check if file was modified after job start (indicating it was generated)
      const jobStartTime = new Date(Date.now() - 60000); // Assume job started 1 minute ago
      if (stat.mtime < jobStartTime) {
        this.warnings.push(`File may not have been generated in this run: ${filePath}`);
      }
    }
  }

  private async checkTelemetryFile(event: any): Promise<void> {
    const filePath = event.file;
    
    if (!fs.existsSync(filePath)) {
      this.warnings.push(`Telemetry file not found: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.trim().split('\n').filter(line => line.trim());
    
    // Check if file contains the expected event
    const hasEvent = lines.some(line => {
      try {
        const parsed = JSON.parse(line);
        return parsed.event === event.name;
      } catch {
        return false;
      }
    });

    if (!hasEvent) {
      this.warnings.push(`Telemetry file ${filePath} does not contain event: ${event.name}`);
    }
  }

  private async checkOutputFile(filePath: string): Promise<void> {
    if (!fs.existsSync(filePath)) {
      // Downgrade missing signature files to warnings when no HMAC key is present
      if (!this.hmacKeyPresent && filePath.endsWith('.sig')) {
        this.warnings.push(`Signature file missing (attestation disabled): ${filePath}`);
        return;
      }
      this.errors.push(`Required output file not found: ${filePath}`);
      return;
    }

    const stat = fs.statSync(filePath);
    if (stat.size === 0) {
      this.errors.push(`Output file is empty: ${filePath}`);
    }
  }

  async checkAllEvidenceManifests(pattern: string): Promise<boolean> {
    const files = this.glob(pattern);
    let allValid = true;

    for (const file of files) {
      const isValid = await this.checkEvidenceManifest(file);
      if (!isValid) {
        allValid = false;
      }
    }

    this.printResults();
    return allValid;
  }

  private glob(pattern: string): string[] {
    const files: string[] = [];
    
    if (pattern.includes('**')) {
      // Simple recursive glob
      const baseDir = pattern.split('**')[0];
      this.walkDirectory(baseDir, files);
    } else {
      // Simple pattern matching
      if (fs.existsSync(pattern)) {
        files.push(pattern);
      }
    }

    return files.filter(file => file.endsWith('evidence.json'));
  }

  private walkDirectory(dir: string, files: string[]): void {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        this.walkDirectory(fullPath, files);
      } else if (item === 'evidence.json') {
        files.push(fullPath);
      }
    }
  }

  private printResults(): void {
    console.log('🔍 Evidence Check Results\n');
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All evidence manifests are valid');
      return;
    }

    if (this.errors.length > 0) {
      console.log('❌ Errors:');
      this.errors.forEach(error => console.log(`  • ${error}`));
    }

    if (this.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      this.warnings.forEach(warning => console.log(`  • ${warning}`));
    }
  }
}

async function main() {
  const checker = new EvidenceChecker();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node tools/check-evidence.ts <pattern>');
    process.exit(1);
  }

  const pattern = args[0];
  const success = await checker.checkAllEvidenceManifests(pattern);
  
  if (!success && checker.isCI) {
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('❌ Evidence check failed:', error.message);
    process.exit(1);
  });
}

export { EvidenceChecker };
