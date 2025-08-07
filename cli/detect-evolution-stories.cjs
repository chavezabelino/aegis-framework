#!/usr/bin/env node

/**
 * @aegisFrameworkVersion 2.0.0-alpha-dev
 * @intent CLI wrapper for evolution story detection system
 * @context Make detection easily accessible via command line
 */

// CommonJS wrapper for the TypeScript detector
const { detectEvolutionStories } = require('../tools/detect-evolution-stories.ts');

detectEvolutionStories().catch(error => {
  console.error('❌ Evolution story detection failed:', error.message);
  process.exit(1);
});
