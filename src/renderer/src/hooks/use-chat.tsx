import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChatMessageSchema, OpenAIChatModelId, chatMessageSchema } from '../../../schema'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useAtom, useSetAtom } from 'jotai'
import { messagesAtom, streamedMessageAtom } from '@renderer/atoms'

export const useChat = () => {
    const params = useParams()
    const { pathname } = useLocation()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const setStreamedMessage = useSetAtom(streamedMessageAtom)
    const [messages, setMessages] = useAtom(messagesAtom)
    const [loading, setLoading] = useState(false)
    const form = useForm<ChatMessageSchema>({
        resolver: zodResolver(chatMessageSchema),
        defaultValues: {
            content: '',
            model: OpenAIChatModelId.GPT35Turbo
        }
    })

    const handleSubmit = async (data: ChatMessageSchema) => {
        let id = params?.id

        if (pathname === '/') {
            const chatId: string = await window.electron.ipcRenderer.invoke('create:chat')
            navigate(`/chat/${chatId}?new=true`)
            id = chatId

            await window.electron.ipcRenderer.invoke('chat:update:title', {
                ...data,
                chatId: id
            })
        }

        if (!id && pathname.includes('chat')) {
            id = pathname.split('/').pop()
        }

        setLoading(true)
        setMessages((prev) => [...prev, { content: data.content, role: 'user' }])
        form.resetField('content')
        await window.electron.ipcRenderer.invoke('chat', messages, {
            ...data,
            chatId: id
        })
    }

    useEffect(() => {
        window.electron.ipcRenderer.on('chat:error', (_ev, error: string) => {
            setLoading(false)
            toast.error(error)
        })

        window.electron.ipcRenderer.on('chat:response', (_ev, response: string) => {
            setStreamedMessage((prev) => (prev ? prev + response : response))
        })

        window.electron.ipcRenderer.on('chat:response-full', (_ev, response: string) => {
            setLoading(false)
            setStreamedMessage(null)
            setMessages((prev) => [...prev, { content: response, role: 'system' }])
        })

        return () => {
            window.electron.ipcRenderer.removeAllListeners('chat:response')
            window.electron.ipcRenderer.removeAllListeners('chat:response-full')
            window.electron.ipcRenderer.removeAllListeners('chat:error')
        }
    }, [])

    useEffect(() => {
        if (pathname === '/' || pathname === '/presets') return setMessages([])
        let id = params?.id
        if (!id && pathname.includes('chat')) {
            id = pathname.split('/').pop()
        }

        window.electron.ipcRenderer.invoke('send:initial:chat', id).then((chat) => {
            if (typeof chat === 'string') {
                navigate('/')
                return toast.error(chat)
            }
            if (chat.messages.length !== 0 || searchParams.get('new') !== 'true') {
                setMessages(chat.messages)
            }
            return
        })
    }, [pathname])

    return { form, handleSubmit, loading }
}
