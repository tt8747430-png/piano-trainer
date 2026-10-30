import { Link, useParams } from '@tanstack/react-router'
import { blankLesson, lessonById } from '@/entities/lesson'
import { BackButton } from '@/shared/ui'
import { LessonEditor } from './LessonEditor'

/**
 * A journey's lesson in the lesson editor, an editor's (ADR 0116). A lesson the device does not have
 * is a new one, not published: its draft is the server's.
 */
export function LessonEditorPage() {
  const { lessonId } = useParams({ from: '/shell/lessons/$lessonId/edit' })
  const lesson = lessonById(lessonId) ?? blankLesson(lessonId)
  return (
    <LessonEditor
      key={lessonId}
      lesson={lesson}
      id={lessonId}
      back={<BackButton fallback={{ to: '/lessons/$lessonId', params: { lessonId } }} />}
      toLesson={<Link to="/lessons/$lessonId" params={{ lessonId }} />}
      readFirst
    />
  )
}
