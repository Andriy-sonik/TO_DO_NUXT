import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

const appDir = fileURLToPath(new URL('./app', import.meta.url))
const rootDir = fileURLToPath(new URL('./', import.meta.url))

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'app/**/*.{ts,vue}',
        'server/**/*.ts',
      ],
      exclude: [
        'app/types/**',
        'app/app.vue',
      ],
    },
    projects: [
      {
        resolve: {
          alias: {
            '~': appDir,
            '@': appDir,
            '~~': rootDir,
          },
        },
        test: {
          name: 'unit',
          include: ['test/unit/**/*.{test,spec}.ts'],
          environment: 'node',
          setupFiles: ['test/unit/setup.ts'],
        },
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/**/*.{test,spec}.ts'],
          environment: 'nuxt',
        },
      }),
    ],
  },
})
