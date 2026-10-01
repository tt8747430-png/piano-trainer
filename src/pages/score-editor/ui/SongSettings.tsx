import { Settings } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BUILT_IN_PATTERNS,
  PATTERN_GROUP_NAMES,
  PATTERN_GROUPS,
  PATTERN_IDS,
  patternNeed,
} from '@/entities/pattern'
import { PIECE_TEMPO } from '@/entities/piece'
import type { Draft } from '@/features/score-editor'
import { localText, useLocale } from '@/shared/i18n'
import { isCompound, keyFromParam, keyParam } from '@/shared/lib/music'
import { Dropdown, Fact, KeyDropdown, Sheet, SheetContent, SheetTrigger } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { SongTitleField } from './SongTitleField'

/** The built-in patterns the draft's music can play, by group. */
function playable(draft: Draft, locale: 'en' | 'ru') {
  const fit = {
    melody: draft.melody.length > 0,
    key: true,
    simpleTime: !isCompound(draft.meter),
    methodCodes: draft.sections.some((section) =>
      section.lines.some((line) => line.some((bar) => bar.chords.some((chord) => chord.method))),
    ),
  }
  return PATTERN_GROUPS.map((group) => ({
    label: localText(PATTERN_GROUP_NAMES[group], locale),
    options: PATTERN_IDS.flatMap((id) => {
      const entry = BUILT_IN_PATTERNS.get(id)
      return entry && entry.group === group && patternNeed(entry, fit) === null
        ? [{ value: id, label: localText(entry.name, locale) }]
        : []
    }),
  })).filter((group) => group.options.length > 0)
}

/** The song's settings (spec §6.4): an own song's title, the key, the tempo and the pattern; the meter. */
export function SongSettings() {
  const { t } = useTranslation('editor')
  const locale = useLocale()
  const { actions, meta } = useScoreEditorContext()
  const draft = useEditorState((state) => state.draft)
  const [tempo, setTempo] = useState(draft.tempo)
  return (
    <Sheet onOpenChange={(open) => (open ? setTempo(draft.tempo) : undefined)}>
      <SheetTrigger render={<Button variant="surface" size="icon" aria-label={t('settings')} />}>
        <Settings aria-hidden />
      </SheetTrigger>
      <SheetContent title={t('settings')}>
        <div className="flex flex-col gap-5 pt-2">
          {meta.kind === 'song' ? <SongTitleField /> : null}
          <KeyDropdown
            value={keyParam(draft.key)}
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
            value={draft.pattern}
            groups={playable(draft, locale)}
            onChange={(pattern) => actions.dispatch({ type: 'settings', pattern })}
          />
          <dl>
            <Fact term={t('song.meter')}>{draft.meter}</Fact>
          </dl>
        </div>
      </SheetContent>
    </Sheet>
  )
}
