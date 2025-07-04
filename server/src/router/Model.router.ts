import express, { Request, Response } from 'express';
import { handleAsk, handleTrain } from '../controller/Agent.controller';

const modelRouter = express.Router();

modelRouter.post('/train', handleTrain);
modelRouter.post('/ask', handleAsk);

export default modelRouter;
