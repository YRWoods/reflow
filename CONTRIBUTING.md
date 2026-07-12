# Contributing to reflow

Thanks for your interest in contributing! 🎉

We welcome bug fixes, new features, documentation improvements, and ecosystem integrations. This guide covers the expected workflow for contributing to `reflow`.

## Quick Start

```bash
# Clone the repo
git clone https://github.com/valtors/reflow.git
cd reflow

# Install dependencies
npm install

# Run the full verification suite
npm run verify
```

## Development

### Scripts

| Command | Description |
|---|---|
| `npm run build` | Build all entry points (ESM + CJS + DTS) |
| `npm test` | Run tests with Vitest |
| `npm run typecheck` | TypeScript type checking |
| `npm run lint` | Lint with Biome |
| `npm run verify` | Full CI check (typecheck + lint + test + build) |
| `npm run lint:fix` | Auto-fix Biome lint issues where possible |
| `npm run test:watch` | Run Vitest in watch mode |

### Project Structure

```
src/
├── core/        # Framework-agnostic core (breakpoints, media, viewport, etc.)
├── react/       # React hooks & components
├── vue/         # Vue 3 composables
├── svelte/      # Svelte stores
├── styles/      # Fluid typography & CSS clamp utilities
├── server/      # SSR helpers (Next.js, Express)
├── testing/     # Test utilities & viewport mocking
└── tailwind/    # Tailwind CSS preset generation
```

Tests live in `test/`.

### Architecture

All framework adapters (`react/`, `vue/`, `svelte/`) wrap the same `core/` modules. When adding a feature:

1. Implement the core logic in `src/core/`
2. Add framework bindings in each adapter
3. Write tests in `test/`

### Code Style

- We use [Biome](https://biomejs.dev/) for linting and formatting
- Run `npx biome check --write src test` to auto-fix
- No ESLint or Prettier — Biome handles both
- Keep framework-specific code out of `src/core/`
- Maintain SSR-safe behavior for public APIs

### Testing

- Framework: [Vitest](https://vitest.dev/) with `happy-dom`
- Tests live in `test/`
- Run `npm test` or `npx vitest --watch`
- Add or update tests for any functional change

## Submitting Changes

1. Fork the repo and create a feature branch
2. Make your changes
3. Run `npm run verify` to ensure everything passes
4. If your change affects users, add a changeset with `npx changeset`
5. Open a PR with a clear description

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation
- `test:` — Tests
- `chore:` — Maintenance

### PR Guidelines

- Keep PRs focused — one feature or fix per PR
- Include tests for new features
- Update JSDoc for public API changes
- Ensure `npm run verify` passes
- Link related issues or discussions when relevant

## Reporting Issues

- Use [GitHub Issues](https://github.com/valtors/reflow/issues)
- Include reproduction steps and environment details
- Check existing issues before opening a new one

## Community

- [GitHub Discussions](https://github.com/valtors/reflow/discussions) — Questions, ideas, show & tell
- [Roadmap](https://github.com/valtors/reflow/discussions/6) — See what's planned
- [Code of Conduct](./CODE_OF_CONDUCT.md) — Expected community standards

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).

## For AI Agents

If you're an AI agent contributing to reflow, here's what you need to know:

1. Run `npm run verify` before committing. This runs typecheck, lint, test, and build. It must pass.
2. Use the existing hooks as templates. Copy the pattern from `src/react/useBreakpoint.ts` or `src/solid/useBreakpoint.ts`.
3. Every hook must be SSR-safe. No `window` or `document` access without a guard.
4. Export new hooks from the framework's `index.ts`.
5. Add tests in `test/` following the existing naming pattern.
6. No comments in code unless logic is non-obvious.
7. Keep zero runtime dependencies in core. Framework adapters may use framework-specific APIs.
8. Commit messages: lowercase, short, no conventional commits prefix needed.

### File Structure

```
src/
  core/           # Framework-agnostic (breakpoints, media, viewport, store)
  react/          # React hooks + components
  vue/            # Vue composables + plugin
  svelte/         # Svelte stores
  solid/          # Solid hooks
  qwik/           # Qwik adapters
  preact/         # Preact (reuses react/)
  angular/        # Angular wrappers
  lit/            # Lit adapters
  styles/         # CSS utilities (fluidClamp, viewport units)
  testing/        # Test utilities
  server/         # SSR helpers
  tailwind/       # Tailwind preset
```

### Adding a Hook

1. Create `src/<framework>/useNewHook.ts`
2. Follow the pattern from an existing hook in the same framework
3. Export from `src/<framework>/index.ts`
4. Add a test in `test/`
5. Run `npm run verify`
6. Open a PR
