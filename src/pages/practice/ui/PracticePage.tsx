import { useTranslation } from 'react-i18next'
import { PROGRESSIONS, STUDIES } from '@/entities/piece'
import { localText, useLocale } from '@/shared/i18n'
import { ScreenHeader } from '@/shared/ui'
import { PieceList } from '@/widgets/piece-list'

/** Practice: the studies and progressions, each opening its page here. */
export function PracticePage() {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('title')} />
      <PieceList
        groups={[STUDIES, PROGRESSIONS].map((collection) => ({
          id: collection.id,
          heading: localText(collection.name, locale),
          entries: collection.entries,
        }))}
      />
    </div>
  )
}
