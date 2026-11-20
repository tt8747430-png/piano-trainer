import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { Download, Play, Square } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isTakeId, selectTake, useTakes, useTakesStoreApi, type Take } from '@/entities/take'
import { deleteTake } from '@/features/manage-takes'
import {
  BackButton,
  ButtonLink,
  DangerGroup,
  DangerRow,
  NotFound,
  RoundButton,
  sayUndo,
  ScreenHeader,
} from '@/shared/ui'
import { useLocale, type Locale } from '@/shared/i18n'
import { Button } from '@/shared/ui/primitives/button'
import { TakeRoll } from '@/widgets/take-roll'
import { clockTime } from '../model/clock-time'
import { wholeTake, type KeptBars } from '../model/kept-bars'
import { useTakeDownload } from '../model/use-take-download'
import { useSongTitle } from '../model/use-song-title'
import { useTakePlay } from '../model/use-take-play'
import { KeepBars } from './KeepBars'
import { TakeNameField } from './TakeNameField'
import { formatLocale } from '@/shared/lib'

/** One formatter a language: the day a take was recorded, as its page says it ("9 November"). */
const days = new Map<Locale, Intl.DateTimeFormat>()
function dayFormat(locale: Locale): Intl.DateTimeFormat {
  const known = days.get(locale)
  if (known) return known
  const format = new Intl.DateTimeFormat(formatLocale(locale), { day: 'numeric', month: 'long' })
  days.set(locale, format)
  return format
}

/**
 * A take on its own page (ADR 0061), as the Take board draws it: "Take" in the bar with Download, the
 * page's own act; its name; Play, the page's honey circle, beside its length and tempo over its song
 * and the day it was recorded; the take as a piano roll across the page, its bars under it, each
 * playing from its bar; Keep bars under the music it trims; and Delete apart at the foot.
 */
function TakeView({ take }: { take: Take }) {
  const { t } = useTranslation(['editor', 'music', 'common'])
  const locale = useLocale()
  const song = useSongTitle(take.pieceId)
  const play = useTakePlay(take)
  const download = useTakeDownload(take)
  const store = useTakesStoreApi()
  const navigate = useNavigate()
  const [kept, setKept] = useState<KeptBars>(() => wholeTake(take))
  const playing = play.playing !== null
  const takes = {
    to: '/edit/$pieceId',
    params: { pieceId: take.pieceId },
    search: { takes: true },
  }
  // Back to the takes first: deleted while shown, the page would say it is not found.
  const remove = () =>
    void navigate({ ...takes, replace: true }).then(() => {
      const undo = deleteTake(store, take.id)
      sayUndo(t('recorder.deleted'), undo)
    })
  return (
    <div className="flex flex-col gap-2 pb-8 lg:gap-6">
      <ScreenHeader
        column="until-laptop"
        title={t('take.title')}
        back={<BackButton />}
        tools={<RoundButton label={t('recorder.download')} icon={Download} onClick={download} />}
      />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 lg:mx-0 lg:max-w-[73.75rem] lg:px-[calc(3.5rem-var(--gutter))]">
        <TakeNameField take={take} />
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            aria-label={playing ? t('common:stop') : t('take.play')}
            title={playing ? t('common:stop') : t('take.play')}
            aria-pressed={playing}
            onClick={() => (playing ? play.stop() : play.playFrom(0))}
            className="size-13 shrink-0 rounded-pill hover:brightness-95 [&_svg]:size-5 [&_svg]:fill-current"
          >
            {playing ? (
              <Square aria-hidden className="fill-current" />
            ) : (
              <Play aria-hidden className="fill-current" />
            )}
          </Button>
          <div className="flex min-w-0 flex-col">
            <p className="font-semibold tabular-nums">
              {t('recorder.detail', {
                length: clockTime(take.length),
                bpm: t('music:bpm', { tempo: take.tempo }),
              })}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {t('take.recorded', { song, day: dayFormat(locale).format(take.made) })}
            </p>
          </div>
        </div>
        <TakeRoll
          take={take}
          kept={kept}
          playing={play.playing}
          onPlayFrom={play.playFrom}
          bars
          className="h-30 lg:h-55"
        />
        <div className="flex w-full flex-col lg:max-w-140">
          <KeepBars take={take} kept={kept} onChange={setKept} />
          <DangerGroup>
            <DangerRow title={t('recorder.delete')} onClick={remove} />
          </DangerGroup>
        </div>
      </div>
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
