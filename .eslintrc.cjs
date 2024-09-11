module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ['@mate-academy/eslint-config-react-typescript'],
  ignorePatterns: [
    'dist',
    '.eslintrc.cjs',
    'node_modules/**',
    'tsconfig.json',
    'vite.config.ts',
    'sass.config.js',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react/button-has-type': 'off',
    'import/extensions': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'object-curly-newline': ['error', { multiline: true, consistent: true }],
    'implicit-arrow-linebreak': 'off',
  },
};
