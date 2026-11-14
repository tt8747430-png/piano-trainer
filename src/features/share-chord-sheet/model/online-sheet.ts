import {
  MOST_SHEETS,
  NEW_ENTRY,
  sheetName,
  type ChordSheetsStore,
  type OnlineLink,
  type SavedChordSheet,
} from '@/entities/chord-sheet'
import type { ChordSharePort, OnlineSheet } from '@/shared/api/chord-share'
import type { NetResult } from '@/shared/api/network'
import { mergeSheetTexts, sheetToText, textToSheet } from '@/shared/lib/arrangement'

const sheetOf = (store: ChordSheetsStore, id: string) =>
  store.getState().mine.find((sheet) => sheet.id === id)

const withSheet = (
  store: ChordSheetsStore,
  id: string,
  change: (sheet: SavedChordSheet) => Partial<SavedChordSheet>,
) =>
  store.setState((state) => ({
    mine: state.mine.map((sheet) => (sheet.id === id ? { ...sheet, ...change(sheet) } : sheet)),
  }))

const contentOf = (sheet: SavedChordSheet, text: string) => ({
  body: text,
  style: sheet.style,
  tempo: sheet.tempo,
})

/**
 * Share (R39-10): one of My chord sheets made an online sheet, or its access changed: its saved chords
 * (never the draft) written online, View only or Can edit; the link's id.
 */
export async function shareSheet(
  port: ChordSharePort,
  store: ChordSheetsStore,
  id: string,
  canEdit: boolean,
): Promise<NetResult<string>> {
  const sheet = sheetOf(store, id)
  if (!sheet) return { ok: false, reason: 'refused' }
  // A sheet opened from someone's link is theirs: its access is not this copy's to set.
  if (sheet.online && !sheet.online.mine) return { ok: true, value: sheet.online.id }
  const shared = await port.share(id, sheet.name, contentOf(sheet, sheet.text), canEdit)
  if (!shared.ok) return shared
  const read = await port.read(shared.value)
  const revision = read.ok && read.value ? read.value.revision : 0
  withSheet(store, id, () => ({
    online: { id: shared.value, canEdit, mine: true, revision, unsent: false },
  }))
  return shared
}

/** The sheet as the link has it now taken in: its chords, and a draft rebased on them bar by bar. */
export function takeOnline(store: ChordSheetsStore, id: string, online: OnlineSheet): void {
  withSheet(store, id, (sheet) => {
    const link: OnlineLink = {
      id: sheet.online?.id ?? '',
      canEdit: online.canEdit,
      mine: online.mine,
      revision: online.revision,
      unsent: sheet.online?.unsent ?? false,
    }
    const body = textToSheet(online.body)
    if (!body) return { online: link }
    const text = sheetToText(body)
    return {
      // The owner keeps their own name; a link's copy shows the owner's.
      name: online.mine ? sheet.name : (sheetName(online.name) ?? sheet.name),
      text,
      draft: sheet.draft === null ? null : mergeSheetTexts(sheet.text, sheet.draft, text),
      style: online.style,
      tempo: online.tempo,
      online: link,
    }
  })
}

/**
 * Save on a shared sheet (R39-10): the draft becomes its chords, merged bar by bar with what others
 * saved since, and written online; offline, it is saved here and marked unsent, written when the
 * connection is back (`sendUnsent`).
 */
export async function saveOnline(
  port: ChordSharePort,
  store: ChordSheetsStore,
  id: string,
): Promise<NetResult<number>> {
  const sheet = sheetOf(store, id)
  const link = sheet?.online
  if (!sheet || !link || !(link.mine || link.canEdit)) return { ok: false, reason: 'refused' }
  const base = sheet.text
  const mine = sheet.draft ?? sheet.text
  withSheet(store, id, () => ({ text: mine, draft: null, online: { ...link, unsent: true } }))
  return send(port, store, id, base, mine)
}

/** A save made offline written once the connection is back. */
export async function sendUnsent(
  port: ChordSharePort,
  store: ChordSheetsStore,
  id: string,
): Promise<NetResult<number> | null> {
  const sheet = sheetOf(store, id)
  if (!sheet?.online?.unsent) return null
  return send(port, store, id, sheet.text, sheet.text)
}

async function send(
  port: ChordSharePort,
  store: ChordSheetsStore,
  id: string,
  base: string,
  mine: string,
): Promise<NetResult<number>> {
  const sheet = sheetOf(store, id)
  const link = sheet?.online
  if (!sheet || !link) return { ok: false, reason: 'refused' }
  const remote = await port.read(link.id)
  if (!remote.ok) return remote
  const merged =
    remote.value && remote.value.revision > link.revision
      ? mergeSheetTexts(base, mine, remote.value.body)
      : mine
  const written = await port.write(link.id, contentOf(sheet, merged))
  if (!written.ok) return written
  withSheet(store, id, (now) => ({
    text: merged,
    online: now.online && { ...now.online, revision: written.value, unsent: false },
  }))
  return written
}

/**
 * A link opened (R39-10): the sheet it names kept among My chord sheets (the one kept before, where it
 * was opened already), its id; none for a link that names no sheet or a full list.
 */
export async function openLink(
  port: ChordSharePort,
  store: ChordSheetsStore,
  linkId: string,
): Promise<NetResult<string | null>> {
  const kept = store.getState().mine.find((sheet) => sheet.online?.id === linkId)
  const read = await port.read(linkId)
  if (!read.ok) return kept ? { ok: true, value: kept.id } : read
  if (!read.value) return { ok: true, value: kept?.id ?? null }
  if (kept) {
    takeOnline(store, kept.id, read.value)
    return { ok: true, value: kept.id }
  }
  const { mine, nextId } = store.getState()
  const body = textToSheet(read.value.body)
  if (mine.length >= MOST_SHEETS || !body) return { ok: true, value: null }
  const id = `sheet-${nextId}`
  store.setState({
    mine: [
      {
        ...NEW_ENTRY,
        id,
        name: sheetName(read.value.name) ?? id,
        text: sheetToText(body),
        style: read.value.style,
        tempo: read.value.tempo,
        online: {
          id: linkId,
          canEdit: read.value.canEdit,
          mine: read.value.mine,
          revision: read.value.revision,
          unsent: false,
        },
      },
      ...mine,
    ],
    nextId: nextId + 1,
  })
  return { ok: true, value: id }
}
