import { useScoreEditorContext } from '../model/editor-context'
import { ChordSymbolField } from './ChordSymbolField'

/** The field open over the sheet, standing at the place the sheet drew for it (ADR 0096). */
export function OpenField({ anchor }: { anchor: HTMLElement | null }) {
  const { view } = useScoreEditorContext()
  switch (view.field?.kind) {
    case 'chord':
      return <ChordSymbolField anchor={anchor} />
    case undefined:
      return null
  }
}
