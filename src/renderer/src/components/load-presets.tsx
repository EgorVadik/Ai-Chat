import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@renderer/components/ui/dialog'
import { Button } from './ui/button'
import { Preset } from '@prisma/client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useChat } from '@renderer/hooks/use-chat'

type LoadPresetsProps = Pick<ReturnType<typeof useChat>, 'form'>

export const LoadPresets = ({ form }: LoadPresetsProps) => {
    const [presets, setPresets] = useState<Preset[]>([])

    useEffect(() => {
        window.electron.ipcRenderer.invoke('load:presets').then((res: Preset[] | string) => {
            if (typeof res === 'string') {
                toast.error(res)
                return
            }
            setPresets(res)
        })
    }, [])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button type="button" variant={'secondary'}>
                    Load Preset
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>All Presets</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    {presets.map((preset) => (
                        <Button
                            key={preset.id}
                            type="button"
                            variant={'secondary'}
                            onClick={() => {
                                form.setValue('model', (preset.model as any) ?? 'gpt-3.5-turbo')
                                form.setValue('temperature', preset.temperature ?? undefined)
                                form.setValue('maxTokens', preset.maxTokens ?? undefined)
                                form.setValue('topP', preset.topP ?? undefined)
                                form.setValue('initialPrompt.content', preset.content ?? undefined)
                                form.setValue(
                                    'initialPrompt.role',
                                    (preset.role as any) ?? undefined
                                )
                            }}
                        >
                            <span className="truncate max-w-sm">{preset.title}</span>
                        </Button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}
