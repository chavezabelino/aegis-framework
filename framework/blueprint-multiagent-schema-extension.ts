/*
@aegisBlueprint: multiagent-orchestration
@version: 1.1.0-beta
@mode: strict
@intent: Blueprint schema extension for multi-agent orchestration and coordination
@context: Adds agents, coordination, and handoff fields for v1.1.0-beta compliance
*/

export interface AgentRole {
  agent: string;
  role: string;
  scope?: string[];
}

export interface Coordination {
  strategy: 'sequential' | 'parallel' | 'hybrid';
  handoff?: Array<{
    from: string;
    to: string;
    trigger: string;
  }>;
}

export interface MultiAgentBlueprintExtension {
  agents: {
    primary: string;
    fallback?: string;
    specialized?: AgentRole[];
  };
  coordination?: Coordination;
}
