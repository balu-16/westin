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
  expect(gaitPose(0).near.knee).toBeLessThan(20);
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

test("knees follow the healthy pattern: extend, absorb, extend, fold", () => {
  // Real gait (Perry/Winter): near-straight at heel strike and midstance,
  // ~15-20° flexion at loading response, ~60° peak in swing.
  let stanceMin = Infinity;
  let loadingMax = -Infinity;
  let swingPeak = -Infinity;
  let terminalExt = Infinity;
  for (let frame = 0; frame < 1000; frame++) {
    const pose = gaitPose(frame / 1000);
    for (const side of ["near", "far"] as const) {
      const legPhase = (frame / 1000 + (side === "far" ? 0.5 : 0)) % 1;
      if (legPhase < 0.6) {
        stanceMin = Math.min(stanceMin, pose[side].knee);
        if (legPhase > 0.05 && legPhase < 0.3)
          loadingMax = Math.max(loadingMax, pose[side].knee);
      } else {
        swingPeak = Math.max(swingPeak, pose[side].knee);
        if (legPhase > 0.9) terminalExt = Math.min(terminalExt, pose[side].knee);
      }
    }
  }
  // Old-style lock (faculty portal walker): near-straight at heel strike
  // and midstance, ~15-20° flexion at loading response, ~60° peak in swing.
  expect(stanceMin).toBeGreaterThan(1.5);
  expect(stanceMin).toBeLessThan(5);
  expect(loadingMax).toBeGreaterThan(12);
  expect(loadingMax).toBeLessThan(28);
  expect(swingPeak).toBeGreaterThan(45);
  expect(swingPeak).toBeLessThan(70);
  expect(terminalExt).toBeLessThan(13);
});

test("the free foot advances from toe-off to heel strike without dragging backward", () => {
  let previousX = gaitPose(0.6).near.ankleX;
  for (let frame = 1; frame <= 400; frame++) {
    const phase = 0.6 + frame / 1000;
    const x = gaitPose(phase).near.ankleX;
    expect(x).toBeGreaterThanOrEqual(previousX - 0.001);
    previousX = x;
  }
  const middle = gaitPose(0.8).near;
  const footAngle =
    ((middle.hip + middle.knee + middle.foot) * Math.PI) / 180;
  const sole =
    middle.ankleY +
    Math.max(
      -10 * Math.sin(footAngle) + 12 * Math.cos(footAngle),
      26 * Math.sin(footAngle) + 12 * Math.cos(footAngle),
    );
  expect(sole).toBeLessThan(315);
});

test("joint motion has no sharp jump within a step or across the loop", () => {
  for (let frame = 0; frame < 1000; frame++) {
    const before = gaitPose(frame / 1000);
    const after = gaitPose((frame + 1) / 1000);
    for (const side of ["near", "far"] as const) {
      for (const joint of ["hip", "knee", "foot"] as const) {
        // The knee locks through ~3° at midstance like the original walker,
        // so its peak rate is high right at the lock. Position stays
        // continuous — this is the crisp old-style lock, not a snap.
        expect(Math.abs(after[side][joint] - before[side][joint])).toBeLessThan(
          2.5,
        );
      }
    }
    expect(Math.abs(after.arm - before.arm)).toBeLessThan(0.2);
    expect(Math.abs(after.head - before.head)).toBeLessThan(0.02);
  }
});
