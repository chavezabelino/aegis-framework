<!--
@aegisFrameworkVersion: 2.5.0
@intent: GitHub Pages deployment guide for AI Agent Development Governance documentation
@context: Deployment documentation for hosting framework documentation
@mode: strict
-->

# 🚀 Deploy to GitHub Pages - Complete Guide

## ✅ **SITE IS READY!**

Your Docusaurus documentation site is built and running at http://localhost:3000/aegis-framework/

## 🎯 **DEPLOYMENT OPTIONS**

### **Option A: Automated GitHub Actions (RECOMMENDED)**

#### Step 1: Update Configuration
1. **Edit `website/docusaurus.config.ts`**:
   ```typescript
   // Replace "your-username" with your actual GitHub username
   url: 'https://your-username.github.io',
   organizationName: 'your-username',
   ```

#### Step 2: Enable GitHub Pages
1. **Go to your repository on GitHub**
2. **Settings** → **Pages**
3. **Source**: Select "GitHub Actions"
4. **Save**

#### Step 3: Deploy
```bash
# Commit and push - GitHub Actions will automatically deploy
git add .
git commit -m "Add Docusaurus documentation site with live framework data"
git push origin main
```

**Your site will be live at**: `https://your-username.github.io/aegis-framework/`

---

### **Option B: Manual Script Deployment**

```bash
# Update framework data and deploy in one command
./scripts/deploy-docs.sh
```

### **Option C: Direct Deployment**

```bash
cd website

# Update config with your GitHub username first
# Then build and deploy
npm run build
npm run deploy
```

## 📊 **WHAT YOUR SITE INCLUDES**

### **Live Framework Data**
- **64 Capabilities** across 4 categories
- **Real-time Health Status**
- **Blueprint Registry** with 2 active blueprints
- **Auto-generated Documentation** from your framework observability

### **Professional Navigation**
- **Homepage**: Framework overview with key features
- **Live Dashboard**: Real-time metrics and capability visualization
- **Documentation**: Getting started and tutorials
- **Capabilities**: Auto-generated from capability-map.json
- **Blueprints**: Auto-generated from blueprint-registry.json
- **Evolution Stories**: Framework development history (blog)

### **Visual Features**
- **Capability Distribution Charts**: 59% Tools, 31% Core, 6% Governance, 3% Integration
- **Health Status Cards**: Live framework monitoring
- **Interactive Navigation**: Search, categories, version dropdown
- **Mobile Responsive**: Professional design on all devices

## 🔄 **KEEPING CONTENT UPDATED**

### **Automatic Updates**
Your site automatically generates content from:
```bash
# These files power your documentation
.framework/capability-map.json       # → Capability pages
.framework/blueprint-registry.json   # → Blueprint docs
FRAMEWORK-DASHBOARD.md               # → Dashboard data
docs/evolution/                      # → Evolution stories (blog)
```

### **Refresh Process**
```bash
# Update framework data (run these when you add capabilities)
node tools/framework-capability-mapper.ts
node framework/registry/blueprint-registry.ts discover  
node tools/update-framework-dashboard.ts

# Then rebuild/redeploy docs
cd website && npm run build && npm run deploy
```

## 🎨 **CUSTOMIZATION OPTIONS**

### **Branding**
- **Logo**: Replace `website/static/img/logo.svg`
- **Favicon**: Replace `website/static/img/favicon.ico`  
- **Colors**: Edit `website/src/css/custom.css`

### **Content**
- **Add Pages**: Create files in `website/docs/`
- **Blog Posts**: Add to `website/blog/`
- **Custom Components**: Add to `website/src/components/`

## 🔍 **TROUBLESHOOTING**

### **Common Issues**

#### **Build Errors**
```bash
# Clear cache and rebuild
cd website
rm -rf .docusaurus build
npm run build
```

#### **GitHub Pages Not Updating**
1. Check **Actions** tab for deployment status
2. Verify **Pages** settings use "GitHub Actions" source
3. Ensure `baseUrl: '/aegis-framework/'` in config

#### **Missing Framework Data**
```bash
# Regenerate framework data
node tools/framework-capability-mapper.ts
node tools/update-framework-dashboard.ts
```

## 🎉 **SUCCESS METRICS**

Once deployed, your site will provide:

✅ **Zero Documentation Debt**: Auto-updates from framework data  
✅ **Professional Presentation**: Beautiful, searchable, mobile-friendly  
✅ **Live Framework Status**: Real-time capability and health monitoring  
✅ **Developer Experience**: Comprehensive docs with examples  
✅ **Zero Server Costs**: Hosted free on GitHub Pages  
✅ **SEO Optimized**: Professional metadata and structure  

## 🔗 **NEXT STEPS**

1. **🔧 Update your GitHub username** in the config files
2. **🚀 Push to trigger deployment** or run the deployment script
3. **📢 Share your documentation URL** with users and contributors
4. **📈 Monitor usage** through GitHub Pages analytics

**Your observability problem is now completely solved with a professional, auto-updating documentation website!** 🚀📚✨

---

## 📞 **NEED HELP?**

- **Local Development**: `cd website && npm start`
- **Build Test**: `cd website && npm run build`
- **Force Deploy**: `./scripts/deploy-docs.sh`
- **Framework Data**: Run capability mapper and dashboard update scripts

**Your documentation now maintains itself as your framework evolves!** 🎯
