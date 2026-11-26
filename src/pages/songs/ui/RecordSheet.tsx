import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { libraryCatalog, useLibraryStoreApi, type FolderId } from '@/entities/library'
import { usePiecesStoreApi } from '@/entities/piece'
import {
  RECORDER_COUNT_INS,
  selectRecorder,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { useMidiDevices } from '@/features/connect-midi'
import { makeSong, PIANO_ONLY, START_BARS, START_TEMPO } from '@/features/edit-piece'
import { moveTo } from '@/features/manage-library'
import { setRecorderClick, setRecorderCountIn } from '@/features/set-preference'
import { nextName } from '@/shared/lib'
import { C_MAJOR } from '@/shared/lib/music'
import {
  GroupLink,
  GroupRow,
  GroupRows,
  GroupSegmented,
  GroupSwitch,
  MakeSheet,
  Stepper,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * Record (R72's RECFORM, Flat's): what it hears (the piano connected, else Not connected, as a take
 * needs a MIDI keyboard; its row opening Connect a piano), the tempo, the Click and the Count-in (the recorder's own saved choices, the recording
 * bar's too), and Start recording: a song made at once, named "Recording", "Recording 2", in C
 * major and 4/4 at that tempo, opened in the score editor with Record pressed. Made where the
 * learner is (ADR 0106). A centred dialog on a laptop (`MakeSheet`).
 */
export function RecordSheet({
  open,
  onOpenChange,
  folder,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  folder: FolderId | null
}) {
  const { t } = useTranslation('songs')
  const { t: common } = useTranslation('common')
  const store = usePiecesStoreApi()
  const library = useLibraryStoreApi()
  const settings = useSettingsStoreApi()
  const navigate = useNavigate()
  const devices = useMidiDevices()
  const { click, countIn } = useSettings(selectRecorder)
  const [tempo, setTempo] = useState(START_TEMPO)
  const input = devices.find((device) => device.input)?.name ?? common('midiSettings.devices.away')
  const start = () => {
    const title = nextName(
      t('recording.name'),
      store.getState().songs.map((song) => song.title),
    )
    const id = makeSong(store, {
      title,
      key: C_MAJOR,
      meter: '4/4',
      staves: PIANO_ONLY,
      tempo,
      tempoUnit: '4',
      tempoText: null,
      bars: START_BARS,
      timeSymbol: false,
      pickup: 0,
    })
    if (!id) return
    if (folder)
      moveTo(
        library,
        libraryCatalog({ ownSongs: store.getState().songs }),
        { songs: [id], folders: [] },
        folder,
      )
    void navigate({ to: '/edit/$pieceId', params: { pieceId: id }, search: { record: true } })
  }
  return (
    <MakeSheet
      open={open}
      onOpenChange={onOpenChange}
      title={t('recording.title')}
      footer={
        <Button size="lg" className="w-full gap-3" onClick={start}>
          <span aria-hidden className="size-3.5 rounded-pill bg-destructive" />
          {t('recording.start')}
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <GroupRows surface="sheet">
          <GroupLink
            label={t('recording.input')}
            value={input}
            onClick={() => void navigate({ to: '/settings/connect-piano' })}
          />
        </GroupRows>
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
          <GroupSwitch
            label={t('recording.click')}
            checked={click}
            onCheckedChange={(on) => setRecorderClick(settings, on)}
          />
          <GroupSegmented
            label={t('recording.countIn')}
            value={countIn}
            options={RECORDER_COUNT_INS.map((bars) => ({
              value: bars,
              label: common(`recorderSettings.countIns.${bars}`),
            }))}
            onChange={(bars) => setRecorderCountIn(settings, bars)}
          />
        </GroupRows>
      </div>
    </MakeSheet>
  )
}
