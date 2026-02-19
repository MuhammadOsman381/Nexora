import { Queue, Worker } from "bullmq";
import { trainModel } from "./Model.service";

const connection = {
    url: process.env.REDIS_URL,
};

export const trainingQueue = new Queue("trainingQueue", {
    connection,
});

export const trainingWorker = new Worker(
    "trainingQueue",
    async (job) => {
        const { chat, user } = job.data;
        if (chat && user) {
            await trainModel(chat, user);
        }
    },
    {
        connection,
    }
);