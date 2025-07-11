import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import usePostAndPut from "@/hooks/usePostAndPut"
import axios from "axios"
import useGetAndDelete from "@/hooks/useGetAndDelete"
import PageLoader from "@/components/PageLoader"

const AdminPricingPlan = () => {
  const post = usePostAndPut(axios.post);
  const get = useGetAndDelete(axios.get);

  const [form, setForm] = useState({
    planName: "",
    price: "",
    numberOfChats: "",
    numberOfMessagesPerChat: "",
  });

  const [features, setFeatures] = useState<string[]>([""]);
  const [plans, setPlans] = useState<any[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const addFeatureField = () => {
    setFeatures([...features, ""]);
  };

  const removeFeatureField = (index: number) => {
    const updated = [...features];
    updated.splice(index, 1);
    setFeatures(updated);
  };

  const handleSubmit = async () => {
    const response = await post.callApi('pricing-plan/create', {
      ...form,
      price: parseFloat(form.price),
      numberOfChats: parseInt(form.numberOfChats),
      numberOfMessagesPerChat: parseInt(form.numberOfMessagesPerChat),
      features: features.filter(f => f.trim() !== ""),
    }, false, false, true);
    console.log(response);
    getPlan(); // refresh the plan list
  };

  const getPlan = async () => {
    const response = await get.callApi('pricing-plan/get', false, false);
    setPlans(response.data.plan || []);
  };

  useEffect(() => {
    getPlan();
  }, []);

  return (
    <>
      {
        get.loading ?
          <PageLoader /> :
          <div className="flex flex-col items-center justify-start min-h-screen space-y-5 ">
            <Card className="w-full max-w-4xl border-gray-300 shadow-none">
              <CardHeader>
                <CardTitle>Create Pricing Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Plan Name</Label>
                  <Input name="planName" value={form.planName} onChange={handleChange} />
                </div>
                <div>
                  <Label>Price (in USD)</Label>
                  <Input name="price" type="number" value={form.price} onChange={handleChange} />
                </div>
                <div>
                  <Label>Number of Chats</Label>
                  <Input name="numberOfChats" type="number" value={form.numberOfChats} onChange={handleChange} />
                </div>
                <div>
                  <Label>Messages per Chat</Label>
                  <Input name="numberOfMessagesPerChat" type="number" value={form.numberOfMessagesPerChat} onChange={handleChange} />
                </div>

                <div>
                  <Label className="mb-2 block">Features</Label>
                  <div className="space-y-2">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder={`Feature #${index + 1}`}
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                        />
                        {features.length > 1 && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeFeatureField(index)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                        {index === features.length - 1 && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={addFeatureField}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full">
                  <Button onClick={handleSubmit} className="mt-4">
                    Create Plan
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-5 w-full mt-10 justify-center lg:justify-start">
              {plans.map((plan, index) => (
                <Card
                  key={index}
                  className="border border-gray-300 shadow-none lg:w-[17vw] w-full rounded-2xl bg-white "
                >
                  <CardHeader className="space-y-1 ">
                    <CardTitle className="text-2xl font-bold text-gray-900 truncate">
                      {plan.planName}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      ${plan.price} / month
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <div>
                      <strong className="text-gray-700">Chats:</strong> {plan.numberOfChats}
                    </div>
                    <div>
                      <strong className="text-gray-700">Messages/Chat:</strong> {plan.messagesPerChat}
                    </div>
                    <div>
                      <strong className="text-gray-700">Features:</strong>
                      <ul className="list-disc pl-2 mt-1 space-y-1">
                        {plan.features?.map((feature: string, i: number) => (
                          <li key={i} className="text-gray-600">{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 flex gap-2">
                      <Button variant="outline" className=" hover:bg-primary hover:text-white">
                        Edit
                      </Button>
                      <Button variant="destructive" >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

          </div>
      }
    </>
  );
};

export default AdminPricingPlan;
