/*
@aegisBlueprint: apprenticeship-scaffolds
@version: 1.3.0
@mode: lean
@intent: Snapshot tests for apprenticeship scaffolds feature
@context: Validates blueprint extension, CLI, and mentor plugin for apprenticeship workflows
*/

import { ApprenticeshipBlueprintExtension } from '../../framework/blueprint-apprenticeship-schema-extension';
import { GhostMentor } from '../../framework/mentors/ghost-mentor-plugin';

describe('Apprenticeship Scaffolds', () => {
  it('should support apprenticeshipMode in blueprint extension', () => {
    const ext: ApprenticeshipBlueprintExtension = {
      apprenticeshipMode: 'guided',
      reflectionPrompts: ['What did you learn?', 'What was challenging?'],
      learningMetadata: {
        mentor: 'ghost',
        learningObjectives: ['reflection', 'iteration'],
        progress: 'in-progress',
        lastReflection: 'I learned about observability.',
      },
    };
    expect(ext.apprenticeshipMode).toBe('guided');
    expect(ext.reflectionPrompts?.length).toBe(2);
    expect(ext.learningMetadata?.mentor).toBe('ghost');
  });

  it('should provide feedback from Ghost Mentor', () => {
    const mentor = new GhostMentor();
    const feedback = mentor.provideFeedback({ answer: 'test' });
    expect(feedback).toContain('Ghost Mentor feedback');
  });
});
