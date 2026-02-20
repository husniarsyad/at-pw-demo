module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:node/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': ['warn'],
    'no-console': 'off',
    'node/no-unpublished-require': [
      'error',
      {
        allowModules: ['@playwright/test'],
      },
    ],
  },
};
