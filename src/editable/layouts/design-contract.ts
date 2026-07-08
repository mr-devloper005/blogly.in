import type { CSSProperties } from 'react'

/*
  Design contract mapped from thomas-henry.webflow.io.

  - Warm off-white pearl page (#f1f1f1) with near-black ink (#0c0407)
  - Boldonse display face + Manrope body
  - Pill CTAs (100px radius)
  - Bordered soft cards (12–16px radius, hairline #ededed border)
  - Section rhythm: 80 / 100 / 120 / 150px
  - Container: 1200px
*/

export const editableRootStyle = {
  '--slot4-page-bg': '#f1f1f1',
  '--slot4-page-text': '#0c0407',
  '--slot4-panel-bg': '#ffffff',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#666666',
  '--slot4-soft-muted-text': '#8a8a8a',
  '--slot4-accent': '#0c0407',
  '--slot4-accent-fill': '#0c0407',
  '--slot4-accent-soft': '#f6f6f6',
  '--slot4-on-accent': '#f1f1f1',
  '--slot4-warm-accent': '#ffb800',
  '--slot4-dark-bg': '#0c0407',
  '--slot4-dark-text': '#f1f1f1',
  '--slot4-media-bg': '#ededed',
  '--slot4-cream': '#f7f6f2',
  '--slot4-warm': '#ececea',
  '--slot4-lavender': '#f1f1f1',
  '--slot4-gray': '#ededed',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#f1f1f1',
  '--editable-page-text': '#0c0407',
  '--editable-container': '1240px',
  '--editable-container-wide': '1440px',
  '--editable-border': '#ededed',
  '--editable-border-strong': '#dcdcdc',
  '--editable-nav-bg': '#f1f1f1',
  '--editable-nav-text': '#0c0407',
  '--editable-nav-active': '#0c0407',
  '--editable-nav-active-text': '#f1f1f1',
  '--editable-cta-bg': '#0c0407',
  '--editable-cta-text': '#f1f1f1',
  '--editable-search-bg': '#ffffff',
  '--editable-footer-bg': '#0c0407',
  '--editable-footer-text': '#f1f1f1',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-page-text)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-page-bg)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-none',
  shadowStrong: 'shadow-[0_20px_60px_-24px_rgba(12,4,7,0.22)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.72))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-6 sm:px-8 lg:px-12',
    sectionWide: 'mx-auto w-full max-w-[var(--editable-container-wide)] px-6 sm:px-8 lg:px-12',
    sectionY: 'py-20 sm:py-24 lg:py-32',
    sectionYSm: 'py-14 sm:py-16 lg:py-20',
    sectionYLg: 'py-24 sm:py-32 lg:py-40',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[280px] shrink-0 snap-start sm:w-[320px]',
  },
  type: {
    eyebrow: 'text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]',
    eyebrowLight: 'text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70',
    heroTitle: 'editable-display text-5xl leading-[0.9] tracking-[-0.05em] sm:text-7xl lg:text-[7.5rem]',
    sectionTitle: 'editable-display text-4xl leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-[3.75rem]',
    subsectionTitle: 'editable-display text-3xl leading-[1] tracking-[-0.03em] sm:text-4xl',
    body: 'text-base leading-[1.65]',
    bodyLg: 'text-lg leading-[1.6] sm:text-xl',
    emphasis: 'editable-display text-2xl leading-[1.15] tracking-[-0.02em]',
  },
  surface: {
    card: `rounded-[16px] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    soft: `rounded-[16px] border ${editablePalette.border} ${editablePalette.panelBg}`,
    dark: `rounded-[20px] ${editablePalette.darkBg} ${editablePalette.darkText}`,
    flat: `rounded-[12px] ${editablePalette.surfaceBg}`,
  },
  button: {
    primary:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-page-bg)] transition-all duration-500 hover:-translate-y-[1px] hover:bg-[var(--slot4-warm-accent)] hover:text-[var(--slot4-page-text)] active:scale-[0.99]',
    secondary:
      'inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-transparent px-7 py-3.5 text-sm font-semibold text-[var(--slot4-page-text)] transition-all duration-500 hover:-translate-y-[1px] hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-page-bg)] active:scale-[0.99]',
    accent:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-warm-accent)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-page-text)] transition-all duration-500 hover:-translate-y-[1px] hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-page-bg)] active:scale-[0.99]',
    ghost:
      'inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--slot4-page-text)] transition-all duration-500 hover:gap-2.5',
    onDark:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-page-bg)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-page-text)] transition-all duration-500 hover:-translate-y-[1px] hover:bg-[var(--slot4-warm-accent)] active:scale-[0.99]',
  },
  badge: {
    pill: 'inline-flex items-center gap-1.5 rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-page-bg)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-page-text)]',
    accentPill: 'inline-flex items-center gap-1.5 rounded-full bg-[var(--slot4-warm-accent)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-page-text)]',
    darkPill: 'inline-flex items-center gap-1.5 rounded-full bg-[var(--slot4-page-text)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-page-bg)]',
    softPill: 'inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white',
  },
  media: {
    frame: `relative overflow-hidden rounded-[16px] ${editablePalette.mediaBg}`,
    frameFull: `relative overflow-hidden rounded-[20px] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
    ratioWide: 'aspect-[16/10]',
    ratioSquare: 'aspect-square',
  },
  motion: {
    lift: 'transition duration-500 hover:-translate-y-1',
    fade: 'transition duration-500 hover:opacity-90',
    zoom: 'transition-transform duration-700 group-hover:scale-[1.03]',
  },
} as const

export const aiLayoutRules = [
  'All page tokens live in editableRootStyle — change the palette there and every section picks it up.',
  'Section rhythm is 80 / 100 / 120 / 150px vertical padding. Use dc.shell.sectionY variants.',
  'Buttons are pills (100px). Do not use square/rounded-lg buttons on the public surface.',
  'Cards are bordered soft (hairline #ededed on white, radius 16px). No heavy drop shadows.',
  'Wrap section headers and grid items in <EditableReveal index={i}/> for staggered scroll reveal.',
  'Public feeds never surface profile cards — the profile task is direct-URL-only.',
] as const
