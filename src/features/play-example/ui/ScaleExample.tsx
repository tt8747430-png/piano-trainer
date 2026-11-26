import { useId, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ExampleKeys } from '@/features/live-keyboard'
import { useScaleName } from '@/shared/i18n'
import { noteFromParam, type NoteParam, type ScaleKind } from '@/shared/lib/music'
import { runSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { PlayButton } from '@/shared/ui'
import { scaleExample } from '../model/scale-example'

/** The tempo a lesson's scale runs at, in quarter notes. */
const RUN_TEMPO = 96

/**
 * A scale in a lesson (the Lesson boards' example): its name 17 bold on a 44 row with Play at its
 * end, and its own keys under it, each note named and the tonic in its own colour, as the Scales
 * page draws a scale. Play runs it up and back.
 */
export function ScaleExample({ root, kind }: { root: NoteParam; kind: ScaleKind }) {
  const { t } = useTranslation('music')
  const scaleName = useScaleName()
  const captionId = useId()
  const playback = usePlayback<'run'>()
  const tonic = useMemo(() => noteFromParam(root), [root])
  const example = useMemo(() => scaleExample(tonic, kind), [tonic, kind])
  return (
    <figure aria-labelledby={captionId} className="mt-2 flex flex-col gap-1">
      <div className="flex min-h-11 items-center justify-between gap-2">
        <figcaption id={captionId} className="font-sans text-lg font-bold">
          {scaleName(tonic, kind)}
        </figcaption>
        <PlayButton
          label={t('play')}
          playing={playback.playing === 'run'}
          onClick={() => playback.toggle('run', () => runSounds(example.music, RUN_TEMPO))}
        />
      </div>
      <ExampleKeys shown={example.shown} />
    </figure>
  )
}
