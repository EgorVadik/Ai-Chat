import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@renderer/components/ui/dialog'
import { Button } from './ui/button'
import { useChat } from '@renderer/hooks/use-chat'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type TitleSchema, titleSchema } from '../../../schema'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { toast } from 'sonner'

type PlaygroundControlsProps = Pick<ReturnType<typeof useChat>, 'form'>

export const SavePresetDialog = ({ form }: PlaygroundControlsProps) => {
    const titleForm = useForm<TitleSchema>({
        resolver: zodResolver(titleSchema),
        defaultValues: {
            title: ''
        }
    })

    const onSubmit = async (data: TitleSchema) => {
        const res = await window.electron.ipcRenderer.invoke('save:preset', {
            ...data,
            ...form.getValues()
        })
        if (typeof res === 'string') {
            toast.error(res)
            return
        }
        toast.success('Preset saved')
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button type="button">Save Preset</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Save Preset</DialogTitle>
                </DialogHeader>

                <Form {...titleForm}>
                    <form className="space-y-6">
                        <FormField
                            control={titleForm.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Title" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" onClick={titleForm.handleSubmit(onSubmit)}>
                            Submit
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
