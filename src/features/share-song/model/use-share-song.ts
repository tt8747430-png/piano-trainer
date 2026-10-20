import { useState } from 'react'
import type { SharedSong } from '@/entities/piece'
import { SHARED_SONG_PATH, songLinkData } from './song-link'

/** What sharing said, where the share sheet said nothing itself. */
export type ShareSaid = 'copied' | 'failed' | 'tooLong' | null

/**
 * Share for an own song: a link that carries the song (`songLinkData`), handed to the browser's share
 * sheet where there is one (a phone), else copied; `said` is what the page says of it.
 */
export function useShareSong(): { share: (song: SharedSong) => void; said: ShareSaid } {
  const [said, setSaid] = useState<ShareSaid>(null)
  const send = async (song: SharedSong) => {
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
  return { share: (song) => void send(song), said }
}
