import express from 'express';
import { createPlan, createUserPlan, getPlan } from '../controller/PricingPlan.controller';
import { isUserExist } from '../middleware/Auth.middleware';

const pricingPlanRouter = express.Router();

pricingPlanRouter.post('/create', createPlan)
pricingPlanRouter.get('/get', getPlan)
pricingPlanRouter.get('/create-user-plan/:planId/:price', isUserExist, createUserPlan)

export default pricingPlanRouter;
