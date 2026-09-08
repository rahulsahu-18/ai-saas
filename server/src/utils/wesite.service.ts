import { Firecrawl } from "firecrawl";
import removeMd from 'remove-markdown';

export function checkWebsite(value:string):boolean {
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:'
    } catch (error) {
        return false;
    }
}

export async function getTextData(value: string): Promise<{title:string,text:string}> {
    const app = new Firecrawl({ apiKey: process.env.WEBSITE_SCRAP });

    try {
        const result = await app.scrape(value, {
            formats: ["markdown"],
            onlyMainContent: true,
        });
        const title = result.metadata?.title ?? value
        const rawMarkdown = result?.markdown;

        if (!rawMarkdown) {
            throw new Error("No markdown content returned from Firecrawl");
        }

        const cleanText = removeMd(rawMarkdown, {
            stripListLeaders: true,
            gfm: true,
        });

        const finalText = cleanText.replace(/\n{3,}/g, "\n\n").trim();

        return {text:finalText,title};
    } catch (error) {
        console.error("Failed to get text data:", error);
        throw error;
    }
}