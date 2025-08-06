/*
@aegisBlueprint: enhanced-blueprint-auto-repair
@version: 1.2.1
@mode: lean
@intent: Replay-diff test for ML-driven blueprint auto-repair engine
@context: Ensures deterministic repair output for the same blueprint input
*/

import { AutoRepairMLEngine } from '../../framework/healing/auto-repair-ml-engine';
import { Blueprint } from '../../framework/healing/types';

describe('AutoRepairMLEngine Replay-Diff', () => {
  const engine = new AutoRepairMLEngine();
  const blueprint: Blueprint = {
    id: 'replay-blueprint',
    version: '1.0.0',
    content: { id: 'replay-blueprint', version: '1.0.0' },
  };

  it('should produce deterministic repair actions for the same input', () => {
    const patterns1 = engine.analyzeBlueprint(blueprint);
    const actions1 = engine.repairBlueprint(blueprint, patterns1);
    const patterns2 = engine.analyzeBlueprint(blueprint);
    const actions2 = engine.repairBlueprint(blueprint, patterns2);
    expect(actions1).toEqual(actions2);
  });
});
