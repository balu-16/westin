/** A foot-led walk: solve the knees from the feet, instead of rotating sticks. */
const TAU = Math.PI * 2;
const DEG = 180 / Math.PI;
const THIGH = 66;
const SHIN = 62;
const GROUND = 330;
const CYCLE_MS = 1250;
const STANCE = 0.6;
const STRIDE = 72;

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
const smooth = (t: number) => t * t * (3 - 2 * t);

export interface LegPose {
  hip: number;
  knee: number;
  foot: number;
  ankleX: number;
  ankleY: number;
  planted: boolean;
}

export function solveLeg(phase: number, hipY: number): LegPose {
  const p = ((phase % 1) + 1) % 1;
  const planted = p < STANCE;
  let x: number;
  let lift = 0;
  let footAngle: number;
  if (planted) {
    x = STRIDE / 2 - (STRIDE * p) / STANCE;
    footAngle =
      p < 0.12
        ? -12 * (1 - smooth(p / 0.12))
        : p > 0.43
          ? 26 * smooth((p - 0.43) / (STANCE - 0.43))
          : 0;
  } else {
    const t = (p - STANCE) / (1 - STANCE);
    // Hermite endpoints retain the ground's velocity at toe-off and heel strike.
    x = -STRIDE / 2 + STRIDE * smooth(t) - 48 * t * (1 - t) * (1 - 2 * t);
    lift = 29 * Math.sin(Math.PI * t) ** 2;
    footAngle = 26 - 38 * smooth(t) - 9 * Math.sin(Math.PI * t) ** 2;
  }
  const rad = footAngle / DEG;
  // The lower of the heel/toe stays on the ground during stance.
  const sole = Math.max(
    -10 * Math.sin(rad) + 12 * Math.cos(rad),
    26 * Math.sin(rad) + 12 * Math.cos(rad),
  );
  const y = GROUND - sole - lift;
  const dy = y - hipY;
  const d = clamp(
    Math.hypot(x, dy),
    Math.abs(THIGH - SHIN) + 0.01,
    THIGH + SHIN - 0.01,
  );
  const direction = Math.atan2(-x, dy);
  const hip =
    direction -
    Math.acos(
      clamp((THIGH ** 2 + d ** 2 - SHIN ** 2) / (2 * THIGH * d), -1, 1),
    );
  const knee =
    Math.PI -
    Math.acos(
      clamp((THIGH ** 2 + SHIN ** 2 - d ** 2) / (2 * THIGH * SHIN), -1, 1),
    );
  return {
    hip: hip * DEG,
    knee: knee * DEG,
    foot: footAngle - (hip + knee) * DEG,
    ankleX: 140 + x,
    ankleY: y,
    planted,
  };
}

export function gaitPose(phase: number) {
  const p = ((phase % 1) + 1) % 1;
  const bob = -6 - (3 * (1 - Math.cos(p * TAU * 2))) / 2;
  const hipY = 200 + bob;
  return {
    bob,
    hipY,
    near: solveLeg(p, hipY),
    far: solveLeg(p + 0.5, hipY),
    // Small follow-through offsets keep the upper body from moving like a rigid rig.
    torso: 2.5 + 0.8 * Math.sin(p * TAU * 2 - 0.4),
    bag: 1.2 * Math.sin(p * TAU * 2 - 0.9),
    arm: 23 * Math.cos(p * TAU - 0.15),
    forearm: -12 - (8 * (1 - Math.cos(p * TAU))) / 2,
    farForearm: -12 - (8 * (1 + Math.cos(p * TAU))) / 2,
    head: -0.9 + 1.1 * Math.sin(p * TAU * 2 - 0.8),
    ground: -(p * 120) % 30,
  };
}

export type GaitPose = ReturnType<typeof gaitPose>;

// One animation clock for all visible instances; React never re-renders per frame.
type Tick = (delta: number) => void;
const active = new Set<Tick>();
let frame = 0;
let previous = 0;
function tick(now: number) {
  const delta = previous ? Math.min(now - previous, 64) : 0;
  previous = now;
  active.forEach((update) => update(delta));
  frame = active.size ? requestAnimationFrame(tick) : 0;
  if (!active.size) previous = 0;
}
function subscribe(update: Tick) {
  active.add(update);
  if (!frame) frame = requestAnimationFrame(tick);
}
function unsubscribe(update: Tick) {
  active.delete(update);
  if (!active.size) {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
  }
}

export interface WalkerController {
  setPaused: (paused: boolean) => void;
  setSpeed: (speed: number) => void;
  destroy: () => void;
}

export function animateWalker(svg: SVGSVGElement): WalkerController {
  const part = (name: string) =>
    svg.querySelector<SVGGElement>(`[data-part="${name}"]`)!;
  const nodes = {
    nearHip: part("near-thigh"),
    nearKnee: part("near-shin"),
    nearFoot: part("near-foot"),
    farHip: part("far-thigh"),
    farKnee: part("far-shin"),
    farFoot: part("far-foot"),
    body: part("body"),
    bag: part("backpack"),
    arm: part("near-arm"),
    forearm: part("near-forearm"),
    farArm: part("far-arm"),
    farForearm: part("far-forearm"),
    head: part("head"),
    ground: part("ground"),
  };
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  let phase = 0.08;
  let paused = false;
  let visible = true;
  let speed = 1;
  let destroyed = false;
  const transform = (node: SVGElement, value: string) =>
    node.setAttribute("transform", value);

  const draw = () => {
    const pose = gaitPose(phase);
    for (const side of ["near", "far"] as const) {
      const leg = pose[side];
      transform(
        nodes[`${side}Hip`],
        `translate(140 ${pose.hipY}) rotate(${leg.hip})`,
      );
      transform(nodes[`${side}Knee`], `translate(0 66) rotate(${leg.knee})`);
      transform(nodes[`${side}Foot`], `translate(0 62) rotate(${leg.foot})`);
    }
    transform(
      nodes.body,
      `translate(0 ${pose.bob}) rotate(${pose.torso} 140 200)`,
    );
    transform(nodes.bag, `rotate(${pose.bag} 110 128)`);
    transform(nodes.arm, `translate(137 117) rotate(${pose.arm})`);
    transform(nodes.forearm, `translate(0 42) rotate(${pose.forearm})`);
    transform(nodes.farArm, `translate(157 116) rotate(${-pose.arm})`);
    transform(nodes.farForearm, `translate(0 42) rotate(${pose.farForearm})`);
    transform(nodes.head, `rotate(${pose.head} 142 104)`);
    transform(nodes.ground, `translate(${pose.ground} 0)`);
  };
  const advance: Tick = (delta) => {
    phase = (phase + (delta * speed) / CYCLE_MS) % 1;
    draw();
  };
  const sync = () => {
    if (destroyed) return;
    const running = !paused && !media.matches && visible && !document.hidden;
    svg.dataset.motion = media.matches
      ? "reduced"
      : running
        ? "walking"
        : "paused";
    svg.closest(".swl")?.setAttribute("data-motion", svg.dataset.motion);
    if (running) subscribe(advance);
    else unsubscribe(advance);
    if (media.matches) {
      phase = 0.08;
      draw();
    }
  };
  const observer =
    typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting;
            sync();
          },
          { rootMargin: "40px" },
        );
  observer?.observe(svg);
  media.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  draw();
  sync();
  return {
    setPaused(value) {
      paused = value;
      sync();
    },
    setSpeed(value) {
      speed = Number.isFinite(value) ? clamp(value, 0.25, 2) : 1;
    },
    destroy() {
      destroyed = true;
      unsubscribe(advance);
      observer?.disconnect();
      media.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    },
  };
}
