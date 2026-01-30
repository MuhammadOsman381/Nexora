import PageLoader from "@/components/PageLoader"
import useGetAndDelete from "@/hooks/useGetAndDelete"
import axios from "axios"
import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"

import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import CheckoutForm from "@/components/CheckoutForm"
import usePostAndPut from "@/hooks/usePostAndPut"
import { Check } from "lucide-react"

const stripePromise = loadStripe(
  "pk_test_51PeGfpG8qJLDolsNdaw01c2MRQktQ9YhtE4qZwv8d47xE9X4cVEZZjMo7ZPlwEkxQ1l1Eq704K8XnoLSEbVNqKwZ00398SxkfS"
)

const PricingPlansPage = () => {
  const get = useGetAndDelete(axios.get)
  const userPlan = usePostAndPut(axios.post)
  const navigate = useNavigate()

  const [plans, setPlans] = useState<any[]>([])
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [showCheckOutSection, setShowCheckOutSection] = useState(false)

  const getPlan = async () => {
    const response = await get.callApi("pricing-plan/get", false, false)
    setPlans(response.data.plan || [])
  }

  const subscribePlan = async (price: number, planId: number) => {
    if (price === 0) {
      await userPlan.callApi(
        `pricing-plan/create-user-plan/${planId}`,
        { email: "", paymentMethodId: null },
        true,
        false,
        true
      )
      navigate("/user")
    } else {
      setSelectedPlan({ price, planId })
      setShowCheckOutSection(true)
    }
  }

  useEffect(() => {
    getPlan()
  }, [])

  return (
    <>
      {get.loading ? (
        <PageLoader />
      ) : (
        <>
          {!showCheckOutSection ? (
            <section className="">
              <div className="max-w-6xl mx-auto">
                <div className="text-center ">
                  <h2 className="text-3xl font-bold">
                    Simple & Transparent
                    <span className="text-primary"> Pricing</span>
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Choose the plan that fits your needs. Cancel anytime.
                  </p>
                </div>

                <div className="grid gap-8 mt-8 md:grid-cols-2 lg:grid-cols-3 justify-center">
                  {plans.map((plan, index) => {
                    const isPopular = plan.price > 10

                    return (
                      <Card
                        key={index}
                        className={`relative transition-all
                          ${isPopular
                            ? "border-primary shadow-lg shadow-primary/10"
                            : "border-border"
                          }
                        `}
                      >
                        {isPopular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <Badge className="px-4">Most Popular</Badge>
                          </div>
                        )}

                        <CardHeader className="text-center">
                          <CardTitle className="text-xl">
                            {plan.planName}
                          </CardTitle>
                          <div className="mt-4">
                            <span className="text-4xl font-bold">
                              ${plan.price}
                            </span>
                            <span className="text-muted-foreground ml-2">
                              / month
                            </span>
                          </div>
                          <CardDescription className="mt-2">
                            Perfect for scaling your usage
                          </CardDescription>
                        </CardHeader>

                        <CardContent>
                          <ul className="space-y-3">
                            {plan.features?.map(
                              (feature: string, i: number) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-3"
                                >
                                  <Check className="w-5 h-5 text-primary mt-0.5" />
                                  <span className="text-sm">
                                    {feature}
                                  </span>
                                </li>
                              )
                            )}

                            <li className="flex items-start gap-3">
                              <Check className="w-5 h-5 text-primary mt-0.5" />
                              <span className="text-sm">
                                {`${plan.numberOfChats} total chats`}
                              </span>
                            </li>

                            <li className="flex items-start gap-3">
                              <Check className="w-5 h-5 text-primary mt-0.5" />
                              <span className="text-sm">
                                {`${plan.messagesPerChat} messages per chat`}
                              </span>
                            </li>
                          </ul>
                        </CardContent>

                        <CardFooter>
                          <Button
                            className="w-full"
                            variant={isPopular ? "default" : "outline"}
                            onClick={() =>
                              subscribePlan(plan.price, plan.id)
                            }
                          >
                            {plan.price === 0
                              ? "Get Started Free"
                              : "Subscribe"}
                          </Button>
                        </CardFooter>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </section>
          ) : (
            <div className="flex flex-col items-center justify-center ">
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  selectedPlan={selectedPlan}
                  setShowCheckOutSection={setShowCheckOutSection}
                />
              </Elements>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default PricingPlansPage
