import { expect, test } from "@playwright/test";
import { consumeMessage } from "./_mailpit.ts";

const FORMS = [
  { plan: "tester", lang: "en", path: "/en/contact/become-a-tester/" },
  { plan: "instance", lang: "fr", path: "/fr/contact/instance/" },
  { plan: "on-prem", lang: "de", path: "/de/contact/on-prem/" },
] as const;

for (const { plan, lang, path } of FORMS) {
  test(`sends the ${plan} contact request`, async ({ page }) => {
    const name = `E2E ${plan} ${Date.now()}`;
    const email = `${plan}@example.com`;
    const message = `Hello from the ${plan} e2e test.`;

    await page.goto(path);

    await page.locator('input[name="name"]').fill(name);
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="company"]').fill("Fluster GmbH");
    await page.locator('textarea[name="message"]').fill(message);

    await page.locator('button[type="submit"]').click();

    await expect(page.locator('[data-status="sent"]')).toBeVisible();

    const mail = await consumeMessage({ subject: `[nullish] ${plan}: ${name}` });

    expect(mail.ReplyTo.map(({ Address }) => Address)).toEqual([email]);
    expect(mail.Text).toContain(`Plan: ${plan}`);
    expect(mail.Text).toContain(`Language: ${lang}`);
    expect(mail.Text).toContain(message);
  });
}
