import { z } from 'zod'

export enum OpenAIChatModelId {
    GPT4o = 'gpt-4o',
    GPT4o20240513 = 'gpt-4o-2024-05-13',
    GPT4Turbo = 'gpt-4-turbo',
    GPT4Turbo20240409 = 'gpt-4-turbo-2024-04-09',
    GPT4TurboPreview = 'gpt-4-turbo-preview',
    GPT40125Preview = 'gpt-4-0125-preview',
    GPT41106Preview = 'gpt-4-1106-preview',
    GPT4VisionPreview = 'gpt-4-vision-preview',
    GPT4 = 'gpt-4',
    GPT40613 = 'gpt-4-0613',
    GPT432k = 'gpt-4-32k',
    GPT432k0613 = 'gpt-4-32k-0613',
    GPT35Turbo0125 = 'gpt-3.5-turbo-0125',
    GPT35Turbo = 'gpt-3.5-turbo',
    GPT35Turbo1106 = 'gpt-3.5-turbo-1106',
    GPT35Turbo16k = 'gpt-3.5-turbo-16k',
    GPT35Turbo0613 = 'gpt-3.5-turbo-0613',
    GPT35Turbo16k0613 = 'gpt-3.5-turbo-16k-0613'
}

export const MODELS_ID_ARRAY = Object.values(OpenAIChatModelId)

export const chatMessageSchema = z
    .object({
        content: z.string().trim().min(1),
        model: z.nativeEnum(OpenAIChatModelId),
        temperature: z
            .number()
            .min(0)
            .max(1)
            .or(z.string())
            .optional()
            .transform((value) => {
                if (typeof value === 'string' && value.trim() === '') {
                    return undefined
                }
                return value as number
            }),
        maxTokens: z
            .number()
            .min(1)
            .or(z.string())
            .optional()
            .transform((value) => {
                if (typeof value === 'string' && value.trim() === '') {
                    return undefined
                }
                return value as number
            }),
        topP: z
            .number()
            .min(0)
            .max(1)
            .or(z.string())
            .optional()
            .transform((value) => {
                if (typeof value === 'string' && value.trim() === '') {
                    return undefined
                }
                return value as number
            }),
        chatId: z.string().cuid().optional(),
        initialPrompt: z
            .object({
                content: z
                    .string()
                    .optional()
                    .transform((value) => {
                        if (value?.trim() === '') {
                            return undefined
                        }
                        return value
                    }),
                role: z
                    .enum(['user', 'system', 'assistant'])
                    .or(z.string())
                    .optional()
                    .transform((value) => {
                        if (typeof value === 'string' && value.trim() === '') {
                            return undefined
                        }
                        return value as 'user' | 'system' | 'assistant'
                    })
            })
            .optional()
            .refine(
                (data) => {
                    if (data != null) {
                        if (data.content == null && data.role == null) {
                            return true
                        }

                        if (data.role != null && data.content == null) {
                            return false
                        }

                        if (data.role == null && data.content != null) {
                            return false
                        }
                    }

                    return true
                },
                {
                    message: 'Must have both content and role or neither',
                    path: ['content']
                }
            )
    })
    .refine(
        (data) => {
            if (data.topP != null && data.temperature != null) {
                return false
            }
            return true
        },
        {
            path: ['topP'],
            message: 'Cannot have both topP and temperature'
        }
    )

export type ChatMessageSchema = z.infer<typeof chatMessageSchema>

export const titleSchema = z.object({
    title: z.string().trim().min(1, 'Title is required')
})

export type TitleSchema = z.infer<typeof titleSchema>
