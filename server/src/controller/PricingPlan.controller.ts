import { Request, Response } from "express";
import { queryHandler } from "../services/Prisma.service";
import { sendResponse } from "../services/Response.service";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const createPlan = async (req: Request, res: Response) => {
    try {
        const {
            planName,
            price,
            numberOfChats,
            numberOfMessagesPerChat,
            features,
        } = req.body;

        let stripePriceId = null;
        if (Number(price) > 0) {

            const product = await stripe.products.create({
                name: planName,
                description: `Plan with ${numberOfChats} chats and ${numberOfMessagesPerChat} messages per chat`,
            });

            const priceObj = await stripe.prices.create({
                product: product.id,
                unit_amount: Math.round(price * 100),
                currency: 'usd',
                recurring: { interval: 'month' },
            });

            console.log(priceObj)

            stripePriceId = priceObj.id;
        }

        console.log(stripePriceId)


        const newPlan = await queryHandler({
            model: "pricingPlan",
            action: "create",
            args: {
                data: {
                    planName: planName,
                    price: price,
                    numberOfChats: numberOfChats,
                    messagesPerChat: numberOfMessagesPerChat,
                    features: features,
                    stripePriceId: stripePriceId
                },
            },
        });

        sendResponse(res, 201, "Plan created successfully", { plan: newPlan });
    } catch (error) {
        console.error("Error creating plan:", error);
        sendResponse(res, 500, "Internal server error", error);
    }
};

export const getPlan = async (req: Request, res: Response) => {
    try {
        const plans = await queryHandler({
            model: "pricingPlan",
            action: "findMany",
            args: {
            },
        });
        sendResponse(res, 201, "Plan fetched successfully", { plan: plans });
    } catch (error) {
        console.error("Error creating plan:", error);
        sendResponse(res, 500, "Internal server error", error);
    }
};

export const createUserPlan = async (req: Request, res: Response) => {
    try {
        const { planId } = req.params;
        const { email, paymentMethodId } = req.body;
        const userId = (req as any).user.id;

        const plan = await queryHandler({
            model: 'pricingPlan',
            action: 'findUnique',
            args: { where: { id: Number(planId) } },
        });

        if (!plan) {
            sendResponse(res, 404, 'Pricing plan not found', null);
            return;
        }

        const existingPlan = await queryHandler({
            model: 'userPlan',
            action: 'findFirst',
            args: { where: { userId } },
        });

        const isPlanExpired = existingPlan && new Date(existingPlan.endDate) < new Date();

        if (existingPlan && !isPlanExpired) {
            sendResponse(res, 400, 'You have an active plan', null);
            return;
        }

        const totalNumberOfChats = plan.numberOfChats;
        const totalNumberOfMsgs = plan.numberOfChats * plan.messagesPerChat;
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 30);

        if (Number(plan.price) === 0) {
            let userPlan;
            if (existingPlan && isPlanExpired) {
                userPlan = await queryHandler({
                    model: 'userPlan',
                    action: 'update',
                    args: {
                        where: { id: existingPlan.id },
                        data: {
                            pricingPlanId: Number(planId),
                            status: 'ACTIVE',
                            totalNumberOfChats,
                            totalNumberOfMsgs,
                            startDate,
                            endDate,
                            stripeSubscriptionId: null,
                        },
                    },
                });
            } else {
                userPlan = await queryHandler({
                    model: 'userPlan',
                    action: 'create',
                    args: {
                        data: {
                            userId,
                            pricingPlanId: Number(planId),
                            status: 'ACTIVE',
                            totalNumberOfChats,
                            totalNumberOfMsgs,
                            startDate,
                            endDate,
                        },
                    },
                });
            }
            sendResponse(res, 201, 'Plan subscribed successfully', userPlan);
            return;
        }

        let stripeCustomer;
        const existingUser = await queryHandler({
            model: 'user',
            action: 'findUnique',
            args: { where: { id: userId } },
        });

        if (existingUser.stripeCustomerId) {
            stripeCustomer = await stripe.customers.retrieve(existingUser.stripeCustomerId);
            await stripe.paymentMethods.attach(paymentMethodId, { customer: stripeCustomer.id });
            await stripe.customers.update(stripeCustomer.id, {
                invoice_settings: { default_payment_method: paymentMethodId },
            });
        } else {
            stripeCustomer = await stripe.customers.create({
                email,
                metadata: { userId: userId.toString() },
            });

            await stripe.paymentMethods.attach(paymentMethodId, {
                customer: stripeCustomer.id,
            });

            await stripe.customers.update(stripeCustomer.id, {
                invoice_settings: { default_payment_method: paymentMethodId },
            });

            await queryHandler({
                model: 'user',
                action: 'update',
                args: {
                    where: { id: userId },
                    data: { stripeCustomerId: stripeCustomer.id },
                },
            });
        }


        const subscription = await stripe.subscriptions.create({
            customer: stripeCustomer.id,
            items: [{ price: plan.stripePriceId }],
            expand: ['latest_invoice.payment_intent'],
            payment_settings: {
                payment_method_types: ['card'],
                save_default_payment_method: 'on_subscription',
            },
            metadata: {
                userId: userId.toString(),
                planId: plan.id.toString(),
            },
        });

        if (subscription.status == 'active') {
            const userPlan = await queryHandler({
                model: 'userPlan',
                action: existingPlan ? 'update' : 'create',
                args: existingPlan
                    ? {
                        where: { id: existingPlan.id },
                        data: {
                            pricingPlanId: Number(planId),
                            status: 'ACTIVE',
                            totalNumberOfChats,
                            totalNumberOfMsgs,
                            startDate,
                            endDate,
                            stripeSubscriptionId: subscription.id,
                        },
                    }
                    : {
                        data: {
                            userId,
                            pricingPlanId: Number(planId),
                            status: 'ACTIVE',
                            totalNumberOfChats,
                            totalNumberOfMsgs,
                            startDate,
                            endDate,
                            stripeSubscriptionId: subscription.id,
                        },
                    },
            });

            sendResponse(res, 200, 'Plan subscribed successfully', {
                userPlan,
                subscriptionId: subscription.id,
            });
        }
        else {
            sendResponse(res, 400, 'Subscription not active', null);
            return
        }


    } catch (error) {
        sendResponse(res, 500, 'Internal server error', error);
    }
};


export const confirmSubscription = async (req: Request, res: Response) => {
    try {
        const { paymentIntentId, customerId } = req.body;



        if (!paymentIntentId || !customerId) {
            sendResponse(res, 400, 'Payment Intent ID and customer ID are required', null);
            return;
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== 'succeeded') {
            sendResponse(res, 400, 'Payment not completed', null);
            return;
        }

        const { userId, planId }: any = paymentIntent.metadata;

        const plan = await queryHandler({
            model: 'pricingPlan',
            action: 'findUnique',
            args: { where: { id: Number(planId) } },
        });

        if (!plan) {
            sendResponse(res, 404, 'Pricing plan not found', null);
            return;
        }

        const totalChats = plan.numberOfChats;
        const totalMsgs = plan.numberOfChats * plan.messagesPerChat;
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 30);

        const existingPlan = await queryHandler({
            model: 'userPlan',
            action: 'findFirst',
            args: { where: { userId: Number(userId) } },
        });

        let userPlan;

        if (existingPlan) {
            userPlan = await queryHandler({
                model: 'userPlan',
                action: 'update',
                args: {
                    where: { id: existingPlan.id },
                    data: {
                        pricingPlanId: Number(planId),
                        status: 'ACTIVE',
                        totalNumberOfChats: totalChats,
                        totalNumberOfMsgs: totalMsgs,
                        startDate,
                        endDate,
                        stripePaymentIntentId: paymentIntentId,
                    },
                },
            });
        } else {
            userPlan = await queryHandler({
                model: 'userPlan',
                action: 'create',
                args: {
                    data: {
                        userId: Number(userId),
                        pricingPlanId: Number(planId),
                        status: 'ACTIVE',
                        totalNumberOfChats: totalChats,
                        totalNumberOfMsgs: totalMsgs,
                        startDate,
                        endDate,
                        stripePaymentIntentId: paymentIntentId,
                    },
                },
            });
        }

        await queryHandler({
            model: 'user',
            action: 'update',
            args: {
                where: { id: Number(userId) },
                data: { stripeCustomerId: customerId },
            },
        });

        sendResponse(res, 200, 'Subscription confirmed', null);
    } catch (error) {
        sendResponse(res, 500, 'Internal server error', error);
    }
};
