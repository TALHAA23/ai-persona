import { Document } from "langchain/document";
export const combineDocs = (docs: Document[]) =>
  docs.map((doc) => doc.pageContent).join("\n");

export function parseLLMJsonResponse(rawResponse: string): any {
  const cleaned = rawResponse
    .trim()
    .replace(/^```(?:json)?\s*/i, "") // remove opening ``` or ```json
    .replace(/```$/, "") // remove closing ```
    .replace(/^\uFEFF/, ""); // remove invisible BOM character

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse LLM response:", err);
    throw new Error("Invalid JSON format from LLM.");
  }
}
