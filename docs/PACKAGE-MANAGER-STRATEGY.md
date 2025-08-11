# 📦 Aegis Framework Package Manager Strategy

## 🎯 __The Clear Strategy**

### __Development (Internal): Bun 🚀**

- __All development commands__: `Bun`
- __All CI/CD__: `Bun`
- __All scripts__: `Bun`
- __All workflows__: `Bun`

### __Distribution (External): npm 📦**

- __End-user installation__: `npm install -g @Aegis-framework/CLI`
- __Package registry__: npm registry
- __User expectations__: Industry standard

## 🧠 __Why This Dual Approach Makes Sense**

### __Bun for Development:**

```bash
# Lightning fast development
Bun install          # 2-5 seconds vs npm's 15-30s
Bun CLI/script.ts    # Direct execution, no compilation
Bun test             # Built-in test runner
Bun run build        # Faster builds
```text

### __npm for Distribution:**

```bash
# Users expect this
npm install -g @Aegis-framework/CLI@2.4.0
Aegis-hydrate /project
```text

**Why npm for distribution?**

1. __Universal compatibility__: Every Node.js developer has npm
2. __Package registry__: npm is the standard registry
3. __Corporate environments__: Many enterprises block alternative package managers
4. __Ecosystem expectation__: CLI tools distribute via npm

## 📊 __Before vs After Fix**

### __❌ Before (Inconsistent):**

```json
{
  "scripts": {
    "build": "npm run validate:all && npm run build:Vite",
    "build:package": "node scripts/build-package.ts",
    "cursor:start": "Bun run CLI/cursor-realtime-CLI.ts start",
    "release": "node scripts/release.ts"
  }
}
```text

**Problem__: Mixing npm, node, and Bun commands randomly

### __✅ After (Consistent):**

```json
{
  "scripts": {
    "build": "Bun run validate:all && Bun run build:Vite",
    "build:package": "Bun scripts/build-package.ts",
    "cursor:start": "Bun run CLI/cursor-realtime-CLI.ts start",
    "release": "Bun scripts/release.ts"
  }
}
```text

**Solution__: All internal commands use `Bun`

## 🔧 __Developer Commands (All Bun)**

### __Development:**

```bash
Bun install                    # Install dependencies
Bun dev                        # Development server
Bun test                       # Run tests
Bun CLI/Aegis-hydrate.ts       # Run CLI directly
```text

### __Building:**

```bash
Bun run build                  # Build project
Bun run build:package          # Build npm package
Bun scripts/release.ts         # Release automation
```text

### __Framework Operations:**

```bash
Bun CLI/Aegis-conductor.ts     # Governance
Bun CLI/Aegis-eval.ts run      # Evaluations
Bun CLI/Aegis-orient.ts        # Orientation
```text

## 📦 __End-User Distribution (npm)**

### __Installation (What Users Do):**

```bash
# Global installation (standard)
npm install -g @Aegis-framework/CLI@2.4.0

# Project-specific installation
npm install @Aegis-framework/CLI@2.4.0

# Usage (same regardless of how they installed)
Aegis-hydrate /path/to/project
Aegis-conductor init
```text

### __Package Structure:**

```text
@Aegis-framework/CLI/
├── bin/
│   ├── Aegis-hydrate        # Global executable
│   ├── Aegis-conductor      # Governance tool
│   └── Aegis-eval           # Evaluation tool
├── lib/                     # Compiled/source code
├── package.JSON             # npm package metadata
└── README.md               # Installation instructions
```text

## 🏗️ __Build Pipeline Strategy**

### __Development → npm Package:**

```bash
# 1. Development (Bun)
Bun install
Bun run build
Bun test

# 2. Package Building (Bun)
Bun scripts/build-package.ts  # Creates dist/Aegis-CLI/

# 3. npm Publishing (npm - registry upload)
cd dist/Aegis-CLI/
npm publish

# 4. User Installation (npm - dependency resolution)
npm install -g @Aegis-framework/CLI@2.4.0
```text

## 🔍 __Why the Confusion Happened**

### __1. Distribution Complexity:**

We conflated "development package manager" with "distribution package manager"

### __2. Legacy Scripts:**

The project evolved from npm → hybrid → Bun, leaving inconsistent scripts

### __3. Industry Patterns:**

Many projects use the same package manager for dev and distribution, but that's not always optimal

## ✅ __The Fix Applied**

### __Changed in package.JSON:**

- ❌ `"build": "npm run validate:all && npm run build:Vite"`
- ✅ `"build": "Bun run validate:all && Bun run build:Vite"`

- ❌ `"build:package": "node scripts/build-package.ts"`
- ✅ `"build:package": "Bun scripts/build-package.ts"`

- ❌ `"release": "node scripts/release.ts"`
- ✅ `"release": "Bun scripts/release.ts"`

### __GitHub Actions:**

- ❌ `actions/setup-node@v4` + `npm install`
- ✅ `oven-sh/setup-Bun@v2` + `Bun install`

## 🎯 __Clear Rules Going Forward**

### __Development Rules:**

1. __All scripts use `Bun`**
2. __All CI/CD uses `Bun`**
3. __All direct execution uses `Bun`**
4. __No `npm run` in internal scripts**
5. __No `node script.ts` - use `Bun script.ts`**

### __Distribution Rules:**

1. __Users install via `npm install -g @Aegis-framework/CLI`**
2. __Package published to npm registry**
3. __Documentation shows npm installation**
4. __Corporate compatibility via npm**

## 🚀 __Result: Best of Both Worlds**

- ⚡ __Lightning fast development__ with Bun
- 🌍 __Universal distribution__ with npm
- 🔧 __Developer velocity__ with modern tooling
- 📦 __User accessibility__ with standard packaging

**No more hybrid confusion - clear separation of concerns!__ ✨
