/**
 * @aegisBlueprint: feat-public-viewing
 * @version: 2.5.0
 * @mode: strict
 * @intent: Type definitions for website components
 * @context: Centralized types for website UI components
 * @model: claude-3-5-sonnet
 * @hash: 9f8e4b3c2d0e5f6b8c9d0e1f2a3b4c5d6e7f8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5
 */

export interface FrameworkData {
  version: string;
  status: 'stable' | 'beta' | 'deprecated' | 'experimental';
  lastUpdated: string;
  features: string[];
}

export interface DashboardProps {
  title?: string;
  showStatus?: boolean;
}

export interface FrameworkStatusProps {
  data?: FrameworkData;
  showDetails?: boolean;
}

export interface HomepageFeatureProps {
  title: string;
  description: string;
  icon?: string;
}
