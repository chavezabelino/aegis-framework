<!--
@aegisBlueprint: planning-optimization
# 🚀 Vibe Coding with Automatic Planning Optimization

@version: 1.0.0
@mode: lean
@intent: Guide for frictionless "vibe coding" with automatic planning optimization
@context: Enables users to just prompt and get results without manual planning steps
-->

# 🚀 Vibe Coding with Automatic Planning Optimization

> **Just prompt and get results!** The planning optimization system automatically applies best practices without manual
> steps.

## 🎯 **How It Works**

### **Traditional Approach** (Friction)

```
1. User writes prompt
2. Manually create plan
3. Manually validate plan
4. Manually run plan gate
5. Finally implement
```

### **Vibe Coding Approach** (Frictionless)

```
1. User writes prompt
2. AI automatically analyzes and plans
3. AI automatically validates
4. AI implements with contract-driven focus
5. Done! ✅
```

## 🚀 **Usage Examples**

### **Example 1: Simple Feature Addition**

```
# User just prompts
"Add a dark mode toggle to the app"

# AI automatically:
# - Detects: MVP-Fix (simple feature, 1-2 files)
# - Plans: Focus on observable behavior
# - Implements: Contract-driven solution
```

### **Example 2: Bug Fix**

```
# User just prompts
"Fix the login button not working"

# AI automatically:
# - Detects: MVP-Fix (bug fix, simple scope)
# - Plans: Focus on button behavior
# - Implements: Observable behavior fix
```

### **Example 3: Refactoring**

```
# User just prompts
"Refactor the authentication to use JWT"

# AI automatically:
# - Detects: Surgical-Refactor (refactoring, multiple files)
# - Plans: Preserve existing contracts
# - Implements: Maintain observable behavior
```

## 🛠️ **Tools for Vibe Coding**

### **1. Auto Plan Detection**

```
# Analyze any prompt automatically
npm run plan:auto "your prompt here"

# Or use the shorter alias
npm run vibe "your prompt here"
```

### **2. AI Agent Integration**

Use the **Vibe Coder** prompt with any AI agent:

- **GitHub Copilot**: Use `tools/prompts/Aegis-vibe-coder.kilo.md`
- **Cursor**: Same prompt, automatic planning
- **Claude**: Same prompt, automatic planning

### **3. Automatic Validation**

The AI agent automatically:

- ✅ Detects appropriate plan class
- ✅ Generates contract-driven plan
- ✅ Validates against constraints
- ✅ Implements with observable behavior focus

## 🎯 **What Happens Automatically**

### **1. Plan Class Detection**

AI analyzes your prompt for:

- **Scope**: "add", "fix", "refactor", "enhance"
- **Complexity**: "multiple files", "infrastructure", "breaking"
- **Effort**: "simple", "complex", "quick", "major"

### **2. Contract Extraction**

AI automatically extracts observable behaviors:

- "Users see login form" (not "use useState")
- "Form shows errors" (not "implement validation")
- "Button responds to clicks" (not "add onClick handler")

### **3. File Estimation**

AI estimates files to touch:

- Component/page mentions = +1 file
- API/service mentions = +1 file
- Test mentions = +1 file
- Multiple features = +1 file

### **4. Automatic Validation**

AI checks:

- ✅ Plan class appropriate for scope
- ✅ Contracts focus on observable behavior
- ✅ File count within limits
- ✅ No forbidden implementation details

## 🚀 **Real-World Examples**

### **User Prompt**: "Add user authentication"

**Auto-Analysis**:

- Plan Class: MVP-Fix
- Confidence: 85%
- Estimated Files: 2-3

**Auto-Generated Plan**:

```
## 1) Contracts

- [ ] Unauthenticated users are redirected to login page (observable behavior)
- [ ] Login form validates input and shows errors (user-facing)
- [ ] Successful login redirects to dashboard (behavioral contract)

## 2) Changes (≤ 2 files)

- File: `src/middleware/auth.ts` — add authentication middleware
- File: `src/pages/login.tsx` — create login page with form
```

**Auto-Implementation**: Contract-driven code that focuses on observable behavior

### **User Prompt**: "Fix the search not working"

**Auto-Analysis**:

- Plan Class: MVP-Fix
- Confidence: 90%
- Estimated Files: 1-2

**Auto-Generated Plan**:

```
## 1) Contracts

- [ ] Search input accepts user queries (observable behavior)
- [ ] Search results display correctly (user-facing)
- [ ] Search responds to user input (behavioral contract)

## 2) Changes (≤ 2 files)

- File: `src/components/Search.tsx` — fix search functionality
- File: `src/API/search.ts` — fix search API integration
```

**Auto-Implementation**: Focus on search working, not implementation details

## 🎯 **Benefits of Vibe Coding**

### **1. Zero Friction**

- No manual planning steps
- No manual validation
- No remembering commands
- Just prompt and get results

### **2. Automatic Best Practices**

- Contract-driven development
- Observable behavior focus
- Route equivalence acceptance
- Plan bloat prevention

### **3. Consistent Quality**

- Every request gets planning optimization
- Every implementation follows contracts
- Every solution is traceable
- Every change is validated

## 🚀 **Getting Started**

### **1. Use the Vibe Coder Prompt**

With any AI agent, use: `tools/prompts/Aegis-vibe-coder.kilo.md`

### **2. Try Auto Plan Detection**

```
npm run vibe "your feature request here"
```

### **3. Just Prompt Naturally**

```
"Add a user profile page"
"Fix the navigation menu"
"Refactor the data fetching"
"Add dark mode support"
```

The AI automatically handles all the planning optimization behind the scenes!

## 🎯 **Advanced Usage**

### **Manual Override** (When Needed)

If you need manual control:

```
# Manual plan validation
npm run plan:gate:mvp
npm run plan:gate:surgical
npm run plan:gate:systemic

# Manual plan comparison
npm run plan:critic plan1.md plan2.md
```

### **Custom Prompts**

For specific scenarios:

- **Plan Generation**: `tools/prompts/Aegis-plan-optimizer.kilo.md`
- **Test Generation**: `tools/prompts/contract-driven-tests.kilo.md`

**Remember**: Vibe coding is about **frictionless development__. Just prompt naturally, and let the AI handle the
planning optimization automatically! 🚀
