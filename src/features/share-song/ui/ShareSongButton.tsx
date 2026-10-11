import { Share2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { SharedSong } from '@/entities/piece'
import { Button } from '@/shared/ui/primitives/button'
import { SHARED_SONG_PATH, songLinkData } from '../model/song-link'

type Said = 'copied' | 'failed' | 'tooLong' | null

/**
 * Share on an own song: a link that carries the song (`songLinkData`), handed to the browser's share
 * sheet where there is one (a phone), else copied, and said so.
 */
export function ShareSongButton({ song }: { song: SharedSong }) {
  const { t } = useTranslation('piece')
  const [said, setSaid] = useState<Said>(null)
  const share = async () => {
    setSaid(null)
    try {
      const data = await songLinkData(song)
      if (data === null) {
        setSaid('tooLong')
        return
      }
      const url = new URL(SHARED_SONG_PATH, window.location.origin)
      url.searchParams.set('song', data)
      if (navigator.share) {
        await navigator.share({ title: song.title, url: url.href })
        return
      }
      await navigator.clipboard.writeText(url.href)
      setSaid('copied')
    } catch (error) {
      // Closing the share sheet is no failure.
      if (error instanceof DOMException && error.name === 'AbortError') return
      setSaid('failed')
    }
  }
  return (
    <div className="flex flex-col items-start gap-2">
      <Button variant="outline" onClick={() => void share()}>
        <Share2 data-icon="inline-start" aria-hidden />
        {t('share')}
      </Button>
      <p role="status" className="text-sm text-muted-foreground empty:hidden">
        {said === 'copied'
          ? t('shareCopied')
          : said === 'failed'
            ? t('shareFailed')
            : said === 'tooLong'
              ? t('shareTooLong')
              : ''}
      </p>
    </div>
  )
}
