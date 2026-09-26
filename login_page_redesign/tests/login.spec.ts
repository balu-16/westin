import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function controls(page: Page) {
  await page.getByText("Preview controls", { exact: true }).click();
}

async function otpStep(page: Page, role: "faculty" | "admin") {
  await controls(page);
  await page.getByRole("button", { name: role, exact: true }).click();
  await page
    .getByLabel(`${role === "faculty" ? "Faculty" : "Admin"} ID or email`)
    .fill("DEMO-001");
  await page.getByRole("button", { name: "Send my code" }).click();
  await expect(
    page.getByRole("heading", { name: "Check your inbox." }),
  ).toBeVisible();
}

test("student validation, password reveal, and local success without credential storage or requests", async ({
  page,
}) => {
  const requests: string[] = [];
  const errors: string[] = [];
  page.on("request", (request) => {
    if (request.method() !== "GET") requests.push(request.url());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Let’s get started" }).click();
  await expect(page.getByRole("alert")).toContainText("Enter your student ID");
  await expect(page.getByLabel("Student ID or email")).toBeFocused();
  await page.getByLabel("Student ID or email").fill("DEMO-STUDENT");
  await page.getByRole("button", { name: "Let’s get started" }).click();
  await expect(page.getByLabel("Password", { exact: true })).toBeFocused();
  await page
    .getByLabel("Password", { exact: true })
    .fill("synthetic-demo-password");
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute(
    "type",
    "text",
  );
  await page.getByRole("button", { name: "Hide password" }).click();
  await page.getByRole("button", { name: "Let’s get started" }).click();
  await expect(
    page.getByRole("button", { name: "Signing in…" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("heading", { name: "Hello, possibility." }),
  ).toBeFocused();
  expect(
    await page.evaluate(() =>
      JSON.stringify({ ...localStorage, ...sessionStorage }),
    ),
  ).not.toContain("synthetic-demo-password");
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  expect(await page.evaluate(() => Object.keys(sessionStorage))).toEqual([
    "westin.login-redesign.intro-seen.v1",
  ]);
  expect(requests).toEqual([]);
  expect(errors).toEqual([]);
  await page.getByRole("button", { name: "Try it again" }).click();
  await expect(page.getByLabel("Student ID or email")).toBeFocused();
  await expect(page.getByLabel("Password", { exact: true })).toHaveValue("");
});

for (const role of ["faculty", "admin"] as const) {
  test(`${role}: OTP autofill, invalid code, pasted code and success`, async ({
    page,
  }) => {
    await page.goto("/");
    await otpStep(page, role);
    const digit = (number: number) =>
      page.getByRole("textbox", { name: `Digit ${number} of 6`, exact: true });
    await expect(digit(1)).toBeFocused();
    await digit(1).fill("12");
    await expect(digit(2)).toHaveValue("2");
    await expect(digit(3)).toBeFocused();
    await digit(3).press("Backspace");
    await expect(digit(2)).toBeFocused();
    await digit(2).press("ArrowLeft");
    await expect(digit(1)).toBeFocused();
    await digit(1).fill("999999");
    await page.getByRole("button", { name: "Verify & sign in" }).click();
    await expect(page.getByRole("alert")).toContainText(
      "That code isn’t quite right",
    );
    await expect(digit(1)).toBeFocused();
    await digit(1).evaluate((element) => {
      const data = new DataTransfer();
      data.setData("text", "123 456");
      element.dispatchEvent(
        new ClipboardEvent("paste", {
          clipboardData: data,
          bubbles: true,
          cancelable: true,
        }),
      );
    });
    await expect(digit(6)).toHaveValue("6");
    await page.getByRole("button", { name: "Verify & sign in" }).click();
    await expect(
      page.getByRole("heading", { name: "Hello, possibility." }),
    ).toBeFocused();
  });
}

test("OTP resend respects elapsed time, resets code and supports changing the identifier", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/");
  await otpStep(page, "faculty");
  await expect(page.getByText("Resend code in")).toBeVisible();
  await page.clock.fastForward(31_000);
  await page.getByRole("button", { name: "Resend code", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("fresh demo code");
  await expect(
    page.getByRole("textbox", { name: "Digit 1 of 6", exact: true }),
  ).toBeFocused();
  await expect(page.getByText("Resend code in")).toBeVisible();
  await page
    .getByRole("button", { name: "Use a different ID or email" })
    .click();
  await expect(page.getByLabel("Faculty ID or email")).toBeFocused();
});

test("accepted OTP plays the orbit and check transition without shifting the 320px card", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 320, height: 1000 });
  await page.goto("/");
  await otpStep(page, "faculty");
  await page.getByLabel("Digit 1 of 6", { exact: true }).fill("999999");
  await page.getByRole("button", { name: "Verify & sign in" }).click();
  await expect(page.getByRole("alert")).toContainText("isn’t quite right");
  await expect(page.locator(".otp-confirmation")).toHaveCount(0);
  await page.getByLabel("Digit 1 of 6", { exact: true }).fill("123456");
  await page.getByRole("button", { name: "Verify & sign in" }).click();
  const before = await page
    .locator(".login-card")
    .evaluate((element) => element.getBoundingClientRect().height);
  await expect(
    page.getByRole("heading", { name: "Code confirmed." }),
  ).toBeFocused();
  await expect(page.getByRole("status")).toHaveText("Demo code accepted.");
  expect(
    await page
      .locator(".otp-confirmation-scene")
      .evaluate((element) =>
        element
          .getAnimations({ subtree: true })
          .some((animation) => animation.playState === "running"),
      ),
  ).toBe(true);
  const during = await page
    .locator(".login-card")
    .evaluate((element) => element.getBoundingClientRect().height);
  expect(Math.abs(during - before)).toBeLessThan(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320,
  );
  await expect(
    page.getByRole("heading", { name: "Hello, possibility." }),
  ).toBeFocused();
  const after = await page
    .locator(".login-card")
    .evaluate((element) => element.getBoundingClientRect().height);
  expect(Math.abs(after - before)).toBeLessThan(1);
  await expect(page.locator(".otp-confirmation")).toHaveCount(0);
});

for (const preference of ["system", "manual"] as const) {
  test(`${preference} reduced motion completes OTP without the animated delay`, async ({
    page,
  }) => {
    await page.clock.install();
    await page.emulateMedia({
      reducedMotion: preference === "system" ? "reduce" : "no-preference",
    });
    await page.goto("/");
    await otpStep(page, "admin");
    if (preference === "manual") await page.getByLabel("Reduce motion").check();
    await page.getByLabel("Digit 1 of 6", { exact: true }).fill("123456");
    await page.getByRole("button", { name: "Verify & sign in" }).click();
    await page.clock.runFor(900);
    await expect(
      page.getByRole("heading", { name: "Hello, possibility." }),
    ).toBeFocused();
    await expect(page.locator(".otp-confirmation")).toHaveCount(0);
  });
}

test("changing roles cancels an in-progress OTP confirmation", async ({
  page,
}) => {
  await page.clock.install();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await otpStep(page, "faculty");
  await page.getByLabel("Digit 1 of 6", { exact: true }).fill("123456");
  await page.getByRole("button", { name: "Verify & sign in" }).click();
  await expect(
    page.getByRole("heading", { name: "Code confirmed." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "student", exact: true }).click();
  await page.clock.fastForward(4000);
  await expect(page.getByLabel("Student ID or email")).toBeEnabled();
  await expect(
    page.getByRole("heading", { name: "Hello, possibility." }),
  ).toHaveCount(0);
  await expect(page.locator(".otp-confirmation")).toHaveCount(0);
});

test("role changes cancel pending demos and preview controls expose all form states", async ({
  page,
}) => {
  await page.goto("/");
  await controls(page);
  await page.getByRole("button", { name: "faculty", exact: true }).click();
  await page.getByLabel("Faculty ID or email").fill("DEMO-FACULTY");
  await page.getByRole("button", { name: "Send my code" }).click();
  await page.getByRole("button", { name: "student", exact: true }).click();
  await expect(page.getByLabel("Student ID or email")).toHaveValue("");
  await page.getByLabel("Form state").selectOption("error");
  await expect(page.getByRole("alert")).toContainText("Check your details");
  await page.getByLabel("Form state").selectOption("loading");
  await expect(
    page.getByRole("button", { name: "Signing in…" }),
  ).toBeDisabled();
  await page.getByLabel("Form state").selectOption("success");
  await expect(
    page.getByRole("heading", { name: "Hello, possibility." }),
  ).toBeVisible();
  await page.getByLabel("Form state").selectOption("ready");
  await expect(page.getByLabel("Student ID or email")).toBeEnabled();
  await page.getByRole("button", { name: "Mobile", exact: true }).click();
  expect(
    await page
      .locator(".preview-frame")
      .evaluate((element) => element.getBoundingClientRect().width),
  ).toBe(390);
});

test("skip link remains usable in OTP and success states", async ({ page }) => {
  await page.goto("/");
  await otpStep(page, "admin");
  await page.locator(".skip-link").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#login-form")).toBeFocused();
  await page.getByLabel("Form state").selectOption("success");
  await page.locator(".skip-link").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#login-form")).toBeFocused();
});

test("animation settles on keyboard intent, runs once per session, and can replay", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator(".login-stage")).toHaveAttribute(
    "data-pulling",
    "true",
  );
  await page.keyboard.press("Tab");
  await expect(page.locator(".login-stage")).toHaveAttribute(
    "data-pulling",
    "false",
  );
  await page.reload();
  await expect(page.locator(".login-stage")).toHaveAttribute(
    "data-pulling",
    "false",
  );
  await controls(page);
  await page.getByRole("button", { name: "Replay pull" }).click();
  await expect(page.locator(".login-stage")).toHaveAttribute(
    "data-pulling",
    "true",
  );
  await page.getByLabel("Student ID or email").focus();
  await expect(page.locator(".login-stage")).toHaveAttribute(
    "data-pulling",
    "false",
  );
  await page.getByLabel("Reduce motion").check();
  await page.getByRole("button", { name: "Replay pull" }).click();
  await expect(page.locator(".login-stage")).toHaveAttribute(
    "data-pulling",
    "false",
  );
  await page.getByLabel("Reduce motion").uncheck();
  await expect(page.locator(".login-stage")).toHaveAttribute(
    "data-pulling",
    "false",
  );
});

test("pull completes naturally and leaves no running decorative animations", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator(".login-stage")).toHaveAttribute(
    "data-pulling",
    "true",
  );
  await expect(page.locator(".login-stage")).toHaveAttribute(
    "data-pulling",
    "false",
    { timeout: 4000 },
  );
  expect(
    await page
      .locator(".login-stage")
      .evaluate(
        (element) =>
          element
            .getAnimations({ subtree: true })
            .filter((animation) => animation.playState === "running").length,
      ),
  ).toBe(0);
});

for (const width of [390, 1440]) {
  test(`automated accessibility: student states, controls and staff OTP at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(45_000);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await controls(page);
    for (const state of ["ready", "error", "loading", "success"]) {
      await page.getByLabel("Form state").selectOption(state);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(result.violations, `Student ${state}`).toEqual([]);
    }
    await page.getByRole("button", { name: "faculty", exact: true }).click();
    await page.getByLabel("Faculty ID or email").fill("DEMO-001");
    await page.getByRole("button", { name: "Send my code" }).click();
    await expect(
      page.getByRole("heading", { name: "Check your inbox." }),
    ).toBeVisible();
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(result.violations, "Faculty OTP").toEqual([]);
  });
}

test("system reduced motion bypasses the pulling animation, including replay", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".login-stage")).toHaveAttribute(
    "data-pulling",
    "false",
  );
  await controls(page);
  await page.getByRole("button", { name: "Replay pull" }).click();
  await expect(page.locator(".login-stage")).toHaveAttribute(
    "data-pulling",
    "false",
  );
});

for (const width of [320, 360, 390, 560, 768, 901, 1024, 1440, 1920]) {
  test(`layout at ${width}px has visible controls, attached rope, and no horizontal overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await expect(page.getByLabel("Student ID or email")).toBeVisible();
    await expect(page.locator(".story-sun")).toHaveCount(0);
    const metrics = await page.evaluate(() => {
      const grip = document
        .querySelector("[data-rope-grip]")!
        .getBoundingClientRect();
      const anchor = document
        .querySelector("[data-card-anchor]")!
        .getBoundingClientRect();
      const stage = document
        .querySelector(".login-stage")!
        .getBoundingClientRect();
      const path = document.querySelector<SVGPathElement>(".scene-rope path")!;
      const start = path.getPointAtLength(0);
      const end = path.getPointAtLength(path.getTotalLength());
      const field = document
        .querySelector("#login-identifier")!
        .getBoundingClientRect();
      const campus = document
        .querySelector(".campus-sketch")!
        .getBoundingClientRect();
      const copy = document
        .querySelector(".story-copy")!
        .getBoundingClientRect();
      return {
        startError: Math.hypot(
          start.x - (grip.left + grip.width / 2 - stage.left),
          start.y - (grip.top + grip.height / 2 - stage.top),
        ),
        endError: Math.hypot(
          end.x - (anchor.left + anchor.width / 2 - stage.left),
          end.y - (anchor.top + anchor.height / 2 - stage.top),
        ),
        fieldLeft: field.left,
        fieldRight: field.right,
        illustrationGap: campus.top - copy.bottom,
      };
    });
    expect(metrics.startError).toBeLessThan(2);
    expect(metrics.endError).toBeLessThan(2);
    expect(metrics.fieldLeft).toBeGreaterThanOrEqual(0);
    expect(metrics.fieldRight).toBeLessThanOrEqual(width);
    if (width <= 900)
      expect(metrics.illustrationGap).toBeGreaterThanOrEqual(-1);
  });
}
