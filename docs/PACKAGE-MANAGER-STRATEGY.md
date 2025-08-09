# 📦 Aegis Framework Package Manager Strategy

## 🎯 **The Clear Strategy**

### **Development (Internal): Bun 🚀**
- **All development commands**: `bun`
- **All CI/CD**: `bun` 
- **All scripts**: `bun`
- **All workflows**: `bun`

### **Distribution (External): NPM 📦**
- **End-user installation**: `npm install -g @aegis-framework/cli`
- **Package registry**: NPM registry
- **User expectations**: Industry standard

## 🧠 **Why This Dual Approach Makes Sense**

### **Bun for Development:**
```bash
# Lightning fast development
bun install          # 2-5 seconds vs npm's 15-30s
bun cli/script.ts    # Direct execution, no compilation
bun test             # Built-in test runner
bun run build        # Faster builds
```

### **NPM for Distribution:**
```bash
# Users expect this
npm install -g @aegis-framework/cli@2.4.0
aegis-hydrate /project
```

**Why NPM for distribution?**
1. **Universal compatibility**: Every Node.js developer has NPM
2. **Package registry**: NPM is the standard registry
3. **Corporate environments**: Many enterprises block alternative package managers
4. **Ecosystem expectation**: CLI tools distribute via NPM

## 📊 **Before vs After Fix**

### **❌ Before (Inconsistent):**
```json
{
  "scripts": {
    "build": "npm run validate:all && npm run build:vite",
    "build:package": "node scripts/build-package.ts",
    "cursor:start": "bun run cli/cursor-realtime-cli.ts start",
    "release": "node scripts/release.ts"
  }
}
```
**Problem**: Mixing npm, node, and bun commands randomly

### **✅ After (Consistent):**
```json
{
  "scripts": {
    "build": "bun run validate:all && bun run build:vite",
    "build:package": "bun scripts/build-package.ts", 
    "cursor:start": "bun run cli/cursor-realtime-cli.ts start",
    "release": "bun scripts/release.ts"
  }
}
```
**Solution**: All internal commands use `bun`

## 🔧 **Developer Commands (All Bun)**

### **Development:**
```bash
bun install                    # Install dependencies
bun dev                        # Development server
bun test                       # Run tests
bun cli/aegis-hydrate.ts       # Run CLI directly
```

### **Building:**
```bash
bun run build                  # Build project
bun run build:package          # Build NPM package
bun scripts/release.ts         # Release automation
```

### **Framework Operations:**
```bash
bun cli/aegis-conductor.ts     # Governance
bun cli/aegis-eval.ts run      # Evaluations
bun cli/aegis-orient.ts        # Orientation
```

## 📦 **End-User Distribution (NPM)**

### **Installation (What Users Do):**
```bash
# Global installation (standard)
npm install -g @aegis-framework/cli@2.4.0

# Project-specific installation  
npm install @aegis-framework/cli@2.4.0

# Usage (same regardless of how they installed)
aegis-hydrate /path/to/project
aegis-conductor init
```

### **Package Structure:**
```
@aegis-framework/cli/
├── bin/
│   ├── aegis-hydrate        # Global executable
│   ├── aegis-conductor      # Governance tool
│   └── aegis-eval           # Evaluation tool
├── lib/                     # Compiled/source code
├── package.json             # NPM package metadata
└── README.md               # Installation instructions
```

## 🏗️ **Build Pipeline Strategy**

### **Development → NPM Package:**
```bash
# 1. Development (Bun)
bun install
bun run build
bun test

# 2. Package Building (Bun)
bun scripts/build-package.ts  # Creates dist/aegis-cli/

# 3. NPM Publishing (NPM - registry upload)
cd dist/aegis-cli/
npm publish

# 4. User Installation (NPM - dependency resolution)
npm install -g @aegis-framework/cli@2.4.0
```

## 🔍 **Why the Confusion Happened**

### **1. Distribution Complexity:**
We conflated "development package manager" with "distribution package manager"

### **2. Legacy Scripts:**
The project evolved from npm → hybrid → bun, leaving inconsistent scripts

### **3. Industry Patterns:**
Many projects use the same package manager for dev and distribution, but that's not always optimal

## ✅ **The Fix Applied**

### **Changed in package.json:**
- ❌ `"build": "npm run validate:all && npm run build:vite"`
- ✅ `"build": "bun run validate:all && bun run build:vite"`

- ❌ `"build:package": "node scripts/build-package.ts"`  
- ✅ `"build:package": "bun scripts/build-package.ts"`

- ❌ `"release": "node scripts/release.ts"`
- ✅ `"release": "bun scripts/release.ts"`

### **GitHub Actions:**
- ❌ `actions/setup-node@v4` + `npm install`
- ✅ `oven-sh/setup-bun@v2` + `bun install`

## 🎯 **Clear Rules Going Forward**

### **Development Rules:**
1. **All scripts use `bun`**
2. **All CI/CD uses `bun`** 
3. **All direct execution uses `bun`**
4. **No `npm run` in internal scripts**
5. **No `node script.ts` - use `bun script.ts`**

### **Distribution Rules:**
1. **Users install via `npm install -g @aegis-framework/cli`**
2. **Package published to NPM registry**
3. **Documentation shows NPM installation**
4. **Corporate compatibility via NPM**

## 🚀 **Result: Best of Both Worlds**

- ⚡ **Lightning fast development** with Bun
- 🌍 **Universal distribution** with NPM
- 🔧 **Developer velocity** with modern tooling
- 📦 **User accessibility** with standard packaging

**No more hybrid confusion - clear separation of concerns!** ✨
