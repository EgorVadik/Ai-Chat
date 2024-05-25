import { MessageSquarePlus, SlidersHorizontal } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { ChatHistory } from '@renderer/components/chat-history'
import { useNavigate } from 'react-router-dom'
import { Tooltip, TooltipContent, TooltipTrigger } from '@renderer/components/ui/tooltip'
import { useSetAtom } from 'jotai'
import { messagesAtom } from '@renderer/atoms'

export const SideNav = () => {
    const navigate = useNavigate()
    const setMessages = useSetAtom(messagesAtom)

    return (
        <aside className="inset-y fixed left-0 z-20 flex h-full flex-col border-r">
            <div className="border-b p-2">
                <Button
                    variant="outline"
                    size="icon"
                    aria-label="New Chat"
                    onClick={() => {
                        navigate('/')
                        setMessages([])
                    }}
                >
                    <MessageSquarePlus className="size-5" />
                </Button>
            </div>
            <nav className="grid gap-1 p-2">
                <ChatHistory />
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-lg"
                            aria-label="Presets"
                            onClick={() => navigate('/presets')}
                        >
                            <SlidersHorizontal className="size-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={5}>
                        Presets
                    </TooltipContent>
                </Tooltip>
            </nav>
        </aside>
    )
}
