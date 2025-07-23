import { PersonaCreationInputSchema } from "@/types/schemas";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import z from "zod";
import formDataToEssayPrompt from "./prompts/formdata-to-essay-prompt";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { formatErrorMessage, parseLLMJsonResponse } from "@/utils/backend";
import { ERROR_TAGS, GEMINI_MODELS } from "@/utils/shared/CONST";

export default async function createFormDataChunks(
  formSections: z.infer<typeof PersonaCreationInputSchema>["form_sections"]
) {
  try {
    const llm = new ChatGoogleGenerativeAI({
      apiKey: process.env.NEXT_GOOGLE_GEN_AI_API,
      model: GEMINI_MODELS.CHAT_MODEL,
    });
    const chain = formDataToEssayPrompt
      .pipe(llm)
      .pipe(new StringOutputParser())
      .pipe(parseLLMJsonResponse);

    const invokers = formSections.map((formSection) => {
      return chain.invoke({ data: JSON.stringify(formSection) });
    });

    const results = await Promise.all(invokers);
    return results.flat();
  } catch (error) {
    throw Error(formatErrorMessage(ERROR_TAGS.LANGCHAIN_SPLIT_ERROR, error));
  }
}
