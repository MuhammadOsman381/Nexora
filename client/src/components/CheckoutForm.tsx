import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import useGetAndDelete from "@/hooks/useGetAndDelete";
import usePostAndPut from "@/hooks/usePostAndPut";
import { toast } from "sonner";
import SpinnerLoader from "./SpinnerLoader";

const CheckoutForm = ({ selectedPlan, setShowCheckOutSection }: any) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const get = useGetAndDelete(axios.get);
    const post = usePostAndPut(axios.post);

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");

    const getUserData = async () => {
        try {
            const response = await get.callApi("auth/user", true, false);
            setEmail(response?.data?.user.email || "");
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            alert("Failed to fetch user data");
        }
    };


    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !selectedPlan.planId) {
            alert("Please provide an email and select a plan");
            return;
        }
        setLoading(true);
        try {

            if (!stripe || !elements) {
                toast.error("Stripe not initialized or payment intent missing");
                setLoading(false);
                return;
            }
            const cardElement = elements.getElement(CardElement);

            if (!cardElement) {
                toast.error("Card details not provided");
                setLoading(false);
                return;
            }

            const createPM = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: {
                    email: email,
                },
            });

            await post.callApi(
                `pricing-plan/create-user-plan/${selectedPlan.planId}`,
                { email, paymentMethodId: createPM?.paymentMethod?.id },
                true,
                false,
                true
            );
        } catch (error) {
            console.error("Error processing subscription:", error);
            toast.error("Failed to process subscription");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserData();

    }, []);

    return (
        <Card className="w-full max-w-3xl shadow-none border-gray-300 ">
            <CardHeader>
                <CardTitle>Checkout</CardTitle>
                <CardDescription>Complete your subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                />
                <Input type="text" value={`$${selectedPlan.price}`} disabled />
                {selectedPlan.price > 0 && (
                    <div className="border p-3 rounded-md">
                        <CardElement />
                    </div>
                )}
                <Button  className="mr-2" disabled={loading} onClick={handleSubscribe}>
                    {loading ?
                        <div  className="flex items-center justify-center gap-3">
                            <span>
                                Processing
                            </span>
                            <SpinnerLoader color="white" size="10" />

                        </div>
                        : selectedPlan.price === 0 ? "Subscribe" : "Pay Now"}
                </Button>
                <Button disabled={loading} onClick={() => setShowCheckOutSection(false)} variant="outline">
                    Cancel
                </Button>
            </CardContent>
        </Card>
    );
};

export default CheckoutForm;