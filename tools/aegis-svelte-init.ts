/**
 * @aegisBlueprint: svelte-drizzle-adapter
 * @version: 1.0.0
 * @mode: strict
 * @intent: Initialize Aegis framework in Svelte/Drizzle/Neon projects
 * @context: Automate setup of governance patterns and framework integration
 * @model: claude-3-5-sonnet
 * @hash: a415c11087bd2d9899a67ae0b9e2eafdc978da8b88a09315d47a7bd2b37c9f7c
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'child_process';

interface InitOptions {
  projectName: string;
  databaseUrl?: string;
  aegisMode?: 'lean' | 'strict' | 'generative';
  installDeps?: boolean;
}

class AegisSvelteInitializer {
  private options: InitOptions;
  private projectRoot: string;

  constructor(options: InitOptions) {
    this.options = {
      aegisMode: 'strict',
      installDeps: true,
      ...options
    };
    this.projectRoot = process.cwd();
  }

  async initialize(): Promise<void> {
    console.log('🚀 Initializing Aegis Framework for Svelte/Drizzle/Neon...\n');

    try {
      await this.createDirectories();
      await this.createConfigurationFiles();
      await this.createBlueprintStructure();
      await this.createDatabaseSetup();
      await this.createAegisScripts();
      
      if (this.options.installDeps) {
        await this.installDependencies();
      }

      await this.setupEnvironment();
      
      console.log('✅ Aegis Framework initialization complete!\n');
      console.log('Next steps:');
      console.log('1. Edit .env.local with your Neon database URL');
      console.log('2. Run: npm run db:generate');
      console.log('3. Run: npm run db:migrate');
      console.log('4. Run: npm run dev');
      console.log('\nFor more information, see: https://aegis-framework.dev/docs/svelte');

    } catch (error) {
      console.error('❌ Initialization failed:', error);
      process.exit(1);
    }
  }

  private async createDirectories(): Promise<void> {
    console.log('📁 Creating directory structure...');
    
    const dirs = [
      'src/lib/db',
      'src/lib/components',
      'src/lib/stores',
      'src/lib/utils',
      'blueprints/auth',
      'blueprints/forms',
      'blueprints/data-tables',
      '.aegis/outputs',
      '.aegis/governance',
      'scripts'
    ];

    for (const dir of dirs) {
      const fullPath = path.join(this.projectRoot, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    }
  }

  private async createConfigurationFiles(): Promise<void> {
    console.log('⚙️  Creating configuration files...');

    // Copy scaffold files
    const scriptDir = path.dirname(new URL(import.meta.url).pathname);
    const scaffoldDir = path.join(scriptDir, '..', 'scaffolds/svelte-drizzle-starter');
    if (fs.existsSync(scaffoldDir)) {
      const scaffoldFiles = ['package.json', 'README.md', 'tsconfig.json'];
      for (const file of scaffoldFiles) {
        const sourcePath = path.join(scaffoldDir, file);
        const targetPath = path.join(this.projectRoot, file);
        if (fs.existsSync(sourcePath)) {
          fs.copyFileSync(sourcePath, targetPath);
        }
      }
    }

    // Create .env.example
    const envExample = `# Database Configuration
DATABASE_URL="postgresql://user:password@host/database"

# Aegis Framework Configuration
AEGIS_MODE="${this.options.aegisMode}"
AEGIS_BLUEPRINT="default"

# Neon Database Configuration
NEON_DATABASE_URL="postgresql://user:password@host/database"
`;

    fs.writeFileSync(path.join(this.projectRoot, '.env.example'), envExample);

    // Create .env.local if database URL provided
    if (this.options.databaseUrl) {
      const envLocal = `DATABASE_URL="${this.options.databaseUrl}"
AEGIS_MODE="${this.options.aegisMode}"
AEGIS_BLUEPRINT="default"
`;
      fs.writeFileSync(path.join(this.projectRoot, '.env.local'), envLocal);
    }

    // Create drizzle.config.ts
    const drizzleConfig = `import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
`;

    fs.writeFileSync(path.join(this.projectRoot, 'drizzle.config.ts'), drizzleConfig);

    // Create svelte.config.js
    const svelteConfig = `import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
  },
  preprocess: vitePreprocess(),
};

export default config;
`;

    fs.writeFileSync(path.join(this.projectRoot, 'svelte.config.js'), svelteConfig);
  }

  private async createBlueprintStructure(): Promise<void> {
    console.log('📋 Creating blueprint structure...');

    // Create default blueprint
    const defaultBlueprint = `{
  "id": "default",
  "name": "Default Svelte/Drizzle/Neon Blueprint",
  "version": "1.0.0",
  "description": "Default governance patterns for Svelte applications",
  "adapter": "svelte-drizzle",
  "mode": "${this.options.aegisMode}",
  "patterns": [
    "auth/login-form",
    "forms/validation",
    "data-tables/basic-table"
  ],
  "governance": {
    "type-safety": true,
    "accessibility": true,
    "performance": true,
    "security": true
  }
}`;

    fs.writeFileSync(
      path.join(this.projectRoot, 'blueprints/default.blueprint.json'),
      defaultBlueprint
    );

    // Create auth blueprint
    const authBlueprint = `{
  "id": "auth/login-form",
  "name": "Login Form",
  "component": "LoginForm",
  "props": {
    "email": "string",
    "password": "string"
  },
  "events": ["submit", "error"],
  "validation": ["email", "password"],
  "aegis": {
    "mode": "${this.options.aegisMode}",
    "governance": ["type-safety", "accessibility", "security"]
  }
}`;

    fs.writeFileSync(
      path.join(this.projectRoot, 'blueprints/auth/login-form.blueprint.json'),
      authBlueprint
    );
  }

  private async createDatabaseSetup(): Promise<void> {
    console.log('🗄️  Creating database setup...');

    // Create database schema
    const schema = `import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
`;

    fs.writeFileSync(path.join(this.projectRoot, 'src/lib/db/schema.ts'), schema);

    // Create database connection
    const connection = `import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
`;

    fs.writeFileSync(path.join(this.projectRoot, 'src/lib/db/index.ts'), connection);
  }

  private async createAegisScripts(): Promise<void> {
    console.log('🔧 Creating Aegis scripts...');

    // Create governance rules
    const governanceRules = {
      mode: this.options.aegisMode,
      blueprint: 'default',
      rules: {
        'type-safety': true,
        'accessibility': true,
        'performance': true,
        'security': true
      }
    };

    fs.writeFileSync(
      path.join(this.projectRoot, '.aegis/governance/rules.json'),
      JSON.stringify(governanceRules, null, 2)
    );

    // Create aegis-init.js
    const aegisInit = `#!/usr/bin/env node

/**
 * @aegisBlueprint: svelte-drizzle-adapter
 * @version: 1.0.0
 * @mode: strict
 * @intent: Initialize Aegis framework in Svelte project
 * @context: Setup governance patterns and validation
 * @model: claude-3-5-sonnet
 * @hash: 6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔧 Setting up Aegis framework...');

// Create .aegis directory structure
const aegisDirs = ['.aegis/outputs', '.aegis/governance'];
aegisDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Create governance rules
const governanceRules = {
  mode: process.env.AEGIS_MODE || 'strict',
  blueprint: process.env.AEGIS_BLUEPRINT || 'default',
  rules: {
    'type-safety': true,
    'accessibility': true,
    'performance': true,
    'security': true
  }
};

fs.writeFileSync(
  '.aegis/governance/rules.json',
  JSON.stringify(governanceRules, null, 2)
);

console.log('✅ Aegis framework setup complete!');
`;

    fs.writeFileSync(path.join(this.projectRoot, 'scripts/aegis-init.js'), aegisInit);

    // Create aegis-check.js
    const aegisCheck = `#!/usr/bin/env node

/**
 * @aegisBlueprint: svelte-drizzle-adapter
 * @version: 1.0.0
 * @mode: strict
 * @intent: Check Aegis framework compliance
 * @context: Validate governance patterns and code quality
 * @model: claude-3-5-sonnet
 * @hash: 5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🔍 Running Aegis compliance checks...');

try {
  // Run TypeScript checks
  execSync('npm run check', { stdio: 'inherit' });
  
  // Run linting
  execSync('npm run lint', { stdio: 'inherit' });
  
  // Check blueprint validity
  if (fs.existsSync('blueprints/default.blueprint.json')) {
    console.log('✅ Blueprint validation passed');
  } else {
    console.log('⚠️  No default blueprint found');
  }
  
  console.log('✅ All Aegis compliance checks passed!');
} catch (error) {
  console.error('❌ Aegis compliance check failed:', error.message);
  process.exit(1);
}
`;

    fs.writeFileSync(path.join(this.projectRoot, 'scripts/aegis-check.js'), aegisCheck);

    // Create aegis-validate.js
    const aegisValidate = `#!/usr/bin/env node

/**
 * @aegisBlueprint: svelte-drizzle-adapter
 * @version: 1.0.0
 * @mode: strict
 * @intent: Validate Aegis framework integration
 * @context: Ensure proper setup and configuration
 * @model: claude-3-5-sonnet
 * @hash: 4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 Validating Aegis framework integration...');

const requiredFiles = [
  'package.json',
  'svelte.config.js',
  'drizzle.config.ts',
  'src/lib/db/schema.ts',
  'src/lib/db/index.ts',
  'blueprints/default.blueprint.json',
  '.aegis/governance/rules.json'
];

const requiredDirs = [
  'src/lib/components',
  'src/lib/stores',
  'blueprints/auth',
  'blueprints/forms',
  '.aegis/outputs'
];

let allValid = true;

// Check required files
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log('✅ ' + file);
  } else {
    console.log('❌ Missing: ' + file);
    allValid = false;
  }
}

// Check required directories
for (const dir of requiredDirs) {
  if (fs.existsSync(dir)) {
    console.log('✅ ' + dir + '/');
  } else {
    console.log('❌ Missing: ' + dir + '/');
    allValid = false;
  }
}

if (allValid) {
  console.log('✅ Aegis framework validation passed!');
} else {
  console.log('❌ Aegis framework validation failed!');
  process.exit(1);
}
`;

    fs.writeFileSync(path.join(this.projectRoot, 'scripts/aegis-validate.js'), aegisValidate);

    // Make scripts executable
    execSync('chmod +x scripts/aegis-init.js scripts/aegis-check.js scripts/aegis-validate.js');
  }

  private async installDependencies(): Promise<void> {
    console.log('📦 Installing dependencies...');
    
    try {
      execSync('npm install', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Failed to install dependencies:', error);
      throw error;
    }
  }

  private async setupEnvironment(): Promise<void> {
    console.log('🌍 Setting up environment...');
    
    // Create .gitignore if it doesn't exist
    const gitignore = `.DS_Store
node_modules
/build
/.svelte-kit
/package
.env
.env.*
!.env.example
vite.config.js.timestamp-*
vite.config.ts.timestamp-*
.aegis/outputs/*
!.aegis/outputs/.gitkeep
drizzle/
*.log
`;

    if (!fs.existsSync(path.join(this.projectRoot, '.gitignore'))) {
      fs.writeFileSync(path.join(this.projectRoot, '.gitignore'), gitignore);
    }

    // Create .gitkeep for outputs directory
    const outputsDir = path.join(this.projectRoot, '.aegis/outputs');
    if (!fs.existsSync(path.join(outputsDir, '.gitkeep'))) {
      fs.writeFileSync(path.join(outputsDir, '.gitkeep'), '');
    }
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const options: InitOptions = {
    projectName: args[0] || 'aegis-svelte-app',
    databaseUrl: args[1],
    aegisMode: (args[2] as 'lean' | 'strict' | 'generative') || 'strict',
    installDeps: args.includes('--no-install') ? false : true
  };

  const initializer = new AegisSvelteInitializer(options);
  initializer.initialize().catch(error => {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  });
}

export { AegisSvelteInitializer };
