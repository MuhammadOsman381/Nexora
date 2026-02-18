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
exports.loadPuppeteer = void 0;
const chromium_1 = __importDefault(require("@sparticuz/chromium"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const remoteExecutablePath = "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar";
const loadPuppeteer = () => __awaiter(void 0, void 0, void 0, function* () {
    const isLocal = process.env.NODE_ENV !== "production";
    const browser = isLocal
        ? yield puppeteer_1.default.launch({ headless: true })
        : yield puppeteer_core_1.default.launch({
            args: chromium_1.default.args,
            executablePath: yield chromium_1.default.executablePath(remoteExecutablePath),
            headless: true,
        });
    const page = yield browser.newPage();
    return page;
});
exports.loadPuppeteer = loadPuppeteer;
