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
exports.crawlPages = exports.getLinks = void 0;
const Puppeteer_service_1 = require("./Puppeteer.service");
const normalizeUrl = (url) => {
    try {
        const u = new URL(url);
        u.hash = "";
        return u.toString();
    }
    catch (_a) {
        return url;
    }
};
const getLinks = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const page = yield (0, Puppeteer_service_1.loadPuppeteer)();
    yield page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    const links = yield page.evaluate(() => Array.from(document.querySelectorAll("a"))
        .map(a => a.href)
        .filter(href => href && href !== "#" && !href.startsWith("javascript:")));
    yield page.close();
    const rootOrigin = new URL(url).origin;
    const uniqueLinks = Array.from(new Set(links))
        .map(normalizeUrl)
        .filter(link => {
        try {
            return new URL(link).origin === rootOrigin;
        }
        catch (_a) {
            return false;
        }
    });
    console.log("urls scraped");
    return uniqueLinks;
});
exports.getLinks = getLinks;
const crawlPages = (urls) => __awaiter(void 0, void 0, void 0, function* () {
    const page = yield (0, Puppeteer_service_1.loadPuppeteer)();
    const data = [];
    try {
        const uniqueUrls = Array.from(new Set(urls));
        console.log(uniqueUrls);
        for (const url of uniqueUrls) {
            yield page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
            const text = yield page.evaluate(() => {
                const elementsToRemove = document.querySelectorAll("nav, button, form, aside, a");
                elementsToRemove.forEach(el => el.remove());
                return document.body.innerText;
            });
            data.push(text);
        }
        console.log(data);
        console.log("pages crawled");
        return data;
    }
    catch (err) {
        console.error("Failed to crawl", err);
        return data;
    }
    finally {
        yield page.close();
    }
});
exports.crawlPages = crawlPages;
