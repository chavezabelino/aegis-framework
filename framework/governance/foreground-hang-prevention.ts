#!/usr/bin/env node

/**
 * @aegisFrameworkVersion: 2.4.0
 * @intent: Prevent foreground process hangs in LLM-agent development loops
 * @context: Constitutional safeguard preventing agent blocking on long-running processes
 * @mode: strict
 */

import fs from 'fs';
import path from 'path';
import { execSync, spawn } from 'child_process';

interface ProcessPattern {
  pattern: RegExp;
  name: string;
  category: 'dev-server' | 'build-watch' | 'test-watch' | 'database' | 'service';
  defaultPort?: number;
  healthCheck?: string;
  logPattern?: string;
  killSignal?: 'SIGTERM' | 'SIGKILL';
}

interface BackgroundProcess {
  command: string;
  pid: number;
  logFile: string;
  healthCheck?: string;
  startTime: Date;
  category: string;
}

interface ProcessRunResult {
  success: boolean;
  pid?: number;
  logFile?: string;
  healthCheck?: string;
  message: string;
  backgrounded: boolean;
}

export class ForegroundHangPrevention {
  private projectRoot: string;
  private logsDir: string;
  private processPatterns!: ProcessPattern[];
  private runningProcesses: Map<string, BackgroundProcess> = new Map();

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.logsDir = path.join(projectRoot, 'logs');
    this.initializeProcessPatterns();
    this.ensureLogsDirectory();
  }

  private initializeProcessPatterns(): void {
    this.processPatterns = [
      // Development Servers
      {
        pattern: /npm\s+run\s+dev/,
        name: 'npm-dev',
        category: 'dev-server',
        defaultPort: 3000,
        healthCheck: 'http://localhost:3000',
        logPattern: 'Local:.*http://localhost',
      },
      {
        pattern: /yarn\s+dev/,
        name: 'yarn-dev',
        category: 'dev-server',
        defaultPort: 3000,
        healthCheck: 'http://localhost:3000',
        logPattern: 'Local:.*http://localhost',
      },
      {
        pattern: /bun\s+dev/,
        name: 'bun-dev',
        category: 'dev-server',
        defaultPort: 3000,
        healthCheck: 'http://localhost:3000',
        logPattern: 'Local:.*http://localhost',
      },
      {
        pattern: /vite/,
        name: 'vite',
        category: 'dev-server',
        defaultPort: 5173,
        healthCheck: 'http://localhost:5173',
        logPattern: 'Local:.*http://localhost:5173',
      },
      {
        pattern: /next\s+dev/,
        name: 'next-dev',
        category: 'dev-server',
        defaultPort: 3000,
        healthCheck: 'http://localhost:3000',
        logPattern: 'Ready on.*http://localhost',
      },
      {
        pattern: /webpack.*dev/,
        name: 'webpack-dev',
        category: 'dev-server',
        defaultPort: 8080,
        healthCheck: 'http://localhost:8080',
        logPattern: 'webpack compiled',
      },

      // Build Watchers
      {
        pattern: /tsc.*--watch/,
        name: 'tsc-watch',
        category: 'build-watch',
        logPattern: 'Found 0 errors. Watching for file changes',
      },
      {
        pattern: /rollup.*--watch/,
        name: 'rollup-watch',
        category: 'build-watch',
        logPattern: 'watching for changes',
      },

      // Test Watchers
      {
        pattern: /jest.*--watch/,
        name: 'jest-watch',
        category: 'test-watch',
        logPattern: 'Watch Usage',
      },
      {
        pattern: /vitest/,
        name: 'vitest',
        category: 'test-watch',
        logPattern: 'watching for file changes',
      },

      // Databases
      {
        pattern: /mongod/,
        name: 'mongodb',
        category: 'database',
        defaultPort: 27017,
        healthCheck: 'mongodb://localhost:27017',
      },
      {
        pattern: /redis-server/,
        name: 'redis',
        category: 'database',
        defaultPort: 6379,
      },

      // Generic Services
      {
        pattern: /docker.*up/,
        name: 'docker-compose',
        category: 'service',
        logPattern: 'started',
      },
    ];
  }

  private ensureLogsDirectory(): void {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  /**
   * Check if a command would cause a foreground hang
   */
  detectLongRunningProcess(command: string): ProcessPattern | null {
    const cleanCommand = command.trim().toLowerCase();

    for (const pattern of this.processPatterns) {
      if (pattern.pattern.test(cleanCommand)) {
        console.log(`🎯 Detected long-running process: ${pattern.name} (${pattern.category})`);
        return pattern;
      }
    }

    return null;
  }

  /**
   * Run a command with foreground hang prevention
   */
  async runWithHangPrevention(command: string): Promise<ProcessRunResult> {
    const pattern = this.detectLongRunningProcess(command);

    if (!pattern) {
      // Not a long-running process, run normally
      try {
        const output = execSync(command, {
          cwd: this.projectRoot,
          encoding: 'utf8',
          timeout: 30000, // 30 second timeout for normal commands
        });
        return {
          success: true,
          message: `Command completed: ${output.trim()}`,
          backgrounded: false,
        };
      } catch (error: any) {
        return {
          success: false,
          message: `Command failed: ${error.message}`,
          backgrounded: false,
        };
      }
    }

    // Long-running process detected - background it
    return await this.runInBackground(command, pattern);
  }

  /**
   * Run a long-running process in the background
   */
  private async runInBackground(command: string, pattern: ProcessPattern): Promise<ProcessRunResult> {
    console.log(`🚀 Backgrounding long-running process: ${pattern.name}`);

    // Kill any existing process of the same type
    await this.killExistingProcess(pattern.name);

    // Set up log file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const logFile = path.join(this.logsDir, `${pattern.name}-${timestamp}.log`);

    // Create background command
    const backgroundCommand = `${command} > ${logFile} 2>&1 & echo $!`;

    try {
      // Start the process in background
      const pidOutput = execSync(backgroundCommand, {
        cwd: this.projectRoot,
        encoding: 'utf8',
        shell: '/bin/bash',
      });

      const pid = parseInt(pidOutput.trim());

      if (isNaN(pid)) {
        return {
          success: false,
          message: `Failed to start background process: invalid PID`,
          backgrounded: false,
        };
      }

      // Register the process
      const backgroundProcess: BackgroundProcess = {
        command,
        pid,
        logFile,
        healthCheck: pattern.healthCheck,
        startTime: new Date(),
        category: pattern.category,
      };

      this.runningProcesses.set(pattern.name, backgroundProcess);

      // Wait a moment for startup
      await this.sleep(3000);

      // Check if process is still running
      const isRunning = this.isProcessRunning(pid);
      if (!isRunning) {
        return {
          success: false,
          message: `Process ${pattern.name} failed to start (PID ${pid} not found)`,
          backgrounded: true,
        };
      }

      // Show initial log output
      const initialLogs = await this.getRecentLogs(logFile, 10);

      console.log(`✅ Process ${pattern.name} started in background (PID: ${pid})`);
      console.log(`📄 Log file: ${logFile}`);

      if (initialLogs) {
        console.log(`📋 Recent logs:\n${initialLogs}`);
      }

      // Check health if applicable
      if (pattern.healthCheck) {
        await this.waitForHealthCheck(pattern, 30000); // 30 second timeout
      }

      return {
        success: true,
        pid,
        logFile,
        healthCheck: pattern.healthCheck,
        message: `${pattern.name} started successfully in background (PID: ${pid})`,
        backgrounded: true,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to background process: ${error.message}`,
        backgrounded: false,
      };
    }
  }

  /**
   * Kill existing process of the same type
   */
  private async killExistingProcess(processName: string): Promise<void> {
    const existing = this.runningProcesses.get(processName);
    if (existing) {
      console.log(`🔄 Killing existing ${processName} process (PID: ${existing.pid})`);
      try {
        process.kill(existing.pid, 'SIGTERM');
        await this.sleep(2000); // Give it time to gracefully shutdown

        if (this.isProcessRunning(existing.pid)) {
          console.log(`💀 Force killing ${processName} (PID: ${existing.pid})`);
          process.kill(existing.pid, 'SIGKILL');
        }
      } catch (error) {
        console.log(`⚠️ Could not kill existing process: ${error}`);
      }

      this.runningProcesses.delete(processName);
    }
  }

  /**
   * Check if a process is still running
   */
  private isProcessRunning(pid: number): boolean {
    try {
      process.kill(pid, 0); // Signal 0 just checks if process exists
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get recent log output
   */
  private async getRecentLogs(logFile: string, lines: number = 20): Promise<string | null> {
    try {
      if (!fs.existsSync(logFile)) {
        return null;
      }

      const output = execSync(`tail -n ${lines} "${logFile}"`, {
        encoding: 'utf8',
        cwd: this.projectRoot,
      });

      return output.trim();
    } catch (error) {
      return null;
    }
  }

  /**
   * Wait for health check to pass
   */
  private async waitForHealthCheck(pattern: ProcessPattern, timeout: number = 30000): Promise<boolean> {
    if (!pattern.healthCheck) {
      return true;
    }

    console.log(`🏥 Waiting for health check: ${pattern.healthCheck}`);

    const startTime = Date.now();
    const interval = 2000; // Check every 2 seconds

    while (Date.now() - startTime < timeout) {
      try {
        if (pattern.healthCheck.startsWith('http')) {
          // HTTP health check
          const curlResult = execSync(`curl -s -f "${pattern.healthCheck}" -o /dev/null`, {
            encoding: 'utf8',
            timeout: 5000,
          });
          console.log(`✅ Health check passed: ${pattern.healthCheck}`);
          return true;
        } else {
          // Custom health check command
          execSync(pattern.healthCheck, {
            encoding: 'utf8',
            timeout: 5000,
          });
          console.log(`✅ Health check passed: ${pattern.healthCheck}`);
          return true;
        }
      } catch (error) {
        // Health check failed, wait and retry
        console.log(`⏳ Health check pending... (${Math.round((Date.now() - startTime) / 1000)}s)`);
        await this.sleep(interval);
      }
    }

    console.log(`⚠️ Health check timeout after ${timeout / 1000}s`);
    return false;
  }

  /**
   * Get status of all running background processes
   */
  getRunningProcesses(): Map<string, BackgroundProcess> {
    // Clean up dead processes
    for (const [name, process] of this.runningProcesses.entries()) {
      if (!this.isProcessRunning(process.pid)) {
        console.log(`💀 Process ${name} (PID: ${process.pid}) has died`);
        this.runningProcesses.delete(name);
      }
    }

    return new Map(this.runningProcesses);
  }

  /**
   * Show logs for a running process
   */
  async showLogs(processName: string, lines: number = 50): Promise<string | null> {
    const process = this.runningProcesses.get(processName);
    if (!process) {
      return null;
    }

    return await this.getRecentLogs(process.logFile, lines);
  }

  /**
   * Kill all running background processes
   */
  async killAllProcesses(): Promise<void> {
    console.log(`🔄 Killing ${this.runningProcesses.size} background processes...`);

    for (const [name, process] of this.runningProcesses.entries()) {
      await this.killExistingProcess(name);
    }

    this.runningProcesses.clear();
    console.log(`✅ All background processes killed`);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * CLI interface for testing
 */
async function main() {
  const prevention = new ForegroundHangPrevention();

  if (process.argv.length < 3) {
    console.log('🛡️ Foreground Hang Prevention System');
    console.log('Usage: node foreground-hang-prevention.ts "<command>"');
    console.log('\nExamples:');
    console.log('  node foreground-hang-prevention.ts "npm run dev"');
    console.log('  node foreground-hang-prevention.ts "yarn dev"');
    console.log('  node foreground-hang-prevention.ts "vite"');
    console.log('\nBackground process management:');
    console.log('  node foreground-hang-prevention.ts --status');
    console.log('  node foreground-hang-prevention.ts --logs <process-name>');
    console.log('  node foreground-hang-prevention.ts --kill-all');
    return;
  }

  const command = process.argv[2];

  if (command === '--status') {
    const running = prevention.getRunningProcesses();
    if (running.size === 0) {
      console.log('📝 No background processes running');
    } else {
      console.log(`📝 ${running.size} background processes running:`);
      for (const [name, process] of running.entries()) {
        const uptime = Math.round((Date.now() - process.startTime.getTime()) / 1000);
        console.log(`  • ${name} (PID: ${process.pid}, uptime: ${uptime}s)`);
        console.log(`    Log: ${process.logFile}`);
        if (process.healthCheck) {
          console.log(`    Health: ${process.healthCheck}`);
        }
      }
    }
    return;
  }

  if (command === '--kill-all') {
    await prevention.killAllProcesses();
    return;
  }

  if (command === '--logs') {
    const processName = process.argv[3];
    if (!processName) {
      console.log('❌ Please specify process name for logs');
      return;
    }

    const logs = await prevention.showLogs(processName);
    if (logs) {
      console.log(`📋 Recent logs for ${processName}:`);
      console.log(logs);
    } else {
      console.log(`❌ No logs available for ${processName}`);
    }
    return;
  }

  // Run command with hang prevention
  const result = await prevention.runWithHangPrevention(command);

  if (result.success) {
    console.log(`✅ ${result.message}`);
    if (result.backgrounded) {
      console.log(`🔧 Use "--logs ${prevention.detectLongRunningProcess(command)?.name}" to view logs`);
    }
  } else {
    console.log(`❌ ${result.message}`);
    process.exit(1);
  }
}

// Run if this is the main module
if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}
