module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
  ],
  rules: {
    'no-duplicate-imports': 'error',
    'no-use-before-define': 'error',
    'default-case': 'error',
    eqeqeq: 'error',
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error'],
      },
    ],
    'no-else-return': 'error',
    'no-implicit-coercion': 'error',
    'no-invalid-this': 'error',
    'no-sequences': 'error',
    'no-shadow': 'error',
    'no-return-assign': 'error',
    'no-var': 'error',
    'one-var': ['error', 'never'],
    'arrow-parens': ['error', 'always'],
    'arrow-spacing': 'error',
    'brace-style': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    'eol-last': 'error',
    'no-multiple-empty-lines': 'error',
    'key-spacing': 'error',
    'template-curly-spacing': 'error',
    'object-curly-spacing': ['error', 'always'],
    'no-non-null-assertion': 'off',
    'no-empty': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'no-use-before-define': 'off',
    'import/order': [
      'warn',
      {
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
          },
        ],
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
      },
    ],
    'sort-imports': [
      'warn',
      {
        ignoreDeclarationSort: true,
      },
    ],
    'import/newline-after-import': [
      'warn',
      {
        count: 1,
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/no-array-index-key': 'error',
    'react/self-closing-comp': [
      'warn',
      {
        component: true,
        html: true,
      },
    ],
    'no-return-await': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
