import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer";
import puppeteerCore, { Page } from "puppeteer-core";

const remoteExecutablePath =
    "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar";

export const loadPuppeteer = async (): Promise<Page> => {
    const isLocal = process.env.NODE_ENV !== "production";

    const browser = isLocal
        ? await puppeteer.launch({ headless: true })
        : await puppeteerCore.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(remoteExecutablePath),
            headless: true,
        });
    const page = await browser.newPage();
    return page as Page;
};

