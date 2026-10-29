import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/shared/i18n'
import { App } from './app/App'
import {
  createAuth,
  createBackend,
  createCloud,
  createContent,
  createServices,
  createStores,
  createSync,
} from './app/composition-root'
import { createAppRouter } from './app/router'
import './styles/index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('index.html has no #root element')

const backend = createBackend()
const sync = createSync(createCloud(backend))
// The stores save through the sync's storage, so it knows what changed since the last sync.
const stores = createStores({ storage: sync.storage })

createRoot(rootElement).render(
  <StrictMode>
    <App
      stores={stores}
      services={createServices()}
      auth={createAuth(backend)}
      sync={sync}
      router={createAppRouter({ ...stores, content: createContent() })}
    />
  </StrictMode>,
)
