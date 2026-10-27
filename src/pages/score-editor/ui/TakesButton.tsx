import { ListMusic } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectTakesOf, useTakes } from '@/entities/take'
import { cn } from '@/shared/lib'
import { FloatingBarButton } from '@/shared/ui'
import { useScoreEditorContext } from '../model/editor-context'
import { TAKES_PAGE } from '../model/use-editor-takes'

/**
 * The song's takes, beside Record (ADR 0096, 0115): their sheet, the one way to them but a take just
 * kept, which opens it by itself. Named with how many there are; greyed until there is one, its
 * tooltip saying why, so the transport keeps its seven in their places.
 */
export function TakesButton({ className }: { className?: string }) {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const count = useTakes((state) => selectTakesOf(state, takes.pieceId).length)
  const none = count === 0
  const label = t('recorder.takes', { count })
  return (
    <FloatingBarButton
      label={label}
      title={none ? `${label} · ${t('recorder.noTakes')}` : undefined}
      aria-disabled={none ? true : undefined}
      className={cn(className, 'aria-disabled:opacity-50')}
      onClick={none ? undefined : () => takes.show(TAKES_PAGE)}
    >
      <ListMusic aria-hidden />
    </FloatingBarButton>
  )
}
