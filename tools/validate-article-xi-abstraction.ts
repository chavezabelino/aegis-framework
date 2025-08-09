/**
 * @aegisFrameworkVersion: 2.4.0-alpha-dev
 * @intent: Constitutional validation for Article XI: Field-Driven Abstraction Principle
 * @context: Ensures framework evolution maintains abstract governance focus vs project-specific solutions
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface AbstractionViolation {
  type: 'project-specific-content' | 'missing-abstraction' | 'scope-boundary-violation';
  severity: 'critical' | 'high' | 'medium' | 'low';
  file: string;
  line?: number;
  evidence: string;
  recommendation: string;
  constitutionalArticle: 'Article XI, Section 1' | 'Article XI, Section 3' | 'Article XI, Section 4';
}

export class ArticleXIValidator {
  private projectRoot: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  /**
   * Project-specific patterns that violate Article XI
   */
  private getProjectSpecificPatterns(): Array<{
    pattern: RegExp;
    description: string;
    severity: AbstractionViolation['severity'];
  }> {
    return [
      // Technology-specific implementation guidance
      {
        pattern: /(?:install|setup|configure).*(?:lucia|sveltekit|drizzle|nextjs|react|vue)/i,
        description: 'Technology-specific installation/setup guidance',
        severity: 'critical'
      },
      
      // Stack-specific tutorials
      {
        pattern: /(?:how to|tutorial|guide|walkthrough).*(?:lucia|sveltekit|drizzle|prisma)/i,
        description: 'Technology stack-specific tutorial content',
        severity: 'critical'
      },
      
      // Project-specific debugging
      {
        pattern: /(?:fix|debug|troubleshoot|solve).*(?:error|issue|problem).*(?:lucia|drizzle|sveltekit)/i,
        description: 'Project-specific debugging solutions',
        severity: 'high'
      },
      
      // Implementation-specific code examples
      {
        pattern: /```(?:typescript|javascript|tsx|jsx)[\s\S]*?(?:lucia|drizzle|sveltekit)[\s\S]*?```/i,
        description: 'Technology-specific code implementation examples',
        severity: 'medium'
      },
      
      // Configuration-specific guidance
      {
        pattern: /(?:config|configuration|settings).*(?:lucia|drizzle|sveltekit)/i,
        description: 'Technology-specific configuration guidance',
        severity: 'medium'
      }
    ];
  }

  /**
   * Required abstraction patterns for constitutional compliance
   */
  private getRequiredAbstractionPatterns(): Array<{
    pattern: RegExp;
    description: string;
    weight: number;
  }> {
    return [
      {
        pattern: /abstract.*pattern|tech.*agnostic|universal.*approach|technology.*independent/i,
        description: 'Abstract pattern language',
        weight: 3
      },
      
      {
        pattern: /constitutional.*improvement|framework.*evolution|governance.*enhancement/i,
        description: 'Constitutional governance focus',
        weight: 3
      },
      
      {
        pattern: /systematic.*prevention|meta.*pattern|universal.*enforcement/i,
        description: 'Systematic framework improvements',
        weight: 2
      },
      
      {
        pattern: /future.*projects|all.*users|universal.*benefit|cross.*stack/i,
        description: 'Universal applicability language',
        weight: 2
      },
      
      {
        pattern: /blueprint.*pattern|enforcement.*mechanism|compliance.*gate/i,
        description: 'Framework governance terminology',
        weight: 1
      }
    ];
  }

  /**
   * Validate a single file for Article XI compliance
   */
  async validateFile(filePath: string): Promise<AbstractionViolation[]> {
    const violations: AbstractionViolation[] = [];
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      // Check for project-specific violations
      const projectPatterns = this.getProjectSpecificPatterns();
      for (const pattern of projectPatterns) {
        const matches = [...content.matchAll(new RegExp(pattern.pattern, 'gi'))];
        
        for (const match of matches) {
          // Find line number
          let lineNumber = 1;
          const beforeMatch = content.substring(0, match.index || 0);
          lineNumber = beforeMatch.split('\n').length;
          
          violations.push({
            type: 'project-specific-content',
            severity: pattern.severity,
            file: filePath,
            line: lineNumber,
            evidence: `Project-specific content detected: "${match[0]}"`,
            recommendation: `Replace with abstract, tech-agnostic patterns per Article XI`,
            constitutionalArticle: 'Article XI, Section 1'
          });
        }
      }
      
      // Check for required abstraction (evolution stories and framework docs)
      if (this.shouldHaveAbstraction(filePath)) {
        const abstractionScore = this.calculateAbstractionScore(content);
        
        if (abstractionScore < 3) {
          violations.push({
            type: 'missing-abstraction',
            severity: 'high',
            file: filePath,
            evidence: `Abstraction score: ${abstractionScore}/10 - insufficient abstract pattern language`,
            recommendation: 'Add abstract patterns, constitutional governance focus, and universal applicability language',
            constitutionalArticle: 'Article XI, Section 3'
          });
        }
      }
      
    } catch (error) {
      violations.push({
        type: 'scope-boundary-violation',
        severity: 'medium',
        file: filePath,
        evidence: `Could not analyze file: ${error instanceof Error ? error.message : String(error)}`,
        recommendation: 'Ensure file is readable and follows constitutional structure',
        constitutionalArticle: 'Article XI, Section 4'
      });
    }
    
    return violations;
  }

  /**
   * Determine if file should have abstraction patterns
   */
  private shouldHaveAbstraction(filePath: string): boolean {
    return (
      filePath.includes('docs/evolution/') && filePath.endsWith('.md') ||
      filePath.includes('framework/') && filePath.endsWith('.md') ||
      filePath.includes('blueprints/') && filePath.endsWith('.yaml') ||
      filePath.includes('CONSTITUTION.md') ||
      filePath.includes('README.md')
    );
  }

  /**
   * Calculate abstraction score for content
   */
  private calculateAbstractionScore(content: string): number {
    const patterns = this.getRequiredAbstractionPatterns();
    let score = 0;
    
    for (const pattern of patterns) {
      if (pattern.pattern.test(content)) {
        score += pattern.weight;
      }
    }
    
    return Math.min(score, 10); // Cap at 10
  }

  /**
   * Validate Article XI compliance across framework
   */
  async validateFrameworkAbstraction(): Promise<{
    violations: AbstractionViolation[];
    criticalViolations: AbstractionViolation[];
    complianceScore: number;
    filesAnalyzed: number;
  }> {
    console.log('📐 Validating Article XI: Field-Driven Abstraction Principle...\n');
    
    const allViolations: AbstractionViolation[] = [];
    let filesAnalyzed = 0;
    
    // Target files for abstraction validation
    const filePaths = [
      'docs/evolution/**/*.md',
      'framework/**/*.md', 
      'blueprints/**/*.yaml',
      'CONSTITUTION.md',
      'README.md'
    ];
    
    for (const pattern of filePaths) {
      const files = await glob(pattern, { cwd: this.projectRoot });
      
      for (const file of files) {
        const fullPath = path.join(this.projectRoot, file);
        if (fs.existsSync(fullPath)) {
          const violations = await this.validateFile(fullPath);
          allViolations.push(...violations);
          filesAnalyzed++;
        }
      }
    }
    
    const criticalViolations = allViolations.filter(v => v.severity === 'critical');
    const complianceScore = Math.max(0, 100 - (allViolations.length * 5) - (criticalViolations.length * 10));
    
    return {
      violations: allViolations,
      criticalViolations,
      complianceScore,
      filesAnalyzed
    };
  }

  /**
   * Generate Article XI compliance report
   */
  generateComplianceReport(results: Awaited<ReturnType<typeof this.validateFrameworkAbstraction>>): string {
    const { violations, criticalViolations, complianceScore, filesAnalyzed } = results;
    
    let report = '# Article XI: Field-Driven Abstraction Principle Compliance Report\n\n';
    report += `**Generated:** ${new Date().toISOString()}\n`;
    report += `**Files Analyzed:** ${filesAnalyzed}\n`;
    report += `**Compliance Score:** ${complianceScore}%\n`;
    report += `**Total Violations:** ${violations.length}\n`;
    report += `**Critical Violations:** ${criticalViolations.length}\n\n`;
    
    if (criticalViolations.length > 0) {
      report += '## 🚨 Critical Violations (Constitutional)\n\n';
      for (const violation of criticalViolations) {
        report += `### ${violation.file}\n`;
        report += `- **Type:** ${violation.type}\n`;
        report += `- **Line:** ${violation.line || 'N/A'}\n`;
        report += `- **Evidence:** ${violation.evidence}\n`;
        report += `- **Constitutional Authority:** ${violation.constitutionalArticle}\n`;
        report += `- **Required Action:** ${violation.recommendation}\n\n`;
      }
    }
    
    // Group violations by type
    const violationsByType = violations.reduce((acc, violation) => {
      acc[violation.type] = acc[violation.type] || [];
      acc[violation.type].push(violation);
      return acc;
    }, {} as Record<string, AbstractionViolation[]>);
    
    report += '## 📊 Violations by Type\n\n';
    for (const [type, typeViolations] of Object.entries(violationsByType)) {
      report += `**${type}:** ${typeViolations.length} violations\n`;
    }
    
    if (violations.length === 0) {
      report += '\n✅ **Perfect Article XI Compliance**\n';
      report += 'Framework maintains proper abstraction boundaries and constitutional scope.\n';
    } else {
      report += '\n## 📋 All Violations\n\n';
      for (const violation of violations) {
        const icon = violation.severity === 'critical' ? '🚨' : 
                    violation.severity === 'high' ? '⚠️' : 
                    violation.severity === 'medium' ? '💡' : '📝';
        
        report += `${icon} **${violation.file}**${violation.line ? `:${violation.line}` : ''}\n`;
        report += `   ${violation.evidence}\n`;
        report += `   *Action:* ${violation.recommendation}\n\n`;
      }
    }
    
    return report;
  }
}

/**
 * CLI interface for Article XI validation
 */
export async function validateArticleXI(projectRoot?: string): Promise<void> {
  const validator = new ArticleXIValidator(projectRoot);
  const results = await validator.validateFrameworkAbstraction();
  
  console.log('📊 Article XI Compliance Results');
  console.log('================================\n');
  
  console.log(`📐 Compliance Score: ${results.complianceScore}%`);
  console.log(`📁 Files Analyzed: ${results.filesAnalyzed}`);
  console.log(`⚠️ Total Violations: ${results.violations.length}`);
  console.log(`🚨 Critical Violations: ${results.criticalViolations.length}\n`);
  
  if (results.criticalViolations.length > 0) {
    console.log('🚨 Critical Constitutional Violations:');
    for (const violation of results.criticalViolations) {
      console.log(`   - ${violation.file}: ${violation.evidence}`);
    }
    console.log('');
  }
  
  // Save compliance report
  const reportDir = path.join(projectRoot || process.cwd(), '.aegis', 'compliance-reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const reportFile = path.join(reportDir, `article-xi-compliance-${Date.now()}.md`);
  fs.writeFileSync(reportFile, validator.generateComplianceReport(results));
  
  console.log(`📄 Detailed report saved: ${reportFile}`);
  
  if (results.criticalViolations.length > 0) {
    console.log('\n🏛️ Constitutional Action Required: Article XI violations must be resolved');
    process.exit(1);
  }
  
  if (results.complianceScore < 80) {
    console.log('\n📐 Framework Improvement Needed: Enhance abstraction compliance');
    process.exit(1);
  }
  
  console.log('\n✅ Article XI: Field-Driven Abstraction Principle - COMPLIANT');
}

// CLI execution
if (require.main === module) {
  validateArticleXI()
    .catch(error => {
      console.error('Article XI validation error:', error);
      process.exit(1);
    });
}
