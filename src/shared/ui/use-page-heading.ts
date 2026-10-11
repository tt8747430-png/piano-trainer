import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * A screen's heading: the page's title names it (`Chords · Piano Trainer`), and a screen opened by a
 * link, whose focus went with the link, puts the focus on its heading (in the next frame, once it is
 * laid out), so a screen reader says where it is and Tab goes on from there. Spread what it returns on
 * the heading.
 */
export function usePageHeading<Heading extends HTMLElement>(title: string) {
  const { t } = useTranslation('common')
  const app = t('appName')
  const ref = useRef<Heading>(null)
  useEffect(() => {
    document.title = title ? `${title} · ${app}` : app
  }, [title, app])
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const focused = document.activeElement
      if (focused === null || focused === document.body) ref.current?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [])
  return { ref, tabIndex: -1 } as const
}
