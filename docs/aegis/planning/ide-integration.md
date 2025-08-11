<!--
@aegisBlueprint: planning-optimization
@version: 1.0.0
@mode: lean
@intent: IDE integration guide for planning optimization with MCP support
@context: Works with Cursor, VS Code, and any MCP-compatible IDE
-->

# 🚀 IDE Integration with MCP Support

> **Universal planning optimization** that works with any IDE through MCP (Model Context Protocol).

## 🎯 **Supported IDEs**

### **Cursor**
- **Built-in AI**: Native integration with planning optimization
- **MCP Support**: Full MCP protocol support
- **Command Palette**: Access Aegis commands directly
- **Auto-completion**: Planning suggestions in real-time

### **VS Code**
- **GitHub Copilot**: Enhanced with planning optimization
- **Claude Extension**: Full planning optimization support
- **MCP Extensions**: Native MCP protocol support
- **Command Palette**: Aegis commands available

### **JetBrains IDEs**
- **AI Assistant**: Planning optimization integration
- **MCP Plugins**: Full MCP protocol support
- **Tool Windows**: Dedicated Aegis planning panel

### **Any MCP-Compatible Editor**
- **Universal Support**: Works with any MCP-compatible editor
- **Protocol Standard**: Uses Model Context Protocol
- **Tool Integration**: Seamless command execution

## 🚀 **MCP Server Setup**

### **1. Install MCP Server**
```bash
# Install Aegis MCP server
npm install -g @aegis-framework/mcp-server

# Or use local installation
npm install @modelcontextprotocol/sdk
```

### **2. Configure IDE**

#### **Cursor Configuration**
```json
// .cursor/settings.json
{
  "mcpServers": {
    "aegis-planning": {
      "command": "node",
      "args": ["tools/mcp-aegis-server.ts"],
      "env": {}
    }
  }
}
```

#### **VS Code Configuration**
```json
// .vscode/settings.json
{
  "mcp.servers": {
    "aegis-planning": {
      "command": "node",
      "args": ["tools/mcp-aegis-server.ts"]
    }
  }
}
```

#### **JetBrains Configuration**
```yaml
# .idea/mcp-servers.xml
<mcp-servers>
  <server name="aegis-planning">
    <command>node</command>
    <args>
      <arg>tools/mcp-aegis-server.ts</arg>
    </args>
  </server>
</mcp-servers>
```

## 🛠️ **Available MCP Tools**

### **1. Auto Plan Detection**
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
```

**Usage**: AI agents automatically call this when users make requests.

### **2. Plan Validation**
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
```

**Usage**: Validates plans before implementation.

### **3. Plan Comparison**
```json
{
  "name": "aegis_plan_compare",
  "description": "Compare two plans and select the leaner one",
  "inputSchema": {
    "type": "object",
    "properties": {
      "plan1Content": { "type": "string" },
      "plan1Class": { "type": "string" },
      "plan1Files": { "type": "number" },
      "plan2Content": { "type": "string" },
      "plan2Class": { "type": "string" },
      "plan2Files": { "type": "number" }
    }
  }
}
```

**Usage**: Compares alternative approaches automatically.

### **4. Plan Generation**
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
```

**Usage**: Generates plan templates for specific scenarios.

## 🎯 **IDE-Specific Features**

### **Cursor Integration**
- **Native AI**: Built-in AI agents use planning optimization automatically
- **Command Palette**: `Cmd/Ctrl + Shift + P` → "Aegis: Auto Plan"
- **Chat Panel**: Planning suggestions in AI chat
- **File Operations**: Automatic plan file creation

### **VS Code Integration**
- **GitHub Copilot**: Enhanced with planning optimization
- **Claude Extension**: Full planning optimization support
- **Command Palette**: `Cmd/Ctrl + Shift + P` → "Aegis: Validate Plan"
- **Status Bar**: Shows current plan class and validation status

### **JetBrains Integration**
- **AI Assistant**: Planning optimization in AI chat
- **Tool Window**: Dedicated Aegis planning panel
- **Context Actions**: Right-click → "Aegis: Generate Plan"
- **Project View**: Plan files with special icons

## 🚀 **Usage Examples**

### **Cursor Example**
```
User: "Add user authentication to the app"

Cursor AI automatically:
1. Calls aegis_plan_auto_detect
2. Detects MVP-Fix plan class
3. Generates contract-driven plan
4. Calls aegis_plan_validate
5. Implements with observable behavior focus
```

### **VS Code Example**
```
User: "Fix the search not working"

VS Code + Copilot automatically:
1. Analyzes request scope
2. Detects MVP-Fix (bug fix)
3. Generates behavioral contracts
4. Validates plan constraints
5. Implements observable behavior fix
```

### **JetBrains Example**
```
User: "Refactor auth to use JWT"

JetBrains AI Assistant automatically:
1. Detects Surgical-Refactor scope
2. Generates plan preserving contracts
3. Validates against constraints
4. Implements maintaining observable behavior
```

## 🎯 **Advanced Configuration**

### **Custom MCP Server**
```typescript
// Custom MCP server with additional tools
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

const server = new Server({
  name: 'aegis-custom',
  version: '1.0.0',
});

// Add custom planning tools
server.registerTool({
  name: 'aegis_custom_plan',
  description: 'Custom planning tool',
  inputSchema: {
    type: 'object',
    properties: {
      // Custom properties
    }
  }
});
```

### **IDE-Specific Extensions**
```typescript
// Cursor extension
export function activate(context: vscode.ExtensionContext) {
  // Register Aegis commands
  context.subscriptions.push(
    vscode.commands.registerCommand('aegis.autoPlan', () => {
      // Auto plan detection
    })
  );
}
```

## 🚀 **Getting Started**

### **1. Install MCP Server**
```bash
npm install @modelcontextprotocol/sdk
```

### **2. Configure Your IDE**
Follow the configuration examples above for your specific IDE.

### **3. Test Integration**
```bash
# Test MCP server
node tools/mcp-aegis-server.ts

# Test auto plan detection
npm run vibe "Add user authentication"
```

### **4. Use with AI Agents**
- **Cursor**: Built-in AI automatically uses planning optimization
- **VS Code**: GitHub Copilot enhanced with planning optimization
- **JetBrains**: AI Assistant with planning optimization
- **Any MCP IDE**: Universal planning optimization support

## 🎯 **Benefits**

### **1. Universal Compatibility**
- Works with any MCP-compatible IDE
- No vendor lock-in
- Standard protocol support

### **2. Seamless Integration**
- Native IDE experience
- Automatic planning optimization
- Zero configuration required

### **3. Consistent Quality**
- Same planning optimization across all IDEs
- Contract-driven development everywhere
- Automatic validation and constraints

**The result**: **Universal planning optimization** that works seamlessly across Cursor, VS Code, JetBrains, and any MCP-compatible IDE. Users get the same high-quality planning optimization regardless of their development environment! 🚀
