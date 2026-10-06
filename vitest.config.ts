import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      include: ['src/**/*.test.{ts,tsx}'],
      exclude: ['e2e/**', ...configDefaults.exclude],
      setupFiles: ['./src/test/setup.ts'],
    },
  }),
)
