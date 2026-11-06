import { useTranslation } from 'react-i18next'
import { selectScoreView, useSettings } from '@/entities/settings'
import type { Draft } from '@/features/score-editor'
import { ScoreSheet, type EditPrinted } from '@/widgets/score-sheet'

/** What a sheet only shown prints as it is: its printed things are no buttons to open. */
const shownAsPrinted: EditPrinted = (_printed, trigger) => trigger
const NO_TITLE = () => null
const NOTHING = () => undefined
const NO_TICKS = () => [] as const
/** The preview's height in CSS px: its line drawn small enough to read whole in the popover. */
const PREVIEW_ROOM = 150

/**
 * Transpose's Preview (ADR 0115, R31-P), the Player's and the editor's: the first line in the key it
 * lands in, only shown (no caret, nothing to click), in one line across, under its heading.
 */
export function PreviewLine({ draft }: { draft: Draft }) {
  const { t } = useTranslation('editor')
  const shown = useSettings(selectScoreView)
  return (
    <section aria-label={t('transpose.preview')} className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-muted-foreground">{t('transpose.preview')}</h3>
      <div className="max-w-full overflow-x-auto overscroll-x-contain rounded-control border border-border bg-background p-2">
        <div inert className="pointer-events-none">
          <ScoreSheet
            draft={draft}
            caret={null}
            layer="chords"
            selection={null}
            onPlace={NOTHING}
            onReach={NOTHING}
            onDeselect={NOTHING}
            placesOf={NO_TICKS}
            tapsOf={NO_TICKS}
            chordNames={shown.chordNames}
            lyrics={shown.lyrics}
            edit={shownAsPrinted}
            view="panorama"
            room={PREVIEW_ROOM}
            title={NO_TITLE}
          />
        </div>
      </div>
    </section>
  )
}
