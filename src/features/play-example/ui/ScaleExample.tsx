import { Hand } from 'lucide-react'
import { useId, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useScaleName } from '@/shared/i18n'
import { noteFromParam, type NoteParam, type ScaleKind } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { runSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { PlayButton, SheetOption, type ShownKeys } from '@/shared/ui'
import { scaleExample } from '../model/scale-example'
import { TappableStaff } from './TappableStaff'

/** The tempo a lesson's scale runs at, in quarter notes. */
const RUN_TEMPO = 96

/**
 * A scale in a lesson: its name, its run up and back on one staff, and on its card its own options
 * (the fingers, the notes' names) and Play, which runs it on the page's keys, each key with its
 * degree and, where shown, its finger.
 */
export function ScaleExample({
  root,
  kind,
  onShow,
}: {
  root: NoteParam
  kind: ScaleKind
  onShow: (shown: ShownKeys) => void
}) {
  const { t } = useTranslation('music')
  const scaleName = useScaleName()
  const captionId = useId()
  const playback = usePlayback<'run'>()
  const [fingers, setFingers] = useState(true)
  const [names, setNames] = useState(false)
  const tonic = useMemo(() => noteFromParam(root), [root])
  const example = useMemo(() => scaleExample(tonic, kind, fingers), [tonic, kind, fingers])
  const score = useMemo(() => notate(example.music), [example])
  return (
    <figure aria-labelledby={captionId} className="flex flex-col gap-3 card p-4">
      <div className="flex items-center justify-between gap-3">
        <figcaption id={captionId} className="font-display text-xl font-semibold">
          {scaleName(tonic, kind)}
        </figcaption>
        <div className="flex items-center gap-1">
          <SheetOption
            icon={Hand}
            label={t('sheet.fingers')}
            pressed={fingers}
            onPressedChange={setFingers}
          />
          <SheetOption
            glyph="C E"
            label={t('sheet.noteNames')}
            pressed={names}
            onPressedChange={setNames}
          />
          <PlayButton
            label={t('play')}
            playing={playback.playing === 'run'}
            onClick={() => {
              onShow(example.shown)
              playback.toggle('run', () => runSounds(example.music, RUN_TEMPO))
            }}
          />
        </div>
      </div>
      <div className="-mx-gutter overflow-x-auto overscroll-x-contain px-gutter scrollbar-none">
        <TappableStaff
          music={example.music}
          score={score}
          staff="treble"
          fingers={fingers}
          names={names}
          tempo={RUN_TEMPO}
          follow={playback.playing === 'run' ? playback.handle : null}
          onShow={onShow}
        />
      </div>
    </figure>
  )
}
