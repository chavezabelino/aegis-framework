/*
@aegisBlueprint: apprenticeship-scaffolds
@version: 1.3.0
@mode: lean
@intent: Replay test for deterministic apprenticeship scaffold outputs
@context: Ensures blueprint extension and CLI generate reproducible outputs
*/

import { execSync } from 'child_process';
const fs = require('fs');
const path = require('path');

describe('Apprenticeship Scaffolds Replay', () => {
  it('should generate identical apprenticeship CLI output on replay', () => {
    const output1 = execSync(
      'node cli/apprenticeship-cli.cjs --mode guided --blueprint blueprints/feat-public-viewing/blueprint.yaml'
    ).toString();
    const output2 = execSync(
      'node cli/apprenticeship-cli.cjs --mode guided --blueprint blueprints/feat-public-viewing/blueprint.yaml'
    ).toString();
    expect(output1).toBe(output2);
  });

  it('should match snapshot for apprenticeshipMode in blueprint', () => {
    const blueprint = fs.readFileSync(
      path.join(__dirname, '../../blueprints/feat-public-viewing/blueprint.yaml'),
      'utf-8'
    );
    expect(blueprint).toMatchSnapshot();
  });
});
