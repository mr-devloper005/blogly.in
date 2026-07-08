'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X, PlusCircle, LogIn, UserPlus, LogOut } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Navbar rules (from the brief):
    - No task-page links (no directory, no library, no contributor page).
    - Center: About + Contact only.
    - Right: search icon → /search, then auth actions.
    - Mobile mirrors the same set, no task labels.
*/
export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const links = [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-[var(--editable-nav-bg)]/85 text-[var(--editable-nav-text)] backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[76px] w-full max-w-[var(--editable-container-wide)] items-center gap-6 px-6 sm:px-8 lg:px-12">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center bg-[var(--slot4-page-text)] text-[var(--slot4-page-bg)] transition-transform duration-500 group-hover:rotate-[8deg]">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-10 w-10 object-contain" />
          </span>
          <span className="editable-body-display max-w-[220px] truncate text-lg font-bold tracking-[-0.02em]">
            {SITE_CONFIG.name}
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-[14px] font-medium tracking-[-0.01em] transition-colors duration-300 ${
                  active ? 'text-[var(--slot4-page-text)]' : 'text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]'
                }`}
              >
                {item.label}
                <span
                  aria-hidden
                  className={`absolute -bottom-1.5 left-0 h-[2px] bg-[var(--slot4-page-text)] transition-all duration-500 ${
                    active ? 'w-full' : 'w-0'
                  }`}
                />
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2.5">
          <Link
            href="/search"
            aria-label="Search"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border-strong)] text-[var(--slot4-page-text)] transition-all duration-500 hover:-translate-y-[1px] hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-page-bg)] sm:inline-flex"
          >
            <Search className="h-4 w-4" />
          </Link>

          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-5 py-2.5 text-sm font-semibold text-[var(--slot4-page-bg)] transition-all duration-500 hover:-translate-y-[1px] hover:bg-[var(--slot4-warm-accent)] hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                <PlusCircle className="h-4 w-4" /> Submit
              </Link>
              <button
                type="button"
                onClick={logout}
                aria-label="Logout"
                className="hidden h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border-strong)] text-[var(--slot4-page-text)] transition-all duration-500 hover:-translate-y-[1px] hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-page-bg)] sm:inline-flex"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-5 py-2.5 text-sm font-semibold text-[var(--slot4-page-text)] transition-all duration-500 hover:-translate-y-[1px] hover:border-[var(--slot4-page-text)] sm:inline-flex"
              >
                <LogIn className="h-4 w-4" /> Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-5 py-2.5 text-sm font-semibold text-[var(--slot4-page-bg)] transition-all duration-500 hover:-translate-y-[1px] hover:bg-[var(--slot4-warm-accent)] hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                <UserPlus className="h-4 w-4" /> Get started
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border-strong)] lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--editable-nav-bg)] px-6 py-6 lg:hidden">
          <div className="grid gap-1">
            {[{ label: 'Home', href: '/' }, ...links, { label: 'Search', href: '/search' }, ...(session
              ? [{ label: 'Submit', href: '/create' }]
              : [{ label: 'Sign in', href: '/login' }, { label: 'Get started', href: '/signup' }])].map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-full px-4 py-3 text-base font-medium transition duration-300 ${
                    active
                      ? 'bg-[var(--slot4-page-text)] text-[var(--slot4-page-bg)]'
                      : 'text-[var(--slot4-page-text)] hover:bg-[var(--slot4-warm)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            {session ? (
              <button
                type="button"
                onClick={() => {
                  logout()
                  setOpen(false)
                }}
                className="rounded-full px-4 py-3 text-left text-base font-medium text-[var(--slot4-muted-text)] transition hover:bg-[var(--slot4-warm)]"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
