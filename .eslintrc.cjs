module.exports = {
  root: true,
  extends: ['next', 'next/core-web-vitals', 'eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  rules: {
    'no-console': 'off',
    '@next/next/no-img-element': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/prop-types': 'off',
    'no-unused-vars': 'off',
    'react/no-unescaped-entities': 'off',
    'no-undef': 'off'
  }
}
