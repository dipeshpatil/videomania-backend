const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules, // Include Prettier rules
      'no-console': 'off', // Allows console.log statements
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Ignore unused variables with an underscore prefix
      'prefer-const': 'warn', // Suggest const for variables that aren't reassigned
      'consistent-return': 'off', // Disables the consistent return rule
      eqeqeq: ['warn', 'smart'], // Warn on loose equality, but allow comparison with null
      curly: ['error', 'all'], // Requires curly braces for all control flow statements
      indent: ['error', 2, { SwitchCase: 1 }], // Enforces 2-space indentation
      semi: ['error', 'always'], // Requires semicolons
      quotes: ['error', 'single', { avoidEscape: true }], // Allows double quotes if escaping is required
    },
  },
  {
    ignores: ['node_modules/', '.vscode/', 'crypt.js'],
  },
];
