module.exports = {
    'env': {
        'browser': true,
        'es6': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 2015,
        'sourceType': 'module'
    },
    'parser': 'babel-eslint',
    'rules': {
        // 'indent': ['error', 2],
        'linebreak-style': [
            'error',
            'windows'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'no-debugger': 2,
        'no-undef': 0,
        'no-unused-vars': 0,
        'no-mixed-spaces-and-tabs': 0,
        'camelcase': 2,
        'no-console': ['error', { allow: ['warn', 'error'] }],
        // 'space-in-parens': [2, 'never'],
        // 'default-case': 2,
        // 'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
        'no-delete-var': 2,
        'no-dupe-keys': 2,
        'no-dupe-args': 2,
        'no-else-return': 2,
        'no-eval': 2,
        'no-extra-bind': 2,
        'no-implied-eval': 2,
        'no-invalid-regexp': 2,
        'no-irregular-whitespace': 2,
        'no-lonely-if': 2,
        'no-multiple-empty-lines': [1, { 'max': 2 }],
        'no-proto': 2,
        'no-redeclare': 2,
        'no-sparse-arrays': 2,
        'no-trailing-spaces': 2,
        'no-unexpected-multiline': 2,
        'no-underscore-dangle': 2,
        'no-unneeded-ternary': 2,
        'no-useless-call': 2,
        // 'arrow-spacing': 2,
        // 'comma-spacing': 2,
        // 'comma-style': [2, 'last'],
        // 'key-spacing': [0, { 'beforeColon': false, 'afterColon': true }],
        // 'newline-after-var': 2,
        // 'object-curly-spacing': [2, 'always'],
        // 'space-before-function-paren': [0, 'always'],
        // 'wrap-iife': [2, 'inside'],
        // 'use-isnan': 2,
        // 'yoda': [2, 'never'],
        // 'prefer-arrow-callback': 2,
        'no-empty': 0,
        'no-duplicate-imports': 2,
        'no-floating-decimal': 2,
        // 'space-before-blocks': 2,
        // 'max-len': 2,
        // 'require-jsdoc': ['error', {
        //     'require': {
        //         'FunctionDeclaration': true,
        //         'MethodDefinition': false,
        //         'ClassDeclaration': false,
        //         'ArrowFunctionExpression': false,
        //         'FunctionExpression': false
        //     }
        // }],
        // 'space-infix-ops': ['error', { 'int32Hint': false }]
    }
};

// ./node_modules/.bin/eslint . --fix