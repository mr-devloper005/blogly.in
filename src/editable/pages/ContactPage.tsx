'use client'

import { BookOpen, FileText, Mail, MessageSquare, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

const lanes = [
  {
    icon: BookOpen,
    title: 'Suggest a reference',
    body: 'Know of a working reference, guide, or report worth keeping on the shelf? Send it our way.',
  },
  {
    icon: FileText,
    title: 'Report a broken link',
    body: 'Something on the shelf out of date or unreachable? Flag it and we\'ll refresh the entry.',
  },
  {
    icon: Sparkles,
    title: 'Ask about contributing',
    body: 'Want to add references of your own? We can talk you through the submission workflow.',
  },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} pt-20 pb-16 sm:pt-28 sm:pb-20 lg:pt-32`}>
          <EditableReveal index={0}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
              {pagesContent.contact.eyebrow}
            </p>
            <h1 className="editable-display mt-8 max-w-4xl text-[3rem] leading-[0.9] tracking-[-0.05em] sm:text-[5rem] lg:text-[6.5rem]">
              {pagesContent.contact.title}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-[var(--slot4-muted-text)] sm:text-xl">
              {pagesContent.contact.description}
            </p>
          </EditableReveal>
        </section>

        <section className="border-t border-[var(--editable-border)]">
          <div className={`${dc.shell.section} grid gap-12 py-20 sm:py-24 lg:grid-cols-[0.95fr_1.05fr] lg:py-28`}>
            <EditableReveal index={0}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
                What people write in about
              </p>
              <h2 className="editable-display mt-6 text-[2rem] leading-[1] tracking-[-0.03em] sm:text-[2.75rem]">
                Three lanes, one inbox.
              </h2>
              <div className="mt-10 space-y-4">
                {lanes.map((lane, i) => (
                  <EditableReveal key={lane.title} index={i + 1}>
                    <div className="group flex items-start gap-5 rounded-[16px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-6 transition duration-500 hover:-translate-y-[2px]">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-page-text)] text-[var(--slot4-page-bg)] transition-all duration-500 group-hover:bg-[var(--slot4-warm-accent)] group-hover:text-[var(--slot4-page-text)]">
                        <lane.icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="editable-display text-xl leading-[1.1] tracking-[-0.02em]">{lane.title}</h3>
                        <p className="mt-2 text-[15px] leading-[1.65] text-[var(--slot4-muted-text)]">{lane.body}</p>
                      </div>
                    </div>
                  </EditableReveal>
                ))}
              </div>
            </EditableReveal>

            <EditableReveal index={1}>
              <div className="rounded-[16px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-8 sm:p-10">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--slot4-page-text)] text-[var(--slot4-page-bg)]">
                    <MessageSquare className="h-4 w-4" />
                  </span>
                  <h2 className="editable-display text-2xl leading-[1.05] tracking-[-0.02em]">
                    {pagesContent.contact.formTitle}
                  </h2>
                </div>
                <div className="mt-6">
                  <EditableContactLeadForm />
                </div>
                <p className="mt-8 flex items-center gap-2 text-sm text-[var(--slot4-muted-text)]">
                  <Mail className="h-4 w-4" /> We reply to every message.
                </p>
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
