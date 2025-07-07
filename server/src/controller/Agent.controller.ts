import { Request, Response } from 'express';
import { trainModel, askQuestion } from '../services/Model.service';
import { queryHandler } from '../services/Prisma.service';
import { sendResponse } from '../services/Response.service';

export const handleTrain = async (req: Request, res: Response) => {
    const { title, url } = req.body;
    const user = (req as any).user;
    try {
        const chat = await queryHandler({
            model: "chat",
            action: "create",
            args: {
                data: {
                    title,
                    url,
                    userId: user.id,
                },
            },
        })
        await trainModel(url);
        sendResponse(res, 200, "Training completed successfully.", { chat })
    } catch (error) {
        console.error('Training Error:', error);
        res.status(500).json({ error: 'Training failed.' });
    }
};

export const handleAsk = async (req: Request, res: Response) => {
    const { question } = req.body;
    const chatId = parseInt(req.params.chatId, 10);
    const userId = (req as any).user.id;
    try {
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
        })
        res.json({ answer });
    } catch (error) {
        console.error('QA Error:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Failed to answer question.';
        res.status(500).json({ error: errorMessage });
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