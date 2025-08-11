#!/usr/bin/env node

/**
 * @aegisBlueprint: svelte-drizzle-adapter
 * @version: 1.0.0
 * @mode: strict
 * @intent: Initialize Aegis framework in Svelte project
 * @context: Setup governance patterns and validation
 * @model: claude-3-5-sonnet
 * @hash: 6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔧 Setting up Aegis framework...');

// Create .aegis directory structure
const aegisDirs = ['.aegis/outputs', '.aegis/governance'];
aegisDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Create governance rules
const governanceRules = {
  mode: process.env.AEGIS_MODE || 'strict',
  blueprint: process.env.AEGIS_BLUEPRINT || 'default',
  rules: {
    'type-safety': true,
    'accessibility': true,
    'performance': true,
    'security': true
  }
};

fs.writeFileSync(
  '.aegis/governance/rules.json',
  JSON.stringify(governanceRules, null, 2)
);

console.log('✅ Aegis framework setup complete!');
