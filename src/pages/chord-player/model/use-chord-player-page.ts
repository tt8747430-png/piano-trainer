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
import { openLink } from '@/features/share-chord-sheet'
import { useChordShare } from '@/shared/lib/chord-share'
import { lineSheet, sheetToText } from '@/shared/lib/arrangement'
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
 * hand), a progression put in hand on arrival with Undo, a shared sheet's link opened among My chord
 * sheets (R39-10), New, Save as my chord sheet, Share, and the links that open another sheet.
 */
export function useChordPlayerPage() {
  const { t } = useTranslation('practice')
  const view = useSearch({ from: '/shell/practice/chord-player' })
  const navigate = useNavigate()
  const store = useChordSheetsStoreApi()
  const hand = useChordSheet(view.sheet)
  const saved = useChordSheets(selectSaved(view.sheet))
  const [saving, setSaving] = useState<string | null>(null)
  /** Share open: on a saved sheet; for the sheet in hand, once Save as my chord sheet has named it. */
  const [sharing, setSharing] = useState(false)
  const [shareAfterSave, setShareAfterSave] = useState(false)
  const chordShare = useChordShare()
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

  // A progression in the URL is put in hand once; a shared sheet's link opens it among My chord sheets.
  const arrived = useRef(false)
  useEffect(() => {
    if (arrived.current || (view.p === undefined && view.link === undefined)) return
    arrived.current = true
    const current = store.getState().scratch
    if (view.link !== undefined) {
      const linkId = view.link
      say(t('chordPlayer.online.opening'))
      void openLink(chordShare, store, linkId).then((opened) => {
        if (opened.ok && opened.value) return openSheet(opened.value)
        openSheet(undefined)
        say(t(opened.ok ? 'chordPlayer.online.notFound' : 'chordPlayer.online.openFailed'))
      })
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
  }, [view.p, view.link])

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

  const hasChords = hand?.sheet.sections.some((section) => section.bars.length > 0) ?? false
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
      if (shareAfterSave) {
        setShareAfterSave(false)
        setSharing(true)
      }
    },
    /** Share: a saved sheet's sheet at once; the sheet in hand is named first (it is shared as one of mine). */
    share() {
      if (saved) return setSharing(true)
      setShareAfterSave(true)
      setSaving('')
    },
    saved,
    sharing,
    setSharing,
    closeSaving() {
      setSaving(null)
      setShareAfterSave(false)
    },
  }
}
