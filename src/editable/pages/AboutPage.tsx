import Link from 'next/link'
import { ArrowUpRight, BookOpen, Layers, Sparkles } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

const valueIcons = [BookOpen, Layers, Sparkles]

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} pt-20 pb-20 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-32`}>
          <EditableReveal index={0}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
              {pagesContent.about.badge}
            </p>
            <h1 className="editable-display mt-8 text-[3rem] leading-[0.9] tracking-[-0.05em] sm:text-[5.5rem] lg:text-[7rem]">
              About {SITE_CONFIG.name}.
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-[1.6] text-[var(--slot4-muted-text)] sm:text-xl">
              {pagesContent.about.description}
            </p>
          </EditableReveal>
        </section>

        <section className="border-t border-[var(--editable-border)]">
          <div className={`${dc.shell.section} py-20 sm:py-24 lg:py-32`}>
            <EditableReveal index={0} className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">Our approach</p>
                <h2 className="editable-display mt-6 text-[2.5rem] leading-[0.95] tracking-[-0.04em] sm:text-[4rem]">
                  Small on purpose. Useful by design.
                </h2>
              </div>
              <div className="space-y-6 text-lg leading-[1.7] text-[var(--slot4-muted-text)]">
                {pagesContent.about.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </EditableReveal>
          </div>
        </section>

        <section className="border-t border-[var(--editable-border)] bg-[var(--slot4-warm)]">
          <div className={`${dc.shell.section} py-20 sm:py-24 lg:py-32`}>
            <EditableReveal index={0}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
                What guides us
              </p>
              <h2 className="editable-display mt-6 text-[2.5rem] leading-[0.95] tracking-[-0.04em] sm:text-[4rem]">
                Three quiet principles.
              </h2>
            </EditableReveal>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {pagesContent.about.values.map((value, i) => {
                const Icon = valueIcons[i % valueIcons.length]
                return (
                  <EditableReveal key={value.title} index={i}>
                    <div className="group h-full rounded-[16px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-8 transition-all duration-500 hover:-translate-y-1">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--slot4-page-text)] text-[var(--slot4-page-bg)] transition-all duration-500 group-hover:bg-[var(--slot4-warm-accent)] group-hover:text-[var(--slot4-page-text)]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="editable-display mt-8 text-2xl leading-[1.05] tracking-[-0.02em]">{value.title}</h3>
                      <p className="mt-4 text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">{value.description}</p>
                    </div>
                  </EditableReveal>
                )
              })}
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--editable-border)]">
          <div className={`${dc.shell.section} py-20 sm:py-24 lg:py-28`}>
            <EditableReveal index={0} className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
              <h2 className="editable-display max-w-3xl text-[2.5rem] leading-[0.95] tracking-[-0.04em] sm:text-[4rem]">
                Ready to browse the shelf?
              </h2>
              <div className="flex flex-wrap gap-3">
                <Link href="/pdf" className={dc.button.primary}>
                  Browse the library <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className={dc.button.secondary}>Contact us</Link>
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
