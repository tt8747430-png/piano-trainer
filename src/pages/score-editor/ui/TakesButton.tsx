import { ListMusic } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectTakesOf, useTakes } from '@/entities/take'
import { FloatingBarButton } from '@/shared/ui'
import { useScoreEditorContext } from '../model/editor-context'
import { TAKES_PAGE } from '../model/use-editor-takes'

/**
 * The song's takes, beside Record once it has any (ADR 0096): their sheet, the one way to them but
 * a take just kept, which opens it by itself. Named with how many there are.
 */
export function TakesButton({ className }: { className?: string }) {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const count = useTakes((state) => selectTakesOf(state, takes.pieceId).length)
  if (count === 0) return null
  return (
    <FloatingBarButton
      label={t('recorder.takes', { count })}
      className={className}
      onClick={() => takes.show(TAKES_PAGE)}
    >
      <ListMusic aria-hidden />
    </FloatingBarButton>
  )
}
