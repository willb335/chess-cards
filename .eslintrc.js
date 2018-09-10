module.exports = {
  extends: ['plugin:react/recommended', 'react-app'],
  rules: {
    'require-jsdoc': [
      'error',
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: false,
          ArrowFunctionExpression: true,
          FunctionExpression: true
        }
      }
    ],
    'valid-jsdoc': 'error'
  }
};
