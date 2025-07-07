import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { sendResponse } from "../services/Response.service";
import { queryHandler } from "../services/Prisma.service";

const isUserExist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers["token"];
    if (!token) {
        sendResponse(res, 401, "Access token is missing!", null)
        return
    }
    const decodedToken: any = jwt.verify(token as string, process.env.JWT_SECRET as string);
    const user = await queryHandler({
        model: "user",
        action: "findUnique",
        args: {
            where: {
                id: decodedToken.userId,
            },
        },
    })
    if (!user) {
        sendResponse(res, 404, "User not found!", null)
        return
    }
    (req as any).user = user;
    next();
}

export { isUserExist };