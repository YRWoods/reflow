# fluidity-ts — Logo Design Brief

> ✅ **Status:** A primary mark has been chosen and lives at `assets/brand/logo.png` (a black, rounded-square avatar with two fluid drops inside a circle — reads as "fluid + contained"). The rest of this brief is kept for future variants (dark mode, monochrome, social card, banner, favicon set).

---

## 1. What we are building (in 60 seconds)

**fluidity-ts** is an open-source TypeScript library that helps developers build websites and apps that look and feel right on every screen — from a 320 px folding phone to a 4K monitor — without the usual hydration bugs, copy-pasted CSS hacks, or 22 KB Frankenstein dependency stacks.

**One-line pitch:**
> *The complete, SSR-safe, framework-agnostic responsive toolkit for TypeScript.*

**What it gives developers:**

- Typed breakpoints (`xs / sm / md / lg / xl / 2xl`) that flow through every API.
- A runtime `fluidClamp()` so font/spacing scales smoothly between viewports.
- React hooks that don't flash or warn during server-side rendering.
- Container queries, `prefers-reduced-data`, `prefers-contrast`, `forced-colors`, dvh/svh, safe-area — modern CSS, all typed.
- A server-side breakpoint resolver (Client Hints + UA fallback) for Next.js / Hono / Express.

**Audience:** TypeScript & React developers, design-system maintainers, Next.js / App Router users, accessibility-minded teams.

**Vibe:** Modern, technical, friendly. We're the calm replacement for a stack of half-broken libraries — confident but not corporate.

---

## 2. Brand keywords

Pick 3–4 of these to anchor the visual:

- **Fluid** (smooth, continuous, water/wave)
- **Responsive** (adapting, reshaping, elastic)
- **Typed** (precise, structured, exact, grid, geometry)
- **SSR-safe** (steady, no flicker, solid first paint)
- **Framework-agnostic** (open, neutral, modular)
- **Accessible** (calm, inclusive, never harsh)

If you had to pick two: **fluid + typed**. The logo should sit at the intersection of "water-like motion" and "engineered precision."

---

## 3. Naming

- **Library name:** `fluidity-ts`
- **Wordmark spelling:** all lowercase: `fluidity-ts`
- **Spoken as:** "fluidity TS" or "fluidity"
- **Optional short form for square avatars:** `fl` or `f~` (the wave symbol is intentional)

---

## 4. Concept directions (designer chooses one or remixes)

### Concept A — "Wave through a grid" (recommended)
A single fluid wave (sine curve) passing through three or four vertical bars of different heights — the bars represent breakpoints, the wave shows the value flowing/clamping between them. Optionally the wave is drawn with a continuous gradient and the bars are flat solid color.

**Why it works:** literally illustrates `fluidClamp()` and breakpoints in one mark. Reads as both "responsive design" and "TypeScript" (grid = structure).

### Concept B — "Liquid bracket"
A pair of TypeScript-style angle brackets `< >` where the inner edges are not straight lines but a smooth wave. Almost a sigil; very minimal.

### Concept C — "Tilde monogram"
A bold lowercase **f** whose crossbar is replaced by a tilde `~` (the math symbol for "approximately equal" — the spirit of fluidClamp). Inside a soft rounded square. Works beautifully as an npm/GitHub avatar.

### Concept D — "Three drops, three sizes"
Three water droplets in increasing size, left to right, each landing on a different baseline. Reads as "small, medium, large = responsive." Friendlier; great for a marketing site hero, weaker as a tiny favicon.

> If picking one: **Concept A for the full wordmark**, **Concept C for the avatar/favicon**. They can share the same color palette and feel like one family.

---

## 5. Color palette

Aim for a calm, modern, slightly aquatic feel — not corporate blue, not neon.

| Role | Hex | Notes |
|---|---|---|
| Primary (deep teal) | `#0EA5A5` | The wave. Confident, technical. |
| Primary dark | `#0B6E70` | For dark-mode and high-contrast variants. |
| Accent (soft cyan) | `#67E8F0` | Gradient highlight on the wave crest. |
| Ink (near-black) | `#0F172A` | Wordmark on light backgrounds. |
| Paper | `#F8FAFC` | Background for light theme. |
| TS-blue nod (optional) | `#3178C6` | Use sparingly — only if we want to signal "TypeScript" explicitly. |

A linear gradient from `#0EA5A5 → #67E8F0` along the wave is the signature look.

Must also work as **single-color black** and **single-color white** (for monochrome README badges, stickers, sponsor pages).

---

## 6. Typography (for the wordmark)

- **Primary choice:** *Inter* — weight 600, slight negative letter-spacing (-0.02 em), all lowercase.
- **Alternates that fit the vibe:** Geist Sans, IBM Plex Sans, Söhne, Satoshi.
- The `-ts` should be visually de-emphasized — either lighter weight (400) or in the secondary color. Some users will read "fluidity" as the brand and `-ts` as the technology tag.

Example layout: **fluidity**`-ts` (heavy + light, same baseline).

---

## 7. Deliverables we need

A designer / AI tool should ship the following. File names matter — they're referenced in the README and `package.json`.

| File | Format | Size | Purpose | Status |
|---|---|---|---|---|
| `logo.png` | PNG | 1252×1252 | Master mark / light theme | ✅ done |
| `logo-dark.png` | PNG | 1252×1252 | Dark theme (white-on-black) | ✅ done |
| `logo-black-transparent.png` | PNG | 1252×1252 | Black mark, transparent bg (light backgrounds) | ✅ done |
| `logo-white-transparent.png` | PNG | 1252×1252 | White mark, transparent bg (dark backgrounds) | ✅ done |
| `logo.svg` | SVG | scalable | Vector master | ⏳ |
| `logo-512.png` | PNG | 512×512 | npm + social preview | ⏳ |
| `logo-256.png` | PNG | 256×256 | GitHub org avatar | ⏳ |
| `favicon.svg` + `favicon-32.png` + `favicon-16.png` | SVG + PNG | — | Docs site | ⏳ |
| `social-card.png` | PNG | 1200×630 | Open Graph / Twitter card | ⏳ |
| `banner.svg` | SVG | 2000×500 | README hero | ⏳ |

All saved into `assets/brand/` at the repo root. (Folder doesn't exist yet — designer/script should create it.)

---

## 8. Dos and don'ts

**Do**
- Keep the symbol legible at 16×16 (favicon test).
- Use rounded geometry over sharp corners.
- Allow whitespace around the mark — minimum clear space = the height of the lowercase "f."
- Provide both a horizontal and a stacked layout.

**Don't**
- Don't use literal water-droplet emoji clichés.
- Don't use a brain, gears, lightbulb, or chat bubble.
- Don't pile multiple metaphors into one mark (a wave **and** brackets **and** a grid is too much — pick one).
- Avoid pure TypeScript-blue `#3178C6` as the dominant color; it makes us look like a TS fork rather than our own brand.
- No serifs, no script fonts, no skeuomorphic gradients/shadows.

---

## 9. Prompts you can paste into an AI image tool

> Keep prompts simple — the more we describe, the more likely the model adds noise. Run each prompt 4–8 times and pick.

**Midjourney / Ideogram (Concept A — wave through a grid):**
> minimal logo for a typescript library called fluidity-ts, a smooth horizontal sine wave passing through four vertical bars of increasing height, deep teal to soft cyan gradient, flat vector, white background, geometric, calm, modern, no text, centered, clean negative space — `--style raw --v 6 --ar 1:1`

**Midjourney / Ideogram (Concept C — tilde monogram):**
> minimal vector logo, a bold lowercase letter f with its crossbar replaced by a tilde, deep teal color #0EA5A5, inside a soft rounded square with subtle gradient, flat design, geometric, modern, no text outside the mark, centered, white background — `--style raw --v 6 --ar 1:1`

**Recraft / DALL·E wordmark:**
> wordmark logo "fluidity-ts" all lowercase, Inter font weight 600, the word "fluidity" in deep teal #0EA5A5, the suffix "-ts" in lighter weight and lighter teal, a small minimal sine wave above or replacing the dot of the i, white background, vector, clean, no extra elements

---

## 10. Approval criteria

A version is good enough to ship when:

1. It's instantly recognizable at 16×16 (favicon test).
2. The single-color black version still reads.
3. It looks at home next to the npm logo, the React logo, and the TypeScript logo (do a side-by-side mock).
4. The wordmark renders crisply on a GitHub README in both light and dark themes.
5. Tamish ❤️ it.

---

## 11. Once we have the logo

- Drop files into `assets/brand/` in the repo.
- Update README hero: `<img src="./assets/brand/banner.svg" alt="fluidity-ts" />`.
- Update `package.json` with: `"funding": "...",` (optional) and reference the social card via OG meta tags on the docs site.
- Set the GitHub org avatar to `logo-256.png`.
- Set the npm package logo (npm reads `package.json#repository` and pulls the GitHub avatar — so updating the org avatar is enough).
