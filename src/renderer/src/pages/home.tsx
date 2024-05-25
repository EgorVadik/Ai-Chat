import { Bot } from 'lucide-react'

export const Home = () => {
    return (
        <>
            <div className="flex-1 flex gap-4 flex-col items-center justify-center mt-4 mx-4 min-h-[calc(100vh-16.5rem)]">
                <h2 className="flex flex-col items-center justify-center gap-3 text-center text-3xl font-bold">
                    <Bot className="h-16 w-16" />
                    How can i help you today?
                </h2>
            </div>
        </>
    )
}
