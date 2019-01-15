module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: ['plugin:vue/essential', '@vue/prettier'],

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'graphql/template-strings': 'off',
    indent: 'off'
  },

  parserOptions: {
    parser: 'babel-eslint'
  },

  plugins: ['graphql']
};
