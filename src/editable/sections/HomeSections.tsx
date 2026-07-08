import Link from 'next/link'
import { ArrowUpRight, FileText, BookOpen, Layers, Sparkles, Download, Plus, Minus } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

/*
  Home sections — mapped from thomas-henry.webflow.io section rhythm:
    Hero → latest resources grid → collections showcase → contributor trust
    strip → pull-quote → FAQ → latest guides → dark CTA
  Everything centres on the Reference Library (pdf task). No contributor surfacing.
*/

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function getExcerpt(post?: SitePost | null, limit = 130) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function categoryOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || ''
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

/* ------------------------------- HERO ------------------------------------ */
export function EditableHomeHero({ primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const featured = pool[0]
  const heroTitleParts =
    pagesContent.home.hero.title && pagesContent.home.hero.title.length
      ? pagesContent.home.hero.title
      : ['A quieter home for', 'downloadable references.']
  const description = pagesContent.home.hero.description || `A curated shelf of resources, guides and reports across ${SITE_CONFIG.name}.`

  return (
    <section className="relative overflow-hidden bg-[var(--slot4-page-bg)]">
      <div className={`${dc.shell.section} pt-14 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-32`}>
        <EditableReveal index={0} className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
              {pagesContent.home.hero.badge || 'The reference library'}
            </p>
            <h1 className="editable-display mt-8 text-[3.4rem] leading-[0.9] tracking-[-0.05em] sm:text-[5.5rem] lg:text-[7.5rem]">
              {heroTitleParts.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-[1.6] text-[var(--slot4-muted-text)] sm:text-xl">
              {description}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link href={primaryRoute} className={dc.button.primary}>
                Browse the library
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/about" className={dc.button.secondary}>
                Why we built this
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            {featured ? (
              <Link
                href={postHref('pdf', featured, primaryRoute)}
                className="group relative block overflow-hidden rounded-[20px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)]"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--slot4-media-bg)]">
                  <img
                    src={getEditablePostImage(featured)}
                    alt={featured.title}
                    className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className={dc.badge.pill}>Featured</span>
                  <h3 className="editable-display mt-4 line-clamp-3 text-2xl leading-[1] tracking-[-0.02em] text-white">
                    {featured.title}
                  </h3>
                </div>
                <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(12,4,7,0.85))]" />
              </Link>
            ) : (
              <div className="grid h-full min-h-[340px] place-items-center rounded-[20px] border border-dashed border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)] p-8 text-center">
                <p className="text-sm text-[var(--slot4-muted-text)]">Featured reference will appear here.</p>
              </div>
            )}
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}

/* --------------------------- LATEST RESOURCES ---------------------------- */
/* Portfolio-style 2-col grid. Bordered soft cards. */
export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)]).slice(0, 6)
  if (!pool.length) return null

  return (
    <section className="border-t border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div className={`${dc.shell.section} py-20 sm:py-24 lg:py-32`}>
        <EditableReveal index={0} className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">Fresh on the shelf</p>
            <h2 className="editable-display mt-6 text-[2.5rem] leading-[0.95] tracking-[-0.04em] sm:text-[4rem]">
              Latest additions to<br />the reference library.
            </h2>
          </div>
          <Link href={primaryRoute} className={`${dc.button.secondary} shrink-0`}>
            View all references
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </EditableReveal>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {pool.map((post, i) => (
            <EditableReveal key={post.id || post.slug} index={i}>
              <Link
                href={postHref(primaryTask, post, primaryRoute)}
                className="group block overflow-hidden rounded-[16px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] transition-all duration-500 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--slot4-media-bg)]">
                  {getEditablePostImage(post) && !getEditablePostImage(post).includes('placeholder') ? (
                    <img
                      src={getEditablePostImage(post)}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <FileText className="h-14 w-14 text-[var(--slot4-muted-text)]/40" />
                    </div>
                  )}
                  <span className={`absolute left-5 top-5 ${dc.badge.pill}`}>
                    {categoryOf(post) || 'Reference'}
                  </span>
                </div>
                <div className="p-8">
                  <h3 className="editable-display line-clamp-2 text-[2rem] leading-[1] tracking-[-0.03em]">
                    {post.title}
                  </h3>
                  <p className="mt-5 line-clamp-2 text-[15px] leading-[1.65] text-[var(--slot4-muted-text)]">
                    {getExcerpt(post, 160)}
                  </p>
                  <span className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--slot4-page-text)] transition-all duration-500 group-hover:gap-2.5">
                    Open reference <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* --------------------------- COLLECTIONS SHOWCASE ------------------------ */
const collections = [
  { icon: BookOpen, title: 'Guides & handbooks', body: 'Step-by-step references to keep on hand — practical, downloadable, and well-organised.' },
  { icon: Layers, title: 'Reports & briefings', body: 'Analytical writeups and briefings compiled from primary and secondary sources.' },
  { icon: Sparkles, title: 'Templates & toolkits', body: 'Working files and starter kits you can adapt to your own projects.' },
]

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const activity = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const stats = [
    { value: String(activity.length), label: 'References on the shelf' },
    { value: String(new Set(activity.map((p) => categoryOf(p)).filter(Boolean)).size || 3), label: 'Categories curated' },
    { value: '100%', label: 'Freely downloadable' },
  ]

  return (
    <section className="border-t border-[var(--editable-border)] bg-[var(--slot4-warm)]">
      <div className={`${dc.shell.section} py-20 sm:py-24 lg:py-32`}>
        <EditableReveal index={0} className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">Collections</p>
            <h2 className="editable-display mt-6 text-[2.5rem] leading-[0.95] tracking-[-0.04em] sm:text-[4rem]">
              Organised by how you'd actually use it.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-[1.65] text-[var(--slot4-muted-text)]">
              Every reference in the library is filed into a working collection so you can jump straight to what you need — no scrolling through timelines.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="editable-display text-4xl leading-[1] tracking-[-0.03em]">{s.value}</p>
                  <p className="mt-2 text-[13px] leading-[1.4] text-[var(--slot4-muted-text)]">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <Link href={primaryRoute} className={dc.button.primary}>
                Explore collections
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-5">
            {collections.map((c, i) => {
              const Icon = c.icon
              return (
                <EditableReveal key={c.title} index={i + 1}>
                  <div className="group flex items-start gap-5 rounded-[16px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-7 transition-all duration-500 hover:-translate-y-1">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-page-text)] text-[var(--slot4-page-bg)] transition-all duration-500 group-hover:bg-[var(--slot4-warm-accent)] group-hover:text-[var(--slot4-page-text)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="editable-display text-2xl leading-[1.05] tracking-[-0.02em]">{c.title}</h3>
                      <p className="mt-3 text-[15px] leading-[1.65] text-[var(--slot4-muted-text)]">{c.body}</p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 shrink-0 opacity-40 transition-all duration-500 group-hover:opacity-100" />
                  </div>
                </EditableReveal>
              )
            })}
          </div>
        </EditableReveal>

        {/* Sub-strip: three example resource tiles */}
        {activity.length ? (
          <EditableReveal index={4} className="mt-16 grid gap-5 sm:grid-cols-3">
            {activity.slice(0, 3).map((post, i) => (
              <Link
                key={post.id || post.slug}
                href={postHref(primaryTask, post, primaryRoute)}
                className="group flex flex-col justify-between rounded-[16px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-6 transition-all duration-500 hover:-translate-y-[3px]"
              >
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">
                    {String(i + 1).padStart(2, '0')} · {categoryOf(post) || 'Reference'}
                  </p>
                  <h3 className="editable-display mt-4 line-clamp-3 text-xl leading-[1.1] tracking-[-0.02em]">
                    {post.title}
                  </h3>
                </div>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-500 group-hover:gap-2.5">
                  Open <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </EditableReveal>
        ) : null}
      </div>
    </section>
  )
}

/* ---------------- PULL QUOTE + FAQ + LATEST GUIDES + CTA ------------------ */
const faqs = [
  {
    q: 'What kinds of resources live in the library?',
    a: 'Working references you can actually use — practical guides, briefings, reports, templates and reference materials. Every entry is downloadable.',
  },
  {
    q: 'Do I need an account to browse?',
    a: 'No. Browsing and downloading is open. You only need an account to submit new resources of your own.',
  },
  {
    q: 'How is the library organised?',
    a: 'By collection first, then by category and tag. Search reaches every field so you can also find things by title or keyword.',
  },
  {
    q: 'Can I contribute something?',
    a: 'Yes — sign in and open the submission workspace. Reviewers make sure everything on the shelf is useful before it goes public.',
  },
]

function FaqRow({ q, a, index }: { q: string; a: string; index: number }) {
  return (
    <details className="group border-b border-[var(--editable-border)] py-6 first:border-t last:border-b-0 open:pb-8">
      <summary className="flex cursor-pointer items-start justify-between gap-6 list-none">
        <span className="editable-display text-[22px] leading-[1.15] tracking-[-0.02em] text-[var(--slot4-page-text)] sm:text-[26px]">
          <span className="mr-3 text-[var(--slot4-muted-text)]">{String(index + 1).padStart(2, '0')}.</span>
          {q}
        </span>
        <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--editable-border-strong)] text-[var(--slot4-page-text)] transition-all duration-500 group-open:bg-[var(--slot4-page-text)] group-open:text-[var(--slot4-page-bg)]">
          <Plus className="h-4 w-4 group-open:hidden" />
          <Minus className="hidden h-4 w-4 group-open:block" />
        </span>
      </summary>
      <p className="mt-4 max-w-3xl pl-11 text-[15px] leading-[1.7] text-[var(--slot4-muted-text)] sm:pl-14 sm:text-base">{a}</p>
    </details>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const guides = pool.slice(6, 12).length ? pool.slice(6, 12) : pool.slice(0, 6)

  return (
    <>
      {/* Pull quote — reference-style large-scale attributed statement */}
      <section className="border-t border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
        <div className={`${dc.shell.section} py-20 sm:py-24 lg:py-32`}>
          <EditableReveal index={0} className="mx-auto max-w-4xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">From the desk</p>
            <p className="editable-display mt-8 text-[2rem] leading-[1.1] tracking-[-0.03em] sm:text-[3rem] lg:text-[3.5rem]">
              “A shelf is only as useful as the way it’s kept. We keep this one small, considered, and easy to reach for.”
            </p>
            <p className="mt-8 text-sm font-medium uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
              {SITE_CONFIG.name} — Editorial
            </p>
          </EditableReveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[var(--editable-border)] bg-[var(--slot4-warm)]">
        <div className={`${dc.shell.section} py-20 sm:py-24 lg:py-32`}>
          <EditableReveal index={0} className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">Common questions</p>
              <h2 className="editable-display mt-6 text-[2.5rem] leading-[0.95] tracking-[-0.04em] sm:text-[4rem]">
                Answers, plainly.
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-[1.6] text-[var(--slot4-muted-text)]">
                What people ask about the library, how it’s curated, and how to contribute.
              </p>
              <Link href="/contact" className={`${dc.button.secondary} mt-8`}>
                Ask something else
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div>
              {faqs.map((f, i) => (
                <FaqRow key={f.q} q={f.q} a={f.a} index={i} />
              ))}
            </div>
          </EditableReveal>
        </div>
      </section>

      {/* Latest guides — 3-col */}
      {guides.length ? (
        <section className="border-t border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
          <div className={`${dc.shell.section} py-20 sm:py-24 lg:py-32`}>
            <EditableReveal index={0} className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">Just in</p>
                <h2 className="editable-display mt-6 text-[2.5rem] leading-[0.95] tracking-[-0.04em] sm:text-[4rem]">
                  Recently added guides.
                </h2>
              </div>
              <Link href={primaryRoute} className={`${dc.button.secondary} shrink-0`}>
                Browse all guides
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </EditableReveal>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {guides.map((post, i) => (
                <EditableReveal key={post.id || post.slug} index={i}>
                  <Link
                    href={postHref(primaryTask, post, primaryRoute)}
                    className="group block h-full overflow-hidden rounded-[16px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] transition-all duration-500 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[var(--slot4-media-bg)]">
                      {getEditablePostImage(post) && !getEditablePostImage(post).includes('placeholder') ? (
                        <img
                          src={getEditablePostImage(post)}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <FileText className="h-12 w-12 text-[var(--slot4-muted-text)]/40" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">
                        {categoryOf(post) || 'Reference'}
                      </p>
                      <h3 className="editable-display mt-4 line-clamp-3 text-2xl leading-[1.05] tracking-[-0.02em]">
                        {post.title}
                      </h3>
                      <p className="mt-4 line-clamp-2 text-sm leading-[1.65] text-[var(--slot4-muted-text)]">
                        {getExcerpt(post, 120)}
                      </p>
                    </div>
                  </Link>
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

/* --------------------------- DARK CTA BAND ------------------------------- */
export function EditableHomeCta() {
  const pdfRoute = SITE_CONFIG.tasks.find((t) => t.key === 'pdf' && t.enabled)?.route || '/pdf'
  return (
    <section id="get-app" className="mt-24 scroll-mt-24 bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
      <div className={`${dc.shell.section} py-24 sm:py-32 lg:py-40`}>
        <EditableReveal index={0} className="grid gap-14 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">Get started</p>
            <h2 className="editable-display mt-8 text-[3rem] leading-[0.9] tracking-[-0.05em] sm:text-[5rem] lg:text-[6.5rem]">
              Take what you need.<br />Leave the rest on the shelf.
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-[1.6] text-white/70">
              Everything on {SITE_CONFIG.name} is open. Browse the reference library, download what fits, and come back when you need more.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={pdfRoute}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-bg)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-page-text)] transition-all duration-500 hover:-translate-y-[1px] hover:bg-[var(--slot4-warm-accent)]"
            >
              Browse the library
              <Download className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-500 hover:-translate-y-[1px] hover:border-white hover:bg-white/10"
            >
              Talk to the team
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}
