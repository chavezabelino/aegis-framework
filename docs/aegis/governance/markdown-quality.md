# Markdown QUALITY

## Markdown Quality Assurance

## Overview

The Aegis Framework enforces strict Markdown quality standards across all documentation to ensure consistency,

readability, and Constitutional compliance.

## Configuration

### Markdownlint Rules

The project uses `.markdownlint.JSON` with the following key rules:

- **MD041**: First line must be a top-level heading (H1)

- **MD022**: Headings must be surrounded by blank lines

- **MD032**: Lists must be surrounded by blank lines

- **MD013**: Line length limit of 120 characters (excludes code blocks and tables)

- **MD012**: Maximum of 1 consecutive blank line

- **MD044**: Proper capitalization for technical terms

### Custom Rules

- **Line Length**: 120 characters for prose, unlimited for code blocks

- **Heading Hierarchy**: Proper H1 → H2 → H3 progression

- **List Formatting**: Consistent spacing and punctuation

- **Code Blocks**: Fenced code blocks with language specification

### Prettier Configuration

The project uses `.prettierrc.JSON` with Markdown-specific settings:

```json

{

  "printWidth": 120,

  "proseWrap": "always",

  "tabWidth": 2,

  "useTabs": false,

  "semi": false,

  "singleQuote": false,

  "trailingComma": "none",

  "bracketSpacing": false,

  "endOfLine": "lf"

}

```text

**Key Prettier Features for Markdown:**

- **Prose Wrapping**: Automatically wraps long lines at 120 characters

- **Consistent Spacing**: Maintains proper spacing around headings and lists

- **Code Block Formatting**: Preserves code block formatting while improving readability

- **List Alignment**: Ensures consistent list indentation and formatting

## Tools

### Comprehensive Formatting

```bash
npm run format:Markdown:comprehensive

```text

**Best option for complete formatting** - Combines Prettier and markdownlint:

- Formats with Prettier for consistent styling

- Applies markdownlint fixes for rule compliance

- Provides detailed summary of results

- Handles all common formatting issues automatically

### Prettier Formatting

```bash
npm run format:Markdown
npm run format:Markdown:check

```text

**Prettier** handles:

- Line wrapping and length consistency

- Spacing and indentation

- List formatting

- Code block formatting

- Overall document structure

### Audit Script

```bash
npm run audit:Markdown

```text

Comprehensive audit that:

- Scans all Markdown files (excluding `node_modules`, `dist`, `.git`)

- Generates detailed report in `.Aegis/Markdown-audit-report.JSON`

- Provides summary with error/warning counts

- Lists specific issues per file

### Auto-Fix Script

```bash
npm run fix:Markdown

```text

Automatically fixes common issues:

- Heading spacing

- List formatting

- Line length (where possible)

- Blank line consistency

### Quick Lint

```bash
npm run lint:Markdown

```text

Fast linting check with error reporting.

## Pre-commit Hooks

The `.husky/pre-commit` hook automatically:

- **Formats staged Markdown files** with Prettier

- **Lints staged Markdown files** with markdownlint

- **Runs Constitutional validation**

- **Prevents commits** with Markdown issues

## Workflow Integration

### Recommended Workflow

1. **Write/Edit Markdown**: Create or modify Markdown files

2. **Format with Prettier**: `npm run format:Markdown:comprehensive`

3. **Review Changes**: Check the formatting results

4. **Commit**: Pre-commit hooks will ensure quality

### IDE Integration

**VS Code Setup:**

```json

{

  "editor.formatOnSave": true,

  "editor.defaultFormatter": "esbenp.Prettier-vscode",

  "[Markdown]": {

    "editor.defaultFormatter": "esbenp.Prettier-vscode"

  }

}

```text

**Cursor Setup:**

- Install Prettier extension

- Enable format on save for Markdown files

- Use the comprehensive formatting script for bulk operations

## CI/CD Integration

The `.GitHub/workflows/Markdown-lint.yml` workflow:

- Triggers on Markdown file changes

- Runs comprehensive audit

- Uploads detailed reports as artifacts

- Fails builds with Markdown violations

## Common Issues and Fixes

### MD041: First Line Heading

**Issue**: File doesn't start with H1 heading **Fix**: Add `# Title` as first line

```markdown

## Document Title

Content here...

```text

### MD022: Heading Spacing

**Issue**: Headings not surrounded by blank lines **Fix**: Add blank lines before and after headings

```markdown

Previous content.

## Section Title

Section content.

```text

### MD032: List Spacing

**Issue**: Lists not surrounded by blank lines **Fix**: Add blank lines before and after lists

```markdown

Previous content.

- List item 1

- List item 2

Next content.

```text

### MD013: Line Length

**Issue**: Lines exceed 120 characters **Fix**: Break long lines at natural points

```markdown

This is a very long line that should be broken into multiple lines for better readability and to comply with the line

length limit.

```text

Becomes:

```markdown

This is a very long line that should be broken into multiple lines for better readability and to comply with the line

length limit.

```text

## Best Practices

### Writing Style

1. **Use Clear Headings**: Descriptive, hierarchical headings

2. **Keep Lines Short**: Break long lines at natural points

3. **Consistent Formatting**: Use consistent list styles and spacing

4. **Code Examples**: Use fenced code blocks with language specification

5. **Links and References**: Use descriptive link text

### ConstitutionalConstitutional Compliance

All Markdown files must include Constitutional annotations when generated by AI:

```markdown

<!--

@aegisBlueprint: <Blueprint-id>

@version: <version>

@mode: lean|strict|generative

@intent: <brief description>

@context: <relevant context>

@model: <ai-model>

@hash: <SHA256-hash>

-->

```text

### File Organization

- **README.md**: Project overview and getting started

- **docs/**: Comprehensive documentation

- **CHANGELOG.md**: Version history and changes

- **CONSTITUTION.md**: Governance framework

- **blueprints/**: Blueprint documentation

## Monitoring and Reporting

### Audit Reports

The audit system generates detailed reports including:

- Total files scanned

- Files with issues

- Error and warning counts

- Specific issue details per file

- Timestamp and metadata

### Quality Metrics

Track Markdown quality over time:

- Error rate per file

- Most common issues

- Files requiring manual review

- Improvement trends

## Troubleshooting

### Common Problems

1. **False Positives**: Some rules may be too strict for specific content

2. **Performance**: Large files may slow down linting

3. **Encoding Issues**: Ensure UTF-8 encoding for all files

### Solutions

1. **Rule Exceptions**: Use inline comments to disable specific rules

2. **File Exclusions**: Add files to `.markdownlintignore` if needed

3. **Batch Processing**: Use audit script for large-scale fixes

## Integration with Framework

The Markdown quality system integrates with:

- **Constitutional Compliance**: Ensures documentation meets governance standards

- **Blueprint Validation**: Validates Blueprint documentation quality

- **CI/CD Pipeline**: Automated quality gates

- **Pre-commit Hooks**: Prevents quality regressions

## Future Enhancements

Planned improvements:

- **Semantic Analysis**: Check for content quality beyond formatting

- **Link Validation**: Verify internal and external links

- **Image Optimization**: Check image formats and sizes

- **Accessibility**: Ensure Markdown meets accessibility standards
