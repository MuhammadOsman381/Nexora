import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import usePostAndPut from "@/hooks/usePostAndPut"
import useGetAndDelete from "@/hooks/useGetAndDelete"
import axios from "axios"
import PageLoader from "@/components/PageLoader"

const AdminPricingPlan = () => {
  const post = usePostAndPut(axios.post)
  const get = useGetAndDelete(axios.get)

  const [form, setForm] = useState({
    planName: "",
    price: "",
    numberOfChats: "",
    numberOfMessagesPerChat: "",
  })

  const [features, setFeatures] = useState<string[]>([""])
  const [plans, setPlans] = useState<any[]>([])

  // Fetch plans
  const getPlan = async () => {
    const response = await get.callApi("pricing-plan/get", false, false)
    setPlans(response.data.plan || [])
  }

  useEffect(() => {
    getPlan()
  }, [])

  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...features]
    updated[index] = value
    setFeatures(updated)
  }

  const addFeatureField = () => setFeatures([...features, ""])
  const removeFeatureField = (index: number) => {
    const updated = [...features]
    updated.splice(index, 1)
    setFeatures(updated)
  }

  const handleSubmit = async () => {
    await post.callApi("pricing-plan/create", {
      ...form,
      price: parseFloat(form.price),
      numberOfChats: parseInt(form.numberOfChats),
      numberOfMessagesPerChat: parseInt(form.numberOfMessagesPerChat),
      features: features.filter(f => f.trim() !== "")
    }, false, false, true)
    getPlan() // refresh
  }

  return (
    <>
      {get.loading ? <PageLoader /> : (
        <div className="flex flex-col items-center justify-start min-h-screen space-y-1 ">

          {/* Create Plan Form */}
          <Card className="w-full border shadow-none">
            <CardHeader><CardTitle>Create Pricing Plan</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Plan Name</Label><Input name="planName" value={form.planName} onChange={handleChange} /></div>
              <div><Label>Price (USD)</Label><Input name="price" type="number" value={form.price} onChange={handleChange} /></div>
              <div><Label>Number of Chats</Label><Input name="numberOfChats" type="number" value={form.numberOfChats} onChange={handleChange} /></div>
              <div><Label>Messages per Chat</Label><Input name="numberOfMessagesPerChat" type="number" value={form.numberOfMessagesPerChat} onChange={handleChange} /></div>

              <div>
                <Label className="mb-2 block">Features</Label>
                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input placeholder={`Feature #${index + 1}`} value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} />
                      {features.length > 1 && <Button variant="outline" size="icon" onClick={() => removeFeatureField(index)}><Trash2 className="w-4 h-4 text-red-500" /></Button>}
                      {index === features.length - 1 && <Button variant="outline" size="icon" onClick={addFeatureField}><Plus className="w-4 h-4" /></Button>}
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleSubmit} className="mt-4">Create Plan</Button>
            </CardContent>
          </Card>

          {/* Shadcn Table for Plans */}
          <Card className="w-full  border shadow-none mt-2">
            <CardHeader><CardTitle>Pricing Plans</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{plan.planName}</TableCell>
                      <TableCell>${plan.price} / month</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">Show More</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle>{plan.planName}</DialogTitle>
                              <DialogDescription>Full details of the plan</DialogDescription>
                            </DialogHeader>

                            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                              <div><strong>Price:</strong> ${plan.price} / month</div>
                              <div><strong>Number of Chats:</strong> {plan.numberOfChats}</div>
                              <div><strong>Messages per Chat:</strong> {plan.numberOfMessagesPerChat}</div>
                              <div>
                                <strong>Features:</strong>
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                  {plan.features?.map((feature: string, i: number) => (<li key={i}>{feature}</li>))}
                                </ul>
                              </div>
                            </div>

                            <div className="mt-6 flex gap-2 justify-end">
                              <Button variant="outline" onClick={() => console.log("Edit plan")}>Edit</Button>
                              <Button variant="destructive" onClick={() => console.log("Delete plan")}>Delete</Button>
                              <DialogClose asChild><Button>Close</Button></DialogClose>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </div>
      )}
    </>
  )
}

export default AdminPricingPlan
