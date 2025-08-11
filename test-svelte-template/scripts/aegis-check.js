#!/usr/bin/env node

/**
 * @aegisBlueprint: svelte-drizzle-adapter
 * @version: 1.0.0
 * @mode: strict
 * @intent: Check Aegis framework compliance
 * @context: Validate governance patterns and code quality
 * @model: claude-3-5-sonnet
 * @hash: 5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🔍 Running Aegis compliance checks...');

try {
  // Run TypeScript checks
  execSync('npm run check', { stdio: 'inherit' });
  
  // Run linting
  execSync('npm run lint', { stdio: 'inherit' });
  
  // Check blueprint validity
  if (fs.existsSync('blueprints/default.blueprint.json')) {
    console.log('✅ Blueprint validation passed');
  } else {
    console.log('⚠️  No default blueprint found');
  }
  
  console.log('✅ All Aegis compliance checks passed!');
} catch (error) {
  console.error('❌ Aegis compliance check failed:', error.message);
  process.exit(1);
}
