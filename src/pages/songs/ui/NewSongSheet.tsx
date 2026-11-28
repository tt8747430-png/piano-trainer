import { useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { libraryCatalog, useLibraryStoreApi, type FolderId } from '@/entities/library'
import { TITLE_MAX, usePiecesStoreApi, type SongCollectionId } from '@/entities/piece'
import {
  makeSong,
  PIANO_ONLY,
  START_BARS,
  START_TEMPO,
  useCreateBuiltInSong,
  type ScoreStaves,
} from '@/features/edit-piece'
import { moveTo } from '@/features/manage-library'
import { useKeyName } from '@/shared/i18n'
import {
  beatUnit,
  C_MAJOR,
  keySignature,
  printedNote,
  signatureKey,
  type Key,
  type Meter,
} from '@/shared/lib/music'
import { ChoiceTiles, GroupRow, GroupRows, MakeSheet, Problem, Stepper } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** The staves a song starts with, as Flat's new score offers them (R72's SONGFORM). */
const STAVES = [
  { id: 'piano', staves: PIANO_ONLY },
  { id: 'melody', staves: { piano: false, voices: ['voice'] } },
  { id: 'voicePiano', staves: { piano: true, voices: ['voice'] } },
] as const satisfies readonly { id: string; staves: ScoreStaves }[]
type StavesId = (typeof STAVES)[number]['id']

/** The keys by their signature: one to seven sharps over one to seven flats. */
const SHARPS = [1, 2, 3, 4, 5, 6, 7] as const
const FLATS = [-1, -2, -3, -4, -5, -6, -7] as const

/** The time signatures a song most often starts in. */
const METERS = ['2/4', '3/4', '4/4', '6/8', '3/8', '12/8'] as const satisfies readonly Meter[]

/** A part's name over its control, its value at its right where it has one (the board's `_SLAB`). */
function Part({ label, value, children }: { label: string; value?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="mx-1 flex items-baseline justify-between gap-3">
        <span className="text-footnote font-semibold text-muted-foreground">{label}</span>
        {value ? <span className="text-footnote text-foreground">{value}</span> : null}
      </div>
      {children}
    </div>
  )
}

/**
 * New song as Flat's new score, one sheet (R72's SONGFORM; a centred dialog on a laptop): its name;
 * its staves (Piano, Melody, Voice and piano); its tempo and bars, stepped; its key, a major key by
 * its signature, sharps over flats, a tile tapped again going back to C major; its time, from the
 * six most common; Create, which opens it in the score editor. Record is its own sheet (`RecordSheet`).
 * What more a score needs (a pickup, a choir, a tempo's words) is set in the editor.
 *
 * It is made where the learner is (ADR 0106): in the folder open (`folder`), else at Home, last. An
 * editor's New built-in song (`builtIn`, content as data) is made on the server in that collection,
 * unpublished, and opens in the original's editor.
 */
export function NewSongSheet({
  open,
  onOpenChange,
  folder,
  builtIn,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  folder: FolderId | null
  /** An editor's new built-in song in this collection, in place of the learner's own. */
  builtIn?: SongCollectionId | undefined
}) {
  const { t } = useTranslation('songs')
  const keyName = useKeyName()
  const store = usePiecesStoreApi()
  const library = useLibraryStoreApi()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [stavesId, setStavesId] = useState<StavesId>('piano')
  const [tempo, setTempo] = useState(START_TEMPO)
  const [bars, setBars] = useState(START_BARS)
  const [key, setKey] = useState<Key>(C_MAJOR)
  const [meter, setMeter] = useState<Meter>('4/4')
  const [making, setMaking] = useState(false)
  const [failed, setFailed] = useState(false)
  const createBuiltIn = useCreateBuiltInSong()
  const named = title.trim() !== ''
  const signature = keySignature(key)
  const staves = STAVES.find((each) => each.id === stavesId)?.staves ?? PIANO_ONLY
  const start = {
    staves,
    tempo,
    tempoUnit: beatUnit(meter),
    tempoText: null,
    bars,
    timeSymbol: false,
    pickup: 0,
  }
  /** Makes the built-in song on the server, unpublished, and opens its original in the score editor. */
  const makeBuiltIn = async (collection: SongCollectionId) => {
    setMaking(true)
    setFailed(false)
    const made = await createBuiltIn({ title, key, meter, collection, ...start })
    setMaking(false)
    if (!made.ok) return setFailed(true)
    await navigate({ to: '/edit/$pieceId', params: { pieceId: made.value } })
  }
  /** Makes the song and opens it in the score editor. */
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
    void navigate({ to: '/edit/$pieceId', params: { pieceId: id }, search: { record: false } })
  }
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!named || making) return
    if (builtIn) void makeBuiltIn(builtIn)
    else make()
  }
  return (
    <MakeSheet
      open={open}
      onOpenChange={onOpenChange}
      title={t('making.title')}
      footer={
        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            form="new-song"
            size="lg"
            className="w-full"
            disabled={!named || making}
          >
            {making ? t('making.making') : t('making.create')}
          </Button>
          {failed ? <Problem>{t('making.failed')}</Problem> : null}
        </div>
      }
    >
      <form id="new-song" onSubmit={submit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="mx-1 caps">{t('making.name')}</span>
          <input
            autoFocus
            value={title}
            maxLength={TITLE_MAX}
            placeholder={t('making.namePlaceholder')}
            enterKeyHint="done"
            onChange={(event) => setTitle(event.target.value)}
            className="h-13 rounded-card bg-card px-4 text-base text-foreground ring-1 ring-border outline-none placeholder:text-muted-foreground"
          />
        </label>
        <Part label={t('making.staves')}>
          <ChoiceTiles
            label={t('making.staves')}
            value={stavesId}
            options={STAVES.map(({ id }) => id)}
            onChange={setStavesId}
            className="grid grid-cols-3 gap-2"
            tileClassName="group flex min-h-16 flex-col items-start justify-center gap-0.5 px-3 py-2 text-start"
            tile={(id) => (
              <>
                <span className="text-subhead font-semibold">{t(`making.stavesOf.${id}`)}</span>
                <span className="text-footnote text-muted-foreground group-aria-checked:text-background/75">
                  {t(`making.stavesLine.${id}`)}
                </span>
              </>
            )}
          />
        </Part>
        <GroupRows surface="sheet">
          <GroupRow label={t('making.tempo')}>
            <Stepper
              label={t('making.tempo')}
              value={tempo}
              min={30}
              max={240}
              step={4}
              format={(bpm) => `♩ = ${bpm}`}
              onChange={setTempo}
              decrease={t('making.slower')}
              increase={t('making.faster')}
            />
          </GroupRow>
          <GroupRow label={t('making.bars')}>
            <Stepper
              label={t('making.bars')}
              value={bars}
              min={1}
              max={200}
              onChange={setBars}
              decrease={t('making.fewerBars')}
              increase={t('making.moreBars')}
            />
          </GroupRow>
        </GroupRows>
        <Part
          label={t('making.key')}
          value={
            signature === 0
              ? t('making.keyNone', { key: keyName(C_MAJOR) })
              : keyName(signatureKey(signature, false))
          }
        >
          <ChoiceTiles
            label={t('making.key')}
            value={signature === 0 ? null : signature}
            options={[...SHARPS, ...FLATS]}
            onChange={(count) => setKey(signature === count ? C_MAJOR : signatureKey(count, false))}
            name={(count) => keyName(signatureKey(count, false))}
            className="grid grid-cols-7 gap-1"
            tileClassName="flex h-14 flex-col items-center justify-center gap-0.5"
            tile={(count) => (
              <>
                <span className="text-base/[1.1] font-semibold">
                  {printedNote(signatureKey(count, false).tonic)}
                </span>
                <span className="text-xs/none opacity-70">
                  {Math.abs(count)}
                  {count > 0 ? '♯' : '♭'}
                </span>
              </>
            )}
          />
        </Part>
        <Part label={t('making.meter')}>
          <ChoiceTiles
            label={t('making.meter')}
            value={meter}
            options={METERS}
            onChange={setMeter}
            name={(each) => each}
            className="grid grid-cols-6 gap-1"
            tileClassName="flex h-15 flex-col items-center justify-center font-display text-[1.1875rem]/[0.95] font-bold"
            tile={(each) => (
              <>
                <span>{each.split('/')[0]}</span>
                <span>{each.split('/')[1]}</span>
              </>
            )}
          />
        </Part>
      </form>
    </MakeSheet>
  )
}
