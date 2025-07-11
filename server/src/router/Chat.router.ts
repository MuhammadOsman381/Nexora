import express from 'express';
import { isUserExist } from '../middleware/Auth.middleware';
import { getChat } from '../controller/Chat.controller';

const chatRouter = express.Router();

chatRouter.get('/get',isUserExist,getChat)

export default chatRouter;
