import { expect, test } from "@playwright/test";
import { gaitPose } from "../walker-motion";

test("foot-led gait keeps every supporting sole grounded and all joints connected", () => {
  for (let frame = 0; frame < 1000; frame++) {
    const pose = gaitPose(frame / 1000);
    const rad = Math.PI / 180;
    for (const side of ["near", "far"] as const) {
      const leg = pose[side];
      const hip = leg.hip * rad;
      const shin = (leg.hip + leg.knee) * rad;
      const foot = (leg.hip + leg.knee + leg.foot) * rad;
      const x = 140 - 66 * Math.sin(hip) - 62 * Math.sin(shin);
      const y = pose.hipY + 66 * Math.cos(hip) + 62 * Math.cos(shin);
      expect(Math.hypot(x - leg.ankleX, y - leg.ankleY)).toBeLessThan(0.01);
      const sole =
        y +
        Math.max(
          -10 * Math.sin(foot) + 12 * Math.cos(foot),
          26 * Math.sin(foot) + 12 * Math.cos(foot),
        );
      expect(sole).toBeLessThanOrEqual(330.001);
      if (leg.planted) expect(sole).toBeCloseTo(330, 5);
      expect(leg.knee).toBeGreaterThan(0);
      expect(leg.knee).toBeLessThan(100);
    }
  }
});

test("stride loops continuously and the supporting leg can extend naturally", () => {
  expect(gaitPose(0)).toEqual(gaitPose(1));
  expect(gaitPose(-0.25)).toEqual(gaitPose(0.75));
  expect(gaitPose(0).near.knee).toBeLessThan(15);
  for (const boundary of [0, 0.1, 0.5, 0.6, 1]) {
    const before = gaitPose(boundary - 0.00001);
    const after = gaitPose(boundary + 0.00001);
    for (const side of ["near", "far"] as const) {
      expect(Math.abs(before[side].hip - after[side].hip)).toBeLessThan(0.1);
      expect(Math.abs(before[side].knee - after[side].knee)).toBeLessThan(0.1);
      expect(Math.abs(before[side].foot - after[side].foot)).toBeLessThan(0.1);
    }
  }
});
