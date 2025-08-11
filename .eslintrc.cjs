module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'unicorn'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/strict', 'plugin:unicorn/recommended'],
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
  rules: {
    'unicorn/prefer-node-protocol': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    // Soft-guard: warn on raw Tailwind tokens if semantic tokens are expected.
    'no-restricted-syntax': [
      'warn',
      {
        selector:
          'Literal[value=/\\b(text|bg|from|to|via|border|shadow)-(red|blue|green|yellow|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose)(-|$)/]',
        message: 'Use semantic tokens; raw Tailwind color utilities are discouraged in Aegis.',
      },
    ],
  },
  ignorePatterns: ['dist', 'coverage', 'node_modules'],
};
