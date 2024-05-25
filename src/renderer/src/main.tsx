import './assets/main.css'

import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@renderer/components/theme-provider'
import { HashRouter } from 'react-router-dom'
import { ChatRoutes } from './components/chat-routes'
import { Toaster } from './components/ui/sonner'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <HashRouter>
                <ChatRoutes />
            </HashRouter>
            <Toaster />
        </ThemeProvider>
    </>
)
