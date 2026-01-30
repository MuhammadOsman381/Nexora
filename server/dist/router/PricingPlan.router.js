"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PricingPlan_controller_1 = require("../controller/PricingPlan.controller");
const Auth_middleware_1 = require("../middleware/Auth.middleware");
const pricingPlanRouter = express_1.default.Router();
pricingPlanRouter.post('/create', PricingPlan_controller_1.createPlan);
pricingPlanRouter.get('/get', PricingPlan_controller_1.getPlan);
pricingPlanRouter.post('/create-user-plan/:planId', Auth_middleware_1.isUserExist, PricingPlan_controller_1.createUserPlan);
pricingPlanRouter.post('/confirm-subscription', Auth_middleware_1.isUserExist, PricingPlan_controller_1.confirmSubscription);
exports.default = pricingPlanRouter;
