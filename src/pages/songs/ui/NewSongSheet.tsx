import { useNavigate } from '@tanstack/react-router'
import { ChevronLeft, Mic, Pencil } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { libraryCatalog, useLibraryStoreApi, type FolderId } from '@/entities/library'
import { TITLE_MAX, usePiecesStoreApi, type SongCollectionId } from '@/entities/piece'
import {
  isScoreStaves,
  makeSong,
  PIANO_ONLY,
  START_BARS,
  START_TEMPO,
  useCreateBuiltInSong,
  VOICE_IDS,
  VOICES,
  type ScoreStaves,
  type VoiceId,
} from '@/features/edit-piece'
import { moveTo } from '@/features/manage-library'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import {
  beatUnit,
  C_MAJOR,
  METER_UNITS,
  meterParts,
  tempoUnitsFor,
  unitNote,
  type Key,
  type Meter,
  type MeterUnit,
  type TempoUnit,
} from '@/shared/lib/music'
import {
  Dropdown,
  NameField,
  SearchField,
  Sheet,
  SheetContent,
  SheetPart,
  Stepper,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { KeySignaturePicker } from '@/shared/ui/pickers/KeySignaturePicker'
import { InstrumentList } from '@/widgets/instrument-list'

/** The steps of New song, Flat's: its name, its instruments, then its setup fine-tuned. */
const STEPS = [1, 2, 3] as const
type Step = (typeof STEPS)[number]

/** The time signatures offered at once (Flat's): the common ones, common and cut time as signs. */
const TIMES = [
  { meter: '2/4', symbol: false },
  { meter: '3/4', symbol: false },
  { meter: '4/4', symbol: false },
  { meter: '4/4', symbol: true },
  { meter: '2/2', symbol: true },
  { meter: '6/8', symbol: false },
] as const satisfies readonly { meter: Meter; symbol: boolean }[]

/** An instrument New song lists (round 27): the piano, or a voice, a staff named for it. */
type Instrument = 'piano' | VoiceId

/** The instruments by family, as Flat lists them; others wait for their own sounds (ADR 0097). */
const FAMILIES = [
  { family: 'vocals', instruments: VOICE_IDS },
  { family: 'keyboards', instruments: ['piano'] },
] as const satisfies readonly { family: string; instruments: readonly Instrument[] }[]

/**
 * How many of an instrument the score has, and the score with one fewer or one more: a piano at
 * most, voices stacked as a choir is (`chartStart` orders them).
 */
function counted(staves: ScoreStaves, instrument: Instrument) {
  if (instrument === 'piano') {
    const now = Number(staves.piano)
    return {
      now,
      fewer: { ...staves, piano: false },
      more: now === 1 ? null : { ...staves, piano: true },
    }
  }
  const now = staves.voices.filter((each) => each === instrument).length
  const at = staves.voices.lastIndexOf(instrument)
  return {
    now,
    fewer: { ...staves, voices: staves.voices.filter((_, index) => index !== at) },
    more: { ...staves, voices: [...staves.voices, instrument] },
  }
}

/**
 * New song, as Flat's new score (round 27), in three steps, their dots under the title (a screen
 * reader's step count), Back on the later two:
 *
 * 1. its name, and Next;
 * 2. its instruments by family (Vocals: Voice, Soprano, Alto, Tenor, Baritone, Bass; Keyboards:
 *    Piano), each added with + and counted with − n +, found by Search; how many are chosen beside
 *    Next. A voice is a staff named for it in its clef over the piano; without the piano, one voice
 *    alone is a lead sheet, a change no score can be greyed;
 * 3. Fine-tune your setup: the tempo (the note it counts, the number typed or stepped), how many bars
 *    (typed or stepped), the key signature from the grid the score editor's key picker is, the time
 *    signature from the common ones, common and cut time as their signs, or your own; Create song,
 *    which opens it in the score editor (`record`: Record pressed there, the + menu's Record).
 *
 * No line explains what Flat's own screens leave unsaid. It is made where the learner is (ADR 0106): in
 * the folder open (`folder`), else at Home, last. An editor's New built-in song (`builtIn`, content as
 * data) is made on the server in that collection, unpublished, and opens in the original's editor.
 */
export function NewSongSheet({
  open,
  onOpenChange,
  folder,
  builtIn,
  record = false,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  folder: FolderId | null
  /** An editor's new built-in song in this collection, in place of the learner's own. */
  builtIn?: SongCollectionId | undefined
  /** Made to be played in: the score editor opens with Record pressed. */
  record?: boolean
}) {
  const { t } = useTranslation(['songs', 'editor'])
  const locale = useLocale()
  const store = usePiecesStoreApi()
  const library = useLibraryStoreApi()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(1)
  const [title, setTitle] = useState('')
  const [staves, setStaves] = useState<ScoreStaves>(PIANO_ONLY)
  const [search, setSearch] = useState('')
  const [tempo, setTempo] = useState(START_TEMPO)
  const [tempoUnit, setTempoUnit] = useState<TempoUnit>('4')
  const [bars, setBars] = useState(START_BARS)
  const [key, setKey] = useState<Key>(C_MAJOR)
  const [meter, setMeter] = useState<Meter>('4/4')
  const [timeSymbol, setTimeSymbol] = useState(false)
  const [ownTime, setOwnTime] = useState(false)
  const [making, setMaking] = useState(false)
  const [failed, setFailed] = useState(false)
  const createBuiltIn = useCreateBuiltInSong()
  const named = title.trim() !== ''
  // The note the tempo counts, kept to those the time signature's beat allows.
  const units = tempoUnitsFor(meter)
  const unit = units.includes(tempoUnit) ? tempoUnit : beatUnit(meter)
  const start = { staves, tempo, tempoUnit: unit, bars, timeSymbol }
  const chosen = Number(staves.piano) + staves.voices.length
  const nameOf = (instrument: Instrument) =>
    instrument === 'piano' ? t('setup.piano') : localText(VOICES[instrument].name, locale)
  const found = search.trim().toLocaleLowerCase(locale)
  const families = FAMILIES.map(({ family, instruments }) => ({
    family,
    instruments: (instruments as readonly Instrument[]).filter((each) =>
      nameOf(each).toLocaleLowerCase(locale).includes(found),
    ),
  })).filter((each) => each.instruments.length > 0)
  /** Makes the built-in song on the server, unpublished, and opens its original in the score editor. */
  const makeBuiltIn = async (collection: SongCollectionId) => {
    setMaking(true)
    setFailed(false)
    const made = await createBuiltIn({ title, key, meter, collection, ...start })
    setMaking(false)
    if (!made.ok) return setFailed(true)
    await navigate({
      to: '/edit/$pieceId',
      params: { pieceId: made.value },
    })
  }
  /** Makes the song and opens it in the score editor, Record pressed where it was made to record. */
  const make = () => {
    const id = makeSong(store, { title, key, meter, ...start })
    if (!id) return
    if (folder)
      moveTo(
        library,
        libraryCatalog({ ownSongs: store.getState().songs }),
        { songs: [id], folders: [] },
        folder,
      )
    void navigate({ to: '/edit/$pieceId', params: { pieceId: id }, search: { record } })
  }
  const create = () => (builtIn ? void makeBuiltIn(builtIn) : make())
  const onward = () => {
    if (!named) return
    if (step === 1) setStep(2)
    else if (step === 2) {
      if (isScoreStaves(staves)) setStep(3)
    } else if (!making) create()
  }
  const back =
    step > 1 ? (
      <Button size="lg" variant="outline" onClick={() => setStep(step === 3 ? 2 : 1)}>
        <ChevronLeft data-icon="inline-start" aria-hidden />
        {t('setup.back')}
      </Button>
    ) : null
  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) setStep(1)
      }}
    >
      <SheetContent
        title={
          step === 1 || !named
            ? t(record && !builtIn ? 'making.recordTitle' : 'making.title')
            : title.trim()
        }
        tall={step > 1}
        footer={
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {back}
              {step === 2 ? (
                <span className="min-w-0 flex-1 px-1 text-sm font-semibold">
                  {t('setup.selected', { count: chosen })}
                </span>
              ) : null}
              {step === 3 ? (
                <Button size="lg" className="flex-1" disabled={!named || making} onClick={create}>
                  {record ? <Mic data-icon="inline-start" aria-hidden /> : null}
                  {making
                    ? t('making.making')
                    : t(record ? 'making.createAndRecord' : 'making.create')}
                </Button>
              ) : (
                <Button
                  size="lg"
                  className={step === 1 ? 'flex-1' : 'min-w-28'}
                  disabled={!named || (step === 2 && !isScoreStaves(staves))}
                  onClick={onward}
                >
                  {t('setup.next')}
                </Button>
              )}
            </div>
            {failed ? (
              <p role="alert" className="text-sm text-destructive">
                {t('making.failed')}
              </p>
            ) : null}
          </div>
        }
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            onward()
          }}
        >
          {/* The three steps as bars, those reached in ink (Flat's). */}
          <div role="img" aria-label={t('setup.step', { at: step })} className="-mt-2 flex gap-1.5">
            {STEPS.map((at) => (
              <span
                key={at}
                className={cn(
                  'h-1.5 w-6 rounded-pill transition-colors duration-200',
                  at <= step ? 'bg-foreground' : 'bg-border',
                )}
              />
            ))}
          </div>
          {step === 1 ? (
            <>
              <NameField
                label={t('making.name')}
                value={title}
                maxLength={TITLE_MAX}
                onChange={(event) => setTitle(event.target.value)}
              />
            </>
          ) : step === 2 ? (
            <>
              <SearchField label={t('setup.search')} value={search} onChange={setSearch} />
              {families.length === 0 ? (
                <p className="px-1 text-muted-foreground">{t('setup.noMatch')}</p>
              ) : (
                <InstrumentList
                  families={families.map(({ family, instruments }) => ({
                    key: family,
                    title: t(`setup.families.${family}`),
                    rows: instruments.map((instrument) => {
                      const { now, fewer, more } = counted(staves, instrument)
                      return {
                        key: instrument,
                        name: nameOf(instrument),
                        count: now,
                        onFewer: isScoreStaves(fewer) ? () => setStaves(fewer) : undefined,
                        onMore: more && isScoreStaves(more) ? () => setStaves(more) : undefined,
                      }
                    }),
                  }))}
                />
              )}
            </>
          ) : (
            <>
              <div className="flex flex-col">
                <h3 className="font-sans font-semibold">{t('setup.fineTune')}</h3>
                <p className="text-sm text-muted-foreground">{t('setup.fineTuneDetail')}</p>
              </div>
              <SheetPart title={t('setup.tempo')}>
                <div className="flex items-center gap-2">
                  <Dropdown
                    bare
                    label={t('setup.tempoUnit')}
                    value={unit}
                    options={units.map((each) => ({
                      value: each,
                      label: t(`editor:tempo.units.${each}`),
                    }))}
                    face={(each) => (
                      <span className="font-music text-2xl leading-none">{unitNote(each)}</span>
                    )}
                    onChange={setTempoUnit}
                    className="h-11 w-20 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <Stepper
                      label={t('setup.tempo')}
                      typed
                      value={tempo}
                      min={20}
                      max={400}
                      format={(value) => t('setup.tempoValue', { tempo: value })}
                      onChange={setTempo}
                      decrease={t('setup.slower')}
                      increase={t('setup.faster')}
                    />
                  </div>
                </div>
              </SheetPart>
              <SheetPart title={t('setup.bars')}>
                <Stepper
                  label={t('setup.bars')}
                  typed
                  value={bars}
                  min={1}
                  max={200}
                  format={(count) => t('setup.barsValue', { count })}
                  onChange={setBars}
                  decrease={t('setup.fewerBars')}
                  increase={t('setup.moreBars')}
                />
              </SheetPart>
              <SheetPart title={t('making.key')} detail={t('making.keyDetail')}>
                <KeySignaturePicker value={key} onChange={setKey} />
              </SheetPart>
              <SheetPart title={t('making.meter')} detail={t('setup.meterDetail')}>
                <div
                  role="group"
                  aria-label={t('making.meter')}
                  className="grid grid-cols-7 overflow-hidden rounded-control border border-border bg-card"
                >
                  {TIMES.map((each) => {
                    const pressed = !ownTime && meter === each.meter && timeSymbol === each.symbol
                    const { count, unit: beat } = meterParts(each.meter)
                    const name = each.symbol
                      ? t(each.meter === '4/4' ? 'setup.common' : 'setup.cut')
                      : each.meter
                    return (
                      <button
                        key={`${each.meter}${each.symbol ? 's' : ''}`}
                        type="button"
                        aria-pressed={pressed}
                        aria-label={name}
                        title={name}
                        onClick={() => {
                          setOwnTime(false)
                          setMeter(each.meter)
                          setTimeSymbol(each.symbol)
                        }}
                        className={cn(
                          'grid min-h-14 place-items-center border-r border-border font-display text-lg leading-none font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset',
                          pressed && 'bg-chosen text-foreground',
                        )}
                      >
                        {each.symbol ? (
                          <span aria-hidden className="font-music text-3xl leading-none">
                            {each.meter === '4/4' ? '\u{1D134}' : '\u{1D135}'}
                          </span>
                        ) : (
                          <span aria-hidden className="flex flex-col items-center">
                            <span>{count}</span>
                            <span>{beat}</span>
                          </span>
                        )}
                      </button>
                    )
                  })}
                  <button
                    type="button"
                    aria-pressed={ownTime}
                    aria-label={t('setup.customize')}
                    title={t('setup.customize')}
                    onClick={() => {
                      setOwnTime(true)
                      setTimeSymbol(false)
                    }}
                    className={cn(
                      'grid min-h-14 place-items-center text-muted-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset',
                      ownTime && 'bg-chosen text-foreground',
                    )}
                  >
                    <Pencil aria-hidden className="size-5" />
                  </button>
                </div>
                {ownTime ? (
                  <div className="flex items-end gap-2">
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="text-sm text-muted-foreground">{t('setup.beats')}</span>
                      <Stepper
                        label={t('setup.beats')}
                        typed
                        value={meterParts(meter).count}
                        min={1}
                        max={12}
                        onChange={(count) =>
                          setMeter(`${count}/${meterParts(meter).unit}` as Meter)
                        }
                        decrease={t('setup.fewerBeats')}
                        increase={t('setup.moreBeats')}
                      />
                    </div>
                    <span aria-hidden className="pb-2 text-2xl text-muted-foreground">
                      /
                    </span>
                    <div className="flex w-24 shrink-0 flex-col gap-1">
                      <span className="text-sm text-muted-foreground">{t('setup.unit')}</span>
                      <Dropdown
                        bare
                        label={t('setup.unit')}
                        value={String(meterParts(meter).unit)}
                        options={METER_UNITS.map((each) => ({
                          value: String(each),
                          label: String(each),
                        }))}
                        onChange={(each) =>
                          setMeter(
                            `${meterParts(meter).count}/${Number(each) as MeterUnit}` as Meter,
                          )
                        }
                        className="h-11"
                      />
                    </div>
                  </div>
                ) : null}
              </SheetPart>
            </>
          )}
        </form>
      </SheetContent>
    </Sheet>
  )
}
