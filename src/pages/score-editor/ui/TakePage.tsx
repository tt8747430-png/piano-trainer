import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { Play, Square } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isTakeId, selectTake, useTakes, useTakesStoreApi, type Take } from '@/entities/take'
import { deleteTake } from '@/features/manage-takes'
import { PageKeyboardTools, PinnedKeyboard } from '@/features/live-keyboard'
import {
  ActionRow,
  BackButton,
  ButtonLink,
  DangerGroup,
  DangerRow,
  NotFound,
  ScreenHeader,
  unmarked,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { TakeRoll } from '@/widgets/take-roll'
import { clockTime } from '../model/clock-time'
import { wholeTake, type KeptBars } from '../model/kept-bars'
import { useTakeDownload } from '../model/use-take-download'
import { useSongTitle } from '../model/use-song-title'
import { useTakePlay } from '../model/use-take-play'
import { useTakeTitle } from '../model/use-take-title'
import { DeleteTakeDialog } from './DeleteTakeDialog'
import { KeepBars } from './KeepBars'
import { TakeNameField } from './TakeNameField'

/**
 * A take on its own page (ADR 0061), as its board draws it: its name; Play, the page's honey circle,
 * beside its length, tempo and song; the take drawn as a piano roll that plays from a bar tapped; Keep
 * bars; then Download, and Delete alone in red. The keys go down on the keyboard as it plays.
 */
function TakeView({ take }: { take: Take }) {
  const { t } = useTranslation(['editor', 'music', 'common'])
  const title = useTakeTitle(take)
  const song = useSongTitle(take.pieceId)
  const play = useTakePlay(take)
  const download = useTakeDownload(take)
  const store = useTakesStoreApi()
  const navigate = useNavigate()
  const [kept, setKept] = useState<KeptBars>(() => wholeTake(take))
  const [deleting, setDeleting] = useState(false)
  const playing = play.playing !== null
  const takes = {
    to: '/edit/$pieceId',
    params: { pieceId: take.pieceId },
    search: { takes: true },
  }
  // Back to the takes first: deleted while shown, the page would say it is not found.
  const remove = () =>
    void navigate({ ...takes, replace: true }).then(() => deleteTake(store, take.id))
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={title} back={<BackButton />} tools={<PageKeyboardTools />} />
      <PinnedKeyboard shown={unmarked(take.notes.map((note) => note.midi))} />
      <TakeNameField take={take} />
      <div className="flex items-center gap-3">
        <Button
          size="icon"
          aria-label={playing ? t('common:stop') : t('take.play')}
          title={playing ? t('common:stop') : t('take.play')}
          aria-pressed={playing}
          onClick={() => (playing ? play.stop() : play.playFrom(0))}
          className="size-12 shrink-0 rounded-pill hover:brightness-95 [&_svg]:size-5 [&_svg]:fill-current"
        >
          {playing ? <Square aria-hidden /> : <Play aria-hidden />}
        </Button>
        <div className="flex min-w-0 flex-col">
          <p className="text-lg font-semibold tabular-nums">
            {t('recorder.detail', {
              length: clockTime(take.length),
              bpm: t('music:bpm', { tempo: take.tempo }),
            })}
          </p>
          <p className="truncate text-muted-foreground">{song}</p>
        </div>
      </div>
      <TakeRoll take={take} kept={kept} playing={play.playing} onPlayFrom={play.playFrom} />
      <KeepBars take={take} kept={kept} onChange={setKept} />
      <div className="flex flex-col overflow-hidden card">
        <ActionRow title={t('recorder.download')} onClick={download} />
      </div>
      <DangerGroup>
        <DangerRow title={t('recorder.delete')} onClick={() => setDeleting(true)} />
      </DangerGroup>
      <DeleteTakeDialog take={take} open={deleting} onOpenChange={setDeleting} onDelete={remove} />
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
        render={<Link to="/edit/$pieceId" params={{ pieceId }} search={{ takes: true }} />}
      >
        {t('notFound.toTakes')}
      </ButtonLink>
    </NotFound>
  )
}
