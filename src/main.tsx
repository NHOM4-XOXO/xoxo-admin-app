import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import './index.css'
import App from './App.tsx'
import './utils/debug' // Import debug utilities
import './utils/testReload' // Import test utilities

// Debug logging
console.log('🚀 App starting...', new Date().toISOString());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
