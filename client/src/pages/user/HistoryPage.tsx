import useGetAndDelete from "@/hooks/useGetAndDelete"
import axios from "axios"
import { useEffect, useState } from "react"
import { Card, CardTitle } from "@/components/ui/card"
import PageLoader from "@/components/PageLoader"
import { Link } from "react-router-dom"
import { Pencil, Trash2 } from "lucide-react"
import MessageCard from "@/components/MessageCard"

interface Chat {
  id: number
  title: string
  url: string
  userId: number
}

const HistoryPage = () => {
  const get = useGetAndDelete(axios.get)
  const [chats, setChats] = useState<Chat[]>([])
  const [message, setMessage] = useState<string>('');

  const getChats = async () => {
    const response = await get.callApi("chat/get", true, false)
    if (response?.data.length > 0) {
      setChats(response.data)
    }
    else {
      setMessage("No chats found.")
    }
  }

  const handleEdit = (id: number) => {
    console.log("Edit chat", id)
  }

  const handleDelete = async (id: number) => {
    console.log("Delete chat", id)
  }

  useEffect(() => {
    getChats()
  }, [])

  return (
    <div className="flex justify-center w-full h-auto">
      {
        get.loading ? (
          <PageLoader />
        ) : (
          message == '' &&
          <div className="w-full  flex flex-col mx-auto">
            {
              chats.map(chat => (
                <Card
                  key={chat.id}
                  className="border-gray-300 mb-2 p-4 shadow-none rounded-md"
                >
                  <div className="flex justify-between items-center  ">
                    <Link to={`/user/chat/${chat.id}`} className="flex-1">
                      <CardTitle className="text-lg">{chat.title}</CardTitle>
                      <a
                        href={chat.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        {chat.url}
                      </a>
                    </Link>

                    <div className="flex gap-3 ml-4">
                      <Pencil
                        size={18}
                        className="text-blue-500 hover:text-blue-600 cursor-pointer"
                        onClick={() => handleEdit(chat.id)}
                      />
                      <Trash2
                        size={18}
                        className="text-red-500 hover:text-red-600 cursor-pointer"
                        onClick={() => handleDelete(chat.id)}
                      />
                    </div>
                  </div>
                </Card>
              ))
            }

          </div>
        )
      }
      {message !== '' && <MessageCard message={message} type="info" />}
    </div>
  )
}

export default HistoryPage
