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

