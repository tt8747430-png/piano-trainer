import { useTranslation } from 'react-i18next'
import { EXTRA_VOICES } from '@/shared/lib/notation'
import type { ScoreLayout } from './engrave'

/** A sung staff's name stands this far over its top line. */
const OVER = 16
const SUNG = ['melody', ...EXTRA_VOICES] as const

/**
 * Over a line's engraving where voices are sung together (ADR 0066): each sung staff named over its
 * start, the tune's and each more voice's, so the trebles in a row are told apart.
 */
export function StaffNames({ layout }: { layout: ScoreLayout }) {
  const { t } = useTranslation('music')
  if (!layout.staves.voice2) return null
  return SUNG.map((staff) => {
    const box = layout.staves[staff]
    return box ? (
      <span
        key={staff}
        aria-hidden
        className="pointer-events-none absolute left-0 z-10 text-[0.625rem] leading-none font-semibold whitespace-nowrap text-muted-foreground"
        style={{ top: box.top - OVER }}
      >
        {t(`sheet.staff.${staff}`)}
      </span>
    ) : null
  })
}
