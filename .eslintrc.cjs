module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier', // Disable conflicts with Prettier
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['react', '@typescript-eslint'],
    rules: {
        'react/react-in-jsx-scope': 'off', // Not needed in React 17+
        'react/prop-types': 'off', // We use TypeScript for props
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
