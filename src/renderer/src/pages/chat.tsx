import { useTheme } from '@renderer/components/theme-provider'
import { memo, useEffect, useMemo, useRef } from 'react'
import { MemoizedMessageCard, MessageCard } from '@renderer/components/message-card'
import { useAtomValue } from 'jotai'
import { messagesAtom, streamedMessageAtom } from '@renderer/atoms'

export const Chat = () => {
    const targetRef = useRef<HTMLDivElement>(null)
    const { theme } = useTheme()
    const messages = useAtomValue(messagesAtom)
    const streamedMessage = useAtomValue(streamedMessageAtom)
    const systemTheme = useMemo(
        () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
        [theme]
    )
    const isDarkMode = useMemo(
        () => theme === 'dark' || (theme === 'system' && systemTheme === 'dark'),
        [theme, systemTheme]
    )

    useEffect(() => {
        if (targetRef.current) {
            targetRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    useEffect(() => {
        if (targetRef.current) {
            targetRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [streamedMessage])

    return (
        <>
            <div className="flex-1 flex gap-4 flex-col mt-4 mx-4 min-h-[calc(100vh-16.5rem)]">
                {messages.map((message, index) => (
                    <MemoizedMessageCard key={index} message={message} isDarkMode={isDarkMode} />
                ))}
                {streamedMessage && (
                    <MessageCard
                        message={{
                            content: streamedMessage,
                            role: 'system'
                        }}
                        isDarkMode={isDarkMode}
                    />
                )}
                <div ref={targetRef} />
            </div>
        </>
    )
}

export const MemoizedChat = memo(Chat)
