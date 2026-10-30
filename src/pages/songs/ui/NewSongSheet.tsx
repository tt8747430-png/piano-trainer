import { useNavigate } from '@tanstack/react-router'
import { Mic } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { libraryCatalog, useLibraryStoreApi, type FolderId } from '@/entities/library'
import { TITLE_MAX, usePiecesStoreApi, type SongCollectionId } from '@/entities/piece'
import {
  makeSong,
  SCORE_SETUPS,
  useCreateBuiltInSong,
  type ScoreSetup,
} from '@/features/edit-piece'
import { moveTo } from '@/features/manage-library'
import { C_MAJOR, meterParts, type Key, type Meter } from '@/shared/lib/music'
import { NewSheet, PictureTiles, SheetPart } from '@/shared/ui'
import { KeySignaturePicker } from '@/shared/ui/pickers/KeySignaturePicker'
import { PickerCell, PickerGrid } from '@/shared/ui/pickers/PickerGrid'

/** The time signatures a new song offers, as notation apps' new scores do: the common ones. */
const COMMON_METERS: readonly (readonly Meter[])[] = [
  ['2/4', '3/4', '4/4', '2/2'],
  ['3/8', '6/8', '9/8', '12/8'],
]

/** A score's staves drawn small: five lines each, the piano's two braced. */
function StavesPicture({ setup }: { setup: ScoreSetup }) {
  const staves = setup === 'piano' ? 2 : setup === 'staffAndPiano' ? 3 : 1
  // Five lines 3 apart, staves 6 apart, the whole centred in the tile.
  const height = staves * 12 + (staves - 1) * 6
  const top = (52 - height) / 2
  const staffTop = (s: number) => top + s * 18
  const lowest = staffTop(staves - 1) + 12
  return (
    <svg aria-hidden viewBox="0 0 64 52" className="h-13 w-16 text-foreground">
      {Array.from({ length: staves }, (_, s) =>
        [0, 1, 2, 3, 4].map((line) => (
          <line
            key={`${s}-${line}`}
            x1={12}
            x2={60}
            y1={staffTop(s) + line * 3}
            y2={staffTop(s) + line * 3}
            stroke="currentColor"
            strokeOpacity={0.7}
            strokeWidth={0.75}
          />
        )),
      )}
      {/* The system's line at the left, and the piano's brace round its two staves. */}
      <line x1={12} x2={12} y1={top} y2={lowest} stroke="currentColor" strokeWidth={0.9} />
      {setup === 'staff' ? null : (
        <path
          d={`M9 ${staffTop(staves - 2)} q-4 ${15} 0 ${30}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
        />
      )}
    </svg>
  )
}

/**
 * New song, as a notation app's new score (Flat's): its name; its staves as pictures; its key
 * signature from the grid of signatures the score editor's key picker is; its time signature from the
 * common ones; one Create song at the foot, which opens it in the score editor (`record`: Record
 * pressed there, the + menu's Record). Everything here can be changed on the score later. It is made
 * where the learner is (ADR 0106): in the folder open (`folder`), else at Home, last. An editor's New
 * built-in song (`builtIn`, content as data) is made on the server in that collection, unpublished,
 * and opens in the original's editor.
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
  const store = usePiecesStoreApi()
  const library = useLibraryStoreApi()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [key, setKey] = useState<Key>(C_MAJOR)
  const [meter, setMeter] = useState<Meter>('4/4')
  const [setup, setSetup] = useState<ScoreSetup>('piano')
  const [making, setMaking] = useState(false)
  const [failed, setFailed] = useState(false)
  const createBuiltIn = useCreateBuiltInSong()
  /** Makes the built-in song on the server, unpublished, and opens its original in the score editor. */
  const makeBuiltIn = async (collection: SongCollectionId) => {
    setMaking(true)
    setFailed(false)
    const made = await createBuiltIn({ title, key, meter, setup, collection })
    setMaking(false)
    if (!made.ok) return setFailed(true)
    await navigate({
      to: '/edit/$pieceId',
      params: { pieceId: made.value },
      search: { original: true },
    })
  }
  /** Makes the song and opens it in the score editor, Record pressed where it was made to record. */
  const make = () => {
    const id = makeSong(store, { title, key, meter, setup })
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
  return (
    <NewSheet
      open={open}
      onOpenChange={onOpenChange}
      title={t(builtIn ? 'making.builtInTitle' : record ? 'making.recordTitle' : 'making.title')}
      nameLabel={t('making.name')}
      name={title}
      onName={setTitle}
      maxLength={TITLE_MAX}
      hint={t('making.later')}
      createLabel={t(record ? 'making.createAndRecord' : 'making.create')}
      creatingLabel={t('making.making')}
      creating={making}
      createIcon={record ? <Mic data-icon="inline-start" aria-hidden /> : null}
      failed={failed ? t('making.failed') : null}
      onCreate={() => (builtIn ? void makeBuiltIn(builtIn) : make())}
    >
      <SheetPart title={t('setup.staves')} detail={t('setup.stavesDetail')}>
        <PictureTiles
          label={t('setup.staves')}
          value={setup}
          columns={3}
          tiles={SCORE_SETUPS.map((choice) => ({
            value: choice,
            label: t(`setup.choice.${choice}`),
            picture: <StavesPicture setup={choice} />,
          }))}
          onChange={setSetup}
        />
      </SheetPart>
      <SheetPart title={t('making.key')} detail={t('making.keyDetail')}>
        <KeySignaturePicker value={key} onChange={setKey} />
      </SheetPart>
      <SheetPart title={t('making.meter')} detail={t('making.meterDetail')}>
        <PickerGrid
          label={t('making.meter')}
          columns={4}
          rows={COMMON_METERS.map((row, r) => ({
            label: t(r === 0 ? 'making.simple' : 'making.compound'),
            cells: row.map((each) => {
              const { count, unit } = meterParts(each)
              return (
                <PickerCell
                  key={each}
                  label={each}
                  pressed={each === meter}
                  onClick={() => setMeter(each)}
                >
                  <span className="flex flex-col items-center font-display text-lg leading-none font-semibold">
                    <span>{count}</span>
                    <span>{unit}</span>
                  </span>
                </PickerCell>
              )
            }),
          }))}
        />
      </SheetPart>
    </NewSheet>
  )
}
