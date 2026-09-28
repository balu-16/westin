import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowRight, ArrowUp, Menu, Search, X } from "lucide-react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import westinLogo from "../assets/images/westin-logo.avif";
import { useAuth } from "../contexts/AuthContext";
import { getFixturePage, publicPageCopy, publicRecords, routeCopy } from "./content";
import { findArchiveEntry } from "./officialArchive";
import { snapshotRoute } from "./usePublicContent";
import { CampusSketch } from "./CampusSketch";
import { PublicNextStep } from "./PublicNextStep";
import "./skybook.css";
import "./editorial-public.css";

const navigation = [
  ["About", "/about"],
  ["Programs", "/programs"],
  ["Campus life", "/campus"],
  ["Placements", "/placements"],
  ["Admissions", "/admissions"],
  ["Contact", "/contact"],
];
const footerGroups = [
  {
    title: "The college",
    links: [
      ["About Westin", "/about"],
      ["Mission & vision", "/about/mission-vision"],
      ["Our management", "/about/management"],
      ["Faculty", "/about/faculty"],
      ["Why Westin", "/why-westin"],
      ["Partnerships", "/partners/bineid"],
    ],
  },
  {
    title: "Your possibilities",
    links: [
      ["All courses", "/programs"],
      ["Business management", "/programs/bba"],
      ["BBA (Honours)", "/programs/bba-honours"],
      ["Hotel management", "/programs/hotel-management"],
      ["Hospitality degrees", "/programs/bhm-three-year"],
      ["Hospitality diplomas", "/programs/dhm-one-year"],
      ["Intermediate", "/programs/intermediate"],
      ["Placements", "/placements"],
      ["Career planner", "/career-planner"],
    ],
  },
  {
    title: "The everyday",
    links: [
      ["Campus life", "/campus"],
      ["News & events", "/news"],
      ["Gallery", "/gallery"],
      ["Magazine", "/magazine"],
      ["Publishing House", "/publishing-house"],
      ["Stories & voices", "/testimonials"],
      ["Search the site", "/search"],
      ["Contact & visits", "/contact"],
    ],
  },
];

const OFFICIAL_RELEASE = import.meta.env.VITE_PUBLIC_RELEASE_MODE === "official";

export function PublicLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [exitingFrom, setExitingFrom] = useState<string | null>(null);
  const menu = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const main = useRef<HTMLElement>(null);
  const pendingNavigation = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousPath = useRef(location.pathname);
  const page = getFixturePage(location.pathname);
  const archiveEntry = findArchiveEntry(location.pathname);
  const olderRecord = archiveEntry ? undefined : publicRecords.find((record) => {
    const path = record.kind === 'campus-events' ? `/campus/events/${record.id}` : `/${record.kind}/${record.id}`;
    return path === location.pathname;
  });
  const detailRecord = snapshotRoute(location.pathname) ?? archiveEntry ?? olderRecord;
  const detailTitle = detailRecord && ('content' in detailRecord ? (typeof detailRecord.content.title === 'string' ? detailRecord.content.title : undefined) : detailRecord.title);
  const detailSummary = detailRecord && ('content' in detailRecord ? (typeof detailRecord.content.summary === 'string' ? detailRecord.content.summary : undefined) : detailRecord.summary);
  const home = location.pathname === "/";
  const isCollectionDetail = /^\/(?:news|blog|gallery|magazine|testimonials|success-stories)\/[^/]+|^\/campus\/events\/[^/]+/.test(location.pathname);
  const indexable = OFFICIAL_RELEASE && (home || (!!page && (!isCollectionDetail || !!detailRecord))) && location.pathname !== '/search';
  const title = home
    ? "Westin College, Vijayawada — Big dreams. Bright beginnings."
    : (detailTitle ?? page?.program?.title ??
        (page ? (routeCopy[page.key] ?? publicPageCopy[page.kind]).title : "Page not found")) +
      " · Westin College";
  const description = home
    ? "Discover business, hospitality and a campus full of possibility. Explore Westin College, Vijayawada, and start your next chapter."
    : detailSummary ?? (page
      ? (routeCopy[page.key] ?? publicPageCopy[page.kind]).summary
      : "Explore Westin College, Vijayawada.");
  const canonicalOrigin = (
    import.meta.env.VITE_PUBLIC_SITE_ORIGIN ?? "https://www.westincollegevijayawada.com"
  ).replace(/\/+$/, "");
  const destination = isAuthenticated ? "/dashboard" : "/login";
  const loginLabel = isAuthenticated ? "Dashboard" : "Student login";

  useEffect(() => {
    // Keep the portal's static metadata for private routes, without duplicate
    // descriptions while the public layout supplies route-specific metadata.
    const fallback = document.getElementById("portal-default-description");
    const defaultRobots = document.getElementById("portal-default-robots");
    fallback?.remove();
    defaultRobots?.remove();
    return () => {
      if (fallback) document.head.prepend(fallback);
      if (defaultRobots) document.head.prepend(defaultRobots);
    };
  }, []);

  useEffect(() => {
    if (pendingNavigation.current) {
      clearTimeout(pendingNavigation.current);
      pendingNavigation.current = null;
    }
    setExitingFrom(null);
    const changedPage = previousPath.current !== location.pathname;
    previousPath.current = location.pathname;
    setOpen(false);
    if (location.hash) {
      const frame = requestAnimationFrame(() => {
        document.getElementById(location.hash.slice(1))?.scrollIntoView({
          behavior: changedPage || window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
        if (changedPage) main.current?.focus({ preventScroll: true });
      });
      return () => cancelAnimationFrame(frame);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    if (changedPage) {
      const frame = requestAnimationFrame(() => main.current?.focus({ preventScroll: true }));
      return () => cancelAnimationFrame(frame);
    }
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => () => {
    if (pendingNavigation.current) clearTimeout(pendingNavigation.current);
  }, []);

  const onPublicClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (
      event.defaultPrevented || event.button !== 0 || event.metaKey ||
      event.ctrlKey || event.shiftKey || event.altKey ||
      !(event.target instanceof Element)
    ) return;
    const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
    if (!anchor || !event.currentTarget.contains(anchor) || anchor.hasAttribute("download")) return;
    if (anchor.target && anchor.target !== "_self") return;
    const target = new URL(anchor.href, window.location.href);
    if (target.origin !== window.location.origin) return;
    if (target.pathname === location.pathname && target.search === location.search) {
      if (anchor.classList.contains("sk-back-top")) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (target.hash) {
        let id: string;
        try {
          id = decodeURIComponent(target.hash.slice(1));
        } catch {
          return;
        }
        const section = document.getElementById(id);
        if (section) {
          event.preventDefault();
          if (target.hash === location.hash) {
            section.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
          } else {
            navigate(target.pathname + target.search + target.hash);
          }
        }
      } else if (!location.hash && window.scrollY > 0) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
      }
      return;
    }
    if (target.pathname !== "/" && target.pathname !== "/search" && !getFixturePage(target.pathname)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    event.preventDefault();
    if (pendingNavigation.current) clearTimeout(pendingNavigation.current);
    setExitingFrom(location.pathname + location.search);
    pendingNavigation.current = setTimeout(() => {
      pendingNavigation.current = null;
      navigate(target.pathname + target.search + target.hash);
    }, 155);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const dialog = menu.current;
    if (!dialog) return;
    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }
    const previousOverflow = document.body.style.overflow;
    const returnFocus = trigger.current;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const controls = [
        ...dialog.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),[tabindex="0"]',
        ),
      ];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    dialog.addEventListener("keydown", trapFocus);
    const desktop = window.matchMedia("(min-width: 1200px)");
    const onDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", onDesktop);
      dialog.removeEventListener("keydown", trapFocus);
      if (dialog.open) dialog.close();
      returnFocus?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <div className="skybook-site sk-editorial-site" id="page-top" onClickCapture={onPublicClickCapture}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {indexable && <link
        rel="canonical"
        href={canonicalOrigin + (home ? "/" : location.pathname.replace(/\/+$/, ""))}
      />}
      <meta name="robots" content={indexable ? "index,follow" : "noindex,nofollow"} />
      <a className="sk-skip" href="#public-content">
        Skip to content
      </a>
      <header className="sk-header" data-scrolled={scrolled}>
        <div className="sk-container sk-header-inner">
          <Link
            to="/"
            className="sk-brand"
            aria-label="Westin College home"
          >
            <img src="/images/official/brand/westin-logo-full-480.png" srcSet="/images/official/brand/westin-logo-full-480.png 480w, /images/official/brand/westin-logo-full-960.png 960w" sizes="128px" width="480" height="245" alt="" />
          </Link>
          <nav className="sk-desktop-nav" aria-label="Public website">
            {navigation.map(([label, to]) => (
              <NavLink key={to} to={to}>
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="sk-header-actions">
            <Link className="sk-header-search" to="/search" aria-label="Search the website"><Search size={18} aria-hidden="true" /></Link>
            <Link className="sk-login-link" to={destination}>
              {loginLabel}
            </Link>
            <Link className="sk-button sk-header-enquire" to="/contact">
              Enquire <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <button
            className="sk-menu-trigger"
            type="button"
            ref={trigger}
            aria-label="Open website menu"
            aria-expanded={open}
            aria-controls="public-mobile-menu"
            onClick={() => setOpen(true)}
          >
            <Menu size={24} aria-hidden="true" />
          </button>
        </div>
      </header>
      <dialog
        className="sk-menu"
        id="public-mobile-menu"
        ref={menu}
        aria-labelledby="mobile-menu-title"
        onCancel={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        <div className="sk-menu-panel">
          <div className="sk-menu-top">
            <span id="mobile-menu-title">Explore Westin</span>
            <button
              type="button"
              className="sk-menu-close"
              aria-label="Close website menu"
              onClick={() => setOpen(false)}
            >
              <X size={24} aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Mobile public website">
            {navigation.map(([label, to], index) => (
              <NavLink key={to} to={to} onClick={() => setOpen(false)}>
                <span>0{index + 1}</span>
                {label}
                <ArrowRight size={20} aria-hidden="true" />
              </NavLink>
            ))}
          </nav>
          <div className="sk-actions">
            <Link
              className="sk-button sk-button-outline"
              to={destination}
              onClick={() => setOpen(false)}
            >
              {loginLabel}
            </Link>
            <Link
              className="sk-button"
              to="/contact"
              onClick={() => setOpen(false)}
            >
              Enquire <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <p className="sk-menu-signature">Your next chapter starts here.</p>
        </div>
      </dialog>
      <main
        id="public-content"
        key={location.pathname + location.search}
        ref={main}
        tabIndex={-1}
        data-public-route="true"
        data-exiting={exitingFrom === location.pathname + location.search ? "true" : undefined}
      >
        <Outlet />
        <PublicNextStep pathname={location.pathname} program={page?.program} />
      </main>
      <footer className="sk-footer">
        <div className="sk-container">
          <div className="sk-footer-card">
          <div className="sk-footer-top">
            <p>
              Good people.
              <br />
              <span>Bright possibilities.</span>
            </p>
            <a
              className="sk-back-top"
              href="#page-top"
              onClick={(event) => {
                event.preventDefault();
                window.scrollTo({
                  top: 0,
                  behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                  ).matches
                    ? "instant"
                    : "smooth",
                });
                document
                  .getElementById("public-content")
                  ?.focus({ preventScroll: true });
              }}
            >
              Back to top <ArrowUp size={18} aria-hidden="true" />
            </a>
          </div>
          <div className="sk-footer-grid">
            <div className="sk-footer-brand">
              <Link to="/" aria-label="Westin College home">
                <img
                  src={westinLogo}
                  width="575"
                  height="294"
                  alt="Westin College"
                />
              </Link>
              <p>
                A little curiosity.
                <br />A whole world of possibility.
              </p>
              <span>Vijayawada, Andhra Pradesh</span>
              <Link to={destination} className="sk-text-link">
                {loginLabel} <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            {footerGroups.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2>{group.title}</h2>
                {group.links.map(([label, to]) => (
                  <Link key={to} to={to}>
                    {label}
                  </Link>
                ))}
              </nav>
            ))}
          </div>
          <div className="sk-footer-bottom">
            <span>
              © {new Date().getFullYear()} Westin College · Vijayawada
            </span>
            <span>Made for your next chapter.</span>
          </div>
          </div>
          <div className="sk-footer-signoff">
            <div className="sk-footer-sketch" aria-hidden="true">
              <CampusSketch id="westin-footer" />
            </div>
            <div className="sk-footer-wordmark" aria-label="Westin College, Vijayawada">
              <span className="sk-footer-location">College · Vijayawada</span>
              <span className="sk-footer-oversize" aria-hidden="true">WESTIN</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
