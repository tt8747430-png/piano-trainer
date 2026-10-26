import { useNavigate } from '@tanstack/react-router'
import { Mic, SlidersHorizontal } from 'lucide-react'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { libraryCatalog, useLibraryStoreApi, type FolderId } from '@/entities/library'
import { songTitle, TITLE_MAX, usePiecesStoreApi } from '@/entities/piece'
import { makeSong, type ScoreSetup } from '@/features/edit-piece'
import { moveSongs } from '@/features/manage-library'
import { C_MAJOR, keyFromParam, keyParam, METERS, type Meter } from '@/shared/lib/music'
import { KeyChoice, NameField, Segmented, Sheet, SheetContent } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { ScoreSetupSheet } from './ScoreSetupSheet'

/**
 * New song: its title, its key among the twelve notes and its meter, each a tap; then Make, which
 * opens it in the score editor, or Record beside it, which opens it with Record pressed (ADR 0096):
 * counting in at once with a MIDI keyboard, else saying it needs one. It is made where the learner
 * is (ADR 0106): in the folder open (`folder`), else at Home, last. Its page opens it.
 */
export function NewSongSheet({
  open,
  onOpenChange,
  folder,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  folder: FolderId | null
}) {
  const { t } = useTranslation('songs')
  const store = usePiecesStoreApi()
  const library = useLibraryStoreApi()
  const navigate = useNavigate()
  const meterId = useId()
  const [title, setTitle] = useState('')
  const [key, setKey] = useState(keyParam(C_MAJOR))
  const [meter, setMeter] = useState<Meter>('4/4')
  const [setup, setSetup] = useState<ScoreSetup>('piano')
  const [customizing, customize] = useState(false)
  /** Makes the song and opens it in the score editor, Record pressed where it was made to record. */
  const make = (record: boolean) => {
    const id = makeSong(store, { title, key: keyFromParam(key), meter, setup })
    if (!id) return
    if (folder)
      moveSongs(library, libraryCatalog({ ownSongs: store.getState().songs }), [id], folder)
    void navigate({ to: '/edit/$pieceId', params: { pieceId: id }, search: { record } })
  }
  const untitled = songTitle(title) === null
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        title={t('making.title')}
        footer={
          <div className="flex gap-3">
            <Button size="lg" className="flex-1" disabled={untitled} onClick={() => make(false)}>
              {t('making.make')}
            </Button>
            <Button size="lg" variant="soft" disabled={untitled} onClick={() => make(true)}>
              <Mic data-icon="inline-start" aria-hidden />
              {t('making.makeAndRecord')}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-6">
          <NameField
            label={t('making.name')}
            value={title}
            maxLength={TITLE_MAX}
            onChange={(event) => setTitle(event.target.value)}
          />
          <KeyChoice value={key} onChange={setKey} />
          <div className="flex flex-col gap-2">
            <span id={meterId} aria-hidden className="text-sm text-muted-foreground">
              {t('making.meter')}
            </span>
            <Segmented
              label={t('making.meter')}
              value={meter}
              options={METERS.map((value) => ({ value, label: value }))}
              onChange={setMeter}
            />
          </div>
          {/* What the score holds: its own sheet, so New song stays short (ADR 0072). */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-col">
              <span className="text-sm text-muted-foreground">{t('setup.title')}</span>
              <span className="truncate">{t(`setup.choice.${setup}`)}</span>
            </div>
            <Button variant="soft" onClick={() => customize(true)}>
              <SlidersHorizontal data-icon="inline-start" aria-hidden />
              {t('setup.customize')}
            </Button>
          </div>
          <ScoreSetupSheet
            open={customizing}
            onOpenChange={customize}
            setup={setup}
            onChange={setSetup}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
