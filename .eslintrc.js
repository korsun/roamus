module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
	],
	rules: {
		'jsx-quotes': ['error', 'prefer-single'],
		'no-duplicate-imports': 'error',
		'no-use-before-define': 'error',
		'default-case': 'error',
		'eqeqeq': 'error',
		'no-console': ['warn', {
			'allow': ['warn', 'error']
		}],
		'no-else-return': 'error',
		'no-implicit-coercion': 'error',
		'no-invalid-this': 'error',
		'no-sequences': 'error',
		'no-shadow': 'error',
		'no-return-assign': 'error',
		'no-var': 'error',
		'one-var': ['error', 'never'],
		'arrow-parens': ['error', 'always'],
		'arrow-spacing': 'error',
		'brace-style': 'error',
		'comma-dangle': ['error', 'always-multiline'],
		'eol-last': 'error',
		'no-multiple-empty-lines': 'error',
		'key-spacing': 'error',
		'semi': ['error', 'never'],
		'template-curly-spacing': 'error',
		'object-curly-spacing': ['error', 'always'],
		'no-non-null-assertion': 'off',
		'no-empty': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'no-use-before-define': 'off',
	}
}