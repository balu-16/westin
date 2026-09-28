import { useEffect, useId, useRef, type CSSProperties } from "react";
import {
  animateWalker,
  ARM_BIAS,
  gaitPose,
  GROUND_DASH_SPACING,
  type LegPose,
  type WalkerController,
} from "./walker-motion";
import "./walker.css";

export interface StudentWalkingLoaderProps {
  /** Width in pixels. The full-figure illustration uses a 280:360 aspect ratio. */
  size?: number;
  label?: string | null;
  sublabel?: string;
  dark?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Optional manual pause. OS reduced motion always takes precedence. */
  paused?: boolean;
  /** Walking speed multiplier, clamped to 0.25–2. Default 1. */
  speed?: number;
}

const REST = gaitPose(0.08);

function Leg({ side, pose }: { side: "near" | "far"; pose: LegPose }) {
  const fill = side === "near" ? "var(--swl-pants)" : "var(--swl-pants-back)";
  const seam = side === "near" ? "#49617D" : "#304760";
  return (
    <g
      data-part={`${side}-thigh`}
      transform={`translate(140 ${REST.hipY}) rotate(${pose.hip})`}
    >
      <path
        d="M-15-13C-17 10-13 39-11 61Q-10 72 1 74c10 0 13-5 13-14L14-12Z"
        fill={fill}
      />
      <path
        d="M-7 10c-1 16 0 30 2 42"
        stroke={seam}
        strokeWidth="2.2"
        opacity=".7"
      />
      <g
        data-part={`${side}-shin`}
        transform={`translate(0 66) rotate(${pose.knee})`}
      >
        <path
          d="M-11-8C-13 9-10 32-8 60l16 1 4-52c1-14-3-21-12-21Z"
          fill={fill}
        />
        <path d="m6 9-2 42" stroke={seam} strokeWidth="1.8" opacity=".7" />
        <path
          d="m-7 4 11-2m-11 5 6-1"
          stroke="#162D47"
          strokeWidth="1"
          opacity=".4"
        />
        <path
          d="m-8 54 16 1v7H-7Z"
          fill={side === "near" ? "#203751" : "#172D44"}
        />
        <g
          data-part={`${side}-foot`}
          transform={`translate(0 62) rotate(${pose.foot})`}
        >
          <path d="M-6-4H6l1 7H-7Z" fill="#DBE8ED" />
          <path d="m-5-2 10 .2" stroke="#AEC7D4" strokeWidth=".8" />
          <path
            d="M-9-1 5-2l7 6 10 2q4 1 4 6h-36c-2-7-1-10 1-13Z"
            fill="#FFFDFA"
            stroke="var(--swl-shoe-edge)"
            strokeWidth=".7"
          />
          <path d="m-9 1 6-1 6 6-13 2Z" fill="#BDDAE7" />
          <path d="m4-1 10 6L4 9-2 1Z" fill="#E5EFF3" />
          <path
            d="m6 3 5 1m-3 1 5 1m-3 1 5 1"
            stroke="#65899C"
            strokeWidth="1"
          />
          <path d="M-10 10c12 1 23 1 36 0v2h-36Z" fill="#CCDFE8" />
          <path d="M-8 12h32" stroke="var(--swl-shoe-edge)" strokeWidth=".7" />
        </g>
      </g>
    </g>
  );
}

function Arm({ far = false }: { far?: boolean }) {
  const side = far ? "far" : "near";
  const skin = far ? "#B47B56" : "var(--swl-skin)";
  return (
    <g
      data-part={`${side}-arm`}
      transform={`translate(${far ? "162 118" : "129 119"}) rotate(${(far ? -REST.arm : REST.arm) + ARM_BIAS})`}
    >
      {/* The skin is behind a sewn sleeve and cuff, so both stay joined in motion. */}
      <path d="M-8 17C-9 27-8 34-6 42q6 7 12 0L8 17Z" fill={skin} />
      <g
        data-part={`${side}-forearm`}
        transform={`translate(0 42) rotate(${far ? REST.farForearm : REST.forearm})`}
      >
        <path d="M-6-5C-9 5-6 22-4 35l9-1 2-25c1-11-3-16-7-14Z" fill={skin} />
        {!far && <path d="m-3 5 2 23" stroke="#E6B68F" strokeWidth="2" />}
        <path
          d="M-4 31c-3 5-3 10-1 15 1 3 4 4 6 2 4 2 7-1 6-5l-1-8-3-4Z"
          fill={skin}
        />
        <path
          d="m4 35 3 5c1 3-1 5-3 4l-2-5"
          fill={skin}
          stroke={far ? "#966342" : "#AF7852"}
          strokeWidth=".8"
        />
        <path
          d="m-2 43 1 4m2-4 1 4"
          stroke={far ? "#966342" : "#AF7852"}
          strokeWidth=".7"
        />
      </g>
      <path
        d="M-10-6c5-6 17-3 21 5 3 7 3 17 1 27l-22 1c-3-12-7-27 0-33Z"
        fill={far ? "#579DC6" : "#88C7E6"}
      />
      {!far && (
        <path d="M-7-3c6-2 12 2 14 9l2 13" stroke="#BAE4F3" strokeWidth="2" />
      )}
      <path d="m-11 23 23-1v5l-22 1Z" fill={far ? "#9FCFE5" : "#C7E8F5"} />
      <path d="m-9 27 19-1" stroke="#589CC0" strokeWidth=".8" />
    </g>
  );
}

/** Same component powers every HTML showcase example; no duplicated SVG copies. */
export function StudentWalkingLoader({
  size = 120,
  label = "Loading",
  sublabel,
  dark = false,
  className = "",
  style,
  paused = false,
  speed = 1,
}: StudentWalkingLoaderProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const controller = useRef<WalkerController | null>(null);
  const id = useId();
  const width = Number.isFinite(size) ? Math.min(640, Math.max(40, size)) : 120;

  useEffect(() => {
    if (!svgRef.current) return;
    const motion = animateWalker(svgRef.current);
    controller.current = motion;
    return () => {
      motion.destroy();
      controller.current = null;
    };
  }, []);
  useEffect(() => {
    controller.current?.setPaused(paused);
  }, [paused]);
  useEffect(() => {
    controller.current?.setSpeed(speed);
  }, [speed]);

  return (
    <div
      className={`swl${dark ? " swl-dark" : ""} ${className}`}
      style={style}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label={label ?? "Loading"}
    >
      <svg
        ref={svgRef}
        className="swl-art"
        width={width}
        height={(width * 360) / 280}
        viewBox="0 0 280 360"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient
            id={`${id}-shirt`}
            x1="118"
            y1="113"
            x2="164"
            y2="193"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#9FD7EF" />
            <stop offset="1" stopColor="#539DC8" />
          </linearGradient>
          <linearGradient
            id={`${id}-pack`}
            x1="88"
            y1="115"
            x2="127"
            y2="194"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F6AD68" />
            <stop offset="1" stopColor="#E48244" />
          </linearGradient>
          <linearGradient
            id={`${id}-face`}
            x1="111"
            y1="55"
            x2="154"
            y2="100"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#DFAC7F" />
            <stop offset="1" stopColor="#C68A5C" />
          </linearGradient>
        </defs>
        <g strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="144" cy="332" rx="72" ry="5" fill="var(--swl-shadow)" />
          <path d="M38 331h204" stroke="var(--swl-ground)" strokeWidth="1.2" />
          <svg
            x="38"
            y="334"
            width="204"
            height="7"
            viewBox="0 0 204 7"
            overflow="hidden"
          >
            <g
              data-part="ground"
              transform={`translate(${REST.ground} 0)`}
              stroke="var(--swl-dash)"
              strokeWidth="1.4"
            >
              {Array.from({ length: 11 }, (_, index) => index).map((index) => (
                <path
                  key={index}
                  d={`M${index * GROUND_DASH_SPACING} 3h9`}
                />
              ))}
            </g>
          </svg>
          <Leg side="far" pose={REST.far} />
          <Leg side="near" pose={REST.near} />
          <g
            data-part="body"
            transform={`translate(0 ${REST.bob}) rotate(${REST.torso} 140 200)`}
          >
            <Arm far />
            {/* The bag is fitted to the back rather than floating outside the shoulder. */}
            <g data-part="backpack" transform={`translate(4 5) rotate(${REST.bag} 110 170) translate(110 170) scale(0.756) translate(-110 -170)`}>
              <path
                d="M110 112c-13-6-25 1-29 17l-8 43c-3 17 3 25 16 29l26 4c11 1 17-6 18-19l5-51c0-12-13-18-28-23Z"
                fill="#B56338"
              />
              <path
                d="M103 112c-13-1-20 8-23 24l-7 34c-3 16 2 24 14 27l21 4c10 1 15-6 17-19l7-48c1-11-14-20-29-22Z"
                fill={`url(#${id}-pack)`}
              />
              <path
                d="M106 117c12 2 17 8 15 19l-7 46c-1 9-5 15-12 15"
                stroke="#FFCE91"
                strokeWidth="1.7"
              />
              <path
                d="M87 127c3-6 9-9 15-8"
                stroke="#FFD5A1"
                strokeWidth="2.1"
              />
              <path
                d="m78 161 28 5-4 24-20-4c-7-1-10-6-8-14Z"
                fill="#F2AA6D"
                stroke="#D4824D"
                strokeWidth="1"
              />
              <path d="m79 167 24 4" stroke="#AA6139" strokeWidth="1.2" />
              <path d="m99 171-1 5" stroke="#FFE4B6" strokeWidth="1.8" />
              <path d="m80 181 20 4" stroke="#FFD09A" strokeWidth="1" />
              <path
                d="M99 114c1-9 5-13 11-10 4 2 6 6 5 12"
                stroke="#A76039"
                strokeWidth="3.4"
              />
              <path d="M102 111c1-5 3-7 7-6" stroke="#F2BC82" strokeWidth="1" />
            </g>
            <path
              d="M120 187h36l4 22c-12 3-28 1-42-3Z"
              fill="var(--swl-pants)"
            />
            <g data-part="shirt">
              <path
                d="M121 106 133 103l12 9 10-7c9 12 11 26 11 44l-3 46c-16 4-31 2-46-3l-5-38c-2-27-4-39 9-48Z"
                fill={`url(#${id}-shirt)`}
              />
              <path
                d="M122 110c-7 11-5 28-3 50l5 34-7-2-5-38c-2-22-3-37 10-44Z"
                fill="#4F98C1"
                opacity=".65"
              />
              <path d="m146 119 8 74" stroke="#4586AD" strokeWidth="1.7" />
              <path d="m149 120 7 72" stroke="#B6E0F0" strokeWidth="2.2" />
              <path
                d="m153 134 10 1v13l-5 3-4-4Z"
                fill="#7EBADC"
                stroke="#5794B9"
                strokeWidth=".8"
              />
              <path d="m154 138 8 1" stroke="#C0E4F3" strokeWidth=".8" />
              <circle cx="151" cy="140" r="1" fill="#F4FAFD" />
              <circle cx="153" cy="160" r="1" fill="#F4FAFD" />
              <circle cx="155" cy="182" r="1" fill="#F4FAFD" />
              <path
                d="m123 179 5 12m30-21-4 10M121 192c13 3 26 5 40 2"
                stroke="#488FB9"
                strokeWidth="1.1"
              />
            </g>
            <g data-part="strap">
              <path
                d="M111 123c3-20 17-23 23-9 6 14 7 39 7 63v9c-1 12-8 14-17 11"
                stroke="#9F613F"
                strokeWidth="7.5"
              />
              <path
                d="M111 123c3-20 17-23 23-9 6 14 7 39 7 63v9c-1 12-8 14-17 11"
                stroke="#DE965A"
                strokeWidth="4.8"
              />
              <path
                d="M113 119c3-12 12-16 17-6"
                stroke="#FFCB8C"
                strokeWidth="1"
              />
              <path d="m137 174 8 .3-.3 11-8-.3Z" fill="#3E586A" />
              <path d="m139 177 4 .2-.2 5-4-.2Z" fill="#EAC093" />
            </g>
            <Arm />
            <g data-part="head" transform={`rotate(${REST.head} 146 105)`}>
              {/* The neck turns with the head and extends beneath both jaw and collar. */}
              <path
                d="M141 87Q148 86 155 89l3 24-15 9-10-12Z"
                fill="var(--swl-skin)"
              />
              <path
                d="M143 95q6 6 13 3l1 8q-8 5-17-1Z"
                fill="#AF7652"
              />
              <g transform="translate(62 23) scale(.64)">
                <path
                  d="M104 47c14-12 37-9 47 5 5 7 4 17 7 25l7 10c2 3-1 5-7 6-2 15-12 23-25 20-15-3-24-13-26-27l-7-18Z"
                  fill={`url(#${id}-face)`}
                />
                <path
                  d="M146 60c2 9 1 16 5 23l7 7-2 10c-3 10-10 14-19 13 8-4 10-11 9-19l-4-17Z"
                  fill="#E0AA79"
                />
                <ellipse
                  cx="146"
                  cy="92"
                  rx="6"
                  ry="3.5"
                  fill="#DF9976"
                  opacity=".45"
                />
                <path
                  d="M141 72c4-3 8-2 10 0"
                  stroke="#283A4B"
                  strokeWidth="2.3"
                />
                <ellipse cx="149" cy="80" rx="2.1" ry="3.1" fill="#203046" />
                <circle cx="149.6" cy="79.2" r=".65" fill="#FFFDF5" />
                <path d="m158 90-4 1" stroke="#B37954" strokeWidth="1.2" />
                <path
                  d="M142 100c4 3 9 2 12-1"
                  stroke="#86543C"
                  strokeWidth="1.8"
                />
                <path d="m144 100 8-.5c-3 2-5 3-8 .5Z" fill="#FFF5DF" />
                <path
                  d="M107 89c-8-1-12-9-12-17-8-5-10-13-7-20 1-8 8-13 15-15 5-10 16-14 25-10 9-6 20-3 25 5 12 0 19 8 16 16-3 9-13 12-26 10-4 6-13 8-20 5 0 9-2 15-10 20Z"
                  fill="#1D3048"
                />
                <path
                  d="M96 51c7-9 12-7 18-10 8-5 14-7 22-2m-28 17c10 3 18 1 23-4"
                  stroke="#354D66"
                  strokeWidth="4.3"
                />
                <path
                  d="M112 81c-7-9-17-5-15 3 1 8 8 12 14 9Z"
                  fill="#D5A074"
                />
                <path
                  d="M103 83c4-2 6 1 5 5"
                  stroke="#AD7450"
                  strokeWidth="1.9"
                />
              </g>
            </g>
            <g data-part="collar">
              <path
                d="m133 101 12 11-9 12-10-17Z"
                fill="#C5E7F5"
                stroke="#5C9CBF"
                strokeWidth=".6"
              />
              <path
                d="m155 103-10 9 11 11 4-10Z"
                fill="#DFF2FA"
                stroke="#5C9CBF"
                strokeWidth=".6"
              />
            </g>
          </g>
        </g>
      </svg>
      {(label !== null || sublabel) && (
        <div className="swl-copy">
          {label !== null && (
            <span className="swl-label">
              {label}
              <span className="swl-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </span>
          )}
          {sublabel && <div className="swl-sub">{sublabel}</div>}
        </div>
      )}
    </div>
  );
}

export default StudentWalkingLoader;
