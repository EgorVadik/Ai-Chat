import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@renderer/components/ui/alert-dialog'
import { toast } from 'sonner'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { buttonVariants } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { cn } from '@renderer/lib/utils'

export const DeleteChat = ({ children, chatId }: { children: React.ReactNode; chatId: string }) => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    return (
        <AlertDialog>
            <AlertDialogTrigger
                className={cn(
                    buttonVariants({
                        variant: 'destructive'
                    }),
                    'w-full'
                )}
            >
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the chat and all
                        of its messages.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={async () => {
                            setLoading(true)
                            const res = await window.electron.ipcRenderer.invoke(
                                'delete:chat',
                                chatId
                            )
                            if (typeof res === 'string') {
                                toast.error(res)
                                return setLoading(false)
                            }

                            toast.success('Chat deleted successfully.')
                            setLoading(false)
                            navigate('/')
                            window.location.reload()
                        }}
                        className={buttonVariants({
                            variant: 'destructive',
                            className: 'flex items-center justify-center gap-2'
                        })}
                    >
                        {loading && <Loader2 className="animate-spin" />}
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
