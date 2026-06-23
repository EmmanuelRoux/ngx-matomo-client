import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    reporters: [
      'default',
      ['junit', { outputFile: resolve(__dirname, '../../test-reports/demo/junit.xml') }],
    ],
    coverage: {
      provider: 'v8',
      reportsDirectory: resolve(__dirname, '../../coverage/demo'),
      reporter: ['html', 'lcovonly', 'text-summary'],
    },
  },
});
