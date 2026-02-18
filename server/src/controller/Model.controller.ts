import { Request, Response } from 'express';
import { askQuestion } from '../services/Model.service';
import { queryHandler } from '../services/Prisma.service';
import { sendResponse } from '../services/Response.service';
import { randomUUID } from 'crypto';
import { trainingQueue } from "../services/Redis.service"

export const createChat = async (req: Request, res: Response) => {
    const { title, url } = req.body;
    const user = (req as any).user;

    try {
        const userPlan = await queryHandler({
            model: "userPlan",
            action: "findFirst",
            args: {
                where: {
                    userId: user.id,
                    status: "ACTIVE",
                },
            },
        });

        if (!userPlan) {
            sendResponse(res, 404, "User plan is not active yet.", null);
            return;
        }

        if (userPlan.totalNumberOfChats <= 0) {
            sendResponse(res, 403, "You have used all your allowed chats.", null);
            return;
        }

        const remainingChats = userPlan.totalNumberOfChats - 1;
        const messagesPerChat =
            remainingChats > 0
                ? Math.floor(userPlan.totalNumberOfMsgs / userPlan.totalNumberOfChats)
                : userPlan.totalNumberOfMsgs;

        const chat = await queryHandler({
            model: "chat",
            action: "create",
            args: {
                data: {
                    title,
                    url,
                    userId: user.id,
                    totalMessages: messagesPerChat,
                    nameSpace: `${title.toLowerCase().replace(" ", "-")}-${randomUUID()}`,
                    embeddings: "",
                },
            },
        });

        await queryHandler({
            model: "userPlan",
            action: "update",
            args: {
                where: { id: userPlan.id },
                data: {
                    totalNumberOfChats: remainingChats,
                    totalNumberOfMsgs:
                        userPlan.totalNumberOfMsgs - messagesPerChat,
                },
            },
        });

        await trainingQueue.add(
            "trainChat",
            {
                chat: chat,
                user: user,
            },
            {
                attempts: 3,
                backoff: 5000,
            }
        );

        sendResponse(
            res,
            200,
            "Chat created successfully. Model training has started and you will receive an email once it is ready.",
            { chat }
        );
    } catch (error) {
        console.error("Error creating chat:", error);
        res.status(500).json({ error: "Chat creation failed." });
    }
};


export const handleAsk = async (req: Request, res: Response) => {
    const { question } = req.body;
    const chatId = Number(req.params.chatId);
    const userId = (req as any).user.id;

    try {
        const chat = await queryHandler({
            model: "chat",
            action: "findUnique",
            args: {
                where: {
                    id: chatId,
                    userId: userId,
                },
            },
        });

        if (!chat) {
            sendResponse(res, 404, "Chat not found.", null);
            return
        }

        if (chat.totalMessages <= 0) {
            sendResponse(res, 403, "No message quota remaining in this chat.", null);
            return
        }

        const answer = await askQuestion(question, chat);

        console.log(answer)

        await queryHandler({
            model: "message",
            action: "create",
            args: {
                data: {
                    chatId: chatId,
                    userId: userId,
                    query: question,
                    response: answer,
                },
            },
        });

        await queryHandler({
            model: "chat",
            action: "update",
            args: {
                where: { id: chatId },
                data: {
                    totalMessages: chat.totalMessages - 1,
                },
            },
        });

        console.log("Answer:", answer);

        res.json({ answer: answer, });
    } catch (error) {
        console.error("QA Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to answer question.";
        sendResponse(res, 500, errorMessage, null);
    }
};


export const trainAIModel = async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const user = (req as any).user;
    try {
        const userPlan = await queryHandler({
            model: "userPlan",
            action: "findFirst",
            args: {
                where: {
                    userId: user.id,
                    status: "ACTIVE",
                },
            },
        });
        if (userPlan.totalMessages == 0 || userPlan.totalNumberOfChats == 0) {
            sendResponse(res, 403, "No message quota remaining in this chat.", null);
            return
        }
        const chat = await queryHandler({
            model: "chat",
            action: "findUnique",
            args: {
                where: {
                    id: Number(chatId),
                },
            },
        });
        if (!chat) {
            sendResponse(res, 404, "Chat not found.", null);
            return
        }
        trainingQueue.add("trainChat", {
            chat: chat,
            user: user
        });
        sendResponse(res, 200, "Training started successfully. An email will be sent to you once the data scraping and model training are completed.", { chat });
    } catch (error) {
        console.error("Training Error:", error);
        sendResponse(res, 500, "Training failed.", null);
    }
};


export const getChatByID = async (req: Request, res: Response) => {
    const chatId = Number(req.params.chatId);
    if (isNaN(chatId)) {
        sendResponse(res, 400, "Invalid chat ID.", null)
        return
    }
    try {
        const messages = await queryHandler({
            model: "message",
            action: "findMany",
            args: {
                where: {
                    chatId,
                },
                orderBy: {
                    id: "asc",
                },
            },
        });
        sendResponse(res, 200, "Messages found succesfully.", { messages })
        return
    } catch (error) {
        console.error("Error fetching chat messages:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch messages.";
        sendResponse(res, 500, errorMessage, null)
        return
    }
};

