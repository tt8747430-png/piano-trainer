# Share a song by link

**Status:** built · **Date:** 2026-10-11

## Why

A learner's own songs live on their device only. A teacher who writes a song's chart, or a church group that
shares one, has no way to pass it on but a backup of everything. A song is small: its chart, tune and written hands
are text, so it can travel inside a link.

## What

- An own song's page has **Share**. It builds a link to `/songs/shared?song=…` that carries the song's title and
  music, compressed (`deflate-raw`) and written in base64url. Where the browser can share (a phone), it opens the
  share sheet; elsewhere it copies the link and says so.
- Opening the link shows the song as Songs would: its title, key, meter and tempo, and its chart's lines. **Add to
  Your songs** makes it one of the learner's own songs under the next number and opens it. Nothing is saved until
  then.
- A link that holds no song (cut short, changed, from a later format) says so, with a way to Songs.

## How

- The link's text is untrusted: it is read by the same reader the pieces store reads its own songs with
  (`readSharedSong` in `entities/piece`), so a link can hold nothing a save could not.
- `features/share-song`: `songLink` / `readSongLink` (format 1: `{ v, t, m }`), `ShareSongButton`.
- `features/edit-piece`: `addSong` makes an own song from a title and music.
- `pages/shared-song`: the page; its route validates `song` as text only, so the router carries no decoder.

## Not now

Sharing a version of a catalogue song (it has the catalogue's title already; a version could travel later) and
sharing takes (too large for a link).
