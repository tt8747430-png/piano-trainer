import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/shared/i18n'
import { App } from './app/App'
import {
  createAdmin,
  createAuth,
  createBackend,
  createCloud,
  createContent,
  createContentEditing,
  createContentUpdates,
  createFeatures,
  createPublicLibrary,
  createServices,
  createStores,
  createSync,
} from './app/composition-root'
import { applyKeptContent, startContentUpdates } from './app/content/content-updates'
import { createAppRouter } from './app/router'
import './styles/index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('index.html has no #root element')

const backend = createBackend()
// What the device keeps of the database's newer content is read before the first screen reads the
// catalog; what changed since is asked for once the app has painted, for the next start.
const contentUpdates = createContentUpdates(backend)
await applyKeptContent(contentUpdates.cache)
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
      publicLibrary={createPublicLibrary(backend)}
      admin={createAdmin(backend)}
      features={createFeatures(backend)}
      contentEditing={createContentEditing(backend)}
      router={createAppRouter({ ...stores, content: createContent() })}
    />
  </StrictMode>,
)

startContentUpdates(contentUpdates)
