import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { Flag, Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { readSharedSong, usePiecesStoreApi, type SharedSong } from '@/entities/piece'
import { addSong } from '@/features/edit-piece'
import type { NetFailure } from '@/shared/api/network'
import type { PublicEntry } from '@/shared/api/public-library'
import { useAccount } from '@/shared/lib/account'
import { usePublicLibrary } from '@/shared/lib/public-library'
import {
  BackButton,
  ButtonLink,
  Fab,
  FloatingActions,
  RoundButton,
  ScreenHeader,
} from '@/shared/ui'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'
import { SongPreview } from '@/widgets/song-preview'
import { ReportDialog } from './ReportDialog'

type Reading =
  | { readonly kind: 'reading' }
  | { readonly kind: 'gone' }
  | { readonly kind: 'failed'; readonly reason: NetFailure }
  | { readonly kind: 'song'; readonly entry: PublicEntry; readonly song: SharedSong }

/**
 * A song from the Public library (ADR 0116): its title and author, its chart to hear on the keys,
 * Save to my songs (a copy of the learner's own; counted once where they are signed in), and Report.
 */
export function PublicSongPage() {
  const { t } = useTranslation('songs')
  const { itemId } = useParams({ from: '/shell/songs/public/$itemId' })
  const library = usePublicLibrary()
  const { account } = useAccount()
  const pieces = usePiecesStoreApi()
  const navigate = useNavigate()
  const [reading, setReading] = useState<Reading>({ kind: 'reading' })
  const [reporting, setReporting] = useState(false)
  useEffect(() => {
    let current = true
    void library.item(itemId).then((result) => {
      if (!current) return
      if (!result.ok)
        return setReading(
          result.reason === 'refused'
            ? { kind: 'gone' }
            : { kind: 'failed', reason: result.reason },
        )
      const song = result.value && readSharedSong(result.value.body)
      setReading(
        song && result.value ? { kind: 'song', entry: result.value.entry, song } : { kind: 'gone' },
      )
    })
    return () => {
      current = false
    }
  }, [library, itemId])
  // Saved once: a second press before the copy's page opens saves nothing.
  const saved = useRef(false)
  const [saving, setSaving] = useState(false)
  const save = (song: SharedSong, author: string) => {
    if (saved.current) return
    saved.current = true
    setSaving(true)
    if (account) void library.save(itemId)
    const id = addSong(pieces, song, author)
    void navigate({ to: '/songs/$pieceId', params: { pieceId: id }, replace: true })
  }
  const title = reading.kind === 'song' ? reading.song.title : t('public.title')
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={title}
        back={<BackButton fallback={{ to: '/songs/public' }} />}
        actions={
          reading.kind === 'song' ? (
            <RoundButton
              label={t('public.report')}
              icon={Flag}
              onClick={() => setReporting(true)}
            />
          ) : undefined
        }
      />
      {reading.kind === 'reading' ? (
        <p role="status" className="text-muted-foreground">
          {t('shared.reading')}
        </p>
      ) : reading.kind === 'song' ? (
        <>
          <p className="-mt-4 text-muted-foreground">
            {t('public.by', { name: reading.entry.authorName })} ·{' '}
            {t('public.saves', { count: reading.entry.saves })}
          </p>
          <SongPreview song={reading.song} />
          <FloatingActions>
            <Fab
              label={t('public.save')}
              icon={Plus}
              extended
              disabled={saving}
              onClick={() => save(reading.song, reading.entry.authorName)}
            />
          </FloatingActions>
          <ReportDialog itemId={itemId} open={reporting} onOpenChange={setReporting} />
        </>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>
              {reading.kind === 'gone'
                ? t('public.gone')
                : reading.reason === 'offline'
                  ? t('public.offline')
                  : t('public.failed')}
            </EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <ButtonLink variant="outline" render={<Link to="/songs/public" />}>
              {t('public.title')}
            </ButtonLink>
          </EmptyContent>
        </Empty>
      )}
    </div>
  )
}
