const fs = require('fs');
const path = require('path');

module.exports = function (context, options) {
  return {
    name: 'aegis-data-generator',
    async loadContent() {
      // Load framework data from parent directory
      const frameworkRoot = path.resolve(context.siteDir, '..');

      try {
        // Load capability map
        const capabilityMapPath = path.join(frameworkRoot, '.framework', 'capability-map.json');
        const capabilityMap = fs.existsSync(capabilityMapPath)
          ? JSON.parse(fs.readFileSync(capabilityMapPath, 'utf8'))
          : null;

        // Load blueprint registry
        const blueprintRegistryPath = path.join(frameworkRoot, '.framework', 'blueprint-registry.json');
        const blueprintRegistry = fs.existsSync(blueprintRegistryPath)
          ? JSON.parse(fs.readFileSync(blueprintRegistryPath, 'utf8'))
          : null;

        // Load framework dashboard
        const dashboardPath = path.join(frameworkRoot, 'FRAMEWORK-DASHBOARD.md');
        const dashboard = fs.existsSync(dashboardPath) ? fs.readFileSync(dashboardPath, 'utf8') : null;

        // Load version
        const versionPath = path.join(frameworkRoot, 'VERSION');
        const version = fs.existsSync(versionPath) ? fs.readFileSync(versionPath, 'utf8').trim() : 'unknown';

        return {
          capabilityMap,
          blueprintRegistry,
          dashboard,
          version,
          frameworkRoot,
        };
      } catch (error) {
        console.warn('Failed to load Aegis framework data:', error.message);
        return null;
      }
    },

    async contentLoaded({ content, actions }) {
      if (!content) return;

      const { createData, addRoute } = actions;

      // Create data for client-side components
      await createData('framework-data.json', JSON.stringify(content, null, 2));

      // Generate capability pages
      if (content.capabilityMap) {
        await this.generateCapabilityPages(content, actions);
      }

      // Generate blueprint pages
      if (content.blueprintRegistry) {
        await this.generateBlueprintPages(content, actions);
      }

      // Add dashboard route
      addRoute({
        path: '/dashboard',
        component: '@site/src/pages/Dashboard.tsx',
        exact: true,
      });
    },

    async generateCapabilityPages(content, actions) {
      const { createData } = actions;
      const { capabilityMap } = content;

      // Generate individual category pages
      for (const [category, capabilities] of Object.entries(capabilityMap.categories)) {
        const categoryData = {
          category,
          capabilities,
          totalCount: capabilities.length,
          statusBreakdown: this.getStatusBreakdown(capabilities),
        };

        await createData(`capability-${category}.json`, JSON.stringify(categoryData, null, 2));
      }
    },

    async generateBlueprintPages(content, actions) {
      const { createData } = actions;
      const { blueprintRegistry } = content;

      if (blueprintRegistry.blueprints) {
        // Group blueprints by category
        const blueprintsByCategory = blueprintRegistry.blueprints.reduce((acc, blueprint) => {
          if (!acc[blueprint.category]) {
            acc[blueprint.category] = [];
          }
          acc[blueprint.category].push(blueprint);
          return acc;
        }, {});

        await createData('blueprints-by-category.json', JSON.stringify(blueprintsByCategory, null, 2));
      }
    },

    getStatusBreakdown(capabilities) {
      return capabilities.reduce((acc, cap) => {
        acc[cap.status] = (acc[cap.status] || 0) + 1;
        return acc;
      }, {});
    },
  };
};
