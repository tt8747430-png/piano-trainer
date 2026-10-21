import { useNavigate } from '@tanstack/react-router'
import { Mic, Plus, SlidersHorizontal } from 'lucide-react'
import { useId, useState, type ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { songTitle, TITLE_MAX, usePiecesStoreApi } from '@/entities/piece'
import { makeSong, SCORE_TEMPLATES, type ScoreSetup } from '@/features/edit-piece'
import { keyFromParam, keyParam, METERS, note, type Meter } from '@/shared/lib/music'
import {
  Fab,
  KeyChoice,
  NameField,
  Segmented,
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useSetupSummary } from '../model/setup-summary'
import { ScoreSetupSheet } from './ScoreSetupSheet'

const C_MAJOR = keyParam({ tonic: note('C'), minor: false })

/**
 * New song, the Songs page's floating button: its title, its key among the twelve notes and its meter, each a tap; then Make, which
 * opens it in the score editor, or Record beside it, which opens it on its takes. Its `trigger` is
 * the floating button unless another is given (an empty shelf's).
 */
export function NewSongSheet({ trigger }: { trigger?: ReactElement }) {
  const { t } = useTranslation('songs')
  const store = usePiecesStoreApi()
  const navigate = useNavigate()
  const meterId = useId()
  const [title, setTitle] = useState('')
  const [key, setKey] = useState(C_MAJOR)
  const [meter, setMeter] = useState<Meter>('4/4')
  const [setup, setSetup] = useState<ScoreSetup>(SCORE_TEMPLATES.chordsAndPiano)
  const [customizing, customize] = useState(false)
  const summary = useSetupSummary(setup)
  /** Makes the song and opens it in the score editor, its takes open to record into it. */
  const make = (record: boolean) => {
    const id = makeSong(store, { title, key: keyFromParam(key), meter, setup })
    if (id) void navigate({ to: '/edit/$pieceId', params: { pieceId: id }, search: { record } })
  }
  const untitled = songTitle(title) === null
  return (
    <Sheet>
      <SheetTrigger render={trigger ?? <Fab label={t('newSong')} icon={Plus} extended />} />
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
              <span className="truncate">{summary}</span>
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
