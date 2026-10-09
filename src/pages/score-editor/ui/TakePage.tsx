import { Link, useParams } from '@tanstack/react-router'
import { Play } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isTakeId, selectTake, useTakes, type Take } from '@/entities/take'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { BackButton, ButtonLink, NotFound, PlayLabel, ScreenHeader, unmarked } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { TakeRoll } from '@/widgets/take-roll'
import { clockTime } from '../model/clock-time'
import { wholeTake, type KeptBars } from '../model/kept-bars'
import { useTakePlay } from '../model/use-take-play'
import { useTakeTitle } from '../model/use-take-title'
import { KeepBars } from './KeepBars'
import { TakeNameField } from './TakeNameField'

/**
 * A take on its own page (spec 2026-10-09 §4.3): its name, the take drawn as a piano roll that plays
 * from a bar tapped, Play, and Keep bars; the keys go down on the keyboard as it plays.
 */
function TakeView({ take }: { take: Take }) {
  const { t } = useTranslation('editor')
  const title = useTakeTitle(take)
  const play = useTakePlay(take)
  const [kept, setKept] = useState<KeptBars>(() => wholeTake(take))
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={title}
        back={
          <BackButton
            fallback={{
              to: '/edit/$pieceId',
              params: { pieceId: take.pieceId },
              search: { record: true },
            }}
          />
        }
      />
      <ExplorerKeyboard shown={unmarked(take.notes.map((note) => note.midi))} />
      <TakeNameField take={take} />
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="soft" onClick={() => (play.playing ? play.stop() : play.playFrom(0))}>
            <PlayLabel playing={play.playing !== null}>
              <Play data-icon="inline-start" />
              {t('take.play')}
            </PlayLabel>
          </Button>
          <span className="text-muted-foreground tabular-nums">
            {t('recorder.detail', { length: clockTime(take.length), tempo: take.tempo })}
          </span>
        </div>
        <TakeRoll take={take} kept={kept} playing={play.playing} onPlayFrom={play.playFrom} />
      </section>
      <KeepBars take={take} kept={kept} onChange={setKept} />
    </div>
  )
}

/** A take's page: the route's take, gone once deleted in another tab. */
export function TakePage() {
  const { t } = useTranslation('common')
  const { pieceId, takeId } = useParams({ from: '/shell/edit/$pieceId/takes/$takeId' })
  const take = useTakes((state) => (isTakeId(takeId) ? selectTake(state, takeId) : undefined))
  return take ? (
    <TakeView key={take.id} take={take} />
  ) : (
    <NotFound>
      <ButtonLink
        render={<Link to="/edit/$pieceId" params={{ pieceId }} search={{ record: true }} />}
      >
        {t('notFound.toTakes')}
      </ButtonLink>
    </NotFound>
  )
}
