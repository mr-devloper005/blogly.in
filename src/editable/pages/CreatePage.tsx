'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, FileText, Lock, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const fieldClass =
  'w-full rounded-[12px] border border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)] px-5 py-3.5 text-[15px] text-[var(--slot4-page-text)] outline-none transition duration-500 placeholder:text-[var(--slot4-muted-text)] focus:border-[var(--slot4-page-text)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

// Public submission UI centres on resource submission — the pdf task only.
// Profile task creation stays in-code but is never promoted or offered here.
function getSubmissionTask(): TaskKey {
  const pdf = SITE_CONFIG.tasks.find((t) => t.key === 'pdf' && t.enabled)
  if (pdf) return 'pdf'
  const other = SITE_CONFIG.tasks.find((t) => t.enabled && t.key !== 'profile')
  return (other?.key || 'pdf') as TaskKey
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const submissionTask = useMemo(() => getSubmissionTask(), [])
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task: submissionTask,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
          <section className={`${dc.shell.section} grid items-center gap-12 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:py-32`}>
            <EditableReveal index={0} className="flex h-full min-h-[320px] items-center justify-center rounded-[20px] bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
              <Lock className="h-20 w-20 opacity-70" />
            </EditableReveal>
            <EditableReveal index={1}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
                {pagesContent.create.locked.badge}
              </p>
              <h1 className="editable-display mt-8 text-[3rem] leading-[0.9] tracking-[-0.05em] sm:text-[5rem]">
                {pagesContent.create.locked.title}
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-[1.6] text-[var(--slot4-muted-text)]">
                {pagesContent.create.locked.description}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/login" className={dc.button.primary}>
                  Sign in <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href="/signup" className={dc.button.secondary}>
                  Get started
                </Link>
              </div>
            </EditableReveal>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} py-20 lg:py-28`}>
          <EditableReveal index={0} className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <aside>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
                {pagesContent.create.hero.badge}
              </p>
              <h1 className="editable-display mt-8 text-[3rem] leading-[0.9] tracking-[-0.05em] sm:text-[4.5rem]">
                {pagesContent.create.hero.title}
              </h1>
              <p className="mt-8 max-w-lg text-lg leading-[1.6] text-[var(--slot4-muted-text)]">
                {pagesContent.create.hero.description}
              </p>
              <div className="mt-10 flex items-start gap-4 rounded-[16px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-page-text)] text-[var(--slot4-page-bg)]">
                  <FileText className="h-4 w-4" />
                </span>
                <div>
                  <p className="editable-body-display text-base tracking-[-0.01em]">Reference Library submission</p>
                  <p className="mt-1 text-[13px] leading-[1.55] text-[var(--slot4-muted-text)]">
                    Add a working reference — a guide, briefing, report, or resource — to the shelf.
                  </p>
                </div>
              </div>
            </aside>

            <form onSubmit={submit} className="rounded-[20px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-8 sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">
                    New submission
                  </p>
                  <h2 className="editable-display mt-3 text-[2rem] leading-[1.05] tracking-[-0.03em]">
                    {pagesContent.create.formTitle}
                  </h2>
                </div>
                <span className="rounded-full border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
                  {session.name}
                </span>
              </div>

              <div className="mt-8 grid gap-4">
                <input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Reference title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Collection or category" />
                  <input className={fieldClass} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="File URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(e) => setImage(e.target.value)} placeholder="Cover image URL (optional)" />
                <textarea className={`${fieldClass} min-h-28`} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Short summary — what this reference covers" required />
                <textarea className={`${fieldClass} min-h-52`} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Notes, table of contents, or full description" required />
              </div>

              {created ? (
                <div className="mt-6 rounded-[12px] border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] p-5">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}
                  </p>
                  <p className="mt-1 text-sm text-[var(--slot4-muted-text)]">{created.title}</p>
                </div>
              ) : null}

              <button type="submit" className={`${dc.button.primary} mt-8 w-full`}>
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
