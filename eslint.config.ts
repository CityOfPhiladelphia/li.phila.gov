import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommendedTypeChecked,

  {
    // router.push and the store's load actions are fire-and-forget by design (the router
    // and the status refs carry the outcome); marking each call `void` hurts readability
    name: 'app/promises',
    files: ['**/*.{vue,ts,mts,tsx}'],
    rules: { '@typescript-eslint/no-floating-promises': 'off' },
  },
  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },
  {
    // the fakes that stand in for fetch use `async` on purpose, as the shortest way to
    // return a Promise the way fetch and response.json() do; nothing in them awaits
    name: 'app/test-fakes',
    files: ['src/**/__tests__/*'],
    rules: { '@typescript-eslint/require-await': 'off' },
  },

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  skipFormatting,
)
