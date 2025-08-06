#!/usr/bin/env node

/**
 * Output Fidelity Validator (CommonJS)
 * 
 * Constitutional enforcement tool for Article IX: Template and Documentation Quality Standards
 * Validates generated outputs against reference targets for character-perfect fidelity
 * 
 * @aegisFrameworkVersion: 1.3.0
 * @intent: Ensure generated outputs match reference targets exactly
 * @constitutionalAuthority: Article IX, Section 2
 */

const fs = require("fs");
const path = require("path");

class OutputFidelityValidator {
  constructor() {
    this.frameworkRoot = path.resolve(__dirname, '..');
    this.violations = [];
  }

  async validateAll() {
    console.log('🎯 Validating Output Fidelity (Constitutional Article IX)...\n');

    const matches = await this.validateOutputs();
    const overall = this.calculateOverallScore(matches);

    const result = {
      overall,
      matches,
      violations: this.violations,
      recommendations: this.generateRecommendations()
    };

    this.printResults(result);
    return result;
  }

  async validateOutputs() {
    const matches = [];
    
    // Known output/reference pairs
    const outputPairs = [
      {
        output: 'framework/generated/instructions/current/github-copilot-ready.md',
        reference: 'framework/generated/instructions/current/github-copilot-ready-test-target.md'
      }
    ];

    for (const pair of outputPairs) {
      const outputPath = path.join(this.frameworkRoot, pair.output);
      const referencePath = path.join(this.frameworkRoot, pair.reference);

      if (fs.existsSync(outputPath) && fs.existsSync(referencePath)) {
        const match = await this.compareFiles(outputPath, referencePath);
        matches.push(match);
      } else {
        console.log(`⚠️  Missing files for comparison: ${pair.output} or ${pair.reference}`);
        
        this.violations.push({
          severity: 'high',
          file: outputPath,
          message: 'Reference target missing for fidelity validation',
          suggestion: 'Ensure reference targets exist for all generated outputs'
        });
      }
    }

    return matches;
  }

  async compareFiles(outputPath, referencePath) {
    const outputContent = fs.readFileSync(outputPath, 'utf-8');
    const referenceContent = fs.readFileSync(referencePath, 'utf-8');

    const outputLines = outputContent.split('\n');
    const referenceLines = referenceContent.split('\n');

    const differences = [];
    const encodingIssues = [];

    const maxLines = Math.max(outputLines.length, referenceLines.length);

    for (let i = 0; i < maxLines; i++) {
      const outputLine = outputLines[i] || '';
      const referenceLine = referenceLines[i] || '';

      if (outputLine !== referenceLine) {
        const diffType = this.classifyDifference(outputLine, referenceLine);
        
        differences.push({
          line: i + 1,
          expected: referenceLine,
          actual: outputLine,
          type: diffType
        });

        // Check for encoding issues
        const encodingIssue = this.detectEncodingIssue(outputLine, referenceLine, i + 1);
        if (encodingIssue) {
          encodingIssues.push(encodingIssue);
        }
      }
    }

    const matches = differences.length === 0;
    const score = matches ? 100 : Math.max(0, 100 - (differences.length * 2));

    // Add violations for significant differences
    if (!matches) {
      const criticalDiffs = differences.filter(d => d.type === 'encoding').length;
      const severity = criticalDiffs > 10 ? 'critical' : criticalDiffs > 5 ? 'high' : 'medium';

      this.violations.push({
        severity,
        file: outputPath,
        message: `Output differs from reference target (${differences.length} differences)`,
        suggestion: encodingIssues.length > 0 ? 
          'Clean up HTML entities in templates to use plain Unicode characters' :
          'Review template generation logic for consistency'
      });
    }

    return {
      outputFile: outputPath,
      referenceFile: referencePath,
      matches,
      score,
      differences,
      encodingIssues
    };
  }

  classifyDifference(actual, expected) {
    // Check for encoding differences (HTML entities)
    const htmlEntityPattern = /&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);/g;
    
    if (htmlEntityPattern.test(actual) || htmlEntityPattern.test(expected)) {
      return 'encoding';
    }

    // Check for whitespace differences
    if (actual.trim() === expected.trim()) {
      return 'whitespace';
    }

    return 'content';
  }

  detectEncodingIssue(actual, expected, line) {
    const commonEntities = {
      '&#39;': "'",
      '&apos;': "'", 
      '&quot;': '"',
      '&ldquo;': '"',
      '&rdquo;': '"',
      '&lsquo;': "'",
      '&rsquo;': "'",
      '&mdash;': '—',
      '&ndash;': '–',
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&nbsp;': ' '
    };

    for (const [entity, replacement] of Object.entries(commonEntities)) {
      if (actual.includes(entity) && expected.includes(replacement)) {
        return {
          line,
          entity,
          replacement,
          context: actual
        };
      }
    }

    return null;
  }

  calculateOverallScore(matches) {
    if (matches.length === 0) return 0;
    
    const totalScore = matches.reduce((sum, match) => sum + match.score, 0);
    return Math.round(totalScore / matches.length);
  }

  generateRecommendations() {
    const recommendations = [];

    const encodingViolations = this.violations.filter(v => 
      v.message.includes('HTML entities') || v.suggestion.includes('Unicode')
    );

    if (encodingViolations.length > 0) {
      recommendations.push('Replace HTML entities with plain Unicode characters in all templates');
      recommendations.push('Run template quality validator before regenerating outputs');
      recommendations.push('Update reference targets after fixing encoding issues');
    }

    const fidelityViolations = this.violations.filter(v => v.message.includes('differs from reference'));
    if (fidelityViolations.length > 0) {
      recommendations.push('Review template generation logic for consistency');
      recommendations.push('Implement section-by-section validation for complex templates');
      recommendations.push('Add pre-commit hooks for output fidelity validation');
    }

    if (recommendations.length === 0) {
      recommendations.push('Maintain reference targets for all critical generated outputs');
      recommendations.push('Run fidelity validation as part of CI/CD pipeline');
    }

    return recommendations;
  }

  printResults(result) {
    console.log('📊 Output Fidelity Validation Results\n');
    console.log(`Overall Score: ${result.overall}/100\n`);

    result.matches.forEach(match => {
      const status = match.matches ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} ${path.basename(match.outputFile)} (${match.score}/100)`);
      
      if (!match.matches) {
        console.log(`  📋 ${match.differences.length} differences found`);
        
        if (match.encodingIssues.length > 0) {
          console.log(`  🔤 ${match.encodingIssues.length} encoding issues detected`);
          
          // Show first few encoding issues as examples
          const examples = match.encodingIssues.slice(0, 3);
          examples.forEach(issue => {
            console.log(`    Line ${issue.line}: "${issue.entity}" → "${issue.replacement}"`);
          });
          
          if (match.encodingIssues.length > 3) {
            console.log(`    ... and ${match.encodingIssues.length - 3} more`);
          }
        }
      }
      console.log('');
    });

    if (result.violations.length > 0) {
      console.log('⚠️  Fidelity Violations:\n');
      
      result.violations.forEach(violation => {
        const icon = violation.severity === 'critical' ? '🚨' : 
                    violation.severity === 'high' ? '❌' : 
                    violation.severity === 'medium' ? '⚠️' : 'ℹ️';
        
        console.log(`${icon} ${violation.severity.toUpperCase()}: ${violation.message}`);
        console.log(`   File: ${violation.file}`);
        if (violation.line) console.log(`   Line: ${violation.line}`);
        console.log(`   Suggestion: ${violation.suggestion}\n`);
      });
    }

    if (result.recommendations.length > 0) {
      console.log('💡 Recommendations:\n');
      result.recommendations.forEach((rec, i) => {
        console.log(`${i + 1}. ${rec}`);
      });
      console.log('');
    }

    // Constitutional compliance summary
    if (result.overall < 80) {
      console.log('🏛️  CONSTITUTIONAL COMPLIANCE WARNING');
      console.log('   Article IX requires high fidelity between generated outputs and reference targets.');
      console.log('   Current score is below constitutional standards (80/100 minimum).\n');
    }

    const exitCode = result.overall >= 80 ? 0 : 1;
    process.exit(exitCode);
  }
}

// CLI execution
if (require.main === module) {
  const validator = new OutputFidelityValidator();
  validator.validateAll().catch(console.error);
}

module.exports = { OutputFidelityValidator };
