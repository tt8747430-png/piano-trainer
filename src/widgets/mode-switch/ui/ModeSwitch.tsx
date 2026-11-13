import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ViewPill } from '@/shared/ui'

/**
 * A piece's score played or edited (its canvas, the editor's bar): Play · Edit as one pill in the
 * bar's middle, Edit filled. Play opens the Player at `bar` (as printed, from 1), in the editor's
 * place in the history, so Close still goes back where the learner came from. While a take
 * records, Play waits for Stop (`waiting`, the tooltip saying so).
 */
export function ModeSwitch({
  pieceId,
  bar,
  waiting,
}: {
  pieceId: string
  bar: number
  waiting?: string | undefined
}) {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  // The first bar is where the Player opens: a URL never says so.
  const at = bar > 1 ? { bar } : {}
  return (
    <ViewPill
      label={t('editMode.label')}
      value="edit"
      views={[
        { value: 'play', label: t('editMode.play'), reason: waiting },
        { value: 'edit', label: t('editMode.editing') },
      ]}
      onChange={() =>
        void navigate({ to: '/play/$pieceId', params: { pieceId }, search: at, replace: true })
      }
    />
  )
}
