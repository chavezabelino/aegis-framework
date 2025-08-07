#!/usr/bin/env node

/**
 * @aegisFrameworkVersion 2.0.0-alpha-dev
 * @intent CLI wrapper for copilot interaction analysis
 * @context Analyze recent copilot interactions for evolution triggers
 */

const { analyzeCopilotInteractions } = require('../tools/copilot-integration.ts');

const days = process.argv[2] ? parseInt(process.argv[2]) : 1;

analyzeCopilotInteractions(days).catch(error => {
  console.error('❌ Copilot analysis failed:', error.message);
  process.exit(1);
});
