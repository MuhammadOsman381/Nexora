"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Model_controller_1 = require("../controller/Model.controller");
const Auth_middleware_1 = require("../middleware/Auth.middleware");
const modelRouter = express_1.default.Router();
modelRouter.post('/create-chat', Auth_middleware_1.isUserExist, Model_controller_1.createChat);
modelRouter.post('/ask/:chatId', Auth_middleware_1.isUserExist, Model_controller_1.handleAsk);
modelRouter.get('/get/:chatId', Model_controller_1.getChatByID);
modelRouter.get('/train/:chatId', Auth_middleware_1.isUserExist, Model_controller_1.trainAIModel);
exports.default = modelRouter;
