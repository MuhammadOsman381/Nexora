"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = exports.getUsers = exports.createAdmin = exports.signin = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Response_service_1 = require("../services/Response.service");
const Prisma_service_1 = require("../services/Prisma.service");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const existingUser = yield (0, Prisma_service_1.queryHandler)({
            model: "user",
            action: "findUnique",
            args: {
                where: { email },
            },
        });
        if (existingUser) {
            (0, Response_service_1.sendResponse)(res, 404, 'Email already in use', null);
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield (0, Prisma_service_1.queryHandler)({
            model: "user",
            action: "create",
            args: {
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    userType: 'USER'
                },
            },
        });
        (0, Response_service_1.sendResponse)(res, 201, 'User created successfully', user);
        return;
    }
    catch (error) {
        (0, Response_service_1.sendResponse)(res, 500, 'Internal server error', error);
        return;
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield (0, Prisma_service_1.queryHandler)({
            model: "user",
            action: "findUnique",
            args: {
                where: { email },
            },
        });
        if (!user) {
            (0, Response_service_1.sendResponse)(res, 401, "Invalid credentials", null);
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            (0, Response_service_1.sendResponse)(res, 401, "Invalid credentials", null);
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        (0, Response_service_1.sendResponse)(res, 201, "User logged in successfully", {
            user,
            token,
        });
    }
    catch (error) {
        (0, Response_service_1.sendResponse)(res, 500, "Internal server error", error);
    }
});
exports.signin = signin;
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = "admin@gmail.com";
        const existingAdmin = yield (0, Prisma_service_1.queryHandler)({
            model: "user",
            action: "findUnique",
            args: {
                where: { email },
            },
        });
        if (existingAdmin) {
            (0, Response_service_1.sendResponse)(res, 400, "Admin already exists", null);
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash("123456", 10);
        const newAdmin = yield (0, Prisma_service_1.queryHandler)({
            model: "user",
            action: "create",
            args: {
                data: {
                    name: "admin",
                    email: "admin@gmail.com",
                    password: hashedPassword,
                    userType: "ADMIN",
                },
            },
        });
        (0, Response_service_1.sendResponse)(res, 201, "Admin created successfully", { admin: newAdmin });
    }
    catch (error) {
        console.error("Error creating admin:", error);
        (0, Response_service_1.sendResponse)(res, 500, "Internal server error", error);
    }
});
exports.createAdmin = createAdmin;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, Prisma_service_1.queryHandler)({
            model: 'user',
            action: 'findMany',
            args: {
                include: {
                    plans: {
                        include: {
                            pricingPlan: true
                        }
                    }
                }
            }
        });
        const filteredUsers = users.filter((user) => user.name !== 'admin');
        (0, Response_service_1.sendResponse)(res, 200, "Users fetched successfully", { users: filteredUsers });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        (0, Response_service_1.sendResponse)(res, 500, "Internal server error", error);
    }
});
exports.getUsers = getUsers;
const user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.user;
        (0, Response_service_1.sendResponse)(res, 200, "User fetched successfully", { user: userData });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        (0, Response_service_1.sendResponse)(res, 500, "Internal server error", error);
    }
});
exports.user = user;
