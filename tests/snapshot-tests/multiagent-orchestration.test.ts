/*
@aegisBlueprint: multiagent-orchestration
@version: 1.1.0-beta
@mode: strict
@intent: Snapshot test for multi-agent orchestration and MCP metadata
@context: Validates blueprint schema, agent manifest, and MCP event emission
*/

import fs from 'fs';
import path from 'path';

describe('Multi-Agent Orchestration', () => {
  it('should include agents and coordination in blueprint', () => {
    const blueprint = fs.readFileSync(path.join(__dirname, '../../blueprints/feat-public-viewing/blueprint.yaml'), 'utf-8');
    expect(blueprint).toMatch(/agents:/);
    expect(blueprint).toMatch(/coordination:/);
  });

  it('should have agent manifest with coordination support', () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '../../framework/agent-manifest.json'), 'utf-8'));
    const copilot = (manifest.agentManifests || []).find((a: any) => a.agentId === 'github-copilot');
    expect(copilot.agentId).toBe('github-copilot');
    expect(copilot.coordinationSupport.handoffs).toBe(true);
  });

  it('should emit MCP events', () => {
    const mcpEvents = fs.readFileSync(path.join(__dirname, '../../framework/observability/mcp-events.jsonl'), 'utf-8');
    expect(mcpEvents).toMatch(/mcp_execution_start/);
    expect(mcpEvents).toMatch(/mcp_execution_complete/);
  });
});
