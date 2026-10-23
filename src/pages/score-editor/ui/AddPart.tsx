import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { rowShown } from '@/features/score-editor'
import { INSTRUMENT_FAMILIES, instrumentsIn, type Instrument } from '@/shared/lib/music'
import { EXTRA_VOICES } from '@/shared/lib/notation'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/** One part to add: a 44px row that adds it and closes the menu. */
function PartRow({
  label,
  disabled = false,
  onSelect,
}: {
  label: string
  disabled?: boolean
  onSelect: () => void
}) {
  return (
    <Button variant="ghost" disabled={disabled} className="w-full justify-start" onClick={onSelect}>
      {label}
    </Button>
  )
}

/**
 * The Song sheet's Add a part (ADR 0072, 0080), as a notation app adds an instrument: the tune's
 * staff, the chord names' row, a lead sheet's piano (ADR 0083), or a voice sung with the tune on an instrument chosen by family (ADR
 * 0070). Chosen, the part is there and the sheet closes on it, the caret in it, ready to write.
 */
export function AddPart() {
  const { t } = useTranslation('editor')
  const { t: tm } = useTranslation('music')
  const { actions, view } = useScoreEditorContext()
  const [open, setOpen] = useState(false)
  const { melodyStaff, tuneShown, chordsShown, pianoShown, voices } = useEditorState(
    useShallow((state) => ({
      melodyStaff: state.draft.melodyStaff,
      tuneShown: rowShown(state.draft, 'melody'),
      chordsShown: rowShown(state.draft, 'chords'),
      pianoShown: rowShown(state.draft, 'piano'),
      voices: state.draft.voices.length,
    })),
  )
  const full = voices >= EXTRA_VOICES.length
  const add = (work: () => void) => () => {
    work()
    setOpen(false)
    view.openSettings(false)
  }
  const addVoice = (instrument: Instrument) =>
    add(() => {
      const voice = EXTRA_VOICES[voices]
      if (voice) actions.dispatch({ type: 'voiceStaff', voice, on: true, instrument })
    })
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant="soft" className="self-start" />}>
        <Plus data-icon="inline-start" aria-hidden />
        {t('song.addPart')}
      </PopoverTrigger>
      <PopoverContent
        aria-label={t('song.addPart')}
        align="start"
        className="max-h-[min(28rem,60dvh)] w-72 gap-1 overflow-y-auto overscroll-contain p-2"
      >
        <PartRow
          label={t('viewMenu.melody')}
          // Brings a hidden tune's staff back, or adds one; taking it away is its row's Remove.
          disabled={tuneShown}
          onSelect={add(() =>
            actions.dispatch(
              melodyStaff
                ? { type: 'hide', row: 'melody', hidden: false }
                : { type: 'melodyStaff', on: true },
            ),
          )}
        />
        <PartRow
          label={t('chordNames')}
          disabled={chordsShown}
          onSelect={add(() => {
            view.showChordNames(true)
            actions.dispatch({ type: 'layer', layer: 'chords' })
          })}
        />
        <PartRow
          label={t('staves.piano')}
          // Brings a lead sheet's piano back (ADR 0083); hiding it is its row's eye.
          disabled={pianoShown}
          onSelect={add(() => actions.dispatch({ type: 'hide', row: 'piano', hidden: false }))}
        />
        {INSTRUMENT_FAMILIES.map((family) => (
          <section
            key={family}
            aria-label={tm(`instrumentFamily.${family}`)}
            className="flex flex-col gap-1"
          >
            <h4 className="px-3 pt-2 text-xs font-semibold text-muted-foreground">
              {tm(`instrumentFamily.${family}`)}
            </h4>
            {instrumentsIn(family).map((instrument) => (
              <PartRow
                key={instrument}
                label={tm(`instrument.${instrument}`)}
                disabled={full}
                onSelect={addVoice(instrument)}
              />
            ))}
          </section>
        ))}
      </PopoverContent>
    </Popover>
  )
}
