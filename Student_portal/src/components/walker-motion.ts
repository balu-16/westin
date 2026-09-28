/** A foot-led walk: solve the knees from the feet, instead of rotating sticks. */
const TAU = Math.PI * 2;
const DEG = 180 / Math.PI;
const THIGH = 66;
const SHIN = 62;
const GROUND = 330;
const CYCLE_MS = 1400;
const STANCE = 0.6;
const STRIDE = 60;
// Fraction of the swing reserved for a quick, soft settle onto the heel so
// the foot never snaps to the ground. Stance itself stays near-linear to
// match the ground dashes — full easing there reads as sticking.
const SETTLE = 0.12;
// Constant rest bias (degrees) shifting both arms' swing neutral backward so
// the visible hand settles at the side instead of drifting forward.
export const ARM_BIAS = 7;
export const GROUND_DASH_SPACING = STRIDE / STANCE / 4;

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
const smooth = (t: number) => t * t * (3 - 2 * t);
// Swing travel with softened endpoints: half speed at take-off and landing,
// whip through mid-swing. Zero end velocity would park the foot (the old
// stuck look); full linear speed would snap the nearly-straight knee.
const swingTravel = (t: number) => t - 0.5 / (Math.PI * 2) * Math.sin(t * Math.PI * 2);

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
    // Near-linear belt with a gentle 35% slowdown right at the contacts.
    // Fully linear spikes knee velocity through full extension; fully eased
    // parks the foot and reads as stuck. Positions match exactly at heel
    // strike / toe-off, only the reversal is rounded.
    const u = p / STANCE;
    const eased = u - 0.35 * Math.sin(u * Math.PI * 2) / (Math.PI * 2);
    x = STRIDE * (0.5 - eased);
    // Continuous heel-to-toe roll with no flat hold. Heel contacts slightly
    // dorsiflexed, rolls through mid-stance, then pushes through the toe.
    if (u < 0.25) footAngle = -10 + 10 * smooth(u / 0.25);
    else if (u < 0.65) footAngle = 0 + 7 * smooth((u - 0.25) / 0.4);
    else footAngle = 7 + 15 * smooth((u - 0.65) / 0.35);
  } else {
    const t = (p - STANCE) / (1 - STANCE);
    x = STRIDE * (swingTravel(t) - 0.5);
    // Non-zero take-off velocity (plain sine, not sine-squared) plus a short
    // settle at the end, so the foot lifts promptly and lands softly instead
    // of dwelling at either contact.
    const settle = smooth(clamp((t - (1 - SETTLE)) / SETTLE, 0, 1));
    lift = 16 * Math.sin(Math.PI * t) * (1 - 0.3 * settle);
    // Match stance endpoints (22 push-off -> -10 heel strike) with extra
    // toe-up mid-swing for clearance.
    footAngle =
      22 - 32 * smooth(t) - 6 * Math.sin(Math.PI * t);
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
  // Hips ride HIGH at midstance (leg near-locked, ~3°) and dip through
  // double support — the real COM pattern. The old bob peaked at the
  // contacts, which held the knee at ~20° for the whole cycle.
  const bob = (190.8 - 200) - 2.0 * Math.cos(p * TAU * 2 - 0.32 * TAU * 2);
  const hipY = 200 + bob;
  return {
    bob,
    hipY,
    near: solveLeg(p, hipY),
    far: solveLeg(p + 0.5, hipY),
    // Small follow-through offsets keep the upper body from moving like a rigid rig.
    torso: 2.2 + 0.5 * Math.sin(p * TAU * 2 - 0.4),
    bag: 0.8 * Math.sin(p * TAU * 2 - 0.9),
    arm: 16 * Math.cos(p * TAU - 0.15),
    forearm: -10 - (4 * (1 - Math.cos(p * TAU))) / 2,
    farForearm: -10 - (4 * (1 + Math.cos(p * TAU))) / 2,
    head: 0.55 * Math.sin(p * TAU * 2 - 0.8),
    ground: -(p * (STRIDE / STANCE)) % GROUND_DASH_SPACING,
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
    transform(
      nodes.bag,
      `translate(4 5) rotate(${pose.bag} 110 170) translate(110 170) scale(0.756) translate(-110 -170)`,
    );
    transform(nodes.arm, `translate(129 119) rotate(${pose.arm + ARM_BIAS})`);
    transform(nodes.forearm, `translate(0 42) rotate(${pose.forearm})`);
    transform(
      nodes.farArm,
      `translate(162 118) rotate(${-pose.arm + ARM_BIAS})`,
    );
    transform(nodes.farForearm, `translate(0 42) rotate(${pose.farForearm})`);
    transform(nodes.head, `rotate(${pose.head} 146 105)`);
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
