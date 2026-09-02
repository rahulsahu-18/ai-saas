import { ChatOpenAI } from "@langchain/openai";

export const model = new ChatOpenAI({
        model: "gpt-oss-120b", 
        apiKey:process.env.OPENAI_API_KEY 
});