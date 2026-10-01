import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createPatternsStore } from '@/entities/pattern'
import { createProgressStore } from '@/entities/progress'
import { createSettingsStore } from '@/entities/settings'
import { createViewsStore } from '@/entities/views'
import '@/shared/i18n'
import { App } from './app/App'
import { createServices } from './app/composition-root'
import { createAppRouter } from './app/router'
import './styles/index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('index.html has no #root element')

// One store of the learner's patterns: the screens read it, and the router asks it what is there.
const patternsStore = createPatternsStore()

createRoot(rootElement).render(
  <StrictMode>
    <App
      settingsStore={createSettingsStore()}
      progressStore={createProgressStore()}
      patternsStore={patternsStore}
      services={createServices()}
      router={createAppRouter({ views: createViewsStore(), patterns: patternsStore })}
    />
  </StrictMode>,
)
