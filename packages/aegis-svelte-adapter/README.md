# @aegis-framework/svelte-adapter

Aegis framework adapter for Svelte/Drizzle/Neon applications. This package provides governance patterns and utilities for building consistent, compliant Svelte applications with database integration.

## Installation

```bash
npm install @aegis-framework/svelte-adapter
```

## Quick Start

```typescript
import { SvelteDrizzleAdapter } from '@aegis-framework/svelte-adapter';

const adapter = new SvelteDrizzleAdapter({
  svelteVersion: '5.0.0',
  drizzleVersion: '0.29.0',
  neonDriverVersion: '0.9.0'
});

// Generate a component from a blueprint
const component = await adapter.generateComponent({
  name: 'LoginForm',
  props: { email: 'string', password: 'string' },
  events: ['submit', 'error']
});
```

## Features

### 🎯 **Governance Patterns**
- Pre-defined patterns for common Svelte components
- Database schema patterns for Drizzle ORM
- Validation and compliance checking

### 🔧 **Component Generation**
- Automatic Svelte component generation
- TypeScript type generation
- Event handling setup

### 🗄️ **Database Integration**
- Drizzle schema generation
- Migration management
- Neon database integration

### ✅ **Quality Assurance**
- Built-in validation
- Type safety enforcement
- Accessibility compliance

## API Reference

### SvelteDrizzleAdapter

Main adapter class for Svelte/Drizzle applications.

```typescript
interface SvelteDrizzleAdapterConfig {
  svelteVersion: string;
  drizzleVersion: string;
  neonDriverVersion: string;
  viteConfig?: string;
  databaseUrl?: string;
  schemaPath?: string;
}

class SvelteDrizzleAdapter {
  constructor(config: SvelteDrizzleAdapterConfig);
  
  async generateComponent(blueprint: any): Promise<SvelteComponent>;
  async generateSchema(blueprint: any): Promise<DrizzleSchema>;
  async validateBlueprint(blueprint: any): Promise<boolean>;
  async generateOutput(blueprint: any, mode: 'lean' | 'strict' | 'generative'): Promise<any>;
  getSupportedPatterns(): string[];
  getDependencies(): Record<string, string>;
}
```

### Patterns

Pre-defined governance patterns for common use cases.

```typescript
import { sveltePatterns, drizzlePatterns } from '@aegis-framework/svelte-adapter/patterns';

// Available Svelte patterns
const loginFormPattern = sveltePatterns['login-form'];
const dataTablePattern = sveltePatterns['data-table'];
const formValidationPattern = sveltePatterns['form-validation'];

// Available Drizzle patterns
const userManagementPattern = drizzlePatterns['user-management'];
const contentManagementPattern = drizzlePatterns['content-management'];
```

### Utilities

Helper functions for component and schema generation.

```typescript
import { SvelteUtils } from '@aegis-framework/svelte-adapter/utils';

// Generate component templates
const template = SvelteUtils.generateComponentTemplate(component);

// Validate components
const validation = SvelteUtils.validateComponent(component);

// Generate TypeScript types
const types = SvelteUtils.generateTypeScriptTypes(component);
```

## Usage Examples

### 1. Generate a Login Form Component

```typescript
import { SvelteDrizzleAdapter, sveltePatterns } from '@aegis-framework/svelte-adapter';

const adapter = new SvelteDrizzleAdapter({
  svelteVersion: '5.0.0',
  drizzleVersion: '0.29.0',
  neonDriverVersion: '0.9.0'
});

const loginPattern = sveltePatterns['login-form'];
const component = await adapter.generateComponent(loginPattern);

// component contains:
// - script: Svelte component script
// - template: Svelte component template
// - styles: Svelte component styles
```

### 2. Generate Database Schema

```typescript
import { SvelteDrizzleAdapter, drizzlePatterns } from '@aegis-framework/svelte-adapter';

const adapter = new SvelteDrizzleAdapter({
  svelteVersion: '5.0.0',
  drizzleVersion: '0.29.0',
  neonDriverVersion: '0.9.0'
});

const userPattern = drizzlePatterns['user-management'];
const schema = await adapter.generateSchema(userPattern);

// schema contains:
// - tables: Drizzle table definitions
// - relations: Database relationships
// - migrations: Migration files
```

### 3. Validate Blueprint

```typescript
import { SvelteDrizzleAdapter } from '@aegis-framework/svelte-adapter';

const adapter = new SvelteDrizzleAdapter({
  svelteVersion: '5.0.0',
  drizzleVersion: '0.29.0',
  neonDriverVersion: '0.9.0'
});

const blueprint = {
  name: 'MyComponent',
  svelte: true,
  drizzle: true,
  // ... other properties
};

const isValid = await adapter.validateBlueprint(blueprint);
console.log('Blueprint is valid:', isValid);
```

### 4. Generate Complete Output

```typescript
import { SvelteDrizzleAdapter } from '@aegis-framework/svelte-adapter';

const adapter = new SvelteDrizzleAdapter({
  svelteVersion: '5.0.0',
  drizzleVersion: '0.29.0',
  neonDriverVersion: '0.9.0'
});

const blueprint = {
  name: 'UserDashboard',
  svelte: true,
  drizzle: true,
  // ... other properties
};

// Generate in strict mode (includes tests and docs)
const output = await adapter.generateOutput(blueprint, 'strict');

// output contains:
// - component: Generated Svelte component
// - schema: Generated Drizzle schema
// - includeTests: true
// - includeDocs: true
// - includeValidation: true
```

## Governance Patterns

### Svelte Component Patterns

#### Login Form Pattern
```typescript
{
  id: 'auth/login-form',
  name: 'Login Form',
  component: 'LoginForm',
  props: {
    email: 'string',
    password: 'string',
    loading: 'boolean',
    error: 'string'
  },
  events: ['submit', 'error', 'success'],
  validation: ['email', 'password'],
  aegis: {
    mode: 'strict',
    governance: ['type-safety', 'accessibility', 'security']
  }
}
```

#### Data Table Pattern
```typescript
{
  id: 'data-tables/basic-table',
  name: 'Data Table',
  component: 'DataTable',
  props: {
    data: 'any[]',
    columns: 'Column[]',
    pagination: 'PaginationConfig',
    sorting: 'SortConfig'
  },
  events: ['sort', 'page', 'select', 'filter'],
  slots: ['header', 'row', 'footer'],
  aegis: {
    mode: 'strict',
    governance: ['performance', 'accessibility', 'type-safety']
  }
}
```

### Drizzle Schema Patterns

#### User Management Pattern
```typescript
{
  id: 'schemas/user-management',
  name: 'User Management Schema',
  tables: {
    users: {
      id: 'uuid primary key',
      email: 'text unique not null',
      password: 'text not null',
      createdAt: 'timestamp default now',
      updatedAt: 'timestamp default now'
    },
    sessions: {
      id: 'uuid primary key',
      userId: 'uuid references users(id)',
      token: 'text unique not null',
      expiresAt: 'timestamp not null',
      createdAt: 'timestamp default now'
    }
  },
  relations: {
    'users-sessions': 'one-to-many'
  },
  aegis: {
    mode: 'strict',
    governance: ['security', 'data-integrity', 'performance']
  }
}
```

## Development

### Building the Package

```bash
cd packages/aegis-svelte-adapter
npm run build
```

### Running Tests

```bash
npm test
```

### Development Mode

```bash
npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- [Documentation](https://aegis-framework.dev/docs/svelte)
- [GitHub Issues](https://github.com/aegis-framework/aegis-framework/issues)
- [Discord Community](https://discord.gg/aegis-framework)
