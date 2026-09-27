import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { placeScale, type Key } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { scaleRun } from '@/shared/lib/schedule'
import { LazyScoreView } from '@/shared/ui'

/** The key's signature on a grand staff, with its scale up and down in it. */
export function KeySignature({ value }: { value: Key }) {
  const { t } = useTranslation('music')
  const { tonic, minor } = value
  const score = useMemo(
    () =>
      notate(
        scaleRun(placeScale(tonic, minor ? 'natural' : 'major'), {
          rhythm: 'even',
          hands: 'rh',
          key: { tonic, minor },
        }),
      ),
    [tonic, minor],
  )
  return (
    <section
      aria-label={t('sheet.label')}
      className="-mx-4 overflow-x-auto overscroll-x-contain px-4 scrollbar-none lg:mx-0 lg:px-0"
    >
      <LazyScoreView score={score} scale={1} fingers={false} muted="bass" />
    </section>
  )
}
