/**
 * @aegisBlueprint: svelte-drizzle-adapter
 * @version: 1.0.0
 * @mode: strict
 * @intent: Provide utility functions for Svelte adapter operations
 * @context: Helper functions for component generation, validation, and database operations
 * @model: claude-3-5-sonnet
 * @hash: 6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4
 */

import { SvelteComponent, DrizzleSchema } from './adapter';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ComponentTemplate {
  script: string;
  template: string;
  styles: string;
}

export interface SchemaTemplate {
  tables: string;
  relations: string;
  migrations: string[];
}

export class SvelteUtils {
  /**
   * Generate a complete Svelte component from a component definition
   */
  static generateComponentTemplate(component: SvelteComponent): ComponentTemplate {
    const script = this.generateScript(component);
    const template = this.generateTemplate(component);
    const styles = this.generateStyles(component);

    return { script, template, styles };
  }

  /**
   * Generate Svelte component script
   */
  static generateScript(component: SvelteComponent): string {
    const propTypes = Object.entries(component.props)
      .map(([key, type]) => `  ${key}: ${type};`)
      .join('\n');

    const eventDispatches = component.events
      .map(event => `  const dispatch${event.charAt(0).toUpperCase() + event.slice(1)} = createEventDispatcher<{ ${event}: any }>();`)
      .join('\n');

    return `import { createEventDispatcher } from 'svelte';

interface Props {
${propTypes}
}

let { ${Object.keys(component.props).join(', ')} }: Props = $props();

${eventDispatches}

// Component logic here
`;
  }

  /**
   * Generate Svelte component template
   */
  static generateTemplate(component: SvelteComponent): string {
    const propBindings = Object.keys(component.props)
      .map(prop => `{${prop}}`)
      .join(' ');

    const eventHandlers = component.events
      .map(event => `on:${event}`)
      .join(' ');

    const slotElements = (component.slots || [])
      .map(slot => `<slot name="${slot}" />`)
      .join('\n  ');

    return `<div class="${component.name.toLowerCase()}-container">
  ${propBindings}
  ${eventHandlers}
  ${slotElements}
  <slot />
</div>`;
  }

  /**
   * Generate Svelte component styles
   */
  static generateStyles(component: SvelteComponent): string {
    return `.${component.name.toLowerCase()}-container {
  /* Component styles */
}`;
  }

  /**
   * Generate Drizzle schema from schema definition
   */
  static generateSchemaTemplate(schema: DrizzleSchema): SchemaTemplate {
    const tables = Object.entries(schema.tables)
      .map(([tableName, tableDef]) => this.generateTableDefinition(tableName, tableDef))
      .join('\n\n');

    const relations = Object.entries(schema.relations)
      .map(([relationName, relationDef]) => this.generateRelationDefinition(relationName, relationDef))
      .join('\n');

    return {
      tables,
      relations,
      migrations: schema.migrations
    };
  }

  /**
   * Generate table definition for Drizzle
   */
  static generateTableDefinition(tableName: string, tableDef: any): string {
    const columns = Object.entries(tableDef)
      .map(([columnName, columnDef]) => `  ${columnName}: ${columnDef},`)
      .join('\n');

    return `export const ${tableName} = pgTable('${tableName}', {
${columns}
});`;
  }

  /**
   * Generate relation definition for Drizzle
   */
  static generateRelationDefinition(relationName: string, relationDef: any): string {
    return `// ${relationName}: ${relationDef}`;
  }

  /**
   * Validate component definition
   */
  static validateComponent(component: SvelteComponent): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!component.name) {
      errors.push('Component name is required');
    }

    if (!component.props || Object.keys(component.props).length === 0) {
      warnings.push('Component has no props defined');
    }

    if (!component.events || component.events.length === 0) {
      warnings.push('Component has no events defined');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate schema definition
   */
  static validateSchema(schema: DrizzleSchema): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!schema.tables || Object.keys(schema.tables).length === 0) {
      errors.push('Schema must have at least one table');
    }

    if (!schema.relations) {
      warnings.push('Schema has no relations defined');
    }

    if (!schema.migrations || schema.migrations.length === 0) {
      warnings.push('Schema has no migrations defined');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Generate TypeScript types for component props
   */
  static generateTypeScriptTypes(component: SvelteComponent): string {
    const propTypes = Object.entries(component.props)
      .map(([key, type]) => `  ${key}: ${type};`)
      .join('\n');

    return `interface ${component.name}Props {
${propTypes}
}`;
  }

  /**
   * Generate event types for component
   */
  static generateEventTypes(component: SvelteComponent): string {
    const eventTypes = component.events
      .map(event => `  ${event}: CustomEvent<any>;`)
      .join('\n');

    return `interface ${component.name}Events {
${eventTypes}
}`;
  }

  /**
   * Generate complete component file content
   */
  static generateComponentFile(component: SvelteComponent): string {
    const script = this.generateScript(component);
    const template = this.generateTemplate(component);
    const styles = this.generateStyles(component);

    return `${script}

${template}

<style>
${styles}
</style>`;
  }

  /**
   * Generate complete schema file content
   */
  static generateSchemaFile(schema: DrizzleSchema): string {
    const schemaTemplate = this.generateSchemaTemplate(schema);

    return `import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';

${schemaTemplate.tables}

${schemaTemplate.relations}

// Migrations: ${schemaTemplate.migrations.join(', ')}`;
  }
}
