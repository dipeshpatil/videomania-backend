module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: true,
        process: true,
      },
    },
    rules: {
      'no-console': 'off', // Allows console.log statements
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Ignore unused variables with an underscore prefix
      'prefer-const': 'warn', // Suggest const for variables that aren't reassigned
      'consistent-return': 'off', // Disables the consistent return rule
      eqeqeq: ['warn', 'smart'], // Warn on loose equality, but allow comparison with null
      curly: ['error', 'all'], // Requires curly braces for all control flow statements
      indent: ['error', 2], // Enforces 2-space indentation
      semi: ['error', 'always'], // Requires semicolons
      quotes: ['error', 'single'], // Enforces single quotes for strings
    },
  },
  {
    ignores: ['node_modules/', '.vscode/', 'crypt.js'],
  },
];
