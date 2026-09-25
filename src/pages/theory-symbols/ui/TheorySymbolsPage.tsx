import { useTranslation } from 'react-i18next'
import { CHORD_FAMILIES, qualitiesIn } from '@/shared/lib/music'
import { QualityRow } from './QualityRow'
import { ReadingSheet } from './ReadingSheet'

export function TheorySymbolsPage() {
  const { t } = useTranslation('theory')
  return (
    <div className="flex flex-col gap-8">
      <ReadingSheet />
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
