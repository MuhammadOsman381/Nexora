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
exports.trainingWorker = exports.trainingQueue = void 0;
const bullmq_1 = require("bullmq");
const Model_service_1 = require("./Model.service");
const connection = {
    url: process.env.REDIS_URL,
};
exports.trainingQueue = new bullmq_1.Queue("trainingQueue", {
    connection,
});
exports.trainingWorker = new bullmq_1.Worker("trainingQueue", (job) => __awaiter(void 0, void 0, void 0, function* () {
    const { chat, user } = job.data;
    if (chat && user) {
        yield (0, Model_service_1.trainModel)(chat, user);
    }
}), {
    connection,
});
