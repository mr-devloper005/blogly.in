import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/signup',
    title: 'Get started',
    description: pagesContent.auth.signup.metadataDescription,
  })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} grid min-h-[calc(100vh-12rem)] items-center gap-12 py-20 lg:grid-cols-[0.9fr_1fr] lg:py-28`}>
          <EditableReveal index={0}>
            <div className="rounded-[20px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-8 sm:p-10">
              <h1 className="editable-display text-2xl leading-[1.05] tracking-[-0.02em]">
                {pagesContent.auth.signup.formTitle}
              </h1>
              <div className="mt-6">
                <EditableLocalSignupForm />
              </div>
              <p className="mt-8 text-sm text-[var(--slot4-muted-text)]">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-[var(--slot4-page-text)] underline underline-offset-4">
                  {pagesContent.auth.signup.loginCta}
                </Link>
              </p>
            </div>
          </EditableReveal>

          <EditableReveal index={1}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
              {pagesContent.auth.signup.badge}
            </p>
            <h2 className="editable-display mt-8 max-w-xl text-[3rem] leading-[0.9] tracking-[-0.05em] sm:text-[5rem]">
              {pagesContent.auth.signup.title}
            </h2>
            <p className="mt-8 max-w-lg text-lg leading-[1.6] text-[var(--slot4-muted-text)]">
              {pagesContent.auth.signup.description}
            </p>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
