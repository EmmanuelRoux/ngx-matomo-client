import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    reporters: [
      'default',
      [
        'junit',
        {
          outputFile: resolve(__dirname, '../../test-reports/ngx-matomo-client/junit.xml'),
        },
      ],
    ],
    coverage: {
      provider: 'istanbul',
      reportsDirectory: resolve(__dirname, '../../coverage/ngx-matomo-client'),
      reporter: ['html', 'lcovonly', 'text-summary'],
    },
  },
});
