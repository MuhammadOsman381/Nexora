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
                    userType: 'USER'
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

export const createAdmin = async (req: Request, res: Response) => {
    try {
        const email = "admin@gmail.com";
        const existingAdmin = await queryHandler({
            model: "user",
            action: "findUnique",
            args: {
                where: { email },
            },
        });
        if (existingAdmin) {
            sendResponse(res, 400, "Admin already exists", null);
            return;
        }
        const hashedPassword = await bcrypt.hash("123456", 10);
        const newAdmin = await queryHandler({
            model: "user",
            action: "create",
            args: {
                data: {
                    name: "admin",
                    email: "admin@gmail.com",
                    password: hashedPassword,
                    userType: "ADMIN",
                },
            },
        });
        sendResponse(res, 201, "Admin created successfully", { admin: newAdmin });
    } catch (error) {
        console.error("Error creating admin:", error);
        sendResponse(res, 500, "Internal server error", error);
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await queryHandler({
            model: 'user',
            action: 'findMany',
            args: {
                include: {
                    plans: {
                        include: {
                            pricingPlan: true
                        }
                    }
                }
            }
        });
        const filteredUsers = users.filter((user: { name: string }) => user.name !== 'admin');
        sendResponse(res, 200, "Users fetched successfully", { users: filteredUsers });
    } catch (error) {
        console.error("Error fetching users:", error);
        sendResponse(res, 500, "Internal server error", error);
    }
};



