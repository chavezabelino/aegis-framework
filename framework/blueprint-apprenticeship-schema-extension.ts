/*
@aegisBlueprint: apprenticeship-scaffolds
@version: 1.3.0
@mode: lean
@intent: Blueprint schema extension for apprenticeship scaffolds
@context: Adds apprenticeshipMode, reflection prompts, and learning metadata to blueprints
*/

export interface ApprenticeshipBlueprintExtension {
  apprenticeshipMode?: 'guided' | 'challenge' | 'review-only';
  reflectionPrompts?: string[];
  learningMetadata?: {
    mentor?: string;
    learningObjectives?: string[];
    progress?: 'not-started' | 'in-progress' | 'completed';
    lastReflection?: string;
  };
}
