import fs from "fs";
import { pipeline } from "@xenova/transformers";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Pinecone } from "@pinecone-database/pinecone";

export let embedder: any;

async function getEmbedder() {
    if (!embedder) {
        embedder = await pipeline("feature-extraction", "Xenova/jina-embeddings-v2-small-en");
    }
    return embedder;
}

async function chunkText(text: string) {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 100,
    });
    return await splitter.createDocuments([text]);
}

export async function createEmbeddings(textData: string, fileName: string) {
    const chunks = await chunkText(textData);
    const model = await getEmbedder();
    const embeddingStore: { text: string, vector: any }[] = [];
    for (const chunk of chunks) {
        const embeddingTensor = await model(chunk.pageContent, {
            pooling: "mean",
            normalize: true,
        });
        const vector = Array.from(embeddingTensor.data);
        embeddingStore.push({
            text: chunk.pageContent,
            vector,
        });
    }
    if (!fs.existsSync("./embeddings")) fs.mkdirSync("./embeddings");
    fs.writeFileSync(`./embeddings/${fileName}.json`, JSON.stringify(embeddingStore, null, 2));
    console.log("Embeddings saved locally ✅");
    return
}


export const customEmbedder = {
    embedQuery: async (text: string): Promise<number[]> => {
        const model = await getEmbedder();
        const embeddingTensor = await model(text, { pooling: "mean", normalize: true });
        return Array.from(embeddingTensor.data);
    },
    embedDocuments: async (texts: string[]): Promise<number[][]> => {
        const model = await getEmbedder();
        const vectors: number[][] = [];
        for (const t of texts) {
            const embeddingTensor = await model(t, { pooling: "mean", normalize: true });
            vectors.push(Array.from(embeddingTensor.data));
        }
        return vectors;
    },
};


export const vectorDB = async (nameSpace: string, filePath: string) => {
    const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
    });
    const index = pc.Index(process.env.PINECONE_INDEX_NAME!);
    const embeddings = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const BATCH_SIZE = 100;
    for (let i = 0; i < embeddings.length; i += BATCH_SIZE) {
        const batch = embeddings.slice(i, i + BATCH_SIZE).map((item: any, idx: number) => ({
            id: `chunk-${i + idx}`,
            values: item.vector,
            metadata: { text: item.text.slice(0, 500) },
        }));
        await index.namespace(nameSpace).upsert(batch);
    }
    console.log(`Uploaded ${embeddings.length} embeddings to Pinecone ✅`);
    return pc;
};


