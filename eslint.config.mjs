// @ts-check
import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['node_modules/**', 'dist/**'] },
  eslint.configs.recommended,
  // typescript-eslint
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: { project: './tsconfig.lint.json' }
    }
  },
  // Prettier
  eslintConfigPrettier,
  // simple-import-sort
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error'
    }
  }
)
