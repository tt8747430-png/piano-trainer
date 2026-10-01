import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { keyScale, placeScale, type Key } from '@/shared/lib/music'
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
        scaleRun(
          { notes: placeScale(tonic, keyScale({ tonic, minor })) },
          {
            rhythm: 'even',
            hands: 'rh',
            key: { tonic, minor },
          },
        ),
      ),
    [tonic, minor],
  )
  return (
    <section
      aria-label={t('sheet.label')}
      className="-mx-4 overflow-x-auto overscroll-x-contain px-4 scrollbar-none lg:mx-0 lg:px-0"
    >
      <LazyScoreView score={score} muted="bass" />
    </section>
  )
}
