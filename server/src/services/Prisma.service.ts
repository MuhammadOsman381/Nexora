import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const queryHandler = async (
    query: {
        model: keyof typeof prisma;
        action: string;
        args?: any;
    }
) => {
    const { model, action, args } = query;

    try {
        // @ts-ignore
        const result = await prisma[model][action](args);
        return result;
    } catch (error) {
        console.error("Prisma query error:", error);
        throw error;
    }
};
