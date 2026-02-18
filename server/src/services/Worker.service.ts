import { Worker } from "bullmq";
import { trainModel } from "./Model.service";

new Worker("trainingQueue", async (job) => {
    const { chat, user } = job.data;
    if (chat) {
        await trainModel(chat, user);
    }
});