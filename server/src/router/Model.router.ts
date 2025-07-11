import express from 'express';
import { getChatByID, handleAsk, createChat, trainAIModel } from '../controller/Model.controller';
import { isUserExist } from '../middleware/Auth.middleware';

const modelRouter = express.Router();

modelRouter.post('/create-chat', isUserExist, createChat);
modelRouter.post('/ask/:chatId', isUserExist, handleAsk);
modelRouter.get('/get/:chatId', getChatByID);
modelRouter.get('/train/:chatId', isUserExist, trainAIModel);

export default modelRouter;
