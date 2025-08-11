/*
@aegisBlueprint: multiagent-orchestration
@version: 1.1.0-beta
@mode: strict
@intent: Adapter interface for multi-agent, handoff, and dependency resolution
@context: Implements v2.5.0 adapter protocol for tech stack translation
*/

export interface AdapterInterface {
  name: string;
  version: string;
  supportedModes: string[];
  translateBlueprint(blueprint: any): any;
  validateOutput(output: any): any;
  generateScaffold(blueprint: any): any;
  supportsMultiAgent(): boolean;
  handleAgentHandoff(context: any): any;
  resolveDependencies(components: any[]): any;
}
