#!/usr/bin/env node

/**
 * @aegisBlueprint: planning-optimization
 * @version: 2.5.0
 * @mode: strict
 * @intent: MCP server for Aegis planning optimization commands
 * @context: Provides planning optimization to any IDE via MCP protocol
 * @model: claude-3-5-sonnet
 * @hash: 6f5a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a4
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

// Initialize the server
const server = new Server(
  {
    name: 'aegis-planning-optimization',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define Aegis planning optimization tools
const tools: Tool[] = [
  {
    name: 'aegis_plan_auto_detect',
    description: 'Automatically detect plan class and generate plan for user request',
    inputSchema: {
      type: 'object',
      properties: {
        userPrompt: {
          type: 'string',
          description: 'User request or feature description',
        },
      },
      required: ['userPrompt'],
    },
  },
  {
    name: 'aegis_plan_validate',
    description: 'Validate a plan against planning optimization constraints',
    inputSchema: {
      type: 'object',
      properties: {
        planClass: {
          type: 'string',
          enum: ['MVP-Fix', 'Surgical-Refactor', 'Systemic-Change'],
          description: 'Plan class to validate',
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
    description: 'Compare two plans and select the leaner one',
    inputSchema: {
      type: 'object',
      properties: {
        plan1Content: {
          type: 'string',
          description: 'First plan content',
        },
        plan1Class: {
          type: 'string',
          enum: ['MVP-Fix', 'Surgical-Refactor', 'Systemic-Change'],
          description: 'First plan class',
        },
        plan1Files: {
          type: 'number',
          description: 'Files touched by first plan',
        },
        plan2Content: {
          type: 'string',
          description: 'Second plan content',
        },
        plan2Class: {
          type: 'string',
          enum: ['MVP-Fix', 'Surgical-Refactor', 'Systemic-Change'],
          description: 'Second plan class',
        },
        plan2Files: {
          type: 'number',
          description: 'Files touched by second plan',
        },
      },
      required: ['plan1Content', 'plan1Class', 'plan1Files', 'plan2Content', 'plan2Class', 'plan2Files'],
    },
  },
  {
    name: 'aegis_plan_generate',
    description: 'Generate a plan template for the specified plan class',
    inputSchema: {
      type: 'object',
      properties: {
        planClass: {
          type: 'string',
          enum: ['MVP-Fix', 'Surgical-Refactor', 'Systemic-Change'],
          description: 'Plan class to generate template for',
        },
        userPrompt: {
          type: 'string',
          description: 'User request to base plan on',
        },
      },
      required: ['planClass', 'userPrompt'],
    },
  },
];

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools,
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'aegis_plan_auto_detect': {
      const { userPrompt } = args as { userPrompt: string };
      
      // Import and use the auto plan detector
      const { AutoPlanDetector } = await import('./auto-plan-detector.js');
      const detector = new AutoPlanDetector();
      const result = detector.analyzePrompt(userPrompt);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    case 'aegis_plan_validate': {
      const { planClass, planContent, filesTouched } = args as {
        planClass: string;
        planContent: string;
        filesTouched: number;
      };
      
      // Import and use the plan gate
      const { execSync } = await import('child_process');
      const fs = await import('fs');
      
      // Write plan to temporary file
      const tempFile = `/tmp/aegis-plan-${Date.now()}.md`;
      fs.writeFileSync(tempFile, planContent);
      
      try {
        const result = execSync(
          `node scripts/ci/plan-gate.mjs ${planClass} ${tempFile} ${filesTouched}`,
          { encoding: 'utf8' }
        );
        
        return {
          content: [
            {
              type: 'text',
              text: `✅ Plan validation passed: ${result.trim()}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Plan validation failed: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      } finally {
        // Clean up temp file
        try {
          fs.unlinkSync(tempFile);
        } catch {}
      }
    }

    case 'aegis_plan_compare': {
      const { plan1Content, plan1Class, plan1Files, plan2Content, plan2Class, plan2Files } = args as {
        plan1Content: string;
        plan1Class: string;
        plan1Files: number;
        plan2Content: string;
        plan2Class: string;
        plan2Files: number;
      };
      
      // Import and use the planner critic
      const { PlannerCritic } = await import('./planner-critic.js');
      const critic = new PlannerCritic();
      
      const analysis1 = critic.analyzePlan(plan1Content, plan1Class, plan1Files);
      const analysis2 = critic.analyzePlan(plan2Content, plan2Class, plan2Files);
      const comparison = critic.comparePlans(analysis1, analysis2);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(comparison, null, 2),
          },
        ],
      };
    }

    case 'aegis_plan_generate': {
      const { planClass, userPrompt } = args as {
        planClass: string;
        userPrompt: string;
      };
      
      // Import and use the auto plan detector to generate plan
      const { AutoPlanDetector } = await import('./auto-plan-detector.js');
      const detector = new AutoPlanDetector();
      const result = detector.analyzePrompt(userPrompt);
      
      return {
        content: [
          {
            type: 'text',
            text: result.suggestedPlan,
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start the server
const transport = new StdioServerTransport();
server.listen(transport);

console.error('Aegis Planning Optimization MCP Server started');
