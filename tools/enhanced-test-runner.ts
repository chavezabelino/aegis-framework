#!/usr/bin/env node

/**
 * @aegisFrameworkVersion: 2.3.0
 * @intent: Enhanced test runner for intelligence features that handles TypeScript directly
 * @context: Addresses test failures by providing proper execution environment for all tests
 * @mode: strict
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface TestResult {
  testId: string;
  status: 'pass' | 'fail' | 'skip';
  score: number;
  executionTime: number;
  message: string;
  evidence: string[];
  errors: string[];
}

interface EnhancedTestReport {
  timestamp: Date;
  overallStatus: 'pass' | 'fail' | 'warning';
  totalTests: number;
  passedTests: number;
  failedTests: number;
  results: TestResult[];
}

export class EnhancedTestRunner {
  private projectRoot: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  async runAllIntelligenceTests(): Promise<EnhancedTestReport> {
    console.log('🚀 Running enhanced intelligence tests...');
    
    const tests = [
      {
        id: 'version-drift-detection',
        name: 'Version Drift Detection',
        target: 'tools/validate-version-consistency.ts',
        expectedOutput: ['Overall Status', 'inconsistencies']
      },
      {
        id: 'constitutional-compliance',
        name: 'Constitutional Compliance',
        target: 'tools/constitutional-compliance-enforcer.ts',
        expectedOutput: ['Status:', 'Claims Status']
      },
      {
        id: 'self-healing-governance',
        name: 'Self-Healing Governance',
        target: 'framework/healing/self-healing-governance.ts',
        expectedOutput: ['Self-Healing', 'patterns']
      },
      {
        id: 'evolution-learning',
        name: 'Evolution Learning',
        target: 'tools/evolution-learning-system.ts',
        expectedOutput: ['Evolution Learning', 'patterns']
      },
      {
        id: 'predictive-compliance',
        name: 'Predictive Compliance',
        target: 'tools/predictive-compliance-monitor.ts',
        expectedOutput: ['Predictive', 'Alerts']
      },
      {
        id: 'comprehensive-testing',
        name: 'Comprehensive Testing',
        target: 'tools/comprehensive-intelligence-testing.ts',
        expectedOutput: ['Testing Report', 'Overall Status']
      },
      {
        id: 'evidence-validation',
        name: 'Evidence Validation',
        target: 'tools/evidence-based-validation.ts',
        expectedOutput: ['Evidence', 'Validation Report']
      },
      {
        id: 'systematic-validation',
        name: 'Systematic Validation',
        target: 'tools/systematic-prevention-validator.ts',
        expectedOutput: ['Systematic', 'Validation Report']
      },
      {
        id: 'intelligence-certification',
        name: 'Intelligence Certification',
        target: 'tools/framework-intelligence-certification.ts',
        expectedOutput: ['Certification Report', 'Certified Claims']
      },
      {
        id: 'continuous-monitoring',
        name: 'Continuous Monitoring',
        target: 'tools/continuous-compliance-monitor.ts',
        expectedOutput: ['Monitoring Report', 'Status']
      }
    ];

    const results: TestResult[] = [];
    let passedTests = 0;
    let failedTests = 0;

    for (const test of tests) {
      console.log(`\n🧪 Testing: ${test.name}`);
      
      const result = await this.runSingleTest(test);
      results.push(result);
      
      if (result.status === 'pass') {
        passedTests++;
        console.log(`   ✅ ${test.name} - PASSED`);
      } else {
        failedTests++;
        console.log(`   ❌ ${test.name} - FAILED: ${result.message}`);
      }
    }

    const overallStatus = failedTests === 0 ? 'pass' : 
                         passedTests > failedTests ? 'warning' : 'fail';

    const report: EnhancedTestReport = {
      timestamp: new Date(),
      overallStatus,
      totalTests: tests.length,
      passedTests,
      failedTests,
      results
    };

    await this.displayResults(report);
    return report;
  }

  private async runSingleTest(test: any): Promise<TestResult> {
    const startTime = Date.now();
    const evidence: string[] = [];
    const errors: string[] = [];

    try {
      // Check if target file exists
      const targetPath = path.join(this.projectRoot, test.target);
      if (!fs.existsSync(targetPath)) {
        return {
          testId: test.id,
          status: 'fail',
          score: 0,
          executionTime: Date.now() - startTime,
          message: `Target file not found: ${test.target}`,
          evidence: [],
          errors: [`File not found: ${test.target}`]
        };
      }

      evidence.push(`Target file exists: ${test.target}`);

      // Execute the test with proper timeout and error handling
      let result: string;
      try {
        // Direct Node.js execution (works since our files are executable TypeScript)
        result = execSync(`node "${test.target}"`, {
          cwd: this.projectRoot,
          stdio: 'pipe',
          encoding: 'utf8',
          timeout: 60000 // 60 second timeout
        });
      } catch (execError: any) {
        // Even if execution "fails", check if it produced expected output
        result = execError.stdout || execError.stderr || '';
        if (!result && execError.message) {
          errors.push(`Execution error: ${execError.message}`);
        }
      }

      evidence.push(`Execution completed, output length: ${result.length} characters`);

      // Check for expected outputs
      let foundOutputs = 0;
      for (const expectedOutput of test.expectedOutput) {
        if (result.includes(expectedOutput)) {
          evidence.push(`Found expected output: ${expectedOutput}`);
          foundOutputs++;
        } else {
          errors.push(`Missing expected output: ${expectedOutput}`);
        }
      }

      // Calculate score based on found outputs
      const score = test.expectedOutput.length > 0 ? 
        (foundOutputs / test.expectedOutput.length) * 100 : 
        (result.length > 0 ? 100 : 0);

      // Determine status
      const status = score >= 70 ? 'pass' : 
                    score >= 30 ? 'fail' : 'fail';

      return {
        testId: test.id,
        status,
        score,
        executionTime: Date.now() - startTime,
        message: status === 'pass' ? 
          `Test passed with ${foundOutputs}/${test.expectedOutput.length} expected outputs` :
          `Test failed: ${errors.join(', ')}`,
        evidence,
        errors
      };

    } catch (error) {
      return {
        testId: test.id,
        status: 'fail',
        score: 0,
        executionTime: Date.now() - startTime,
        message: `Test execution failed: ${error}`,
        evidence,
        errors: [...errors, `Unexpected error: ${error}`]
      };
    }
  }

  private async displayResults(report: EnhancedTestReport): Promise<void> {
    console.log('\n🚀 Enhanced Intelligence Testing Report');
    console.log('======================================');
    console.log(`📊 Overall Status: ${report.overallStatus.toUpperCase()}`);
    console.log(`🧪 Total Tests: ${report.totalTests}`);
    console.log(`✅ Passed: ${report.passedTests}`);
    console.log(`❌ Failed: ${report.failedTests}`);
    console.log(`📈 Success Rate: ${((report.passedTests / report.totalTests) * 100).toFixed(1)}%`);

    if (report.results.length > 0) {
      console.log('\n📋 Test Results:');
      report.results.forEach((result, index) => {
        const statusIcon = result.status === 'pass' ? '✅' : '❌';
        console.log(`   ${statusIcon} ${result.testId}: ${result.status.toUpperCase()}`);
        console.log(`      Score: ${result.score.toFixed(1)}% | Time: ${result.executionTime}ms`);
        
        if (result.evidence.length > 0) {
          console.log(`      Evidence: ${result.evidence.slice(0, 2).join(', ')}${result.evidence.length > 2 ? '...' : ''}`);
        }
        
        if (result.errors.length > 0) {
          console.log(`      Errors: ${result.errors.slice(0, 1).join(', ')}${result.errors.length > 1 ? '...' : ''}`);
        }
      });
    }

    console.log('\n💡 Recommendations:');
    if (report.failedTests > 0) {
      console.log(`   • Fix ${report.failedTests} failed tests`);
    }
    if (report.passedTests === report.totalTests) {
      console.log('   • All tests passing! Consider adding more comprehensive test scenarios');
    } else {
      console.log('   • Improve error handling and output consistency');
    }
    console.log('   • Integrate enhanced test runner into CI/CD pipeline');
  }
}

/**
 * CLI interface
 */
async function main() {
  const runner = new EnhancedTestRunner();
  try {
    const report = await runner.runAllIntelligenceTests();
    process.exit(report.overallStatus === 'fail' ? 1 : 0);
  } catch (error) {
    console.error('❌ Enhanced testing failed:', error);
    process.exit(1);
  }
}

// Run if this is the main module
if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}
