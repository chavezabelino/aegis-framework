#!/usr/bin/env node

/**
 * Intelligent Changelog Generation Engine
 *
 * AI-powered changelog analysis, generation, and release planning
 * Part of Phase 2: Intelligent Governance
 *
 * @aegisFrameworkVersion: 2.5.0
 * @intent: Implement intelligent changelog automation with AI-powered analysis
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface ChangelogEntry {
  id: string;
  type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
  category: string;
  description: string;
  impact: 'breaking' | 'major' | 'minor' | 'patch';
  version: string;
  date: string;
  files: string[];
  commits: GitCommit[];
  metadata: ChangeMetadata;
}

interface GitCommit {
  hash: string;
  date: string;
  author: string;
  message: string;
  files: string[];
}

interface ChangeMetadata {
  blueprintId?: string;
  frameworkVersion: string;
  mode: 'lean' | 'strict' | 'generative';
  confidence: number;
  category: string;
  tags: string[];
}

interface VersionPlan {
  targetVersion: string;
  versionType: 'major' | 'minor' | 'patch';
  releaseDate: string;
  features: ChangelogEntry[];
  breakingChanges: ChangelogEntry[];
  migrationRequired: boolean;
  migrationGuide: string[];
}

interface ChangelogAnalysis {
  summary: {
    totalChanges: number;
    byType: Record<string, number>;
    byImpact: Record<string, number>;
    frameworkEvolution: string[];
  };
  entries: ChangelogEntry[];
  versionPlan: VersionPlan;
  recommendations: string[];
  trends: ChangelogTrend[];
}

interface ChangelogTrend {
  pattern: string;
  frequency: number;
  description: string;
  prediction: string;
}

class IntelligentChangelogEngine {
  private frameworkRoot: string;
  private currentVersion: string;
  private entries: ChangelogEntry[] = [];

  constructor(frameworkRoot: string = process.cwd()) {
    this.frameworkRoot = frameworkRoot;
    this.currentVersion = this.loadCurrentVersion();
  }

  async generateIntelligentChangelog(): Promise<ChangelogAnalysis> {
    console.log('📝 Generating intelligent changelog analysis...');

    // Analyze recent commits
    await this.analyzeRecentCommits();

    // Detect undocumented changes
    await this.detectUndocumentedChanges();

    // Analyze current changelog
    await this.analyzeExistingChangelog();

    // Generate version planning
    const versionPlan = await this.generateVersionPlan();

    // Analyze trends
    const trends = await this.analyzeTrends();

    // Generate recommendations
    const recommendations = await this.generateRecommendations();

    const analysis: ChangelogAnalysis = {
      summary: {
        totalChanges: this.entries.length,
        byType: this.groupByType(),
        byImpact: this.groupByImpact(),
        frameworkEvolution: this.getFrameworkEvolution(),
      },
      entries: this.entries,
      versionPlan,
      recommendations,
      trends,
    };

    console.log(`📊 Changelog Analysis Complete:`);
    console.log(`  📝 Changes analyzed: ${this.entries.length}`);
    console.log(`  🎯 Recommendations: ${recommendations.length}`);
    console.log(`  📈 Trends identified: ${trends.length}`);

    return analysis;
  }

  private loadCurrentVersion(): string {
    try {
      const versionPath = path.join(this.frameworkRoot, 'VERSION');
      if (fs.existsSync(versionPath)) {
        return fs.readFileSync(versionPath, 'utf8').trim();
      }
    } catch (error) {
      console.warn('⚠️ Could not load VERSION file');
    }
    return '1.0.0-alpha';
  }

  private async analyzeRecentCommits(): Promise<void> {
    console.log('  🔍 Analyzing recent git commits...');

    try {
      // Get recent commits (last 20)
      const gitLog = execSync('git log --oneline --pretty=format:"%H|%ad|%an|%s" --date=iso -20', {
        cwd: this.frameworkRoot,
        encoding: 'utf8',
      });

      const commits = gitLog
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          const [hash, date, author, message] = line.split('|');
          return { hash, date, author, message, files: [] };
        });

      // Analyze commits for changes
      for (const commit of commits) {
        await this.analyzeCommitForChanges(commit);
      }
    } catch (error) {
      console.warn('⚠️ Could not analyze git commits (not in git repo?)');
    }
  }

  private async analyzeCommitForChanges(commit: GitCommit): Promise<void> {
    // Detect change patterns from commit messages
    const message = commit.message.toLowerCase();

    // Pattern detection for framework features
    if (message.includes('pattern recognition') || message.includes('learning engine')) {
      this.entries.push({
        id: `pattern-recognition-${commit.hash.substring(0, 8)}`,
        type: 'added',
        category: 'AI Intelligence',
        description:
          '🧠 **Enhanced Pattern Recognition Engine**: AI-powered drift pattern analysis and learning from violations',
        impact: 'major',
        version: '1.1.0-beta',
        date: commit.date,
        files: ['framework/learning/pattern-recognition-engine.ts'],
        commits: [commit],
        metadata: {
          frameworkVersion: '1.1.0-beta',
          mode: 'strict',
          confidence: 0.9,
          category: 'intelligence',
          tags: ['ai', 'learning', 'patterns', 'drift-detection'],
        },
      });
    }

    if (message.includes('predictive enforcement') || message.includes('prevention')) {
      this.entries.push({
        id: `predictive-enforcement-${commit.hash.substring(0, 8)}`,
        type: 'added',
        category: 'AI Intelligence',
        description: '🛡️ **Predictive Enforcement System**: AI-driven violation prevention with learned guidance',
        impact: 'major',
        version: '1.1.0-beta',
        date: commit.date,
        files: ['framework/learning/predictive-enforcement.ts'],
        commits: [commit],
        metadata: {
          frameworkVersion: '1.1.0-beta',
          mode: 'strict',
          confidence: 0.9,
          category: 'intelligence',
          tags: ['ai', 'prevention', 'enforcement', 'learning'],
        },
      });
    }

    if (message.includes('constitutional conductor') || message.includes('cli')) {
      this.entries.push({
        id: `cli-enhancement-${commit.hash.substring(0, 8)}`,
        type: 'changed',
        category: 'CLI Tooling',
        description:
          '⚡ **Enhanced Constitutional Conductor**: Integrated AI learning insights and predictive capabilities',
        impact: 'minor',
        version: '1.1.0-beta',
        date: commit.date,
        files: ['cli/aegis-conductor.ts'],
        commits: [commit],
        metadata: {
          frameworkVersion: '1.1.0-beta',
          mode: 'strict',
          confidence: 0.8,
          category: 'tooling',
          tags: ['cli', 'enhancement', 'ai-integration'],
        },
      });
    }
  }

  private async detectUndocumentedChanges(): Promise<void> {
    console.log('  🔍 Detecting undocumented changes...');

    // Check for new files in framework/learning/
    const learningDir = path.join(this.frameworkRoot, 'framework/learning');
    if (fs.existsSync(learningDir)) {
      const files = fs.readdirSync(learningDir);

      if (files.includes('pattern-recognition-engine.ts')) {
        // Check if this is documented in changelog
        const changelogPath = path.join(this.frameworkRoot, 'CHANGELOG.md');
        const changelog = fs.readFileSync(changelogPath, 'utf8');

        if (!changelog.includes('Pattern Recognition Engine')) {
          this.entries.push({
            id: 'undocumented-pattern-recognition',
            type: 'added',
            category: 'AI Intelligence',
            description:
              '🧠 **Pattern Recognition Engine**: Analyzes drift logs to learn from violations and predict future issues',
            impact: 'major',
            version: '1.1.0-beta',
            date: new Date().toISOString(),
            files: ['framework/learning/pattern-recognition-engine.ts'],
            commits: [],
            metadata: {
              frameworkVersion: '1.1.0-beta',
              mode: 'strict',
              confidence: 1.0,
              category: 'intelligence',
              tags: ['undocumented', 'ai', 'learning', 'patterns'],
            },
          });
        }
      }

      if (files.includes('predictive-enforcement.ts')) {
        const changelogPath = path.join(this.frameworkRoot, 'CHANGELOG.md');
        const changelog = fs.readFileSync(changelogPath, 'utf8');

        if (!changelog.includes('Predictive Enforcement')) {
          this.entries.push({
            id: 'undocumented-predictive-enforcement',
            type: 'added',
            category: 'AI Intelligence',
            description:
              '🛡️ **Predictive Enforcement System**: Prevents violations before they occur using learned patterns',
            impact: 'major',
            version: '1.1.0-beta',
            date: new Date().toISOString(),
            files: ['framework/learning/predictive-enforcement.ts'],
            commits: [],
            metadata: {
              frameworkVersion: '1.1.0-beta',
              mode: 'strict',
              confidence: 1.0,
              category: 'intelligence',
              tags: ['undocumented', 'ai', 'prevention', 'enforcement'],
            },
          });
        }
      }
    }

    // Check for Phase 2 completion
    const phase2Doc = path.join(this.frameworkRoot, 'PHASE-2-IMPLEMENTATION.md');
    if (fs.existsSync(phase2Doc)) {
      const changelogPath = path.join(this.frameworkRoot, 'CHANGELOG.md');
      const changelog = fs.readFileSync(changelogPath, 'utf8');

      if (!changelog.includes('Phase 2') && !changelog.includes('Enhanced Pattern Recognition')) {
        this.entries.push({
          id: 'phase-2-completion',
          type: 'added',
          category: 'Framework Evolution',
          description:
            '🎯 **Phase 2: Enhanced Pattern Recognition Complete**: Intelligent learning, pattern analysis, and predictive enforcement capabilities',
          impact: 'major',
          version: '1.1.0-beta',
          date: new Date().toISOString(),
          files: ['PHASE-2-IMPLEMENTATION.md', 'framework/learning/'],
          commits: [],
          metadata: {
            frameworkVersion: '1.1.0-beta',
            mode: 'strict',
            confidence: 1.0,
            category: 'framework-evolution',
            tags: ['phase-completion', 'ai', 'intelligence', 'learning'],
          },
        });
      }
    }
  }

  private async analyzeExistingChangelog(): Promise<void> {
    console.log('  📖 Analyzing existing changelog...');

    const changelogPath = path.join(this.frameworkRoot, 'CHANGELOG.md');
    if (!fs.existsSync(changelogPath)) return;

    const changelog = fs.readFileSync(changelogPath, 'utf8');

    // Extract unreleased section for analysis
    const unreleasedMatch = changelog.match(/## \[Unreleased\]([\s\S]*?)(?=## \[|$)/);
    if (unreleasedMatch) {
      const unreleasedContent = unreleasedMatch[1];

      // Count existing entries
      const addedCount = (unreleasedContent.match(/### Added[\s\S]*?(?=### |$)/)?.[0]?.match(/^- /gm) || []).length;
      const changedCount = (unreleasedContent.match(/### Changed[\s\S]*?(?=### |$)/)?.[0]?.match(/^- /gm) || []).length;
      const enhancedCount = (unreleasedContent.match(/### Enhanced[\s\S]*?(?=### |$)/)?.[0]?.match(/^- /gm) || [])
        .length;

      console.log(
        `    📊 Existing unreleased entries: Added=${addedCount}, Changed=${changedCount}, Enhanced=${enhancedCount}`
      );
    }
  }

  private async generateVersionPlan(): Promise<VersionPlan> {
    console.log('  🎯 Generating version planning...');

    const breakingChanges = this.entries.filter(e => e.impact === 'breaking');
    const majorChanges = this.entries.filter(e => e.impact === 'major');
    const minorChanges = this.entries.filter(e => e.impact === 'minor');

    let versionType: 'major' | 'minor' | 'patch' = 'patch';
    let targetVersion = this.currentVersion;

    if (breakingChanges.length > 0) {
      versionType = 'major';
      targetVersion = this.incrementVersion(this.currentVersion, 'major');
    } else if (majorChanges.length > 0) {
      versionType = 'minor';
      targetVersion = this.incrementVersion(this.currentVersion, 'minor');
    } else if (minorChanges.length > 0) {
      versionType = 'minor';
      targetVersion = this.incrementVersion(this.currentVersion, 'minor');
    }

    const migrationRequired = breakingChanges.length > 0;
    const migrationGuide = migrationRequired
      ? [
          'Update framework annotations to include new AI learning metadata',
          'Review and update constitutional compliance checks',
          'Migrate to enhanced pattern recognition workflows',
        ]
      : [];

    return {
      targetVersion,
      versionType,
      releaseDate: this.calculateReleaseDate(),
      features: this.entries.filter(e => e.type === 'added'),
      breakingChanges,
      migrationRequired,
      migrationGuide,
    };
  }

  private async analyzeTrends(): Promise<ChangelogTrend[]> {
    const trends: ChangelogTrend[] = [];

    // AI Intelligence trend
    const aiChanges = this.entries.filter(
      e =>
        e.metadata.tags.includes('ai') ||
        e.metadata.tags.includes('learning') ||
        e.metadata.tags.includes('intelligence')
    );

    if (aiChanges.length > 0) {
      trends.push({
        pattern: 'ai-intelligence-evolution',
        frequency: aiChanges.length,
        description: 'Framework is evolving toward intelligent, self-learning capabilities',
        prediction: 'Expect continued AI integration in governance, validation, and automation',
      });
    }

    // Constitutional governance trend
    const governanceChanges = this.entries.filter(
      e => e.category.includes('Constitutional') || e.metadata.tags.includes('governance')
    );

    if (governanceChanges.length > 0) {
      trends.push({
        pattern: 'constitutional-governance',
        frequency: governanceChanges.length,
        description: 'Strong focus on constitutional governance and automated compliance',
        prediction: 'Framework will continue strengthening democratic and automated governance',
      });
    }

    return trends;
  }

  private async generateRecommendations(): Promise<string[]> {
    const recommendations: string[] = [];

    // Check for undocumented changes
    const undocumented = this.entries.filter(e => e.metadata.tags.includes('undocumented'));
    if (undocumented.length > 0) {
      recommendations.push(`📝 ${undocumented.length} undocumented changes detected - update changelog immediately`);
    }

    // Version planning recommendation
    const majorChanges = this.entries.filter(e => e.impact === 'major');
    if (majorChanges.length >= 2) {
      recommendations.push(`🚀 ${majorChanges.length} major features ready - consider beta release`);
    }

    // AI evolution recommendation
    const aiChanges = this.entries.filter(e => e.metadata.tags.includes('ai'));
    if (aiChanges.length >= 2) {
      recommendations.push(`🧠 Significant AI capabilities added - highlight in release notes`);
    }

    // Documentation recommendation
    recommendations.push('📚 Update documentation to reflect new AI learning capabilities');
    recommendations.push('🎯 Create migration guide for Pattern Recognition and Predictive Enforcement');

    return recommendations;
  }

  // Helper methods
  private groupByType(): Record<string, number> {
    const groups: Record<string, number> = {};
    this.entries.forEach(entry => {
      groups[entry.type] = (groups[entry.type] || 0) + 1;
    });
    return groups;
  }

  private groupByImpact(): Record<string, number> {
    const groups: Record<string, number> = {};
    this.entries.forEach(entry => {
      groups[entry.impact] = (groups[entry.impact] || 0) + 1;
    });
    return groups;
  }

  private getFrameworkEvolution(): string[] {
    return [
      'Constitutional Governance → AI Intelligence',
      'Manual Enforcement → Predictive Prevention',
      'Reactive Compliance → Proactive Learning',
      'Static Rules → Dynamic Pattern Recognition',
    ];
  }

  private incrementVersion(version: string, type: 'major' | 'minor' | 'patch'): string {
    const parts = version.replace('-alpha', '').replace('-beta', '').split('.');
    const [major, minor, patch] = parts.map(Number);

    switch (type) {
      case 'major':
        return `${major + 1}.0.0-beta`;
      case 'minor':
        return `${major}.${minor + 1}.0-beta`;
      case 'patch':
        return `${major}.${minor}.${patch + 1}-beta`;
      default:
        return version;
    }
  }

  private calculateReleaseDate(): string {
    const now = new Date();
    now.setDate(now.getDate() + 14); // 2 weeks from now
    return now.toISOString().split('T')[0];
  }

  async generateChangelogUpdate(analysis: ChangelogAnalysis): Promise<string> {
    console.log('  📝 Generating changelog update...');

    let changelogUpdate = `## [${analysis.versionPlan.targetVersion}] - ${analysis.versionPlan.releaseDate}\n\n`;

    // Group entries by type
    const byType = {
      added: analysis.entries.filter(e => e.type === 'added'),
      enhanced: analysis.entries.filter(e => e.type === 'changed' && e.description.includes('Enhanced')),
      changed: analysis.entries.filter(e => e.type === 'changed' && !e.description.includes('Enhanced')),
      fixed: analysis.entries.filter(e => e.type === 'fixed'),
      deprecated: analysis.entries.filter(e => e.type === 'deprecated'),
      removed: analysis.entries.filter(e => e.type === 'removed'),
      security: analysis.entries.filter(e => e.type === 'security'),
    };

    // Generate sections
    for (const [section, entries] of Object.entries(byType)) {
      if (entries.length > 0) {
        changelogUpdate += `### ${section.charAt(0).toUpperCase() + section.slice(1)}\n`;
        entries.forEach(entry => {
          const breaking = entry.impact === 'breaking' ? '**Breaking**: ' : '';
          changelogUpdate += `- ${breaking}${entry.description}\n`;
        });
        changelogUpdate += '\n';
      }
    }

    // Add migration notes if needed
    if (analysis.versionPlan.migrationRequired) {
      changelogUpdate += '### Migration Guide\n';
      analysis.versionPlan.migrationGuide.forEach(guide => {
        changelogUpdate += `- ${guide}\n`;
      });
      changelogUpdate += '\n';
    }

    return changelogUpdate;
  }

  async saveChangelogAnalysis(analysis: ChangelogAnalysis): Promise<void> {
    const analysisPath = path.join(this.frameworkRoot, 'framework/learning/changelog-analysis.json');

    const saved = {
      metadata: {
        generated: new Date().toISOString(),
        version: '1.1.0-beta',
        engine: 'intelligent-changelog',
      },
      analysis,
    };

    fs.writeFileSync(analysisPath, JSON.stringify(saved, null, 2));
    console.log(`📊 Changelog analysis saved to ${analysisPath}`);
  }

  displayAnalysis(analysis: ChangelogAnalysis): void {
    console.log('\n📝 Intelligent Changelog Analysis Report');
    console.log('=======================================');
    console.log(`Total Changes: ${analysis.summary.totalChanges}`);
    console.log(`Next Version: ${analysis.versionPlan.targetVersion} (${analysis.versionPlan.versionType})`);
    console.log(`Release Date: ${analysis.versionPlan.releaseDate}`);
    console.log('');

    console.log('📊 Changes by Type:');
    Object.entries(analysis.summary.byType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });

    console.log('\n🎯 Changes by Impact:');
    Object.entries(analysis.summary.byImpact).forEach(([impact, count]) => {
      console.log(`  ${impact}: ${count}`);
    });

    console.log('\n📈 Framework Evolution Trends:');
    analysis.summary.frameworkEvolution.forEach(trend => {
      console.log(`  ${trend}`);
    });

    console.log('\n💡 Recommendations:');
    analysis.recommendations.forEach(rec => {
      console.log(`  ${rec}`);
    });

    if (analysis.trends.length > 0) {
      console.log('\n📊 Identified Trends:');
      analysis.trends.forEach(trend => {
        console.log(`  ${trend.pattern}: ${trend.description}`);
        console.log(`    Prediction: ${trend.prediction}`);
      });
    }
  }
}

// CLI usage
async function main() {
  const engine = new IntelligentChangelogEngine();
  const analysis = await engine.generateIntelligentChangelog();

  engine.displayAnalysis(analysis);
  await engine.saveChangelogAnalysis(analysis);

  // Generate changelog update
  const changelogUpdate = await engine.generateChangelogUpdate(analysis);
  console.log('\n📝 Generated Changelog Update:');
  console.log('================================');
  console.log(changelogUpdate);

  console.log('\n✨ Intelligent changelog analysis complete!');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { IntelligentChangelogEngine };
