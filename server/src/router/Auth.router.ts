import express  from 'express';
import { createAdmin, getUsers, signin, signup } from '../controller/Auth.controller';

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.get('/create-admin', createAdmin);
authRouter.get('/get-users', getUsers);

export default authRouter;