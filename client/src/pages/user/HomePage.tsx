'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import usePostAndPut from "@/hooks/usePostAndPut"
import axios from "axios"
import SpinnerLoader from "@/components/SpinnerLoader"
import { useNavigate } from "react-router-dom"

export default function HomePage() {
  const post = usePostAndPut(axios.post);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    url: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await post.callApi('model/create-chat', formData, true, false, true);
    if (response.data.data.chat.id !== null) {
      navigate(`/user/chat/${response?.data?.data?.chat?.id}`);
      return
    }
  }

  return (
    <Card className=" mx-auto   shadow-none rounded-md border-gray-300 ">
      <CardHeader>
        <CardTitle className="text-xl">Chat with AI</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title"
              required
            />
          </div>

          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://example.com"
              type="url"
              required
            />
          </div>

          <div className=" flex w-full" >
            <Button type="submit" disabled={post.loading} >
              {
                post.loading ?
                  <div className="flex items-center justify-center gap-3" >
                    <span>
                      Please wait
                    </span>
                    <SpinnerLoader color="white" size="10" />
                  </div> : "Start Chatting"
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
