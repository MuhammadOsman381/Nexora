import { Request, Response } from "express";
import { queryHandler } from "../services/Prisma.service";
import { sendResponse } from "../services/Response.service";

export const createPlan = async (req: Request, res: Response) => {
    try {
        const {
            planName,
            price,
            numberOfChats,
            numberOfMessagesPerChat,
            features,
        } = req.body;

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
        const { planId, price } = req.params;
        const userId = (req as any).user.id;
        
        const existingPlan = await queryHandler({
            model: "userPlan",
            action: "findFirst",
            args: {
                where: {
                    userId: userId,
                },
            },
        });

        if (existingPlan) {
            sendResponse(res, 400, "You have already subscribed to this plan", null);
            return
        }

        const plan = await queryHandler({
            model: "pricingPlan",
            action: "findUnique",
            args: {
                where: { id: Number(planId) },
            },
        });

        if (!plan) {
            sendResponse(res, 404, "Pricing plan not found", null);
            return
        }

        const totalNumberOfChats = plan.numberOfChats;
        const totalNumberOfMsgs = plan.numberOfChats * plan.messagesPerChat;
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 30);

        const userPlan = await queryHandler({
            model: "userPlan",
            action: "create",
            args: {
                data: {
                    userId: userId,
                    pricingPlanId: Number(planId),
                    status: "ACTIVE",
                    totalNumberOfChats,
                    totalNumberOfMsgs,
                    startDate,
                    endDate,
                },
            },
        });

        if (price) {
            sendResponse(res, 201, "Plan subscribed successfully", userPlan);
            return
        }
    } catch (error) {
        console.error("Error creating user plan:", error);
        sendResponse(res, 500, "Internal server error", error);
    }
};

