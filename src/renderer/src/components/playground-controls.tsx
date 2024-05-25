import { CornerDownLeft, Loader2 } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@renderer/components/ui/select'
import { Textarea } from '@renderer/components/ui/textarea'
import { TooltipProvider } from '@renderer/components/ui/tooltip'
import { useChat } from '@renderer/hooks/use-chat'
import { ScrollArea, ScrollBar } from './ui/scroll-area'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@renderer/components/ui/form'
import { Outlet } from 'react-router-dom'
import { SavePresetDialog } from './save-preset-dialog'
import { LoadPresets } from './load-presets'
import { SideNav } from './side-nav'
import { ModeToggle } from './mode-toggle'
import { MODELS_ID_ARRAY, OpenAIChatModelId } from '../../../schema'
import { useEffect, useRef } from 'react'

export function PlaygroundControls() {
    const { form, handleSubmit, loading } = useChat()
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const textAreaValue = form.watch('content')

    const parseNumber = (value: string) => {
        const number = parseFloat(value)
        if (isNaN(number)) {
            return
        }
        return number
    }

    useEffect(() => {
        const textarea = textAreaRef.current
        if (!textarea) return
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
    }, [textAreaValue])

    return (
        <TooltipProvider delayDuration={100}>
            <div className="grid h-screen w-full pl-[56px]">
                <SideNav />
                <div className="flex flex-col">
                    <header className="sticky top-0 z-10 flex h-[57px] items-center justify-between gap-1 border-b bg-background px-4">
                        <h1 className="text-xl font-semibold">Playground</h1>
                        <ModeToggle />
                    </header>
                    <main>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(handleSubmit)}
                                className="flex flex-row items-stretch flex-1 gap-4 overflow-auto p-4"
                            >
                                <ScrollArea className="sticky top-0 flex flex-col h-[calc(100vh-7rem)] items-start gap-8 max-w-xs w-full shrink-0">
                                    <div className="grid w-full items-start gap-6">
                                        <fieldset className="grid gap-6 rounded-lg border p-4">
                                            <legend className="-ml-1 px-1 text-sm font-medium">
                                                Settings
                                            </legend>
                                            <div className="grid gap-3">
                                                <FormField
                                                    control={form.control}
                                                    name="model"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Model</FormLabel>
                                                            <Select
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}
                                                                value={field.value}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select a model" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {MODELS_ID_ARRAY.map(
                                                                        (modelId) => (
                                                                            <SelectItem
                                                                                key={modelId}
                                                                                value={modelId}
                                                                            >
                                                                                {modelId}
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>

                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="grid gap-3">
                                                <FormField
                                                    control={form.control}
                                                    name="temperature"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Temperature</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="0.4"
                                                                    min={0}
                                                                    max={1}
                                                                    step={0.1}
                                                                    {...field}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value
                                                                        const number =
                                                                            parseNumber(value)
                                                                        field.onChange(number)
                                                                    }}
                                                                />
                                                            </FormControl>

                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="grid gap-3">
                                                <FormField
                                                    control={form.control}
                                                    name="topP"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Top P</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="0.7"
                                                                    min={0}
                                                                    max={1}
                                                                    step={0.1}
                                                                    {...field}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value
                                                                        const number =
                                                                            parseNumber(value)
                                                                        field.onChange(number)
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="grid gap-3">
                                                <FormField
                                                    control={form.control}
                                                    name="maxTokens"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Max Tokens</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="1000"
                                                                    {...field}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value
                                                                        const number =
                                                                            parseNumber(value)
                                                                        field.onChange(number)
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </fieldset>
                                        <fieldset className="grid gap-6 rounded-lg border p-4">
                                            <legend className="-ml-1 px-1 text-sm font-medium">
                                                Initial Prompt
                                            </legend>
                                            <div className="grid gap-3">
                                                <FormField
                                                    control={form.control}
                                                    name="initialPrompt.role"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Role</FormLabel>
                                                            <Select
                                                                value={field.value}
                                                                onValueChange={(value) =>
                                                                    field.onChange(
                                                                        value === 'none'
                                                                            ? undefined
                                                                            : value
                                                                    )
                                                                }
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select a role" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="none">
                                                                        None
                                                                    </SelectItem>
                                                                    <SelectItem value="assistant">
                                                                        Assistant
                                                                    </SelectItem>
                                                                    <SelectItem value="system">
                                                                        System
                                                                    </SelectItem>
                                                                    <SelectItem value="user">
                                                                        User
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>

                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="grid gap-3">
                                                <FormField
                                                    control={form.control}
                                                    name="initialPrompt.content"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Content</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="You are a..."
                                                                    className="min-h-20"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </fieldset>

                                        <div className="flex flex-col gap-4">
                                            <Button
                                                type="button"
                                                variant={'outline'}
                                                onClick={() => {
                                                    form.setValue('initialPrompt.content', '')
                                                    form.setValue('initialPrompt.role', undefined)
                                                    form.setValue(
                                                        'model',
                                                        OpenAIChatModelId.GPT35Turbo
                                                    )
                                                    form.setValue('temperature', '' as any)
                                                    form.setValue('topP', '' as any)
                                                    form.setValue('maxTokens', '' as any)
                                                }}
                                            >
                                                Reset
                                            </Button>
                                            <LoadPresets form={form} />
                                            <SavePresetDialog form={form} />
                                        </div>
                                    </div>
                                </ScrollArea>
                                <ScrollArea className="relative flex h-[calc(100vh-6rem)] flex-col rounded-xl bg-muted grow">
                                    <ScrollBar className="bg-black" />
                                    <Outlet />
                                    <div className="sticky bottom-0 p-4 bg-muted">
                                        <div className=" focus-within:ring-1 bg-background focus-within:ring-ring rounded-lg">
                                            <FormField
                                                control={form.control}
                                                name="content"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-0">
                                                        <FormLabel className="sr-only">
                                                            Message
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                onKeyDown={(e) => {
                                                                    if (
                                                                        e.shiftKey &&
                                                                        e.key === 'Enter'
                                                                    )
                                                                        return
                                                                    if (e.key === 'Enter') {
                                                                        e.preventDefault()
                                                                        form.handleSubmit(
                                                                            handleSubmit
                                                                        )()
                                                                    }
                                                                }}
                                                                placeholder="Type your message here..."
                                                                className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 max-h-96"
                                                                {...field}
                                                                ref={textAreaRef}
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="px-4" />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="flex items-center p-3 pt-0">
                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    className="ml-auto gap-1.5"
                                                    disabled={loading}
                                                >
                                                    {loading && (
                                                        <Loader2 className="animate-spin mr-2" />
                                                    )}
                                                    Send Message
                                                    <CornerDownLeft className="size-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollArea>
                            </form>
                        </Form>
                    </main>
                </div>
            </div>
        </TooltipProvider>
    )
}
