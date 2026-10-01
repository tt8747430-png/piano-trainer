import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { songTitle, TITLE_MAX, usePiecesStoreApi } from '@/entities/piece'
import { makeSong } from '@/features/edit-piece'
import { keyFromParam, keyParam, METERS, note, type Meter } from '@/shared/lib/music'
import { KeyDropdown, Segmented, Sheet, SheetContent, SheetTrigger } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'

const C_MAJOR = keyParam({ tonic: note('C'), minor: false })

/** New song: its title, key and meter, then Make, which opens it in the score editor. */
export function NewSongSheet() {
  const { t } = useTranslation('songs')
  const store = usePiecesStoreApi()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [key, setKey] = useState(C_MAJOR)
  const [meter, setMeter] = useState<Meter>('4/4')
  const make = () => {
    const id = makeSong(store, { title, key: keyFromParam(key), meter })
    if (id) void navigate({ to: '/edit/$pieceId', params: { pieceId: id } })
  }
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="surface" size="icon" aria-label={t('newSong')} />}>
        <Plus aria-hidden />
      </SheetTrigger>
      <SheetContent
        title={t('making.title')}
        footer={
          <Button size="lg" disabled={songTitle(title) === null} onClick={make}>
            {t('making.make')}
          </Button>
        }
      >
        <div className="flex flex-col gap-5 pt-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">{t('making.name')}</span>
            <Input
              value={title}
              maxLength={TITLE_MAX}
              onChange={(event) => setTitle(event.target.value)}
              className="h-12"
            />
          </label>
          <KeyDropdown value={key} onChange={setKey} />
          <Segmented
            label={t('making.meter')}
            value={meter}
            options={METERS.map((value) => ({ value, label: value }))}
            onChange={setMeter}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
