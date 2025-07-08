import { ChunkMetadataSchema } from "@/types/schemas";
import { ERROR_TAGS } from "@/utils/shared/CONST";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import z from "zod";

export default async function createChunks(
  texts: string,
  metadata: z.infer<typeof ChunkMetadataSchema>
) {
  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 750,
      chunkOverlap: 100,
    });

    const docs = await splitter.createDocuments([texts]);
    return docs.map((doc) => ({
      ...doc,
      metadata,
    }));
  } catch (error) {
    throw new Error(
      ERROR_TAGS.LANGCHAIN_CHUNKING_ERROR + (error as Error).message
    );
  }
}
