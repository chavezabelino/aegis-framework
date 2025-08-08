import { defineConfig } from 'vite'
import { resolve } from 'path'

/**
 * @aegisFrameworkVersion: 2.0.1
 * @intent: Vite configuration for CLI tools
 * @context: Simplified build for Node.js CLI applications
 */

export default defineConfig({
  build: {
    target: 'node18',
    outDir: 'dist',
    sourcemap: true,
    minify: false, // Keep readable for CLI tools
    rollupOptions: {
      input: {
        'aegis-conductor': resolve(__dirname, 'cli/aegis-conductor.ts'),
        'generate-cursor-instructions': resolve(__dirname, 'cli/generate-cursor-instructions.ts'),
        'cursor-realtime-cli': resolve(__dirname, 'cli/cursor-realtime-cli.ts'),
        'cursor-integration': resolve(__dirname, 'tools/cursor-integration.ts'),
        'cursor-realtime-integration': resolve(__dirname, 'tools/cursor-realtime-integration.ts'),
        'realtime-evolution-detection': resolve(__dirname, 'tools/realtime-evolution-detection.ts'),
        'detect-evolution-stories': resolve(__dirname, 'tools/detect-evolution-stories.ts')
      },
      external: [
        // Node.js built-ins
        'fs',
        'path',
        'url',
        'events',
        'child_process',
        'process',
        'os',
        'crypto',
        'util',
        'stream',
        'buffer',
        'querystring',
        'http',
        'https',
        'zlib',
        'assert',
        'constants',
        'domain',
        'punycode',
        'string_decoder',
        'timers',
        'tty',
        'vm',
        'worker_threads',
        
        // External dependencies
        'commander',
        'ejs',
        'inquirer',
        'js-yaml',
        'ora',
        'yargs',
        'zod',
        'esbuild'
      ],
      output: {
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash].[ext]'
      }
    }
  },

  // Resolve configuration
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      '@framework': resolve(__dirname, 'framework'),
      '@tools': resolve(__dirname, 'tools'),
      '@cli': resolve(__dirname, 'cli'),
      '@blueprints': resolve(__dirname, 'blueprints')
    }
  },

  // TypeScript configuration
  esbuild: {
    target: 'node18',
    platform: 'node'
  },

  // Define environment variables
  define: {
    __AEGIS_VERSION__: JSON.stringify(process.env.npm_package_version || '2.0.1'),
    __AEGIS_ENV__: JSON.stringify(process.env.NODE_ENV || 'development')
  }
})
