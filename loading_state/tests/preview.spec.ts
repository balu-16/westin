import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [320, 390, 560, 768, 1024, 1440]) {
  test(`responsive artwork and controls fit at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".swl")).toHaveCount(8);
    const layout = await page.evaluate(() => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
      art: [...document.querySelectorAll(".swl-art")].map((svg) => {
        const box = svg.getBoundingClientRect();
        return {
          left: box.left,
          right: box.right,
          ratio: box.height / box.width,
        };
      }),
    }));
    expect(layout.scroll).toBeLessThanOrEqual(width);
    for (const box of layout.art) {
      expect(box.left).toBeGreaterThanOrEqual(0);
      expect(box.right).toBeLessThanOrEqual(width);
      expect(box.ratio).toBeCloseTo(360 / 280, 2);
    }
    await expect(
      page.getByRole("button", { name: "Pause motion" }),
    ).toBeDisabled();
  });
}

test("instances have unique gradient IDs and accessible local-only loading states", async ({
  page,
}) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (!request.url().startsWith("http://127.0.0.1:5177/"))
      external.push(request.url());
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const gradients = await page
    .locator("linearGradient")
    .evaluateAll((nodes) => nodes.map((node) => node.id));
  expect(gradients).toHaveLength(24);
  expect(new Set(gradients).size).toBe(24);
  expect(
    await page.locator('[fill^="url(#"]').evaluateAll((nodes) =>
      nodes.every((node) => {
        const id = node.getAttribute("fill")!.slice(5, -1);
        return !!node.closest("svg")?.querySelector(`[id="${id}"]`);
      }),
    ),
  ).toBe(true);
  await expect(
    page.getByRole("status", { name: "Loading your dashboard" }).first(),
  ).toBeVisible();
  await expect(page.locator(".swl-dark")).toHaveAttribute(
    "aria-label",
    "Fetching timetable",
  );
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test("walking pauses, resumes, and supports keyboard speed control", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const figure = page.locator(".hero-loader .swl-art");
  const leg = figure.locator('[data-part="near-thigh"]');
  await expect(figure).toHaveAttribute("data-motion", "walking");
  const initial = await leg.getAttribute("transform");
  await expect.poll(() => leg.getAttribute("transform")).not.toBe(initial);
  await page.getByRole("button", { name: "Pause motion" }).click();
  await expect(figure).toHaveAttribute("data-motion", "paused");
  const paused = await leg.getAttribute("transform");
  await page.waitForTimeout(160);
  expect(await leg.getAttribute("transform")).toBe(paused);
  await page.getByLabel("Speed").selectOption("0.5");
  await page.getByRole("button", { name: "Resume motion" }).focus();
  await page.keyboard.press("Enter");
  await expect(figure).toHaveAttribute("data-motion", "walking");
  await expect.poll(() => leg.getAttribute("transform")).not.toBe(paused);
});

test("system reduced motion stops the walk and dots immediately, and can resume", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const figure = page.locator(".hero-loader .swl-art");
  const leg = figure.locator('[data-part="near-thigh"]');
  const head = figure.locator('[data-part="head"]');
  await expect(figure).toHaveAttribute("data-motion", "walking");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(figure).toHaveAttribute("data-motion", "reduced");
  await expect(
    page.getByRole("button", { name: "Pause motion" }),
  ).toBeDisabled();
  const pose = await leg.getAttribute("transform");
  const headPose = await head.getAttribute("transform");
  await page.waitForTimeout(160);
  expect(await leg.getAttribute("transform")).toBe(pose);
  expect(await head.getAttribute("transform")).toBe(headPose);
  expect(
    await page
      .locator(".hero-loader .swl-dots i")
      .first()
      .evaluate((node) => getComputedStyle(node).animationName),
  ).toBe("none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(figure).toHaveAttribute("data-motion", "walking");
  await expect.poll(() => leg.getAttribute("transform")).not.toBe(pose);
  await expect.poll(() => head.getAttribute("transform")).not.toBe(headPose);
});

test("offscreen walkers stop until they enter the viewport", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const hero = page.locator(".hero-loader .swl-art");
  const context = page.locator(".context-loader .swl-art");
  await expect(hero).toHaveAttribute("data-motion", "walking");
  await expect(context).toHaveAttribute("data-motion", "paused");
  await context.scrollIntoViewIfNeeded();
  await expect(hero).toHaveAttribute("data-motion", "paused");
  await expect(context).toHaveAttribute("data-motion", "walking");
});

for (const width of [390, 1440]) {
  test(`automated accessibility check at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
  });
}
