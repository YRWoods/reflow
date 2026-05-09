"use client";

import { useEffect } from "react";
import { useBreakpoint, useColorScheme, useViewport } from "fluidity-ts/react";
import { fluidClamp } from "fluidity-ts/styles";
import type { AppBreakpoints } from "../breakpoints";

const displayClamp = fluidClamp({ minPx: 40, maxPx: 76, minVwPx: 360, maxVwPx: 1440 });
const bodyClamp = fluidClamp({ minPx: 16, maxPx: 19, minVwPx: 360, maxVwPx: 1440 });
const shellPadding = fluidClamp({ minPx: 20, maxPx: 56, minVwPx: 360, maxVwPx: 1440 });

const flowSteps = [
  {
    title: "1. Middleware advertises Client Hints",
    description:
      "src/middleware.ts sends Accept-CH, Critical-CH, and Vary via clientHintsResponseHeaders.",
  },
  {
    title: "2. Layout resolves a server breakpoint",
    description:
      "src/app/layout.tsx reads next/headers() and calls resolveServerBreakpoint(...) before render.",
  },
  {
    title: "3. ResponsiveProvider seeds hydration",
    description:
      "ResponsiveProvider receives serverWidth so the first client snapshot matches the server render.",
  },
] as const;

const demoCards = [
  {
    title: "Revenue overview",
    blurb: "Dense dashboard content can start at one column and progressively expand.",
    tag: "Analytics",
  },
  {
    title: "Editorial feature",
    blurb: "Fluid type keeps long-form content readable across phones, tablets, and desktops.",
    tag: "Content",
  },
  {
    title: "Product comparison",
    blurb: "Breakpoint helpers make it easy to reveal richer layouts as space becomes available.",
    tag: "Commerce",
  },
  {
    title: "Ops workspace",
    blurb: "SSR-safe layout decisions eliminate hydration flicker when the app first loads.",
    tag: "Internal tools",
  },
  {
    title: "Marketing hero",
    blurb: "Use a shared breakpoint system across CSS, hooks, and server rendering.",
    tag: "Brand",
  },
  {
    title: "Team directory",
    blurb: "Keep cards compact on small screens, then fan them out with above() and below().",
    tag: "Collaboration",
  },
] as const;

export default function DemoClient() {
  const breakpoint = useBreakpoint<AppBreakpoints>();
  const viewport = useViewport();
  const { colorScheme, isDark, setColorScheme } = useColorScheme({
    storageKey: "fluidity-next-theme",
  });

  useEffect(() => {
    document.documentElement.dataset.theme = colorScheme;
  }, [colorScheme]);

  const columns = breakpoint.above("desktop")
    ? 4
    : breakpoint.above("laptop")
      ? 3
      : breakpoint.above("tablet")
        ? 2
        : 1;

  const helperChecks = [
    { label: 'is("mobile")', value: breakpoint.is("mobile") },
    { label: 'above("tablet")', value: breakpoint.above("tablet") },
    { label: 'above("laptop")', value: breakpoint.above("laptop") },
    { label: 'below("desktop")', value: breakpoint.below("desktop") },
  ];

  return (
    <main className="page-shell" style={{ padding: shellPadding, fontSize: bodyClamp }}>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">fluidity-ts × Next.js App Router</span>
          <h1 style={{ fontSize: displayClamp }}>SSR-safe responsive UI with real server context</h1>
          <p className="lede">
            This demo resolves a breakpoint on the server, passes it into <code>ResponsiveProvider</code>,
            and keeps the first paint aligned with the hydrated client store.
          </p>
          <div className="hero-actions">
            <button
              className="theme-toggle"
              type="button"
              onClick={() => setColorScheme(isDark ? "light" : "dark")}
            >
              Toggle {isDark ? "light" : "dark"} mode
            </button>
            <span className="scheme-chip">Color scheme: {colorScheme}</span>
          </div>
        </div>

        <aside className="panel panel--highlight">
          <div className="panel-header">
            <div>
              <p className="panel-label">Live state</p>
              <h2>Current responsive snapshot</h2>
            </div>
            <span className="badge">{breakpoint.active}</span>
          </div>

          <dl className="stats-grid">
            <div className="stat-card">
              <dt>Breakpoint</dt>
              <dd>{breakpoint.active}</dd>
            </div>
            <div className="stat-card">
              <dt>Viewport</dt>
              <dd>
                {viewport.width} × {viewport.height}
              </dd>
            </div>
            <div className="stat-card">
              <dt>Orientation</dt>
              <dd>{viewport.orientation}</dd>
            </div>
            <div className="stat-card">
              <dt>Theme</dt>
              <dd>{colorScheme}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="section-label">useBreakpoint()</p>
            <h2>Typed helpers for layout rules</h2>
          </div>
        </div>
        <div className="mini-grid">
          {helperChecks.map((check) => (
            <article key={check.label} className="mini-card">
              <span className="mini-label">{check.label}</span>
              <strong>{check.value ? "true" : "false"}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="section-label">SSR flow</p>
            <h2>How Client Hints feed the initial breakpoint</h2>
          </div>
        </div>
        <div className="flow-grid">
          {flowSteps.map((step) => (
            <article key={step.title} className="panel flow-card">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="section-label">Responsive grid</p>
            <h2>Cards driven by breakpoint.above()</h2>
          </div>
          <span className="scheme-chip">{columns} columns</span>
        </div>
        <div className="card-grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {demoCards.map((card) => (
            <article key={card.title} className="panel card">
              <span className="card-tag">{card.tag}</span>
              <h3>{card.title}</h3>
              <p>{card.blurb}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="section-label">fluidClamp()</p>
            <h2>Fluid typography without design-token guesswork</h2>
          </div>
        </div>
        <pre className="code-block">
{`fluidClamp({ minPx: 40, maxPx: 76, minVwPx: 360, maxVwPx: 1440 })\n// → ${displayClamp}`}
        </pre>
      </section>
    </main>
  );
}
