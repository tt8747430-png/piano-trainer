import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { Download, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isTakeId, selectTake, useTakes, useTakesStoreApi, type Take } from '@/entities/take'
import { deleteTake } from '@/features/manage-takes'
import { PinnedKeyboard } from '@/features/live-keyboard'
import {
  BackButton,
  ButtonLink,
  FloatingActions,
  NotFound,
  PlayFab,
  ScreenHeader,
  SpeedDial,
  SpeedDialAction,
  unmarked,
} from '@/shared/ui'
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
 * A take on its own page (spec 2026-10-09 §4.3, ADR 0061): its song, its length and tempo, its name, the take
 * drawn as a piano roll that plays from a bar tapped, and Keep bars; Play floats, Download and Delete
 * in the dial beside it; the keys go down on the keyboard as it plays.
 */
function TakeView({ take }: { take: Take }) {
  const { t } = useTranslation(['editor', 'music'])
  const title = useTakeTitle(take)
  const song = useSongTitle(take.pieceId)
  const play = useTakePlay(take)
  const download = useTakeDownload(take)
  const store = useTakesStoreApi()
  const navigate = useNavigate()
  const [kept, setKept] = useState<KeptBars>(() => wholeTake(take))
  const [deleting, setDeleting] = useState(false)
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
      <ScreenHeader title={title} back={<BackButton fallback={takes} />} />
      <PinnedKeyboard shown={unmarked(take.notes.map((note) => note.midi))} />
      <div className="-mt-3 flex flex-col gap-1">
        <p className="text-lg font-semibold">{song}</p>
        <p className="text-muted-foreground tabular-nums">
          {t('recorder.detail', {
            length: clockTime(take.length),
            bpm: t('music:bpm', { tempo: take.tempo }),
          })}
        </p>
      </div>
      <TakeNameField take={take} />
      <TakeRoll take={take} kept={kept} playing={play.playing} onPlayFrom={play.playFrom} />
      <KeepBars take={take} kept={kept} onChange={setKept} />
      <FloatingActions>
        <SpeedDial>
          <SpeedDialAction label={t('recorder.download')} icon={Download} onClick={download} />
          <SpeedDialAction
            label={t('recorder.delete')}
            icon={Trash2}
            onClick={() => setDeleting(true)}
          />
        </SpeedDial>
        <PlayFab
          label={t('take.play')}
          playing={play.playing !== null}
          onClick={() => (play.playing ? play.stop() : play.playFrom(0))}
        />
      </FloatingActions>
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
