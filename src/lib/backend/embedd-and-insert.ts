import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { supabaseClient } from "./supabase-client";
import {
  ERROR_TAGS,
  GEMINI_MODELS,
  SUPABASE_TABLES,
} from "@/utils/shared/CONST";
import z from "zod";
import { ChunkDocumentsSchema } from "@/types/schemas";

export default async function embedAndInsert(
  docs: z.infer<typeof ChunkDocumentsSchema>
) {
  try {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.NEXT_GOOGLE_GEN_AI_API,
      model: GEMINI_MODELS.EMBEDDING_MODEL,
    });

    await SupabaseVectorStore.fromDocuments(docs, embeddings, {
      tableName: SUPABASE_TABLES.EMBEDDINGS,
      client: supabaseClient,
    });
  } catch (error) {
    throw new Error(ERROR_TAGS.VECTOR_DB_ERROR + (error as Error).message);
  }
}
