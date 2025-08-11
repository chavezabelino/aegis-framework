<!--
@aegisBlueprint: planning-optimization
# 🚀 Vibe Coding with Automatic Planning Optimization

@version: 1.0.0
@mode: lean
@intent: Guide for frictionless "vibe coding" with automatic planning optimization
@context: Enables users to just prompt and get results without manual planning steps
-->

# 🚀 Vibe Coding with Automatic Planning Optimization

> __Just prompt and get results!__ The planning optimization system automatically applies best practices without manual
> steps.

## 🎯 __How It Works**

### __Traditional Approach__ (Friction)

```text
1. User writes prompt
2. Manually create plan
3. Manually validate plan
4. Manually run plan gate
5. Finally implement
```text

### __Vibe Coding Approach__ (Frictionless)

```text
1. User writes prompt
2. AI automatically analyzes and plans
3. AI automatically validates
4. AI implements with contract-driven focus
5. Done! ✅
```text

## 🚀 __Usage Examples**

### __Example 1: Simple Feature Addition**

```bash
# User just prompts
"Add a dark mode toggle to the app"

# AI automatically:
# - Detects: MVP-Fix (simple feature, 1-2 files)
# - Plans: Focus on observable behavior
# - Implements: Contract-driven solution
```text

### __Example 2: Bug Fix**

```bash
# User just prompts
"Fix the login button not working"

# AI automatically:
# - Detects: MVP-Fix (bug fix, simple scope)
# - Plans: Focus on button behavior
# - Implements: Observable behavior fix
```text

### __Example 3: Refactoring**

```bash
# User just prompts
"Refactor the authentication to use JWT"

# AI automatically:
# - Detects: Surgical-Refactor (refactoring, multiple files)
# - Plans: Preserve existing contracts
# - Implements: Maintain observable behavior
```text

## 🛠️ __Tools for Vibe Coding**

### __1. Auto Plan Detection**

```bash
# Analyze any prompt automatically
npm run plan:auto "your prompt here"

# Or use the shorter alias
npm run vibe "your prompt here"
```text

### __2. AI Agent Integration**

Use the __Vibe Coder__ prompt with any AI agent:

- __GitHub Copilot__: Use `tools/prompts/Aegis-vibe-coder.kilo.md`
- __Cursor__: Same prompt, automatic planning
- __Claude__: Same prompt, automatic planning

### __3. Automatic Validation**

The AI agent automatically:

- ✅ Detects appropriate plan class
- ✅ Generates contract-driven plan
- ✅ Validates against constraints
- ✅ Implements with observable behavior focus

## 🎯 __What Happens Automatically**

### __1. Plan Class Detection**

AI analyzes your prompt for:

- __Scope__: "add", "fix", "refactor", "enhance"
- __Complexity__: "multiple files", "infrastructure", "breaking"
- __Effort__: "simple", "complex", "quick", "major"

### __2. Contract Extraction**

AI automatically extracts observable behaviors:

- "Users see login form" (not "use useState")
- "Form shows errors" (not "implement validation")
- "Button responds to clicks" (not "add onClick handler")

### __3. File Estimation**

AI estimates files to touch:

- Component/page mentions = +1 file
- API/service mentions = +1 file
- Test mentions = +1 file
- Multiple features = +1 file

### __4. Automatic Validation**

AI checks:

- ✅ Plan class appropriate for scope
- ✅ Contracts focus on observable behavior
- ✅ File count within limits
- ✅ No forbidden implementation details

## 🚀 __Real-World Examples**

### __User Prompt__: "Add user authentication"

**Auto-Analysis__:

- Plan Class: MVP-Fix
- Confidence: 85%
- Estimated Files: 2-3

**Auto-Generated Plan__:

```markdown
## 1) Contracts

- [ ] Unauthenticated users are redirected to login page (observable behavior)
- [ ] Login form validates input and shows errors (user-facing)
- [ ] Successful login redirects to dashboard (behavioral contract)

## 2) Changes (≤ 2 files)

- File: `src/middleware/auth.ts` — add authentication middleware
- File: `src/pages/login.tsx` — create login page with form
```text

**Auto-Implementation__: Contract-driven code that focuses on observable behavior

### __User Prompt__: "Fix the search not working"

**Auto-Analysis__:

- Plan Class: MVP-Fix
- Confidence: 90%
- Estimated Files: 1-2

**Auto-Generated Plan__:

```markdown
## 1) Contracts

- [ ] Search input accepts user queries (observable behavior)
- [ ] Search results display correctly (user-facing)
- [ ] Search responds to user input (behavioral contract)

## 2) Changes (≤ 2 files)

- File: `src/components/Search.tsx` — fix search functionality
- File: `src/API/search.ts` — fix search API integration
```text

**Auto-Implementation__: Focus on search working, not implementation details

## 🎯 __Benefits of Vibe Coding**

### __1. Zero Friction**

- No manual planning steps
- No manual validation
- No remembering commands
- Just prompt and get results

### __2. Automatic Best Practices**

- Contract-driven development
- Observable behavior focus
- Route equivalence acceptance
- Plan bloat prevention

### __3. Consistent Quality**

- Every request gets planning optimization
- Every implementation follows contracts
- Every solution is traceable
- Every change is validated

## 🚀 __Getting Started**

### __1. Use the Vibe Coder Prompt**

With any AI agent, use: `tools/prompts/Aegis-vibe-coder.kilo.md`

### __2. Try Auto Plan Detection**

```bash
npm run vibe "your feature request here"
```text

### __3. Just Prompt Naturally**

```text
"Add a user profile page"
"Fix the navigation menu"
"Refactor the data fetching"
"Add dark mode support"
```text

The AI automatically handles all the planning optimization behind the scenes!

## 🎯 __Advanced Usage**

### __Manual Override__ (When Needed)

If you need manual control:

```bash
# Manual plan validation
npm run plan:gate:mvp
npm run plan:gate:surgical
npm run plan:gate:systemic

# Manual plan comparison
npm run plan:critic plan1.md plan2.md
```text

### __Custom Prompts**

For specific scenarios:

- __Plan Generation__: `tools/prompts/Aegis-plan-optimizer.kilo.md`
- __Test Generation__: `tools/prompts/contract-driven-tests.kilo.md`

**Remember__: Vibe coding is about __frictionless development__. Just prompt naturally, and let the AI handle the
planning optimization automatically! 🚀
