import PageLoader from "@/components/PageLoader";
import useGetAndDelete from "@/hooks/useGetAndDelete";
import axios from "axios";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PricingPlansPage = () => {
  const get = useGetAndDelete(axios.get);
  const userPlan = useGetAndDelete(axios.get);
  const navigate = useNavigate();


  const [plans, setPlans] = useState<any[]>([]);

  const getPlan = async () => {
    const response = await get.callApi('pricing-plan/get', false, false);
    setPlans(response.data.plan || []);
  };

  const subscribePlan = async (price: number, planId: number) => {
    const response = await userPlan.callApi(`pricing-plan/create-user-plan/${planId}/${price}`, true, false);
    console.log(response)
    navigate('/user')
  }

  useEffect(() => {
    getPlan();
  }, []);

  return (
    <>
      {
        get.loading ?
          <PageLoader /> :
          <div className="flex flex-col  items-center justify-center   space-y-5 ">

            <div className="flex flex-wrap gap-5 max-w-7xl  justify-center lg:justify-start">
              {plans.map((plan, index) => (
                <Card
                  key={index}
                  className="border border-gray-300 shadow-none lg:w-[17vw] w-full rounded-2xl bg-white "
                >
                  <CardHeader className="space-y-1 ">
                    <CardTitle className="text-2xl font-bold text-gray-900 truncate">
                      {plan.planName}
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600">
                      ${plan.price} / month
                    </CardDescription>
                  </CardHeader>
                  <CardContent className=" text-sm text-muted-foreground">
                    <div>
                      <strong className="text-gray-700">Features:</strong>
                      <ul className="list-disc pl-2 mt-1 space-y-1">
                        {plan.features?.map((feature: string, i: number) => (
                          <li key={i} className="text-gray-600">{feature}</li>
                        ))}
                        <li key={plan.numberOfChats} className="text-gray-600">
                          {`Includes ${plan.numberOfChats} total chats`}
                        </li>
                        <li key={plan.messagesPerChat} className="text-gray-600">
                          {`Allows ${plan.messagesPerChat} messages per chat`}
                        </li>
                      </ul>
                    </div>
                    <div className="pt-4 flex gap-2">
                      <Button onClick={() => subscribePlan(plan.price, plan.id)} variant="default" >
                        Subscribe
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

          </div>
      }
    </>
  )
}

export default PricingPlansPage