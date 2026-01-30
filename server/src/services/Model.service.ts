import puppeteer from "puppeteer";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import chromium from "@sparticuz/chromium";
import puppeteerCore from "puppeteer-core";

let pageContent: string | null = null;

const llm = new ChatGroq({
        apiKey: process.env.GROQ_API_KEY!,
        model: "meta-llama/llama-4-maverick-17b-128e-instruct",
        temperature: 0.4
    });

const remoteExecutablePath =
    "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar";


export const trainModel = async (url: string) => {
    const  browser = await puppeteerCore.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(remoteExecutablePath),
            headless: true,
        });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });
    const rawText = await page.evaluate(() => document.body.innerText);
    await browser.close();

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 16000,
        chunkOverlap: 50,
    });

    const docs = await splitter.createDocuments([rawText]);
    pageContent = docs.map(doc => doc.pageContent).join("\n");
};

export const askQuestion = async (question: string) => {
    if (!pageContent) throw new Error("Model not trained yet");
    const chatMesages = [
        new SystemMessage(`You are a helpful AI assistant.
        Use the following context to answer the question.`),
        new HumanMessage(`Context:\n${pageContent}\n\nQuestion:\n${question}`),
    ];
    const response = await llm.invoke(chatMesages);
    return response.content;
};
