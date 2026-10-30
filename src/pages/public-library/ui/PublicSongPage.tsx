import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { CloudOff, Flag, Plus, SearchX, TriangleAlert } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LEFT_FIGURES,
  readSharedPattern,
  RIGHT_FIGURES,
  usePatternsStoreApi,
  type SharedPattern,
} from '@/entities/pattern'
import { readSharedSong, usePiecesStoreApi, type SharedSong } from '@/entities/piece'
import { addSong } from '@/features/edit-piece'
import { saveOwnPattern } from '@/features/manage-patterns'
import type { NetFailure } from '@/shared/api/network'
import type { PublicEntry } from '@/shared/api/public-library'
import { localText, useLocale } from '@/shared/i18n'
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
import { SongPreview } from '@/widgets/song-preview'
import { Byline, FactChips, ReadingItem } from './PublicItemParts'
import { ReportDialog } from './ReportDialog'
import { Said } from './Said'

type Reading =
  | { readonly kind: 'reading' }
  | { readonly kind: 'gone' }
  | { readonly kind: 'failed'; readonly reason: NetFailure }
  | { readonly kind: 'song'; readonly entry: PublicEntry; readonly song: SharedSong }
  | { readonly kind: 'pattern'; readonly entry: PublicEntry; readonly pattern: SharedPattern }

/**
 * A song or a pattern from the Public library (ADR 0116), as a song's page reads: its title in the
 * bar, who published it and how often it is saved, its facts a line of chips; a song's chart to hear
 * on the keys, a pattern's figure for each hand; Save to my songs or my patterns (a copy of the
 * learner's own, opened at once to play; counted once where they are signed in), and Report.
 */
export function PublicSongPage() {
  const { t } = useTranslation('songs')
  const { itemId } = useParams({ from: '/shell/songs/public/$itemId' })
  const library = usePublicLibrary()
  const { account } = useAccount()
  const pieces = usePiecesStoreApi()
  const patterns = usePatternsStoreApi()
  const locale = useLocale()
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
      const found = result.value
      if (!found) return setReading({ kind: 'gone' })
      if (found.entry.kind === 'pattern') {
        const pattern = readSharedPattern(found.body)
        return setReading(
          pattern ? { kind: 'pattern', entry: found.entry, pattern } : { kind: 'gone' },
        )
      }
      const song = readSharedSong(found.body)
      setReading(song ? { kind: 'song', entry: found.entry, song } : { kind: 'gone' })
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
  const savePattern = (pattern: SharedPattern) => {
    if (saved.current) return
    const id = saveOwnPattern(patterns, pattern)
    if (!id) return
    saved.current = true
    setSaving(true)
    if (account) void library.save(itemId)
    void navigate({
      to: '/practice/accompaniment/patterns/$patternRef',
      params: { patternRef: id },
      replace: true,
    })
  }
  const title =
    reading.kind === 'song'
      ? reading.song.title
      : reading.kind === 'pattern'
        ? reading.pattern.name
        : t('public.title')
  return (
    <div className="flex flex-col gap-5">
      <ScreenHeader
        title={title}
        back={<BackButton fallback={{ to: '/songs/public' }} />}
        actions={
          reading.kind === 'song' || reading.kind === 'pattern' ? (
            <RoundButton
              label={t('public.report')}
              icon={Flag}
              onClick={() => setReporting(true)}
            />
          ) : undefined
        }
      />
      {reading.kind === 'reading' ? (
        <ReadingItem label={t('shared.reading')} />
      ) : reading.kind === 'song' ? (
        <>
          <Byline entry={reading.entry} />
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
      ) : reading.kind === 'pattern' ? (
        <>
          <Byline entry={reading.entry} />
          <FactChips
            facts={[
              {
                name: t('public.rightHand'),
                value: localText(RIGHT_FIGURES[reading.pattern.rh].name, locale),
              },
              {
                name: t('public.leftHand'),
                value: localText(LEFT_FIGURES[reading.pattern.lh].name, locale),
              },
            ]}
          />
          <FloatingActions>
            <Fab
              label={t('public.savePattern')}
              icon={Plus}
              extended
              disabled={saving}
              onClick={() => savePattern(reading.pattern)}
            />
          </FloatingActions>
          <ReportDialog itemId={itemId} open={reporting} onOpenChange={setReporting} />
        </>
      ) : (
        <Said
          icon={
            reading.kind === 'gone'
              ? SearchX
              : reading.reason === 'offline'
                ? CloudOff
                : TriangleAlert
          }
          paint="sand"
          title={
            reading.kind === 'gone'
              ? t('public.gone')
              : reading.reason === 'offline'
                ? t('public.offline')
                : t('public.failed')
          }
          action={
            <ButtonLink variant="soft" render={<Link to="/songs/public" />}>
              {t('public.title')}
            </ButtonLink>
          }
        />
      )}
    </div>
  )
}
