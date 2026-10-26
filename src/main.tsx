import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createLibraryStore } from '@/entities/library'
import { createDiagramInversionsStore } from '@/entities/diagram-inversion'
import { createPatternsStore } from '@/entities/pattern'
import { createPiecesStore } from '@/entities/piece'
import { createProgressStore } from '@/entities/progress'
import { createSettingsStore } from '@/entities/settings'
import { createTakesStore } from '@/entities/take'
import { createViewsStore } from '@/entities/views'
import '@/shared/i18n'
import { App } from './app/App'
import { createServices } from './app/composition-root'
import { createAppRouter } from './app/router'
import './styles/index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('index.html has no #root element')

// One store each of the learner's patterns, pieces, takes and library: the screens read them, and
// the router asks them what is there.
const patternsStore = createPatternsStore()
const piecesStore = createPiecesStore()
const takesStore = createTakesStore()
const libraryStore = createLibraryStore()

createRoot(rootElement).render(
  <StrictMode>
    <App
      settingsStore={createSettingsStore()}
      progressStore={createProgressStore()}
      patternsStore={patternsStore}
      piecesStore={piecesStore}
      takesStore={takesStore}
      libraryStore={libraryStore}
      diagramInversionsStore={createDiagramInversionsStore()}
      services={createServices()}
      router={createAppRouter({
        views: createViewsStore(),
        patterns: patternsStore,
        pieces: piecesStore,
        takes: takesStore,
        library: libraryStore,
      })}
    />
  </StrictMode>,
)
