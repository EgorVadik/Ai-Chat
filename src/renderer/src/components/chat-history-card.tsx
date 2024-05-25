import type { Chat } from '@prisma/client'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@renderer/components/ui/popover'
import { cn } from '@renderer/lib/utils'
import { RenameChat } from './rename-chat'
import { DeleteChat } from './delete-chat'
import { buttonVariants } from './ui/button'
import { useState } from 'react'

export const ChatHistoryCard = ({ chat, pathname }: { chat: Chat; pathname: string }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Link
            to={`/chat/${chat.id}`}
            key={chat.id}
            className={cn(
                'flex gap-4 w-full justify-between items-center border rounded-lg p-4 hover:bg-muted/40 duration-200',
                { 'bg-muted/40': pathname === `/chat/${chat.id}` }
            )}
        >
            <div className="flex flex-col">
                <span className="line-clamp-1 break-all">{chat.name}</span>
                <span className="text-muted-foreground text-sm">
                    {chat.updatedAt.toDateString()}
                </span>
            </div>

            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger
                    className={cn(
                        buttonVariants({
                            size: 'icon',
                            variant: 'outline'
                        }),
                        'rounded-full shrink-0'
                    )}
                    onClick={(e) => {
                        e.preventDefault()
                        setIsOpen(!isOpen)
                    }}
                >
                    <MoreHorizontal />
                </PopoverTrigger>
                <PopoverContent
                    className="w-40 gap-2 flex flex-col"
                    onClick={(e) => e.preventDefault()}
                >
                    <RenameChat chatId={chat.id} previousTitle={chat.name}>
                        Rename
                    </RenameChat>
                    <DeleteChat chatId={chat.id}>Delete</DeleteChat>
                </PopoverContent>
            </Popover>
        </Link>
    )
}
