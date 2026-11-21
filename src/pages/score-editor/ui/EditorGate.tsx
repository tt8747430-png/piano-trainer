import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useUp } from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'
import { SCORE_SCREEN, ScoreBar } from '@/widgets/practice-player'

/**
 * Why the editor is not open yet (opening, offline, failed), as the EditorDraft boards' gates draw it:
 * the editor's own frame and bar, its Close where the open editor's stands, so there is always a way
 * out and nothing moves as the editor opens; the reason centred in the music's place.
 */
export function EditorGate({ children }: { children: ReactNode }) {
  const { t } = useTranslation('common')
  const up = useUp()
  return (
    <div className={SCORE_SCREEN}>
      <ScoreBar
        lead={
          <Button variant="bar" size="icon" aria-label={t('close')} title={t('close')} onClick={up}>
            <X aria-hidden />
          </Button>
        }
        actions={null}
      />
      <main data-area="work" className="flex flex-col justify-center pb-15">
        {children}
      </main>
    </div>
  )
}
