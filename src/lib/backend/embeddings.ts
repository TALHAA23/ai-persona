import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.NEXT_GOOGLE_GEN_AI_API,
  model: "text-embedding-004",
});

export default embeddings;
