import { useScoreEditorContext } from '../model/editor-context'
import { ChordSymbolField } from './ChordSymbolField'
import { FingeringField } from './FingeringField'
import { LyricsField } from './LyricsField'

/** The field open over the sheet, standing at the place the sheet drew for it (ADR 0096). */
export function OpenField({ anchor }: { anchor: HTMLElement | null }) {
  const { view } = useScoreEditorContext()
  const { field } = view
  switch (field?.kind) {
    case 'chord':
      return <ChordSymbolField anchor={anchor} />
    case 'lyrics':
      return <LyricsField anchor={anchor} verse={field.verse} />
    case 'fingering':
      return <FingeringField anchor={anchor} />
    case undefined:
      return null
  }
}
