const shared = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    // 'plugin:import/recommended',
    'plugin:react/recommended',
    'plugin:flowtype/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    babelOptions: {
      configFile: './babel.config.js',
      presets: ['@babel/preset-env'],
    },
    ecmaFeatures: {
      ecmaVersion: 2017,
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    sourceType: 'module',
  },
  plugins: ['flowtype', 'prettier', 'react'],
  root: true,
  settings: {
    react: {
      version: 'detect',
    },
  },
}

const sharedRules = {
  camelcase: [
    'off',
    {
      properties: 'never',
    },
  ],
  'function-paren-newline': 'off',
  'getter-return': ['error', { allowImplicit: true }],
  'implicit-arrow-linebreak': 'off',
  // indent: [
  //   'error',
  //   2,
  //   {
  //     offsetTernaryExpressions: true,
  //     SwitchCase: 1,
  //     VariableDeclarator: 2,
  //   },
  // ],
  'keyword-spacing': 'error',
  'linebreak-style': ['error', 'unix'],
  'max-len': [
    'error',
    {
      code: 80,
      ignoreComments: true,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreTrailingComments: true,
      ignoreUrls: true,
      tabWidth: 2,
    },
  ],
  'no-process-env': 'off',
  'no-use-before-define': 'error',
  // 'object-curly-newline': [
  //   'error',
  //   {
  //     consistent: true,
  //     minProperties: 3,
  //     multiline: true,
  //   }
  // ],
  // 'prefer-destructuring': [
  //   'error',
  //   {
  //     array: false,
  //     object: true,
  //   },
  //   {
  //     enforceForRenamedProperties: true,
  //   }
  // ],
  'prettier/prettier': [
    'error',
    {
      bracketSpacing: true,
      jsxSingleQuote: true,
      printWidth: 80,
      semi: false,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'all',
    },
  ],
  quotes: [
    'error',
    'single',
    {
      avoidEscape: true,
    },
  ],
  'react/jsx-filename-extension': 'off',
  'react/jsx-indent': ['error', 2],
  'react/jsx-one-expression-per-line': [
    0,
    {
      allow: 'literal',
    },
  ],
  'react/jsx-sort-props': [
    'warn',
    {
      ignoreCase: true,
    },
  ],
  'react/jsx-tag-spacing': [
    'error',
    {
      afterOpening: 'never',
      beforeSelfClosing: 'always',
      closingSlash: 'never',
    },
  ],
  // 'react/jsx-wrap-multilines': [
  //   'error',
  //   {
  //     arrow: 'parens-new-line',
  //     assignment: 'parens-new-line',
  //     condition: 'parens-new-line',
  //     declaration: 'parens-new-line',
  //     logical: 'parens-new-line',
  //     prop: 'parens-new-line',
  //     return: 'parens-new-line',
  //   },
  // ],
  'react/no-find-dom-node': 'off',
  'react/no-unused-prop-types': ['error', { skipShapeProps: true }],
  'react/prop-types': 'off',
  'react/require-default-props': 'off',
}

const development = {
  ...shared,
  rules: {
    ...sharedRules,
    'no-console': 'warn',
    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',
      },
    ],
    'sort-keys': [
      'warn',
      'asc',
      {
        caseSensitive: false,
        minKeys: 2,
        natural: false,
      },
    ],
  },
}

const production = {
  ...shared,
  rules: {
    ...sharedRules,
    'no-console': [
      'error',
      {
        allow: ['warn', 'error'],
      },
    ],
    'no-unused-vars': [
      'error',
      {
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',
      },
    ],
    'react/jsx-sort-props': [
      'error',
      {
        ignoreCase: true,
      },
    ],
    'sort-keys': [
      'error',
      'asc',
      {
        caseSensitive: false,
        minKeys: 2,
        natural: false,
      },
    ],
  },
}

if (process.env.NODE_ENV === 'production') {
  module.exports = production
} else {
  module.exports = development
}
