import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { Prisma, PrismaClient } from '@prisma/client'
import Store from 'electron-store'
import { WindowSize, WindowPosition, Message } from '../types'
import { streamText, generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { ChatMessageSchema, chatMessageSchema } from '../schema'

const openai = createOpenAI({
    apiKey: import.meta.env['MAIN_VITE_OPENAI_API_KEY']
})

let mainWindow: BrowserWindow
const store = new Store()
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: import.meta.env['MAIN_VITE_DATABASE_URL']
        }
    }
})

function createWindow(): void {
    const windowSize = store.get('windowSize') as WindowSize
    const windowPosition = store.get('windowPosition') as WindowPosition
    mainWindow = new BrowserWindow({
        width: windowSize?.width || 800,
        height: windowSize?.height || 670,
        minWidth: 1090,
        minHeight: 800,
        show: false,
        x: windowPosition?.x,
        y: windowPosition?.y,
        center: true,
        title: 'AI Chat',
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false,
            devTools: is.dev
        }
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
}

app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.electron')
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    mainWindow.on('resized', () => {
        const [width, height] = mainWindow.getSize()
        store.set('windowSize', {
            width,
            height
        })
    })

    mainWindow.on('moved', () => {
        const [x, y] = mainWindow.getPosition()
        store.set('windowPosition', {
            x,
            y
        })
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

ipcMain.handle('chat', async (ev, messages: Message[], _opts: ChatMessageSchema) => {
    try {
        const opts = chatMessageSchema.parse(_opts)

        const result = await streamText({
            model: openai(opts.model),
            messages: [
                ...messages.map((m) => ({
                    content: m.content,
                    role: m.role
                })),
                {
                    content: opts.content,
                    role: 'user'
                }
            ],
            temperature: opts.temperature,
            maxTokens: opts.maxTokens,
            topP: opts.topP,
            system: opts.initialPrompt?.content
        })

        let fullResponse = ''
        for await (const delta of result.textStream) {
            fullResponse += delta
            ev.sender.send('chat:response', delta)
        }

        ev.sender.send('chat:response-full', fullResponse)
        await prisma.$transaction([
            prisma.message.createMany({
                data: [
                    {
                        content: opts.content,
                        role: 'user',
                        chatId: opts.chatId ?? ''
                    },
                    {
                        content: fullResponse,
                        role: 'system',
                        chatId: opts.chatId ?? ''
                    }
                ]
            }),
            prisma.chat.update({
                where: {
                    id: opts.chatId
                },
                data: {
                    updatedAt: new Date()
                }
            })
        ])
    } catch (error) {
        ev.sender.send('chat:error', 'Something went wrong.')
    }
})

ipcMain.handle('send:initial:chat', async (_ev, id: string) => {
    try {
        const chat = await prisma.chat.findUnique({
            where: {
                id
            },
            include: {
                messages: true
            }
        })

        if (!chat) {
            return 'Chat not found.'
        }

        return chat
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return error.message
        }

        return 'Something went wrong.'
    }
})

ipcMain.handle('send:all:chats', async (_ev) => {
    try {
        const chats = await prisma.chat.findMany({
            orderBy: {
                updatedAt: 'desc'
            }
        })
        return chats
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return error.message
        }

        return 'Something went wrong.'
    }
})

ipcMain.handle('create:chat', async () => {
    const chat = await prisma.chat.create({
        data: {
            name: 'Untitled Chat'
        }
    })

    return chat.id
})

ipcMain.handle('rename:chat', async (_ev, id: string, title: string) => {
    try {
        await prisma.chat.update({
            where: {
                id
            },
            data: {
                name: title
            }
        })
        return true
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return error.message
        }

        return 'Something went wrong.'
    }
})

ipcMain.handle('delete:chat', async (_ev, id: string) => {
    try {
        await prisma.$transaction([
            prisma.message.deleteMany({
                where: {
                    chatId: id
                }
            }),
            prisma.chat.delete({
                where: {
                    id
                }
            })
        ])
        return true
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return error.message
        }

        return 'Something went wrong.'
    }
})

ipcMain.handle('chat:update:title', async (_ev, opts: ChatMessageSchema) => {
    try {
        const { text } = await generateText({
            model: openai('gpt-3.5-turbo'),
            prompt: 'Generate a title for the chat based on the following message ' + opts.content,
            system: 'You are a title generator. You generate titles for chats based on the message provided. The title should be short but descriptive. You return the title in the form of a single sentence without quotes.',
            maxTokens: 50
        })

        await prisma.chat.update({
            where: {
                id: opts.chatId
            },
            data: {
                name: text.replaceAll('"', '')
            }
        })
        return true
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return error.message
        }

        return 'Something went wrong.'
    }
})

ipcMain.handle('save:preset', async (_ev, opts: ChatMessageSchema & { title: string }) => {
    try {
        await prisma.preset.create({
            data: {
                title: opts.title,
                content: opts.initialPrompt?.content,
                model: opts.model,
                temperature: opts.temperature,
                maxTokens: opts.maxTokens,
                topP: opts.topP,
                role: opts.initialPrompt?.role
            }
        })
        return true
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return error.message
        }

        return 'Something went wrong.'
    }
})

ipcMain.handle('load:presets', async () => {
    try {
        const presets = await prisma.preset.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })
        return presets
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return error.message
        }

        return 'Something went wrong.'
    }
})
