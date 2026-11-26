import { useNavigate } from '@tanstack/react-router'
import { useRef, useState, type ReactNode } from 'react'
import { useLibraryStoreApi, type FolderId } from '@/entities/library'
import { usePiecesStoreApi, type OwnSongId } from '@/entities/piece'
import { importSong } from '../import-song'
import { readSongFile, SONG_FILE_TYPES } from '../model/read-song-file'
import { ImportSheet, type ImportState } from './ImportSheet'

/**
 * Import (ADR 0107, R72's IMPFORM): New › Import opens its sheet on Choose a file (`choose`); a
 * MusicXML or MIDI file chosen there or dropped (`importFile`) becomes the learner's own song where
 * the learner is (`folder`, else Home), and the sheet reports it (what came in, what was left out)
 * before Open song; a file that is no song says why; a reading closed before the file is read makes
 * nothing. `view` holds the file picker and the sheet.
 */
export function useSongImport(folder: FolderId | null): {
  choose: () => void
  importFile: (file: File) => void
  view: ReactNode
} {
  const pieces = usePiecesStoreApi()
  const library = useLibraryStoreApi()
  const navigate = useNavigate()
  const picker = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<ImportState>({ kind: 'idle' })
  const [made, setMade] = useState<OwnSongId | null>(null)
  // The reading under way: one closed before its file is read, or overtaken by another, makes nothing.
  const reading = useRef(0)
  const openSong = (id: OwnSongId) =>
    void navigate({ to: '/songs/$pieceId', params: { pieceId: id } })
  const importFile = (file: File) => {
    const ticket = (reading.current += 1)
    setState({ kind: 'reading', name: file.name })
    void readSongFile(file).then((read) => {
      if (ticket !== reading.current) return
      if (!read.ok) {
        setState({ kind: 'failed', name: file.name, problem: read.problem })
        return
      }
      const id = importSong(pieces, library, read.song, folder)
      setMade(id)
      setState({ kind: 'done', title: read.song.title, leftOut: read.leftOut })
    })
  }
  // The sheet's Choose a file: the system's file picker.
  const pick = () => picker.current?.click()
  // New › Import: the sheet, on Choose a file.
  const choose = () => setState({ kind: 'choosing' })
  const view = (
    <>
      <input
        ref={picker}
        type="file"
        accept={SONG_FILE_TYPES}
        hidden
        tabIndex={-1}
        onChange={(event) => {
          const [file] = event.target.files ?? []
          // Cleared, so the same file chosen again is read again.
          event.target.value = ''
          if (file) importFile(file)
        }}
      />
      <ImportSheet
        state={state}
        onChoose={pick}
        onClose={() => {
          reading.current += 1
          setState({ kind: 'idle' })
        }}
        onOpen={() => {
          setState({ kind: 'idle' })
          if (made) openSong(made)
        }}
      />
    </>
  )
  return { choose, importFile, view }
}
