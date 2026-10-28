import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/shared/i18n'
import { App } from './app/App'
import { createServices, createStores } from './app/composition-root'
import { createAppRouter } from './app/router'
import './styles/index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('index.html has no #root element')

const stores = createStores()

createRoot(rootElement).render(
  <StrictMode>
    <App stores={stores} services={createServices()} router={createAppRouter(stores)} />
  </StrictMode>,
)
