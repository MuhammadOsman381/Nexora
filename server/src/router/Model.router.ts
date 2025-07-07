import express from 'express';
import { getChatByID, handleAsk, handleTrain } from '../controller/Agent.controller';
import { isUserExist } from '../middleware/Auth.middleware';

const modelRouter = express.Router();

modelRouter.post('/train', isUserExist, handleTrain);
modelRouter.post('/ask/:chatId', isUserExist, handleAsk);
modelRouter.get('/get/:chatId', getChatByID);


export default modelRouter;
