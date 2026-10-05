import { useTranslation } from 'react-i18next'
import { STUDIES } from '@/entities/piece'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { PieceList } from '@/widgets/piece-list'
import { AccompanimentTabs } from '@/widgets/subject-tabs'

/** Accompaniment's studies: the short pieces the patterns are practised on, each opening its page. */
export function StudiesPage() {
  const { t } = useTranslation('practice')
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <ScreenHeader
          title={t('subjects.accompaniment')}
          back={<BackButton fallback={{ to: '/practice' }} />}
        />
        <AccompanimentTabs current="studies" />
      </div>
      <PieceList groups={[{ id: STUDIES.id, heading: null, entries: STUDIES.entries }]} />
    </div>
  )
}
