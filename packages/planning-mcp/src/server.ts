#!/usr/bin/env node

/**
 * @aegisBlueprint: planning-optimization
 * @version: 1.0.0
 * @mode: strict
 * @intent: Production-ready MCP server for planning optimization
 * @context: Model Context Protocol server for IDE integration
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { AutoPlanDetector } from '../../../tools/auto-plan-detector';
import { PlannerCritic } from '../../../tools/planner-critic';
import { z } from 'zod';

// Schema definitions
const PlanAutoDetectArgsSchema = z.object({
  prompt: z.string().describe('User prompt to analyze'),
});

const PlanValidateArgsSchema = z.object({
  planClass: z.enum(['MVP-Fix', 'Surgical-Refactor', 'Systemic-Change']),
  planContent: z.string(),
  filesTouched: z.number(),
});

const PlanCompareArgsSchema = z.object({
  plan1Content: z.string(),
  plan2Content: z.string(),
  plan1Class: z.enum(['MVP-Fix', 'Surgical-Refactor', 'Systemic-Change']),
  plan2Class: z.enum(['MVP-Fix', 'Surgical-Refactor', 'Systemic-Change']),
  files1: z.number(),
  files2: z.number(),
});

class PlanningMCPServer {
  private server: Server;
  private detector: AutoPlanDetector;
  private critic: PlannerCritic;

  constructor() {
    this.server = new Server(
      {
        name: 'aegis-planning',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.detector = new AutoPlanDetector();
    this.critic = new PlannerCritic();
    this.setupTools();
  }

  private setupTools(): void {
    // Tool: Auto plan detection
    (this.server as any).setRequestHandler('tools/call', async (request: any) => {
      const { name, arguments: args } = (request as any).params || {};

      try {
        switch (name) {
          case 'aegis_plan_auto_detect': {
            const validatedArgs = PlanAutoDetectArgsSchema.parse(args);
            const result = this.detector.analyzePrompt(validatedArgs.prompt);

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      planClass: result.planClass,
                      confidence: result.confidence,
                      reasoning: result.reasoning,
                      suggestedPlan: result.suggestedPlan,
                      validationCommand: result.validationCommand,
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          }

          case 'aegis_plan_validate': {
            const validatedArgs = PlanValidateArgsSchema.parse(args);

            // Perform validation logic
            const constraints = {
              'MVP-Fix': { maxTokens: 2500, maxFiles: 2 },
              'Surgical-Refactor': { maxTokens: 6000, maxFiles: 5 },
              'Systemic-Change': { maxTokens: 15000, maxFiles: 10 },
            };

            const constraint = constraints[validatedArgs.planClass];
            const estimatedTokens = validatedArgs.planContent.length;
            const errors: string[] = [];
            const warnings: string[] = [];

            if (estimatedTokens > constraint.maxTokens) {
              errors.push(`Plan exceeds token limit: ${estimatedTokens}/${constraint.maxTokens}`);
            }

            if (validatedArgs.filesTouched > constraint.maxFiles) {
              errors.push(`Plan exceeds file limit: ${validatedArgs.filesTouched}/${constraint.maxFiles}`);
            }

            // Check for behavioral contracts
            if (
              !validatedArgs.planContent.includes('observable') &&
              !validatedArgs.planContent.includes('behavioral') &&
              !validatedArgs.planContent.includes('user-facing')
            ) {
              errors.push('Plan must include behavioral contracts');
            }

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      valid: errors.length === 0,
                      errors,
                      warnings,
                      planClass: validatedArgs.planClass,
                      estimatedTokens,
                      filesTouched: validatedArgs.filesTouched,
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          }

          case 'aegis_plan_compare': {
            const validatedArgs = PlanCompareArgsSchema.parse(args);

            const analysis1 = this.critic.analyzePlan(
              validatedArgs.plan1Content,
              validatedArgs.plan1Class,
              validatedArgs.files1
            );
            const analysis2 = this.critic.analyzePlan(
              validatedArgs.plan2Content,
              validatedArgs.plan2Class,
              validatedArgs.files2
            );
            const comparison = this.critic.comparePlans(analysis1, analysis2);

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      analysis1,
                      analysis2,
                      comparison,
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  error: error instanceof Error ? error.message : String(error),
                },
                null,
                2
              ),
            },
          ],
        };
      }
    });

    // Tool definitions
    (this.server as any).setRequestHandler('tools/list', async (request: any) => {
      return {
        tools: [
          {
            name: 'aegis_plan_auto_detect',
            description: 'Auto-detect plan class and generate plan from user prompt',
            inputSchema: {
              type: 'object',
              properties: {
                prompt: {
                  type: 'string',
                  description: 'User prompt to analyze',
                },
              },
              required: ['prompt'],
            },
          },
          {
            name: 'aegis_plan_validate',
            description: 'Validate plan against constraints and rules',
            inputSchema: {
              type: 'object',
              properties: {
                planClass: {
                  type: 'string',
                  enum: ['MVP-Fix', 'Surgical-Refactor', 'Systemic-Change'],
                },
                planContent: {
                  type: 'string',
                  description: 'Plan content to validate',
                },
                filesTouched: {
                  type: 'number',
                  description: 'Number of files the plan will touch',
                },
              },
              required: ['planClass', 'planContent', 'filesTouched'],
            },
          },
          {
            name: 'aegis_plan_compare',
            description: 'Compare two plans and recommend the leaner option',
            inputSchema: {
              type: 'object',
              properties: {
                plan1Content: {
                  type: 'string',
                  description: 'First plan content',
                },
                plan2Content: {
                  type: 'string',
                  description: 'Second plan content',
                },
                plan1Class: {
                  type: 'string',
                  enum: ['MVP-Fix', 'Surgical-Refactor', 'Systemic-Change'],
                },
                plan2Class: {
                  type: 'string',
                  enum: ['MVP-Fix', 'Surgical-Refactor', 'Systemic-Change'],
                },
                files1: {
                  type: 'number',
                  description: 'Number of files for first plan',
                },
                files2: {
                  type: 'number',
                  description: 'Number of files for second plan',
                },
              },
              required: ['plan1Content', 'plan2Content', 'plan1Class', 'plan2Class', 'files1', 'files2'],
            },
          },
        ],
      };
    });
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Aegis Planning Optimization MCP Server started');
  }
}

// Start server
const server = new PlanningMCPServer();
server.start().catch(error => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});
