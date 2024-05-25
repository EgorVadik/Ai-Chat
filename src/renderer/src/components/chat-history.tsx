import { Chat } from '@prisma/client'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@renderer/components/ui/tooltip'
import { Button } from '@renderer/components/ui/button'
import { History } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@renderer/components/ui/sheet'

import { ChatHistoryCard } from './chat-history-card'
import { ScrollArea } from './ui/scroll-area'

export const ChatHistory = () => {
    const { pathname } = useLocation()
    const [chats, setChats] = useState<Chat[]>([])

    useEffect(() => {
        const getChats = async () => {
            const response = await window.electron.ipcRenderer.invoke('send:all:chats')
            if (typeof response === 'string') {
                return toast.error(response)
            }

            return setChats(response)
        }

        getChats()
    }, [pathname])

    return (
        <Sheet>
            <Tooltip>
                <TooltipTrigger asChild>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-lg"
                            aria-label="History"
                        >
                            <History className="size-5" />
                        </Button>
                    </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent side="left" sideOffset={5}>
                    History
                </TooltipContent>
            </Tooltip>
            <SheetContent side={'left'}>
                <SheetHeader>
                    <SheetTitle>Chat History</SheetTitle>
                </SheetHeader>
                {chats.length === 0 ? (
                    <p className="text-2xl text-center h-full flex items-center justify-center font-bold">
                        No chat history available.
                    </p>
                ) : (
                    <ScrollArea className="h-[calc(100vh-5rem)]">
                        <div className="flex flex-col gap-4 pt-5">
                            {chats.map((chat) => (
                                <ChatHistoryCard key={chat.id} chat={chat} pathname={pathname} />
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </SheetContent>
        </Sheet>
    )
}
