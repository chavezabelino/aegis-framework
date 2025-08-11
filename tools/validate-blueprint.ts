#!/usr/bin/env node

/**
 * @aegisBlueprint: governance-enforcement
 * @version: 2.5.0
 * @mode: strict
 * @intent: Validate blueprint schema and structure
 * @context: Enforce constitutional governance through blueprint validation
 * @model: claude-3-5-sonnet
 * @hash: 5f4a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9
 */

import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import yaml from 'js-yaml';

// Blueprint schema definition
const BlueprintSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+/),
  aegisFrameworkVersion: z.string().regex(/^\d+\.\d+\.\d+/),
  description: z.string().min(1),
  determinismConfig: z.object({
    seed: z.string().min(1),
    temperature: z.number().min(0).max(2),
    strictMode: z.boolean()
  }).optional(),
  requiredRoutes: z.array(z.object({
    path: z.string().min(1),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
    description: z.string().min(1)
  })).optional(),
  requiredProviders: z.array(z.object({
    name: z.string().min(1),
    type: z.string().min(1),
    version: z.string().regex(/^\d+\.\d+\.\d+/)
  })).optional(),
  requiredSelectors: z.array(z.object({
    name: z.string().min(1),
    type: z.enum(['data', 'computed', 'action'])
  })).optional(),
  ruleContracts: z.array(z.object({
    rule: z.string().min(1),
    version: z.string().regex(/^\d+\.\d+\.\d+/),
    enforcement: z.enum(['blocking', 'warning', 'optional']),
    schema: z.object({
      requirements: z.array(z.string().min(1))
    })
  })).optional(),
  observability: z.object({
    events: z.array(z.object({
      name: z.string().min(1),
      schema: z.string().min(1),
      description: z.string().min(1)
    }))
  }).optional(),
  errorStates: z.array(z.object({
    code: z.string().min(1),
    message: z.string().min(1),
    recovery: z.string().min(1)
  })).optional(),
  validation: z.object({
    required: z.array(z.string().min(1)),
    optional: z.array(z.string().min(1))
  }).optional(),
  adapters: z.record(z.object({
    mode: z.enum(['lean', 'strict', 'generative']),
    config: z.record(z.any())
  })).optional()
});

class BlueprintValidator {
  private errors: string[] = [];
  private warnings: string[] = [];
  private isCI: boolean;

  constructor() {
    this.isCI = process.argv.includes('--ci');
  }

  async validateBlueprint(filePath: string): Promise<boolean> {
    try {
      if (!fs.existsSync(filePath)) {
        this.errors.push(`Blueprint file not found: ${filePath}`);
        return false;
      }

      const content = fs.readFileSync(filePath, 'utf8');
      const yaml = await this.parseYaml(content);
      
      if (!yaml) {
        this.errors.push(`Invalid YAML in blueprint: ${filePath}`);
        return false;
      }

      // Validate against schema
      const result = BlueprintSchema.safeParse(yaml);
      if (!result.success) {
        this.errors.push(`Schema validation failed for ${filePath}: ${result.error.message}`);
        return false;
      }

      const blueprint = result.data;

      // Additional validations
      this.validateBlueprintId(filePath, blueprint.id);
      this.validateVersion(filePath, blueprint.version);
      this.validateFrameworkVersion(filePath, blueprint.aegisFrameworkVersion);
      this.validateRequiredFields(filePath, blueprint);

      return this.errors.length === 0;
    } catch (error) {
      this.errors.push(`Error validating ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  private async parseYaml(content: string): Promise<any> {
    try {
      const doc = yaml.load(content);
      return doc ?? null;
    } catch (error) {
      return null;
    }
  }

  private parseValue(value: string): any {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (!isNaN(Number(value))) return Number(value);
    if (value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1);
    }
    return value;
  }

  private validateBlueprintId(filePath: string, id: string): void {
    const expectedId = path.basename(path.dirname(filePath));
    if (id !== expectedId) {
      this.errors.push(`Blueprint ID mismatch in ${filePath}: expected "${expectedId}", got "${id}"`);
    }
  }

  private validateVersion(filePath: string, version: string): void {
    const rootVersion = this.getRootVersion();
    if (version !== rootVersion) {
      this.errors.push(`Version mismatch in ${filePath}: expected "${rootVersion}", got "${version}"`);
    }
  }

  private validateFrameworkVersion(filePath: string, frameworkVersion: string): void {
    const rootVersion = this.getRootVersion();
    if (frameworkVersion !== rootVersion) {
      this.warnings.push(`Framework version mismatch in ${filePath}: expected "${rootVersion}", got "${frameworkVersion}"`);
    }
  }

  private validateRequiredFields(filePath: string, blueprint: any): void {
    const required = ['id', 'name', 'version', 'aegisFrameworkVersion', 'description'];
    for (const field of required) {
      if (!blueprint[field]) {
        this.errors.push(`Missing required field "${field}" in ${filePath}`);
      }
    }
  }

  private getRootVersion(): string {
    try {
      if (fs.existsSync('VERSION')) {
        return fs.readFileSync('VERSION', 'utf8').trim();
      }
      if (fs.existsSync('package.json')) {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        return packageJson.version;
      }
      return '2.5.0'; // Default
    } catch (error) {
      return '2.5.0'; // Default
    }
  }

  async validateAllBlueprints(pattern: string): Promise<boolean> {
    const files = this.glob(pattern);
    let allValid = true;

    for (const file of files) {
      const isValid = await this.validateBlueprint(file);
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

    return files.filter(file => file.endsWith('blueprint.yaml'));
  }

  private walkDirectory(dir: string, files: string[]): void {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        this.walkDirectory(fullPath, files);
      } else if (item === 'blueprint.yaml') {
        files.push(fullPath);
      }
    }
  }

  private printResults(): void {
    console.log('🔍 Blueprint Validation Results\n');
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All blueprints are valid');
      return;
    }

    if (this.errors.length > 0) {
      console.log('❌ Errors:');
      this.errors.forEach(error => console.log(`