module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript',
    '@vue/airbnb',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020
  },
  settings: {
    'import/resolver': {
      'eslint-import-resolver-typescript': {}
    },
  },
  rules: {
    'max-len': 'off',
    'vue/max-len': [
      'warn',
      {
        code: 200,
        template: 120,
        tabWidth: 2,
        comments: 160,
        ignorePattern: '',
        ignoreComments: false,
        ignoreTrailingComments: false,
        ignoreUrls: false,
        ignoreStrings: false,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignoreHTMLAttributeValues: true,
        ignoreHTMLTextContents: true
      }
    ],
    'vue/max-attributes-per-line': ['error', { singleline: 4 }],
    'no-debugger': process.env.NODE_ENV === 'production' ? 1 : 0,
    'no-console': process.env.NODE_ENV === 'production' ? 1 : 0,
    semi: [1, 'never'],
    'comma-dangle': [1, {
      arrays: 'only-multiline',
      objects: 'only-multiline',
      imports: 'only-multiline',
      exports: 'only-multiline',
      functions: 'only-multiline'
    }],
    'prefer-template': 1,
    '@typescript-eslint/member-delimiter-style': 0,
    'prefer-destructuring': 0,
    'import/prefer-default-export': 0,
    'import/no-named-as-default': 0,
    'no-return-assign': 0,
    'class-methods-use-this': 0
  }
}
