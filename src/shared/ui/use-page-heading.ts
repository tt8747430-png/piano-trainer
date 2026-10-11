import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * A screen's heading: the page's title names it (`Chords · Piano Trainer`), and a screen opened by a
 * link, whose focus went with the link, puts the focus on its heading, so a screen reader says where
 * it is and Tab goes on from there. Give the heading `tabIndex={-1}`.
 */
export function usePageHeading<Heading extends HTMLElement>(title: string) {
  const { t } = useTranslation('common')
  const app = t('appName')
  const heading = useRef<Heading>(null)
  useEffect(() => {
    document.title = title ? `${title} · ${app}` : app
  }, [title, app])
  useEffect(() => {
    const focused = document.activeElement
    if (focused === null || focused === document.body)
      heading.current?.focus({ preventScroll: true })
  }, [])
  return heading
}
