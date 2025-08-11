<!--
@aegisBlueprint: planning-optimization
# 🚀 IDE Integration with MCP Support

@version: 1.0.0
@mode: lean
@intent: IDE integration guide for planning optimization with MCP support
@context: Works with Cursor, VS Code, and any MCP-compatible IDE
-->

# 🚀 IDE Integration with MCP Support

> __Universal planning optimization__ that works with any IDE through MCP (Model Context Protocol).

## 🎯 __Supported IDEs**

### __Cursor**

- __Built-in AI__: Native integration with planning optimization
- __MCP Support__: Full MCP protocol support
- __Command Palette__: Access Aegis commands directly
- __Auto-completion__: Planning suggestions in real-time

### __VS Code**

- __GitHub Copilot__: Enhanced with planning optimization
- __Claude Extension__: Full planning optimization support
- __MCP Extensions__: Native MCP protocol support
- __Command Palette__: Aegis commands available

### __JetBrains IDEs**

- __AI Assistant__: Planning optimization integration
- __MCP Plugins__: Full MCP protocol support
- __Tool Windows__: Dedicated Aegis planning panel

### __Any MCP-Compatible Editor**

- __Universal Support__: Works with any MCP-compatible editor
- __Protocol Standard__: Uses Model Context Protocol
- __Tool Integration__: Seamless command execution

## 🚀 __MCP Server Setup**

### __1. Install MCP Server**

```bash
# Install Aegis MCP server
npm install -g @Aegis-framework/MCP-server

# Or use local installation
npm install @modelcontextprotocol/sdk
```text

### __2. Configure IDE**

#### __Cursor Configuration**

```json
// .cursor/settings.JSON
{
  "mcpServers": {
    "Aegis-planning": {
      "command": "node",
      "args": ["tools/MCP-Aegis-server.ts"],
      "env": {}
    }
  }
}
```text

#### __VS Code Configuration**

```json
// .vscode/settings.JSON
{
  "MCP.servers": {
    "Aegis-planning": {
      "command": "node",
      "args": ["tools/MCP-Aegis-server.ts"]
    }
  }
}
```text

#### __JetBrains Configuration**

```yaml
# .idea/MCP-servers.xml
<MCP-servers> <server name="Aegis-planning"> <command>node</command> <args> <arg>tools/MCP-Aegis-server.ts</arg> </args>
</server> </MCP-servers>
```text

## 🛠️ __Available MCP Tools**

### __1. Auto Plan Detection**

```json
{
  "name": "aegis_plan_auto_detect",
  "description": "Automatically detect plan class and generate plan for user request",
  "inputSchema": {
    "type": "object",
    "properties": {
      "userPrompt": {
        "type": "string",
        "description": "User request or feature description"
      }
    }
  }
}
```text

**Usage__: AI agents automatically call this when users make requests.

### __2. Plan Validation**

```json
{
  "name": "aegis_plan_validate",
  "description": "Validate a plan against planning optimization constraints",
  "inputSchema": {
    "type": "object",
    "properties": {
      "planClass": {
        "type": "string",
        "enum": ["MVP-Fix", "Surgical-Refactor", "Systemic-Change"]
      },
      "planContent": {
        "type": "string"
      },
      "filesTouched": {
        "type": "number"
      }
    }
  }
}
```text

**Usage__: Validates plans before implementation.

### __3. Plan Comparison**

```json
{
  "name": "aegis_plan_compare",
  "description": "Compare two plans and select the leaner one",
  "inputSchema": {
    "type": "object",
    "properties": {
      "plan1Content": {"type": "string"},
      "plan1Class": {"type": "string"},
      "plan1Files": {"type": "number"},
      "plan2Content": {"type": "string"},
      "plan2Class": {"type": "string"},
      "plan2Files": {"type": "number"}
    }
  }
}
```text

**Usage__: Compares alternative approaches automatically.

### __4. Plan Generation**

```json
{
  "name": "aegis_plan_generate",
  "description": "Generate a plan template for the specified plan class",
  "inputSchema": {
    "type": "object",
    "properties": {
      "planClass": {
        "type": "string",
        "enum": ["MVP-Fix", "Surgical-Refactor", "Systemic-Change"]
      },
      "userPrompt": {
        "type": "string"
      }
    }
  }
}
```text

**Usage__: Generates plan templates for specific scenarios.

## 🎯 __IDE-Specific Features**

### __Cursor Integration**

- __Native AI__: Built-in AI agents use planning optimization automatically
- __Command Palette__: `Cmd/Ctrl + Shift + P` → "Aegis: Auto Plan"
- __Chat Panel__: Planning suggestions in AI chat
- __File Operations__: Automatic plan file creation

### __VS Code Integration**

- __GitHub Copilot__: Enhanced with planning optimization
- __Claude Extension__: Full planning optimization support
- __Command Palette__: `Cmd/Ctrl + Shift + P` → "Aegis: Validate Plan"
- __Status Bar__: Shows current plan class and validation status

### __JetBrains Integration**

- __AI Assistant__: Planning optimization in AI chat
- __Tool Window__: Dedicated Aegis planning panel
- __Context Actions__: Right-click → "Aegis: Generate Plan"
- __Project View__: Plan files with special icons

## 🚀 __Usage Examples**

### __Cursor Example**

```text
User: "Add user authentication to the app"

Cursor AI automatically:
1. Calls aegis_plan_auto_detect
2. Detects MVP-Fix plan class
3. Generates contract-driven plan
4. Calls aegis_plan_validate
5. Implements with observable behavior focus
```text

### __VS Code Example**

```text
User: "Fix the search not working"

VS Code + Copilot automatically:
1. Analyzes request scope
2. Detects MVP-Fix (bug fix)
3. Generates behavioral contracts
4. Validates plan constraints
5. Implements observable behavior fix
```text

### __JetBrains Example**

```text
User: "Refactor auth to use JWT"

JetBrains AI Assistant automatically:
1. Detects Surgical-Refactor scope
2. Generates plan preserving contracts
3. Validates against constraints
4. Implements maintaining observable behavior
```text

## 🎯 __Advanced Configuration**

### __Custom MCP Server**

```typescript
// Custom MCP server with additional tools
import {Server} from "@modelcontextprotocol/sdk/server/index.js"

const server = new Server({
  name: "Aegis-custom",
  version: "1.0.0"
})

// Add custom planning tools
server.registerTool({
  name: "aegis_custom_plan",
  description: "Custom planning tool",
  inputSchema: {
    type: "object",
    properties: {
      // Custom properties
    }
  }
})
```text

### __IDE-Specific Extensions**

```typescript
// Cursor extension
export function activate(context: vscode.ExtensionContext) {
  // Register Aegis commands
  context.subscriptions.push(
    vscode.commands.registerCommand("Aegis.autoPlan", () => {
      // Auto plan detection
    })
  )
}
```text

## 🚀 __Getting Started**

### __1. Install MCP Server**

```bash
npm install @modelcontextprotocol/sdk
```text

### __2. Configure Your IDE**

Follow the configuration examples above for your specific IDE.

### __3. Test Integration**

```bash
# Test MCP server
node tools/MCP-Aegis-server.ts

# Test auto plan detection
npm run vibe "Add user authentication"
```text

### __4. Use with AI Agents**

- __Cursor__: Built-in AI automatically uses planning optimization
- __VS Code__: GitHub Copilot enhanced with planning optimization
- __JetBrains__: AI Assistant with planning optimization
- __Any MCP IDE__: Universal planning optimization support

## 🎯 __Benefits**

### __1. Universal Compatibility**

- Works with any MCP-compatible IDE
- No vendor lock-in
- Standard protocol support

### __2. Seamless Integration**

- Native IDE experience
- Automatic planning optimization
- Zero configuration required

### __3. Consistent Quality**

- Same planning optimization across all IDEs
- Contract-driven development everywhere
- Automatic validation and constraints

**The result__: __Universal planning optimization__ that works seamlessly across Cursor, VS Code, JetBrains, and any
MCP-compatible IDE. Users get the same high-quality planning optimization regardless of their development environment!
🚀
