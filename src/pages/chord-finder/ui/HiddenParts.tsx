import { Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'

/** A part of the page the learner hid, and what brings it back. */
export interface HiddenPart {
  readonly id: string
  readonly label: string
  readonly onShow: () => void
}

/**
 * What the learner hid on the page, said where it was and each a button that brings it back: a page
 * with its parts hidden says so instead of standing empty. Nothing while every part shows.
 */
export function HiddenParts({ parts }: { parts: readonly HiddenPart[] }) {
  const { t } = useTranslation('practice')
  if (parts.length === 0) return null
  return (
    <section
      aria-label={t('chordFinder.hidden')}
      className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-dashed border-border px-4 py-3"
    >
      <h2 className="font-sans text-sm font-medium text-muted-foreground">{t('chordFinder.hidden')}</h2>
      <ul className="flex flex-wrap gap-2">
        {parts.map((part) => (
          <li key={part.id}>
            <Button variant="ghost" onClick={part.onShow}>
              <Eye data-icon="inline-start" aria-hidden />
              {part.label}
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}
