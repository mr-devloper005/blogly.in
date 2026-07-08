import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Task themes — one shared visual language for every task derived from the
  thomas-henry.webflow.io reference: warm off-white pearl surfaces, near-black
  ink, quirky-bold display headings, pill CTAs. Only the kicker/note copy
  varies per task so the site keeps a small voice while staying cohesive.
*/

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY_FONT = "'Boldonse', 'Manrope', system-ui, -apple-system, sans-serif"
const BODY_FONT = "'Manrope', 'Inter', system-ui, -apple-system, sans-serif"

const base = {
  dark: false,
  fontDisplay: DISPLAY_FONT,
  fontBody: BODY_FONT,
  bg: '#f1f1f1',
  surface: '#ffffff',
  raised: '#ededed',
  text: '#0c0407',
  muted: '#666666',
  line: '#ededed',
  accent: '#0c0407',
  accentSoft: '#f6f6f6',
  onAccent: '#f1f1f1',
  glow: 'rgba(255, 184, 0, 0.10)',
  radius: '16px',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Field notes', note: 'Long-form reads from across the reference library.' },
  listing: { ...base, kicker: 'Directory', note: 'Organised entries — kept for structure, not surfaced.' },
  classified: { ...base, kicker: 'Notices', note: 'Time-sensitive posts — kept for structure, not surfaced.' },
  image: { ...base, kicker: 'Visuals', note: 'Image-led entries — kept for structure, not surfaced.' },
  sbm: { ...base, kicker: 'Saved', note: 'Curated links — kept for structure, not surfaced.' },
  pdf: { ...base, kicker: 'Reference Library', note: 'Downloadable references, guides, and reports — the heart of the site.' },
  profile: { ...base, kicker: 'Contributor', note: 'The person behind a reference — reachable only by direct link.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.pdf
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
