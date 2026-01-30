"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_controller_1 = require("../controller/Auth.controller");
const Auth_middleware_1 = require("../middleware/Auth.middleware");
const authRouter = express_1.default.Router();
authRouter.post('/signup', Auth_controller_1.signup);
authRouter.post('/signin', Auth_controller_1.signin);
authRouter.get('/create-admin', Auth_controller_1.createAdmin);
authRouter.get('/get-users', Auth_controller_1.getUsers);
authRouter.get('/user', Auth_middleware_1.isUserExist, Auth_controller_1.user);
exports.default = authRouter;
