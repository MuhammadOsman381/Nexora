import { Response } from "express";

export const sendResponse = async (res: Response, status: number, message: string, data: any) => {
    return res.status(status).json({
        message: message,
        data: data,
    });
};

