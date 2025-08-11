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

- __Automated GitHub Actions__ setup (recommended)
- __Manual deployment__ options
- __Custom domain__ configuration
- __Build optimization__ and troubleshooting

**Status__: Production Ready  
**Supports__: Docusaurus documentation sites  
**Requirements__: GitHub repository with Pages enabled

### Docusaurus Setup

**[Docusaurus-SETUP.md](DOCUSAURUS-SETUP.md)**

Setup and configuration guide for the Docusaurus documentation site. Covers:

- __Initial setup__ and project structure
- __Configuration__ for AI Agent Development Governance theme
- __Custom components__ and plugin integration
- __Local development__ environment setup

**Status__: Production Ready  
**Version__: Docusaurus v3.x compatible  
**Features__: Full framework documentation support

## Deployment Options

### Documentation Hosting

- __GitHub Pages__: Automated deployment with GitHub Actions
- __Netlify__: Alternative hosting with continuous deployment
- __Vercel__: Fast hosting with preview deployments
- __Custom Server__: Self-hosted documentation options

### Framework Distribution

- __npm Package__: `@Aegis-framework/CLI` for command-line tools
- __Docker Images__: Containerized framework deployment
- __Source Installation__: Direct from GitHub repository
- __Enterprise Packages__: Custom distribution for organizations

## Quick Start

### Deploy Documentation Site

```bash
# 1. Setup Docusaurus (if not already done)
cd website/
npm install

# 2. Build documentation
npm run build

# 3. Deploy to GitHub Pages
npm run deploy
```text

### Framework Installation

```bash
# Install globally via npm
npm install -g @Aegis-framework/CLI@2.5.0

# Initialize in your project
Aegis-conductor init
```text

## Support & Troubleshooting

- __Deployment Issues__: Check [GitHub Pages Guide](DEPLOY-TO-GitHub-PAGES.md#troubleshooting)
- __Configuration Help__: See [Docusaurus Setup](DOCUSAURUS-SETUP.md#configuration)
- __Community Support__: [GitHub Discussions](https://github.com/your-org/aegis-framework/discussions)
- __Bug Reports__: [GitHub Issues](https://github.com/your-org/aegis-framework/issues)

---

**Maintained by__: Framework Development Team  
**Last Updated__: 2025-01-15  
**Next Review__: 2025-02-15
