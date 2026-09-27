import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { PlacedChord } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { chordBar } from '@/shared/lib/schedule'
import { LazyScoreView } from '@/shared/ui'

/** The chord written: a bar of it on a grand staff, as the keys place it. */
export function ChordSheet({ placed }: { placed: PlacedChord }) {
  const { t } = useTranslation('music')
  const score = useMemo(() => notate(chordBar(placed)), [placed])
  return (
    <section aria-label={t('sheet.label')}>
      <LazyScoreView score={score} scale={1} fingers={false} />
    </section>
  )
}
