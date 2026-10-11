import { test as base, expect } from '@playwright/test';
import { execSync } from 'node:child_process';

type TestFixtures = {
  resetDatabase: () => void;
};

export const test = base.extend<TestFixtures>({
  resetDatabase: async ({}, use) => {
    const reset = () => {
      execSync('php artisan db:seed --class=E2ETestSeeder --force', {
        stdio: 'ignore',
      });
    };
    await use(reset);
  },
});

export { expect };
