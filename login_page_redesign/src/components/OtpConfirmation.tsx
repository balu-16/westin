import { useEffect, useRef, type CSSProperties } from "react";
import "./otp-confirmation.css";

interface OtpConfirmationProps {
  reducedMotion: boolean;
  onComplete: () => void;
}

/** The accepted-code transition, adapted from the isolated otp animation study. */
export function OtpConfirmation({
  reducedMotion,
  onComplete,
}: OtpConfirmationProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let completed = false;
    const finish = () => {
      if (completed) return;
      completed = true;
      onComplete();
    };
    const timer = window.setTimeout(
      finish,
      reducedMotion || preference.matches ? 0 : 2400,
    );
    const onPreferenceChange = () => {
      if (preference.matches) finish();
    };
    preference.addEventListener("change", onPreferenceChange);
    return () => {
      completed = true;
      window.clearTimeout(timer);
      preference.removeEventListener("change", onPreferenceChange);
    };
  }, [onComplete, reducedMotion]);

  return (
    <div className="otp-confirmation">
      <div className="card-heading">
        <h2 ref={headingRef} tabIndex={-1}>
          Code confirmed.
          <span className="heading-dot" />
        </h2>
        <p>Your next chapter is ready.</p>
      </div>
      <svg
        className="otp-confirmation-scene"
        viewBox="0 0 320 220"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <circle
          className="otp-confirmation-orbit"
          cx="160"
          cy="110"
          r="64"
          stroke="#bfd5e0"
          strokeDasharray="3 6"
        />
        <g transform="translate(160 110)">
          <g className="otp-confirmation-rotor">
            {Array.from({ length: 6 }, (_, index) => {
              const angle = ((index * 60 - 90) * Math.PI) / 180;
              return (
                <g
                  key={index}
                  className="otp-confirmation-tile"
                  style={
                    {
                      "--row-x": `${(index - 2.5) * 50}px`,
                      "--orbit-x": `${Math.cos(angle) * 64}px`,
                      "--orbit-y": `${Math.sin(angle) * 64}px`,
                    } as CSSProperties
                  }
                >
                  <rect x="-19" y="-24" width="38" height="48" rx="10" />
                  <text textAnchor="middle" dominantBaseline="central">
                    {index + 1}
                  </text>
                </g>
              );
            })}
          </g>
          <g className="otp-confirmation-check">
            <circle r="49" stroke="#cee8db" />
            <rect
              x="-34"
              y="-34"
              width="68"
              height="68"
              rx="23"
              fill="#e0f3e9"
              stroke="#91c6a9"
            />
            <path
              d="m-13 0 9 9 18-19"
              stroke="#28714f"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      </svg>
      <p className="otp-confirmation-status" role="status">
        Demo code accepted.
      </p>
      <p className="otp-confirmation-caption">Bringing it all together…</p>
    </div>
  );
}
