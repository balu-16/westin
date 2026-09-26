import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { StudentWalkingLoader } from "./StudentWalkingLoader";
import "./preview.css";

function MotionIcon({ paused }: { paused: boolean }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      {paused ? (
        <path d="m6 3 11 7-11 7V3Z" fill="currentColor" />
      ) : (
        <path
          d="M6 4v12M14 4v12"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function Preview() {
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const motion = { paused, speed };

  return (
    <main className="showcase">
      <header className="preview-header">
        <div className="wordmark">
          <span className="brand-mark" aria-hidden="true">
            W
          </span>
          <span>
            WESTIN<span>DESIGN STUDIES</span>
          </span>
        </div>
        <span className="preview-badge">
          LOADING STATE <span>02</span>
        </span>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <div className="hero-copy">
          <span className="overline">
            <i /> A LITTLE LIFE BETWEEN PAGES
          </span>
          <h1 id="page-title">
            The Westin
            <br />
            <span>Walker.</span>
          </h1>
          <p>
            A familiar face.
            <br />A more natural little moment.
          </p>
          <div className="illustration-notes">
            <div>
              <span>01</span>
              <p>
                Grounded steps
                <strong>Heel to toe. A gentle rise with each stride.</strong>
              </p>
            </div>
            <div>
              <span>02</span>
              <p>
                Thoughtful details
                <strong>
                  A tailored uniform, soft shading, and a fitted backpack.
                </strong>
              </p>
            </div>
            <div>
              <span>03</span>
              <p>
                Quiet by design
                <strong>Reduced-motion support. No distracting effects.</strong>
              </p>
            </div>
          </div>
        </div>
        <div className="hero-stage">
          <span className="stage-caption">WALKING TOWARDS WHAT’S NEXT</span>
          <StudentWalkingLoader
            {...motion}
            size={330}
            className="hero-loader"
            label="Loading your dashboard"
            sublabel="Good things are just a step away."
          />
          <div className="stage-meta">
            <span>ORIGINAL SVG</span>
            <span>1.25s WALK CYCLE</span>
          </div>
        </div>
      </section>

      <div className="motion-controls" aria-label="Animation preview controls">
        <div>
          <span
            className={`motion-indicator${paused || reduced ? " motion-indicator-paused" : ""}`}
          />
          <span>
            {reduced
              ? "Reduced motion · system setting"
              : paused
                ? "Motion paused"
                : "Walking in place"}
          </span>
        </div>
        <div className="control-actions">
          <label htmlFor="walk-speed">
            Speed
            <select
              id="walk-speed"
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
              disabled={reduced}
            >
              <option value="1">Natural</option>
              <option value="0.5">Slow study</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-pressed={paused}
            disabled={reduced}
          >
            <MotionIcon paused={paused} />
            {paused ? "Resume motion" : "Pause motion"}
          </button>
        </div>
      </div>

      <section className="example-section" aria-labelledby="scale-heading">
        <div className="section-heading">
          <div>
            <span className="overline">ONE CHARACTER, EVERY CONTEXT</span>
            <h2 id="scale-heading">Details that scale.</h2>
          </div>
          <p>The same illustration, without stretching or cropping.</p>
        </div>
        <div className="example-grid size-grid">
          {[56, 96, 160].map((size) => (
            <article className="example-card" key={size}>
              <div className="size-stage">
                <StudentWalkingLoader {...motion} size={size} label={null} />
              </div>
              <div className="example-caption">
                <strong>
                  {size === 56
                    ? "Compact"
                    : size === 96
                      ? "Everyday"
                      : "Room to breathe"}
                </strong>
                <span>{size}px</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="example-section" aria-labelledby="surface-heading">
        <div className="section-heading">
          <div>
            <span className="overline">LIGHT, DARK, AND IN BETWEEN</span>
            <h2 id="surface-heading">At home on every surface.</h2>
          </div>
        </div>
        <div className="example-grid surface-grid">
          <article className="example-card surface-dark">
            <StudentWalkingLoader
              {...motion}
              size={145}
              dark
              label="Fetching timetable"
              sublabel="One moment, please."
            />
            <div className="surface-caption">MIDNIGHT NAVY</div>
          </article>
          <article className="example-card surface-blue">
            <StudentWalkingLoader
              {...motion}
              size={145}
              label="Finding your materials"
            />
            <div className="surface-caption">CAMPUS BLUE</div>
          </article>
          <article className="example-card">
            <StudentWalkingLoader
              {...motion}
              size={145}
              label="Getting things ready"
            />
            <div className="surface-caption">CLEAN WHITE</div>
          </article>
        </div>
      </section>

      <section className="example-section" aria-labelledby="context-heading">
        <div className="section-heading">
          <div>
            <span className="overline">IN THE APPLICATION</span>
            <h2 id="context-heading">A softer pause.</h2>
          </div>
          <p>A loading fallback, not a progress estimate.</p>
        </div>
        <div className="context-frame">
          <div className="context-sidebar" aria-hidden="true">
            <span className="mock-brand">W</span>
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="context-content" aria-hidden="true">
            <i className="skeleton-title" />
            <div className="skeleton-cards">
              <i />
              <i />
              <i />
            </div>
            <i className="skeleton-panel" />
          </div>
          <div className="context-loader">
            <StudentWalkingLoader
              {...motion}
              size={145}
              label="Loading your dashboard"
              sublabel="Your campus, coming together."
            />
          </div>
        </div>
      </section>
      <footer>
        <span>WESTIN · LEARN. GROW. BELONG.</span>
        <p>
          Isolated design preview. HTML shell, shared React component, original
          vector artwork.
        </p>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Preview />
  </StrictMode>,
);
