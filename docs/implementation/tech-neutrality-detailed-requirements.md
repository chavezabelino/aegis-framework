<!--
# 🔧 Tech Stack Neutrality: Detailed Implementation Requirements

@aegisFrameworkVersion: 2.5.0tent: Detailed technical requirements for removing tech stack bias
@context: Specific implementation tasks for achieving framework neutrality
-->

# 🔧 Tech Stack Neutrality: Detailed Implementation Requirements

## 🎯 Executive Summary

The Aegis Framework currently has **significant bias** toward the JavaScript/TypeScript + React + Next.js + Supabase
stack. To achieve full reusability, we need **8 months of focused development** across 4 phases to implement universal
adapters, abstract core dependencies, and create language-agnostic tooling.

## 📊 Current Bias Assessment: Critical Issues

### **🚫 Blocking Dependencies**

#### **1. CLI Tool Lock-in (HIGH IMPACT)**

```
# Current: Requires Node.js everywhere
node CLI/team-config.ts
node CLI/validate-team-config.ts
node tools/validate-Blueprint.ts

# Problem: Python/Go/Rust teams cannot use framework tools
```

#### **2. Schema Validation Lock-in (HIGH IMPACT)**

```
// Current: Zod everywhere in templates
import { z } from 'zod';
const schema = z.object({...});

// Problem: Non-TypeScript teams cannot use validation patterns
```

#### **3. Supabase-Specific Patterns (MEDIUM IMPACT)**

```
// Mandatory in all templates
import {handleCorsPrelight} from "../_shared/lib/corsHeaders.ts"
export default async function handler(req: Request) {
  if (req.method === "OPTIONS") return handleCorsPrelight()
}

// Problem: Non-Supabase teams cannot use templates
```

#### **4. Build System Assumptions (MEDIUM IMPACT)**

```
// All examples assume npm/package.JSON
{
  "scripts": {
    "build": "next build",
    "test": "Jest"
  }
}

// Problem: Cargo/pip/Maven teams excluded
```

## 🏗️ Solution Architecture

### **Core Principle: Adapter Pattern + Universal Interfaces**

```
graph TD
    A[Universal Blueprint] --> B[Adapter Layer]
    B --> C[React+Next.js Output]
    B --> D[Python+FastAPI Output]
    B --> E[Spring Boot Output]
    B --> F[Go+Gin Output]

    G[Universal CLI] --> H[Language-Specific CLI]
    H --> I[node Aegis-CLI]
    H --> J[python Aegis-CLI]
    H --> K[go run Aegis-CLI]
```

## 📝 Detailed Implementation Tasks

### **Phase 1: Foundation (Months 1-2)**

#### **Task 1.1: Universal Blueprint Schema**

**Current Problem**: Blueprints assume TypeScript/React patterns **Solution**: Language-agnostic Blueprint definitions

```
# NEW: Universal Blueprint format
apiVersion: "Aegis.dev/v2"
kind: "Blueprint"
spec:
  interfaces:
    - name: "UserService"
      methods:
        - authenticate(credentials): AuthResult
        - getUserById(id): User

  components:
    - name: "UserForm"
      type: "form"
      fields: ["email", "password"]

  # Adapter-specific implementations
  adapters:
    react-next:
      components: ["LoginForm.tsx", "UserProfile.tsx"]
    python-fastapi:
      routes: ["/auth/login", "/users/{id}"]
    spring-boot:
      controllers: ["AuthController.java"]
```

**Implementation Requirements**:

- [ ] Design universal Blueprint JSON schema
- [ ] Create Blueprint validation for all adapters
- [ ] Update existing Blueprints to universal format
- [ ] Create migration tool for legacy Blueprints

#### **Task 1.2: Language-Agnostic CLI Protocol**

**Current Problem**: All CLI tools require Node.js **Solution**: Protocol-based CLI with language adapters

```
# NEW: Universal CLI protocol
Aegis-CLI team-config         # Auto-detects language
Aegis-CLI validate-Blueprint  # Works in any environment
Aegis-CLI hydrate-project     # Language-neutral migration
```

**Implementation Requirements**:

- [ ] Design CLI protocol specification (JSON/YAML based)
- [ ] Create reference Node.js implementation
- [ ] Create Python CLI adapter (`pip install Aegis-CLI`)
- [ ] Create Go CLI adapter (`go install Aegis-CLI`)
- [ ] Create Rust CLI adapter (`cargo install Aegis-CLI`)

#### **Task 1.3: Universal Configuration Schema**

**Current Problem**: Configuration assumes npm/Node.js ecosystem **Solution**: Tech-stack agnostic configuration

```
# NEW: Universal team configuration
apiVersion: "Aegis.dev/v2"
kind: "TeamConfiguration"
spec:
  tech_stack:
    language: "python" # or TypeScript, go, rust, java
    frontend: "react" # or vue, angular, svelte
    backend: "fastapi" # or django, spring, gin
    database: "postgresql" # or mysql, sqlite, mongodb
    deployment: "aws" # or vercel, gcp, azure

  features:
    core:
      blueprint_validation: true
    required:
      evolution_stories:
        enabled: true
        adapter: "python" # Uses Python tools
```

### **Phase 2: Primary Adapters (Months 3-4)**

#### **Task 2.1: Complete React+Next.js Adapter**

**Current Problem**: Templates hardcoded, not adapter-based **Solution**: Full adapter implementation

```
// NEW: adapters/react-next/Blueprint-adapter.ts
export class ReactNextAdapter implements UniversalAdapter {
  translateBlueprint(Blueprint: UniversalBlueprint): ReactNextOutput {
    return {
      components: this.generateComponents(Blueprint.components),
      pages: this.generatePages(Blueprint.routes),
      schemas: this.generateZodSchemas(Blueprint.interfaces),
      styles: this.generateTailwindClasses(Blueprint.styling)
    }
  }

  generateScaffold(Blueprint: UniversalBlueprint): FileStructure {
    return {
      "src/components/": this.componentFiles,
      "src/pages/": this.pageFiles,
      "src/schemas/": this.schemaFiles,
      "package.JSON": this.packageJson
    }
  }
}
```

#### **Task 2.2: Python+FastAPI Adapter**

**Current Problem**: No Python implementation exists **Solution**: Complete Python ecosystem adapter

```python
# NEW: adapters/python-fastapi/blueprint_adapter.py
class FastAPIAdapter(UniversalAdapter):
    def translate_blueprint(self, Blueprint: UniversalBlueprint) -> FastAPIOutput:
        return FastAPIOutput(
            routers=self.generate_routers(Blueprint.routes),
            models=self.generate_pydantic_models(Blueprint.interfaces),
            dependencies=self.generate_dependency_injection(Blueprint.services)
        )

    def generate_scaffold(self, Blueprint: UniversalBlueprint) -> FileStructure:
        return {
            "app/routers/": self.router_files,
            "app/models/": self.model_files,
            "requirements.txt": self.requirements,
            "pyproject.toml": self.pyproject
        }
```

#### **Task 2.3: Go+Gin Adapter**

**Current Problem**: No Go implementation exists **Solution**: Go ecosystem adapter

```go
// NEW: adapters/go-gin/blueprint_adapter.go
type GinAdapter struct{}

func (a *GinAdapter) TranslateBlueprint(Blueprint UniversalBlueprint) GinOutput {
    return GinOutput{
        Routes:     a.generateRoutes(Blueprint.Routes),
        Models:     a.generateStructs(Blueprint.Interfaces),
        Middleware: a.generateMiddleware(Blueprint.Middleware),
    }
}

func (a *GinAdapter) GenerateScaffold(Blueprint UniversalBlueprint) FileStructure {
    return FileStructure{
        "cmd/server/":    a.serverFiles,
        "internal/API/":  a.apiFiles,
        "go.mod":         a.goMod,
    }
}
```

### **Phase 3: Ecosystem Expansion (Months 5-6)**

#### **Task 3.1: Additional Frontend Adapters**

**Vue + Nuxt Adapter**:

```
// NEW: adapters/vue-nuxt/Blueprint-adapter.ts
export class VueNuxtAdapter implements UniversalAdapter {
  translateBlueprint(Blueprint: UniversalBlueprint): VueNuxtOutput {
    return {
      components: this.generateVueComponents(Blueprint.components),
      pages: this.generateNuxtPages(Blueprint.routes),
      composables: this.generateComposables(Blueprint.services)
    }
  }
}
```

**Angular Adapter**:

```
// NEW: adapters/angular/Blueprint-adapter.ts
export class AngularAdapter implements UniversalAdapter {
  translateBlueprint(Blueprint: UniversalBlueprint): AngularOutput {
    return {
      components: this.generateAngularComponents(Blueprint.components),
      services: this.generateAngularServices(Blueprint.services),
      modules: this.generateAngularModules(Blueprint.modules)
    }
  }
}
```

#### **Task 3.2: Additional Backend Adapters**

**Spring Boot Adapter**:

```java
// NEW: adapters/spring-boot/BlueprintAdapter.java
public class SpringBootAdapter implements UniversalAdapter {
    public SpringBootOutput translateBlueprint(UniversalBlueprint Blueprint) {
        return new SpringBootOutput(
            generateControllers(Blueprint.getRoutes()),
            generateEntities(Blueprint.getInterfaces()),
            generateServices(Blueprint.getServices())
        );
    }
}
```

**Django Adapter**:

```python
# NEW: adapters/django/blueprint_adapter.py
class DjangoAdapter(UniversalAdapter):
    def translate_blueprint(self, Blueprint: UniversalBlueprint) -> DjangoOutput:
        return DjangoOutput(
            views=self.generate_views(Blueprint.routes),
            models=self.generate_django_models(Blueprint.interfaces),
            urls=self.generate_url_patterns(Blueprint.routes)
        )
```

### **Phase 4: Enterprise Support (Months 7-8)**

#### **Task 4.1: Enterprise Platform Adapters**

**.NET Core Adapter**:

```csharp
// NEW: adapters/dotnet-core/BlueprintAdapter.cs
public class DotNetCoreAdapter : IUniversalAdapter
{
    public DotNetCoreOutput TranslateBlueprint(UniversalBlueprint Blueprint)
    {
        return new DotNetCoreOutput
        {
            Controllers = GenerateControllers(Blueprint.Routes),
            Models = GenerateModels(Blueprint.Interfaces),
            Services = GenerateServices(Blueprint.Services)
        };
    }
}
```

**Kubernetes-Native Adapter**:

```
# NEW: adapters/kubernetes/Blueprint-adapter.YAML
apiVersion: Aegis.dev/v2
kind: KubernetesAdapter
spec:
  generateManifests: true
  generateHelm: true
  generateKustomize: true

  templates:
    deployment: "templates/deployment.YAML"
    service: "templates/service.YAML"
    ingress: "templates/ingress.YAML"
```

## 🛠️ Critical Dependencies to Abstract

### **1. Schema Validation Abstraction**

```
# Current: Zod-specific
validation:
  library: "zod"
  types: "TypeScript"

# Target: Universal
validation:
  spec: "JSON-schema"
  adapters:
    TypeScript: "zod"
    python: "pydantic"
    go: "GitHub.com/go-playground/validator"
    java: "hibernate-validator"
    rust: "serde"
```

### **2. Database Abstraction**

```
# Current: Supabase-specific
database:
  provider: "supabase"
  auth: true
  realtime: true

# Target: Universal
database:
  type: "postgresql"
  adapters:
    supabase: { auth: true, realtime: true }
    prisma: { migrations: true, client: true }
    sqlalchemy: { orm: true, migrations: "alembic" }
    gorm: { autoMigrate: true }
```

### **3. Authentication Abstraction**

```
# Current: Supabase Auth
auth:
  provider: "supabase"
  social: ["google", "GitHub"]

# Target: Universal
auth:
  provider: "auth0"  # or supabase, firebase, cognito
  adapters:
    supabase: { social: ["google", "GitHub"] }
    auth0: { universal_login: true }
    firebase: { phone_auth: true }
    custom: { jwt: true }
```

### **4. Deployment Abstraction**

```
# Current: Vercel/Supabase deployment
deployment:
  platform: "vercel"
  functions: "edge"

# Target: Universal
deployment:
  platform: "aws"  # or vercel, gcp, azure
  adapters:
    vercel: { edge_functions: true }
    aws: { lambda: true, api_gateway: true }
    gcp: { cloud_functions: true }
    azure: { functions: true }
```

## 📋 Migration Strategy for Existing Projects

### **Backward Compatibility Requirements**

1. **Existing Blueprints must continue working**
2. **Current CLI tools must have deprecation path**
3. **Migration tools for upgrading to universal format**

### **Migration Tooling**

```
# Automated migration tools
Aegis-migrate detect-stack           # Analyze current project
Aegis-migrate convert-Blueprint      # Convert to universal format
Aegis-migrate suggest-adapters       # Recommend optimal tech stack
Aegis-migrate validate-migration     # Verify Constitutional compliance
```

## 🎯 Success Criteria

### **Technical Validation**

- [ ] Same Blueprint generates working code in 5+ tech stacks
- [ ] Constitutional compliance maintained across all adapters
- [ ] Performance parity within 10% across tech stacks
- [ ] 100% test coverage for adapter interface compliance

### **Adoption Validation**

- [ ] 3+ production teams using non-React adapters
- [ ] Migration success rate >90% for existing projects
- [ ] Community contributions for 2+ additional adapters
- [ ] Documentation coverage for all supported tech stacks

### **Quality Validation**

- [ ] Zero Constitutional violations across adapters
- [ ] Identical functionality across tech stack implementations
- [ ] Cross-adapter Blueprint compatibility >95%
- [ ] Framework evolution stories capture multi-stack insights

This implementation plan transforms Aegis Framework from a **React+Next.js+Supabase tool** into a __truly universal AI
engineering framework__ that can support any modern tech stack while maintaining its core Constitutional governance and
Blueprint-driven development principles.
