import { Request, Response } from "express";
import { queryHandler } from "../services/Prisma.service";
import { sendResponse } from "../services/Response.service";

export const getChat = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    try {
        const chat = await queryHandler({
            model: "chat",
            action: "findMany",
            args: { where: { userId } },
        });
        sendResponse(res, 200, "Chat found successfully", chat);
        return
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch chat.";
        sendResponse(res, 500, errorMessage, null);
        return
    }
};

export const deleteChat = async (req: Request, res: Response) => {
    const chatId = Number(req.params.id);

    if (isNaN(chatId)) {
        sendResponse(res, 400, "Invalid chat id", null);
        return
    }

    try {
        const chat = await queryHandler({
            model: "chat",
            action: "delete",
            args: {
                where: {
                    id: chatId,
                },
            },
        });

        sendResponse(res, 200, "Chat deleted successfully", chat);
        return
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Failed to delete chat.";
        sendResponse(res, 500, errorMessage, null);
        return
    }
};
