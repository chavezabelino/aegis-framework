# Aegis Svelte/Drizzle/Neon Starter Template

A production-ready starter template for Svelte applications with Drizzle ORM, Neon database, and Aegis framework governance.

## 🚀 Quick Start

```
# Clone the template
git clone https://github.com/aegis-framework/svelte-drizzle-starter.git my-app
cd my-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Neon database URL

# Initialize Aegis framework
npm run aegis:init

# Start development server
npm run dev
```

## 🏗️ What's Included

### Core Technologies
- **Svelte 5.x** - Latest reactive framework
- **SvelteKit 2.x** - Full-stack web framework
- **Drizzle ORM** - Type-safe database toolkit
- **Neon Database** - Serverless Postgres
- **Vite** - Fast build tool and dev server

### Aegis Framework Integration
- **Governance Patterns** - Consistent AI-generated code
- **Blueprint System** - Reusable development patterns
- **Quality Gates** - Automated compliance checks
- **Observability** - Telemetry and monitoring

### Development Tools
- **TypeScript** - Type safety
- **ESLint + Prettier** - Code quality
- **Drizzle Kit** - Database migrations
- **Svelte Check** - Type checking

## 📁 Project Structure

```
src/
├── lib/
│   ├── db/           # Database configuration and schemas
│   ├── components/   # Reusable Svelte components
│   ├── stores/       # Svelte stores
│   └── utils/        # Utility functions
├── routes/           # SvelteKit routes
├── app.html          # HTML template
└── app.css           # Global styles

blueprints/           # Aegis governance patterns
├── auth/            # Authentication patterns
├── forms/           # Form patterns
└── data-tables/     # Data table patterns

.aegis/              # Framework metadata
├── outputs/         # Generated outputs
└── governance/      # Governance rules
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
DATABASE_URL="postgresql://user:password@host/database"
AEGIS_MODE="strict"
AEGIS_BLUEPRINT="default"
```

### Database Setup

1. Create a Neon database at [neon.tech](https://neon.tech)
2. Copy the connection string to `.env.local`
3. Run migrations:

```
npm run db:generate
npm run db:migrate
```

### Aegis Framework

Initialize governance patterns:

```
npm run aegis:init
```

## 🎯 Development Workflow

### 1. Create a New Feature

```
# Generate a new blueprint
npm run aegis:planning auto "Add user authentication with login form"

# Implement the feature
npm run dev
```

### 2. Database Changes

```
# Generate migration
npm run db:generate

# Apply migration
npm run db:migrate

# View database in Drizzle Studio
npm run db:studio
```

### 3. Quality Checks

```
# Type checking
npm run check

# Linting and formatting
npm run lint
npm run format

# Aegis validation
npm run aegis:validate
```

## 🧪 Testing

```
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms

The app uses SvelteKit's adapter-auto, which automatically detects and configures for:
- Vercel
- Netlify
- Cloudflare Pages
- Railway
- Render

## 📚 Aegis Framework Patterns

This template includes several governance patterns:

### Authentication Pattern
```
// blueprints/auth/login-form.blueprint.ts
export const loginFormBlueprint = {
  name: 'login-form',
  component: 'LoginForm',
  validation: ['email', 'password'],
  events: ['submit', 'error'],
  aegis: {
    mode: 'strict',
    governance: ['type-safety', 'accessibility']
  }
};
```

### Data Table Pattern
```
// blueprints/data-tables/user-table.blueprint.ts
export const userTableBlueprint = {
  name: 'user-table',
  component: 'DataTable',
  props: ['data', 'columns', 'pagination'],
  aegis: {
    mode: 'strict',
    governance: ['performance', 'accessibility']
  }
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run quality checks: `npm run aegis:validate`
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🆘 Support

- [Documentation](https://aegis-framework.dev)
- [GitHub Issues](https://github.com/aegis-framework/svelte-drizzle-starter/issues)
- [Discord Community](https://discord.gg/aegis-framework)
