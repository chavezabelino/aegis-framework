<!--
# Docusaurus Setup Guide for Aegis Framework

@aegisFrameworkVersion: 2.5.0
@intent: Docusaurus setup guide for AI Agent Development Governance documentation site
@context: Documentation site setup and configuration
@mode: strict
-->

# Docusaurus Setup Guide for Aegis Framework

## ✅ __SETUP COMPLETE**

Your Docusaurus documentation site is now configured and running!

## 🔧 __What's Been Set Up**

### Core Configuration

- __Site Title__: Aegis Framework
- __Tagline__: Constitutional AI Engineering with Governance, Monitoring & Safety
- __Theme__: Professional documentation theme with custom styling
- __Navigation__: Documentation, Capabilities, Blueprints, Evolution Stories

### Auto-Generated Content

- __Live Dashboard__: Real-time framework status at `/dashboard`
- __Capability Pages__: Auto-generated from your `capability-map.JSON`
- __Blueprint Registry__: Auto-generated from your `Blueprint-registry.JSON`
- __Framework Data Plugin__: Automatically loads and displays live framework data

### Custom Features

- __Framework Status Cards__: Live metrics display
- __Capability Distribution Charts__: Visual breakdown of your 64 capabilities
- __Category Navigation__: Organized by Tool, Core, Governance, Integration
- __Health Monitoring__: Real-time framework health status

## 🚀 __Local Development**

### Start Development Server

```bash
cd website
npm start
```text

**Your site is running at__: <http://localhost:3000>

### Update Framework Data

```bash
# From project root - run these to refresh data
node tools/framework-capability-mapper.ts
node framework/registry/Blueprint-registry.ts discover
node tools/update-framework-dashboard.ts
```text

## 📋 __GitHub Pages Deployment**

### Method 1: Automated Deployment (Recommended)

1. __Enable GitHub Pages in Repository Settings__:
   - Go to repository Settings → Pages
   - Source: GitHub Actions
   - The workflow `.GitHub/workflows/deploy-docs.yml` will handle deployment

2. __Update Configuration__: Replace `your-username` in `website/Docusaurus.config.ts`:

   ```typescript
   url: 'https://your-username.github.io',
   organizationName: 'your-username',
   ```

3. __Push to Main Branch__:

   ```bash
   git add .
   git commit -m "Add Docusaurus documentation site"
   git push origin main
   ```

### Method 2: Manual Deployment

```bash
# Run the deployment script
./scripts/deploy-docs.sh
```text

### Method 3: Direct Deployment

```bash
cd website

# Update your config with actual GitHub username
# Edit Docusaurus.config.ts: url and organizationName

# Build and deploy
npm run build
npm run deploy
```text

## 🎯 __Site Structure**

```text
https://your-username.github.io/aegis-framework/
├── /                          # Homepage with framework overview
├── /dashboard                 # Live framework dashboard
├── /docs/intro               # Getting started guide
├── /docs/capabilities/       # Auto-generated capability docs
├── /docs/blueprints/         # Blueprint registry
└── /blog/                    # Evolution stories
```text

## 🔄 __Keeping Content Updated**

The site automatically generates content from your framework data:

### Data Sources

- `.framework/capability-map.JSON` → Capability pages
- `.framework/Blueprint-registry.JSON` → Blueprint documentation
- `FRAMEWORK-DASHBOARD.md` → Dashboard data
- `docs/evolution/` → Evolution stories (blog)

### Update Process

1. __Develop framework features__ (your normal workflow)
2. __Run data generators__ (capability mapper, Blueprint registry)
3. __Build/deploy docs__ (automatic on push or manual script)

## 📊 __Live Dashboard Features**

Your documentation includes a live dashboard showing:

- __Framework version and health status**
- __64 capabilities across 4 categories**
- __Visual capability distribution charts**
- __Blueprint registry statistics**
- __Quick action buttons**

## 🎨 __Customization Options**

### Update Branding

- __Logo__: Replace `website/static/img/logo.svg`
- __Favicon__: Replace `website/static/img/favicon.ico`
- __Colors__: Edit `website/src/CSS/custom.CSS`

### Add Content

- __Documentation__: Add files to `website/docs/`
- __Blog Posts__: Add files to `website/blog/`
- __Pages__: Add components to `website/src/pages/`

### Modify Navigation

- __Sidebar__: Edit `website/sidebars.ts`
- __Navbar__: Edit `website/Docusaurus.config.ts`

## 🔧 __Available Commands**

```bash
# Development
cd website && npm start              # Start dev server
cd website && npm run build         # Build for production
cd website && npm run serve          # Serve built site locally

# Deployment
./scripts/deploy-docs.sh             # Deploy to GitHub Pages
cd website && npm run deploy         # Direct deployment

# Framework Data Updates
node tools/framework-capability-mapper.ts    # Update capability map
node tools/update-framework-dashboard.ts     # Update dashboard
```text

## 🎉 __Result**

You now have a __professional, auto-updating documentation site__ that:

✅ __Displays live framework data__ (64 capabilities, health status, Blueprints)  
✅ __Updates automatically__ from your framework's observability system  
✅ __Provides professional navigation__ and search  
✅ __Deploys to GitHub Pages__ with zero server costs  
✅ __Maintains itself__ as your framework evolves

**Your documentation debt is now solved with a beautiful, live, searchable site!__ 🚀📚✨

---

## 🔗 __Next Steps**

1. __Visit your local site__: <http://localhost:3000>
2. __Update GitHub username__ in config files
3. __Push to trigger deployment__ or run deployment script
4. __Share your documentation URL__ with users and contributors

The observability system you built earlier now powers a professional documentation site that explains your framework
automatically!
