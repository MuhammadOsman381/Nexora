import { Request, Response } from 'express';
import { trainModel, askQuestion } from '../services/Model.service';
import { queryHandler } from '../services/Prisma.service';
import { sendResponse } from '../services/Response.service';

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
            return
        }

        if (userPlan.totalNumberOfChats <= 0) {
            sendResponse(res, 403, "You have used all your allowed chats.", null);
            return
        }

        const remainingChats = userPlan.totalNumberOfChats - 1;
        const messagesPerChat = remainingChats > 0
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
                    totalNumberOfMsgs: userPlan.totalNumberOfMsgs - messagesPerChat,
                },
            },
        });

        sendResponse(res, 200, "Chat created successfully.", { chat });
    } catch (error) {
        console.error("Error creating chat:", error);
        res.status(500).json({ error: "Chat creation failed." });
    }
};



export const handleAsk = async (req: Request, res: Response) => {
    const { question } = req.body;
    const chatId = parseInt(req.params.chatId, 10);
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

        const answer = await askQuestion(question);

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

        res.json({ answer });
    } catch (error) {
        console.error("QA Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to answer question.";
        sendResponse(res, 500, errorMessage, null);
    }
};


export const getChatByID = async (req: Request, res: Response) => {
    const chatId = parseInt(req.params.chatId, 10);
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
        await trainModel(chat.url);
        sendResponse(res, 200, "Training completed successfully.", { chat });
    } catch (error) {
        console.error("Training Error:", error);
        sendResponse(res, 500, "Training failed.", null);
    }
};
