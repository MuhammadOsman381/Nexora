'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import usePostAndPut from "@/hooks/usePostAndPut"
import axios from "axios"
import SpinnerLoader from "@/components/SpinnerLoader"

export default function HomePage() {
  const post = usePostAndPut(axios.post);
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
    await post.callApi('model/create-chat', formData, true, false, true);
    return
  }

  return (
    <Card className=" mx-auto shadow-none rounded-xl  ">
      <CardHeader>
        <CardTitle className="text-xl">Chat with AI</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
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
                  </div> : "Start "
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
