"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatByID = exports.trainAIModel = exports.handleAsk = exports.createChat = void 0;
const Model_service_1 = require("../services/Model.service");
const Prisma_service_1 = require("../services/Prisma.service");
const Response_service_1 = require("../services/Response.service");
const crypto_1 = require("crypto");
const Redis_service_1 = require("../services/Redis.service");
// export const createChat = async (req: Request, res: Response) => {
//     const { title, url } = req.body;
//     const user = (req as any).user;
//     try {
//         const userPlan = await queryHandler({
//             model: "userPlan",
//             action: "findFirst",
//             args: {
//                 where: {
//                     userId: user.id,
//                     status: "ACTIVE",
//                 },
//             },
//         });
//         if (!userPlan) {
//             sendResponse(res, 404, "User plan is not active yet.", null);
//             return
//         }
//         if (userPlan.totalNumberOfChats <= 0) {
//             sendResponse(res, 403, "You have used all your allowed chats.", null);
//             return
//         }
//         const remainingChats = userPlan.totalNumberOfChats - 1;
//         const messagesPerChat = remainingChats > 0
//             ? Math.floor(userPlan.totalNumberOfMsgs / userPlan.totalNumberOfChats)
//             : userPlan.totalNumberOfMsgs;
//         const chat = await queryHandler({
//             model: "chat",
//             action: "create",
//             args: {
//                 data: {
//                     title,
//                     url,
//                     userId: user.id,
//                     totalMessages: messagesPerChat,
//                     nameSpace: `${title}-${randomUUID()}`,
//                     embeddings: "",
//                 },
//             },
//         });
//         await queryHandler({
//             model: "userPlan",
//             action: "update",
//             args: {
//                 where: { id: userPlan.id },
//                 data: {
//                     totalNumberOfChats: remainingChats,
//                     totalNumberOfMsgs: userPlan.totalNumberOfMsgs - messagesPerChat,
//                 },
//             },
//         });
//         sendResponse(res, 200, "Chat created successfully.", { chat });
//     } catch (error) {
//         console.error("Error creating chat:", error);
//         res.status(500).json({ error: "Chat creation failed." });
//     }
// };
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, url } = req.body;
    const user = req.user;
    try {
        const userPlan = yield (0, Prisma_service_1.queryHandler)({
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
            (0, Response_service_1.sendResponse)(res, 404, "User plan is not active yet.", null);
            return;
        }
        if (userPlan.totalNumberOfChats <= 0) {
            (0, Response_service_1.sendResponse)(res, 403, "You have used all your allowed chats.", null);
            return;
        }
        const remainingChats = userPlan.totalNumberOfChats - 1;
        const messagesPerChat = remainingChats > 0
            ? Math.floor(userPlan.totalNumberOfMsgs / userPlan.totalNumberOfChats)
            : userPlan.totalNumberOfMsgs;
        const chat = yield (0, Prisma_service_1.queryHandler)({
            model: "chat",
            action: "create",
            args: {
                data: {
                    title,
                    url,
                    userId: user.id,
                    totalMessages: messagesPerChat,
                    nameSpace: `${title.toLowerCase().replace(" ", "-")}-${(0, crypto_1.randomUUID)()}`,
                    embeddings: "",
                },
            },
        });
        yield (0, Prisma_service_1.queryHandler)({
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
        yield Redis_service_1.trainingQueue.add("trainChat", {
            chat: chat,
            user: user,
        }, {
            attempts: 3,
            backoff: 5000,
        });
        (0, Response_service_1.sendResponse)(res, 200, "Chat created successfully. Model training has started and you will receive an email once it is ready.", { chat });
    }
    catch (error) {
        console.error("Error creating chat:", error);
        res.status(500).json({ error: "Chat creation failed." });
    }
});
exports.createChat = createChat;
const handleAsk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { question } = req.body;
    const chatId = parseInt(req.params.chatId, 10);
    const userId = req.user.id;
    try {
        const chat = yield (0, Prisma_service_1.queryHandler)({
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
            (0, Response_service_1.sendResponse)(res, 404, "Chat not found.", null);
            return;
        }
        if (chat.totalMessages <= 0) {
            (0, Response_service_1.sendResponse)(res, 403, "No message quota remaining in this chat.", null);
            return;
        }
        const answer = yield (0, Model_service_1.askQuestion)(question, chat);
        console.log(answer);
        yield (0, Prisma_service_1.queryHandler)({
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
        yield (0, Prisma_service_1.queryHandler)({
            model: "chat",
            action: "update",
            args: {
                where: { id: chatId },
                data: {
                    totalMessages: chat.totalMessages - 1,
                },
            },
        });
        console.log("Answer:", answer);
        res.json({ answer: answer, });
    }
    catch (error) {
        console.error("QA Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to answer question.";
        (0, Response_service_1.sendResponse)(res, 500, errorMessage, null);
    }
});
exports.handleAsk = handleAsk;
const trainAIModel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.params;
    const user = req.user;
    try {
        const userPlan = yield (0, Prisma_service_1.queryHandler)({
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
            (0, Response_service_1.sendResponse)(res, 403, "No message quota remaining in this chat.", null);
            return;
        }
        const chat = yield (0, Prisma_service_1.queryHandler)({
            model: "chat",
            action: "findUnique",
            args: {
                where: {
                    id: Number(chatId),
                },
            },
        });
        if (!chat) {
            (0, Response_service_1.sendResponse)(res, 404, "Chat not found.", null);
            return;
        }
        Redis_service_1.trainingQueue.add("trainChat", {
            chat: chat,
            user: user
        });
        (0, Response_service_1.sendResponse)(res, 200, "Training started successfully. An email will be sent to you once the data scraping and model training are completed.", { chat });
    }
    catch (error) {
        console.error("Training Error:", error);
        (0, Response_service_1.sendResponse)(res, 500, "Training failed.", null);
    }
});
exports.trainAIModel = trainAIModel;
const getChatByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = parseInt(req.params.chatId, 10);
    if (isNaN(chatId)) {
        (0, Response_service_1.sendResponse)(res, 400, "Invalid chat ID.", null);
        return;
    }
    try {
        const messages = yield (0, Prisma_service_1.queryHandler)({
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
        (0, Response_service_1.sendResponse)(res, 200, "Messages found succesfully.", { messages });
        return;
    }
    catch (error) {
        console.error("Error fetching chat messages:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch messages.";
        (0, Response_service_1.sendResponse)(res, 500, errorMessage, null);
        return;
    }
});
exports.getChatByID = getChatByID;
