#!/usr/bin/env tsx

/**
 * @aegisBlueprint: tools-audit
 * @version: 2.5.0
 * @mode: lean
 * @intent: Audit tools directory for unused scripts that should be deprecated
 * @context: Systematic analysis of tool usage across package.json and CI workflows
 * @model: claude-3-5-sonnet
 * @hash: 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2
 */

import { readFileSync, existsSync } from 'fs';
import { glob } from 'glob';

interface ToolUsage {
  file: string;
  usedInPackageJson: boolean;
  usedInCI: boolean;
  usedInAnyWorkflow: boolean;
  totalUsage: number;
}

async function findToolFiles(): Promise<string[]> {
  const patterns = [
    'tools/**/*.ts',
    'tools/**/*.js', 
    'tools/**/*.cjs',
    'tools/**/*.mjs',
    'tools/**/*.sh'
  ];
  
  const files = await glob(patterns, { ignore: ['node_modules/**'] });
  return files.sort();
}

function checkPackageJsonUsage(toolFile: string): boolean {
  try {
    const packageJson = readFileSync('package.json', 'utf-8');
    const toolName = toolFile.replace('tools/', '');
    return packageJson.includes(toolName);
  } catch {
    return false;
  }
}

function checkCIUsage(toolFile: string): boolean {
  try {
    const workflows = glob.sync('.github/workflows/*.yml');
    const toolName = toolFile.replace('tools/', '');
    
    for (const workflow of workflows) {
      const content = readFileSync(workflow, 'utf-8');
      if (content.includes(toolName)) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

async function main() {
  console.log('🔍 Aegis Tools Usage Audit');
  console.log('==========================\n');

  const toolFiles = await findToolFiles();
  const results: ToolUsage[] = [];

  console.log(`📁 Found ${toolFiles.length} tool files\n`);

  for (const toolFile of toolFiles) {
    const usedInPackageJson = checkPackageJsonUsage(toolFile);
    const usedInCI = checkCIUsage(toolFile);
    const usedInAnyWorkflow = usedInCI;
    const totalUsage = (usedInPackageJson ? 1 : 0) + (usedInCI ? 1 : 0);

    results.push({
      file: toolFile,
      usedInPackageJson,
      usedInCI,
      usedInAnyWorkflow,
      totalUsage
    });
  }

  // Categorize results
  const used = results.filter(r => r.totalUsage > 0);
  const unused = results.filter(r => r.totalUsage === 0);
  const packageJsonOnly = results.filter(r => r.usedInPackageJson && !r.usedInCI);
  const ciOnly = results.filter(r => r.usedInCI && !r.usedInPackageJson);
  const bothUsed = results.filter(r => r.usedInPackageJson && r.usedInCI);

  console.log('📊 USAGE SUMMARY');
  console.log('================');
  console.log(`Total tools: ${results.length}`);
  console.log(`Used in any way: ${used.length}`);
  console.log(`Completely unused: ${unused.length}`);
  console.log(`Package.json only: ${packageJsonOnly.length}`);
  console.log(`CI only: ${ciOnly.length}`);
  console.log(`Used in both: ${bothUsed.length}\n`);

  if (unused.length > 0) {
    console.log('🚨 UNUSED TOOLS (Candidates for deprecation)');
    console.log('===========================================');
    unused.forEach(tool => {
      console.log(`❌ ${tool.file}`);
    });
    console.log();
  }

  if (packageJsonOnly.length > 0) {
    console.log('⚠️  PACKAGE.JSON ONLY (Consider CI integration)');
    console.log('==============================================');
    packageJsonOnly.forEach(tool => {
      console.log(`📦 ${tool.file}`);
    });
    console.log();
  }

  if (ciOnly.length > 0) {
    console.log('⚠️  CI ONLY (Consider package.json scripts)');
    console.log('===========================================');
    ciOnly.forEach(tool => {
      console.log(`🔄 ${tool.file}`);
    });
    console.log();
  }

  console.log('✅ FULLY INTEGRATED TOOLS');
  console.log('=========================');
  bothUsed.forEach(tool => {
    console.log(`✅ ${tool.file}`);
  });

  console.log(`\n💡 RECOMMENDATIONS:`);
  console.log(`- ${unused.length} tools can be safely deprecated`);
  console.log(`- ${packageJsonOnly.length} tools should be integrated into CI`);
  console.log(`- ${ciOnly.length} tools should be added to package.json scripts`);
}

main().catch(console.error);
