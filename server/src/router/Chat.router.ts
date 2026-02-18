import express from 'express';
import { isUserExist } from '../middleware/Auth.middleware';
import { deleteChat, getChat } from '../controller/Chat.controller';

const chatRouter = express.Router();

chatRouter.get('/get', isUserExist, getChat)
chatRouter.put('/delete/:id', deleteChat)

export default chatRouter
