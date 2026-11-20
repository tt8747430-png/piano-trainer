import { useState } from 'react'
import { shareLink } from '@/shared/lib'
import type { SharedSong } from '@/entities/piece'
import { pieceLink, type PlayedAs } from './piece-link'
import { SHARED_SONG_PATH, songLinkData } from './song-link'

/** What sharing said, where the share sheet said nothing itself. */
export type ShareSaid = 'copied' | 'linked' | 'failed' | 'tooLong' | null

/**
 * What is shared (ADR 0107): the learner's own song, its music carried in the link; or a piece of the
 * app's, a link to itself as it is played.
 */
export type SongToShare =
  | { readonly kind: 'own'; readonly song: SharedSong }
  | {
      readonly kind: 'piece'
      readonly id: string
      readonly title: string
      readonly played: PlayedAs
    }

/** The link's path and query, or null for an own song too long for a link. */
async function linkOf(what: SongToShare): Promise<string | null> {
  if (what.kind === 'piece') return pieceLink(what.id, what.played)
  const data = await songLinkData(what.song)
  return data === null ? null : `${SHARED_SONG_PATH}?${new URLSearchParams({ song: data })}`
}

/**
 * Share, a song's page's and the Player's alike (ADR 0107): its link handed to the browser's share
 * sheet where there is one (a phone), else copied; `said` is what the page says of it.
 */
export function useShareSong(): { share: (what: SongToShare) => void; said: ShareSaid } {
  const [said, setSaid] = useState<ShareSaid>(null)
  const send = async (what: SongToShare) => {
    setSaid(null)
    const link = await linkOf(what).catch(() => undefined)
    if (link === undefined) {
      setSaid('failed')
      return
    }
    if (link === null) {
      setSaid('tooLong')
      return
    }
    const title = what.kind === 'own' ? what.song.title : what.title
    // Closing the share sheet is no failure, and the sheet says what it did.
    const shared = await shareLink({ title, path: link })
    if (shared === 'copied') setSaid(what.kind === 'own' ? 'copied' : 'linked')
    else if (shared === 'failed') setSaid('failed')
  }
  return { share: (what) => void send(what), said }
}
