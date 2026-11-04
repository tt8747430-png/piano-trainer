import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  selectSaved,
  useChordSheets,
  useChordSheetsStoreApi,
  type ChordSheetEntry,
} from '@/entities/chord-sheet'
import { holdSheet, saveAsMine, startNew } from '@/features/manage-chord-sheets'
import { shareLink } from '@/shared/lib'
import { lineSheet, sheetToText, textToSheet } from '@/shared/lib/arrangement'
import {
  C_MAJOR,
  keyFromParam,
  numeralChord,
  numeralsLine,
  parseNumerals,
  type Numeral,
} from '@/shared/lib/music'
import { confirm, say } from '@/shared/ui'
import { useChordSheet, type ChordPlayerRoutes } from '@/widgets/chord-player'

/**
 * The Chord player page's acts (R29 CP4, CP5): the sheet open (one of My chord sheets, or the sheet in
 * hand), a progression or a shared sheet put in hand on arrival with Undo, New, Save as my chord
 * sheet, Share link, and the links that open another sheet.
 */
export function useChordPlayerPage() {
  const { t } = useTranslation('practice')
  const view = useSearch({ from: '/shell/practice/chord-player' })
  const navigate = useNavigate()
  const store = useChordSheetsStoreApi()
  const hand = useChordSheet(view.sheet)
  const saved = useChordSheets(selectSaved(view.sheet))
  const [saving, setSaving] = useState<string | null>(null)
  const name = saved?.name ?? t('chordPlayer.untitled')

  const openSheet = (sheet: string | undefined) =>
    void navigate({
      to: '/practice/chord-player',
      search: sheet === undefined ? {} : { sheet },
      replace: true,
    })

  /** A sheet put in hand, the one it replaced back with Undo. */
  const hold = (entry: ChordSheetEntry, said: string) => {
    const before = holdSheet(store, entry)
    openSheet(undefined)
    say(t('chordPlayer.opened', { name: said }), {
      label: t('chordPlayer.undo'),
      onClick: () => void holdSheet(store, before),
    })
  }

  // A progression or a shared sheet in the URL is put in hand once, then dropped from it.
  const arrived = useRef(false)
  useEffect(() => {
    if (arrived.current || (view.p === undefined && view.share === undefined)) return
    arrived.current = true
    const current = store.getState().scratch
    if (view.share !== undefined) {
      const sheet = textToSheet(view.share)
      if (sheet) hold({ ...current, text: sheetToText(sheet) }, t('chordPlayer.untitled'))
      else openSheet(undefined)
      return
    }
    const numerals = parseNumerals(view.p ?? '') ?? []
    const key = view.key === undefined ? C_MAJOR : keyFromParam(view.key)
    const sheet = lineSheet(
      numerals.map((numeral) => numeralChord(numeral, key, 'triads')),
      key,
      '4/4',
    )
    hold({ ...current, text: sheetToText(sheet) }, numeralsLine(numerals))
    // Once, on arrival: the page's own acts change the sheet from here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view.p, view.share])

  // An id that names none of My chord sheets (deleted, or another device's) opens the sheet in hand.
  useEffect(() => {
    if (view.sheet !== undefined && !hand) openSheet(undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view.sheet, hand === null])

  const routes: ChordPlayerRoutes = {
    openSheet,
    openLine(numerals: readonly Numeral[], minor: boolean, said: string) {
      if (!hand) return
      const key = { tonic: hand.sheet.key.tonic, minor }
      const sheet = lineSheet(
        numerals.map((numeral) => numeralChord(numeral, key, 'triads')),
        key,
        hand.sheet.meter,
      )
      hold({ ...hand.entry, text: sheetToText(sheet) }, said)
    },
  }

  const hasChords = hand?.sheet.sections.some((section) => section.chords.length > 0) ?? false
  return {
    hand,
    name,
    sheetId: view.sheet,
    routes,
    saving,
    setSaving,
    async startNew() {
      // A saved sheet keeps its edits; the sheet in hand's are lost, asked first.
      const yes =
        saved !== undefined ||
        !hasChords ||
        (await confirm({
          title: t('chordPlayer.newAsk.title'),
          body: t('chordPlayer.newAsk.body'),
          action: t('chordPlayer.newAsk.action'),
          destructive: true,
        }))
      if (!yes) return
      startNew(store)
      openSheet(undefined)
    },
    saveAs(named: string) {
      if (!hand) return
      const id = saveAsMine(store, named, hand.entry)
      if (!id) return say(t('chordPlayer.save.full'))
      setSaving(null)
      openSheet(id)
      say(t('chordPlayer.save.saved', { name: named.trim() }))
    },
    async share() {
      if (!hand) return
      const path = `/practice/chord-player?share=${encodeURIComponent(sheetToText(hand.sheet))}`
      const shared = await shareLink({ title: name, path })
      if (shared === 'copied') say(t('chordPlayer.shared'))
      if (shared === 'failed') say(t('chordPlayer.shareFailed'))
    },
  }
}
