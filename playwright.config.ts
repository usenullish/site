import { defineConfig, devices } from "@playwright/test";

const DEV = (process.env.NODE_ENV ?? "production") === "development";

export default defineConfig({
  webServer: [
    {
      command: "pnpm --filter @usenullish/site-server dev",
      url: "http://localhost:3000/api/doc",
      reuseExistingServer: true,
    },
    {
      command: "pnpm --filter @usenullish/site-client dev",
      url: "http://localhost:4321/en/",
      reuseExistingServer: true,
    },
  ],
  testDir: "./e2e",
  testMatch: ["**/*.e2e.ts"],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: 1,
  use: {
    baseURL: "http://localhost:4321",
    trace: "on",
    ...(DEV && { headless: false }),
    timezoneId: "Europe/Zurich",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
