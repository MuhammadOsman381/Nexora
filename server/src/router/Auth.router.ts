import express from 'express';
import { createAdmin, getUsers, signin, signup, user } from '../controller/Auth.controller';
import { isUserExist } from '../middleware/Auth.middleware';

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.get('/create-admin', createAdmin);
authRouter.get('/get-users', getUsers);
authRouter.get('/user', isUserExist, user);

export default authRouter;