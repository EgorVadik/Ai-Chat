import { Popover, PopoverContent, PopoverTrigger } from '@renderer/components/ui/popover'
import { useState } from 'react'
import { Button, buttonVariants } from '@renderer/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { type TitleSchema, titleSchema } from '../../../schema'
import { cn } from '@renderer/lib/utils'

type RenameChatProps = {
    children: React.ReactNode
    chatId: string
    previousTitle: string
}

export const RenameChat = ({ children, chatId, previousTitle }: RenameChatProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const form = useForm<TitleSchema>({
        resolver: zodResolver(titleSchema),
        defaultValues: {
            title: previousTitle
        }
    })

    const onSubmit = async (data: TitleSchema) => {
        const res = await window.electron.ipcRenderer.invoke('rename:chat', chatId, data.title)
        if (typeof res === 'string') {
            return toast.error(res)
        }
        window.location.reload()
        return toast.success('Chat renamed successfully.')
    }

    return (
        <Popover open={isOpen}>
            <PopoverTrigger
                onClick={(e) => {
                    e.preventDefault()
                    setIsOpen(!isOpen)
                }}
                className={cn(
                    buttonVariants({
                        variant: 'ghost'
                    }),
                    'w-full'
                )}
            >
                {children}
            </PopoverTrigger>
            <PopoverContent
                onPointerMove={(e) => e.preventDefault()}
                onPointerOver={(e) => e.preventDefault()}
                onPointerLeave={(e) => e.preventDefault()}
                onPointerEnter={(e) => e.preventDefault()}
                onPointerDownOutside={() => setIsOpen(false)}
                onEscapeKeyDown={() => setIsOpen(false)}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    form.handleSubmit(onSubmit)()
                                                }

                                                if (e.key === ' ') {
                                                    e.stopPropagation()
                                                }
                                            }}
                                            placeholder={
                                                previousTitle === null ? 'Untitled' : previousTitle
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-end justify-end">
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                                className="flex items-center justify-center gap-2"
                                onClick={() => form.handleSubmit(onSubmit)()}
                            >
                                {form.formState.isSubmitting && (
                                    <Loader2 className="animate-spin" />
                                )}
                                Submit
                            </Button>
                        </div>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    )
}
