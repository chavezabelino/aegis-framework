/**
 * @aegisBlueprint: svelte-drizzle-adapter
 * @version: 1.0.0
 * @mode: strict
 * @intent: Provide Svelte-specific governance patterns
 * @context: Define reusable patterns for Svelte components and Drizzle schemas
 * @model: claude-3-5-sonnet
 * @hash: 7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5
 */

export interface SveltePattern {
  id: string;
  name: string;
  description: string;
  component: string;
  props: Record<string, any>;
  events: string[];
  slots?: string[];
  validation?: string[];
  aegis: {
    mode: 'lean' | 'strict' | 'generative';
    governance: string[];
  };
}

export interface DrizzlePattern {
  id: string;
  name: string;
  description: string;
  tables: Record<string, any>;
  relations: Record<string, any>;
  migrations: string[];
  aegis: {
    mode: 'lean' | 'strict' | 'generative';
    governance: string[];
  };
}

export const sveltePatterns: Record<string, SveltePattern> = {
  'login-form': {
    id: 'auth/login-form',
    name: 'Login Form',
    description: 'Standard login form with email and password validation',
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
  },
  'data-table': {
    id: 'data-tables/basic-table',
    name: 'Data Table',
    description: 'Reusable data table with sorting and pagination',
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
  },
  'form-validation': {
    id: 'forms/validation',
    name: 'Form Validation',
    description: 'Form validation pattern with error handling',
    component: 'ValidatedForm',
    props: {
      fields: 'FieldConfig[]',
      validation: 'ValidationRules',
      submitHandler: 'Function'
    },
    events: ['submit', 'validation-error', 'field-change'],
    aegis: {
      mode: 'strict',
      governance: ['type-safety', 'accessibility', 'user-experience']
    }
  }
};

export const drizzlePatterns: Record<string, DrizzlePattern> = {
  'user-management': {
    id: 'schemas/user-management',
    name: 'User Management Schema',
    description: 'Complete user management with authentication',
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
    migrations: ['001_create_users', '002_create_sessions'],
    aegis: {
      mode: 'strict',
      governance: ['security', 'data-integrity', 'performance']
    }
  },
  'content-management': {
    id: 'schemas/content-management',
    name: 'Content Management Schema',
    description: 'Basic content management with categories',
    tables: {
      categories: {
        id: 'uuid primary key',
        name: 'text not null',
        slug: 'text unique not null',
        createdAt: 'timestamp default now'
      },
      posts: {
        id: 'uuid primary key',
        title: 'text not null',
        content: 'text',
        categoryId: 'uuid references categories(id)',
        published: 'boolean default false',
        createdAt: 'timestamp default now',
        updatedAt: 'timestamp default now'
      }
    },
    relations: {
      'categories-posts': 'one-to-many'
    },
    migrations: ['001_create_categories', '002_create_posts'],
    aegis: {
      mode: 'strict',
      governance: ['data-integrity', 'performance', 'scalability']
    }
  }
};

export function getPattern(patternId: string): SveltePattern | DrizzlePattern | null {
  return sveltePatterns[patternId] || drizzlePatterns[patternId] || null;
}

export function getAllPatterns(): { svelte: SveltePattern[], drizzle: DrizzlePattern[] } {
  return {
    svelte: Object.values(sveltePatterns),
    drizzle: Object.values(drizzlePatterns)
  };
}

export function validatePattern(pattern: SveltePattern | DrizzlePattern): boolean {
  const requiredFields = ['id', 'name', 'description', 'aegis'];
  return requiredFields.every(field => (pattern as any)[field] !== undefined);
}
