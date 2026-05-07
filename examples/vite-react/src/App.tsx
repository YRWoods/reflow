import { useRef } from "react";
import {
  ResponsiveProvider,
  Show,
  useBreakpoint,
  useContainerQuery,
  useDevicePixelRatio,
  usePointer,
  usePreference,
  useResponsiveValue,
  useViewport,
} from "fluidity-ts/react";
import { fluidClamp } from "fluidity-ts/styles";

export function App() {
  return (
    <ResponsiveProvider>
      <Demo />
    </ResponsiveProvider>
  );
}

function Demo() {
  const bp = useBreakpoint();
  const { width, height } = useViewport();
  const dpr = useDevicePixelRatio();
  const pointer = usePointer();
  const reducedMotion = usePreference("reduced-motion");

  const cols = useResponsiveValue({ xs: 1, sm: 2, md: 3, lg: 4, xl: 5, "2xl": 6 });
  const padding = useResponsiveValue({ xs: 16, md: 32, xl: 48 });

  const headingSize = fluidClamp({ minPx: 28, maxPx: 56, minVw: 360, maxVw: 1280 });
  const bodySize = fluidClamp({ minPx: 14, maxPx: 18, minVw: 360, maxVw: 1280 });

  return (
    <main style={{ padding, fontSize: bodySize }}>
      <h1 style={{ fontSize: headingSize, margin: "0 0 12px" }}>
        🌊 fluidity-ts <span className="badge">live demo</span>
      </h1>
      <p className="lede">
        Resize the window. Every value below updates live — no flash, no hydration warning.
      </p>

      <section className="grid">
        <Stat label="Active breakpoint" value={bp.active} />
        <Stat label="Viewport" value={`${width} × ${height}`} />
        <Stat label="Device pixel ratio" value={dpr.toFixed(2)} />
        <Stat label="Pointer" value={pointer.fine ? "fine" : pointer.coarse ? "coarse" : "none"} />
        <Stat label="Hover capable" value={pointer.hover ? "yes" : "no"} />
        <Stat label="Reduced motion" value={reducedMotion ? "on" : "off"} />
        <Stat label="useResponsiveValue → cols" value={String(cols)} />
        <Stat label="useResponsiveValue → padding" value={`${padding}px`} />
      </section>

      <h2>Responsive grid driven by useResponsiveValue</h2>
      <div
        className="cards"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="card">
            #{i + 1}
          </div>
        ))}
      </div>

      <h2>Container queries (resize the box ↔)</h2>
      <ContainerDemo />

      <h2>{"<Show>"} — render only at certain breakpoints</h2>
      <div className="show-row">
        <Show on={["xs", "sm"]}>
          <Pill>visible: xs · sm</Pill>
        </Show>
        <Show on={["md", "lg"]}>
          <Pill>visible: md · lg</Pill>
        </Show>
        <Show on={["xl", "2xl"]}>
          <Pill>visible: xl · 2xl</Pill>
        </Show>
      </div>

      <h2>fluidClamp() — runtime, typed, with slope guard</h2>
      <pre className="code">
        {`fluidClamp({ minPx: 28, maxPx: 56, minVw: 360, maxVw: 1280 })\n// → ${headingSize}`}
      </pre>

      <footer>
        Built with{" "}
        <a href="https://www.npmjs.com/package/fluidity-ts">fluidity-ts</a> ·{" "}
        <a href="https://github.com/Fluidiety/fluidity-ts">GitHub</a>
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="pill">{children}</span>;
}

function ContainerDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wide = useContainerQuery(ref, { minPx: 480 });
  const xWide = useContainerQuery(ref, { minPx: 720 });

  return (
    <div ref={ref} className="resizable">
      <strong>Layout:</strong>{" "}
      {xWide ? "🖥 extra-wide (≥720px)" : wide ? "💻 wide (≥480px)" : "📱 narrow (<480px)"}
      <p className="muted">
        This box is CSS-resizable. Drag its bottom-right corner — the layout label updates
        based on the <em>container</em>'s width, not the viewport's.
      </p>
    </div>
  );
}
