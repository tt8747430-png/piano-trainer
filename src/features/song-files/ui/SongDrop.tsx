import { FileUp } from 'lucide-react'
import { useRef, useState, type DragEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

const holdsFiles = (event: DragEvent) => event.dataTransfer.types.includes('Files')

/**
 * Where a file dragged from the computer is dropped to import it (ADR 0107, a laptop's): while one is
 * over it, a panel says so over the page; the first file dropped is handed on.
 */
export function SongDrop({
  onFile,
  children,
}: {
  onFile: (file: File) => void
  children: ReactNode
}) {
  const { t } = useTranslation('songs')
  // Entering a child leaves its parent: the panel stays while any part of the page is under it.
  const depth = useRef(0)
  const [over, setOver] = useState(false)
  return (
    <div
      className="contents"
      onDragEnter={(event) => {
        if (!holdsFiles(event)) return
        event.preventDefault()
        depth.current += 1
        setOver(true)
      }}
      onDragOver={(event) => {
        if (!holdsFiles(event)) return
        event.preventDefault()
        event.dataTransfer.dropEffect = 'copy'
      }}
      onDragLeave={(event) => {
        if (!holdsFiles(event)) return
        depth.current = Math.max(0, depth.current - 1)
        if (depth.current === 0) setOver(false)
      }}
      onDrop={(event) => {
        if (!holdsFiles(event)) return
        event.preventDefault()
        depth.current = 0
        setOver(false)
        const [file] = event.dataTransfer.files
        if (file) onFile(file)
      }}
    >
      {children}
      {over ? (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-4 z-50 flex flex-col items-center justify-center gap-3 rounded-4xl border-2 border-dashed border-primary bg-background/90 p-6 text-center"
        >
          <FileUp className="size-10 text-primary" />
          <p className="max-w-sm text-lg font-semibold text-pretty">{t('import.drop')}</p>
        </div>
      ) : null}
    </div>
  )
}
