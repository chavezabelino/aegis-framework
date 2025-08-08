/**
 * @aegisFrameworkVersion: 2.3.0
 * @intent: CLI for managing Cursor real-time integration
 * @context: Provides command-line interface for live Cursor workflow monitoring
 */

import { CursorRealtimeIntegration } from '../tools/cursor-realtime-integration';
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CursorRealtimeCLI {
  private integration: CursorRealtimeIntegration | null = null;
  private program: Command;

  constructor() {
    this.program = new Command();
    this.setupCommands();
  }

  private setupCommands(): void {
    this.program
      .name('cursor-realtime')
      .description('Cursor Real-time Integration CLI')
      .version('2.1.0');

    this.program
      .command('start')
      .description('Start Cursor real-time integration')
      .option('-v, --verbose', 'Enable verbose logging')
      .option('-d, --daemon', 'Run as daemon process')
      .action(async (options) => {
        await this.startIntegration(options);
      });

    this.program
      .command('stop')
      .description('Stop Cursor real-time integration')
      .action(async () => {
        await this.stopIntegration();
      });

    this.program
      .command('status')
      .description('Show integration status')
      .action(async () => {
        await this.showStatus();
      });

    this.program
      .command('monitor')
      .description('Monitor real-time events')
      .option('-f, --follow', 'Follow events in real-time')
      .option('-l, --limit <number>', 'Limit number of events to show', '50')
      .action(async (options) => {
        await this.monitorEvents(options);
      });

    this.program
      .command('stats')
      .description('Show session statistics')
      .option('-s, --session <id>', 'Show specific session stats')
      .action(async (options) => {
        await this.showStats(options);
      });

    this.program
      .command('feedback')
      .description('Show recent feedback')
      .option('-d, --date <date>', 'Show feedback for specific date (YYYY-MM-DD)')
      .option('-l, --limit <number>', 'Limit number of feedback items', '20')
      .action(async (options) => {
        await this.showFeedback(options);
      });

    this.program
      .command('patterns')
      .description('Show detected patterns')
      .option('-s, --session <id>', 'Show patterns for specific session')
      .option('-t, --type <type>', 'Filter by pattern type')
      .action(async (options) => {
        await this.showPatterns(options);
      });

    this.program
      .command('test')
      .description('Test integration with sample events')
      .option('-e, --events <number>', 'Number of test events to generate', '5')
      .action(async (options) => {
        await this.testIntegration(options);
      });
  }

  private async startIntegration(options: any): Promise<void> {
    try {
      console.log('🎯 Starting Cursor Real-time Integration...');
      
      this.integration = new CursorRealtimeIntegration();
      
      // Set up event listeners
      this.setupEventListeners(options.verbose);
      
      // Start integration
      await this.integration.start();
      
      if (options.daemon) {
        console.log('✅ Integration running as daemon process');
        console.log('Use "cursor-realtime stop" to stop the integration');
        
        // Keep process alive
        process.on('SIGINT', async () => {
          console.log('\n🛑 Received SIGINT, stopping integration...');
          await this.stopIntegration();
          process.exit(0);
        });
        
        process.on('SIGTERM', async () => {
          console.log('\n🛑 Received SIGTERM, stopping integration...');
          await this.stopIntegration();
          process.exit(0);
        });
      } else {
        console.log('✅ Integration started successfully');
        console.log('Press Ctrl+C to stop');
        
        // Wait for user to stop
        process.on('SIGINT', async () => {
          console.log('\n🛑 Stopping integration...');
          await this.stopIntegration();
          process.exit(0);
        });
      }
    } catch (error) {
      console.error('❌ Failed to start integration:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  }

  private async stopIntegration(): Promise<void> {
    if (!this.integration) {
      console.log('⚠️ No integration running');
      return;
    }

    try {
      await this.integration.stop();
      this.integration = null;
      console.log('✅ Integration stopped successfully');
    } catch (error) {
      console.error('❌ Failed to stop integration:', error instanceof Error ? error.message : String(error));
    }
  }

  private async showStatus(): Promise<void> {
    if (!this.integration) {
      console.log('📊 Integration Status: Not Running');
      return;
    }

    const stats = this.integration.getSessionStats();
    
    console.log('📊 Integration Status:');
    console.log('=====================');
    console.log(`Session ID: ${stats.sessionId}`);
    console.log(`Status: ${stats.isActive ? '🟢 Active' : '🔴 Inactive'}`);
    console.log(`Total Events: ${stats.totalEvents}`);
    console.log(`Patterns Detected: ${stats.patterns.length}`);
    
    if (stats.lastEvent) {
      console.log(`Last Event: ${stats.lastEvent.type} at ${stats.lastEvent.timestamp}`);
    }
  }

  private async monitorEvents(options: any): Promise<void> {
    const feedbackDir = path.resolve(__dirname, '..', '.aegis', 'cursor-feedback');
    const today = new Date().toISOString().split('T')[0];
    const feedbackFile = path.join(feedbackDir, `${today}.jsonl`);
    
    if (!fs.existsSync(feedbackFile)) {
      console.log('📡 No events found for today');
      return;
    }

    const events = fs.readFileSync(feedbackFile, 'utf8')
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line))
      .slice(-parseInt(options.limit));

    console.log(`📡 Recent Events (${events.length}):`);
    console.log('========================');

    for (const event of events) {
      const timestamp = new Date(event.timestamp).toLocaleTimeString();
      console.log(`[${timestamp}] ${event.type}: ${event.message || event.pattern || 'Event detected'}`);
    }

    if (options.follow) {
      console.log('\n🔄 Following events in real-time...');
      console.log('Press Ctrl+C to stop monitoring');
      
      // Watch for new events
      fs.watch(feedbackFile, (eventType) => {
        if (eventType === 'change') {
          const newEvents = fs.readFileSync(feedbackFile, 'utf8')
            .split('\n')
            .filter(line => line.trim())
            .map(line => JSON.parse(line))
            .slice(-1);
          
          if (newEvents.length > 0) {
            const event = newEvents[0];
            const timestamp = new Date(event.timestamp).toLocaleTimeString();
            console.log(`[${timestamp}] ${event.type}: ${event.message || event.pattern || 'Event detected'}`);
          }
        }
      });

      process.on('SIGINT', () => {
        console.log('\n🛑 Stopping event monitoring...');
        process.exit(0);
      });
    }
  }

  private async showStats(options: any): Promise<void> {
    const feedbackDir = path.resolve(__dirname, '..', '.aegis', 'cursor-feedback');
    
    if (options.session) {
      const sessionFile = path.join(feedbackDir, `session-${options.session}.json`);
      if (!fs.existsSync(sessionFile)) {
        console.log(`❌ Session ${options.session} not found`);
        return;
      }

      const sessionData = JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
      
      console.log(`📊 Session Statistics: ${options.session}`);
      console.log('==============================');
      console.log(`Start Time: ${sessionData.startTime}`);
      console.log(`End Time: ${sessionData.endTime}`);
      console.log(`Total Events: ${sessionData.totalEvents}`);
      console.log(`Duration: ${Math.round(sessionData.summary.duration / 1000)}s`);
      console.log('\nEvent Types:');
      Object.entries(sessionData.summary.eventTypes).forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });
      
      if (sessionData.summary.activeFiles.length > 0) {
        console.log('\nActive Files:');
        sessionData.summary.activeFiles.forEach((file: string) => {
          console.log(`  ${file}`);
        });
      }
    } else {
      // Show all sessions
      const sessionFiles = fs.readdirSync(feedbackDir)
        .filter(file => file.startsWith('session-') && file.endsWith('.json'))
        .map(file => {
          const sessionData = JSON.parse(fs.readFileSync(path.join(feedbackDir, file), 'utf8'));
          return {
            sessionId: sessionData.sessionId,
            startTime: sessionData.startTime,
            totalEvents: sessionData.totalEvents,
            duration: sessionData.summary.duration
          };
        })
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

      console.log('📊 All Sessions:');
      console.log('===============');
      
      for (const session of sessionFiles) {
        console.log(`Session: ${session.sessionId}`);
        console.log(`  Start: ${session.startTime}`);
        console.log(`  Events: ${session.totalEvents}`);
        console.log(`  Duration: ${Math.round(session.duration / 1000)}s`);
        console.log('');
      }
    }
  }

  private async showFeedback(options: any): Promise<void> {
    const feedbackDir = path.resolve(__dirname, '..', '.aegis', 'cursor-feedback');
    const date = options.date || new Date().toISOString().split('T')[0];
    const feedbackFile = path.join(feedbackDir, `${date}.jsonl`);
    
    if (!fs.existsSync(feedbackFile)) {
      console.log(`📝 No feedback found for ${date}`);
      return;
    }

    const feedback = fs.readFileSync(feedbackFile, 'utf8')
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line))
      .filter(item => item.type === 'immediate-feedback')
      .slice(-parseInt(options.limit));

    console.log(`📝 Recent Feedback (${feedback.length}):`);
    console.log('==========================');

    for (const item of feedback) {
      const timestamp = new Date(item.timestamp).toLocaleTimeString();
      console.log(`[${timestamp}] ${item.message}`);
      console.log(`  Pattern: ${item.pattern}`);
      console.log(`  File: ${item.context.activeFile}`);
      console.log('');
    }
  }

  private async showPatterns(options: any): Promise<void> {
    const feedbackDir = path.resolve(__dirname, '..', '.aegis', 'cursor-feedback');
    
    if (options.session) {
      const sessionFile = path.join(feedbackDir, `session-${options.session}.json`);
      if (!fs.existsSync(sessionFile)) {
        console.log(`❌ Session ${options.session} not found`);
        return;
      }

      const sessionData = JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
      const patterns = sessionData.patterns;
      
      if (options.type) {
        const filteredPatterns = patterns.filter((p: any) => p.type === options.type);
        console.log(`🎯 Patterns (${options.type}): ${filteredPatterns.length}`);
        console.log('========================');
        
        for (const pattern of filteredPatterns) {
          console.log(`Type: ${pattern.type}`);
          if (pattern.count) console.log(`Count: ${pattern.count}`);
          if (pattern.files) console.log(`Files: ${pattern.files.join(', ')}`);
          if (pattern.prompts) console.log(`Prompts: ${pattern.prompts.join(', ')}`);
          console.log('');
        }
      } else {
        console.log(`🎯 All Patterns: ${patterns.length}`);
        console.log('==================');
        
        for (const pattern of patterns) {
          console.log(`Type: ${pattern.type}`);
          if (pattern.count) console.log(`Count: ${pattern.count}`);
          if (pattern.files) console.log(`Files: ${pattern.files.join(', ')}`);
          if (pattern.prompts) console.log(`Prompts: ${pattern.prompts.join(', ')}`);
          console.log('');
        }
      }
    } else {
      console.log('❌ Please specify a session with --session <id>');
    }
  }

  private async testIntegration(options: any): Promise<void> {
    console.log('🧪 Testing Cursor Real-time Integration...');
    
    const integration = new CursorRealtimeIntegration();
    
    // Set up event listeners
    integration.on('started', () => {
      console.log('✅ Integration started for testing');
    });

    integration.on('immediate-pattern', (data) => {
      console.log(`🎯 Pattern detected: ${data.pattern}`);
    });

    integration.on('immediate-feedback', (data) => {
      console.log(`🎨 Feedback: ${data.message}`);
    });

    integration.on('stopped', () => {
      console.log('✅ Integration stopped');
    });

    // Start integration
    await integration.start();

    // Generate test events
    const testEvents = [
      {
        prompt: 'does this break the framework?',
        file: 'src/components/TestComponent.tsx',
        position: { line: 10, character: 5 }
      },
      {
        prompt: 'will this cause runtime failures?',
        file: 'src/utils/api.ts',
        position: { line: 25, character: 10 }
      },
      {
        prompt: 'should we document somehow?',
        file: 'docs/README.md',
        position: { line: 5, character: 1 }
      },
      {
        prompt: 'enhance the framework',
        file: 'framework/core.ts',
        position: { line: 15, character: 20 }
      },
      {
        prompt: 'real-world usage patterns',
        file: 'examples/demo.ts',
        position: { line: 8, character: 12 }
      }
    ];

    const numEvents = parseInt(options.events);
    const eventsToSend = testEvents.slice(0, numEvents);

    console.log(`📡 Generating ${eventsToSend.length} test events...`);

    for (let i = 0; i < eventsToSend.length; i++) {
      const event = eventsToSend[i];
      setTimeout(async () => {
        await integration.handleUserInput(event.prompt, event.file, event.position);
        console.log(`📝 Test event ${i + 1}/${eventsToSend.length} sent`);
      }, (i + 1) * 1000);
    }

    // Stop after all events
    setTimeout(async () => {
      await integration.stop();
      console.log('🧪 Test completed');
      process.exit(0);
    }, (eventsToSend.length + 2) * 1000);
  }

  private setupEventListeners(verbose: boolean): void {
    if (!this.integration) return;

    this.integration.on('started', (data) => {
      if (verbose) console.log('🎯 Real-time integration started:', data.sessionId);
    });

    this.integration.on('cursor-event', (data) => {
      if (verbose) console.log('📡 Cursor event:', data.event.type);
    });

    this.integration.on('immediate-pattern', (data) => {
      console.log('🎯 Immediate pattern detected:', data.pattern);
    });

    this.integration.on('immediate-feedback', (data) => {
      console.log('🎨 Immediate feedback:', data.message);
    });

    this.integration.on('stopped', (data) => {
      if (verbose) console.log('🛑 Real-time integration stopped:', data.sessionId);
    });
  }

  async run(): Promise<void> {
    await this.program.parseAsync();
  }
}

// Run CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const cli = new CursorRealtimeCLI();
  cli.run();
}

export { CursorRealtimeCLI };
