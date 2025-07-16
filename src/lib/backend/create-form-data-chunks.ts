import { PersonaCreationInputSchema } from "@/types/schemas";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import z from "zod";
import formDataToEssayPrompt from "./prompts/formdata-to-essay-prompt";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { parseLLMJsonResponse } from "@/utils/backend";
import { GEMINI_MODELS } from "@/utils/shared/CONST";

export default async function createFormDataChunks(
  data: z.infer<typeof PersonaCreationInputSchema>
) {
  const llm = new ChatGoogleGenerativeAI({
    apiKey: process.env.NEXT_GOOGLE_GEN_AI_API,
    model: GEMINI_MODELS.CHAT_MODEL,
  });
  const chain = await formDataToEssayPrompt
    .pipe(llm)
    .pipe(new StringOutputParser())
    .pipe(parseLLMJsonResponse)
    .invoke({ data: JSON.stringify(data) });

  return chain;
}
