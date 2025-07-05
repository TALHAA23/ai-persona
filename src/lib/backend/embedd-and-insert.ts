import { Document } from "langchain/document";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { supabaseClient } from "./supabase-client";
import { ERROR_TAGS } from "@/utils/shared/error-tags";

export default async function embedAndInsert(docs: Document[]) {
  try {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.NEXT_GOOGLE_GEN_AI_API,
      model: "text-embedding-004",
    });

    await SupabaseVectorStore.fromDocuments(docs, embeddings, {
      tableName: "ai_persona",
      client: supabaseClient,
    });
  } catch (error) {
    throw new Error(ERROR_TAGS.VECTOR_DB_ERROR + (error as Error).message);
  }
}
