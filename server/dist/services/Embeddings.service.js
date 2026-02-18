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
exports.vectorDB = exports.customEmbedder = exports.embedder = void 0;
exports.createEmbeddings = createEmbeddings;
const fs_1 = __importDefault(require("fs"));
const transformers_1 = require("@xenova/transformers");
const textsplitters_1 = require("@langchain/textsplitters");
const pinecone_1 = require("@pinecone-database/pinecone");
function getEmbedder() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!exports.embedder) {
            exports.embedder = yield (0, transformers_1.pipeline)("feature-extraction", "Xenova/jina-embeddings-v2-small-en");
        }
        return exports.embedder;
    });
}
function chunkText(text) {
    return __awaiter(this, void 0, void 0, function* () {
        const splitter = new textsplitters_1.RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 100,
        });
        return yield splitter.createDocuments([text]);
    });
}
function createEmbeddings(textData, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const chunks = yield chunkText(textData);
        const model = yield getEmbedder();
        const embeddingStore = [];
        for (const chunk of chunks) {
            const embeddingTensor = yield model(chunk.pageContent, {
                pooling: "mean",
                normalize: true,
            });
            const vector = Array.from(embeddingTensor.data);
            embeddingStore.push({
                text: chunk.pageContent,
                vector,
            });
        }
        if (!fs_1.default.existsSync("./embeddings"))
            fs_1.default.mkdirSync("./embeddings");
        fs_1.default.writeFileSync(`./embeddings/${fileName}.json`, JSON.stringify(embeddingStore, null, 2));
        console.log("Embeddings saved locally ✅");
        return;
    });
}
exports.customEmbedder = {
    embedQuery: (text) => __awaiter(void 0, void 0, void 0, function* () {
        const model = yield getEmbedder();
        const embeddingTensor = yield model(text, { pooling: "mean", normalize: true });
        return Array.from(embeddingTensor.data);
    }),
    embedDocuments: (texts) => __awaiter(void 0, void 0, void 0, function* () {
        const model = yield getEmbedder();
        const vectors = [];
        for (const t of texts) {
            const embeddingTensor = yield model(t, { pooling: "mean", normalize: true });
            vectors.push(Array.from(embeddingTensor.data));
        }
        return vectors;
    }),
};
const vectorDB = (nameSpace, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const pc = new pinecone_1.Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    });
    const index = pc.Index(process.env.PINECONE_INDEX_NAME);
    const embeddings = JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
    const BATCH_SIZE = 100;
    for (let i = 0; i < embeddings.length; i += BATCH_SIZE) {
        const batch = embeddings.slice(i, i + BATCH_SIZE).map((item, idx) => ({
            id: `chunk-${i + idx}`,
            values: item.vector,
            metadata: { text: item.text.slice(0, 500) },
        }));
        yield index.namespace(nameSpace).upsert(batch);
    }
    console.log(`Uploaded ${embeddings.length} embeddings to Pinecone ✅`);
    return pc;
});
exports.vectorDB = vectorDB;
