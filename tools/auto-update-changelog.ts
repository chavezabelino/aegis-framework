#!/usr/bin/env node

/**
 * Automated Changelog Updater
 * 
 * Uses intelligent changelog analysis to automatically update CHANGELOG.md
 * Part of Option B: Intelligent Changelog Generation
 * 
 * @aegisFrameworkVersion: 2.4.0
 * @intent: Automate changelog maintenance with AI-powered change detection and team configuration support
 * @context: Automated changelog generation with configurable formats and team preferences
 * @mode: strict
 */

import fs from "fs";
import path from "path";
import { IntelligentChangelogEngine } from "../framework/learning/intelligent-changelog.ts";
import { TeamConfigLoader } from './team-config-loader.js';

class AutomatedChangelogUpdater {
  private frameworkRoot: string;
  private changelogPath: string;
  private configLoader: TeamConfigLoader;

  constructor(frameworkRoot: string = process.cwd()) {
    this.frameworkRoot = frameworkRoot;
    this.changelogPath = path.join(frameworkRoot, 'CHANGELOG.md');
    this.configLoader = TeamConfigLoader.getInstance(frameworkRoot);
  }

  async updateChangelog(dryRun: boolean = false): Promise<void> {
    console.log("🔄 Automated Changelog Update");
    console.log("=============================");

    // Check if automated changelog is enabled
    if (!this.configLoader.isOptionalFeatureEnabled('automatedChangelog')) {
      console.log('📋 Automated changelog disabled in team configuration');
      return;
    }

    const config = this.configLoader.loadConfig();
    const format = config?.optional.automatedChangelog.format ?? 'constitutional';

    console.log(`📋 Using format: ${format}`);

    // Generate intelligent analysis
    const engine = new IntelligentChangelogEngine(this.frameworkRoot);
    const analysis = await engine.generateIntelligentChangelog();

    // Check if update is needed
    if (analysis.entries.length === 0) {
      console.log("✅ No new changes detected - changelog is up to date");
      return;
    }

    console.log(`📝 Detected ${analysis.entries.length} undocumented changes`);
    
    if (dryRun) {
      console.log("🧪 DRY RUN MODE - No files will be modified");
      const update = await engine.generateChangelogUpdate(analysis);
      console.log("\n📋 Would add to changelog:");
      console.log(update);
      return;
    }

    // Read current changelog
    const currentChangelog = fs.readFileSync(this.changelogPath, 'utf8');
    
    // Generate new version section
    const newSection = await engine.generateChangelogUpdate(analysis);
    
    // Insert new section after [Unreleased]
    const updatedChangelog = this.insertNewVersion(currentChangelog, newSection);
    
    // Write updated changelog
    fs.writeFileSync(this.changelogPath, updatedChangelog);
    
    // Update VERSION file if needed
    if (analysis.versionPlan.targetVersion !== engine['currentVersion']) {
      await this.updateVersionFile(analysis.versionPlan.targetVersion);
    }

    console.log(`✅ Changelog updated with version ${analysis.versionPlan.targetVersion}`);
    console.log(`📅 Release date: ${analysis.versionPlan.releaseDate}`);
    
    // Display recommendations
    if (analysis.recommendations.length > 0) {
      console.log("\n💡 Recommendations:");
      analysis.recommendations.forEach(rec => console.log(`  ${rec}`));
    }
  }

  private insertNewVersion(currentChangelog: string, newSection: string): string {
    // Find the [Unreleased] section
    const unreleasedMatch = currentChangelog.match(/(## \[Unreleased\][\s\S]*?)(?=## \[|$)/);
    
    if (unreleasedMatch) {
      // Insert new version section after [Unreleased]
      const beforeUnreleased = currentChangelog.substring(0, unreleasedMatch.index! + unreleasedMatch[1].length);
      const afterUnreleased = currentChangelog.substring(unreleasedMatch.index! + unreleasedMatch[1].length);
      
      return beforeUnreleased + '\n' + newSection + afterUnreleased;
    } else {
      // If no [Unreleased] section, add after header
      const lines = currentChangelog.split('\n');
      const headerEnd = lines.findIndex(line => line.trim() === '');
      
      if (headerEnd > 0) {
        lines.splice(headerEnd + 1, 0, '', newSection);
        return lines.join('\n');
      } else {
        return currentChangelog + '\n\n' + newSection;
      }
    }
  }

  private async updateVersionFile(newVersion: string): Promise<void> {
    const versionPath = path.join(this.frameworkRoot, 'VERSION');
    fs.writeFileSync(versionPath, newVersion);
    console.log(`🏷️ Updated VERSION file to ${newVersion}`);
  }
}

// CLI usage
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('-n');
  
  const updater = new AutomatedChangelogUpdater();
  await updater.updateChangelog(dryRun);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { AutomatedChangelogUpdater };
