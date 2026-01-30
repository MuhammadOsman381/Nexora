"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_middleware_1 = require("../middleware/Auth.middleware");
const Chat_controller_1 = require("../controller/Chat.controller");
const chatRouter = express_1.default.Router();
chatRouter.get('/get', Auth_middleware_1.isUserExist, Chat_controller_1.getChat);
exports.default = chatRouter;
