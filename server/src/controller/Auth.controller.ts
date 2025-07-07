import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendResponse } from '../services/Response.service';
import { queryHandler } from '../services/Prisma.service';

export const signup = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await queryHandler({
            model: "user",
            action: "findUnique",
            args: {
                where: { email },
            },
        });
        if (existingUser) {
            sendResponse(res, 404, 'Email already in use', null);
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await queryHandler({
            model: "user",
            action: "create",
            args: {
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            },
        });
        sendResponse(res, 201, 'User created successfully', user);
        return;
    } catch (error) {
        sendResponse(res, 500, 'Internal server error', error);
        return;
    }
};

export const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await queryHandler({
            model: "user",
            action: "findUnique",
            args: {
                where: { email },
            },
        });
        if (!user) {
            sendResponse(res, 401, "Invalid credentials", null);
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            sendResponse(res, 401, "Invalid credentials", null);
            return;
        }
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );
        sendResponse(res, 201, "User logged in successfully", {
            user,
            token,
        });
    } catch (error) {
        sendResponse(res, 500, "Internal server error", error);
    }
};