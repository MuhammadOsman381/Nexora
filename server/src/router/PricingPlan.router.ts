import express from 'express';
import { confirmSubscription, createPlan, createUserPlan, getPlan } from '../controller/PricingPlan.controller';
import { isUserExist } from '../middleware/Auth.middleware';

const pricingPlanRouter = express.Router();

pricingPlanRouter.post('/create', createPlan)
pricingPlanRouter.get('/get', getPlan)
pricingPlanRouter.post('/create-user-plan/:planId', isUserExist, createUserPlan)
pricingPlanRouter.post('/confirm-subscription', isUserExist, confirmSubscription)

export default pricingPlanRouter;
