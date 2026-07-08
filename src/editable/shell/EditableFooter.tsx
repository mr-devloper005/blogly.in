'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Footer — discovery surface. Public labels only.
  The "Discovery" column lists the renamed Reference Library (pdf task) only —
  never contributor-anything, never other archives.
*/
export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  // Locate the pdf task's public route without exposing its raw key label.
  const pdfTask = SITE_CONFIG.tasks.find((t) => t.key === 'pdf' && t.enabled)
  const referenceHref = pdfTask?.route || '/pdf'

  return (
    <footer className="mt-24 bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      {/* CTA strip */}
      <section className="border-b border-white/10">
        <div className="mx-auto flex max-w-[var(--editable-container-wide)] flex-col gap-8 px-6 py-16 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">Get started</p>
            <h2 className="editable-display mt-4 text-5xl leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-[5rem]">
              Start building your<br />reference library.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={referenceHref}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-bg)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-page-text)] transition-all duration-500 hover:-translate-y-[1px] hover:bg-[var(--slot4-warm-accent)]"
            >
              Browse resources
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-500 hover:-translate-y-[1px] hover:border-white hover:bg-white/10"
            >
              Talk to us
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[var(--editable-container-wide)] gap-14 px-6 py-16 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-12 lg:py-20">
        {/* Brand + description */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center bg-[var(--slot4-page-bg)]">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
            </span>
            <span className="editable-body-display text-lg font-bold tracking-[-0.02em]">{SITE_CONFIG.name}</span>
          </Link>
          <p className="mt-5 max-w-md text-[15px] leading-[1.7] text-white/70">
            {globalContent.footer?.description || `${SITE_CONFIG.name} — a curated reference library of downloadable guides, reports and resources.`}
          </p>
        </div>

        {/* Discovery — Reference Library only */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">Discovery</h3>
          <div className="mt-5 grid gap-3">
            <Link
              href={referenceHref}
              className="inline-flex items-center gap-2 text-[15px] font-medium text-white/85 transition duration-300 hover:text-[var(--slot4-warm-accent)]"
            >
              Reference Library
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 text-[15px] font-medium text-white/85 transition duration-300 hover:text-[var(--slot4-warm-accent)]"
            >
              Search
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">Resources</h3>
          <div className="mt-5 grid gap-3">
            <Link href="/about" className="text-[15px] font-medium text-white/85 transition duration-300 hover:text-[var(--slot4-warm-accent)]">About</Link>
            <Link href="/contact" className="text-[15px] font-medium text-white/85 transition duration-300 hover:text-[var(--slot4-warm-accent)]">Contact</Link>
          </div>
        </div>

        {/* Account */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">Account</h3>
          <div className="mt-5 grid gap-3">
            {session ? (
              <>
                <Link href="/create" className="text-[15px] font-medium text-white/85 transition duration-300 hover:text-[var(--slot4-warm-accent)]">Submit a resource</Link>
                <button
                  type="button"
                  onClick={logout}
                  className="text-left text-[15px] font-medium text-white/85 transition duration-300 hover:text-[var(--slot4-warm-accent)]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[15px] font-medium text-white/85 transition duration-300 hover:text-[var(--slot4-warm-accent)]">Sign in</Link>
                <Link href="/signup" className="text-[15px] font-medium text-white/85 transition duration-300 hover:text-[var(--slot4-warm-accent)]">Get started</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[var(--editable-container-wide)] flex-col items-start justify-between gap-3 px-6 py-6 text-[13px] text-white/50 sm:flex-row sm:items-center sm:px-8 lg:px-12">
          <p>© {year} {SITE_CONFIG.name}. All rights reserved.</p>
          <p className="text-white/40">Curated references. Quiet interface.</p>
        </div>
      </div>
    </footer>
  )
}
