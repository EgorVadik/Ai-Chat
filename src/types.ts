export type WindowSize = {
    width: number
    height: number
}

export type WindowPosition = {
    x: number
    y: number
}

export type Message = {
    content: string
    role: 'user' | 'system' | 'assistant'
    isStreaming?: boolean
}
