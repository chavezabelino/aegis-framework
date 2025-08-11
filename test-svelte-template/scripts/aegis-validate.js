#!/usr/bin/env node

/**
 * @aegisBlueprint: svelte-drizzle-adapter
 * @version: 1.0.0
 * @mode: strict
 * @intent: Validate Aegis framework integration
 * @context: Ensure proper setup and configuration
 * @model: claude-3-5-sonnet
 * @hash: 4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 Validating Aegis framework integration...');

const requiredFiles = [
  'package.json',
  'svelte.config.js',
  'drizzle.config.ts',
  'src/lib/db/schema.ts',
  'src/lib/db/index.ts',
  'blueprints/default.blueprint.json',
  '.aegis/governance/rules.json'
];

const requiredDirs = [
  'src/lib/components',
  'src/lib/stores',
  'blueprints/auth',
  'blueprints/forms',
  '.aegis/outputs'
];

let allValid = true;

// Check required files
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log('✅ ' + file);
  } else {
    console.log('❌ Missing: ' + file);
    allValid = false;
  }
}

// Check required directories
for (const dir of requiredDirs) {
  if (fs.existsSync(dir)) {
    console.log('✅ ' + dir + '/');
  } else {
    console.log('❌ Missing: ' + dir + '/');
    allValid = false;
  }
}

if (allValid) {
  console.log('✅ Aegis framework validation passed!');
} else {
  console.log('❌ Aegis framework validation failed!');
  process.exit(1);
}
