import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: `${slot4BrandConfig.siteName} — Reference library`,
      description: `A curated shelf of downloadable references, guides and reports across ${slot4BrandConfig.siteName}.`,
      openGraphTitle: `${slot4BrandConfig.siteName} — Reference library`,
      openGraphDescription: 'Working references shelf, guides and reference material. Freely downloadable.',
      keywords: ['reference library', 'downloadable resources', 'guides', 'reports', 'references'],
    },
    hero: {
      badge: 'The reference library',
      title: ['A quieter home for', 'downloadable references.'],
      description: `A curated shelf of guides, reports and working references across ${slot4BrandConfig.siteName}. Browse, open, and keep.`,
      primaryCta: { label: 'Browse the library', href: '/pdf' },
      secondaryCta: { label: 'How it works', href: '/about' },
      searchPlaceholder: 'Search references, guides, reports…',
      focusLabel: 'On the shelf',
      featureCardBadge: 'Featured reference',
      featureCardTitle: 'A working reference, ready to take with you.',
      featureCardDescription: 'The featured tile rotates through the latest reference added to the library.',
    },
    intro: {
      badge: 'About the library',
      title: 'Curated for people who actually use the shelf.',
      paragraphs: [
        'Every entry here is a working reference — guides, briefings, reports, and reference material we thought was worth keeping in one place.',
        'The library is organised by collection so you can jump straight to what you need, not scroll through a timeline of everything ever posted.',
        'Take what fits, leave the rest. Come back when you need more.',
      ],
      sideBadge: 'How the shelf is kept',
      sidePoints: [
        'Collections group references by how you\'d actually reach for them.',
        'Downloads are open — no account required to browse or keep a reference.',
        'Submissions are reviewed before they land on the shelf.',
        'The interface stays quiet on purpose.',
      ],
      primaryLink: { label: 'Browse the library', href: '/pdf' },
      secondaryLink: { label: 'Read our approach', href: '/about' },
    },
    cta: {
      badge: 'Start browsing',
      title: 'Take what you need. Leave the rest on the shelf.',
      description: 'Everything on the library is open. Browse, download, and come back when you need more.',
      primaryCta: { label: 'Browse the library', href: '/pdf' },
      secondaryCta: { label: 'Talk to us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Recent additions to the shelf.',
    },
  },
  about: {
    badge: 'About the shelf',
    title: 'A calmer, more considered reference library.',
    description: `${slot4BrandConfig.siteName} is built as a working reference library — a curated shelf of downloadable guides, reports and reference material.`,
    paragraphs: [
      'The idea is small on purpose: keep only what people actually reach for, organise it by how it gets used, and let the interface stay out of the way.',
      'Everything on the shelf is open. Browse, download, and come back when you need more.',
    ],
    values: [
      {
        title: 'Working references shelf',
        description: 'Every entry earns its place by being useful — practical guides, briefings, reports, reference material.',
      },
      {
        title: 'Organised by use',
        description: 'Collections group references by how you\'d reach for them, not by when they landed.',
      },
      {
        title: 'Open by default',
        description: 'Browsing and downloading is free. No account required to keep a reference.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Talk to the people who keep the shelf.',
    description: 'Suggest a resource, flag a broken link, or ask about contributing. We answer everything.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: 'Search the library',
      description: 'Search across every reference on the shelf.',
    },
    hero: {
      badge: 'Search the library',
      title: 'Find the reference you need.',
      description: 'Search by keyword, topic, collection, or tag — every reference on the shelf is indexed.',
      placeholder: 'Search references by keyword, topic, or collection',
    },
    resultsTitle: 'Latest on the shelf',
  },
  create: {
    metadata: {
      title: 'Submit a reference',
      description: 'Submit a new reference for the library.',
    },
    locked: {
      badge: 'Contributor access',
      title: 'Sign in to submit a reference.',
      description: 'Use your account to open the submission workspace and add a new reference to the shelf.',
    },
    hero: {
      badge: 'Submission workspace',
      title: 'Submit a new reference to the shelf.',
      description: 'Choose the type, add details, and prepare a clean submission with file, summary, and metadata.',
    },
    formTitle: 'Submission details',
    submitLabel: 'Submit reference',
    successTitle: 'Reference submitted for review.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to your account.',
      badge: 'Contributor access',
      title: 'Welcome back.',
      description: 'Sign in to continue browsing and submitting references.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create one first.',
      success: 'Signed in. Redirecting…',
      createCta: 'Get started',
    },
    signup: {
      metadataDescription: 'Create an account.',
      badge: 'Get started',
      title: 'Create your account.',
      description: 'A contributor account unlocks the submission workspace.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Redirecting…',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related notes',
      fallbackTitle: 'Field note',
    },
    listing: {
      relatedTitle: 'Related entries',
      fallbackTitle: 'Directory entry',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Visual',
    },
    profile: {
      relatedTitle: 'Their references',
      fallbackDescription: 'Details will appear here once available.',
      visitButton: 'Visit website',
    },
  },
} as const
