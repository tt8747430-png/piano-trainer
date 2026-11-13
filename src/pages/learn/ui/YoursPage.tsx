import { useTranslation } from 'react-i18next'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { OwnLibrary } from '@/widgets/curriculum'

/**
 * Your lessons and courses (canvas 165), opened from Learn's See all: the title in the bar with
 * Back to Learn, then the learner's own as a library.
 */
export function YoursPage() {
  const { t } = useTranslation('learn')
  return (
    <div className="flex flex-col pb-8">
      <ScreenHeader title={t('own.title')} large back={<BackButton />} />
      <div className="flex w-full max-w-4xl flex-col">
        <OwnLibrary />
      </div>
    </div>
  )
}
