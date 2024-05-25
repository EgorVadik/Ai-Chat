import { Home } from '@renderer/pages/home'
import { Routes, Route } from 'react-router-dom'
import { PlaygroundControls } from './playground-controls'
import { MemoizedChat } from '@renderer/pages/chat'
import { Presets } from '@renderer/pages/presets'

export const ChatRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<PlaygroundControls />}>
                <Route index element={<Home />} />
                <Route path="/chat/:id" element={<MemoizedChat />} />
            </Route>
            <Route path="/presets" element={<Presets />} />
        </Routes>
    )
}
