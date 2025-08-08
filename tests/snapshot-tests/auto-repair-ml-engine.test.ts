/*
@aegisBlueprint: enhanced-blueprint-auto-repair
@version: 1.2.1
@mode: lean
@intent: Snapshot tests for ML-driven blueprint auto-repair engine
@context: Validates deterministic output and traceability for blueprint repair actions
*/

import { AutoRepairMLEngine } from '../../framework/healing/auto-repair-ml-engine';
import { Blueprint } from '../../framework/healing/types';

describe('AutoRepairMLEngine', () => {
  const engine = new AutoRepairMLEngine();
  const validBlueprint: Blueprint = {
    id: 'test-blueprint',
    version: '2.3.0',
    content: { id: 'test-blueprint', version: '1.0.0' },
  };
  const missingIdBlueprint: Blueprint = {
    id: 'test-blueprint',
    version: '1.0.0',
    content: { version: '1.0.0' },
  };
  const invalidVersionBlueprint: Blueprint = {
    id: 'test-blueprint',
    version: '1.0.0',
    content: { id: 'test-blueprint', version: 123 },
  };

  it('should return no error patterns for a valid blueprint', () => {
    const patterns = engine.analyzeBlueprint(validBlueprint);
    expect(patterns).toEqual([]);
  });

  it('should detect missing id field', () => {
    const patterns = engine.analyzeBlueprint(missingIdBlueprint);
    expect(patterns).toEqual([
      {
        code: 'MISSING_ID_FIELD',
        description: 'Blueprint content is missing required "id" field.',
        confidence: 0.9,
      },
    ]);
  });

  it('should detect invalid version type', () => {
    const patterns = engine.analyzeBlueprint(invalidVersionBlueprint);
    expect(patterns).toEqual([
      {
        code: 'INVALID_VERSION_TYPE',
        description: 'Blueprint content "version" field should be a string.',
        confidence: 0.9,
      },
    ]);
  });
});
