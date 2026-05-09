import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'fluidity-ts',
      description: 'The complete, SSR-safe responsive toolkit for TypeScript',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/Fluidiety/fluidity-ts',
        },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', slug: 'getting-started/introduction' },
            { label: 'Installation', slug: 'getting-started/installation' },
            { label: 'Quick Start', slug: 'getting-started/quick-start' },
          ],
        },
        {
          label: 'Core',
          items: [
            { label: 'Breakpoints', slug: 'core/breakpoints' },
            { label: 'Media Queries', slug: 'core/media-queries' },
            { label: 'Fluid Typography', slug: 'core/fluid-typography' },
            { label: 'Container Queries', slug: 'core/container-queries' },
            { label: 'Preferences', slug: 'core/preferences' },
          ],
        },
        {
          label: 'Framework Guides',
          items: [
            { label: 'React', slug: 'frameworks/react' },
            { label: 'Vue', slug: 'frameworks/vue' },
            { label: 'Svelte', slug: 'frameworks/svelte' },
            { label: 'Vanilla TypeScript', slug: 'frameworks/vanilla' },
          ],
        },
        {
          label: 'SSR',
          items: [
            { label: 'Overview', slug: 'ssr/overview' },
            { label: 'Next.js', slug: 'ssr/nextjs' },
            { label: 'Client Hints', slug: 'ssr/client-hints' },
          ],
        },
        {
          label: 'Integrations',
          items: [
            { label: 'Tailwind CSS', slug: 'integrations/tailwind' },
            { label: 'Testing', slug: 'integrations/testing' },
          ],
        },
        {
          label: 'Comparisons',
          items: [
            { label: 'vs react-responsive', slug: 'comparisons/react-responsive' },
            { label: 'vs react-use', slug: 'comparisons/react-use' },
            { label: 'vs usehooks-ts', slug: 'comparisons/usehooks-ts' },
          ],
        },
      ],
    }),
  ],
});
