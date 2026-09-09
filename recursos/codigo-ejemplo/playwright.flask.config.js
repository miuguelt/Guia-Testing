import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/flask_jinja.spec.js",
  timeout: 10_000,
  use: {
    baseURL: "http://127.0.0.1:5017",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure"
  },
  webServer: {
    command: "python -m flask --app flask_jinja_demo/app.py run --host 127.0.0.1 --port 5017",
    url: "http://127.0.0.1:5017",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
