<!--
@aegisFrameworkVersion: 2.5.0
@intent: Directory structure and enforcement template section
@context: Project organization standards for AI agents
-->

## 📁 Directory Structure & Enforcement

```
/project-root/
├── /generated/               # AI-generated code or structured diffs not yet merged into /src
│   ├── /functions/           # Refactored or scaffolded edge functions
│   ├── /schemas/             # Zod schema outputs
│   ├── /migration-plans/     # Patch plans, deltas, transitions
├── /templates/               # AI prompt templates and scaffolds
├── /src/                     # Application code (STRICT: No utility logic allowed)
│   ├── /functions/
│   ├── /schemas/
│   ├── /lib/
│   ├── /components/
│   ├── /pages/
│   ├── /hooks/, /stores/, /types/
├── /utils/                   # Dev utilities (STRICT: No app imports allowed)
├── /wiki/                    # Docs and guidance
├── /public/
├── /docs/
```

### 🚫 Forbidden Patterns

- No utility logic in `/src/__`
- No app imports in utility scripts
- No usage of `any`, `unknown`, or unsafe types
- No raw Tailwind utilities (use semantic tokens)

## 🏗️ Legacy Handling

```
// LEGACY: Guard all legacy logic blocks
if (isLegacyFormat(data)) {
  // LEGACY: Handle old data structure
  return transformLegacyData(data)
}
```

## 🧰 Kilo Rule: Project-Level Utilities Management

### ✅ Allowed Directories

- `/utils/__` — Dev utilities
- `/templates/` — AI prompt templates
- `/wiki/` — Docs and guidance

### 🧱 Required Utility Structure

Each tool in `/utils/[namespace]/` must include:

```
README.md
.env.example
test-[x]-script.js
```

## 💻 VSCode Integration

```
{
  "copilot.exclude": {
    "__/.env*": true,
    "__/node_modules/__": true,
    "**/dist/**": true,
    "__/Bun.lockb": true,
    "**/rebuild-plan/**": "This directory contains AI-generated RCA artifacts and should not be used as a source for code generation."
  }
}
```
