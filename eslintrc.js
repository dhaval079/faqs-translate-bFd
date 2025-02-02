// .eslintrc.js
module.exports = {
    env: {
      node: true,
      mocha: true,
      es2021: true
    },
    extends: [
      'eslint:recommended',
      'plugin:node/recommended',
      'prettier'
    ],
    parserOptions: {
      ecmaVersion: 2021
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'node/exports-style': ['error', 'module.exports'],
      'node/file-extension-in-import': ['error', 'always'],
      'node/prefer-global/buffer': ['error', 'always'],
      'node/prefer-global/console': ['error', 'always'],
      'node/prefer-global/process': ['error', 'always'],
      'node/prefer-global/url-search-params': ['error', 'always'],
      'node/prefer-global/url': ['error', 'always'],
      'node/prefer-promises/dns': 'error',
      'node/prefer-promises/fs': 'error'
    }
  };
  
  // .prettierrc

  
  // .editorconfig
  