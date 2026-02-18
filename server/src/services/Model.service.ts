import { ChatGroq } from "@langchain/groq";
import { crawlPages, getLinks } from "./WebCrawler.service";
import { createEmbeddings, customEmbedder, vectorDB } from "./Embeddings.service";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { RetrievalQAChain } from "@langchain/classic/chains";
import { sendModelReadyEmail } from "./NodeMailer.service";
import { User, Chat } from "../generated/prisma/client"

const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY!,
    model: "meta-llama/llama-4-maverick-17b-128e-instruct",
    temperature: 0.4
});

export const trainModel = async (chat: Chat, user: User) => {
    const data = await getLinks(chat.url)
    const uniqueLinks = Array.from(new Set(data));
    const textData = await crawlPages(uniqueLinks)
    const rawText = textData.join("\n")
    await createEmbeddings(rawText, chat.nameSpace)
    await vectorDB(chat.nameSpace, `./embeddings/${chat.nameSpace}.json`)
    sendModelReadyEmail(user.email, chat.title, chat.id.toString())
    return
}

export const askQuestion = async (question: string, chat: Chat) => {
    const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
    });
    const index = pc.Index(process.env.PINECONE_INDEX_NAME!);
    const vectorStore = await PineconeStore.fromExistingIndex(
        customEmbedder,
        {
            pineconeIndex: index,
            namespace: chat.nameSpace,
        },
    );
    const chain = RetrievalQAChain.fromLLM(llm, vectorStore.asRetriever());
    const response = await chain.call({ query: question })
    return response.text;
};
