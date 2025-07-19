import { FileUploadSchema } from "@/types/schemas";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import z from "zod";

interface FileContent {
  text: string;
  metadata: z.infer<typeof FileUploadSchema>["metadata"];
}

export default async function createChunksFromFilesContent(
  filesContent: FileContent[]
) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 75,
  });
  const chunks = filesContent.map(async ({ text, metadata }) => {
    const docs = await splitter.createDocuments([text]);
    return docs.map((doc) => ({ ...doc, metadata }));
  });
  const results = await Promise.allSettled(chunks);
  return results
    .filter((result) => result.status == "fulfilled")
    .map((item) => item.value);
}
