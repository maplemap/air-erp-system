const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    jest: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['eslint-plugin-no-inline-styles'],
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? ERROR : WARNING,
    'no-eval': ERROR,
    'react-hooks/rules-of-hooks': ERROR,
    'react-hooks/exhaustive-deps': ERROR,
    'max-params': [ERROR, 3],
    'no-debugger': ERROR,
    'no-nested-ternary': ERROR,
    'object-shorthand': ERROR,
    semi: [ERROR, 'always'],
    'no-extra-semi': OFF,
    quotes: [ERROR, 'single', {avoidEscape: true}],
    'no-inline-styles/no-inline-styles': ERROR,
    'no-unused-vars': OFF,
    'no-use-before-define': OFF,
    'react/react-in-jsx-scope': OFF,
    '@typescript-eslint/no-non-null-assertion': ERROR,
  },
};
