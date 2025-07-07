import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import useGetAndDelete from "@/hooks/useGetAndDelete"
import axios from "axios"
import ReactMarkdown from "react-markdown"
import usePostAndPut from "@/hooks/usePostAndPut"
import SpinnerLoader from "@/components/SpinnerLoader"

type Message = {
    role: "user" | "bot"
    content: string
}

const ChatInterfacePage = () => {
    const { chatId } = useParams()
    const get = useGetAndDelete(axios.get)
    const post = usePostAndPut(axios.post)


    const [messages, setMessages] = useState<any[]>([
        { role: "bot", content: "Hello! How can I help you?" }
    ])
    const [input, setInput] = useState("")

    const getMessages = async () => {
        const response = await get.callApi(`model/get/${chatId}`, false, false)
        const rawMessages = response?.data?.messages || []

        const formattedMessages: Message[] = rawMessages.flatMap((msg: any) => [
            { role: "user", content: msg.query },
            { role: "bot", content: msg.response }
        ])

        setMessages([{ role: "bot", content: "Hello! How can I help you?" }, ...formattedMessages])
    }

    const handleSend = async () => {
        if (!input.trim()) return
        const response = await post.callApi(`model/ask/${chatId}`, { question: input }, true, false, false);
        await getMessages()
        console.log(response)
        setInput("")
    }

    useEffect(() => {
        getMessages()
    }, [])

    return (
        <div className="flex flex-col h-[88vh] mx-auto">
            <ScrollArea className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 bg-muted border-gray-300">
                <div className="space-y-3">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <Card
                                className={`max-w-2xl shadow-none border-gray-300 px-4 py-2 ${msg.role === "user"
                                    ? "bg-black text-white rounded-br-none"
                                    : "bg-white text-black rounded-bl-none"
                                    }`}
                            >
                                {msg.role === "bot" ? (
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                ) : (
                                    msg.content
                                )}
                            </Card>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <div className="flex gap-2 border px-3 py-2 rounded-2xl border-gray-300">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter your prompt..."
                    className="w-full h-10 px-3 py-2 text-sm rounded-md bg-transparent text-black focus:outline-none focus:ring-0 border-none shadow-none"
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />

                <Button type="submit" disabled={post.loading} onClick={handleSend} >
                    {
                        post.loading ?
                            <div className="flex items-center justify-center gap-3" >
                                <span>
                                    Please wait
                                </span>
                                <SpinnerLoader color="white" size="10" />
                            </div> : "Send"
                    }
                </Button>

            </div>
        </div>
    )
}

export default ChatInterfacePage
