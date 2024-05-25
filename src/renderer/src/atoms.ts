import { atom } from 'jotai'
import { Message } from '../../types'

export const streamedMessageAtom = atom<string | null>(null)
export const messagesAtom = atom<Message[]>([])
