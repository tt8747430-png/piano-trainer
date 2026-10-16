import { useId, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useScaleName } from '@/shared/i18n'
import { noteFromParam, type NoteParam, type ScaleKind } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { runSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { PlayLabel, type ShownKeys } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { scaleExample } from '../model/scale-example'
import { TappableStaff } from './TappableStaff'

/** The tempo a lesson's scale runs at, in quarter notes. */
const RUN_TEMPO = 96

/**
 * A scale in a lesson: its name, its notes with their degrees, its run up and back on one staff, and
 * Play, which runs it on the page's keys.
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
  const tonic = useMemo(() => noteFromParam(root), [root])
  const example = useMemo(() => scaleExample(tonic, kind), [tonic, kind])
  const score = useMemo(() => notate(example.music), [example])
  return (
    <figure aria-labelledby={captionId} className="flex flex-col gap-3 card p-4">
      <figcaption id={captionId} className="font-display text-xl font-semibold">
        {scaleName(tonic, kind)}
      </figcaption>
      <div className="-mx-gutter overflow-x-auto overscroll-x-contain px-gutter scrollbar-none">
        <TappableStaff
          music={example.music}
          score={score}
          staff="treble"
          tempo={RUN_TEMPO}
          follow={playback.playing === 'run' ? playback.handle : null}
          onShow={onShow}
        />
      </div>
      <Button
        variant="soft"
        className="self-start"
        onClick={() => {
          onShow(example.shown)
          playback.toggle('run', () => runSounds(example.music, RUN_TEMPO))
        }}
      >
        <PlayLabel playing={playback.playing === 'run'}>{t('play')}</PlayLabel>
      </Button>
    </figure>
  )
}
