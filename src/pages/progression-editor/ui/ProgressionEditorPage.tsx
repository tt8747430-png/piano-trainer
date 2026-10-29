import { Link, useParams } from '@tanstack/react-router'
import { blankProgression, progressionById } from '@/entities/progression-library'
import { BackButton } from '@/shared/ui'
import { ProgressionEditor } from './ProgressionEditor'

/**
 * A progression in the progression editor, an editor's (content as data, ADR 0116). One the library
 * does not list is one an editor made and has not published: its draft is the server's.
 */
export function ProgressionEditorPage() {
  const { progressionId } = useParams({
    from: '/shell/practice/progressions/$progressionId/edit',
  })
  return (
    <ProgressionEditor
      key={progressionId}
      progression={progressionById(progressionId) ?? blankProgression(progressionId, '')}
      back={<BackButton fallback={{ to: '/practice/progressions' }} />}
      toProgressions={<Link to="/practice/progressions" />}
    />
  )
}
