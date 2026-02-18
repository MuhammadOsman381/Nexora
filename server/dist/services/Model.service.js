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
Object.defineProperty(exports, "__esModule", { value: true });
exports.askQuestion = exports.trainModel = void 0;
const groq_1 = require("@langchain/groq");
const WebCrawler_service_1 = require("./WebCrawler.service");
const Embeddings_service_1 = require("./Embeddings.service");
const pinecone_1 = require("@pinecone-database/pinecone");
const pinecone_2 = require("@langchain/pinecone");
const chains_1 = require("@langchain/classic/chains");
const NodeMailer_service_1 = require("./NodeMailer.service");
const llm = new groq_1.ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "meta-llama/llama-4-maverick-17b-128e-instruct",
    temperature: 0.4
});
const trainModel = (chat, user) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, WebCrawler_service_1.getLinks)(chat.url);
    const uniqueLinks = Array.from(new Set(data));
    const textData = yield (0, WebCrawler_service_1.crawlPages)(uniqueLinks);
    const rawText = textData.join("\n");
    yield (0, Embeddings_service_1.createEmbeddings)(rawText, chat.nameSpace);
    yield (0, Embeddings_service_1.vectorDB)(chat.nameSpace, `./embeddings/${chat.nameSpace}.json`);
    (0, NodeMailer_service_1.sendModelReadyEmail)(user.email, chat.title, chat.id.toString());
    return;
});
exports.trainModel = trainModel;
const askQuestion = (question, chat) => __awaiter(void 0, void 0, void 0, function* () {
    const pc = new pinecone_1.Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    });
    const index = pc.Index(process.env.PINECONE_INDEX_NAME);
    const vectorStore = yield pinecone_2.PineconeStore.fromExistingIndex(Embeddings_service_1.customEmbedder, {
        pineconeIndex: index,
        namespace: chat.nameSpace,
    });
    const chain = chains_1.RetrievalQAChain.fromLLM(llm, vectorStore.asRetriever());
    const response = yield chain.call({ query: question });
    return response.text;
});
exports.askQuestion = askQuestion;
