import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { notate, type StaffId, type TimedMusic } from '@/shared/lib/notation'
import type { Hands } from '@/shared/lib/schedule'
import { LazyScoreView } from '@/shared/ui'

/** The staff of the hand not playing, soft as in the Player. */
const MUTED: Readonly<Record<Hands, StaffId | undefined>> = {
  both: undefined,
  rh: 'bass',
  lh: 'treble',
}

/** The run on a grand staff as it plays, in its scale's key, with finger numbers while a hand's are shown. */
export function ScaleSheet({
  music,
  hands,
  fingers,
}: {
  music: TimedMusic
  hands: Hands
  fingers: boolean
}) {
  const { t } = useTranslation('music')
  const score = useMemo(() => notate(music), [music])
  return (
    <section
      aria-label={t('sheet.label')}
      className="-mx-gutter overflow-x-auto overscroll-x-contain px-gutter scrollbar-none lg:mx-0 lg:px-0"
    >
      <LazyScoreView score={score} fingers={fingers} muted={MUTED[hands]} />
    </section>
  )
}
