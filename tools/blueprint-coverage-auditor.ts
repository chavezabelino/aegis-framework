/**
 * @aegisFrameworkVersion: 2.4.0-alpha-dev
 * @intent: Systematic audit of fundamental functionality blueprint coverage
 * @context: Identify critical gaps in framework blueprint coverage to prevent constitutional drift
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface FundamentalPattern {
  category: string;
  name: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  codePatterns: RegExp[];
  constitutionalRequirement: string;
  commonUseCases: string[];
}

interface BlueprintCoverageGap {
  pattern: FundamentalPattern;
  hasBlueprint: boolean;
  existingBlueprints: string[];
  gapSeverity: 'critical' | 'high' | 'medium' | 'low';
  recommendedAction: string;
  exampleImplementations: string[];
}

export class BlueprintCoverageAuditor {
  private projectRoot: string;
  private existingBlueprints: Map<string, any> = new Map();

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  /**
   * Load existing blueprints for coverage analysis
   */
  async loadExistingBlueprints(): Promise<void> {
    const blueprintFiles = await glob('blueprints/**/blueprint.yaml', { 
      cwd: this.projectRoot 
    });

    for (const blueprintPath of blueprintFiles) {
      try {
        const content = fs.readFileSync(path.join(this.projectRoot, blueprintPath), 'utf8');
        const yaml = await import('yaml');
        const blueprint = yaml.parse(content);
        
        if (blueprint.id) {
          this.existingBlueprints.set(blueprint.id, {
            ...blueprint,
            path: blueprintPath
          });
        }
      } catch (error) {
        console.warn(`Warning: Could not load blueprint ${blueprintPath}:`, error);
      }
    }
  }

  /**
   * Define fundamental patterns that should have blueprint coverage
   */
  getFundamentalPatterns(): FundamentalPattern[] {
    return [
      // Authentication & Authorization
      {
        category: 'Security',
        name: 'User Authentication',
        description: 'User login, registration, session management',
        priority: 'critical',
        codePatterns: [
          /(?:login|register|authenticate|signin|signup)/i,
          /(?:password|hash|bcrypt|argon2)/i,
          /(?:session|cookie|token).*(?:create|validate|destroy)/i
        ],
        constitutionalRequirement: 'Article I, Section 4: Safety - Security-critical functionality requires blueprint governance',
        commonUseCases: ['User login', 'User registration', 'Session management', 'Password reset']
      },

      {
        category: 'Security', 
        name: 'Authorization & Access Control',
        description: 'Role-based access, permissions, guards',
        priority: 'critical',
        codePatterns: [
          /(?:role|permission|access|authorize|guard)/i,
          /(?:canAccess|hasPermission|isAllowed|checkAuth)/i,
          /(?:admin|user|moderator).*(?:check|role|permission)/i
        ],
        constitutionalRequirement: 'Article I, Section 4: Safety',
        commonUseCases: ['Role management', 'Permission checking', 'Route guards', 'API authorization']
      },

      // Data Management
      {
        category: 'Data',
        name: 'Database Operations',
        description: 'CRUD operations, queries, transactions',
        priority: 'critical',
        codePatterns: [
          /db\.(?:select|insert|update|delete|query)/i,
          /(?:create|read|update|delete).*(?:record|entity|data)/i,
          /(?:transaction|commit|rollback)/i
        ],
        constitutionalRequirement: 'Article I, Section 1: Traceability - Database operations must be traceable',
        commonUseCases: ['CRUD operations', 'Complex queries', 'Transactions', 'Data validation']
      },

      {
        category: 'Data',
        name: 'Data Validation',
        description: 'Input validation, schema validation, sanitization',
        priority: 'high',
        codePatterns: [
          /(?:validate|sanitize|schema|zod|joi)/i,
          /(?:isValid|checkInput|validateInput)/i,
          /(?:required|min|max|pattern).*(?:validation|check)/i
        ],
        constitutionalRequirement: 'Article I, Section 4: Safety',
        commonUseCases: ['Form validation', 'API input validation', 'Data sanitization', 'Schema enforcement']
      },

      // API & Routing
      {
        category: 'API',
        name: 'REST API Endpoints',
        description: 'RESTful API design, routing, middleware',
        priority: 'high',
        codePatterns: [
          /(?:GET|POST|PUT|DELETE|PATCH).*\/api/i,
          /(?:route|endpoint|handler|controller)/i,
          /(?:middleware|guard|interceptor)/i
        ],
        constitutionalRequirement: 'Article I, Section 2: Blueprint Primacy',
        commonUseCases: ['REST endpoints', 'API middleware', 'Request handling', 'Response formatting']
      },

      {
        category: 'API',
        name: 'GraphQL Operations',
        description: 'GraphQL queries, mutations, subscriptions',
        priority: 'medium',
        codePatterns: [
          /(?:query|mutation|subscription|resolver)/i,
          /(?:graphql|gql|apollo)/i,
          /(?:typeDefs|schema|resolver)/i
        ],
        constitutionalRequirement: 'Article I, Section 2: Blueprint Primacy',
        commonUseCases: ['GraphQL schemas', 'Resolvers', 'Subscriptions', 'Query optimization']
      },

      // Error Handling
      {
        category: 'Reliability',
        name: 'Error Handling',
        description: 'Exception handling, error boundaries, fallbacks',
        priority: 'high',
        codePatterns: [
          /(?:try|catch|throw|error|exception)/i,
          /(?:errorBoundary|fallback|retry)/i,
          /(?:handleError|onError|errorHandler)/i
        ],
        constitutionalRequirement: 'Article I, Section 4: Safety - Fallback mechanisms required',
        commonUseCases: ['Error boundaries', 'API error handling', 'Retry mechanisms', 'User error messages']
      },

      {
        category: 'Reliability',
        name: 'Loading & State Management',
        description: 'Loading states, async operations, state machines',
        priority: 'high',
        codePatterns: [
          /(?:loading|pending|fetching|isLoading)/i,
          /(?:useState|useEffect|useQuery|useMutation)/i,
          /(?:loading|success|error).*state/i
        ],
        constitutionalRequirement: 'Article I, Section 1: Observability',
        commonUseCases: ['Loading indicators', 'Async state', 'State machines', 'Optimistic updates']
      },

      // UI Patterns
      {
        category: 'UI',
        name: 'Form Handling',
        description: 'Form validation, submission, error states',
        priority: 'high',
        codePatterns: [
          /(?:form|input|field|submit|validate)/i,
          /(?:onSubmit|handleSubmit|formData)/i,
          /(?:fieldError|inputError|validationError)/i
        ],
        constitutionalRequirement: 'Article I, Section 4: Safety',
        commonUseCases: ['Form validation', 'Form submission', 'Field errors', 'Multi-step forms']
      },

      {
        category: 'UI',
        name: 'Navigation & Routing',
        description: 'Client-side routing, navigation, breadcrumbs',
        priority: 'medium',
        codePatterns: [
          /(?:route|router|navigate|link|href)/i,
          /(?:useRouter|useNavigate|push|replace)/i,
          /(?:breadcrumb|navigation|menu)/i
        ],
        constitutionalRequirement: 'Article I, Section 2: Blueprint Primacy',
        commonUseCases: ['SPA routing', 'Navigation menus', 'Breadcrumbs', 'Route guards']
      },

      // File & Media
      {
        category: 'Media',
        name: 'File Upload',
        description: 'File upload, validation, storage',
        priority: 'medium',
        codePatterns: [
          /(?:upload|file|multipart|formData)/i,
          /(?:fileInput|dropzone|fileSelect)/i,
          /(?:imageUpload|documentUpload|fileHandler)/i
        ],
        constitutionalRequirement: 'Article I, Section 4: Safety',
        commonUseCases: ['Image upload', 'Document upload', 'File validation', 'Progress indicators']
      },

      // Real-time Features
      {
        category: 'Real-time',
        name: 'WebSocket Communication',
        description: 'Real-time updates, live data, notifications',
        priority: 'medium',
        codePatterns: [
          /(?:websocket|socket|realtime|live)/i,
          /(?:subscribe|publish|emit|broadcast)/i,
          /(?:notification|push|alert)/i
        ],
        constitutionalRequirement: 'Article I, Section 1: Observability',
        commonUseCases: ['Live updates', 'Notifications', 'Chat systems', 'Real-time collaboration']
      },

      // Testing Patterns
      {
        category: 'Testing',
        name: 'Testing Utilities',
        description: 'Test helpers, mocks, fixtures',
        priority: 'medium',
        codePatterns: [
          /(?:test|spec|mock|stub|fixture)/i,
          /(?:expect|assert|should|describe|it)/i,
          /(?:testUtils|testHelper|mockData)/i
        ],
        constitutionalRequirement: 'Article I, Section 3: Reproducibility',
        commonUseCases: ['Test utilities', 'Mock data', 'Test helpers', 'Integration tests']
      }
    ];
  }

  /**
   * Check if a pattern has blueprint coverage
   */
  checkPatternCoverage(pattern: FundamentalPattern): BlueprintCoverageGap {
    const relatedBlueprints: string[] = [];
    
    // Check existing blueprints for coverage
    for (const [blueprintId, blueprint] of this.existingBlueprints) {
      const blueprintContent = JSON.stringify(blueprint).toLowerCase();
      const patternName = pattern.name.toLowerCase();
      
      // Check if blueprint covers this pattern
      if (blueprintContent.includes(patternName) || 
          pattern.codePatterns.some(regex => regex.test(blueprintContent))) {
        relatedBlueprints.push(blueprintId);
      }
    }

    const hasBlueprint = relatedBlueprints.length > 0;
    const gapSeverity = hasBlueprint ? 'low' : pattern.priority;

    return {
      pattern,
      hasBlueprint,
      existingBlueprints: relatedBlueprints,
      gapSeverity,
      recommendedAction: this.getRecommendedAction(pattern, hasBlueprint),
      exampleImplementations: this.getExampleImplementations(pattern)
    };
  }

  /**
   * Get recommended action for a coverage gap
   */
  private getRecommendedAction(pattern: FundamentalPattern, hasBlueprint: boolean): string {
    if (hasBlueprint) {
      return `Enhance existing blueprint coverage for ${pattern.name}`;
    }

    switch (pattern.priority) {
      case 'critical':
        return `URGENT: Create ${pattern.name} blueprint immediately - constitutional requirement`;
      case 'high':
        return `Create ${pattern.name} blueprint in next sprint - high impact on framework completeness`;
      case 'medium':
        return `Plan ${pattern.name} blueprint for future iteration`;
      case 'low':
        return `Consider ${pattern.name} blueprint for specialized use cases`;
      default:
        return `Evaluate need for ${pattern.name} blueprint`;
    }
  }

  /**
   * Get example implementations for a pattern
   */
  private getExampleImplementations(pattern: FundamentalPattern): string[] {
    const examples: Record<string, string[]> = {
      'User Authentication': ['lucia-auth + drizzle', 'nextauth + prisma', 'firebase-auth', 'auth0'],
      'Authorization & Access Control': ['role-based-access-control', 'attribute-based-access-control', 'permission-matrix'],
      'Database Operations': ['drizzle-orm', 'prisma', 'typeorm', 'kysely'],
      'Data Validation': ['zod', 'joi', 'yup', 'ajv'],
      'REST API Endpoints': ['express + typescript', 'fastify', 'hapi', 'nest.js'],
      'GraphQL Operations': ['apollo-server', 'type-graphql', 'nexus', 'pothos'],
      'Error Handling': ['error-boundaries', 'global-error-handler', 'retry-mechanisms'],
      'Loading & State Management': ['react-query', 'swr', 'zustand', 'redux-toolkit'],
      'Form Handling': ['react-hook-form', 'formik', 'final-form', 'custom-forms'],
      'Navigation & Routing': ['react-router', 'next-router', 'reach-router', 'vue-router'],
      'File Upload': ['multer', 'formidable', 'busboy', 'dropzone'],
      'WebSocket Communication': ['socket.io', 'ws', 'pusher', 'ably'],
      'Testing Utilities': ['jest', 'vitest', 'testing-library', 'cypress']
    };

    return examples[pattern.name] || ['custom-implementation'];
  }

  /**
   * Run comprehensive blueprint coverage audit
   */
  async auditBlueprintCoverage(): Promise<{
    totalPatterns: number;
    coveredPatterns: number;
    criticalGaps: BlueprintCoverageGap[];
    highPriorityGaps: BlueprintCoverageGap[];
    allGaps: BlueprintCoverageGap[];
    frameworkCompleteness: number;
  }> {
    await this.loadExistingBlueprints();
    
    console.log('🔍 Auditing Blueprint Coverage...\n');
    console.log(`📋 Found ${this.existingBlueprints.size} existing blueprints:`);
    for (const blueprintId of this.existingBlueprints.keys()) {
      console.log(`   - ${blueprintId}`);
    }
    console.log('');

    const fundamentalPatterns = this.getFundamentalPatterns();
    const allGaps: BlueprintCoverageGap[] = [];

    for (const pattern of fundamentalPatterns) {
      const gap = this.checkPatternCoverage(pattern);
      allGaps.push(gap);
    }

    const coveredPatterns = allGaps.filter(gap => gap.hasBlueprint).length;
    const criticalGaps = allGaps.filter(gap => gap.gapSeverity === 'critical');
    const highPriorityGaps = allGaps.filter(gap => gap.gapSeverity === 'high');
    const frameworkCompleteness = Math.round((coveredPatterns / fundamentalPatterns.length) * 100);

    return {
      totalPatterns: fundamentalPatterns.length,
      coveredPatterns,
      criticalGaps,
      highPriorityGaps,
      allGaps,
      frameworkCompleteness
    };
  }

  /**
   * Generate detailed coverage report
   */
  generateCoverageReport(auditResults: Awaited<ReturnType<typeof this.auditBlueprintCoverage>>): string {
    const { totalPatterns, coveredPatterns, criticalGaps, highPriorityGaps, allGaps, frameworkCompleteness } = auditResults;

    let report = '# Blueprint Coverage Audit Report\n\n';
    report += `**Generated:** ${new Date().toISOString()}\n`;
    report += `**Framework Completeness:** ${frameworkCompleteness}% (${coveredPatterns}/${totalPatterns} patterns covered)\n\n`;

    // Critical gaps
    if (criticalGaps.length > 0) {
      report += '## 🚨 Critical Gaps (Constitutional Requirement)\n\n';
      for (const gap of criticalGaps) {
        report += `### ${gap.pattern.name}\n`;
        report += `- **Priority:** ${gap.pattern.priority}\n`;
        report += `- **Category:** ${gap.pattern.category}\n`;
        report += `- **Constitutional Requirement:** ${gap.pattern.constitutionalRequirement}\n`;
        report += `- **Action Required:** ${gap.recommendedAction}\n`;
        report += `- **Use Cases:** ${gap.pattern.commonUseCases.join(', ')}\n`;
        report += `- **Example Implementations:** ${gap.exampleImplementations.join(', ')}\n\n`;
      }
    }

    // High priority gaps
    if (highPriorityGaps.length > 0) {
      report += '## ⚠️ High Priority Gaps\n\n';
      for (const gap of highPriorityGaps) {
        report += `### ${gap.pattern.name}\n`;
        report += `- **Priority:** ${gap.pattern.priority}\n`;
        report += `- **Category:** ${gap.pattern.category}\n`;
        report += `- **Action Required:** ${gap.recommendedAction}\n`;
        report += `- **Use Cases:** ${gap.pattern.commonUseCases.join(', ')}\n\n`;
      }
    }

    // Coverage by category
    const categories = [...new Set(allGaps.map(gap => gap.pattern.category))];
    report += '## 📊 Coverage by Category\n\n';
    for (const category of categories) {
      const categoryGaps = allGaps.filter(gap => gap.pattern.category === category);
      const categoryCovered = categoryGaps.filter(gap => gap.hasBlueprint).length;
      const categoryPercentage = Math.round((categoryCovered / categoryGaps.length) * 100);
      
      report += `**${category}:** ${categoryPercentage}% (${categoryCovered}/${categoryGaps.length})\n`;
    }

    report += '\n## 📋 Complete Gap Analysis\n\n';
    for (const gap of allGaps) {
      const status = gap.hasBlueprint ? '✅' : '❌';
      const priority = gap.pattern.priority === 'critical' ? '🚨' : 
                     gap.pattern.priority === 'high' ? '⚠️' : 
                     gap.pattern.priority === 'medium' ? '💡' : '📝';
      
      report += `${status} ${priority} **${gap.pattern.name}** (${gap.pattern.category})\n`;
      if (gap.hasBlueprint) {
        report += `   - Covered by: ${gap.existingBlueprints.join(', ')}\n`;
      } else {
        report += `   - **Action:** ${gap.recommendedAction}\n`;
      }
      report += '\n';
    }

    return report;
  }
}

/**
 * CLI interface for blueprint coverage audit
 */
export async function auditBlueprintCoverage(projectRoot?: string): Promise<void> {
  const auditor = new BlueprintCoverageAuditor(projectRoot);
  const results = await auditor.auditBlueprintCoverage();
  
  console.log('📊 Blueprint Coverage Audit Results');
  console.log('===================================\n');
  
  console.log(`🎯 Framework Completeness: ${results.frameworkCompleteness}%`);
  console.log(`📋 Patterns Covered: ${results.coveredPatterns}/${results.totalPatterns}\n`);
  
  if (results.criticalGaps.length > 0) {
    console.log('🚨 Critical Gaps (Constitutional Requirement):');
    for (const gap of results.criticalGaps) {
      console.log(`   - ${gap.pattern.name} (${gap.pattern.category})`);
    }
    console.log('');
  }
  
  if (results.highPriorityGaps.length > 0) {
    console.log('⚠️ High Priority Gaps:');
    for (const gap of results.highPriorityGaps) {
      console.log(`   - ${gap.pattern.name} (${gap.pattern.category})`);
    }
    console.log('');
  }

  // Save detailed report
  const reportDir = path.join(projectRoot || process.cwd(), '.aegis', 'coverage-reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const reportFile = path.join(reportDir, `blueprint-coverage-${Date.now()}.md`);
  fs.writeFileSync(reportFile, auditor.generateCoverageReport(results));
  
  console.log(`📄 Detailed report saved: ${reportFile}`);
  
  if (results.criticalGaps.length > 0) {
    console.log('\n🏛️ Constitutional Action Required: Critical blueprint gaps must be addressed');
    process.exit(1);
  }
}

// CLI execution
if (require.main === module) {
  auditBlueprintCoverage()
    .catch(error => {
      console.error('Blueprint coverage audit error:', error);
      process.exit(1);
    });
}
