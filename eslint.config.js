import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default defineConfig(
  {
    ignores: ['dist/**'],
  },
  eslint.configs.recommended,
  {
    files: ['src/*.ts'],
    extends: [tseslint.configs.recommendedTypeChecked],
  },
  {
    languageOptions: {
      parserOptions: { projectService: true },
      globals: globals.node,
    },
  },
)
