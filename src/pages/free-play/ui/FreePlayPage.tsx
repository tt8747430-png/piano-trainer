import { useSearch } from '@tanstack/react-router'
import { Eraser } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { useViewChange, type DiagramMarks } from '@/shared/lib'
import { midi, type Midi } from '@/shared/lib/music'
import {
  BackButton,
  KeyChoice,
  Labelled,
  NO_KEYS,
  ScreenHeader,
  Segmented,
  type KeyMark,
  type ShownKeys,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { LiveScore } from '@/widgets/live-score'
import { FREE_PLAY_MODES, type FreePlayView } from '../model/free-play-view'
import { useFreePlay } from '../model/use-free-play'
import { MarkTools } from './MarkTools'

/** The keyboard at its widest: C2–C7. */
const WIDEST = { from: midi(36), to: midi(96) }

/** A diagram on the keys: each key in its hand's tone, its hand's letter on it, its finger under it. */
function diagramShown(marks: DiagramMarks, letter: (colour: 'a' | 'b') => string): ShownKeys {
  const shown = new Map<Midi, KeyMark>()
  for (const [key, { colour, finger }] of marks)
    shown.set(key, {
      tone: colour === 'a' ? 'rh' : 'lh',
      label: letter(colour),
      ...(finger === undefined ? {} : { finger }),
    })
  return { keys: [...marks.keys()], marks: shown }
}

/**
 * Free play (spec 2026-10-09 §5): the piano played freely, the keyboard at its widest and the live
 * score over it. Play writes and names each chord played; Mark makes a teaching diagram, each key
 * tapped taking the colour and finger chosen, kept in the URL as a link to send. Clear starts again.
 */
export function FreePlayPage() {
  const { t } = useTranslation('practice')
  const view = useSearch({ from: '/shell/practice/free-play' })
  const change = useViewChange<FreePlayView>()
  const free = useFreePlay(view)
  const marking = view.mode === 'mark'
  const shown = useMemo(
    () =>
      marking
        ? diagramShown(free.marks, (colour) => t(`freePlay.colour.${colour}Letter`))
        : NO_KEYS,
    [marking, free.marks, t],
  )
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('freePlay.title')}
        back={<BackButton fallback={{ to: '/practice' }} />}
      />
      <ExplorerKeyboard shown={shown} range={WIDEST} onKeyPress={free.press} />
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
        <Labelled label={t('freePlay.mode')}>
          <Segmented
            label={t('freePlay.mode')}
            value={view.mode}
            options={FREE_PLAY_MODES.map((mode) => ({ value: mode, label: t(`freePlay.${mode}`) }))}
            onChange={(mode) => change({ mode })}
          />
        </Labelled>
        <KeyChoice value={view.key} onChange={(key) => change({ key })} />
        <Button variant="outline" onClick={free.clear}>
          <Eraser data-icon="inline-start" />
          {t('freePlay.clear')}
        </Button>
      </div>
      {marking ? (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <MarkTools
            colour={free.mark.colour}
            finger={free.mark.finger ?? null}
            onColour={free.setColour}
            onFinger={free.setFinger}
          />
        </div>
      ) : null}
      <LiveScore chords={free.chords} keyParam={view.key} />
    </div>
  )
}
