import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import embeddings from "./embeddings";
import { supabaseClient } from "./supabase-client";

const supabaseVectoreRetriever = new SupabaseVectorStore(embeddings, {
  client: supabaseClient,
  queryName: "match_ai_persona_documents",
  tableName: "ai_persona",
}).asRetriever();

export { supabaseVectoreRetriever };
