import { useParams } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { lessonById } from '@/entities/lesson'
import { localText, useLocale } from '@/shared/i18n'
import { useGoBack } from '@/shared/lib'
import { RoundButton, ScreenHeader } from '@/shared/ui'
import { LessonView } from '@/widgets/lesson-view'

/** A lesson: its title and summary, then the lesson itself. */
export function LessonPage() {
  const { t } = useTranslation('common')
  const locale = useLocale()
  const { lessonId } = useParams({ from: '/shell/learn/lessons/$lessonId' })
  const back = useGoBack({ to: '/learn' })
  const lesson = lessonById(lessonId)
  if (!lesson) return null
  return (
    <div className="flex flex-col gap-4">
      <ScreenHeader
        title={localText(lesson.title, locale)}
        back={<RoundButton label={t('back')} icon={ArrowLeft} onClick={back} />}
      />
      <p className="-mt-3 max-w-prose text-lg text-muted-foreground">
        {localText(lesson.summary, locale)}
      </p>
      <LessonView key={lesson.id} lesson={lesson} />
    </div>
  )
}
