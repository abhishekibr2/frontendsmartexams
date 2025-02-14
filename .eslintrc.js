module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
	env: {
		node: true,
		es2021: true,
		browser: true, // For browser-specific objects like HTMLElement
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@next/next/recommended',
	],
	plugins: [
		'security',
		'@next/next',
		'react',
		'react-hooks',
		'@typescript-eslint',
	],
	rules: {
		'no-console': 'warn',
		'no-unused-vars': [
			'warn',
			{
				vars: 'all',
				args: 'after-used',
				ignoreRestSiblings: true,
				varsIgnorePattern: '^phone_number$', // Ignore phone_number variable
			},
		],
		// '@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{ 'argsIgnorePattern': '^_' }
		],
		'no-undef': 'off', // If you need to use browser-specific objects
		'no-unexpected-multiline': 'warn', // Handle unexpected newlines
		'no-useless-escape': 'warn', // Handle unnecessary escape characters
		'no-useless-catch': 'warn', // Handle unnecessary try/catch
		'no-constant-condition': 'warn', // Handle constant conditions
		'react/react-in-jsx-scope': 'off', // React 17 and newer don't require this
		'no-extra-semi': 'warn', // Handle unnecessary semicolons
		'no-redeclare': 'warn', // Handle variable redeclaration
		'react/prop-types': 'warn', // Add warning for missing prop validation
		'react/jsx-no-target-blank': 'warn', // Add warning for missing rel="noopener noreferrer"
		'no-empty': 'warn', // Add warning for empty block statements
		'no-irregular-whitespace': 'warn', // Add warning for irregular whitespaces
		'no-duplicate-case': 'warn', // Warn on duplicate case labels
		'no-empty-pattern': 'warn', // Warn for empty object patterns
	},
};
