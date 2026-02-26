import { Queue, Worker } from "bullmq";
import fs from "fs/promises";
import path from "path";
import { getLinks, crawlPages } from "./WebCrawler.service";
import { createEmbeddings, vectorDB } from "./Embeddings.service";
import { sendModelReadyEmail } from "./NodeMailer.service";

const connection = {
    url: process.env.REDIS_URL,
};

export const trainingQueue = new Queue("trainingQueue", { connection });
export const getLinkQueue = new Queue("getLinkQueue", { connection });
export const crawlerQueue = new Queue("crawlerQueue", { connection });
export const embeddingQueue = new Queue("embeddingQueue", { connection });
export const vectorDBQueue = new Queue("vectorDBQueue", { connection });
export const sendMailQueue = new Queue("sendMailQueue", { connection });

new Worker(
    "trainingQueue",
    async (job) => {
        const { chat, user } = job.data;

        await getLinkQueue.add(
            "getLinks",
            { chat, user },
            { removeOnComplete: true, removeOnFail: true }
        );
    },
    { connection }
);

new Worker(
    "getLinkQueue",
    async (job) => {
        const { chat, user } = job.data;

        const links = await getLinks(chat.url);
        const uniqueLinks = [...new Set(links)];

        await crawlerQueue.add(
            "crawlPages",
            { chat, user, links: uniqueLinks },
            { removeOnComplete: true, removeOnFail: true }
        );
    },
    { connection }
);

new Worker(
    "crawlerQueue",
    async (job) => {
        const { chat, user, links } = job.data;
        const pages = await crawlPages(links);
        const rawText = pages.join("\n");
        const tempDir = path.join(process.cwd(), "temp");
        await fs.mkdir(tempDir, { recursive: true });
        const filePath = path.join(tempDir, `${chat.nameSpace}.txt`);
        await fs.writeFile(filePath, rawText);
        pages.length = 0;
        await embeddingQueue.add(
            "createEmbeddings",
            { chat, user, filePath },
            { removeOnComplete: true, removeOnFail: true }
        );
    },
    {
        connection,
        concurrency: 2,
    }
);

new Worker(
    "embeddingQueue",
    async (job) => {
        const { chat, user, filePath } = job.data;
        const rawText = await fs.readFile(filePath, "utf-8");
        await createEmbeddings(rawText, chat.nameSpace);
        await fs.unlink(filePath);
        await vectorDBQueue.add(
            "uploadVector",
            { chat, user },
            { removeOnComplete: true, removeOnFail: true }
        );
    },
    {
        connection,
        concurrency: 1,
    }
);

new Worker(
    "vectorDBQueue",
    async (job) => {
        const { chat, user } = job.data;
        await vectorDB(
            chat.nameSpace,
            `./embeddings/${chat.nameSpace}.json`
        );
        await sendMailQueue.add(
            "sendMail",
            { user, chat },
            { removeOnComplete: true, removeOnFail: true }
        );
    },
    { connection }
);

new Worker(
    "sendMailQueue",
    async (job) => {
        const { user, chat } = job.data;
        await sendModelReadyEmail(
            user.email,
            chat.title,
            chat.id.toString()
        );
    },
    { connection }
);