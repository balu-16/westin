import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { DemoState, PortalRole } from "../types";
import { OtpConfirmation } from "./OtpConfirmation";

interface LoginCardProps {
  role: PortalRole;
  demoState: DemoState;
  scenarioKey: number;
  reducedMotion: boolean;
}

const ROLE_NAMES = { student: "Student", faculty: "Faculty", admin: "Admin" };

export function LoginCard({
  role,
  demoState,
  scenarioKey,
  reducedMotion,
}: LoginCardProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"identifier" | "otp">("identifier");
  const [status, setStatus] = useState<DemoState>("ready");
  const [error, setError] = useState("");
  const [invalid, setInvalid] = useState<
    "identifier" | "password" | "otp" | null
  >(null);
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [resent, setResent] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [confirmingOtp, setConfirmingOtp] = useState(false);
  const [settledHeight, setSettledHeight] = useState<number>();
  const cardRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);
  const resendDeadlineRef = useRef(0);
  const pendingOtpFocusRef = useRef(false);
  const identifierRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const successRef = useRef<HTMLHeadingElement>(null);
  const student = role === "student";
  const loading = status === "loading";
  const otpActive = step === "otp" && status !== "success" && !confirmingOtp;

  const finishOtp = useCallback(() => {
    setConfirmingOtp(false);
    setStatus("success");
  }, []);

  useEffect(() => {
    timersRef.current.forEach(window.clearTimeout);
    timersRef.current = [];
    pendingOtpFocusRef.current = false;
    setIdentifier("");
    setPassword("");
    setShowPassword(false);
    setStep("identifier");
    setDigits(Array(6).fill(""));
    setStatus(demoState);
    setError(
      demoState === "error"
        ? "That didn’t quite work. Check your details and give it another try."
        : "",
    );
    setInvalid(null);
    setHelpOpen(false);
    setResent(false);
    setConfirmingOtp(false);
    setSettledHeight(undefined);
    return () => timersRef.current.forEach(window.clearTimeout);
  }, [role, demoState, scenarioKey]);

  useEffect(() => {
    if (!otpActive) return;
    otpRefs.current[0]?.focus();
    const timer = window.setInterval(() => {
      setSecondsLeft(
        Math.max(0, Math.ceil((resendDeadlineRef.current - Date.now()) / 1000)),
      );
    }, 1000);
    return () => window.clearInterval(timer);
  }, [otpActive]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  useEffect(() => {
    // Wait until React has re-enabled inputs after the simulated request.
    if (!loading && pendingOtpFocusRef.current) {
      pendingOtpFocusRef.current = false;
      otpRefs.current[0]?.focus();
    }
  }, [loading]);

  const later = (callback: () => void) => {
    timersRef.current.push(window.setTimeout(callback, 850));
  };

  const clearError = () => {
    setError("");
    setInvalid(null);
    if (status === "error") setStatus("ready");
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    clearError();
    if (!identifier.trim()) {
      setError(
        `Enter your ${student ? "student ID or email" : "college ID or email"} to continue.`,
      );
      setInvalid("identifier");
      identifierRef.current?.focus();
      return;
    }
    if (student && !password) {
      setError("Enter a demo password to continue.");
      setInvalid("password");
      passwordRef.current?.focus();
      return;
    }
    if (step === "otp" && digits.some((digit) => !digit)) {
      setError("Enter all six digits of your code.");
      setInvalid("otp");
      otpRefs.current[digits.findIndex((digit) => !digit)]?.focus();
      return;
    }
    setStatus("loading");
    // Deliberately local: never fetch, persist, or log these form values.
    later(() => {
      if (student) {
        setPassword("");
        setStatus("success");
      } else if (step === "identifier") {
        resendDeadlineRef.current = Date.now() + 30_000;
        setSecondsLeft(30);
        setStep("otp");
        setStatus("ready");
      } else if (digits.join("") === "123456") {
        setSettledHeight(cardRef.current?.getBoundingClientRect().height);
        setDigits(Array(6).fill(""));
        setConfirmingOtp(true);
      } else {
        setStatus("error");
        setInvalid("otp");
        setError("That code isn’t quite right. Use 123456 in this preview.");
        setDigits(Array(6).fill(""));
        pendingOtpFocusRef.current = true;
      }
    });
  };

  const changeDigit = (index: number, value: string) => {
    clearError();
    const numbers = value.replace(/\D/g, "");
    if (numbers.length > 1) {
      const next = [...digits];
      for (
        let offset = 0;
        offset < Math.min(numbers.length, 6 - index);
        offset++
      )
        next[index + offset] = numbers[offset];
      setDigits(next);
      otpRefs.current[Math.min(index + numbers.length, 5)]?.focus();
    } else {
      setDigits((previous) =>
        previous.map((digit, i) => (i === index ? numbers : digit)),
      );
      if (numbers && index < 5) otpRefs.current[index + 1]?.focus();
    }
  };

  const pasteCode = (
    event: ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!value) return;
    event.preventDefault();
    changeDigit(value.length >= 6 ? 0 : index, value.slice(0, 6));
  };

  const keyDigit = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace" && !digits[index] && index > 0)
      otpRefs.current[index - 1]?.focus();
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      otpRefs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowRight" && index < 5) {
      event.preventDefault();
      otpRefs.current[index + 1]?.focus();
    }
  };

  const resend = () => {
    if (secondsLeft > 0 || loading) return;
    clearError();
    setStatus("loading");
    later(() => {
      resendDeadlineRef.current = Date.now() + 30_000;
      setSecondsLeft(30);
      setDigits(Array(6).fill(""));
      setResent(true);
      setStatus("ready");
      pendingOtpFocusRef.current = true;
    });
  };

  const reset = () => {
    timersRef.current.forEach(window.clearTimeout);
    timersRef.current = [];
    setConfirmingOtp(false);
    setSettledHeight(undefined);
    setStatus("ready");
    setError("");
    setInvalid(null);
    setPassword("");
    setDigits(Array(6).fill(""));
    setStep("identifier");
    setResent(false);
    timersRef.current.push(
      window.setTimeout(() => identifierRef.current?.focus(), 0),
    );
  };

  return (
    <div
      ref={cardRef}
      className="login-card"
      id="login-form"
      tabIndex={-1}
      style={{ minHeight: settledHeight }}
    >
      <div className="card-topline">
        <span className="portal-tag">
          <GraduationCap size={15} /> {ROLE_NAMES[role]} portal
        </span>
        <span className="little-spark" aria-hidden="true">
          <Sparkles size={22} strokeWidth={1.6} />
        </span>
      </div>
      {confirmingOtp ? (
        <OtpConfirmation reducedMotion={reducedMotion} onComplete={finishOtp} />
      ) : status === "success" ? (
        <div className="success-view">
          <span className="success-symbol">
            <Check size={34} strokeWidth={2.5} />
          </span>
          <p className="card-overline">YOU’RE ALL SET</p>
          <h2 ref={successRef} tabIndex={-1}>
            Hello, possibility.
          </h2>
          <p>
            The next chapter looks good on you.
            <br />
            Your sign-in preview is complete.
          </p>
          <div className="success-detail">
            <BookMark />
            <span>
              Your dashboard will connect here
              <br />
              when this design goes live.
            </span>
          </div>
          <button type="button" className="primary-button" onClick={reset}>
            Try it again <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <>
          <div className="card-heading">
            <h2>
              {step === "otp" ? "Check your inbox." : "Welcome back."}
              <span className="heading-dot" />
            </h2>
            <p>
              {step === "otp"
                ? "One small step, and you’re in."
                : "A whole world of possibilities awaits."}
            </p>
          </div>
          {step === "otp" && (
            <div className="otp-message">
              <Mail size={19} />
              <p>
                This preview simulates an email code.
                <br />
                <strong>Use 123456 to continue.</strong>
              </p>
            </div>
          )}
          <form
            onSubmit={submit}
            noValidate
            aria-busy={loading}
            autoComplete="off"
          >
            {step === "identifier" ? (
              <>
                <div className="form-field">
                  <label htmlFor="login-identifier">
                    {student
                      ? "Student ID or email"
                      : `${ROLE_NAMES[role]} ID or email`}
                  </label>
                  <div
                    className={`input-wrap${invalid === "identifier" ? " input-invalid" : ""}`}
                  >
                    <Mail size={19} strokeWidth={1.7} aria-hidden="true" />
                    <input
                      ref={identifierRef}
                      id="login-identifier"
                      type="text"
                      autoComplete="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      placeholder={
                        student
                          ? "e.g. STU-2026-001"
                          : role === "faculty"
                            ? "e.g. FAC-2026-001"
                            : "e.g. ADM-2026-001"
                      }
                      value={identifier}
                      onChange={(event) => {
                        setIdentifier(event.target.value);
                        clearError();
                      }}
                      disabled={loading}
                      aria-invalid={invalid === "identifier"}
                      aria-describedby={
                        invalid === "identifier" ? "login-error" : undefined
                      }
                    />
                  </div>
                </div>
                {student && (
                  <div className="form-field">
                    <label htmlFor="login-password">Password</label>
                    <div
                      className={`input-wrap${invalid === "password" ? " input-invalid" : ""}`}
                    >
                      <LockKeyhole
                        size={19}
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />
                      <input
                        ref={passwordRef}
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          clearError();
                        }}
                        disabled={loading}
                        aria-invalid={invalid === "password"}
                        aria-describedby={
                          invalid === "password" ? "login-error" : undefined
                        }
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        aria-pressed={showPassword}
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                )}
                <div className="form-assistance">
                  <span>
                    <ShieldCheck size={14} /> Your campus connection
                  </span>
                  <button
                    type="button"
                    onClick={() => setHelpOpen((value) => !value)}
                    aria-expanded={helpOpen}
                    aria-controls="login-help"
                  >
                    Need a hand?
                  </button>
                </div>
                {helpOpen && (
                  <div className="help-message" id="login-help">
                    For this preview, enter any demo ID
                    {student ? " and password" : ""}. Real account access is
                    handled by your college administration.
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="otp-label-row">
                  <label id="otp-label">Your 6-digit code</label>
                  <span>DEMO</span>
                </div>
                <div
                  className={`otp-inputs${invalid === "otp" ? " otp-invalid" : ""}`}
                  role="group"
                  aria-labelledby="otp-label"
                  aria-describedby={
                    invalid === "otp" ? "login-error" : undefined
                  }
                >
                  {digits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        otpRefs.current[index] = element;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      pattern="[0-9]*"
                      maxLength={6}
                      value={digit}
                      aria-label={`Digit ${index + 1} of 6`}
                      aria-invalid={invalid === "otp"}
                      disabled={loading}
                      onChange={(event) =>
                        changeDigit(index, event.target.value)
                      }
                      onPaste={(event) => pasteCode(event, index)}
                      onKeyDown={(event) => keyDigit(event, index)}
                      onFocus={(event) => event.target.select()}
                    />
                  ))}
                </div>
                <div className="resend-row">
                  {secondsLeft > 0 ? (
                    <span>
                      Resend code in{" "}
                      <strong>00:{String(secondsLeft).padStart(2, "0")}</strong>
                    </span>
                  ) : (
                    <button type="button" onClick={resend} disabled={loading}>
                      Resend code
                    </button>
                  )}
                </div>
                {resent && (
                  <p className="resend-confirmation" role="status">
                    A fresh demo code is ready: 123456.
                  </p>
                )}
              </>
            )}
            {error && (
              <p className="form-error" id="login-error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircle size={19} className="button-spinner" />{" "}
                  {step === "otp"
                    ? "Verifying…"
                    : student
                      ? "Signing in…"
                      : "Getting your code…"}
                </>
              ) : (
                <>
                  {step === "otp"
                    ? "Verify & sign in"
                    : student
                      ? "Let’s get started"
                      : "Send my code"}
                  <ArrowRight size={19} />
                </>
              )}
            </button>
            {step === "otp" && (
              <button
                type="button"
                className="back-to-identifier"
                onClick={() => {
                  clearError();
                  setStep("identifier");
                  setDigits(Array(6).fill(""));
                  setResent(false);
                  timersRef.current.push(
                    window.setTimeout(() => identifierRef.current?.focus(), 0),
                  );
                }}
                disabled={loading}
              >
                <ArrowLeft size={15} /> Use a different ID or email
              </button>
            )}
          </form>
          <div className="card-divider">
            <span />
            <i aria-hidden="true">✳</i>
            <span />
          </div>
          <p className="card-closer">
            Big things begin with showing up.
            <br />
            <strong>You’re in the right place.</strong>
          </p>
        </>
      )}
      <div className="preview-disclosure">
        <span /> Design preview · No real sign-in
      </div>
    </div>
  );
}

function BookMark() {
  return (
    <svg
      width="23"
      height="26"
      viewBox="0 0 23 26"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 3h15v21l-7.5-5L4 24V3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8 8h7M8 12h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
