'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type Props = {
  index?: number
  as?: 'div' | 'section' | 'article' | 'header' | 'aside' | 'span'
  className?: string
  style?: CSSProperties
  once?: boolean
  delayMs?: number
  children: ReactNode
}

/*
  Scroll-triggered fade + slide-up used across the public surface.

  Reveal is arm-only-after-mount: on JS-off / SSR the child stays visible and
  static so nothing blank flashes. Once mounted we apply .is-armed (opacity 0 +
  translateY 28px) then remove it as soon as IntersectionObserver reports the
  element on screen. prefers-reduced-motion collapses to opacity-only via CSS.
*/
export function EditableReveal({
  index = 0,
  as = 'div',
  className = '',
  style,
  once = true,
  delayMs,
  children,
}: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [once])

  const Tag = as as 'div'
  const stagger = typeof delayMs === 'number' ? delayMs : Math.min(index, 12) * 80
  const armed = mounted && !visible
  const cls = ['editable-reveal', armed ? 'is-armed' : 'is-visible', className].filter(Boolean).join(' ')

  return (
    <Tag
      ref={ref as never}
      className={cls}
      style={{ transitionDelay: `${stagger}ms`, ...style }}
    >
      {children}
    </Tag>
  )
}
