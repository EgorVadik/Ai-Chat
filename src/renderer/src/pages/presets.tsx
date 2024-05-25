import { Preset } from '@prisma/client'
import { ModeToggle } from '@renderer/components/mode-toggle'
import { SideNav } from '@renderer/components/side-nav'
import { TooltipProvider } from '@renderer/components/ui/tooltip'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@renderer/components/ui/card'
import { Button } from '@renderer/components/ui/button'

export const Presets = () => {
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
        <div className="w-full pl-[56px]">
            <TooltipProvider>
                <SideNav />
            </TooltipProvider>
            <header className="sticky top-0 z-10 flex h-[57px] items-center justify-between gap-1 border-b bg-background px-4">
                <h1 className="text-xl font-semibold">Presets</h1>
                <ModeToggle />
            </header>

            <main className="grid grid-cols-auto p-4 gap-4">
                {presets.map((preset) => (
                    <Card key={preset.id}>
                        <CardHeader>
                            <CardTitle>{preset.title}</CardTitle>
                            <CardDescription>Card Description</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <span className="flex flex-col">
                                <span className="font-bold">Model:</span>
                                <span className="text-sm">{preset.model}</span>
                            </span>
                            <span className="flex flex-col">
                                <span className="font-bold">Temperature: </span>
                                <span className="text-sm">{preset.temperature ?? 'Default'}</span>
                            </span>
                            <span className="flex flex-col">
                                <span className="font-bold">Top P: </span>
                                <span className="text-sm">{preset.topP ?? 'Default'}</span>
                            </span>
                            <span className="flex flex-col">
                                <span className="font-bold">Max Tokens: </span>
                                <span className="text-sm">{preset.maxTokens ?? 'Default'}</span>
                            </span>
                            <span className="flex flex-col">
                                <span className="font-bold">Initial Prompt Role: </span>
                                <span className="text-sm">{preset.role ?? 'None'}</span>
                            </span>
                            <span className="flex flex-col">
                                <span className="font-bold">Initial Prompt:</span>
                                <span className="text-sm">{preset.content ?? 'None'}</span>
                            </span>
                        </CardContent>
                        <CardFooter>
                            <Button
                                variant={'destructive'}
                                className="w-full"
                                onClick={() => {
                                    window.electron.ipcRenderer
                                        .invoke('delete:preset', preset.id)
                                        .then((res: string) => {
                                            if (res) {
                                                toast.error(res)
                                                return
                                            }
                                            setPresets((prev) =>
                                                prev.filter((p) => p.id !== preset.id)
                                            )
                                        })
                                }}
                            >
                                Delete
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </main>
        </div>
    )
}
