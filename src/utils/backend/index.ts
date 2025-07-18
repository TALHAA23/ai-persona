import { Document } from "langchain/document";
import { ErrorTag } from "../shared/CONST";
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

export function resolvePersonaCreationData(data: FormData) {
  const metadata = JSON.parse(data.get("file_uploads_metadata") as string);
  const file_uploads = data.getAll("file_uploads").map((file, index) => {
    return { file, metadata: metadata[index] };
  });
  const base = Object.fromEntries(data.entries());
  return { ...base, file_uploads };
}

export function formatErrorMessage(tag: ErrorTag, error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : JSON.stringify(error);

  return `${tag} ${message}`;
}
