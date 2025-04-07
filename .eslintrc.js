module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "space-before-blocks": "off",
    "quotes": "off",
    "no-extra-semi": "off"
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
