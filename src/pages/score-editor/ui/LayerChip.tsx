import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isVoiceLayer, shownRows, type Layer } from '@/features/score-editor'
import { cn } from '@/shared/lib'
import { Listbox } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/** Each staff's sign, as its staff begins: the chord names' letter, a tune's note, the hands' clefs. */
const SIGNS: Readonly<Record<Exclude<Layer, `voice${number}`>, string>> = {
  chords: 'C',
  melody: '\u{1D160}',
  rh: '\u{1D11E}',
  lh: '\u{1D122}',
}

/** A staff's sign: a more voice's note with its number. */
function StaffSign({ layer }: { layer: Layer }) {
  const voice = isVoiceLayer(layer)
  const sign = voice ? SIGNS.melody : SIGNS[layer]
  return (
    <span
      aria-hidden
      className={cn(
        'relative grid size-6 shrink-0 place-items-center leading-none',
        layer === 'chords' ? 'font-serif text-base font-bold' : 'font-music text-2xl',
      )}
    >
      {sign}
      {voice ? (
        <span className="absolute -right-1 -bottom-0.5 font-sans text-[0.6rem] font-bold">
          {layer.slice(-1)}
        </span>
      ) : null}
    </span>
  )
}

/**
 * The layer chip at the edit row's head (Flat's voice badge): where the next note goes, the chord
 * names, the tune, a more voice or a hand, in the caret's colour with its staff's sign; tapped, the
 * staves in sight top down, to write in another (as a click on its staff or Alt ↑ ↓ does). Its sign
 * alone but on a wide screen: the caret's line beside the title names it.
 */
export function LayerChip() {
  const { t } = useTranslation('editor')
  const { actions, takes } = useScoreEditorContext()
  const layer = useEditorState((state) => state.layer)
  const draft = useEditorState((state) => state.draft)
  const [open, setOpen] = useState(false)
  const name = t(`layers.${layer}`)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            aria-label={t('layerChip.label', { layer: name })}
            title={t('layerChip.menu')}
            disabled={takes.stage !== 'idle'}
            className="h-11 shrink-0 gap-1 rounded-full bg-secondary px-2.5 text-foreground ring-1 ring-ring/40 hover:bg-secondary/80 max-lg:w-11 max-lg:px-0"
          />
        }
      >
        <StaffSign layer={layer} />
        <span className="text-sm font-semibold max-2xl:sr-only">{name}</span>
        <ChevronDown aria-hidden className="size-4 opacity-60 max-lg:hidden" />
      </PopoverTrigger>
      <PopoverContent aria-label={t('layerChip.menu')} align="start" className="w-64 p-2">
        <Listbox
          label={t('layerChip.menu')}
          optionClassName="min-h-11 rounded-lg px-2 text-base"
          groups={[
            {
              options: shownRows(draft).map((row) => ({
                key: row,
                selected: row === layer,
                content: (
                  <span className="flex items-center gap-2">
                    <StaffSign layer={row} />
                    {t(`layers.${row}`)}
                  </span>
                ),
                onChoose: () => {
                  actions.dispatch({ type: 'layer', layer: row })
                  setOpen(false)
                },
              })),
            },
          ]}
        />
      </PopoverContent>
    </Popover>
  )
}
