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
exports.askQuestion = exports.trainModel = void 0;
const textsplitters_1 = require("@langchain/textsplitters");
const groq_1 = require("@langchain/groq");
const messages_1 = require("@langchain/core/messages");
const chromium_1 = __importDefault(require("@sparticuz/chromium"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
let pageContent = null;
const llm = new groq_1.ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "meta-llama/llama-4-maverick-17b-128e-instruct",
    temperature: 0.4
});
const remoteExecutablePath = "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar";
const trainModel = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_core_1.default.launch({
        args: chromium_1.default.args,
        executablePath: yield chromium_1.default.executablePath(remoteExecutablePath),
        headless: true,
    });
    const page = yield browser.newPage();
    yield page.goto(url, { waitUntil: "networkidle2", timeout: 0 });
    const rawText = yield page.evaluate(() => document.body.innerText);
    yield browser.close();
    const splitter = new textsplitters_1.RecursiveCharacterTextSplitter({
        chunkSize: 16000,
        chunkOverlap: 50,
    });
    const docs = yield splitter.createDocuments([rawText]);
    pageContent = docs.map(doc => doc.pageContent).join("\n");
});
exports.trainModel = trainModel;
const askQuestion = (question) => __awaiter(void 0, void 0, void 0, function* () {
    if (!pageContent)
        throw new Error("Model not trained yet");
    const chatMesages = [
        new messages_1.SystemMessage(`You are a helpful AI assistant.
        Use the following context to answer the question.`),
        new messages_1.HumanMessage(`Context:\n${pageContent}\n\nQuestion:\n${question}`),
    ];
    const response = yield llm.invoke(chatMesages);
    return response.content;
});
exports.askQuestion = askQuestion;
