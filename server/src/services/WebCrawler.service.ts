import { loadPuppeteer } from "./Puppeteer.service";

const normalizeUrl = (url: string) => {
    try {
        const u = new URL(url);
        u.hash = "";
        return u.toString();
    } catch {
        return url;
    }
};


export const getLinks = async (url: string) => {
    const page = await loadPuppeteer();

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    const links: string[] = await page.evaluate(() =>
        Array.from(document.querySelectorAll("a"))
            .map(a => a.href)
            .filter(href => href && href !== "#" && !href.startsWith("javascript:"))
    );

    await page.close();

    const rootOrigin = new URL(url).origin;

    const uniqueLinks = Array.from(new Set(links))
        .map(normalizeUrl)
        .filter(link => {
            try {
                return new URL(link).origin === rootOrigin;
            } catch {
                return false;
            }
        });

    console.log("urls scraped")
    return uniqueLinks;
};


export const crawlPages = async (urls: string[]) => {
    const page = await loadPuppeteer();
    const data: string[] = [];

    try {
        const uniqueUrls = Array.from(new Set(urls))
        console.log(uniqueUrls)
        for (const url of uniqueUrls) {
            await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
            const text: string = await page.evaluate(() => {
                const elementsToRemove = document.querySelectorAll(
                    "nav, button, form, aside, a"
                );
                elementsToRemove.forEach(el => el.remove());
                return document.body.innerText;
            });
            data.push(text);
        }
        console.log(data)
        console.log("pages crawled")
        return data;
    } catch (err) {
        console.error("Failed to crawl", err);
        return data;
    } finally {
        await page.close();
    }
};