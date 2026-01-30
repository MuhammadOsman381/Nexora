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
const puppeteer_1 = __importDefault(require("puppeteer"));
const text_splitter_1 = require("langchain/text_splitter");
const google_genai_1 = require("@langchain/google-genai");
const memory_1 = require("langchain/vectorstores/memory");
const chains_1 = require("langchain/chains");
let trainedVectorStore = null;
const trainModel = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({ headless: true });
    const page = yield browser.newPage();
    yield page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });
    const rawText = yield page.evaluate(() => document.body.innerText);
    yield browser.close();
    const splitter = new text_splitter_1.RecursiveCharacterTextSplitter({
        chunkSize: 16000,
        chunkOverlap: 50,
    });
    const docs = yield splitter.createDocuments([rawText]);
    const embeddings = new google_genai_1.GoogleGenerativeAIEmbeddings({
        model: 'embedding-001',
        apiKey: process.env.GOOGLE_API_KEY,
    });
    trainedVectorStore = yield memory_1.MemoryVectorStore.fromDocuments(docs, embeddings);
});
exports.trainModel = trainModel;
const askQuestion = (question) => __awaiter(void 0, void 0, void 0, function* () {
    if (!trainedVectorStore)
        throw new Error("Model not trained yet");
    const model = new google_genai_1.ChatGoogleGenerativeAI({
        model: "gemini-2.0-flash-001",
        temperature: 0,
        apiKey: process.env.GOOGLE_API_KEY,
    });
    const chain = chains_1.RetrievalQAChain.fromLLM(model, trainedVectorStore.asRetriever());
    const result = yield chain.call({ query: question });
    return result.text;
});
exports.askQuestion = askQuestion;
