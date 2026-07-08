import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'A curated reference library',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'The reference library',
    // Navbar renders About / Contact only — no task-page links.
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Browse the library', href: '/pdf' },
      secondary: { label: 'Contribute', href: '/create' },
    },
  },
  footer: {
    tagline: 'A curated shelf of downloadable references',
    description: `${slot4BrandConfig.siteName} is a curated reference library — downloadable guides, reports, and working references. Open to browse, quiet by design.`,
    columns: [
      {
        title: 'Discovery',
        links: [
          { label: 'Reference Library', href: '/pdf' },
          { label: 'Search', href: '/search' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Curated references. Quiet interface.',
  },
  commonLabels: {
    readMore: 'Open reference',
    viewAll: 'View all',
    explore: 'Browse',
    latest: 'Latest',
    related: 'Related',
    published: 'Version',
  },
} as const
