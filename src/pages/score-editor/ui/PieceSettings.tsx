import { Settings } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { PIECE_TEMPO } from '@/entities/piece'
import { draftFit } from '@/features/score-editor'
import { useLocale } from '@/shared/i18n'
import { keyFromParam, keyParam } from '@/shared/lib/music'
import { Dropdown, Fact, KeyDropdown, Sheet, SheetContent, SheetTrigger } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { piecePatterns } from '../model/piece-patterns'
import { SongTitleField } from './SongTitleField'

/** The piece's settings (spec §6.4): an own song's title, the key, the tempo and the pattern; the meter. */
export function PieceSettings() {
  const { t } = useTranslation('editor')
  const locale = useLocale()
  const { actions, meta } = useScoreEditorContext()
  const key = useEditorState((state) => state.draft.key)
  const saved = useEditorState((state) => state.draft.tempo)
  const pattern = useEditorState((state) => state.draft.pattern)
  const meter = useEditorState((state) => state.draft.meter)
  const fit = useEditorState(useShallow((state) => draftFit(state.draft)))
  const [tempo, setTempo] = useState(saved)
  return (
    <Sheet onOpenChange={(open) => (open ? setTempo(saved) : undefined)}>
      <SheetTrigger render={<Button variant="surface" size="icon" aria-label={t('settings')} />}>
        <Settings aria-hidden />
      </SheetTrigger>
      <SheetContent title={t('settings')}>
        <div className="flex flex-col gap-5 pt-2">
          {meta.kind === 'song' ? <SongTitleField /> : null}
          <KeyDropdown
            value={keyParam(key)}
            onChange={(key) => actions.dispatch({ type: 'settings', key: keyFromParam(key) })}
          />
          <Slider
            min={PIECE_TEMPO.min}
            max={PIECE_TEMPO.max}
            step={1}
            value={tempo}
            onValueChange={setTempo}
            onValueCommitted={(committed) =>
              actions.dispatch({ type: 'settings', tempo: committed })
            }
            className="flex flex-col gap-3"
          >
            <div className="flex justify-between">
              <SliderLabel>{t('song.tempo')}</SliderLabel>
              <span className="font-semibold tabular-nums">{t('song.bpm', { tempo })}</span>
            </div>
          </Slider>
          <Dropdown
            label={t('song.pattern')}
            value={pattern}
            groups={piecePatterns(fit, pattern, locale)}
            onChange={(pattern) => actions.dispatch({ type: 'settings', pattern })}
          />
          <dl>
            <Fact term={t('song.meter')}>{meter}</Fact>
          </dl>
        </div>
      </SheetContent>
    </Sheet>
  )
}
