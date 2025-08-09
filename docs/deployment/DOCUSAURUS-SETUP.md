<!--
@aegisFrameworkVersion: 2.5.0
@intent: Docusaurus setup guide for AI Agent Development Governance documentation site
@context: Documentation site setup and configuration
@mode: strict
-->

# Docusaurus Setup Guide for Aegis Framework

## ✅ **SETUP COMPLETE**

Your Docusaurus documentation site is now configured and running!

## 🔧 **What's Been Set Up**

### Core Configuration
- **Site Title**: Aegis Framework
- **Tagline**: Constitutional AI Engineering with Governance, Monitoring & Safety
- **Theme**: Professional documentation theme with custom styling
- **Navigation**: Documentation, Capabilities, Blueprints, Evolution Stories

### Auto-Generated Content
- **Live Dashboard**: Real-time framework status at `/dashboard`
- **Capability Pages**: Auto-generated from your `capability-map.json`
- **Blueprint Registry**: Auto-generated from your `blueprint-registry.json`
- **Framework Data Plugin**: Automatically loads and displays live framework data

### Custom Features
- **Framework Status Cards**: Live metrics display
- **Capability Distribution Charts**: Visual breakdown of your 64 capabilities
- **Category Navigation**: Organized by Tool, Core, Governance, Integration
- **Health Monitoring**: Real-time framework health status

## 🚀 **Local Development**

### Start Development Server
```bash
cd website
npm start
```
**Your site is running at**: http://localhost:3000

### Update Framework Data
```bash
# From project root - run these to refresh data
node tools/framework-capability-mapper.ts
node framework/registry/blueprint-registry.ts discover
node tools/update-framework-dashboard.ts
```

## 📋 **GitHub Pages Deployment**

### Method 1: Automated Deployment (Recommended)

1. **Enable GitHub Pages in Repository Settings**:
   - Go to repository Settings → Pages
   - Source: GitHub Actions
   - The workflow `.github/workflows/deploy-docs.yml` will handle deployment

2. **Update Configuration**:
   Replace `your-username` in `website/docusaurus.config.ts`:
   ```typescript
   url: 'https://your-username.github.io',
   organizationName: 'your-username',
   ```

3. **Push to Main Branch**:
   ```bash
   git add .
   git commit -m "Add Docusaurus documentation site"
   git push origin main
   ```

### Method 2: Manual Deployment

```bash
# Run the deployment script
./scripts/deploy-docs.sh
```

### Method 3: Direct Deployment

```bash
cd website

# Update your config with actual GitHub username
# Edit docusaurus.config.ts: url and organizationName

# Build and deploy
npm run build
npm run deploy
```

## 🎯 **Site Structure**

```
https://your-username.github.io/aegis-framework/
├── /                          # Homepage with framework overview
├── /dashboard                 # Live framework dashboard
├── /docs/intro               # Getting started guide
├── /docs/capabilities/       # Auto-generated capability docs
├── /docs/blueprints/         # Blueprint registry
└── /blog/                    # Evolution stories
```

## 🔄 **Keeping Content Updated**

The site automatically generates content from your framework data:

### Data Sources
- `.framework/capability-map.json` → Capability pages
- `.framework/blueprint-registry.json` → Blueprint documentation  
- `FRAMEWORK-DASHBOARD.md` → Dashboard data
- `docs/evolution/` → Evolution stories (blog)

### Update Process
1. **Develop framework features** (your normal workflow)
2. **Run data generators** (capability mapper, blueprint registry)
3. **Build/deploy docs** (automatic on push or manual script)

## 📊 **Live Dashboard Features**

Your documentation includes a live dashboard showing:
- **Framework version and health status**
- **64 capabilities across 4 categories** 
- **Visual capability distribution charts**
- **Blueprint registry statistics**
- **Quick action buttons**

## 🎨 **Customization Options**

### Update Branding
- **Logo**: Replace `website/static/img/logo.svg`
- **Favicon**: Replace `website/static/img/favicon.ico`
- **Colors**: Edit `website/src/css/custom.css`

### Add Content
- **Documentation**: Add files to `website/docs/`
- **Blog Posts**: Add files to `website/blog/`
- **Pages**: Add components to `website/src/pages/`

### Modify Navigation
- **Sidebar**: Edit `website/sidebars.ts`
- **Navbar**: Edit `website/docusaurus.config.ts`

## 🔧 **Available Commands**

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
```

## 🎉 **Result**

You now have a **professional, auto-updating documentation site** that:

✅ **Displays live framework data** (64 capabilities, health status, blueprints)  
✅ **Updates automatically** from your framework's observability system  
✅ **Provides professional navigation** and search  
✅ **Deploys to GitHub Pages** with zero server costs  
✅ **Maintains itself** as your framework evolves  

**Your documentation debt is now solved with a beautiful, live, searchable site!** 🚀📚✨

---

## 🔗 **Next Steps**

1. **Visit your local site**: http://localhost:3000
2. **Update GitHub username** in config files
3. **Push to trigger deployment** or run deployment script
4. **Share your documentation URL** with users and contributors

The observability system you built earlier now powers a professional documentation site that explains your framework automatically!
