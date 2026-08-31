import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";

const modelConfig = ({
  provider,
  apiKey,
}: {
  provider: string;
  apiKey: string;
}) => {
  switch (provider) {
    case "openai":
      return new ChatOpenAI({
        apiKey,
        model: "gpt-4o-mini",
      });

    case "gemini":
      return new ChatGoogleGenerativeAI({
        apiKey,
        model: "gemini-2.5-flash",
      });

    case "groq":
      return new ChatGroq({
        apiKey,
        model: "llama-3.3-70b-versatile",
      });

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
};



export default modelConfig;