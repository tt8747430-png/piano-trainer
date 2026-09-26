import { useTranslation } from 'react-i18next'
import { LiveKeyboard } from '@/features/live-keyboard'
import { CHORD_FAMILIES, MIDDLE_OCTAVES, qualitiesIn } from '@/shared/lib/music'
import { Pinned } from '@/shared/ui'
import { QualityRow } from './QualityRow'
import { ReadingSheet } from './ReadingSheet'

/** The reading notes, then the chord dictionary under a pinned keyboard that shows each chord heard. */
export function TheorySymbolsPage() {
  const { t } = useTranslation('theory')
  return (
    <div className="flex flex-col gap-8">
      <ReadingSheet />
      <Pinned>
        <LiveKeyboard range={MIDDLE_OCTAVES} className="h-32" />
      </Pinned>
      {CHORD_FAMILIES.map((family) => (
        <section key={family} aria-label={t(`family.${family}`)} className="flex flex-col gap-3">
          <h2 className="text-xl font-bold">{t(`family.${family}`)}</h2>
          <ul className="flex flex-col divide-y divide-border rounded-3xl bg-card ring-1 ring-border">
            {qualitiesIn(family).map((quality) => (
              <QualityRow key={quality} quality={quality} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
