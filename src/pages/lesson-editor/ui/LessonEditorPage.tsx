import { Link, useParams } from '@tanstack/react-router'
import { lessonById } from '@/entities/lesson'
import { BackButton } from '@/shared/ui'
import { LessonEditor } from './LessonEditor'

/** A journey's lesson in the lesson editor, an editor's (ADR 0116). */
export function LessonEditorPage() {
  const { lessonId } = useParams({ from: '/shell/lessons/$lessonId/edit' })
  const lesson = lessonById(lessonId)
  // The route finds no lesson that no journey has.
  if (!lesson) return null
  return (
    <LessonEditor
      key={lessonId}
      lesson={lesson}
      id={lessonId}
      back={<BackButton fallback={{ to: '/lessons/$lessonId', params: { lessonId } }} />}
      toLesson={<Link to="/lessons/$lessonId" params={{ lessonId }} />}
    />
  )
}
