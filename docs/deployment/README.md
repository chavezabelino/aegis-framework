<!--
# Deployment Documentation

@aegisFrameworkVersion: 2.5.0
@intent: Deployment directory index and navigation
@context: Index for all deployment and hosting documentation
@mode: strict
-->

# Deployment Documentation

This directory contains deployment guides and hosting documentation for the AI Agent Development Governance Framework.

## Available Deployment Guides

### GitHub Pages Deployment

**[DEPLOY-TO-GitHub-PAGES.md](DEPLOY-TO-GitHub-PAGES.md)**

Complete guide for deploying the framework documentation site to GitHub Pages. Includes:

- **Automated GitHub Actions** setup (recommended)
- **Manual deployment** options
- **Custom domain** configuration
- **Build optimization** and troubleshooting

**Status**: Production Ready  
**Supports**: Docusaurus documentation sites  
**Requirements**: GitHub repository with Pages enabled

### Docusaurus Setup

**[Docusaurus-SETUP.md](DOCUSAURUS-SETUP.md)**

Setup and configuration guide for the Docusaurus documentation site. Covers:

- **Initial setup** and project structure
- **Configuration** for AI Agent Development Governance theme
- **Custom components** and plugin integration
- **Local development** environment setup

**Status**: Production Ready  
**Version**: Docusaurus v3.x compatible  
**Features**: Full framework documentation support

## Deployment Options

### Documentation Hosting

- **GitHub Pages**: Automated deployment with GitHub Actions
- **Netlify**: Alternative hosting with continuous deployment
- **Vercel**: Fast hosting with preview deployments
- **Custom Server**: Self-hosted documentation options

### Framework Distribution

- **npm Package**: `@Aegis-framework/CLI` for command-line tools
- **Docker Images**: Containerized framework deployment
- **Source Installation**: Direct from GitHub repository
- **Enterprise Packages**: Custom distribution for organizations

## Quick Start

### Deploy Documentation Site

```
# 1. Setup Docusaurus (if not already done)
cd website/
npm install

# 2. Build documentation
npm run build

# 3. Deploy to GitHub Pages
npm run deploy
```

### Framework Installation

```
# Install globally via npm
npm install -g @Aegis-framework/CLI@2.5.0

# Initialize in your project
Aegis-conductor init
```

## Support & Troubleshooting

- **Deployment Issues**: Check [GitHub Pages Guide](DEPLOY-TO-GitHub-PAGES.md#troubleshooting)
- **Configuration Help**: See [Docusaurus Setup](DOCUSAURUS-SETUP.md#configuration)
- **Community Support**: [GitHub Discussions](https://github.com/your-org/aegis-framework/discussions)
- **Bug Reports**: [GitHub Issues](https://github.com/your-org/aegis-framework/issues)

---

**Maintained by**: Framework Development Team  
**Last Updated**: 2025-01-15  
**Next Review**: 2025-02-15
