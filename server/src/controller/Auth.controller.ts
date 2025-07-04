import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { sendResponse } from '../services/Response.service';

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return sendResponse(res, 404, 'Email already in use', null);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        return sendResponse(res, 201, 'User created successfully', user);
    } catch (error) {
        return sendResponse(res, 500, 'Internal server error', null);
    }
};

export const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return sendResponse(res, 401, 'Invalid credentials', null);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendResponse(res, 401, 'Invalid credentials', null);
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
        return sendResponse(res, 201, 'User logged in successfully', {
            user: user,
            token: token,
        });
    } catch (error) {
        return sendResponse(res, 500, 'Internal server error', null);
    }
};
