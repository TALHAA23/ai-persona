import { ERROR_TAGS } from "@/utils/shared/error-tags";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export default async function createChunks(texts: string) {
  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 750,
      chunkOverlap: 100,
    });

    const docs = await splitter.createDocuments([texts]);
    return docs;
  } catch (error) {
    throw new Error(
      ERROR_TAGS.LANGCHAIN_CHUNKING_ERROR + (error as Error).message
    );
  }
}
