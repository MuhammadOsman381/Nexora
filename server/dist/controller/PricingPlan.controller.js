"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmSubscription = exports.createUserPlan = exports.getPlan = exports.createPlan = void 0;
const Prisma_service_1 = require("../services/Prisma.service");
const Response_service_1 = require("../services/Response.service");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const createPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { planName, price, numberOfChats, numberOfMessagesPerChat, features, } = req.body;
        let stripePriceId = null;
        if (Number(price) > 0) {
            const product = yield stripe.products.create({
                name: planName,
                description: `Plan with ${numberOfChats} chats and ${numberOfMessagesPerChat} messages per chat`,
            });
            const priceObj = yield stripe.prices.create({
                product: product.id,
                unit_amount: Math.round(price * 100),
                currency: 'usd',
                recurring: { interval: 'month' },
            });
            console.log(priceObj);
            stripePriceId = priceObj.id;
        }
        console.log(stripePriceId);
        const newPlan = yield (0, Prisma_service_1.queryHandler)({
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
        (0, Response_service_1.sendResponse)(res, 201, "Plan created successfully", { plan: newPlan });
    }
    catch (error) {
        console.error("Error creating plan:", error);
        (0, Response_service_1.sendResponse)(res, 500, "Internal server error", error);
    }
});
exports.createPlan = createPlan;
const getPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plans = yield (0, Prisma_service_1.queryHandler)({
            model: "pricingPlan",
            action: "findMany",
            args: {},
        });
        (0, Response_service_1.sendResponse)(res, 201, "Plan fetched successfully", { plan: plans });
    }
    catch (error) {
        console.error("Error creating plan:", error);
        (0, Response_service_1.sendResponse)(res, 500, "Internal server error", error);
    }
});
exports.getPlan = getPlan;
const createUserPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { planId } = req.params;
        const { email, paymentMethodId } = req.body;
        const userId = req.user.id;
        const plan = yield (0, Prisma_service_1.queryHandler)({
            model: 'pricingPlan',
            action: 'findUnique',
            args: { where: { id: Number(planId) } },
        });
        if (!plan) {
            (0, Response_service_1.sendResponse)(res, 404, 'Pricing plan not found', null);
            return;
        }
        const existingPlan = yield (0, Prisma_service_1.queryHandler)({
            model: 'userPlan',
            action: 'findFirst',
            args: { where: { userId } },
        });
        const isPlanExpired = existingPlan && new Date(existingPlan.endDate) < new Date();
        if (existingPlan && !isPlanExpired) {
            (0, Response_service_1.sendResponse)(res, 400, 'You have an active plan', null);
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
                userPlan = yield (0, Prisma_service_1.queryHandler)({
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
            }
            else {
                userPlan = yield (0, Prisma_service_1.queryHandler)({
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
            (0, Response_service_1.sendResponse)(res, 201, 'Plan subscribed successfully', userPlan);
            return;
        }
        let stripeCustomer;
        const existingUser = yield (0, Prisma_service_1.queryHandler)({
            model: 'user',
            action: 'findUnique',
            args: { where: { id: userId } },
        });
        if (existingUser.stripeCustomerId) {
            stripeCustomer = yield stripe.customers.retrieve(existingUser.stripeCustomerId);
            yield stripe.paymentMethods.attach(paymentMethodId, { customer: stripeCustomer.id });
            yield stripe.customers.update(stripeCustomer.id, {
                invoice_settings: { default_payment_method: paymentMethodId },
            });
        }
        else {
            stripeCustomer = yield stripe.customers.create({
                email,
                metadata: { userId: userId.toString() },
            });
            yield stripe.paymentMethods.attach(paymentMethodId, {
                customer: stripeCustomer.id,
            });
            yield stripe.customers.update(stripeCustomer.id, {
                invoice_settings: { default_payment_method: paymentMethodId },
            });
            yield (0, Prisma_service_1.queryHandler)({
                model: 'user',
                action: 'update',
                args: {
                    where: { id: userId },
                    data: { stripeCustomerId: stripeCustomer.id },
                },
            });
        }
        const subscription = yield stripe.subscriptions.create({
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
            const userPlan = yield (0, Prisma_service_1.queryHandler)({
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
            (0, Response_service_1.sendResponse)(res, 200, 'Plan subscribed successfully', {
                userPlan,
                subscriptionId: subscription.id,
            });
        }
        else {
            (0, Response_service_1.sendResponse)(res, 400, 'Subscription not active', null);
            return;
        }
    }
    catch (error) {
        (0, Response_service_1.sendResponse)(res, 500, 'Internal server error', error);
    }
});
exports.createUserPlan = createUserPlan;
const confirmSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { paymentIntentId, customerId } = req.body;
        if (!paymentIntentId || !customerId) {
            (0, Response_service_1.sendResponse)(res, 400, 'Payment Intent ID and customer ID are required', null);
            return;
        }
        const paymentIntent = yield stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== 'succeeded') {
            (0, Response_service_1.sendResponse)(res, 400, 'Payment not completed', null);
            return;
        }
        const { userId, planId } = paymentIntent.metadata;
        const plan = yield (0, Prisma_service_1.queryHandler)({
            model: 'pricingPlan',
            action: 'findUnique',
            args: { where: { id: Number(planId) } },
        });
        if (!plan) {
            (0, Response_service_1.sendResponse)(res, 404, 'Pricing plan not found', null);
            return;
        }
        const totalChats = plan.numberOfChats;
        const totalMsgs = plan.numberOfChats * plan.messagesPerChat;
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 30);
        const existingPlan = yield (0, Prisma_service_1.queryHandler)({
            model: 'userPlan',
            action: 'findFirst',
            args: { where: { userId: Number(userId) } },
        });
        let userPlan;
        if (existingPlan) {
            userPlan = yield (0, Prisma_service_1.queryHandler)({
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
        }
        else {
            userPlan = yield (0, Prisma_service_1.queryHandler)({
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
        yield (0, Prisma_service_1.queryHandler)({
            model: 'user',
            action: 'update',
            args: {
                where: { id: Number(userId) },
                data: { stripeCustomerId: customerId },
            },
        });
        (0, Response_service_1.sendResponse)(res, 200, 'Subscription confirmed', null);
    }
    catch (error) {
        (0, Response_service_1.sendResponse)(res, 500, 'Internal server error', error);
    }
});
exports.confirmSubscription = confirmSubscription;
