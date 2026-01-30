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
exports.getChat = void 0;
const Prisma_service_1 = require("../services/Prisma.service");
const Response_service_1 = require("../services/Response.service");
const getChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const chat = yield (0, Prisma_service_1.queryHandler)({
            model: "chat",
            action: "findMany",
            args: { where: { userId } },
        });
        (0, Response_service_1.sendResponse)(res, 200, "Chat found successfully", chat);
        return;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch chat.";
        (0, Response_service_1.sendResponse)(res, 500, errorMessage, null);
        return;
    }
});
exports.getChat = getChat;
