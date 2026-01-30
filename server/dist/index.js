"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const Model_router_1 = __importDefault(require("./router/Model.router"));
const Auth_router_1 = __importDefault(require("./router/Auth.router"));
const cors_1 = __importDefault(require("cors"));
const Chat_router_1 = __importDefault(require("./router/Chat.router"));
const PricingPlan_router_1 = __importDefault(require("./router/PricingPlan.router"));
const app = (0, express_1.default)();
const allowedOrigins = [
    "http://localhost:5173",
    "https://nexora-seven-rosy.vercel.app"
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(null, false);
    },
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/model', Model_router_1.default);
app.use('/api/auth', Auth_router_1.default);
app.use('/api/chat', Chat_router_1.default);
app.use('/api/pricing-plan', PricingPlan_router_1.default);
app.get('/', (_req, res) => {
    res.send('Hello from server!');
});
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
