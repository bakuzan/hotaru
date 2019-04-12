module.exports = {
  root: true,

  env: {
    node: true,
    browser: true
  },

  extends: ['plugin:vue/recommended', '@vue/prettier'],

  rules: {
    indent: 'off',
    'no-console': 'off',
    'no-debugger': 'off',
    'graphql/template-strings': 'off',
    'vue/html-closing-bracket-spacing': [
      'error',
      {
        selfClosingTag: 'always'
      }
    ]
  },

  parserOptions: {
    parser: 'babel-eslint'
  },

  plugins: ['graphql']
};
