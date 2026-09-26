import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { isolateThirdParties, ready, revealAll } from "./helpers";

test.beforeEach(async ({ page }) => isolateThirdParties(page));

for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  test(`complete responsive homepage at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await ready(page);
    await revealAll(page);
    await expect(page.locator(".sk-home > section")).toHaveCount(10);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      await page.locator(".sk-home img:visible").evaluateAll((images) =>
        images.every((node) => {
          const img = node as HTMLImageElement;
          return img.complete && img.naturalWidth > 0;
        }),
      ),
    ).toBe(true);
    const clipped = await page
      .locator(".sk-home a:visible, .sk-header a:visible, .sk-footer a:visible")
      .evaluateAll((nodes) =>
        nodes
          .filter((node) => {
            const r = node.getBoundingClientRect();
            return r.left < -1 || r.right > innerWidth + 1;
          })
          .map((node) => node.textContent),
      );
    expect(clipped).toEqual([]);
    if (width >= 1024) {
      const art = await page.locator(".sk-hero-art").boundingBox();
      expect(art!.x).toBeGreaterThanOrEqual(0);
      expect(art!.x + art!.width).toBeLessThanOrEqual(width);
    }
    if (width < 768) {
      await expect(page.locator(".sk-program-mobile article")).toHaveCount(3);
      expect(
        await page
          .locator(".sk-hero-art img")
          .evaluate((image) => (image as HTMLImageElement).currentSrc),
      ).toContain("skybook-mobile");
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `test-results/homepage-${width}.png`,
      fullPage: true,
    });
    expect(errors).toEqual([]);
  });
}

test("back-to-top returns the reader and keyboard focus to public content", async ({ page }) => {
  await page.goto("/");
  await ready(page);
  const back = page.getByRole("link", { name: "Back to top" });
  await back.scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);
  await back.click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.locator("#public-content")).toBeFocused();
});

test("program explorer supports pointer and complete tab keyboard controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const tabs = page.getByRole("tab");
  await tabs.nth(0).focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText(
    "make people feel welcome",
  );
  await expect(page.getByRole("tabpanel").locator("img")).toHaveAttribute(
    "src",
    /hospitality/,
  );
  await page.keyboard.press("End");
  await expect(tabs.nth(2)).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText("An open future");
  await page.keyboard.press("Home");
  await page.keyboard.press("ArrowLeft");
  await expect(tabs.nth(2)).toBeFocused();
  await tabs.nth(0).click();
  await expect(page.getByRole("tabpanel")).toContainText(
    "ideas that could change",
  );
});

test("mobile menu traps focus, restores focus, unlocks scroll and closes on navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open website menu" });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe(
    "hidden",
  );
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      ),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  await trigger.click();
  await dialog.getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("link", { name: "Call the college" }),
  ).toHaveAttribute("href", "tel:+919393755755");
});

test("contact and visit handoffs work without collecting or sending information", async ({
  page,
}) => {
  const posts: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") posts.push(request.url());
  });
  await page.goto("/admissions#visit");
  await expect(
    page.getByRole("heading", { name: "Picture yourself here." }),
  ).toBeVisible();
  await expect(page.locator("form")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: /Chat on WhatsApp/ }),
  ).toHaveAttribute("href", "https://api.whatsapp.com/send?phone=919393755755");
  await expect(
    page.getByRole("link", { name: /Official contact details/ }),
  ).toHaveAttribute("href", "https://www.westincolleges.com/vij/contact.html");
  await page.goto("/contact");
  await expect(
    page.getByRole("heading", { name: "Good questions. Warm welcomes." }),
  ).toBeVisible();
  expect(posts).toEqual([]);
});

test("homepage destinations resolve without public 404 or unintended login", async ({
  page,
}) => {
  await page.goto("/");
  await ready(page);
  const paths = await page
    .locator('a[href^="/"]')
    .evaluateAll((links) => [
      ...new Set(links.map((link) => link.getAttribute("href")!)),
    ]);
  for (const path of paths.filter((path) => path !== "/login")) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    await expect(
      page.getByText("That page has turned.", { exact: true }),
    ).toHaveCount(0);
    expect(new URL(page.url()).pathname).not.toBe("/login");
  }
});

test("public homepage stays public; private routes still require authentication", async ({
  page,
}) => {
  await page.goto("/");
  await ready(page);
  await expect(
    page.getByRole("link", { name: "Student login", exact: true }).first(),
  ).toHaveAttribute("href", "/login");
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.locator(".skybook-site")).toHaveCount(0);
});

test("signed-in student sees Dashboard without being redirected off the homepage", async ({
  page,
}) => {
  const privateRequests: string[] = [];
  page.on("request", (request) => {
    if (/\/api\/(auth|students|notifications)/.test(request.url()))
      privateRequests.push(request.url());
  });
  await page.addInitScript(() =>
    localStorage.setItem(
      "student-portal.session",
      JSON.stringify({
        accessToken: "synthetic-test-only",
        refreshToken: "synthetic-test-only",
        user: {
          id: "test-student",
          role: "student",
          name: "Test student",
          email: "test@example.invalid",
          studentId: "TEST-001",
        },
      }),
    ),
  );
  await page.goto("/");
  await ready(page);
  await expect(
    page
      .locator(".sk-header")
      .getByRole("link", { name: "Dashboard", exact: true }),
  ).toHaveAttribute("href", "/dashboard");
  await expect(page).toHaveURL(/\/$/);
  expect(privateRequests).toEqual([]);
});

test("missing artwork has a useful fallback with no layout collapse", async ({
  page,
}) => {
  await page.route("**/images/skybook/**", (route) => route.abort());
  await page.goto("/");
  await ready(page);
  await expect(page.getByText("A new chapter is waiting.")).toBeVisible();
  await expect(page.locator(".sk-hero-art")).toHaveCSS("min-width", "auto");
  await page.locator("#find-your-future").scrollIntoViewIfNeeded();
  await expect(
    page.locator(".sk-program-photo .sk-media-unavailable"),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Explore programs", exact: true }),
  ).toBeEnabled();
});

for (const width of [390, 1440]) {
  test(`WCAG automated checks at ${width}px including menu and contact`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await ready(page);
    await revealAll(page);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations).toEqual([]);
    if (width === 390) {
      await page.getByRole("button", { name: "Open website menu" }).click();
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
    }
    await page.goto("/contact");
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
  });
}

test("motion settles once per tab, reduced motion interrupts and storage failure is safe", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect
    .poll(() =>
      page.evaluate(() => sessionStorage.getItem("westin.skybook.intro")),
    )
    .toBe("seen");
  await expect(page.locator(".sk-home")).not.toHaveAttribute(
    "data-intro",
    "playing",
  );
  await page.reload();
  await ready(page);
  await expect(page.locator(".sk-home")).not.toHaveAttribute(
    "data-intro",
    "playing",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page
      .locator(".sk-home")
      .evaluate(
        (element) =>
          element
            .getAnimations({ subtree: true })
            .filter((animation) => animation.playState === "running").length,
      ),
  ).toBe(0);
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error("Storage unavailable");
    };
  });
  await page.reload();
  await ready(page);
  await expect(
    page.getByRole("link", { name: "Explore programs", exact: true }),
  ).toBeVisible();
});

test("landscape and 200% zoom-equivalent reflow retain essential controls", async ({
  page,
}) => {
  for (const viewport of [
    { width: 844, height: 390 },
    { width: 640, height: 450 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await ready(page);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(
      page.getByRole("link", { name: "Explore programs", exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Open website menu" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
  }
});

test("homepage has route-specific metadata, illustrated footer branding and no public staff access", async ({
  page,
}) => {
  await page.goto("/");
  await ready(page);
  await expect(page).toHaveTitle(
    "Westin College, Vijayawada — Big dreams. Bright beginnings.",
  );
  await expect(page.locator('meta[name="description"]')).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex,nofollow",
  );
  await expect(page.getByText("Design preview", { exact: false })).toHaveCount(0);
  await expect(page.locator(".sk-footer-wordmark")).toContainText("WESTIN");
  await expect(page.locator(".sk-footer-sketch .campus-sketch")).toBeVisible();
  await expect(page.getByText("More people.", { exact: false })).toBeVisible();
  await expect(page.getByText("A brighter you.")).toBeVisible();
  await expect(page.getByText("Same curiosity.", { exact: false })).toBeVisible();
  await expect(page.locator('a[href*="faculty"],a[href*="admin"]')).toHaveCount(
    0,
  );
  await expect(page.locator(".sk-hero h1")).toHaveCSS(
    "font-family",
    /SkybookDisplay/,
  );
  await expect(page.getByText("Imagination, illustrated.")).toHaveCount(0);
  await expect(page.locator(".sk-hero-art figcaption")).toHaveCount(0);
});

for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  test(`illustrated public heroes reflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/about", "/programs", "/campus", "/placements",
      "/why-westin", "/contact", "/admissions", "/news",
    ]) {
      await page.goto(path);
      await expect(page.locator(".sk-page-hero h1")).toBeVisible();
      await expect(page.locator(".sk-page-hero .campus-sketch")).toBeVisible();
      await expect(page.locator(".sk-page-hero-note")).toBeVisible();
      const opacity = Number(await page.locator(".sk-page-hero .campus-sketch").evaluate((node) => getComputedStyle(node).opacity));
      expect(opacity).toBeGreaterThanOrEqual(path === "/about" ? 0.65 : 0.5);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  });
}

test("public navigation animates, restores focus and respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await ready(page);
  await page.getByRole("link", { name: "About", exact: true }).first().click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator("#public-content")).toBeFocused();
  await expect(page.locator("main[data-public-route]")).toHaveCSS("animation-name", "sk-public-enter");
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("#public-content")).toBeFocused();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("link", { name: "Programs", exact: true }).first().click();
  await expect(page).toHaveURL(/\/programs$/);
  await expect(page.locator("main[data-public-route]")).toHaveCSS("animation-name", "none");
});

test("official course catalog has distinct sourced pages", async ({ page }) => {
  await page.goto("/programs");
  await expect(page.locator('a[href^="/programs/"]').filter({ hasText: "Explore course" })).toHaveCount(10);
  for (const slug of ["bba", "bba-honours", "hotel-management", "bhm-three-year", "bhm-honours", "work-integrated-hotel-management", "dhm-one-year", "food-production", "pgdhm", "intermediate"]) {
    await page.goto("/programs/" + slug);
    await expect(page.locator(".sk-page-hero h1")).toBeVisible();
    await expect(page.getByRole("heading", { name: "What you will explore" })).toBeVisible();
    await expect(page.getByRole("link", { name: /View college course page/ })).toHaveAttribute("href", /^https:\/\/www\.westincollegevijayawada\.com\//);
    await expect(page.getByText("Eligibility, duration, curriculum, fees, and current intake details will be shown only after college approval.")).toHaveCount(0);
  }
});

for (const width of [320, 390]) {
  test(`long official course headings fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const slug of ["bba-honours", "work-integrated-hotel-management", "food-production", "pgdhm", "intermediate"]) {
      await page.goto("/programs/" + slug);
      await expect(page.locator(".sk-page-hero h1")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), slug).toBe(true);
    }
  });
}

test("college pages use distinct official information and linked archive entries", async ({ page }) => {
  await page.goto("/about/mission-vision");
  await expect(page.getByRole("heading", { name: "Vision", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Mission", exact: true })).toBeVisible();
  await page.goto("/campus/infrastructure");
  await expect(page.getByText(/digital boards and internet/)).toBeVisible();
  await page.goto("/placements");
  await expect(page.getByText(/42 LPA highest package/).first()).toBeVisible();
  await expect(page.getByText(/Hyderabad campus interviews/)).toBeVisible();
  await page.goto("/magazine");
  await expect(page.getByRole("heading", { name: "Sattvika III" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Table: A Business Magazine" })).toBeVisible();
  await page.goto("/contact");
  await expect(page.getByRole("link", { name: "vijayawada@westin.ac.in" })).toHaveAttribute("href", "mailto:vijayawada@westin.ac.in");
});

for (const width of [390, 1440]) {
  test(`expanded course and editorial pages pass WCAG checks at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/programs", "/programs/work-integrated-hotel-management", "/placements", "/magazine"]) {
      await page.goto(path);
      await expect(page.locator(".sk-page-hero h1")).toBeVisible();
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(results.violations, path).toEqual([]);
    }
  });
}

test("in-page notes scroll smoothly and cross-page hashes reach their target", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await ready(page);
  await page.locator(".sk-scroll-note").click();
  await expect(page).toHaveURL(/#find-your-future$/);
  const earlyScroll = await page.evaluate(() => scrollY);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(600);
  expect(earlyScroll).toBeLessThan(600);
  await page.locator(".sk-hero").getByRole("link", { name: "Plan a campus visit" }).click();
  await expect(page).toHaveURL(/\/admissions#visit$/);
  await expect(page.locator("#visit")).toBeInViewport();
});
