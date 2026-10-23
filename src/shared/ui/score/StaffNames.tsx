import { useTranslation } from 'react-i18next'
import { DEFAULT_INSTRUMENT } from '@/shared/lib/music'
import { EXTRA_VOICES } from '@/shared/lib/notation'
import type { ScoreLayout } from './layout'

/** A sung staff's name stands this far over its top line. */
const OVER = 16
const SUNG = ['melody', ...EXTRA_VOICES] as const

/**
 * Over a line's engraving where voices are sung together (ADR 0066), or a part is played on an
 * instrument (ADR 0070): each sung staff named over its start, by its instrument where it has one,
 * else the tune's and each more voice's, so the staves in a row are told apart.
 */
export function StaffNames({ layout }: { layout: ScoreLayout }) {
  const { t } = useTranslation('music')
  const played = layout.staffInstruments ?? {}
  const named = (staff: (typeof SUNG)[number]) => {
    const instrument = played[staff]
    return instrument && instrument !== DEFAULT_INSTRUMENT
      ? t(`instrument.${instrument}`)
      : t(`sheet.staff.${staff}`)
  }
  const instrumental = Object.values(played).some((one) => one !== DEFAULT_INSTRUMENT)
  if (!layout.staves.voice2 && !instrumental) return null
  return SUNG.map((staff) => {
    const box = layout.staves[staff]
    return box ? (
      <span
        key={staff}
        aria-hidden
        className="pointer-events-none absolute left-0 z-10 text-[0.625rem] leading-none font-semibold whitespace-nowrap text-muted-foreground"
        style={{ top: box.top - OVER }}
      >
        {named(staff)}
      </span>
    ) : null
  })
}
