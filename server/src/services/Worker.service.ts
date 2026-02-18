import { Worker } from "bullmq";
import { queryHandler } from "./Prisma.service";
import { trainModel } from "./Model.service";

new Worker("trainingQueue", async (job) => {
    const { chat, user } = job.data;
    if (chat) {
        await trainModel(chat, user);
    }
});