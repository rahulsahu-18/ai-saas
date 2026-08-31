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
}: {
  fileName: string;
  text: string;
  userId: string;
  documentId: string;
}) {
  const chunks = await splitter.createDocuments(
    [text],
    [
      {
        userId,
        documentId,
        fileName,
      },
    ],
  );
 
  // create vector embading

   await vectorStore.addDocuments(chunks);
 return {chunks:chunks.length};
}
