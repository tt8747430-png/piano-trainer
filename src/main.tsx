import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createProgressStore } from '@/entities/progress'
import { createSettingsStore } from '@/entities/settings'
import '@/shared/i18n'
import { App } from './app/App'
import { createServices } from './app/composition-root'
import { createAppRouter } from './app/router'
import './styles/index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('index.html has no #root element')

createRoot(rootElement).render(
  <StrictMode>
    <App
      settingsStore={createSettingsStore()}
      progressStore={createProgressStore()}
      services={createServices()}
      router={createAppRouter()}
    />
  </StrictMode>,
)
