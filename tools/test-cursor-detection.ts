#!/usr/bin/env ts-node
/**
 * @aegisFrameworkVersion: 2.5.0@intent: Test script for Cursor-specific real-time evolution detection
 * @context: Demonstrates the Cursor integration system in action
 */

import { captureCursorContext, detectCursorEvolutionStories } from './cursor-integration';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

async function testCursorDetection() {
  console.log('🎨 Testing Cursor-Specific Real-Time Evolution Detection\n');

  // Test 1: Real-time editing concern
  console.log('🔍 Test 1: Real-time editing concern');
  await captureCursorContext(
    'does this break the build or cause runtime failures?',
    undefined,
    process.cwd(),
    'src/components/LoginForm.tsx',
    { line: 15, character: 10 }
  );

  // Test 2: Constitutional insight
  console.log('\n🔍 Test 2: Constitutional insight');
  await captureCursorContext(
    'assess the pitfall in our constitutional safeguards for this component',
    undefined,
    process.cwd(),
    'src/components/UserProfile.tsx',
    { line: 25, character: 5 }
  );

  // Test 3: Documentation gap
  console.log('\n🔍 Test 3: Documentation gap');
  await captureCursorContext(
    'should we document somehow the systematic way this framework handles state management?',
    undefined,
    process.cwd(),
    'src/hooks/useAuth.ts',
    { line: 8, character: 20 }
  );

  // Test 4: Field experience
  console.log('\n🔍 Test 4: Field experience');
  await captureCursorContext(
    'this field-driven approach revealed gaps in our real-world usage patterns',
    undefined,
    process.cwd(),
    'src/utils/api.ts',
    { line: 42, character: 15 }
  );

  // Test 5: Interface improvement request
  console.log('\n🔍 Test 5: Interface improvement request');
  await captureCursorContext(
    'the cursor interface could use better real-time feedback for visual patterns',
    undefined,
    process.cwd(),
    'src/styles/theme.ts',
    { line: 12, character: 8 }
  );

  console.log('\n✅ All Cursor detection tests completed!');
  console.log('📁 Check .aegis/cursor-feedback/ for detailed logs');
  console.log('📄 Check docs/evolution/ for auto-generated evolution stories');
}

async function testCursorCLI() {
  console.log('\n🛠️ Testing Cursor CLI Interface\n');

  await detectCursorEvolutionStories(
    'does this break the build or cause runtime failures?',
    'The framework includes protections against breaking changes...',
    fs.readFileSync('.cursorrules', 'utf8'),
    'src/components/TestComponent.tsx',
    { line: 10, character: 5 }
  );
}

async function main() {
  try {
    await testCursorDetection();
    await testCursorCLI();
  } catch (error) {
    console.error(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
}

// Run tests if this is the main module
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
