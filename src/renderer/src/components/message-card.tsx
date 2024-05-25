import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import ReactMarkdown from 'react-markdown'
import { Bot, Copy } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { toast } from 'sonner'
import { Message } from '../../../types'
import { memo } from 'react'

export const MessageCard = ({ message, isDarkMode }: { message: Message; isDarkMode: boolean }) => {
    return (
        <div className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`p-3 rounded-lg ${
                    message.role === 'user' ? 'bg-primary-foreground max-w-6xl' : 'bg-background'
                }`}
            >
                {message.role !== 'user' && (
                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center pb-2 text-2xl font-semibold">
                            <Bot className="size-10" />
                            {message.role}
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Copy"
                            onClick={() => {
                                navigator.clipboard.writeText(message.content)
                                toast.success('Copied to clipboard')
                            }}
                        >
                            <Copy />
                        </Button>
                    </div>
                )}
                <ReactMarkdown
                    className={'prose max-w-none text-wrap break-words dark:prose-invert'}
                    remarkPlugins={[remarkGfm]}
                    components={{
                        code({ node, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '')
                            return match ? (
                                <SyntaxHighlighter
                                    style={isDarkMode ? dark : undefined}
                                    language={match[1]}
                                    PreTag="div"
                                    wrapLongLines
                                    wrapLines
                                    showLineNumbers
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            ) : (
                                <code {...props} className={className}>
                                    {children}
                                </code>
                            )
                        }
                    }}
                >
                    {message.content}
                </ReactMarkdown>
            </div>
        </div>
    )
}

export const MemoizedMessageCard = memo(MessageCard)
