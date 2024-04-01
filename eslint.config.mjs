/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment */
// @ts-check
import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import vitest from 'eslint-plugin-vitest'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  eslintConfigPrettier,
  { ...vitest.configs.recommended, plugins: { vitest } },
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'no-process-env': 'error',
      'no-console': 'error',
      'simple-import-sort/imports': 'error',
      'sort-imports': 'off'
    },
    languageOptions: {
      parserOptions: { project: './tsconfig.lint.json' }
    }
  }
)
