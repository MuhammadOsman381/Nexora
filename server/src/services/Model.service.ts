import puppeteer from 'puppeteer';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { RetrievalQAChain } from 'langchain/chains';

let trainedVectorStore: MemoryVectorStore | null = null;

export const trainModel = async (url: string) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });
    const rawText = await page.evaluate(() => document.body.innerText);
    await browser.close();
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
    });
    const docs = await splitter.createDocuments([rawText]);
    const embeddings = new GoogleGenerativeAIEmbeddings({
        model: 'embedding-001',
        apiKey: process.env.GOOGLE_API_KEY,
    });
    trainedVectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
};

export const askQuestion = async (question: string) => {
    if (!trainedVectorStore) throw new Error("Model not trained yet")
    const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.0-flash",
        temperature: 0,
        apiKey: process.env.GOOGLE_API_KEY,
    });
    const chain = RetrievalQAChain.fromLLM(model, trainedVectorStore.asRetriever());
    const result = await chain.call({ query: question });
    return result.text;
};

