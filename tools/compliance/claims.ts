export interface ComplianceClaim {
  id: string;
  title: string;
  implementation: string;        // path to validator script
  required: boolean;             // failing this blocks
  args?: string[];               // extra CLI args for validator
  evidence?: string[];           // static references/notes
}

export const CLAIMS: ComplianceClaim[] = [
  {
    id: 'version-consistency',
    title: 'Intelligence features prevent version documentation drift',
    implementation: 'tools/validate-version-consistency.ts',
    required: true,
    args: ['--json'],
    evidence: ['Automated validation', 'Pre-commit integration', 'Auto-fix capability']
  },
  {
    id: 'constitutional-validation',
    title: 'Constitutional validation ensures comprehensive compliance',
    implementation: 'tools/validate-constitution.ts',
    required: true,
    args: ['--json'],
    evidence: ['Enhanced version consistency integration', 'Comprehensive validation system', 'Constitutional article validation', 'Violation detection and reporting']
  },
  {
    id: 'provenance-compliance',
    title: 'All files have proper provenance headers',
    implementation: 'tools/check-provenance.js',
    required: true,
    args: ['--json'],
    evidence: ['Provenance validation', 'Hash verification', 'Metadata compliance']
  },
  {
    id: 'path-validation',
    title: 'All files are in allowed directory structure',
    implementation: 'tools/check-paths.js',
    required: true,
    args: ['--json'],
    evidence: ['Path validation', 'Directory structure compliance', 'Framework organization']
  }
];
