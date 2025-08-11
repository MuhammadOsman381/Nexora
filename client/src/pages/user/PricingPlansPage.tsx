import PageLoader from "@/components/PageLoader";
import useGetAndDelete from "@/hooks/useGetAndDelete";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
} from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";
import usePostAndPut from "@/hooks/usePostAndPut";

const stripePromise = loadStripe("pk_test_51PeGfpG8qJLDolsNdaw01c2MRQktQ9YhtE4qZwv8d47xE9X4cVEZZjMo7ZPlwEkxQ1l1Eq704K8XnoLSEbVNqKwZ00398SxkfS");

const PricingPlansPage = () => {
  const get = useGetAndDelete(axios.get);
  const userPlan = usePostAndPut(axios.post);
  const navigate = useNavigate();

  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showCheckOutSection, setShowCheckOutSection] = useState<boolean>(false);

  const getPlan = async () => {
    const response = await get.callApi("pricing-plan/get", false, false);
    setPlans(response.data.plan || []);
  };

  const subscribePlan = async (price: number, planId: number) => {
    if (price === 0) {
      await userPlan.callApi(
        `pricing-plan/create-user-plan/${planId}`,
        { email: '',paymentMethodId: null }
        ,
        true,
        false,
        true
      );
      navigate("/user");
    } else {
      setSelectedPlan({ price, planId });
      setShowCheckOutSection(true);
    }
  };

  useEffect(() => {
    getPlan();
  }, []);

  return (
    <>
      {get.loading ? (
        <PageLoader />
      ) : (
        <>
          {!showCheckOutSection ? (
            <div className=" flex flex-col  items-center justify-center space-y-5">
              <div className="flex flex-wrap  w-full gap-5  justify-center ">
                {plans.map((plan, index) => (
                  <Card
                    key={index}
                    className="border border-gray-300 shadow-none lg:w-[15vw] rounded-md bg-white"
                  >
                    <CardHeader className="space-y-1">
                      <CardTitle className="text-2xl font-bold text-gray-900 truncate">
                        {plan.planName}
                      </CardTitle>
                      <CardDescription className="text-lg text-gray-600">
                        ${plan.price} / month
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <div>
                        <strong className="text-gray-700">Features:</strong>
                        <ul className="list-disc pl-2 mt-1 space-y-1">
                          {plan.features?.map((feature: string, i: number) => (
                            <li key={i} className="text-gray-600">
                              {feature}
                            </li>
                          ))}
                          <li className="text-gray-600">
                            {`Includes ${plan.numberOfChats} total chats`}
                          </li>
                          <li className="text-gray-600">
                            {`Allows ${plan.messagesPerChat} messages per chat`}
                          </li>
                        </ul>
                      </div>
                      <div className="pt-4 flex gap-2">
                        <Button onClick={() => subscribePlan(plan.price, plan.id)} variant="default">
                          Subscribe
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center  space-y-6">
              <Elements stripe={stripePromise}>
                <CheckoutForm selectedPlan={selectedPlan} setShowCheckOutSection={setShowCheckOutSection} />
              </Elements>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default PricingPlansPage;
