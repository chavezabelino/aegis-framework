<!--
# 🚀 Deploy to GitHub Pages - Complete Guide

@aegisFrameworkVersion: 2.5.0
@intent: GitHub Pages deployment guide for AI Agent Development Governance documentation
@context: Deployment documentation for hosting framework documentation
@mode: strict
-->

# 🚀 Deploy to GitHub Pages - Complete Guide

## ✅ __SITE IS READY!**

Your Docusaurus documentation site is built and running at <http://localhost:3000/aegis-framework/>

## 🎯 __DEPLOYMENT OPTIONS**

### __Option A: Automated GitHub Actions (RECOMMENDED)**

#### Step 1: Update Configuration

1. __Edit `website/Docusaurus.config.ts`__:

   ```typescript
   // Replace "your-username" with your actual GitHub username
   url: 'https://your-username.github.io',
   organizationName: 'your-username',
   ```

#### Step 2: Enable GitHub Pages

1. __Go to your repository on GitHub**
2. __Settings__ → __Pages**
3. __Source__: Select "GitHub Actions"
4. __Save**

#### Step 3: Deploy

```bash
# Commit and push - GitHub Actions will automatically deploy
git add .
git commit -m "Add Docusaurus documentation site with live framework data"
git push origin main
```text

**Your site will be live at__: `https://your-username.github.io/aegis-framework/`

---

### __Option B: Manual Script Deployment**

```bash
# Update framework data and deploy in one command
./scripts/deploy-docs.sh
```text

### __Option C: Direct Deployment**

```bash
cd website

# Update config with your GitHub username first
# Then build and deploy
npm run build
npm run deploy
```text

## 📊 __WHAT YOUR SITE INCLUDES**

### __Live Framework Data**

- __64 Capabilities__ across 4 categories
- __Real-time Health Status**
- __Blueprint Registry__ with 2 active Blueprints
- __Auto-generated Documentation__ from your framework observability

### __Professional Navigation**

- __Homepage__: Framework overview with key features
- __Live Dashboard__: Real-time metrics and capability visualization
- __Documentation__: Getting started and tutorials
- __Capabilities__: Auto-generated from capability-map.JSON
- __Blueprints__: Auto-generated from Blueprint-registry.JSON
- __Evolution Stories__: Framework development history (blog)

### __Visual Features**

- __Capability Distribution Charts__: 59% Tools, 31% Core, 6% Governance, 3% Integration
- __Health Status Cards__: Live framework monitoring
- __Interactive Navigation__: Search, categories, version dropdown
- __Mobile Responsive__: Professional design on all devices

## 🔄 __KEEPING CONTENT UPDATED**

### __Automatic Updates**

Your site automatically generates content from:

```bash
# These files power your documentation
.framework/capability-map.JSON       # → Capability pages
.framework/Blueprint-registry.JSON   # → Blueprint docs
FRAMEWORK-DASHBOARD.md               # → Dashboard data
docs/evolution/                      # → Evolution stories (blog)
```text

### __Refresh Process**

```bash
# Update framework data (run these when you add capabilities)
node tools/framework-capability-mapper.ts
node framework/registry/Blueprint-registry.ts discover
node tools/update-framework-dashboard.ts

# Then rebuild/redeploy docs
cd website && npm run build && npm run deploy
```text

## 🎨 __CUSTOMIZATION OPTIONS**

### __Branding**

- __Logo__: Replace `website/static/img/logo.svg`
- __Favicon__: Replace `website/static/img/favicon.ico`
- __Colors__: Edit `website/src/CSS/custom.CSS`

### __Content**

- __Add Pages__: Create files in `website/docs/`
- __Blog Posts__: Add to `website/blog/`
- __Custom Components__: Add to `website/src/components/`

## 🔍 __TROUBLESHOOTING**

### __Common Issues**

#### __Build Errors**

```bash
# Clear cache and rebuild
cd website
rm -rf .Docusaurus build
npm run build
```text

#### __GitHub Pages Not Updating**

1. Check __Actions__ tab for deployment status
2. Verify __Pages__ settings use "GitHub Actions" source
3. Ensure `baseUrl: '/Aegis-framework/'` in config

#### __Missing Framework Data**

```bash
# Regenerate framework data
node tools/framework-capability-mapper.ts
node tools/update-framework-dashboard.ts
```text

## 🎉 __SUCCESS METRICS**

Once deployed, your site will provide:

✅ __Zero Documentation Debt__: Auto-updates from framework data  
✅ __Professional Presentation__: Beautiful, searchable, mobile-friendly  
✅ __Live Framework Status__: Real-time capability and health monitoring  
✅ __Developer Experience__: Comprehensive docs with examples  
✅ __Zero Server Costs__: Hosted free on GitHub Pages  
✅ __SEO Optimized__: Professional metadata and structure

## 🔗 __NEXT STEPS**

1. __🔧 Update your GitHub username__ in the config files
2. __🚀 Push to trigger deployment__ or run the deployment script
3. __📢 Share your documentation URL__ with users and contributors
4. __📈 Monitor usage__ through GitHub Pages analytics

**Your observability problem is now completely solved with a professional, auto-updating documentation website!__ 🚀📚✨

---

## 📞 __NEED HELP?**

- __Local Development__: `cd website && npm start`
- __Build Test__: `cd website && npm run build`
- __Force Deploy__: `./scripts/deploy-docs.sh`
- __Framework Data__: Run capability mapper and dashboard update scripts

**Your documentation now maintains itself as your framework evolves!__ 🎯
