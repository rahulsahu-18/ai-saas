import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from "./pinecone.config.js";
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 700,
  chunkOverlap: 150,
});

export async function chunkAndEmbading({
  fileName,
  text,
  userId,
  documentId,
  sourceType,
  sourceUrl,

}: {
  fileName: string;
  text: string;
  userId: string;
  documentId: string;
  sourceType: 'FILE' | 'WEBSITE' | 'YOUTUBE';
  sourceUrl?:string;
}) {
  const chunks = await splitter.createDocuments(
    [text],
    [
      {
        userId,
        documentId,
        fileName,
        sourceType,
        sourceUrl,
      },
    ],
  );
   await vectorStore.addDocuments(chunks);
 return {chunks:chunks.length};
}
