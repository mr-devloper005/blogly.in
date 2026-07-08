import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

/*
  Copy is written for a Reference Library platform. Only the pdf voice is
  publicly surfaced; the profile voice appears only on the profile detail page
  itself. Other tasks stay in code for structure but never appear in the public UI.
*/
export const taskPageVoices = {
  pdf: {
    eyebrow: 'The reference library',
    headline: 'A quiet, curated shelf of downloadable references.',
    description: 'Every entry is a working reference — guides, briefings, reports and reference material you can open, download, and keep.',
    filterLabel: 'Filter by collection',
    secondaryNote: 'Reference material deserves a calm, considered shelf.',
    chips: ['Downloadable', 'Curated collections', 'Working references'],
  },
  profile: {
    eyebrow: 'Contributor',
    headline: 'The person behind a reference.',
    description: 'Contributor pages capture the people who put resources on the shelf. Reachable by direct link only.',
    filterLabel: 'Filter contributors',
    secondaryNote: 'Identity presented once, without noise.',
    chips: ['Contributor', 'Verified', 'Reference author'],
  },
  article: {
    eyebrow: 'Field notes',
    headline: 'Long-form reads that sit alongside the library.',
    description: 'Essays and explainers that give context to the references on the shelf.',
    filterLabel: 'Filter reads',
    secondaryNote: 'Editorial pacing, quiet interface.',
    chips: ['Editorial', 'Deep reads', 'Reference context'],
  },
  classified: {
    eyebrow: 'Notices',
    headline: 'Time-sensitive posts, kept for structure.',
    description: 'Notices sit in the codebase to keep the task system whole.',
    filterLabel: 'Filter notices',
    secondaryNote: 'Structural only.',
    chips: ['Notices'],
  },
  sbm: {
    eyebrow: 'Saved links',
    headline: 'A working collection of external references.',
    description: 'Links to primary sources that back up the shelf.',
    filterLabel: 'Filter saved',
    secondaryNote: 'Companion material.',
    chips: ['External sources', 'Companion links'],
  },
  listing: {
    eyebrow: 'Directory',
    headline: 'Directory entries — kept for structure.',
    description: 'Directory records live in the codebase to keep task types whole.',
    filterLabel: 'Filter directory',
    secondaryNote: 'Structural only.',
    chips: ['Directory'],
  },
  image: {
    eyebrow: 'Visuals',
    headline: 'Image-led entries — kept for structure.',
    description: 'Visuals live in the codebase to keep task types whole.',
    filterLabel: 'Filter visuals',
    secondaryNote: 'Structural only.',
    chips: ['Visuals'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
