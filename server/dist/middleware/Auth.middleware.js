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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserExist = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Response_service_1 = require("../services/Response.service");
const Prisma_service_1 = require("../services/Prisma.service");
const isUserExist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers["token"];
    if (!token) {
        (0, Response_service_1.sendResponse)(res, 401, "Access token is missing!", null);
        return;
    }
    const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const user = yield (0, Prisma_service_1.queryHandler)({
        model: "user",
        action: "findUnique",
        args: {
            where: {
                id: decodedToken.userId,
            },
        },
    });
    if (!user) {
        (0, Response_service_1.sendResponse)(res, 404, "User not found!", null);
        return;
    }
    req.user = user;
    next();
});
exports.isUserExist = isUserExist;
