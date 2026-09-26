import { useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Heart,
  Monitor,
  RotateCcw,
  SlidersHorizontal,
  Smartphone,
} from "lucide-react";
import { LoginPullScene } from "./components/LoginPullScene";
import { LoginCard } from "./components/LoginCard";
import type { DemoState, PortalRole, ViewportMode } from "./types";

export function App() {
  const [role, setRole] = useState<PortalRole>("student");
  const [demoState, setDemoState] = useState<DemoState>("ready");
  const [scenarioKey, setScenarioKey] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [viewport, setViewport] = useState<ViewportMode>("responsive");

  return (
    <div className="westin-preview" data-reduced-motion={reducedMotion}>
      <a className="skip-link" href="#login-form">
        Skip to sign in
      </a>
      <div
        className={`preview-frame${viewport === "mobile" ? " preview-frame-mobile" : ""}`}
      >
        <header className="page-header">
          <a
            href="https://www.westincolleges.com/vij/"
            target="_blank"
            rel="noreferrer"
            className="college-brand"
            aria-label="Visit Westin College website (opens a new tab)"
          >
            <img
              src="/westin-logo.png"
              alt="Westin College"
              width="575"
              height="294"
            />
            <span className="brand-divider" />
            <span className="brand-location">
              THE WESTIN WAY<span>Vijayawada campus</span>
            </span>
          </a>
          <a
            href="https://www.westincolleges.com/vij/"
            target="_blank"
            rel="noreferrer"
            className="college-link"
          >
            Explore Westin <ArrowUpRight size={16} />
          </a>
        </header>
        <main>
          <LoginPullScene replayKey={replayKey} reducedMotion={reducedMotion}>
            <LoginCard
              role={role}
              demoState={demoState}
              scenarioKey={scenarioKey}
              reducedMotion={reducedMotion}
            />
          </LoginPullScene>
        </main>
        <footer className="page-footer">
          <span>Learn. Grow. Belong.</span>
          <p>
            Made for your journey{" "}
            <Heart size={12} fill="currentColor" aria-hidden="true" />
            <span>Westin College</span>
          </p>
          <span className="footer-location">
            VIJAYAWADA, INDIA <span aria-hidden="true">↗</span>
          </span>
        </footer>
      </div>
      <details className="preview-controls">
        <summary>
          <SlidersHorizontal size={15} />
          <span>Preview controls</span>
          <span className="preview-pill">ISOLATED DEMO</span>
          <ChevronDown className="controls-chevron" size={16} />
        </summary>
        <div className="controls-body">
          <fieldset>
            <legend>Portal preview</legend>
            <div className="segmented-control">
              {(["student", "faculty", "admin"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={role === value}
                  onClick={() => {
                    setRole(value);
                    setDemoState("ready");
                    setScenarioKey((key) => key + 1);
                  }}
                >
                  {value}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="state-control">
            <label htmlFor="demo-state">Form state</label>
            <select
              id="demo-state"
              value={demoState}
              onChange={(event) => {
                setDemoState(event.target.value as DemoState);
                setScenarioKey((key) => key + 1);
              }}
            >
              <option value="ready">Ready</option>
              <option value="loading">Loading</option>
              <option value="error">Error</option>
              <option value="success">Success</option>
            </select>
          </div>
          <fieldset>
            <legend>Preview width</legend>
            <div className="segmented-control">
              <button
                type="button"
                aria-pressed={viewport === "responsive"}
                onClick={() => setViewport("responsive")}
              >
                <Monitor size={15} /> Responsive
              </button>
              <button
                type="button"
                aria-pressed={viewport === "mobile"}
                onClick={() => setViewport("mobile")}
              >
                <Smartphone size={15} /> Mobile
              </button>
            </div>
          </fieldset>
          <div className="motion-controls">
            <label className="motion-toggle">
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(event) => setReducedMotion(event.target.checked)}
              />
              <span>Reduce motion</span>
            </label>
            <button
              className="replay-button"
              type="button"
              onClick={() => setReplayKey((key) => key + 1)}
            >
              <RotateCcw size={14} /> Replay pull
            </button>
          </div>
          <p className="controls-note">
            Student: use any demo ID and password. Faculty/admin: use any demo
            ID, then code <strong>123456</strong>. Everything stays in this
            preview; no details are sent or saved.
          </p>
        </div>
      </details>
    </div>
  );
}
