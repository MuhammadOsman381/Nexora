import { useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import useGetAndDelete from "@/hooks/useGetAndDelete"
import axios from "axios"
import usePostAndPut from "@/hooks/usePostAndPut"
import PageLoader from "@/components/PageLoader"
import MarkdownRenderer from "@/components/MarkDownRender"
import { Send } from "lucide-react"

type Message = {
    role: "user" | "bot"
    content: string
}

const ChatInterfacePage = () => {
    const { chatId } = useParams()
    const get = useGetAndDelete(axios.get)
    const trainModel = useGetAndDelete(axios.get)
    const post = usePostAndPut(axios.post)
    const [messages, setMessages] = useState<any[]>([
        { role: "bot", content: "Hello! How can I help you?" }
    ])
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages])


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
        <>
            {trainModel.loading ? (
                <PageLoader />
            ) : (
                <div className="max-w-full border flex flex-col h-[89vh] border-none p-2 rounded-md mx-auto">
                    <ScrollArea className="flex-1 overflow-y-auto rounded-xl p-2">
                        <div className=" space-y-3">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <Card className={`max-w-2xl  shadow-none px-4 py-2 bg-white text-black rounded-bl-none ${msg.role === "user" ? "bg-orange-500 border-none text-white" : "bg-transparent"}`}>
                                        {msg.role === "bot" ? (
                                            <MarkdownRenderer content={msg.content} />
                                        ) : (
                                            <div className="break-words break-all whitespace-normal ">{msg.content}</div>

                                        )}
                                    </Card>
                                </div>
                            ))}
                            <div ref={scrollRef} className="h-0 w-0"  >
                            </div>
                        </div>
                    </ScrollArea>

                    <div className="flex items-center justify-center gap-2 border p-1 rounded-full bg-white border-gray-300">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter your prompt..."
                            className="w-full h-10 px-3 py-2 text-sm rounded-md bg-transparent text-black focus:outline-none focus:ring-0 border-none shadow-none break-words break-all whitespace-normal"
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <Button className="w-9 h-9 flex items-center justify-center rounded-full" type="submit" disabled={post.loading} onClick={handleSend}>
                            <Send />
                        </Button>
                    </div>
                </div>
            )}
        </>
    )
}

export default ChatInterfacePage
